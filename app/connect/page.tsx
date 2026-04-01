'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { formatRelativeTime } from '@/lib/utils';
import { ExternalLink, RefreshCw, Unlink, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

type Provider = 'fitbit' | 'withings' | 'garmin' | 'huawei';

interface Device {
  id: string;
  provider: Provider;
  name: string;
  description: string;
  status: 'connected' | 'expired' | 'disconnected';
  connected_at: string | null;
  last_sync_at: string | null;
}

const DEVICE_META: Record<Provider, { name: string; description: string }> = {
  fitbit: {
    name: 'Fitbit',
    description: 'Steps, active minutes, sleep duration and consistency — synced weekly from Fitbit cloud.',
  },
  withings: {
    name: 'Withings',
    description: 'Steps, sleep duration and active sessions — synced weekly from Withings Health Mate.',
  },
  garmin: {
    name: 'Garmin',
    description: 'Steps, active minutes, sleep and activity sessions — pushed from Garmin Connect cloud.',
  },
  huawei: {
    name: 'Huawei Health',
    description: 'Steps, sleep duration and activity sessions — synced weekly from Huawei Health Kit.',
  },
};

const DEFAULT_DEVICES: Device[] = [
  { id: 'fitbit',   provider: 'fitbit',   ...DEVICE_META.fitbit,   status: 'disconnected', connected_at: null, last_sync_at: null },
  { id: 'withings', provider: 'withings', ...DEVICE_META.withings, status: 'disconnected', connected_at: null, last_sync_at: null },
  { id: 'garmin',   provider: 'garmin',   ...DEVICE_META.garmin,   status: 'disconnected', connected_at: null, last_sync_at: null },
  { id: 'huawei',   provider: 'huawei',   ...DEVICE_META.huawei,   status: 'disconnected', connected_at: null, last_sync_at: null },
];

function OAuthResultHandler({ onSuccess, onError }: {
  onSuccess: (provider: string) => void;
  onError:   (error: string)    => void;
}) {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const handled      = React.useRef(false);

  useEffect(() => {
    if (handled.current) return;
    const success = searchParams.get('success');
    const error   = searchParams.get('error');
    if (success || error) {
      handled.current = true;
      router.replace('/connect');
      if (success) onSuccess(success);
      if (error)   onError(error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function ConnectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast  = useToast();

  const [devices,      setDevices]      = useState<Device[]>(DEFAULT_DEVICES);
  const [loadingData,  setLoadingData]  = useState(true);
  const [connecting,   setConnecting]   = useState<string | null>(null);
  const [disconnectId, setDisconnectId] = useState<string | null>(null);
  const [resyncing,    setResyncing]    = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
  }, [user, loading, router]);

  const loadConnections = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    const { data } = await supabase
      .from('wearable_connections')
      .select('provider, status, created_at, last_sync_at')
      .eq('user_id', user.id);

    if (data) {
      setDevices(DEFAULT_DEVICES.map((d) => {
        const row = data.find((r: { provider: string }) => r.provider === d.provider);
        if (!row) return d;
        return {
          ...d,
          status:       row.status as Device['status'],
          connected_at: row.created_at,
          last_sync_at: row.last_sync_at,
        };
      }));
    }
    setLoadingData(false);
  }, [user]);

  useEffect(() => {
    if (user) loadConnections();
  }, [user, loadConnections]);

  const handleOAuthSuccess = useCallback((provider: string) => {
    const name = DEVICE_META[provider as Provider]?.name ?? provider;
    toast.success(`${name} connected`, 'Your wearable has been linked and will sync weekly.');
    loadConnections();
  }, [toast, loadConnections]);

  const handleOAuthError = useCallback((error: string) => {
    const messages: Record<string, string> = {
      fitbit_denied:         'Fitbit authorisation was cancelled.',
      withings_denied:       'Withings authorisation was cancelled.',
      garmin_denied:         'Garmin authorisation was cancelled.',
      huawei_denied:         'Huawei authorisation was cancelled.',
      fitbit_token_failed:   'Fitbit token exchange failed. Please try again.',
      withings_token_failed: 'Withings token exchange failed. Please try again.',
      garmin_token_failed:   'Garmin token exchange failed. Please try again.',
      huawei_token_failed:   'Huawei token exchange failed. Please try again.',
      huawei_token_empty:    'Huawei returned an empty token. Please try again.',
      db_error:              'Connection could not be saved. Please try again.',
      invalid_state:         'Invalid OAuth state. Please try again.',
    };
    toast.error('Connection failed', messages[error] ?? 'An unexpected error occurred.');
  }, [toast]);

  if (loading || !user) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleConnect = (device: Device) => {
    setConnecting(device.id);
    window.location.href = `/api/oauth/${device.provider}?user_id=${user.id}`;
  };

  const handleDisconnect = async () => {
    if (!disconnectId || !user) return;
    const { error } = await supabase
      .from('wearable_connections')
      .update({ status: 'disconnected', access_token_enc: null, refresh_token_enc: null })
      .eq('user_id', user.id)
      .eq('provider', disconnectId);
    if (error) {
      toast.error('Disconnect failed', error.message);
    } else {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === disconnectId
            ? { ...d, status: 'disconnected', connected_at: null, last_sync_at: null }
            : d
        )
      );
      toast.success('Device disconnected', 'Your wearable connection has been removed.');
    }
    setDisconnectId(null);
  };

  const handleResync = async (device: Device) => {
    if (!user) return;
    setResyncing(device.id);
    window.location.href = `/api/oauth/${device.provider}?user_id=${user.id}`;
  };

  const statusConfig = {
    connected:    { label: 'Connected',    badge: 'badge-success', icon: CheckCircle2, iconClass: 'text-emerald-400' },
    expired:      { label: 'Token Expired',badge: 'badge-warning', icon: AlertCircle,  iconClass: 'text-amber-400'  },
    disconnected: { label: 'Not Connected',badge: 'badge-error',   icon: AlertCircle,  iconClass: 'text-slate-600'  },
  };

  return (
    <div className="page-bg min-h-screen flex">
      <Suspense fallback={null}>
        <OAuthResultHandler onSuccess={handleOAuthSuccess} onError={handleOAuthError} />
      </Suspense>
      <Sidebar variant="user" />

      <main className="flex-1 min-w-0 overflow-hidden">
        {/* ── Page header ── */}
        <div className="px-6 lg:px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-100" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
                Connected Devices
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage your wearable OAuth connections · Data pulled automatically each week
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: 'rgba(37,107,151,0.06)', borderColor: 'rgba(37,107,151,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#256B97' }} />
              <span className="text-xs" style={{ color: '#256B97', fontFamily: "'Space Grotesk', sans-serif" }}>Cloud-to-Cloud</span>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-7 space-y-7">

          {/* ── Device cards ── */}
          <div className="grid lg:grid-cols-2 gap-5">
            {devices.map((device) => {
              const cfg    = statusConfig[device.status];
              const Icon   = cfg.icon;
              const isBusy = connecting === device.id || resyncing === device.id;

              return (
                <div
                  key={device.id}
                  className="glass-card rounded-2xl overflow-hidden relative"
                  style={{
                    borderColor: device.status === 'connected'
                      ? 'rgba(200,150,100,0.18)'
                      : device.status === 'expired'
                      ? 'rgba(235,114,27,0.18)'
                      : 'rgba(35,62,92,0.45)',
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{
                      background: device.status === 'connected'
                        ? 'linear-gradient(90deg, transparent, #C89664, #EB721B, transparent)'
                        : device.status === 'expired'
                        ? 'linear-gradient(90deg, transparent, #EB721B, transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(35,62,92,0.6), transparent)',
                    }}
                  />

                  {/* Card header */}
                  <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0"
                        style={{
                          background: device.status === 'connected' ? 'rgba(200,150,100,0.08)' : 'rgba(35,62,92,0.4)',
                          borderColor: device.status === 'connected' ? 'rgba(200,150,100,0.2)' : 'rgba(35,62,92,0.6)',
                        }}
                      >
                        <Icon size={18} className={cfg.iconClass} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-100 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {device.name}
                        </h3>
                        <span className={`${cfg.badge} mt-1`}>{cfg.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="px-6 pb-5">
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {device.description}
                    </p>
                  </div>

                  {/* Metadata grid (connected only) */}
                  {device.status === 'connected' && (
                    <div className="grid grid-cols-2 gap-px mx-6 mb-5" style={{ background: 'rgba(200,150,100,0.06)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                      <div className="p-3.5" style={{ background: 'rgba(1,14,34,0.35)' }}>
                        <p className="text-[10px] uppercase tracking-wider font-medium mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(200,150,100,0.5)' }}>Connected</p>
                        <p className="text-sm font-medium" style={{ color: '#C89664' }}>{device.connected_at ? formatRelativeTime(device.connected_at) : '—'}</p>
                      </div>
                      <div className="p-3.5" style={{ background: 'rgba(1,14,34,0.35)' }}>
                        <p className="text-[10px] uppercase tracking-wider font-medium mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(200,150,100,0.5)' }}>Last Sync</p>
                        <p className="text-sm font-medium" style={{ color: '#C89664' }}>{device.last_sync_at ? formatRelativeTime(device.last_sync_at) : 'Not yet'}</p>
                      </div>
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex items-center gap-2 px-6 pb-6 flex-wrap">
                    {device.status === 'disconnected' && (
                      <button onClick={() => handleConnect(device)} disabled={isBusy} className="btn-primary text-sm px-5 py-2.5">
                        {isBusy ? <Spinner size="sm" /> : <><ExternalLink size={13} />Connect via OAuth</>}
                      </button>
                    )}
                    {device.status === 'expired' && (
                      <button onClick={() => handleResync(device)} disabled={isBusy} className="btn-primary text-sm px-5 py-2.5">
                        {isBusy ? <Spinner size="sm" /> : <><RefreshCw size={13} />Re-authenticate</>}
                      </button>
                    )}
                    {device.status === 'connected' && (
                      <>
                        <button onClick={() => handleResync(device)} disabled={isBusy} className="btn-secondary text-sm px-5 py-2.5">
                          {resyncing === device.id ? <Spinner size="sm" /> : <><RefreshCw size={13} />Refresh Token</>}
                        </button>
                        <button onClick={() => setDisconnectId(device.id)} className="btn-danger text-sm px-5 py-2.5">
                          <Unlink size={13} />Disconnect
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Data collected ── */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(200,150,100,0.08)' }}>
              <h2 className="font-semibold text-slate-100 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Data Collected Per Sync</h2>
              <p className="text-xs text-slate-600 mt-0.5">Strictly behavioural — no physiological data ever requested</p>
            </div>
            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  'Daily step count',
                  'Active minutes per day',
                  'Number of active days',
                  'Sleep duration (hours)',
                  'Sleep consistency score',
                  'Activity session count',
                  'Activity session duration',
                ].map((m) => (
                  <div key={m} className="flex items-center gap-3 py-2.5 px-3 rounded-lg border" style={{ background: 'rgba(1,14,34,0.25)', borderColor: 'rgba(200,150,100,0.07)' }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(235,114,27,0.1)', border: '1px solid rgba(235,114,27,0.18)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EB721B]" />
                    </div>
                    <span className="text-sm text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>{m}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex items-start gap-2.5" style={{ borderColor: 'rgba(35,62,92,0.25)' }}>
                <Clock size={13} className="text-slate-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  No heart rate, HRV, SpO₂, stress score, recovery, VO₂ Max, blood pressure, or any physiological data is ever collected or stored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Disconnect confirmation modal */}
      <Modal
        open={!!disconnectId}
        onClose={() => setDisconnectId(null)}
        title="Disconnect device"
        description="This will remove the OAuth connection. Weekly sync will stop until you reconnect. Your historical data is not deleted."
      >
        <div className="flex gap-3 mt-6">
          <button onClick={() => setDisconnectId(null)} className="btn-secondary flex-1 py-2.5">
            Cancel
          </button>
          <button onClick={handleDisconnect} className="btn-danger flex-1 py-2.5">
            Disconnect
          </button>
        </div>
      </Modal>
    </div>
  );
}

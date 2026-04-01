import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center gap-2.5 mb-12 justify-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#EB721B] to-[#C89664] flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-sm bg-white/90" />
          </div>
          <span className="font-bold text-slate-100 text-base tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            PulseTrack
          </span>
        </div>

        <div
          className="text-8xl font-black mb-6 select-none"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            background: 'linear-gradient(135deg, rgba(235,114,27,0.15), rgba(35,62,92,0.4))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </div>

        <h1 className="text-xl font-semibold text-slate-100 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Page not found
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary text-sm px-6 py-2.5">
            Back to Home
          </Link>
          <Link href="/dashboard" className="btn-secondary text-sm px-6 py-2.5">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

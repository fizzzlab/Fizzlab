import {
  Footprints, Flame, Timer, Moon, BedDouble, Dumbbell, Scale,
  Sprout, Compass, Anvil, Trophy, Crown,
  Egg, Box, Sword, PersonStanding, Sparkles,
  Rocket, Waves, Cog, Dog, Hand,
  CloudMoon, Star, Home, Gem, Bird,
  Lock, Anchor, Wand2,
  Target, Zap,
  CalendarDays,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps emoji strings from the database to Lucide icons.
 * Each emoji gets a unique, contextually relevant icon.
 */
const EMOJI_ICON_MAP: Record<string, LucideIcon> = {
  // ── Goal emojis ──
  '🚶': Footprints,       // Step Explorer
  '🔥': Flame,            // Active Days Warrior
  '⏱':  Timer,            // Active Minutes Machine
  '😴': Moon,             // Sleep Builder
  '🧘': BedDouble,        // Sleep Routine Master
  '🏋': Dumbbell,         // Session Streak
  '🌈': Scale,            // Balanced Lifestyle

  // ── Steps badges ──
  '🌱': Sprout,           // Step Sprout
  '🧭': Compass,          // Step Scout / Routine Finder
  '🥾': Anvil,            // Step Strider
  '🏆': Trophy,           // Step Champion
  '🐉': Sparkles,         // Step Legend

  // ── Active Days badges ──
  '🐣': Egg,              // Routine Rookie
  '🧱': Box,            // Routine Builder / Session Builder
  '⚔':  Sword,            // Weekly Warrior
  '🦸': PersonStanding,   // Habit Hero
  '👑': Crown,            // Consistency King/Queen / Crown

  // ── Active Minutes badges ──
  '🚀': Rocket,           // Move Starter
  '🌊': Waves,            // Momentum Maker
  '⚙':  Cog,              // Consistency Engine
  '🐺': Dog,              // Endurance Mode
  '🦾': Hand,             // Iron Routine

  // ── Sleep Duration badges ──
  '🌙': CloudMoon,        // Sleep Starter
  '🧸': Star,        // Sleep Builder
  '🏡': Home,             // Sleep Routine
  '💎': Gem,              // Sleep Strong
  '🦉': Bird,             // Sleep Legend

  // ── Sleep Consistency badges ──
  '🔒': Lock,             // Routine Keeper
  '⚓': Anchor,           // Routine Anchor
  '🧙': Wand2,            // Routine Master

  // ── Session badges ──
  '🎯': Target,           // Session Starter
  '💪': Zap,              // Session Strong
  '🐯': Flame,            // Session Legend (use Flame variant)

  // ── Balanced badges ──
  '🗓': CalendarDays,     // Balanced Month
};

/**
 * Renders an icon for a given emoji string.
 * Falls back to a colored dot if no mapping exists.
 */
export default function MetricIcon({
  emoji,
  size = 18,
  className = '',
  color,
}: {
  emoji: string | null | undefined;
  size?: number;
  className?: string;
  color?: string;
}) {
  if (!emoji) return null;

  const Icon = EMOJI_ICON_MAP[emoji.trim()];

  if (Icon) {
    return <Icon size={size} className={className} style={color ? { color } : undefined} />;
  }

  // Fallback: small colored circle
  return (
    <div
      className={`rounded-full flex-shrink-0 ${className}`}
      style={{ width: size * 0.5, height: size * 0.5, background: color ?? '#C89664' }}
    />
  );
}

/**
 * Get the raw Lucide icon component for an emoji (for use in non-JSX contexts).
 */
export function getIconForEmoji(emoji: string | null | undefined): LucideIcon | null {
  if (!emoji) return null;
  return EMOJI_ICON_MAP[emoji.trim()] ?? null;
}

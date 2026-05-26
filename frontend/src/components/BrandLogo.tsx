'use client';

import Image from 'next/image';

interface BrandLogoProps {
  variant?: 'default' | 'admin' | 'student';
  compact?: boolean;
}

const variantStyles = {
  default: {
    glow: 'from-red-50 via-white to-rose-50',
    ring: 'ring-red-100',
    title: 'text-[#8F1028]',
    subtitle: 'text-slate-500',
  },
  admin: {
    glow: 'from-orange-50 via-white to-amber-50',
    ring: 'ring-orange-100',
    title: 'text-orange-700',
    subtitle: 'text-slate-500',
  },
  student: {
    glow: 'from-emerald-50 via-white to-teal-50',
    ring: 'ring-emerald-100',
    title: 'text-emerald-700',
    subtitle: 'text-slate-500',
  },
};

export default function BrandLogo({ variant = 'default', compact = false }: BrandLogoProps) {
  const styles = variantStyles[variant];

  return (
    <div className="flex items-center gap-3">
      <div className={`rounded-2xl bg-linear-to-br ${styles.glow} p-2.5 shadow-sm ring-1 ${styles.ring}`}>
        <Image
          src="/logonoword.png"
          alt="Shelfio icon"
          width={compact ? 34 : 40}
          height={compact ? 34 : 40}
          priority
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
      <div className="min-w-0">
        <div className={`font-black tracking-tight leading-none ${compact ? 'text-xl' : 'text-2xl'} ${styles.title}`}>
          Shelfio
        </div>
        <div className={`uppercase tracking-[0.28em] leading-none ${compact ? 'text-[9px]' : 'text-[10px]'} ${styles.subtitle}`}>
          Smart Library
        </div>
      </div>
    </div>
  );
}
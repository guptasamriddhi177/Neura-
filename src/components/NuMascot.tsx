import React from 'react';

export type NuMood = 'happy' | 'thinking' | 'waving' | 'cheering' | 'reading';

interface NuMascotProps {
  mood?: NuMood;
  className?: string;
  variant?: 'chalk' | 'ink';
}

export const NuMascot: React.FC<NuMascotProps> = ({
  mood = 'happy',
  className = 'w-20 h-20',
  variant = 'chalk',
}) => {
  const strokeColor = variant === 'chalk' ? '#FFF8EC' : '#14342B';
  const fillInner = variant === 'chalk' ? '#14342B' : '#FFF8EC';

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Chalk body */}
      <path
        d="M32 42C32 25 44 18 60 18C76 18 88 25 88 42V76C88 94 76 104 60 104C44 104 32 94 32 76V42Z"
        fill={fillInner}
        stroke={strokeColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={variant === 'chalk' ? '14 3' : undefined}
      />
      {/* Owl ear tufts */}
      <path
        d="M34 34L24 20L44 26"
        stroke={strokeColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M86 34L96 20L76 26"
        stroke={strokeColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Waving / cheering wing */}
      {mood === 'waving' || mood === 'cheering' ? (
        <path
          d="M88 60C98 54 106 42 104 32C100 32 94 42 88 48"
          stroke="#FFC83D"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M88 54C95 62 94 78 86 84"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      {mood === 'cheering' ? (
        <path
          d="M32 60C22 54 14 42 16 32C20 32 26 42 32 48"
          stroke="#FFC83D"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M32 54C25 62 26 78 34 84"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {/* Big expressive eyes */}
      <circle cx="47" cy="48" r="10.5" stroke={strokeColor} strokeWidth="3" />
      <circle cx="73" cy="48" r="10.5" stroke={strokeColor} strokeWidth="3" />
      <circle
        cx={mood === 'thinking' ? '49' : '48'}
        cy={mood === 'thinking' ? '45' : '48'}
        r="3.8"
        fill="#FFC83D"
      />
      <circle
        cx={mood === 'thinking' ? '75' : '74'}
        cy={mood === 'thinking' ? '45' : '48'}
        r="3.8"
        fill="#FFC83D"
      />

      {/* Beak */}
      <path d="M55 57L60 65L65 57Z" fill="#FFC83D" />

      {/* Belly feathers / reading book */}
      {mood === 'reading' ? (
        <path
          d="M42 78L60 84L78 78V94L60 99L42 94V78Z"
          stroke="#5CB8FF"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M45 77C50 83 70 83 75 77"
          stroke="#5CB8FF"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {/* Chalk sparkle stars for cheering/waving */}
      {(mood === 'cheering' || mood === 'waving') && (
        <>
          <path d="M18 18L20 12L22 18L28 20L22 22L20 28L18 22L12 20Z" fill="#FFC83D" />
          <path d="M104 16L105.5 11.5L107 16L111.5 17.5L107 19L105.5 23.5L104 19L99.5 17.5Z" fill="#5CB8FF" />
        </>
      )}

      {/* Feet */}
      <path d="M46 104V111M42 111H50" stroke="#FFC83D" strokeWidth="3" strokeLinecap="round" />
      <path d="M74 104V111M70 111H78" stroke="#FFC83D" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export const StepOneDoodle: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 110 90" fill="none" className={className} aria-hidden="true">
    <rect x="10" y="14" width="90" height="62" rx="12" fill="#14342B" stroke="#FFF8EC" strokeWidth="2.5" strokeDasharray="6 4" />
    <circle cx="32" cy="39" r="10" stroke="#FFC83D" strokeWidth="2.5" />
    <path d="M22 59C24 52 40 52 42 59" stroke="#FFC83D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M52 33H86M52 45H78M52 57H70" stroke="#5CB8FF" strokeWidth="3" strokeLinecap="round" />
    <circle cx="84" cy="57" r="4" fill="#FF6B57" />
  </svg>
);

export const StepTwoDoodle: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 110 90" fill="none" className={className} aria-hidden="true">
    <rect x="10" y="14" width="90" height="62" rx="12" fill="#14342B" stroke="#FFF8EC" strokeWidth="2.5" strokeDasharray="6 4" />
    <path d="M24 38C24 30 33 26 42 26H68C77 26 86 30 86 38C86 46 77 50 68 50H42L28 60L32 49C27 47 24 43 24 38Z" stroke="#FFF8EC" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M38 38H72" stroke="#FFC83D" strokeWidth="3" strokeLinecap="round" />
    <circle cx="78" cy="60" r="6" stroke="#FF6B57" strokeWidth="2.5" />
    <path d="M75 60L77.5 62.5L82 57.5" stroke="#5CB8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StepThreeDoodle: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 110 90" fill="none" className={className} aria-hidden="true">
    <rect x="10" y="14" width="90" height="62" rx="12" fill="#14342B" stroke="#FFF8EC" strokeWidth="2.5" strokeDasharray="6 4" />
    <circle cx="34" cy="48" r="11" stroke="#FFC83D" strokeWidth="2.5" />
    <circle cx="66" cy="48" r="11" stroke="#5CB8FF" strokeWidth="2.5" />
    <path d="M34 37V59M23 48H45" stroke="#FFC83D" strokeWidth="2" />
    <path d="M66 37V59M55 48H77" stroke="#5CB8FF" strokeWidth="2" />
    <path d="M84 26L86 21L88 26L93 28L88 30L86 35L84 30L79 28Z" fill="#FFC83D" />
  </svg>
);

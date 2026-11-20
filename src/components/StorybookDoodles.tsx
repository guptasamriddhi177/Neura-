import React from 'react';

export const ScallopedEdge: React.FC<{
  fill?: string;
  className?: string;
  flip?: boolean;
}> = ({ fill = '#FFFDF8', className = 'w-full h-5 sm:h-7', flip = false }) => (
  <svg
    viewBox="0 0 1200 32"
    preserveAspectRatio="none"
    className={`${className} ${flip ? 'rotate-180' : ''}`}
    aria-hidden="true"
  >
    <path
      d="M0,0 L1200,0 L1200,12 C1175,28 1145,28 1120,12 C1095,28 1065,28 1040,12 C1015,28 985,28 960,12 C935,28 905,28 880,12 C855,28 825,28 800,12 C775,28 745,28 720,12 C695,28 665,28 640,12 C615,28 585,28 560,12 C535,28 505,28 480,12 C455,28 425,28 400,12 C375,28 345,28 320,12 C295,28 265,28 240,12 C215,28 185,28 160,12 C135,28 105,28 80,12 C55,28 25,28 0,12 Z"
      fill={fill}
    />
  </svg>
);

export const StorybookCloud: React.FC<{ className?: string }> = ({
  className = 'w-32 h-16',
}) => (
  <svg viewBox="0 0 160 80" fill="none" className={className} aria-hidden="true">
    <path
      d="M28 66C14 66 4 56 4 44C4 33 12 24 23 23C27 11 39 4 53 4C67 4 79 11 84 22C89 18 96 16 104 16C119 16 131 27 132 41C144 42 154 51 154 62C154 65 151 66 146 66H28Z"
      fill="#FFFDF8"
    />
  </svg>
);

export const CrayonStar: React.FC<{
  color?: string;
  className?: string;
}> = ({ color = '#FFC83D', className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M24 4L29.2 16.5L42.8 17.6L32.4 26.6L35.6 40L24 32.8L12.4 40L15.6 26.6L5.2 17.6L18.8 16.5L24 4Z"
      fill={color}
      stroke="#14342B"
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const RedPushpin: React.FC<{ className?: string }> = ({
  className = 'w-8 h-8',
}) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <path d="M19 25L15 37L22 27" fill="#D4DBE2" stroke="#14342B" strokeWidth="2" strokeLinejoin="round" />
    <ellipse cx="22" cy="18" rx="9" ry="5.5" transform="rotate(18 22 18)" fill="#FF6B57" stroke="#14342B" strokeWidth="2.4" />
    <path d="M18 14L20 7C23 6 28 7 30 10L26 17" fill="#FF6B57" stroke="#14342B" strokeWidth="2.4" strokeLinejoin="round" />
    <ellipse cx="25" cy="8.5" rx="6" ry="3.5" transform="rotate(18 25 8.5)" fill="#FF8978" stroke="#14342B" strokeWidth="2.2" />
  </svg>
);

export const SketchSmiley: React.FC<{
  color?: string;
  className?: string;
}> = ({ color = '#FFC83D', className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true">
    <circle cx="22" cy="22" r="18" fill={color} stroke="#14342B" strokeWidth="2.6" />
    <circle cx="16" cy="17" r="2.2" fill="#14342B" />
    <circle cx="28" cy="17" r="2.2" fill="#14342B" />
    <path
      d="M14 25C16.5 29.5 27.5 29.5 30 25"
      stroke="#14342B"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);

export const StorybookMeadowBackdrop: React.FC<{ className?: string }> = ({
  className = 'w-full h-36 sm:h-48',
}) => (
  <svg
    viewBox="0 0 1440 220"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Distant rolling hill */}
    <path
      d="M0 130C240 60 440 85 690 120C950 158 1190 55 1440 95V220H0V130Z"
      fill="#B5CE74"
      stroke="#14342B"
      strokeWidth="3"
    />
    {/* Cozy storybook cottage on right hill */}
    <g transform="translate(1155, 34)">
      <rect x="14" y="34" width="66" height="44" rx="4" fill="#FFFDF8" stroke="#14342B" strokeWidth="2.6" />
      <path d="M6 36L47 6L88 36H6Z" fill="#FF6B57" stroke="#14342B" strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="38" y="52" width="18" height="26" rx="3" fill="#FFC83D" stroke="#14342B" strokeWidth="2.4" />
      <rect x="20" y="46" width="11" height="11" rx="2" fill="#5CB8FF" stroke="#14342B" strokeWidth="2" />
      <rect x="63" y="46" width="11" height="11" rx="2" fill="#5CB8FF" stroke="#14342B" strokeWidth="2" />
      {/* Little tree */}
      <rect x="102" y="50" width="7" height="26" fill="#7B4B2A" stroke="#14342B" strokeWidth="2" />
      <circle cx="105.5" cy="40" r="16" fill="#8FB94A" stroke="#14342B" strokeWidth="2.4" />
    </g>

    {/* Foreground meadow hill */}
    <path
      d="M0 105C220 155 430 165 690 120C930 80 1210 135 1440 160V220H0V105Z"
      fill="#CFE09B"
      stroke="#14342B"
      strokeWidth="3"
    />

    {/* Cute spotted mushrooms on left */}
    <g transform="translate(135, 114)">
      <path d="M12 22C12 22 10 34 15 36C20 38 24 35 23 22" fill="#FFFDF8" stroke="#14342B" strokeWidth="2.4" />
      <path d="M2 23C2 10 10 4 18 4C26 4 34 10 34 23H2Z" fill="#FF6B57" stroke="#14342B" strokeWidth="2.4" />
      <circle cx="12" cy="14" r="3" fill="#FFFDF8" />
      <circle cx="24" cy="16" r="2.5" fill="#FFFDF8" />
      <circle cx="18" cy="9" r="2" fill="#FFFDF8" />
    </g>

    {/* Tiny grass tufts & wildflowers */}
    <path d="M285 162L282 151M289 162L290 148M293 162L298 152" stroke="#14342B" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M885 138L882 127M889 138L890 124M893 138L898 128" stroke="#14342B" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="445" cy="175" r="5" fill="#FFC83D" stroke="#14342B" strokeWidth="2" />
    <circle cx="965" cy="145" r="5" fill="#FFFDF8" stroke="#14342B" strokeWidth="2" />
  </svg>
);

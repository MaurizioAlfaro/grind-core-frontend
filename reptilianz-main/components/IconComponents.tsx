import React from "react";

export const PhantomIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    className={className}
    viewBox="0 0 288 288"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="144" cy="144" r="144" fill="url(#paint0_linear_1_2)" />
    <path
      d="M143.918 240.859C114.34 240.859 89.2617 228.05 73.6339 207.13C73.2266 206.593 72.8867 206.01 72.6339 205.38L108.318 153.03C108.43 152.843 108.586 152.68 108.773 152.56C109.18 152.288 109.734 152.288 110.141 152.56L143.918 175.71L177.695 152.56C178.102 152.288 178.656 152.288 179.063 152.56C179.25 152.68 179.406 152.843 179.518 153.03L215.201 205.38C214.948 206.01 214.608 206.593 214.201 207.13C198.573 228.05 173.495 240.859 143.918 240.859Z"
      fill="white"
    />
    <path
      d="M143.918 47C160.895 47 176.711 53.488 189.102 64.63L143.918 116.89L98.7339 64.63C111.125 53.488 126.941 47 143.918 47Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1_2"
        x1="0"
        y1="0"
        x2="288"
        y2="288"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5344C2" />
        <stop offset="1" stopColor="#9945FF" />
      </linearGradient>
    </defs>
  </svg>
);

export const SolanaIcon: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.00494 7.37885L14.7175 1.49329C15.5401 1.03606 16.5184 1.63943 16.5184 2.58556V9.45267C16.5184 10.0248 16.142 10.548 15.5801 10.743L4.86759 14.6285C4.04501 14.922 3.2292 14.281 3.2292 13.3711V8.46824C3.2292 7.93245 3.57014 7.4457 4.00494 7.37885Z"
      fill="url(#sol-1)"
    ></path>
    <path
      d="M19.9951 16.6212L9.28251 22.5067C8.45992 22.9639 7.48163 22.3606 7.48163 21.4144V14.5473C7.48163 13.9752 7.85801 13.452 8.41993 13.257L19.1325 9.37152C19.955 9.07797 20.7708 9.71902 20.7708 10.6289V15.5318C20.7708 16.0676 20.4299 16.5543 19.9951 16.6212Z"
      fill="url(#sol-2)"
    ></path>
    <path
      d="M3.92956 9.3808L8.52909 12.1812C9.09101 12.5097 9.80807 12.1812 9.94098 11.5161L11.5367 4.97828C11.7051 4.2422 11.1432 3.54058 10.4616 3.54058L5.3562 3.86906C4.56908 3.93593 4.00716 4.77038 4.2831 5.46893L5.4433 8.33615C5.57622 8.66463 5.39176 9.02654 5.06328 9.19578L3.92956 9.82736V9.3808Z"
      fill="url(#sol-3)"
      opacity="0.65"
    ></path>
    <defs>
      <linearGradient
        id="sol-1"
        x1="16.5184"
        y1="2.58556"
        x2="3.2292"
        y2="13.3711"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#9945FF"></stop>
        <stop offset="1" stop-color="#14F195"></stop>
      </linearGradient>
      <linearGradient
        id="sol-2"
        x1="7.48163"
        y1="21.4144"
        x2="20.7708"
        y2="10.6289"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#9945FF"></stop>
        <stop offset="1" stop-color="#14F195"></stop>
      </linearGradient>
      <linearGradient
        id="sol-3"
        x1="11.7051"
        y1="4.2422"
        x2="4.00716"
        y2="4.77038"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#9945FF"></stop>
        <stop offset="1" stop-color="#14F195"></stop>
      </linearGradient>
    </defs>
  </svg>
);

export const LinkIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
    />
  </svg>
);


import React from 'react';

export const PhantomIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg width="24" height="24" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25.654 34.22H15.051C8.647 34.22 4.053 30.22 3.453 23.518L3.052 18.716C2.652 14.114 5.35 10.012 9.65 8.111L10.35 7.81C15.85 5.309 23.754 6.209 28.054 10.212L28.754 10.812C32.154 13.713 33.355 18.216 31.555 22.318L31.155 23.118C30.655 24.119 30.255 25.019 29.955 25.919C29.255 28.12 29.855 30.622 31.455 32.423L31.855 32.823C32.955 34.024 32.455 35.925 31.055 36.425L30.055 36.825C28.455 37.426 26.654 36.525 25.954 34.924L25.654 34.22Z" fill="url(#paint0_linear_1_2)"></path>
    <path d="M37.95 18.316C37.95 18.316 34.053 14.014 30.255 15.815L23.954 11.012L28.754 6.609C30.455 5.209 30.255 2.608 28.354 1.507L27.254 0.907C25.354 -0.293 22.953 0.107 21.753 1.808L15.352 10.612L19.253 16.515L24.054 12.813L27.454 17.516C28.254 18.516 29.655 18.616 30.555 17.916L35.252 14.214C35.252 14.214 39.05 17.015 37.95 18.316Z" fill="url(#paint1_linear_1_2)"></path>
    <defs>
        <linearGradient id="paint0_linear_1_2" x1="17.777" y1="5.188" x2="17.777" y2="36.825" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5340FF"></stop>
            <stop offset="1" stopColor="#A451FF"></stop>
        </linearGradient>
        <linearGradient id="paint1_linear_1_2" x1="26.791" y1="0.323" x2="26.791" y2="18.578" gradientUnits="userSpaceOnUse">
            <stop stopColor="white"></stop>
            <stop offset="1" stopColor="#ADADAD"></stop>
        </linearGradient>
    </defs>
  </svg>
);

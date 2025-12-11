import React from 'react';

export const Mascot: React.FC<{ mood?: 'happy' | 'thinking' | 'shocked' }> = ({ mood = 'happy' }) => {
  return (
    <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transform hover:scale-105 transition-transform duration-300">
       {/* Body */}
      <circle cx="100" cy="110" r="70" fill="#FFD1DC" />
      <circle cx="100" cy="110" r="70" stroke="#FFB7C5" strokeWidth="4" />
      
      {/* Ears */}
      <path d="M50 60 L70 30 L90 55" fill="#FFD1DC" stroke="#FFB7C5" strokeWidth="4" strokeLinejoin="round"/>
      <path d="M150 60 L130 30 L110 55" fill="#FFD1DC" stroke="#FFB7C5" strokeWidth="4" strokeLinejoin="round"/>
      
      {/* Eyes */}
      {mood === 'happy' && (
        <>
          <circle cx="75" cy="100" r="6" fill="#5D5D5D" />
          <circle cx="125" cy="100" r="6" fill="#5D5D5D" />
           {/* Cheeks */}
          <circle cx="65" cy="115" r="8" fill="#FFB7C5" opacity="0.6" />
          <circle cx="135" cy="115" r="8" fill="#FFB7C5" opacity="0.6" />
        </>
      )}

      {mood === 'thinking' && (
        <>
          <circle cx="75" cy="100" r="6" fill="#5D5D5D" />
          <path d="M120 95 L130 105 L140 95" stroke="#5D5D5D" strokeWidth="3" fill="none" />
           {/* Cheeks */}
          <circle cx="65" cy="115" r="8" fill="#FFB7C5" opacity="0.6" />
        </>
      )}

      {mood === 'shocked' && (
         <>
          <circle cx="75" cy="100" r="8" fill="none" stroke="#5D5D5D" strokeWidth="2"/>
          <circle cx="125" cy="100" r="8" fill="none" stroke="#5D5D5D" strokeWidth="2"/>
        </>
      )}

      {/* Snout */}
      <ellipse cx="100" cy="120" rx="20" ry="14" fill="#FFF" />
      <circle cx="94" cy="120" r="3" fill="#FFB7C5" />
      <circle cx="106" cy="120" r="3" fill="#FFB7C5" />

      {/* Mouth */}
      {mood === 'happy' && <path d="M90 140 Q100 150 110 140" stroke="#5D5D5D" strokeWidth="3" strokeLinecap="round" fill="none"/>}
      {mood === 'thinking' && <path d="M95 140 L105 140" stroke="#5D5D5D" strokeWidth="3" strokeLinecap="round" fill="none"/>}
      {mood === 'shocked' && <circle cx="100" cy="145" r="5" fill="#5D5D5D" />}

    </svg>
  );
};
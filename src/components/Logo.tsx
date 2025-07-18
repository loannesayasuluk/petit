import React from 'react';
import { Group, Text } from '@mantine/core';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  onClick?: () => void;
}

export function Logo({ size = 'md', color = '#f17258', onClick }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 32, fontSize: '1.2rem', iconSize: 24 },
    md: { width: 140, height: 36, fontSize: '1.8rem', iconSize: 28 },
    lg: { width: 180, height: 48, fontSize: '2.4rem', iconSize: 36 }
  };

  const currentSize = sizes[size];

  return (
    <Group 
      gap="xs" 
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        userSelect: 'none'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {/* SVG 아이콘 */}
      <svg 
        width={currentSize.iconSize} 
        height={currentSize.iconSize} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 배경 원 */}
        <circle cx="16" cy="16" r="14" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2"/>
        
        {/* 강아지 얼굴 */}
        <g transform="translate(6, 8)">
          {/* 귀 */}
          <ellipse cx="5" cy="4" rx="3" ry="5" fill={color} opacity="0.8"/>
          <ellipse cx="15" cy="4" rx="3" ry="5" fill={color} opacity="0.8"/>
          
          {/* 얼굴 */}
          <circle cx="10" cy="8" r="6" fill={color}/>
          
          {/* 눈 */}
          <circle cx="7.5" cy="6.5" r="1" fill="white"/>
          <circle cx="12.5" cy="6.5" r="1" fill="white"/>
          
          {/* 코 */}
          <ellipse cx="10" cy="9" rx="1" ry="0.8" fill="white"/>
          
          {/* 입 */}
          <path d="M 8 11 Q 10 12.5 12 11" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </g>
        
        {/* 발자국 장식 */}
        <g opacity="0.6">
          <circle cx="4" cy="26" r="1.5" fill={color}/>
          <circle cx="8" cy="28" r="1" fill={color}/>
          <circle cx="24" cy="28" r="1" fill={color}/>
          <circle cx="28" cy="26" r="1.5" fill={color}/>
        </g>
      </svg>
      
      {/* 브랜드명 */}
      <Text
        fw={800}
        fz={currentSize.fontSize}
        style={{
          background: `linear-gradient(135deg, ${color} 0%, #facc15 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'NanumSquareRound, sans-serif',
          letterSpacing: '-0.02em'
        }}
      >
        Petit
      </Text>
    </Group>
  );
} 
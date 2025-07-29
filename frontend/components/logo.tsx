'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function Logo() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 cursor-pointer transition-all duration-200"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Sparkles
        size={20}
        className={`transition-transform duration-300 ${
          hovered ? 'rotate-12 text-[#00C2FF]' : 'rotate-0 text-[#888]'
        }`}
      />
      <span className="text-white transition-colors duration-300">Component</span>
      <span
        className={`transition-colors duration-300 ${
          hovered ? 'text-[#00C2FF]' : 'text-[#888]'
        }`}
      >
        .ai
      </span>
    </div>
  );
}

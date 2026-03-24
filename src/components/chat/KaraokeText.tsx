import React from 'react';

interface KaraokeTextProps {
  text: string;
  highlightIndex: number;
}

const KaraokeText: React.FC<KaraokeTextProps> = ({ text, highlightIndex }) => {
  const words = text.split(' ');

  return (
    <p className="text-xl leading-relaxed text-foreground">
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline px-0.5 rounded transition-colors duration-100 ${
            index === highlightIndex
              ? 'bg-karaoke font-semibold'
              : ''
          }`}
        >
          {word}{' '}
        </span>
      ))}
    </p>
  );
};

export default KaraokeText;

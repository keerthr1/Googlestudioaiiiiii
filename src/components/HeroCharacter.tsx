import React from 'react';

export const HeroCharacter: React.FC = () => {
  return (
    <div className="relative aspect-[2/3] w-auto h-[340px] sm:h-[420px] md:h-[480px] lg:h-[500px] xl:h-[540px] max-h-[62vh] mx-auto select-none overflow-hidden bg-transparent">
      <iframe
        src="/Home/CH_HERO.html"
        title="Hero character animation"
        className="absolute inset-0 w-full h-full border-0 bg-transparent"
      />
    </div>
  );
};

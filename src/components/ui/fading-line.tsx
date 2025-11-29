export function FadingLine() {
  return (
    <div 
      className="h-[1px] w-full"
      style={{
        background: 'hsl(var(--border))',
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    />
  );
}

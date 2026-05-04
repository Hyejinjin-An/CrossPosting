interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
        {eyebrow}
      </h2>
      <p className="mb-10 text-xl font-bold text-[hsl(var(--foreground))]">{title}</p>
    </>
  );
}

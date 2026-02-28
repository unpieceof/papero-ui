interface YearSectionProps {
  year: number
  children: React.ReactNode
}

export default function YearSection({ year, children }: YearSectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint">
          {year}
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>
      {children}
    </section>
  )
}

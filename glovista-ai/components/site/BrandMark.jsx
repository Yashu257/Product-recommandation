// Quiet, refined wordmark: a small sprout emblem + serif "Glovista".
export default function BrandMark({ className = "", showAI = true }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sage-200 bg-sage-50">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#5B6B53" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 21c0-6 0-9 0-12" />
          <path d="M12 12c-3 0-5.5-1.5-5.5-5C10 7 12 8.5 12 12z" />
          <path d="M12 10c0-3 2-5 5.5-5C17.5 8.5 15 10 12 10z" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="font-display text-[19px] font-600 tracking-tight text-stone-900">Glovista</span>
        {showAI && <span className="ml-1.5 text-[11px] font-medium uppercase tracking-wideish text-sage-600">AI</span>}
      </span>
    </span>
  );
}

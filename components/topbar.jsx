// Topbar — search + global actions
function Topbar({ onNavigate }) {
  const I = window.Ic;
  return (
    <div className="topbar">
      <div className="search">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
        </svg>
        <input placeholder="Search posts, hashtags, drafts…" />
        <kbd>⌘K</kbd>
      </div>

      <div className="topbar-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onNavigate('ai-assistant')}
          style={{ gap: 5 }}
        >
          <I.Sparkles size={13} style={{ color: 'var(--violet-500)' }} />
          <span>Ask AI</span>
        </button>

        <div className="topbar-divider" />

        <button className="icon-btn" title="Notifications">
          <I.Bell />
          <span className="dot" />
        </button>

        <button className="icon-btn" title="Inbox">
          <I.Inbox />
        </button>

        <div className="topbar-divider" />

        <button
          className="btn btn-gradient btn-sm"
          onClick={() => onNavigate('create')}
        >
          <I.Plus size={13} />
          New post
        </button>
      </div>
    </div>
  );
}

window.Topbar = Topbar;

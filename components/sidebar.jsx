// Sidebar — left navigation
function Sidebar({ currentPage, onNavigate, scheduledCount, draftCount }) {
  const I = window.Ic;

  const workspace = [
    { key: 'dashboard',    label: 'Dashboard',  icon: I.Home },
    { key: 'calendar',     label: 'Calendar',   icon: I.Calendar, count: scheduledCount },
    { key: 'create',       label: 'Compose',    icon: I.PenLine },
    { key: 'ai-assistant', label: 'AI Studio',  icon: I.Sparkles },
  ];

  const library = [
    { key: 'drafts',    label: 'Drafts',     icon: I.FileEdit,   count: draftCount },
    { key: 'published', label: 'Published',  icon: I.CheckCircle },
    { key: 'analytics', label: 'Analytics',  icon: I.TrendUp },
    { key: 'inbox',     label: 'Inbox',      icon: I.Inbox },
  ];

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const active = currentPage === item.key;
    return (
      <a
        className={`nav-item${active ? ' active' : ''}`}
        onClick={() => onNavigate(item.key)}
        style={{ cursor: 'pointer' }}
      >
        <Icon />
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.count != null && item.count > 0 && (
          <span className="nav-count">{item.count}</span>
        )}
      </a>
    );
  };

  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="brand">
        <div className="brand-mark">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5C3 5.5 5.2 3 8 3s5 2.5 5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="8" cy="12" r="1.8" fill="white"/>
          </svg>
        </div>
        <div>
          <div className="brand-name">Cadence</div>
          <div className="brand-sub">AI Publishing</div>
        </div>
      </div>

      {/* Workspace nav */}
      <div className="sidebar-section">
        <div className="sidebar-label">Workspace</div>
        {workspace.map(item => <NavLink key={item.key} item={item} />)}
      </div>

      {/* Library nav */}
      <div className="sidebar-section">
        <div className="sidebar-label">Library</div>
        {library.map(item => <NavLink key={item.key} item={item} />)}
      </div>

      {/* Account nav */}
      <div className="sidebar-section">
        <div className="sidebar-label">Account</div>
        <NavLink item={{ key: 'settings', label: 'Settings', icon: I.Settings }} />
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="upgrade-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, position: 'relative' }}>
            <I.Sparkles size={13} />
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.85 }}>
              Cadence Pro
            </span>
          </div>
          <div className="upgrade-card-title">Unlock unlimited AI</div>
          <div className="upgrade-card-desc">
            Bulk generation, brand voice training &amp; priority scheduling.
          </div>
          <button className="upgrade-card-btn">Upgrade now →</button>
        </div>

        <div className="user-card">
          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>SJ</div>
          <div className="user-info">
            <div className="user-name">Sarah Johnson</div>
            <div className="user-email">sarah@cadence.app</div>
          </div>
          <button className="icon-btn" style={{ width: 26, height: 26, flexShrink: 0 }}>
            <I.MoreHoriz />
          </button>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;

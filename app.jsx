// Cadence — main App shell
function App() {
  const data = window.CADENCE_DATA;
  const [page, setPage] = React.useState('dashboard');
  const [selectedPost, setSelectedPost] = React.useState(null);

  const handleNavigate = (p) => {
    if (p === 'create' || p === 'dashboard' || p === 'calendar' || p === 'ai-assistant' || p === 'settings') {
      setSelectedPost(null);
    }
    setPage(p);
    window.scrollTo({ top: 0 });
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setPage('post-details');
  };

  // Expose navigation globally so child components can trigger nav
  window.cadenceNav = handleNavigate;

  const scheduledCount = data.posts.filter(p => p.status === 'scheduled').length;
  const draftCount     = data.posts.filter(p => p.status === 'draft').length;

  let pageEl = null;
  switch (page) {
    case 'dashboard':
      pageEl = <window.Dashboard data={data} onNavigate={handleNavigate} onPostClick={handlePostClick} />;
      break;
    case 'calendar':
      pageEl = <window.CalendarPage posts={data.posts} onPostClick={handlePostClick} />;
      break;
    case 'create':
      pageEl = <window.CreatePost
        onSaveDraft={() => { alert('Saved as draft'); handleNavigate('dashboard'); }}
        onSchedule={() => { alert('Post scheduled!'); handleNavigate('calendar'); }}
      />;
      break;
    case 'post-details':
      if (selectedPost) {
        pageEl = <window.PostDetails
          post={selectedPost}
          onBack={() => handleNavigate('calendar')}
          onEdit={() => handleNavigate('create')}
          onDelete={() => { if (confirm('Delete this post?')) handleNavigate('calendar'); }}
          onDuplicate={() => alert('Post duplicated')}
          onReschedule={() => alert('Reschedule modal would open')}
        />;
      } else {
        pageEl = <window.Dashboard data={data} onNavigate={handleNavigate} onPostClick={handlePostClick} />;
      }
      break;
    case 'ai-assistant':
      pageEl = <window.AIAssistant />;
      break;
    case 'settings':
      pageEl = <window.SettingsPage data={data} />;
      break;
    case 'drafts':
    case 'published':
    case 'analytics':
    case 'inbox':
      pageEl = <ComingSoon title={page} onBack={() => handleNavigate('dashboard')} />;
      break;
    default:
      pageEl = <window.Dashboard data={data} onNavigate={handleNavigate} onPostClick={handlePostClick} />;
  }

  return (
    <div className="app">
      <window.Sidebar
        currentPage={page}
        onNavigate={handleNavigate}
        scheduledCount={scheduledCount}
        draftCount={draftCount}
      />
      <div className="main-col">
        <window.Topbar onNavigate={handleNavigate} />
        <div className="page-scroll">
          <div className="page-inner">
            {pageEl}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Coming soon placeholder ── */
function ComingSoon({ title, onBack }) {
  const I = window.Ic;
  const iconMap = {
    drafts:    <I.FileEdit />,
    published: <I.CheckCircle />,
    analytics: <I.Activity />,
    inbox:     <I.Inbox />,
  };
  const icon = iconMap[title] || <I.Sparkles />;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="page-title-row">
          <div className="page-title" style={{ textTransform: 'capitalize' }}>{title}</div>
          <div className="page-subtitle">This feature is on its way.</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            <I.ArrowLeft size={14} />Back to dashboard
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '80px 32px' }}>
        <div className="empty">
          <div className="empty-icon">{icon}</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, fontFamily: "'Inter Tight', sans-serif", letterSpacing: '-0.025em' }}>
            Coming soon
          </h2>
          <p className="text-muted" style={{ maxWidth: 400, marginBottom: 28, fontSize: 14, lineHeight: 1.6 }}>
            We're polishing the <strong style={{ textTransform: 'capitalize', color: 'var(--text-default)' }}>{title}</strong> experience.
            In the meantime, explore the rest of Cadence.
          </p>
          <div className="flex gap-3 justify-center">
            <button className="btn btn-gradient" onClick={onBack}>
              <I.Home size={14} />Go to dashboard
            </button>
            <button className="btn btn-secondary" onClick={() => window.cadenceNav('create')}>
              <I.Plus size={14} />Create post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

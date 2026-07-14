// Calendar — month + week views with filters, platform badges, empty states
function CalendarPage({ posts, onPostClick }) {
  const I = window.Ic;
  const [view, setView]           = React.useState('month');
  const [cursor, setCursor]       = React.useState(new Date(2026, 4, 1));
  const [platFilter, setPlatFilter]     = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const monthLabel = cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const onPrev = () => {
    const d = new Date(cursor);
    if (view === 'month') d.setMonth(d.getMonth() - 1);
    else d.setDate(d.getDate() - 7);
    setCursor(d);
  };
  const onNext = () => {
    const d = new Date(cursor);
    if (view === 'month') d.setMonth(d.getMonth() + 1);
    else d.setDate(d.getDate() + 7);
    setCursor(d);
  };
  const onToday = () => setCursor(new Date(2026, 4, 25));
  const onNewPost = () => window.cadenceNav('create');

  /* ── Filtering ── */
  const filteredPosts = posts.filter(p => {
    if (platFilter !== 'all' && !p.platforms.includes(platFilter)) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter)       return false;
    return true;
  });

  const scheduled = filteredPosts.filter(p => p.status === 'scheduled').length;
  const published  = filteredPosts.filter(p => p.status === 'published').length;
  const drafts     = filteredPosts.filter(p => p.status === 'draft').length;

  const platforms = [
    { key: 'all', label: 'All channels' },
    { key: 'x',  label: '𝕏' },
    { key: 'li', label: 'LinkedIn' },
    { key: 'ig', label: 'Instagram' },
    { key: 'fb', label: 'Facebook' },
  ];

  const statuses = [
    { key: 'all',       label: 'All' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'published', label: 'Published' },
    { key: 'draft',     label: 'Draft' },
  ];

  return (
    <div className="fade-in">

      {/* Page header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="page-title-row">
          <div className="page-title">Calendar</div>
          <div className="page-subtitle">
            Plan, schedule, and manage across all your channels.
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-gradient" onClick={onNewPost}>
            <I.Plus size={14} />New post
          </button>
        </div>
      </div>

      {/* Toolbar row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>

        {/* Date navigation */}
        <div className="flex items-center gap-1">
          <button className="btn btn-secondary btn-sm" onClick={onToday}>Today</button>
          <button className="icon-btn" onClick={onPrev}><I.ChevronLeft /></button>
          <button className="icon-btn" onClick={onNext}><I.ChevronRight /></button>
        </div>

        {/* Month label */}
        <div className="font-tight font-bold text-strong" style={{ fontSize: 20, letterSpacing: '-0.025em', minWidth: 160 }}>
          {monthLabel}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Legend */}
        <div className="flex items-center gap-4">
          <LegendItem color="var(--violet-500)" label={`${scheduled} scheduled`} />
          <LegendItem color="var(--success)"    label={`${published} published`} />
          <LegendItem color="var(--zinc-400)"   label={`${drafts} draft${drafts !== 1 ? 's' : ''}`} />
        </div>

        {/* View switcher */}
        <div className="seg">
          <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Month</button>
          <button className={view === 'week'  ? 'active' : ''} onClick={() => setView('week')}>Week</button>
          <button>Queue</button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* Platform pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {platforms.map(pl => (
            <button
              key={pl.key}
              onClick={() => setPlatFilter(pl.key)}
              style={{
                padding: '5px 13px',
                borderRadius: 20,
                fontSize: 12.5,
                fontWeight: 600,
                border: platFilter === pl.key
                  ? '1.5px solid var(--violet-500)'
                  : '1.5px solid var(--border)',
                background: platFilter === pl.key
                  ? 'var(--violet-50)'
                  : 'var(--surface)',
                color: platFilter === pl.key
                  ? 'var(--violet-600)'
                  : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {pl.key !== 'all' && <window.Ic.PlatformMark p={pl.key} size="sm" />}
              {pl.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

        {/* Status pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {statuses.map(st => {
            const dotColor = st.key === 'scheduled' ? 'var(--violet-500)'
                           : st.key === 'published'  ? 'var(--success)'
                           : st.key === 'draft'       ? 'var(--zinc-400)'
                           : null;
            return (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                style={{
                  padding: '5px 13px',
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: 600,
                  border: statusFilter === st.key
                    ? '1.5px solid var(--violet-500)'
                    : '1.5px solid var(--border)',
                  background: statusFilter === st.key
                    ? 'var(--violet-50)'
                    : 'var(--surface)',
                  color: statusFilter === st.key
                    ? 'var(--violet-600)'
                    : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {dotColor && (
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                )}
                {st.label}
              </button>
            );
          })}
        </div>

        {/* Active filter indicator */}
        {(platFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => { setPlatFilter('all'); setStatusFilter('all'); }}
            style={{
              marginLeft: 'auto',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 11.5,
              fontWeight: 600,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {view === 'month'
        ? <MonthView cursor={cursor} posts={filteredPosts} onPostClick={onPostClick} onNewPost={onNewPost} />
        : <WeekView  cursor={cursor} posts={filteredPosts} onPostClick={onPostClick} onNewPost={onNewPost} />
      }
    </div>
  );
}

/* ── Legend item ── */
function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
      <span className="text-sm text-muted font-med">{label}</span>
    </div>
  );
}

/* ── Calendar event chip (month view) ── */
function CalEventChip({ post, onClick }) {
  return (
    <button
      className={`cal-event ${post.status}`}
      onClick={onClick}
      title={post.title}
      style={{ width: '100%', minWidth: 0 }}
    >
      {/* Platform badges */}
      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        {post.platforms.slice(0, 2).map(pl => (
          <window.Ic.PlatformMark key={pl} p={pl} size="sm" />
        ))}
        {post.platforms.length > 2 && (
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            color: 'inherit',
            opacity: 0.7,
            alignSelf: 'center',
            lineHeight: 1,
          }}>
            +{post.platforms.length - 2}
          </span>
        )}
      </div>
      {/* Time */}
      {post.scheduledTime && (
        <span className="cal-event-time">{post.scheduledTime}</span>
      )}
      {/* Title */}
      <span className="cal-event-title">{post.title}</span>
    </button>
  );
}

/* ── Month view ── */
function MonthView({ cursor, posts, onPostClick, onNewPost }) {
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const startDow = new Date(year, month, 1).getDay();
  const start = new Date(year, month, 1 - startDow);
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const today = new Date(2026, 4, 25);

  // Check if all days are outside current month (edge case) — shouldn't happen
  const hasAnyPost = posts.length > 0;

  return (
    <div className="cal-grid">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
        <div key={d} className="cal-day-head">{d}</div>
      ))}
      {days.map((d, idx) => {
        const inMonth = d.getMonth() === month;
        const isToday = sameDay(d, today);
        const dayPosts = posts.filter(p => p.scheduledDate && sameDay(p.scheduledDate, d));
        const shown = dayPosts.slice(0, 3);
        const overflow = dayPosts.length - shown.length;

        return (
          <div
            key={idx}
            className={`cal-cell${inMonth ? '' : ' other-month'}${isToday ? ' today' : ''}`}
            style={{ position: 'relative' }}
          >
            {/* Date number */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div className="cal-date">{d.getDate()}</div>
              {/* Add button — only shows on hover via CSS */}
              {inMonth && (
                <button
                  className="cal-add-btn"
                  onClick={onNewPost}
                  title="New post"
                  aria-label="Add post"
                >
                  +
                </button>
              )}
            </div>

            {/* Event chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {shown.map(p => (
                <CalEventChip key={p.id} post={p} onClick={() => onPostClick(p)} />
              ))}
              {overflow > 0 && (
                <div style={{
                  fontSize: 11,
                  color: 'var(--violet-500)',
                  padding: '2px 6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: 4,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                }}>
                  +{overflow} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Week view ── */
function WeekView({ cursor, posts, onPostClick, onNewPost }) {
  const I = window.Ic;
  const start = new Date(cursor);
  start.setDate(cursor.getDate() - cursor.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const today = new Date(2026, 4, 25);
  const hours = [6, 8, 10, 12, 14, 16, 18, 20];

  // Check if there are any posts visible this week
  const weekHasPosts = days.some(d =>
    posts.some(p => p.scheduledDate && sameDay(p.scheduledDate, d))
  );

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Day headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '56px repeat(7, 1fr)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--zinc-50)',
      }}>
        <div style={{ padding: '12px 8px', borderRight: '1px solid var(--border-soft)' }} />
        {days.map((d, i) => {
          const isToday = sameDay(d, today);
          const dayPostCount = posts.filter(p => p.scheduledDate && sameDay(p.scheduledDate, d)).length;
          return (
            <div
              key={i}
              style={{
                padding: '12px 14px',
                borderRight: i < 6 ? '1px solid var(--border-soft)' : 'none',
                borderBottom: isToday ? '2px solid var(--violet-400)' : '2px solid transparent',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: 'var(--text-faint)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}>
                  {d.toLocaleString('en-US', { weekday: 'short' })}
                </div>
                {dayPostCount > 0 && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: isToday ? 'var(--violet-100)' : 'var(--zinc-100)',
                    color: isToday ? 'var(--violet-600)' : 'var(--text-muted)',
                    borderRadius: 10,
                    padding: '1px 6px',
                    lineHeight: 1.6,
                  }}>
                    {dayPostCount}
                  </span>
                )}
              </div>
              <div style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: isToday ? 'var(--violet-500)' : 'var(--text-strong)',
                lineHeight: 1.2,
                marginTop: 1,
              }}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {!weekHasPosts && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '72px 24px',
          gap: 8,
          textAlign: 'center',
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--violet-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
            color: 'var(--violet-400)',
          }}>
            <I.Calendar size={22} />
          </div>
          <div className="font-tight font-bold text-strong" style={{ fontSize: 16 }}>
            Nothing scheduled this week
          </div>
          <div className="text-sm text-muted" style={{ maxWidth: 280, marginBottom: 12 }}>
            Plan ahead and schedule posts to keep your channels active.
          </div>
          <button className="btn btn-gradient" onClick={onNewPost}>
            <I.Plus size={14} />Schedule a post
          </button>
        </div>
      )}

      {/* Time grid — only shown if there's something to display */}
      {weekHasPosts && (
        <div style={{ display: 'grid', gridTemplateColumns: '56px repeat(7, 1fr)' }}>
          {hours.map((h, hi) => (
            <React.Fragment key={h}>
              {/* Time label */}
              <div style={{
                padding: '6px 8px',
                borderRight: '1px solid var(--border-soft)',
                borderBottom: hi < hours.length - 1 ? '1px solid var(--border-soft)' : 'none',
                fontSize: 10.5,
                color: 'var(--text-faint)',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                textAlign: 'right',
                paddingTop: 10,
              }}>
                {String(h).padStart(2, '0')}:00
              </div>

              {/* Day cells */}
              {days.map((d, di) => {
                const cellPosts = posts.filter(p => {
                  if (!p.scheduledDate) return false;
                  if (!sameDay(p.scheduledDate, d)) return false;
                  const ph = p.scheduledDate.getHours();
                  return ph >= h && ph < (hours[hi + 1] ?? 24);
                });
                const isToday = sameDay(d, today);
                return (
                  <div
                    key={di}
                    style={{
                      minHeight: 68,
                      padding: 5,
                      borderRight: di < 6 ? '1px solid var(--border-soft)' : 'none',
                      borderBottom: hi < hours.length - 1 ? '1px solid var(--border-soft)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      background: isToday ? 'rgba(124,58,237,0.018)' : 'transparent',
                    }}
                  >
                    {cellPosts.map(p => (
                      <WeekEventBlock key={p.id} post={p} onClick={() => onPostClick(p)} />
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Week event block ── */
function WeekEventBlock({ post, onClick }) {
  return (
    <button
      className={`cal-event ${post.status}`}
      style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '6px 8px', gap: 3, width: '100%' }}
      onClick={onClick}
      title={post.title}
    >
      {/* Time + platforms row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
        <span className="cal-event-time" style={{ flexShrink: 0 }}>{post.scheduledTime}</span>
        <div style={{ display: 'flex', gap: 2, marginLeft: 'auto', flexShrink: 0 }}>
          {post.platforms.slice(0, 3).map(pl => (
            <window.Ic.PlatformMark key={pl} p={pl} size="sm" />
          ))}
          {post.platforms.length > 3 && (
            <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.6, alignSelf: 'center' }}>
              +{post.platforms.length - 3}
            </span>
          )}
        </div>
      </div>
      {/* Title */}
      <div className="cal-event-title" style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, textAlign: 'left' }}>
        {post.title}
      </div>
    </button>
  );
}

/* ── Utility ── */
function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

window.CalendarPage = CalendarPage;

// Calendar — month + week views
function CalendarPage({ posts, onPostClick }) {
  const I = window.Ic;
  const [view, setView] = React.useState('month');
  const [cursor, setCursor] = React.useState(new Date(2026, 4, 1));

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

  const scheduled = posts.filter(p => p.status === 'scheduled').length;
  const published  = posts.filter(p => p.status === 'published').length;

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
          <button className="btn btn-secondary">
            <I.Filter size={14} />All channels<I.ChevronDown size={13} />
          </button>
          <button className="btn btn-gradient" onClick={() => window.cadenceNav('create')}>
            <I.Plus size={14} />New post
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
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

        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Legend */}
          <div className="flex items-center gap-4">
            <LegendItem color="var(--violet-500)" label={`${scheduled} scheduled`} />
            <LegendItem color="var(--success)"    label={`${published} published`} />
            <LegendItem color="var(--zinc-400)"   label="Draft" />
          </div>

          {/* View switcher */}
          <div className="seg">
            <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>
              Month
            </button>
            <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>
              Week
            </button>
            <button>Queue</button>
          </div>
        </div>
      </div>

      {view === 'month'
        ? <MonthView cursor={cursor} posts={posts} onPostClick={onPostClick} />
        : <WeekView  cursor={cursor} posts={posts} onPostClick={onPostClick} />
      }
    </div>
  );
}

/* ── Legend ── */

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
      <span className="text-sm text-muted font-med">{label}</span>
    </div>
  );
}

/* ── Month view ── */

function MonthView({ cursor, posts, onPostClick }) {
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const startDow = new Date(year, month, 1).getDay();
  const start = new Date(year, month, 1 - startDow);
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const today = new Date(2026, 4, 25);

  return (
    <div className="cal-grid">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
        <div key={d} className="cal-day-head">{d}</div>
      ))}
      {days.map((d, idx) => {
        const inMonth = d.getMonth() === month;
        const isToday = sameDay(d, today);
        const dayPosts = posts.filter(p => p.scheduledDate && sameDay(p.scheduledDate, d));
        return (
          <div
            key={idx}
            className={`cal-cell${inMonth ? '' : ' other-month'}${isToday ? ' today' : ''}`}
          >
            <div className="cal-date">{d.getDate()}</div>
            <div className="col" style={{ gap: 3 }}>
              {dayPosts.slice(0, 3).map(p => (
                <button
                  key={p.id}
                  className={`cal-event ${p.status}`}
                  onClick={() => onPostClick(p)}
                  title={p.title}
                >
                  <span className="cal-event-time">{p.scheduledTime || '—'}</span>
                  <span className="cal-event-title">{p.title}</span>
                </button>
              ))}
              {dayPosts.length > 3 && (
                <div style={{ fontSize: 11, color: 'var(--text-subtle)', padding: '1px 6px', fontWeight: 600 }}>
                  +{dayPosts.length - 3} more
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

function WeekView({ cursor, posts, onPostClick }) {
  const start = new Date(cursor);
  start.setDate(cursor.getDate() - cursor.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const today = new Date(2026, 4, 25);
  const hours = [6, 8, 10, 12, 14, 16, 18, 20];

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
          return (
            <div
              key={i}
              style={{
                padding: '12px 14px',
                borderRight: i < 6 ? '1px solid var(--border-soft)' : 'none',
              }}
            >
              <div style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: 'var(--text-faint)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}>
                {d.toLocaleString('en-US', { weekday: 'short' })}
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

      {/* Time grid */}
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
                    minHeight: 64,
                    padding: 5,
                    borderRight: di < 6 ? '1px solid var(--border-soft)' : 'none',
                    borderBottom: hi < hours.length - 1 ? '1px solid var(--border-soft)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    background: isToday ? 'rgba(124, 58, 237, 0.015)' : 'transparent',
                  }}
                >
                  {cellPosts.map(p => (
                    <button
                      key={p.id}
                      className={`cal-event ${p.status}`}
                      style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '5px 7px', gap: 2 }}
                      onClick={() => onPostClick(p)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="cal-event-time">{p.scheduledTime}</span>
                        <div className="flex gap-1 ml-auto">
                          {p.platforms.slice(0, 3).map(pl => (
                            <window.Ic.PlatformMark key={pl} p={pl} size="sm" />
                          ))}
                        </div>
                      </div>
                      <div className="cal-event-title" style={{ fontSize: 11, fontWeight: 600 }}>
                        {p.title}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

window.CalendarPage = CalendarPage;

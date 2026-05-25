// Dashboard — analytics + publishing hub
function Dashboard({ onNavigate, onPostClick, data }) {
  const I = window.Ic;
  const [chartTab, setChartTab] = React.useState('reach');

  const upcoming = data.posts
    .filter(p => p.status === 'scheduled')
    .sort((a, b) => a.scheduledDate - b.scheduledDate)
    .slice(0, 5);

  const platformCount = (() => {
    const s = new Set();
    upcoming.forEach(p => p.platforms.forEach(pl => s.add(pl)));
    return s.size;
  })();

  const chartData = {
    reach:      [42, 55, 38, 62, 71, 58, 75, 82, 68, 78, 89, 72, 86, 94],
    engagement: [3.1, 4.2, 3.8, 5.1, 4.8, 4.2, 5.6, 6.1, 5.3, 5.8, 6.4, 5.9, 6.8, 7.2],
    clicks:     [120, 180, 140, 220, 260, 200, 280, 310, 250, 290, 340, 280, 320, 360],
  };
  const chartMeta = {
    reach:      { value: '284,612', delta: '+18.4%', label: 'Total reach' },
    engagement: { value: '5.8%',    delta: '+0.6pp', label: 'Avg engagement rate' },
    clicks:     { value: '12,840',  delta: '+22.1%', label: 'Link clicks' },
  };

  return (
    <div className="fade-in">

      {/* Page header */}
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="page-title-row">
          <div className="page-title">Good morning, Sarah 👋</div>
          <div className="page-subtitle">Here's how your content is performing this week.</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">
            <I.Filter size={14} />Last 7 days<I.ChevronDown size={13} />
          </button>
          <button className="btn btn-gradient" onClick={() => onNavigate('create')}>
            <I.Plus size={14} />New post
          </button>
        </div>
      </div>

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard
          icon={<I.FileText />} iconBg="var(--violet-50)" iconColor="var(--violet-500)"
          label="Total posts" value="156" trend="+8.2%" trendUp
          spark={[12, 16, 11, 18, 14, 21, 19, 24, 22, 28]}
        />
        <StatCard
          icon={<I.Calendar />} iconBg="var(--info-soft)" iconColor="var(--info)"
          label="Scheduled" value="24" trend="+12%" trendUp
          spark={[6, 8, 7, 10, 9, 11, 10, 12, 11, 14]}
        />
        <StatCard
          icon={<I.FileEdit />} iconBg="var(--warning-soft)" iconColor="var(--warning)"
          label="Drafts" value="8" trend="−2" trendUp={false}
          spark={[10, 9, 10, 8, 9, 8, 8, 9, 8, 8]}
        />
        <StatCard
          icon={<I.CheckCircle />} iconBg="var(--success-soft)" iconColor="var(--success)"
          label="Published" value="124" trend="+15%" trendUp
          spark={[8, 10, 9, 12, 11, 14, 13, 16, 18, 22]}
        />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>

        {/* Left column */}
        <div className="col gap-4">

          {/* Performance chart */}
          <div className="card">
            <div className="card-header card-header-lg">
              <div>
                <div className="card-title">Performance overview</div>
                <div className="card-sub">Reach across all connected channels</div>
              </div>
              <div className="seg">
                {['reach', 'engagement', 'clicks'].map(tab => (
                  <button
                    key={tab}
                    className={chartTab === tab ? 'active' : ''}
                    onClick={() => setChartTab(tab)}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: '20px 24px 20px' }}>
              <div className="flex items-baseline gap-3 mb-4">
                <div className="font-tight" style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-strong)' }}>
                  {chartMeta[chartTab].value}
                </div>
                <span className="badge badge-up">
                  <I.ArrowUp size={10} />{chartMeta[chartTab].delta}
                </span>
                <span className="text-xs text-subtle font-med">vs last week</span>
              </div>
              <AreaChart data={chartData[chartTab]} color="var(--violet-500)" />
              <div className="chart-axis">
                {['May 12', 'May 14', 'May 16', 'May 18', 'May 20', 'May 22', 'May 24'].map(d => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming posts */}
          <div className="card">
            <div className="card-header card-header-lg">
              <div>
                <div className="card-title">Upcoming this week</div>
                <div className="card-sub">{upcoming.length} posts queued across {platformCount} platforms</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('calendar')}>
                View calendar <I.ArrowRight size={13} />
              </button>
            </div>
            <div style={{ padding: '6px 8px' }}>
              {upcoming.map(p => (
                <PostRow key={p.id} post={p} onClick={() => onPostClick(p)} />
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="card">
            <div className="card-header card-header-lg">
              <div>
                <div className="card-title">Recent activity</div>
                <div className="card-sub">Latest events across your workspace</div>
              </div>
              <button className="btn btn-ghost btn-sm">
                <I.History size={13} />Full log
              </button>
            </div>
            <div style={{ padding: '8px 8px' }}>
              {data.activity.map((a, idx) => (
                <ActivityItem key={a.id} item={a} last={idx === data.activity.length - 1} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col gap-4">

          {/* AI Suggestions */}
          <div className="ai-card">
            <div className="flex items-center gap-2 mb-4" style={{ position: 'relative' }}>
              <div className="ai-pill"><I.Sparkles size={11} /> AI insights</div>
              <span
                className="text-xs font-semi"
                style={{ marginLeft: 'auto', color: 'var(--violet-600)' }}
              >
                3 new
              </span>
            </div>
            <div className="col gap-3" style={{ position: 'relative' }}>
              {data.aiSuggestions.map(s => (
                <SuggestionCard key={s.id} suggestion={s} onUse={() => onNavigate('create')} />
              ))}
            </div>
          </div>

          {/* Connected accounts */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Channels</div>
                <div className="card-sub">4 active</div>
              </div>
              <button
                className="icon-btn"
                onClick={() => onNavigate('settings')}
                title="Manage channels"
              >
                <I.Settings />
              </button>
            </div>
            <div style={{ padding: '4px 8px' }}>
              {data.accounts.map(a => (
                <AccountRow key={a.handle} account={a} />
              ))}
            </div>
            <div style={{ padding: '10px 16px 14px', borderTop: '1px solid var(--border-soft)' }}>
              <button className="btn btn-secondary btn-sm w-full">
                <I.Plus size={13} />Connect channel
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div
              className="font-tight font-semi text-strong mb-3"
              style={{ fontSize: 15, letterSpacing: '-0.015em' }}
            >
              Quick actions
            </div>
            <div className="col gap-2">
              <QuickActionBtn
                icon={<I.Wand />}
                label="Bulk schedule"
                desc="Queue 30 posts at once"
                onClick={() => onNavigate('create')}
              />
              <QuickActionBtn
                icon={<I.Megaphone />}
                label="Brand voice setup"
                desc="Train AI on your tone"
                onClick={() => onNavigate('ai-assistant')}
              />
              <QuickActionBtn
                icon={<I.Target />}
                label="Best time analysis"
                desc="See peak engagement slots"
                onClick={() => onNavigate('analytics')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */

function StatCard({ icon, iconBg, iconColor, label, value, trend, trendUp, spark }) {
  const max = Math.max(...spark);
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon" style={{ background: iconBg, color: iconColor }}>
          {React.cloneElement(icon, { size: 15 })}
        </div>
        <button className="icon-btn" style={{ width: 28, height: 28 }}>
          <window.Ic.MoreHoriz />
        </button>
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">
        <span className={`badge ${trendUp ? 'badge-up' : 'badge-down'}`}>
          {trendUp
            ? <window.Ic.ArrowUp size={10} />
            : <window.Ic.ArrowDown size={10} />
          }
          {trend}
        </span>
        <div className="stat-spark">
          {spark.map((v, i) => (
            <span key={i} style={{ height: `${(v / max) * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AreaChart({ data, color }) {
  const W = 720, H = 140, P = 6;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const step = (W - P * 2) / (data.length - 1);
  const pts = data.map((v, i) => [
    P + i * step,
    H - P - ((v - min) / (max - min || 1)) * (H - P * 2 - 16),
  ]);
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `C${p[0] - step / 2},${pts[i - 1][1]} ${p[0] - step / 2},${p[1]} ${p[0]},${p[1]}`)).join(' ');
  const area = path + ` L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 140, overflow: 'visible' }}>
      <defs>
        <linearGradient id={`ag-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--violet-500)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--violet-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.2, 0.5, 0.8].map(f => (
        <line key={f}
          x1={P} y1={f * H} x2={W - P} y2={f * H}
          stroke="var(--zinc-100)" strokeWidth="1"
          strokeDasharray="4 5"
        />
      ))}
      <path d={area} fill={`url(#ag-${color})`} />
      <path d={path} fill="none" stroke="var(--violet-500)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="4.5"
        fill="white" stroke="var(--violet-500)" strokeWidth="2.5" />
      <circle cx={last[0]} cy={last[1]} r="8"
        fill="var(--violet-500)" fillOpacity="0.12" />
    </svg>
  );
}

function PostRow({ post, onClick }) {
  const I = window.Ic;
  const d = post.scheduledDate;
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return (
    <button className="post-row" onClick={onClick}>
      <div className="post-row-date">
        <div className="post-row-month">{months[d.getMonth()]}</div>
        <div className="post-row-day">{d.getDate()}</div>
        <div className="post-row-time">{post.scheduledTime}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="font-semi text-strong truncate"
          style={{ fontSize: 13.5, marginBottom: 3 }}
        >
          {post.title}
        </div>
        <div className="text-sm text-muted truncate">{post.content}</div>
      </div>
      <div className="flex gap-1">
        {post.platforms.map(pl => <I.PlatformMark key={pl} p={pl} size="sm" />)}
      </div>
      <span className="badge badge-scheduled">
        <span className="dot" />Scheduled
      </span>
    </button>
  );
}

function ActivityItem({ item, last }) {
  const typeCfg = {
    publish:  { bg: 'var(--success-soft)', color: '#059669', icon: <window.Ic.CheckCircle size={13} /> },
    schedule: { bg: 'var(--violet-50)',    color: 'var(--violet-500)', icon: <window.Ic.Calendar size={13} /> },
    ai:       { bg: 'var(--violet-50)',    color: 'var(--violet-500)', icon: <window.Ic.Sparkles size={13} /> },
    comment:  { bg: 'var(--info-soft)',    color: 'var(--info)',        icon: <window.Ic.MessageCircle size={13} /> },
  };
  const cfg = typeCfg[item.type] || { bg: 'var(--zinc-100)', color: 'var(--zinc-500)', icon: null };

  return (
    <div className="row-hover" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 14px' }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
        background: cfg.bg, color: cfg.color,
        display: 'grid', placeItems: 'center',
      }}>
        {cfg.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--text-default)', fontWeight: 500, lineHeight: 1.5 }}>
          {item.text}
        </div>
        <div className="mono text-xs text-subtle" style={{ marginTop: 2 }}>{item.time}</div>
      </div>
    </div>
  );
}

function SuggestionCard({ suggestion, onUse }) {
  const I = window.Ic;
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '14px 16px',
      cursor: 'pointer',
      transition: 'all var(--dur-base) var(--ease)',
    }}
      className="lift"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="tag-chip sm violet">{suggestion.tag}</span>
        <div className="flex gap-1 ml-auto">
          {suggestion.platforms.map(p => <I.PlatformMark key={p} p={p} size="sm" />)}
        </div>
      </div>
      <div className="font-semi text-strong mb-1" style={{ fontSize: 13.5, lineHeight: 1.35 }}>
        {suggestion.title}
      </div>
      <div className="text-sm text-muted mb-3" style={{ lineHeight: 1.5 }}>
        {suggestion.content}
      </div>
      <div className="flex gap-2">
        <button
          className="btn btn-secondary btn-sm flex-1"
          style={{ height: 28 }}
          onClick={onUse}
        >
          <I.PenLine size={12} />Use it
        </button>
        <button className="btn btn-ghost btn-sm" style={{ height: 28, padding: '0 9px' }}>
          <I.X size={13} />
        </button>
      </div>
    </div>
  );
}

function AccountRow({ account }) {
  const I = window.Ic;
  return (
    <div className="row-hover flex items-center gap-3" style={{ padding: '10px 14px' }}>
      <I.PlatformMark p={account.platform} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="font-semi truncate" style={{ fontSize: 13 }}>{account.handle}</div>
        <div className="text-xs text-subtle" style={{ marginTop: 1 }}>{account.followers} followers</div>
      </div>
      <span className="badge badge-up" style={{ fontSize: 11 }}>
        <I.ArrowUp size={9} />{account.growth}
      </span>
    </div>
  );
}

function QuickActionBtn({ icon, label, desc, onClick }) {
  return (
    <button className="quick-action" onClick={onClick}>
      <div className="quick-action-icon">
        {React.cloneElement(icon, { size: 15 })}
      </div>
      <div style={{ flex: 1 }}>
        <div className="font-semi" style={{ fontSize: 13, color: 'var(--text-strong)', marginBottom: 1 }}>
          {label}
        </div>
        <div className="text-xs text-subtle">{desc}</div>
      </div>
      <window.Ic.ArrowRight size={14} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
    </button>
  );
}

window.Dashboard = Dashboard;

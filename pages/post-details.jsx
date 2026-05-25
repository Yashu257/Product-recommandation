// Post Details — view & manage a single post
function PostDetails({ post, onBack, onEdit, onDelete, onDuplicate, onReschedule }) {
  const I = window.Ic;

  const statusMap = {
    draft:     { cls: 'badge-draft',     text: 'Draft' },
    scheduled: { cls: 'badge-scheduled', text: 'Scheduled' },
    published: { cls: 'badge-published', text: 'Published' },
  };
  const s = statusMap[post.status];

  return (
    <div className="fade-in">

      {/* Back */}
      <div style={{ marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <I.ArrowLeft size={13} />Back to calendar
        </button>
      </div>

      {/* Header */}
      <div className="page-header" style={{ alignItems: 'flex-start', marginBottom: 24 }}>
        <div className="page-title-row">
          <div className="flex items-center gap-3 mb-2">
            <span className={`badge ${s.cls}`}><span className="dot" />{s.text}</span>
            <div className="flex gap-2">
              {post.platforms.map(pl => <I.PlatformMark key={pl} p={pl} size="sm" />)}
            </div>
            <span className="text-xs text-subtle mono">
              #{post.id.padStart(6, '0')}
            </span>
          </div>
          <div className="page-title" style={{ fontSize: 24 }}>{post.title}</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={onDuplicate}>
            <I.Copy size={13} />Duplicate
          </button>
          <button className="btn btn-secondary" onClick={onReschedule}>
            <I.Refresh size={13} />Reschedule
          </button>
          <button className="btn btn-gradient" onClick={onEdit}>
            <I.Edit size={13} />Edit post
          </button>
        </div>
      </div>

      {/* Body grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

        {/* Main content */}
        <div className="col gap-4">

          {/* Post content */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Post content</div>
              <button className="icon-btn" style={{ width: 30, height: 30 }}>
                <I.Copy size={14} />
              </button>
            </div>
            <div style={{ padding: '18px 20px' }}>
              <div style={{
                fontSize: 14.5, lineHeight: 1.7,
                color: 'var(--text-default)',
                whiteSpace: 'pre-wrap',
              }}>
                {post.content}
              </div>
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
                  {post.hashtags.map(h => (
                    <span key={h} className="tag-chip violet">#{h}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Platform previews */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Platform previews</div>
              <div className="text-xs text-subtle font-semi">
                {post.platforms.length} channel{post.platforms.length > 1 ? 's' : ''}
              </div>
            </div>
            <div style={{
              padding: 16,
              background: '#F7F7F9',
              borderBottomLeftRadius: 14, borderBottomRightRadius: 14,
              display: 'grid',
              gridTemplateColumns: post.platforms.length > 1 ? 'repeat(2, 1fr)' : '1fr',
              gap: 16,
            }}>
              {post.platforms.map(p => (
                <div key={p}>
                  <div className="flex items-center gap-2 mb-3">
                    <I.PlatformMark p={p} size="sm" />
                    <span className="text-xs font-semi">{I.PlatformName(p)}</span>
                    <span className="mono text-xs text-faint ml-auto">
                      {post.content.length}/{I.PlatformLimit(p)}
                    </span>
                  </div>
                  <window.PostPreview platform={p} title={post.title} content={post.content} />
                </div>
              ))}
            </div>
          </div>

          {/* Performance (published posts only) */}
          {post.status === 'published' && post.metrics && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Performance</div>
                <span className="badge badge-up">
                  <I.ArrowUp size={10} />Above average
                </span>
              </div>
              <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                <MetricTile label="Reach"      value={post.metrics.reach.toLocaleString()} delta="+12%" />
                <MetricTile label="Engagement" value={post.metrics.engagement + '%'}       delta="+0.8%" />
                <MetricTile label="Clicks"     value={post.metrics.clicks.toLocaleString()} delta="+24%" />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col gap-4">

          {/* Schedule info */}
          <div className="card">
            <div className="card-header"><div className="card-title">Schedule</div></div>
            <div style={{ padding: '16px 18px' }}>
              {post.scheduledDate ? (
                <div className="col gap-4">
                  <DetailRow
                    icon={<I.Calendar size={13} />}
                    label="Date"
                    value={post.scheduledDate.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  />
                  <DetailRow
                    icon={<I.Clock size={13} />}
                    label="Time"
                    value={`${post.scheduledTime} (GMT-7)`}
                  />
                  <DetailRow
                    icon={<I.Globe size={13} />}
                    label="Timezone"
                    value="Pacific (Los Angeles)"
                  />
                </div>
              ) : (
                <p className="text-sm text-subtle" style={{ lineHeight: 1.5 }}>
                  No schedule set. This post is a draft.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <div className="card-header"><div className="card-title">Actions</div></div>
            <div style={{ padding: 6 }}>
              <ActionBtn icon={<I.Edit />}    label="Edit post"    onClick={onEdit} />
              <ActionBtn icon={<I.Copy />}    label="Duplicate"    onClick={onDuplicate} />
              <ActionBtn icon={<I.Refresh />} label="Reschedule"   onClick={onReschedule} />
              <ActionBtn icon={<I.Eye />}     label="Preview live" />
              <div className="hr" style={{ margin: '4px 10px' }} />
              <ActionBtn icon={<I.Trash />}   label="Delete post"  onClick={onDelete} danger />
            </div>
          </div>

          {/* Metadata */}
          <div className="card" style={{ padding: '16px 18px' }}>
            <div
              className="font-tight font-semi text-strong mb-3"
              style={{ fontSize: 13.5, letterSpacing: '-0.012em' }}
            >
              Metadata
            </div>
            <div className="col gap-3">
              <MetaRow label="Created"      value={post.createdAt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
              <MetaRow label="Last updated" value={post.updatedAt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
              <MetaRow label="Author"       value="Sarah Johnson" />
              <MetaRow label="Workspace"    value="Cadence Studio" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: 'var(--zinc-100)', color: 'var(--text-subtle)',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div className="text-xs text-faint uppercase" style={{ letterSpacing: '0.04em', fontWeight: 700, marginBottom: 1 }}>
          {label}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-strong)', lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', borderRadius: 8, width: '100%',
        textAlign: 'left', fontSize: 13.5, fontWeight: 500,
        color: danger ? 'var(--error)' : 'var(--text-default)',
        transition: 'background var(--dur-fast) var(--ease)',
        fontFamily: 'inherit',
        background: 'transparent',
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'var(--error-soft)' : 'var(--surface-sunken)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {React.cloneElement(icon, { size: 14 })}
      {label}
    </button>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex justify-between" style={{ fontSize: 12.5 }}>
      <span className="text-subtle">{label}</span>
      <span className="font-semi text-strong">{value}</span>
    </div>
  );
}

function MetricTile({ label, value, delta }) {
  return (
    <div style={{
      padding: '16px',
      background: 'var(--zinc-50)',
      borderRadius: 11,
      border: '1px solid var(--border-soft)',
    }}>
      <div className="text-xs text-subtle uppercase" style={{ letterSpacing: '0.05em', fontWeight: 700, marginBottom: 8 }}>
        {label}
      </div>
      <div className="font-tight" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.034em', color: 'var(--text-strong)', lineHeight: 1 }}>
        {value}
      </div>
      <span className="badge badge-up mt-2" style={{ fontSize: 10.5 }}>
        <window.Ic.ArrowUp size={9} />{delta}
      </span>
    </div>
  );
}

window.PostDetails = PostDetails;

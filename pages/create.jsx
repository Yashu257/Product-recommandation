// Create Post — composer with live preview
function CreatePost({ onSchedule, onSaveDraft }) {
  const I = window.Ic;
  const [title,         setTitle]         = React.useState('Product Launch Announcement');
  const [content,       setContent]       = React.useState('🚀 Excited to announce our new AI-powered features! Transform your social media strategy with intelligent automation that learns your voice and audience.\n\nLink in bio →');
  const [platforms,     setPlatforms]     = React.useState(['x', 'li']);
  const [date,          setDate]          = React.useState('2026-05-28');
  const [time,          setTime]          = React.useState('10:00');
  const [activePreview, setActivePreview] = React.useState('x');
  const [aiBusy,        setAiBusy]        = React.useState(null);

  const togglePlatform = (p) => {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
    if (!platforms.includes(activePreview) && p === activePreview) {
      setPlatforms(prev => [...prev, p]);
    }
  };

  const runAI = (kind) => {
    setAiBusy(kind);
    setTimeout(() => {
      if (kind === 'caption') {
        setContent("🚀 We just shipped something we've been dreaming about for months: AI that actually understands your brand voice.\n\nTrain it once, schedule forever. Try it free →");
      } else if (kind === 'hashtags') {
        setContent(content + '\n\n#AI #SocialMedia #Marketing #ContentCreation #GrowthHacking');
      } else if (kind === 'rewrite') {
        setContent("Big news. Our new AI features turn hours of content work into minutes — they learn your voice, suggest the next post, and ship to every channel from one queue.\n\nLink in bio.");
      } else if (kind === 'improve') {
        setContent('🎯 ' + content + '\n\nWhat would you automate first? Drop it in the comments 👇');
      }
      setAiBusy(null);
    }, 700);
  };

  return (
    <div className="fade-in">

      {/* Page header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div className="page-title-row">
          <div className="page-title">Compose</div>
          <div className="page-subtitle">
            Write once, publish everywhere — with AI co-writing built in.
          </div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={onSaveDraft}>
            <I.Save size={14} />Save draft
          </button>
          <button className="btn btn-gradient" onClick={onSchedule}>
            <I.Send size={14} />Schedule post
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>

        {/* ─── Left: editor ─── */}
        <div className="col gap-4">

          {/* Platform selector */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div
                  className="font-tight font-semi text-strong"
                  style={{ fontSize: 14, letterSpacing: '-0.014em' }}
                >
                  Publish to
                </div>
                <div className="text-xs text-subtle" style={{ marginTop: 2 }}>
                  Select one or more channels
                </div>
              </div>
              <span className="text-xs text-subtle font-semi">
                {platforms.length}/4 selected
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {['x', 'fb', 'ig', 'li'].map(p => {
                const active = platforms.includes(p);
                return (
                  <button
                    key={p}
                    className={`platform-btn${active ? ' active' : ''}`}
                    onClick={() => togglePlatform(p)}
                  >
                    <I.PlatformMark p={p} />
                    <span style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: active ? 'var(--violet-700)' : 'var(--text-muted)',
                    }}>
                      {I.PlatformName(p).split(' ')[0]}
                    </span>
                    {active && (
                      <div className="platform-btn-check">
                        <I.Check size={9} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Composer */}
          <div className="card">
            {/* Title row */}
            <div style={{ padding: '18px 20px 0' }}>
              <input
                className="input"
                style={{
                  border: 'none', padding: '0 0 14px 0', borderRadius: 0,
                  fontSize: 18, fontWeight: 700,
                  fontFamily: "'Inter Tight', sans-serif",
                  letterSpacing: '-0.022em', background: 'transparent',
                  color: 'var(--text-strong)',
                }}
                placeholder="Post title (internal)…"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="hr" />

            {/* Content area */}
            <div style={{ padding: '16px 20px' }}>
              <textarea
                className="composer-textarea"
                placeholder="What do you want to share?"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={9}
              />
            </div>

            {/* Toolbar */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border-soft)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              {[
                { icon: <I.Image />, title: 'Add image' },
                { icon: <I.Video />, title: 'Add video' },
                { icon: <I.Smile />, title: 'Emoji' },
                { icon: <I.Paperclip />, title: 'Attach' },
                { icon: <I.Hash />, title: 'Hashtag' },
              ].map((btn, i) => (
                <button key={i} className="icon-btn" title={btn.title}
                  style={{ width: 32, height: 32 }}>
                  {React.cloneElement(btn.icon, { size: 16 })}
                </button>
              ))}

              {/* Character counters */}
              <div className="flex items-center gap-4 ml-auto">
                {platforms.map(p => {
                  const limit     = I.PlatformLimit(p);
                  const remaining = limit - content.length;
                  const pct       = Math.min(content.length / limit, 1);
                  const warn      = remaining < 40;
                  const over      = remaining < 0;
                  return (
                    <div key={p} className="flex items-center gap-2">
                      <I.PlatformMark p={p} size="sm" />
                      <span className="mono" style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: over ? 'var(--error)' : warn ? 'var(--warning)' : 'var(--text-subtle)',
                        minWidth: 28,
                        textAlign: 'right',
                      }}>
                        {remaining < 0 ? remaining : remaining}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="6.5" fill="none" stroke="var(--border)" strokeWidth="1.5" />
                        <circle cx="8" cy="8" r="6.5" fill="none"
                          stroke={over ? 'var(--error)' : 'var(--violet-500)'}
                          strokeWidth="1.5"
                          strokeDasharray={`${pct * 40.8} 40.8`}
                          transform="rotate(-90 8 8)"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI co-writer */}
          <div className="ai-card">
            <div className="flex items-center justify-between mb-4" style={{ position: 'relative' }}>
              <div className="flex items-center gap-3">
                <div className="ai-pill"><I.Sparkles size={11} /> AI co-writer</div>
                <span className="text-xs text-muted font-med">
                  Trained on your last 30 posts
                </span>
              </div>
              <span className="text-xs text-subtle font-semi">Free this week</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
              position: 'relative',
            }}>
              {[
                { kind: 'caption',  icon: <I.Wand />,    label: 'Generate caption', desc: 'Write from scratch'      },
                { kind: 'hashtags', icon: <I.Hash />,    label: 'Smart hashtags',   desc: 'Trending + relevant'     },
                { kind: 'rewrite',  icon: <I.Refresh />, label: 'Rewrite',          desc: 'Different tone'          },
                { kind: 'improve',  icon: <I.TrendUp />, label: 'Boost engagement', desc: 'Add hook + question'     },
              ].map(tool => (
                <AIToolBtn key={tool.kind} {...tool} busy={aiBusy === tool.kind} onClick={() => runAI(tool.kind)} />
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div
              className="font-tight font-semi text-strong mb-4"
              style={{ fontSize: 14, letterSpacing: '-0.014em' }}
            >
              Schedule
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label className="label">Date</label>
                <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div>
                <label className="label">Time</label>
                <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
              </div>
            </div>

            {/* AI suggestion banner */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px',
              background: 'var(--violet-50)',
              borderRadius: 10,
              border: '1px solid var(--violet-100)',
            }}>
              <I.Sparkles size={15} style={{ color: 'var(--violet-500)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--violet-700)', fontWeight: 500, flex: 1, lineHeight: 1.4 }}>
                AI suggests <strong>Wed 10:00 AM</strong> — peak engagement for your X audience.
              </span>
              <button
                className="btn btn-sm"
                style={{ background: 'var(--violet-500)', color: 'white', height: 28, flexShrink: 0 }}
              >
                Use
              </button>
            </div>
          </div>
        </div>

        {/* ─── Right: preview + summary ─── */}
        <div className="col gap-4">

          {/* Live preview */}
          <div className="card" style={{ position: 'sticky', top: 72 }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div
                className="font-tight font-semi text-strong"
                style={{ fontSize: 14, letterSpacing: '-0.014em' }}
              >
                Live preview
              </div>
              {platforms.length > 0 && (
                <div className="seg" style={{ padding: 2 }}>
                  {platforms.map(p => (
                    <button
                      key={p}
                      className={activePreview === p ? 'active' : ''}
                      onClick={() => setActivePreview(p)}
                      style={{ padding: '0 9px', height: 24 }}
                    >
                      <I.PlatformMark p={p} size="sm" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{
              padding: 18,
              background: '#F7F7F9',
              borderBottomLeftRadius: 14,
              borderBottomRightRadius: 14,
            }}>
              {platforms.includes(activePreview)
                ? <PostPreview platform={activePreview} title={title} content={content} />
                : (
                  <div className="empty" style={{ padding: '40px 20px' }}>
                    <p className="text-sm text-subtle">Select a platform to preview</p>
                  </div>
                )
              }
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div
              className="font-tight font-semi text-strong mb-4"
              style={{ fontSize: 14, letterSpacing: '-0.014em' }}
            >
              Summary
            </div>
            <div className="col gap-4">
              <SummaryRow icon={<I.Calendar size={14} />} label="Scheduled" value={`${formatDate(date)} · ${time}`} />
              <SummaryRow icon={<I.Layers size={14} />}   label="Channels"  value={platforms.length ? platforms.map(p => I.PlatformName(p).split(' ')[0]).join(', ') : 'None selected'} />
              <SummaryRow icon={<I.Activity size={14} />} label="Est. reach" value="~14.2K accounts" />
              <SummaryRow icon={<I.Target size={14} />}   label="Exp. engagement" value="4.8% (above avg)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function AIToolBtn({ icon, kind, label, desc, busy, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="lift"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 11,
        padding: 14, borderRadius: 11,
        background: 'white', border: '1.5px solid var(--border)',
        textAlign: 'left', cursor: busy ? 'wait' : 'pointer',
        opacity: busy ? 0.65 : 1,
        transition: 'all var(--dur-base) var(--ease)',
        fontFamily: 'inherit',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: 'var(--gradient-ai)', color: 'white',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        {React.cloneElement(icon, { size: 15 })}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 2 }}>
          {busy ? 'Generating…' : label}
        </div>
        <div className="text-xs text-subtle">{desc}</div>
      </div>
    </button>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'var(--surface-sunken)', color: 'var(--text-subtle)',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="text-xs text-faint uppercase" style={{ letterSpacing: '0.05em', fontWeight: 700, marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ── Platform-specific post previews ── */

function PostPreview({ platform, content, title }) {
  const I = window.Ic;

  if (platform === 'x') {
    return (
      <div style={{
        background: 'white', borderRadius: 12, padding: 16,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)',
      }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="avatar" style={{ width: 36, height: 36, fontSize: 12 }}>SJ</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>
              Sarah Johnson <span style={{ color: '#1D9BF0', marginLeft: 2 }}>✓</span>
            </div>
            <div className="text-xs text-subtle">@sarahjohnson · just now</div>
          </div>
          <button className="icon-btn ml-auto" style={{ width: 28, height: 28 }}><I.MoreHoriz /></button>
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-strong)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          {content}
        </div>
        <div className="flex justify-between mt-3 text-xs text-subtle" style={{ paddingTop: 10, borderTop: '1px solid var(--border-soft)' }}>
          <span>💬 12</span><span>🔁 84</span><span>♥ 312</span><span>👁 4.2K</span>
        </div>
      </div>
    );
  }

  if (platform === 'fb') {
    return (
      <div style={{
        background: 'white', borderRadius: 12, padding: 16,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)',
      }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="avatar" style={{ width: 36, height: 36, background: 'var(--p-fb)', fontSize: 12 }}>SJ</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>Sarah Johnson</div>
            <div className="text-xs text-subtle">Just now · 🌎</div>
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-strong)', whiteSpace: 'pre-wrap', lineHeight: 1.55, marginBottom: 12 }}>
          {content}
        </div>
        <div style={{
          height: 140, borderRadius: 8,
          background: 'repeating-linear-gradient(45deg, #F4F4F5, #F4F4F5 12px, #E4E4E7 12px, #E4E4E7 24px)',
          display: 'grid', placeItems: 'center',
          color: 'var(--text-faint)', fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          [ image ]
        </div>
        <div className="flex gap-4 mt-3 text-sm text-subtle font-med" style={{ paddingTop: 10, borderTop: '1px solid var(--border-soft)' }}>
          <span>👍 Like</span><span>💬 Comment</span><span>↗ Share</span>
        </div>
      </div>
    );
  }

  if (platform === 'ig') {
    return (
      <div style={{
        background: 'white', borderRadius: 12,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden',
      }}>
        <div className="flex items-center gap-2" style={{ padding: '12px 14px' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--p-ig)', padding: 2 }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'white', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>
              SJ
            </div>
          </div>
          <div className="font-semi flex-1" style={{ fontSize: 13 }}>cadence.studio</div>
          <I.MoreHoriz />
        </div>
        <div style={{ aspectRatio: '1 / 1', background: 'var(--p-ig)', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
          [ post image ]
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div className="flex gap-3 mb-2" style={{ fontSize: 18 }}>♥ 💬 ↗<span className="ml-auto">🔖</span></div>
          <div className="text-xs font-semi mb-1">2,148 likes</div>
          <div style={{ fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
            <strong>cadence.studio</strong> {content}
          </div>
        </div>
      </div>
    );
  }

  // LinkedIn
  return (
    <div style={{
      background: 'white', borderRadius: 12, padding: 16,
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)',
    }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="avatar md" style={{ background: 'var(--p-li)' }}>SJ</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13.5 }}>Sarah Johnson</div>
          <div className="text-xs text-subtle">Head of Content at Cadence · 1st</div>
          <div className="text-xs text-faint">now · 🌐</div>
        </div>
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--text-strong)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
        {content}
      </div>
      <div className="flex gap-4 mt-3 text-sm text-subtle font-med" style={{ paddingTop: 10, borderTop: '1px solid var(--border-soft)' }}>
        <span>👍 Like</span><span>💬 Comment</span><span>🔁 Repost</span><span>↗ Send</span>
      </div>
    </div>
  );
}

function formatDate(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

window.CreatePost  = CreatePost;
window.PostPreview = PostPreview;

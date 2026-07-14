// Create Post — premium composer with live preview, AI tools, and media upload
function CreatePost({ onSchedule, onSaveDraft }) {
  const I = window.Ic;

  /* ── State ── */
  const [title,         setTitle]         = React.useState('Product Launch Announcement');
  const [content,       setContent]       = React.useState('🚀 Excited to announce our new AI-powered features! Transform your social media strategy with intelligent automation that learns your voice and audience.\n\nLink in bio →');
  const [platforms,     setPlatforms]     = React.useState(['x', 'li']);
  const [date,          setDate]          = React.useState('2026-05-28');
  const [time,          setTime]          = React.useState('10:00');
  const [activePreview, setActivePreview] = React.useState('x');
  const [aiBusy,        setAiBusy]        = React.useState(null);
  const [tone,          setTone]          = React.useState('casual');
  const [aiPrompt,      setAiPrompt]      = React.useState('');
  const [mediaFiles,    setMediaFiles]    = React.useState([]);
  const [isDragOver,    setIsDragOver]    = React.useState(false);

  /* ── Computed ── */
  const wordCount      = content.trim() ? content.trim().split(/\s+/).length : 0;
  const xTweets        = content.length > 280 ? Math.ceil(content.length / 280) : 1;
  const isOverAnyLimit = platforms.some(p => content.length > I.PlatformLimit(p));

  const PLATFORM_META = {
    x:  { name: 'X',         followers: '24.1K', color: '#000000' },
    fb: { name: 'Facebook',  followers: '12.8K', color: '#1877F2' },
    ig: { name: 'Instagram', followers: '38.4K', color: '#E1306C' },
    li: { name: 'LinkedIn',  followers: '9.3K',  color: '#0A66C2' },
  };

  const checklist = [
    { id: 'plat',  label: 'Platform selected',   ok: platforms.length > 0,                              optional: false },
    { id: 'copy',  label: 'Content written',      ok: content.trim().length > 50,  warn: content.trim().length > 0 && content.trim().length <= 50, optional: false },
    { id: 'limit', label: 'Within char limits',   ok: !isOverAnyLimit && platforms.length > 0,          optional: false },
    { id: 'media', label: 'Media attached',       ok: mediaFiles.length > 0,                            optional: true  },
    { id: 'hash',  label: 'Hashtags added',       ok: content.includes('#'),                            optional: true  },
    { id: 'sched', label: 'Time scheduled',       ok: !!(date && time),                                 optional: false },
  ];

  /* ── Platform toggle ── */
  const togglePlatform = (p) => {
    setPlatforms(prev => {
      const next = prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p];
      if (p === activePreview && !next.includes(p) && next.length > 0) {
        setActivePreview(next[0]);
      }
      return next;
    });
  };

  /* ── AI actions ── */
  const runAI = (kind) => {
    setAiBusy(kind);
    setTimeout(() => {
      if (kind === 'caption') {
        setContent("🚀 We just shipped something we've been dreaming about for months: AI that actually understands your brand voice.\n\nTrain it once, schedule forever. Try it free →");
      } else if (kind === 'hashtags') {
        setContent(prev => prev + '\n\n#AI #SocialMedia #Marketing #ContentCreation #GrowthHacking');
      } else if (kind === 'rewrite') {
        setContent("Big news. Our new AI features turn hours of content work into minutes — they learn your voice, suggest the next post, and ship to every channel from one queue.\n\nLink in bio.");
      } else if (kind === 'improve') {
        setContent(prev => '🎯 ' + prev + '\n\nWhat would you automate first? Drop it in the comments 👇');
      }
      setAiBusy(null);
    }, 700);
  };

  /* ── Schedule presets ── */
  const applyPreset = (preset) => {
    if      (preset === 'best')  { setDate('2026-05-28'); setTime('10:00'); }
    else if (preset === 'today') { setDate('2026-05-25'); setTime('12:00'); }
    else if (preset === 'tmrw')  { setDate('2026-05-26'); setTime('09:00'); }
    else if (preset === 'mon')   { setDate('2026-06-01'); setTime('09:00'); }
  };

  /* ── Media ── */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = [...e.dataTransfer.files].slice(0, Math.max(0, 4 - mediaFiles.length));
    setMediaFiles(prev => [...prev, ...files.map((f, i) => ({ id: Date.now() + i, name: f.name, type: f.type }))]);
  };
  const removeMedia = (id) => setMediaFiles(prev => prev.filter(f => f.id !== id));
  const addFakeMedia = () => {
    if (mediaFiles.length >= 4) return;
    setMediaFiles(prev => [...prev, { id: Date.now(), name: 'image.jpg', type: 'image/jpeg' }]);
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

      {/* Two-column grid */}
      <div className="compose-grid">

        {/* ─── LEFT: Editor column ─── */}
        <div className="col gap-4">

          {/* ── Platform selector ── */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div className="font-tight font-semi text-strong" style={{ fontSize: 14, letterSpacing: '-0.014em' }}>
                  Publish to
                </div>
                <div className="text-xs text-subtle" style={{ marginTop: 2 }}>
                  {platforms.length === 0
                    ? 'Select at least one channel'
                    : `${platforms.length} channel${platforms.length !== 1 ? 's' : ''} selected`}
                </div>
              </div>
              {platforms.length === 0 && (
                <span style={{
                  fontSize: 11.5, fontWeight: 700, color: 'var(--error)',
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  padding: '3px 10px', borderRadius: 20,
                }}>
                  Required
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {['x', 'fb', 'ig', 'li'].map(p => {
                const active = platforms.includes(p);
                const meta   = PLATFORM_META[p];
                const over   = content.length > I.PlatformLimit(p);
                return (
                  <button
                    key={p}
                    className={`platform-btn${active ? ' active' : ''}`}
                    onClick={() => togglePlatform(p)}
                  >
                    <I.PlatformMark p={p} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: active ? 'var(--violet-700)' : 'var(--text-muted)', lineHeight: 1.2 }}>
                        {meta.name}
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-faint)', marginTop: 2, fontWeight: 500 }}>
                        {meta.followers}
                      </div>
                    </div>
                    {active && over ? (
                      <div style={{ position: 'absolute', bottom: 5, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--error)', background: '#FEF2F2', padding: '1px 6px', borderRadius: 99 }}>
                          Over limit
                        </span>
                      </div>
                    ) : active ? (
                      <div className="platform-btn-check"><I.Check size={9} /></div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Composer ── */}
          <div className="card">

            {/* Title input */}
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

            {/* Per-platform character bars */}
            {platforms.length > 0 && (
              <div style={{ padding: '12px 20px 4px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {platforms.map(p => {
                  const limit = I.PlatformLimit(p);
                  const pct   = content.length / limit;
                  const over  = content.length > limit;
                  const warn  = !over && (limit - content.length) < 40;
                  return (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <I.PlatformMark p={p} size="sm" />
                      <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'var(--zinc-100)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(pct * 100, 100)}%`,
                          borderRadius: 99,
                          background: over ? 'var(--error)' : warn ? 'var(--warning)' : 'var(--violet-400)',
                          transition: 'width 0.12s ease, background 0.15s',
                        }} />
                      </div>
                      <span className="mono" style={{
                        fontSize: 10.5, fontWeight: 700, minWidth: 34, textAlign: 'right',
                        color: over ? 'var(--error)' : warn ? 'var(--warning)' : 'var(--text-faint)',
                      }}>
                        {limit - content.length}
                      </span>
                    </div>
                  );
                })}
                {platforms.includes('x') && xTweets > 1 && (
                  <div style={{ paddingTop: 3 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--violet-600)',
                      background: 'var(--violet-50)', border: '1px solid var(--violet-200)',
                      padding: '2px 9px', borderRadius: 99,
                    }}>
                      Thread · {xTweets} tweets
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Textarea */}
            <div style={{ padding: '10px 20px 4px' }}>
              <textarea
                className="composer-textarea"
                placeholder="What do you want to share? Start writing or let AI do it…"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={10}
                style={{ minHeight: 200 }}
              />
            </div>

            {/* Composer toolbar */}
            <div style={{
              padding: '10px 20px 14px',
              borderTop: '1px solid var(--border-soft)',
              display: 'flex', alignItems: 'center', gap: 2,
            }}>
              {[
                { icon: <I.Image />,       title: 'Add image' },
                { icon: <I.Video />,       title: 'Add video' },
                { icon: <I.Link />,        title: 'Insert link' },
                { icon: <I.Smile />,       title: 'Emoji' },
                { icon: <I.Hash />,        title: 'Add hashtag' },
                { icon: <I.Paperclip />,   title: 'Attach file' },
              ].map((btn, i) => (
                <button key={i} className="icon-btn" title={btn.title}
                  style={{ width: 32, height: 32 }}>
                  {React.cloneElement(btn.icon, { size: 16 })}
                </button>
              ))}

              <div style={{ width: 1, height: 16, background: 'var(--border-soft)', margin: '0 6px' }} />

              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--text-faint)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </span>
            </div>
          </div>

          {/* ── Media upload ── */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div className="font-tight font-semi text-strong" style={{ fontSize: 14, letterSpacing: '-0.014em' }}>
                  Media
                </div>
                <div className="text-xs text-subtle" style={{ marginTop: 2 }}>
                  Images, GIFs, video — up to 4 files
                </div>
              </div>
              <span className="text-xs text-faint font-semi">{mediaFiles.length}/4</span>
            </div>

            {/* Uploaded file thumbnails */}
            {mediaFiles.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
                {mediaFiles.map(f => (
                  <div key={f.id} style={{
                    position: 'relative', aspectRatio: '1',
                    borderRadius: 8, background: 'var(--zinc-100)',
                    border: '1px solid var(--border)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  }}>
                    {f.type && f.type.startsWith('video')
                      ? <I.Video size={18} style={{ color: 'var(--text-faint)' }} />
                      : <I.Image size={18} style={{ color: 'var(--text-faint)' }} />
                    }
                    <span style={{
                      fontSize: 9.5, color: 'var(--text-faint)', marginTop: 4,
                      padding: '0 4px', textAlign: 'center', wordBreak: 'break-all', lineHeight: 1.2,
                    }}>
                      {f.name.length > 10 ? f.name.substring(0, 9) + '…' : f.name}
                    </span>
                    <button
                      onClick={() => removeMedia(f.id)}
                      style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 16, height: 16, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.5)', color: 'white',
                        border: 'none', cursor: 'pointer',
                        display: 'grid', placeItems: 'center',
                        fontSize: 9, fontWeight: 800, lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone */}
            {mediaFiles.length < 4 && (
              <div
                className={`media-zone${isDragOver ? ' drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={addFakeMedia}
              >
                <div style={{ display: 'flex', gap: 10, color: isDragOver ? 'var(--violet-500)' : 'var(--text-faint)', transition: 'color 0.15s' }}>
                  <I.Image size={20} />
                  <I.Video size={20} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: isDragOver ? 'var(--violet-700)' : 'var(--text-muted)', marginBottom: 3, transition: 'color 0.15s' }}>
                    {isDragOver ? 'Release to upload' : 'Drop media here'}
                  </div>
                  <div className="text-xs text-faint">
                    or{' '}
                    <span style={{ color: 'var(--violet-500)', fontWeight: 600 }}>browse files</span>
                    {' '}· PNG, JPG, GIF, MP4 up to 50 MB
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── AI co-writer ── */}
          <div className="ai-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="ai-pill"><I.Sparkles size={11} /> AI co-writer</div>
                <span className="text-xs text-muted font-med">Trained on your last 30 posts</span>
              </div>
              <span className="text-xs text-subtle font-semi">Free this week</span>
            </div>

            {/* Tone selector */}
            <div style={{ marginBottom: 16 }}>
              <div className="text-xs text-faint uppercase" style={{ letterSpacing: '0.06em', fontWeight: 700, marginBottom: 8 }}>
                Tone
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { key: 'professional', label: '💼 Professional' },
                  { key: 'casual',       label: '😊 Casual'       },
                  { key: 'bold',         label: '⚡ Bold'          },
                  { key: 'witty',        label: '✨ Witty'         },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTone(t.key)}
                    style={{
                      padding: '5px 13px', borderRadius: 20,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      border: tone === t.key ? '1.5px solid var(--violet-500)' : '1.5px solid var(--border)',
                      background: tone === t.key ? 'var(--violet-50)' : 'white',
                      color: tone === t.key ? 'var(--violet-700)' : 'var(--text-muted)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom prompt */}
            <div style={{ marginBottom: 16 }}>
              <textarea
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder={`Tell AI what to write (${tone} tone)… e.g. "Announce our new feature with excitement"`}
                rows={2}
                style={{
                  width: '100%', border: '1.5px solid var(--border)',
                  borderRadius: 10, padding: '9px 12px',
                  fontSize: 13, fontFamily: 'inherit',
                  background: 'white', color: 'var(--text-strong)',
                  resize: 'none', outline: 'none', lineHeight: 1.5,
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--violet-400)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* AI tool buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {[
                { kind: 'caption',  icon: <I.Wand />,    label: 'Generate caption', desc: 'Write from scratch'  },
                { kind: 'hashtags', icon: <I.Hash />,    label: 'Smart hashtags',   desc: 'Trending + relevant' },
                { kind: 'rewrite',  icon: <I.Refresh />, label: 'Rewrite',          desc: 'Different tone'      },
                { kind: 'improve',  icon: <I.TrendUp />, label: 'Boost engagement', desc: 'Add hook + question' },
              ].map(tool => (
                <AIToolBtn
                  key={tool.kind}
                  {...tool}
                  busy={aiBusy === tool.kind}
                  onClick={() => runAI(tool.kind)}
                />
              ))}
            </div>
          </div>

          {/* ── Schedule ── */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="font-tight font-semi text-strong" style={{ fontSize: 14, letterSpacing: '-0.014em', marginBottom: 14 }}>
              Schedule
            </div>

            {/* Quick presets */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              {[
                { key: 'best',  label: '⚡ Best time',   badge: 'AI' },
                { key: 'today', label: 'Today noon'                  },
                { key: 'tmrw',  label: 'Tomorrow 9am'               },
                { key: 'mon',   label: 'Monday'                      },
              ].map(p => (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 11px', borderRadius: 8,
                    fontSize: 12, fontWeight: 600,
                    border: '1.5px solid var(--border)', background: 'var(--surface)',
                    color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--surface-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
                >
                  {p.label}
                  {p.badge && (
                    <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--violet-500)', background: 'var(--violet-50)', border: '1px solid var(--violet-200)', padding: '1px 5px', borderRadius: 99 }}>
                      {p.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Date + time inputs */}
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
                onClick={() => applyPreset('best')}
              >
                Use
              </button>
            </div>
          </div>

        </div>{/* end left column */}

        {/* ─── RIGHT: Preview + checklist ─── */}
        <div className="col gap-4">

          {/* ── Live preview (sticky) ── */}
          <div className="card" style={{ position: 'sticky', top: 72 }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div className="font-tight font-semi text-strong" style={{ fontSize: 14, letterSpacing: '-0.014em' }}>
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
              minHeight: 160,
            }}>
              {platforms.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 20px', gap: 10, textAlign: 'center' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--zinc-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)' }}>
                    <I.Eye size={20} />
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-muted)' }}>
                    Select a platform above
                  </div>
                  <div className="text-xs text-faint">
                    Preview will appear here
                  </div>
                </div>
              ) : platforms.includes(activePreview) ? (
                <PostPreview platform={activePreview} title={title} content={content} />
              ) : null}
            </div>
          </div>

          {/* ── Readiness check + stats ── */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="font-tight font-semi text-strong" style={{ fontSize: 14, letterSpacing: '-0.014em', marginBottom: 16 }}>
              Readiness check
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {checklist.map(item => (
                <ChecklistRow key={item.id} item={item} />
              ))}
            </div>

            <div className="hr" style={{ margin: '16px -20px', width: 'calc(100% + 40px)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <SummaryRow icon={<I.Calendar size={14} />} label="Scheduled"       value={`${formatDate(date)} · ${time}`} />
              <SummaryRow icon={<I.Activity size={14} />} label="Est. reach"      value="~14.2K accounts"                 />
              <SummaryRow icon={<I.Target size={14} />}   label="Exp. engagement" value="4.8% (above avg)"                />
            </div>
          </div>

        </div>{/* end right column */}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════ */

/* ── AI tool button ── */
function AIToolBtn({ icon, kind, label, desc, busy, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="lift"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '13px 14px', borderRadius: 11,
        background: 'white', border: '1.5px solid var(--border)',
        textAlign: 'left', cursor: busy ? 'wait' : 'pointer',
        opacity: busy ? 0.65 : 1,
        transition: 'all var(--dur-base) var(--ease)',
        fontFamily: 'inherit',
        width: '100%',
      }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'var(--gradient-ai)', color: 'white',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        {React.cloneElement(icon, { size: 14 })}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 2, lineHeight: 1.2 }}>
          {busy ? 'Writing…' : label}
        </div>
        <div className="text-xs text-subtle">{desc}</div>
      </div>
    </button>
  );
}

/* ── Checklist row ── */
function ChecklistRow({ item }) {
  let bg, border, color, symbol;
  if (item.ok) {
    bg = 'var(--success-soft)'; border = 'var(--success)'; color = 'var(--success)'; symbol = '✓';
  } else if (item.warn) {
    bg = '#FFFBEB'; border = '#FCD34D'; color = '#D97706'; symbol = '!';
  } else if (item.optional) {
    bg = 'var(--zinc-100)'; border = 'var(--zinc-300)'; color = 'var(--text-faint)'; symbol = '–';
  } else {
    bg = '#FEF2F2'; border = '#FCA5A5'; color = '#EF4444'; symbol = '!';
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        display: 'grid', placeItems: 'center', fontSize: 10.5, fontWeight: 800, lineHeight: 1,
        background: bg, border: `1.5px solid ${border}`, color,
      }}>
        {symbol}
      </div>
      <span style={{
        fontSize: 13, fontWeight: 500, flex: 1,
        color: item.ok ? 'var(--text-strong)' : 'var(--text-muted)',
      }}>
        {item.label}
      </span>
      {item.optional && !item.ok && (
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-faint)' }}>optional</span>
      )}
    </div>
  );
}

/* ── Summary stat row ── */
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

/* ═══════════════════════════════════════════════════════
   Platform-specific post previews
   ═══════════════════════════════════════════════════════ */

function PostPreview({ platform, content, title }) {
  const I = window.Ic;
  const [liExpanded, setLiExpanded] = React.useState(false);

  /* ── X / Twitter ── */
  if (platform === 'x') {
    const LIMIT   = 280;
    const isThread = content.length > LIMIT;
    const tweetCount = isThread ? Math.ceil(content.length / LIMIT) : 1;
    const tweet1  = isThread ? content.substring(0, LIMIT - 3) + '…' : content;

    return (
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <div className="avatar" style={{ width: 36, height: 36, fontSize: 12, flexShrink: 0 }}>SJ</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, lineHeight: 1.2 }}>
                Sarah Johnson{' '}
                <span style={{ color: '#1D9BF0', fontSize: 13 }}>✓</span>
              </div>
              <div className="text-xs text-subtle">@sarahjohnson · just now</div>
            </div>
            <button className="icon-btn" style={{ width: 28, height: 28, flexShrink: 0 }}><I.MoreHoriz /></button>
          </div>

          <div style={{ fontSize: 14.5, color: 'var(--text-strong)', whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
            {tweet1}
          </div>

          {isThread && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-faint)' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--zinc-100)', display: 'grid', placeItems: 'center' }}>
                  <I.MoreHoriz size={12} />
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#1D9BF0', fontWeight: 600 }}>
                Show thread · {tweetCount} tweets
              </span>
            </div>
          )}
        </div>

        <div style={{ padding: '10px 16px 12px', borderTop: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between' }}>
          {[['💬', '12'], ['🔁', '84'], ['♥', '312'], ['👁', '4.2K']].map(([icon, val]) => (
            <span key={val} className="text-xs text-subtle" style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
              {icon} {val}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* ── Facebook ── */
  if (platform === 'fb') {
    return (
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <div className="avatar" style={{ width: 38, height: 38, background: 'var(--p-fb)', fontSize: 12, flexShrink: 0 }}>SJ</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, lineHeight: 1.2 }}>Sarah Johnson</div>
              <div className="text-xs text-subtle">Just now · 🌎</div>
            </div>
            <button className="icon-btn ml-auto" style={{ width: 28, height: 28 }}><I.MoreHoriz /></button>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-strong)', whiteSpace: 'pre-wrap', lineHeight: 1.55, marginBottom: 12 }}>
            {content}
          </div>
          <div style={{
            height: 130, borderRadius: 8, overflow: 'hidden',
            background: 'repeating-linear-gradient(45deg, #F4F4F5, #F4F4F5 12px, #E4E4E7 12px, #E4E4E7 24px)',
            display: 'grid', placeItems: 'center',
            color: 'var(--text-faint)', fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            image placeholder
          </div>
        </div>
        <div style={{ padding: '10px 16px 12px', borderTop: '1px solid var(--border-soft)', display: 'flex', gap: 16 }}>
          {['👍 Like', '💬 Comment', '↗ Share'].map(a => (
            <span key={a} className="text-sm text-subtle font-med">{a}</span>
          ))}
        </div>
      </div>
    );
  }

  /* ── Instagram ── */
  if (platform === 'ig') {
    const MAX_IG = 125;
    const igTruncated = content.length > MAX_IG;
    return (
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)',
            padding: 2, boxSizing: 'border-box',
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'white', border: '1px solid white', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 800, color: '#333' }}>
              SJ
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>cadence.studio</div>
            <div className="text-xs text-faint">Sponsored</div>
          </div>
          <I.MoreHoriz size={18} style={{ color: 'var(--text-faint)' }} />
        </div>

        {/* Image placeholder */}
        <div style={{
          aspectRatio: '1 / 1',
          background: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)',
          display: 'grid', placeItems: 'center',
        }}>
          <I.Image size={36} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </div>

        {/* Actions */}
        <div style={{ padding: '10px 14px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 20 }}>
            <span>♥</span><span>💬</span><span>↗</span>
            <span style={{ marginLeft: 'auto' }}>🔖</span>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>2,148 likes</div>
          <div style={{ fontSize: 13, lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
            <strong>cadence.studio</strong>{' '}
            {igTruncated ? content.substring(0, MAX_IG) + '… ' : content}
            {igTruncated && (
              <span style={{ color: 'var(--text-faint)', fontWeight: 600, cursor: 'pointer' }}>more</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── LinkedIn ── */
  const LI_MAX = 250;
  const liTruncated = !liExpanded && content.length > LI_MAX;
  const liText = liTruncated ? content.substring(0, LI_MAX) : content;

  return (
    <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <div className="avatar md" style={{ background: 'var(--p-li)', flexShrink: 0 }}>SJ</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5, lineHeight: 1.2 }}>Sarah Johnson</div>
            <div className="text-xs text-subtle" style={{ marginBottom: 1 }}>Head of Content at Cadence · 1st</div>
            <div className="text-xs text-faint" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              Just now · <I.Globe size={11} />
            </div>
          </div>
          <button className="icon-btn ml-auto" style={{ width: 28, height: 28, flexShrink: 0 }}><I.MoreHoriz /></button>
        </div>

        <div style={{ fontSize: 14, color: 'var(--text-strong)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {liText}
          {liTruncated && (
            <>
              {'… '}
              <span
                style={{ color: 'var(--text-default)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setLiExpanded(true)}
              >
                …see more
              </span>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: '10px 16px 12px', borderTop: '1px solid var(--border-soft)', display: 'flex', gap: 16 }}>
        {['👍 Like', '💬 Comment', '🔁 Repost', '↗ Send'].map(a => (
          <span key={a} className="text-xs text-subtle font-med">{a}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Utility ── */
function formatDate(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

window.CreatePost  = CreatePost;
window.PostPreview = PostPreview;

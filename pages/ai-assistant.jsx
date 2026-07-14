// AI Studio — premium Cadence AI workspace
function AIAssistant() {
  const I = window.Ic;

  /* ── State ── */
  const [prompt,          setPrompt]          = React.useState('');
  const [messages,        setMessages]        = React.useState([]);
  const [busy,            setBusy]            = React.useState(false);
  const [selectedModel,   setSelectedModel]   = React.useState('cadence-4');
  const [modelOpen,       setModelOpen]       = React.useState(false);
  const [voiceOpen,       setVoiceOpen]       = React.useState(false);
  const [voiceStyle,      setVoiceStyle]      = React.useState('conversational');
  const [voicePlatform,   setVoicePlatform]   = React.useState('all');
  const [platformCtx,     setPlatformCtx]     = React.useState('all');
  const [activeHistoryId, setActiveHistoryId] = React.useState(null);
  const [searchQuery,     setSearchQuery]     = React.useState('');

  const msgEndRef  = React.useRef(null);
  const taRef      = React.useRef(null);

  /* ── Auto-scroll ── */
  React.useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  /* ── Close dropdowns on outside click ── */
  React.useEffect(() => {
    if (!modelOpen && !voiceOpen) return;
    const close = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setModelOpen(false);
        setVoiceOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [modelOpen, voiceOpen]);

  /* ── Data ── */
  const MODELS = [
    { id: 'cadence-4',     label: 'Cadence AI',    desc: 'Fast, creative, brand-aware', badge: 'Default', icon: '⚡' },
    { id: 'cadence-4-pro', label: 'Cadence-4 Pro', desc: 'Deeper reasoning, longer context', badge: 'Pro',  icon: '🧠' },
    { id: 'gpt4o',         label: 'GPT-4o',        desc: 'Via OpenAI integration',      badge: null,     icon: '🤖' },
  ];

  const VOICES = [
    { id: 'conversational', label: 'Conversational', desc: 'Warm, human, approachable'   },
    { id: 'professional',   label: 'Professional',   desc: 'Polished and authoritative'  },
    { id: 'bold',           label: 'Bold & Direct',  desc: 'Short sentences, big energy' },
    { id: 'storyteller',    label: 'Storyteller',    desc: 'Narrative-first, emotional'  },
  ];

  const HISTORY_GROUPS = [
    {
      label: 'Today',
      items: [
        { id: 'h1', title: 'Q1 retrospective thread', count: 4 },
      ],
    },
    {
      label: 'Yesterday',
      items: [
        { id: 'h2', title: "Sarah's success story angles", count: 8 },
      ],
    },
    {
      label: 'Last week',
      items: [
        { id: 'h3', title: 'Hashtag strategy for AI launch', count: 12 },
        { id: 'h4', title: 'Brand voice training session',   count: 18 },
        { id: 'h5', title: 'Holiday content calendar',       count: 24 },
      ],
    },
  ];

  const PROMPTS = [
    { icon: <I.Lightbulb />, title: 'Brainstorm 10 post ideas',          desc: 'For our Q3 product launch'      },
    { icon: <I.Wand />,      title: 'Rewrite in our brand voice',        desc: 'Paste a draft, get 3 takes'    },
    { icon: <I.TrendUp />,   title: 'Best time to post this Friday',     desc: 'For my LinkedIn audience'       },
    { icon: <I.Target />,    title: 'Optimize this caption for clicks',  desc: 'Add a CTA, sharpen the hook'   },
    { icon: <I.Megaphone />, title: 'Draft a thread about our values',   desc: '5 posts, one cohesive arc'     },
    { icon: <I.Hash />,      title: 'Hashtags for AI marketing content', desc: 'Trending + niche, ranked'      },
  ];

  const QUICK_ACTIONS = [
    { emoji: '💡', label: 'Generate ideas',  prompt: 'Give me 10 creative post ideas for our upcoming product launch, in our brand voice.' },
    { emoji: '✍️', label: 'Rewrite copy',    prompt: 'Rewrite this in our conversational brand voice: ' },
    { emoji: '📈', label: 'Find best time',  prompt: 'When should I post on LinkedIn this week for maximum engagement? Give me 3 time slots with reasoning.' },
    { emoji: '#️⃣', label: 'Smart hashtags', prompt: 'Suggest 15 hashtags for our AI marketing content — mix of broad reach and niche.' },
  ];

  /* ── Filtered history ── */
  const filteredGroups = searchQuery.trim()
    ? [{
        label: 'Results',
        items: HISTORY_GROUPS.flatMap(g => g.items).filter(h =>
          h.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }]
    : HISTORY_GROUPS;

  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];
  const currentVoice = VOICES.find(v => v.id === voiceStyle)    || VOICES[0];

  /* ── Send message ── */
  const send = (text) => {
    const t = (text || prompt).trim();
    if (!t || busy) return;
    setMessages(prev => [...prev, { role: 'user', text: t, ts: new Date() }]);
    setPrompt('');
    if (taRef.current) taRef.current.style.height = 'auto';
    setBusy(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        ts: new Date(),
        text: 'Here are three angles you could take, in your usual conversational tone:',
        cards: [
          {
            title: '"The behind-the-scenes story"',
            body: 'Lead with a vulnerable moment from the build process. Audiences love a glimpse into the work, not just the result.',
            platform: 'X + LinkedIn',
          },
          {
            title: '"The customer-first angle"',
            body: "Open with Sarah's 300% engagement number, then peel back how we got there. Data leads, story follows.",
            platform: 'LinkedIn',
          },
          {
            title: '"The contrarian take"',
            body: 'Argue why most "AI for social" produces generic content, then position Cadence as the antidote. High virality potential.',
            platform: 'X',
          },
        ],
      }]);
      setBusy(false);
    }, 1000);
  };

  /* ── Textarea auto-resize ── */
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const empty = messages.length === 0;

  /* ── Platform context label ── */
  const ctxLabels = { all: 'All channels', x: '𝕏', li: 'LinkedIn', ig: 'Instagram', fb: 'Facebook' };

  return (
    <div
      className="fade-in"
      style={{
        display: 'grid',
        gridTemplateColumns: '252px 1fr',
        gap: 14,
        height: 'calc(100vh - 56px - 80px)',
        minHeight: 0,
      }}
    >

      {/* ══════════════════════════════════════
          LEFT: History sidebar
          ══════════════════════════════════════ */}
      <div className="card col overflow-hidden">

        {/* New chat */}
        <div style={{ padding: '12px 10px 10px', borderBottom: '1px solid var(--border-soft)' }}>
          <button
            className="btn btn-gradient btn-sm w-full"
            style={{ height: 34, justifyContent: 'center' }}
            onClick={() => { setMessages([]); setActiveHistoryId(null); }}
          >
            <I.Plus size={13} />New conversation
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '8px 10px 4px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 8,
            background: 'var(--zinc-100)', border: '1px solid transparent',
            transition: 'border-color 0.15s',
          }}>
            <I.Search size={13} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations…"
              style={{
                flex: 1, border: 'none', outline: 'none',
                background: 'transparent', fontSize: 12.5,
                color: 'var(--text-strong)', fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 12, lineHeight: 1, padding: 0 }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Conversation groups */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 6px 8px' }}>
          {filteredGroups.map(group => (
            <div key={group.label}>
              {group.items.length > 0 && (
                <div style={{
                  padding: '8px 8px 4px',
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.07em',
                  color: 'var(--text-faint)', textTransform: 'uppercase',
                }}>
                  {group.label}
                </div>
              )}
              {group.items.map(h => {
                const isActive = activeHistoryId === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setActiveHistoryId(h.id)}
                    className="ai-history-item"
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 8,
                      padding: '8px 10px', borderRadius: 8,
                      width: '100%', textAlign: 'left', marginBottom: 1,
                      fontFamily: 'inherit', cursor: 'pointer', border: 'none',
                      background: isActive ? 'var(--violet-50)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--violet-400)' : '2px solid transparent',
                      transition: 'all 0.12s',
                    }}
                  >
                    <I.MessageCircle size={13} style={{
                      color: isActive ? 'var(--violet-500)' : 'var(--text-faint)',
                      marginTop: 2, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12.5, fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--violet-700)' : 'var(--text-strong)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        marginBottom: 2,
                      }}>
                        {h.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 500 }}>
                        {h.count} messages
                      </div>
                    </div>
                  </button>
                );
              })}
              {group.items.length === 0 && searchQuery && (
                <div style={{ padding: '16px 8px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 12.5 }}>
                  No conversations found
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI credits */}
        <div style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border-soft)',
          background: 'var(--gradient-soft)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--violet-700)' }}>AI credits</span>
            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-subtle)', fontWeight: 600 }}>
              1,240 / 5,000
            </span>
          </div>
          <div className="usage-bar-track">
            <div className="usage-bar-fill" style={{ width: '24.8%' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 5 }}>
            Resets in 14 days · <span style={{ color: 'var(--violet-500)', fontWeight: 600, cursor: 'pointer' }}>Upgrade</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT: Main chat panel
          ══════════════════════════════════════ */}
      <div className="card col overflow-hidden" style={{ position: 'relative' }}>

        {/* ── Chat header ── */}
        <div style={{
          padding: '11px 18px',
          borderBottom: '1px solid var(--border-soft)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--surface)',
          flexShrink: 0,
        }}>
          {/* AI avatar */}
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'var(--gradient-ai)',
            display: 'grid', placeItems: 'center', color: 'white',
            boxShadow: '0 2px 10px -2px rgba(124,58,237,0.35)',
            flexShrink: 0,
          }}>
            <I.Sparkles size={15} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-tight font-semi text-strong" style={{ fontSize: 14, letterSpacing: '-0.012em', lineHeight: 1.2 }}>
              Cadence AI
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 1 }}>
              {currentVoice.label} voice · Optimized for {ctxLabels[platformCtx]}
            </div>
          </div>

          {/* Brand voice button + dropdown */}
          <div style={{ position: 'relative' }} data-dropdown>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setVoiceOpen(v => !v); setModelOpen(false); }}
              style={{ gap: 6 }}
            >
              <I.Layers size={12} />
              <span>Brand voice</span>
              <I.ChevronDown size={11} style={{ opacity: 0.6 }} />
            </button>
            {voiceOpen && (
              <div className="ai-dropdown" style={{ right: 0, left: 'auto', width: 280 }}>
                <div className="ai-dropdown-header">Brand voice</div>
                <div style={{ padding: '6px 0' }}>
                  <div style={{ padding: '6px 14px 4px', fontSize: 10.5, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Writing style
                  </div>
                  {VOICES.map(v => (
                    <button
                      key={v.id}
                      onClick={() => { setVoiceStyle(v.id); setVoiceOpen(false); }}
                      className="ai-dropdown-item"
                      style={{ background: voiceStyle === v.id ? 'var(--violet-50)' : 'transparent' }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: voiceStyle === v.id ? 'var(--violet-700)' : 'var(--text-strong)' }}>
                          {v.label}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>{v.desc}</div>
                      </div>
                      {voiceStyle === v.id && (
                        <I.Check size={13} style={{ color: 'var(--violet-500)', flexShrink: 0 }} />
                      )}
                    </button>
                  ))}
                </div>
                <div style={{ padding: '6px 14px 8px', borderTop: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Optimize for
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['all', 'x', 'li', 'ig', 'fb'].map(p => (
                      <button
                        key={p}
                        onClick={() => setVoicePlatform(p)}
                        style={{
                          padding: '4px 10px', borderRadius: 99, fontSize: 11.5, fontWeight: 600,
                          border: voicePlatform === p ? '1.5px solid var(--violet-400)' : '1.5px solid var(--border)',
                          background: voicePlatform === p ? 'var(--violet-50)' : 'transparent',
                          color: voicePlatform === p ? 'var(--violet-700)' : 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {p === 'all' ? 'All' : p === 'x' ? '𝕏' : p === 'li' ? 'LinkedIn' : p === 'ig' ? 'Instagram' : 'Facebook'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Model selector + dropdown */}
          <div style={{ position: 'relative' }} data-dropdown>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setModelOpen(m => !m); setVoiceOpen(false); }}
              style={{ gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5 }}
            >
              <span>{currentModel.icon}</span>
              <span>{currentModel.label}</span>
              <I.ChevronDown size={11} style={{ opacity: 0.6 }} />
            </button>
            {modelOpen && (
              <div className="ai-dropdown" style={{ right: 0, left: 'auto', width: 260 }}>
                <div className="ai-dropdown-header">Select model</div>
                <div style={{ padding: '6px 0 8px' }}>
                  {MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                      className="ai-dropdown-item"
                      style={{ background: selectedModel === m.id ? 'var(--violet-50)' : 'transparent' }}
                    >
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{m.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: selectedModel === m.id ? 'var(--violet-700)' : 'var(--text-strong)' }}>
                            {m.label}
                          </span>
                          {m.badge && (
                            <span style={{
                              fontSize: 9.5, fontWeight: 800,
                              color: m.badge === 'Default' ? 'var(--violet-600)' : '#D97706',
                              background: m.badge === 'Default' ? 'var(--violet-50)' : '#FFF7ED',
                              border: `1px solid ${m.badge === 'Default' ? 'var(--violet-200)' : '#FCD34D'}`,
                              padding: '1px 6px', borderRadius: 99,
                            }}>
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-faint)', marginTop: 1 }}>{m.desc}</div>
                      </div>
                      {selectedModel === m.id && (
                        <I.Check size={13} style={{ color: 'var(--violet-500)', flexShrink: 0 }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Messages / empty state ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: empty ? '0' : '24px 28px', minHeight: 0 }}>
          {empty ? (
            /* ─ Empty state ─ */
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', maxWidth: 680, margin: '0 auto',
              padding: '32px 20px', minHeight: '100%',
            }}>
              {/* Hero orb */}
              <div style={{
                width: 76, height: 76, borderRadius: 22,
                background: 'var(--gradient-ai)',
                display: 'grid', placeItems: 'center', color: 'white',
                boxShadow: '0 12px 40px -8px rgba(124,58,237,0.38)',
                marginBottom: 24, position: 'relative',
              }}>
                <I.Sparkles size={34} />
                {/* Glow ring */}
                <div style={{
                  position: 'absolute', inset: -8,
                  borderRadius: 30, border: '1.5px solid rgba(124,58,237,0.15)',
                  pointerEvents: 'none',
                }} />
              </div>

              <h2 style={{
                fontSize: 30, fontWeight: 800, letterSpacing: '-0.035em',
                marginBottom: 10, fontFamily: "'Inter Tight', sans-serif",
                color: 'var(--text-strong)', lineHeight: 1.1,
              }}>
                How can I help you create?
              </h2>
              <p style={{
                fontSize: 15, color: 'var(--text-muted)', marginBottom: 28,
                lineHeight: 1.65, maxWidth: 460,
              }}>
                Ask anything about content strategy, captions, hashtags, or post timing.
                I know your brand voice and audience.
              </p>

              {/* Quick action chips */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
                {QUICK_ACTIONS.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => send(a.prompt)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 99,
                      border: '1.5px solid var(--border)', background: 'white',
                      fontSize: 13, fontWeight: 600, color: 'var(--text-muted)',
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet-400)'; e.currentTarget.style.color = 'var(--violet-700)'; e.currentTarget.style.background = 'var(--violet-50)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'white'; }}
                  >
                    <span>{a.emoji}</span>
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Prompt grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, width: '100%' }}>
                {PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => send(p.title)}
                    className="lift"
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '14px 16px', borderRadius: 12,
                      background: 'white', border: '1.5px solid var(--border)',
                      textAlign: 'left', cursor: 'pointer',
                      transition: 'all var(--dur-slow) var(--ease)',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                      background: 'var(--violet-50)', color: 'var(--violet-500)',
                      display: 'grid', placeItems: 'center',
                    }}>
                      {React.cloneElement(p.icon, { size: 15 })}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 3, lineHeight: 1.3 }}>
                        {p.title}
                      </div>
                      <div className="text-xs text-subtle">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ─ Conversation ─ */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800, margin: '0 auto' }}>
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} onSend={send} />
              ))}

              {/* Typing / loading indicator */}
              {busy && (
                <div className="msg-ai" style={{ animation: 'fadeUp 0.2s ease both' }}>
                  <div className="msg-ai-avatar">
                    <I.Sparkles size={14} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[0, 1, 2].map(j => (
                          <span key={j} className="typing-dot" style={{ animationDelay: `${j * 0.18}s` }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>
                        Cadence AI is writing…
                      </span>
                    </div>
                    {/* Skeleton lines */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                      {[90, 75, 55].map((w, k) => (
                        <div key={k} className="skeleton" style={{ height: 13, borderRadius: 6, width: `${w}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={msgEndRef} />
            </div>
          )}
        </div>

        {/* ── Input area ── */}
        <div style={{
          padding: '10px 16px 14px',
          borderTop: '1px solid var(--border-soft)',
          background: 'var(--surface-sunken)',
          flexShrink: 0,
        }}>
          {/* Platform context selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-faint)' }}>For:</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', 'x', 'li', 'ig', 'fb'].map(p => (
                <button
                  key={p}
                  onClick={() => setPlatformCtx(p)}
                  style={{
                    padding: '3px 9px', borderRadius: 99,
                    fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                    border: platformCtx === p ? '1.5px solid var(--violet-400)' : '1.5px solid var(--border)',
                    background: platformCtx === p ? 'var(--violet-50)' : 'white',
                    color: platformCtx === p ? 'var(--violet-600)' : 'var(--text-faint)',
                    transition: 'all 0.12s',
                  }}
                >
                  {p === 'all' ? 'All' : p === 'x' ? '𝕏' : p === 'li' ? 'LinkedIn' : p === 'ig' ? 'Instagram' : 'Facebook'}
                </button>
              ))}
            </div>
          </div>

          {/* Input box */}
          <form
            onSubmit={e => { e.preventDefault(); send(); }}
          >
            <div
              className="ai-input-box"
              onFocus={e => e.currentTarget.style.borderColor = 'var(--violet-400)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <button type="button" className="icon-btn" style={{ width: 30, height: 30, flexShrink: 0 }} title="Attach file">
                <I.Paperclip size={16} />
              </button>

              <textarea
                ref={taRef}
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={`Ask Cadence AI anything… (${currentVoice.label} tone)`}
                rows={1}
                style={{
                  flex: 1, border: 'none', outline: 'none', resize: 'none',
                  background: 'transparent', fontSize: 14.5,
                  color: 'var(--text-strong)', minHeight: 24, maxHeight: 160,
                  padding: '3px 0', lineHeight: 1.55, fontFamily: 'inherit',
                  overflow: 'hidden',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <button type="button" className="icon-btn" style={{ width: 30, height: 30 }} title="Add hashtag">
                  <I.Hash size={16} />
                </button>
                <button
                  type="submit"
                  disabled={busy || !prompt.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '0 14px', height: 34, borderRadius: 9,
                    background: prompt.trim() && !busy ? 'var(--gradient-ai)' : 'var(--zinc-200)',
                    color: prompt.trim() && !busy ? 'white' : 'var(--text-faint)',
                    border: 'none', cursor: prompt.trim() && !busy ? 'pointer' : 'default',
                    fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                >
                  {busy ? (
                    <span style={{ display: 'flex', gap: 3 }}>
                      {[0,1,2].map(j => <span key={j} className="typing-dot" style={{ animationDelay: `${j * 0.18}s`, background: 'white' }} />)}
                    </span>
                  ) : (
                    <I.Send size={13} />
                  )}
                  {busy ? 'Thinking' : 'Send'}
                </button>
              </div>
            </div>
          </form>

          {/* Footer hints */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 500 }}>⏎ Send</span>
            <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 500 }}>⇧⏎ New line</span>
            <span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 'auto', maxWidth: 360, textAlign: 'right', lineHeight: 1.4 }}>
              Cadence AI may produce inaccurate suggestions. Always review before publishing.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Chat message component
   ═══════════════════════════════════════════════════════ */

function ChatMessage({ message, onSend }) {
  const I = window.Ic;
  const [copied, setCopied] = React.useState(false);

  const copyAll = () => {
    const text = [message.text, ...(message.cards || []).map(c => `${c.title}\n${c.body}`)].join('\n\n');
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return ts.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  /* ── User message ── */
  if (message.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, animation: 'fadeUp 0.2s ease both' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div className="msg-user-bubble">{message.text}</div>
          {message.ts && (
            <span style={{ fontSize: 10.5, color: 'var(--text-faint)', fontWeight: 500 }}>
              {formatTime(message.ts)}
            </span>
          )}
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--zinc-200)', color: 'var(--text-muted)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
          fontSize: 11, fontWeight: 800, marginTop: 2,
        }}>
          SJ
        </div>
      </div>
    );
  }

  /* ── AI message ── */
  return (
    <div className="msg-ai" style={{ animation: 'fadeUp 0.25s ease both' }}>
      <div className="msg-ai-avatar" style={{ marginTop: 2, flexShrink: 0 }}>
        <I.Sparkles size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Main text */}
        {message.text && (
          <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-default)', marginBottom: message.cards ? 14 : 0 }}>
            {message.text}
          </div>
        )}

        {/* Response cards */}
        {message.cards && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {message.cards.map((c, i) => (
              <div
                key={i}
                className="card lift"
                style={{ padding: '16px 18px', transition: 'all 0.2s', borderLeft: '3px solid var(--violet-300)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                  <div>
                    <div className="font-tight font-semi text-strong" style={{ fontSize: 14.5, letterSpacing: '-0.015em', lineHeight: 1.3 }}>
                      {c.title}
                    </div>
                    {c.platform && (
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, color: 'var(--violet-600)',
                        background: 'var(--violet-50)', border: '1px solid var(--violet-100)',
                        padding: '1px 7px', borderRadius: 99, marginTop: 4, display: 'inline-block',
                      }}>
                        Best for {c.platform}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ height: 28, padding: '0 10px', fontSize: 12, flexShrink: 0 }}
                    onClick={() => onSend && window.cadenceNav('create')}
                  >
                    <I.PenLine size={11} />Draft this
                  </button>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {c.body}
                </div>
              </div>
            ))}

            {/* Action row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => onSend && onSend('Regenerate with a different angle')}>
                <I.Refresh size={12} />Regenerate
              </button>
              <button className="btn btn-ghost btn-sm" onClick={copyAll}>
                {copied ? <I.CheckCircle size={12} style={{ color: 'var(--success)' }} /> : <I.Copy size={12} />}
                {copied ? 'Copied!' : 'Copy all'}
              </button>
              <button className="btn btn-ghost btn-sm">
                <I.Star size={12} />Save
              </button>
              {message.ts && (
                <span style={{ fontSize: 10.5, color: 'var(--text-faint)', marginLeft: 'auto' }}>
                  {formatTime(message.ts)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Plain text response without cards */}
        {!message.cards && message.text && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={copyAll}>
              <I.Copy size={12} />Copy
            </button>
            <button className="btn btn-ghost btn-sm">
              <I.Star size={12} />Save
            </button>
            {message.ts && (
              <span style={{ fontSize: 10.5, color: 'var(--text-faint)', marginLeft: 'auto' }}>
                {formatTime(message.ts)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

window.AIAssistant = AIAssistant;

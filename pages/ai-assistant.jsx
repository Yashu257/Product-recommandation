// AI Studio — Cadence AI chat interface
function AIAssistant() {
  const I = window.Ic;
  const [prompt,   setPrompt]   = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [busy,     setBusy]     = React.useState(false);

  const prompts = [
    { icon: <I.Lightbulb />, title: 'Brainstorm 10 post ideas',         desc: 'For our Q3 product launch' },
    { icon: <I.Wand />,      title: 'Rewrite in our brand voice',       desc: 'Paste a draft, get 3 takes' },
    { icon: <I.Hash />,      title: 'Suggest hashtags for AI marketing',desc: 'Trending + niche, ranked' },
    { icon: <I.TrendUp />,   title: 'Best time to post on Friday',      desc: 'For my LinkedIn audience' },
    { icon: <I.Megaphone />, title: 'Draft a thread about our values',  desc: '5 posts, one cohesive arc' },
    { icon: <I.Target />,    title: 'Optimize caption for clicks',      desc: 'Add a CTA, sharpen the hook' },
  ];

  const history = [
    { id: 'h1', title: 'Q1 retrospective thread',        time: '2 hrs ago',  count: 4  },
    { id: 'h2', title: "Sarah's success story angles",   time: 'Yesterday',  count: 8  },
    { id: 'h3', title: 'Hashtag strategy for AI launch', time: '2 days ago', count: 12 },
    { id: 'h4', title: 'Brand voice training',           time: 'Last week',  count: 18 },
    { id: 'h5', title: 'Holiday content calendar',       time: 'Last week',  count: 24 },
  ];

  const send = (text) => {
    const t = (text || prompt).trim();
    if (!t || busy) return;
    setMessages(prev => [...prev, { role: 'user', text: t }]);
    setPrompt('');
    setBusy(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Here are three angles you could take, in your usual conversational tone:',
        cards: [
          {
            title: '"The behind-the-scenes story"',
            body: 'Lead with a vulnerable moment from the build process. Audiences love a glimpse into the work, not just the result. Best for X + LinkedIn.',
          },
          {
            title: '"The customer-first angle"',
            body: "Open with Sarah's 300% engagement number, then peel back how we got there. Best for LinkedIn long-form.",
          },
          {
            title: '"The contrarian take"',
            body: 'Argue why most "AI for social" is actually slop, then position Cadence as the antidote. Best for X — high virality potential.',
          },
        ],
      }]);
      setBusy(false);
    }, 900);
  };

  const empty = messages.length === 0;

  const panelH = 'calc(100vh - 56px - 80px)';

  return (
    <div
      className="fade-in"
      style={{ display: 'grid', gridTemplateColumns: '252px 1fr', gap: 14, height: panelH }}
    >

      {/* ─── History sidebar ─── */}
      <div className="card col overflow-hidden">

        {/* New chat button */}
        <div style={{ padding: '14px 12px', borderBottom: '1px solid var(--border-soft)' }}>
          <button
            className="btn btn-gradient btn-sm w-full"
            style={{ height: 34 }}
            onClick={() => setMessages([])}
          >
            <I.Plus size={13} />New chat
          </button>
        </div>

        {/* History list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
          <div
            className="text-2xs uppercase font-semi text-subtle"
            style={{ padding: '6px 8px 4px', letterSpacing: '0.07em' }}
          >
            Recent
          </div>
          {history.map(h => (
            <button
              key={h.id}
              className="row-hover"
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 9,
                padding: '9px 10px', borderRadius: 9,
                width: '100%', textAlign: 'left', marginBottom: 2,
                fontFamily: 'inherit',
              }}
            >
              <I.MessageCircle size={14} style={{ color: 'var(--text-subtle)', marginTop: 1, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="font-semi text-strong truncate"
                  style={{ fontSize: 13, marginBottom: 1 }}
                >
                  {h.title}
                </div>
                <div className="text-xs text-subtle">{h.time} · {h.count} msgs</div>
              </div>
            </button>
          ))}
        </div>

        {/* Credits bar */}
        <div style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border-soft)',
          background: 'var(--gradient-soft)',
        }}>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-semi" style={{ color: 'var(--violet-700)' }}>AI credits</span>
            <span className="mono text-xs text-subtle">1,240 / 5,000</span>
          </div>
          <div className="usage-bar-track">
            <div className="usage-bar-fill" style={{ width: '24.8%' }} />
          </div>
        </div>
      </div>

      {/* ─── Main chat panel ─── */}
      <div className="card col overflow-hidden">

        {/* Chat header */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-soft)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'var(--gradient-ai)',
            display: 'grid', placeItems: 'center', color: 'white',
            boxShadow: 'var(--shadow-xs)',
          }}>
            <I.Sparkles size={15} />
          </div>
          <div>
            <div className="font-tight font-semi text-strong" style={{ fontSize: 14, letterSpacing: '-0.012em' }}>
              Cadence AI
            </div>
            <div className="text-xs text-subtle">Trained on your brand voice and content history</div>
          </div>
          <div className="flex gap-2 ml-auto">
            <button className="btn btn-secondary btn-sm">
              <I.Layers size={12} />Brand voice<I.ChevronDown size={11} />
            </button>
            <button className="btn btn-secondary btn-sm">
              <I.Bolt size={12} />Cadence-4
            </button>
          </div>
        </div>

        {/* Messages / empty state */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {empty ? (
            <div className="col items-center justify-center h-full" style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto' }}>
              {/* Hero icon */}
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'var(--gradient-ai)',
                display: 'grid', placeItems: 'center', color: 'white',
                boxShadow: '0 10px 30px -8px rgba(124, 58, 237, 0.3)',
                marginBottom: 22,
              }}>
                <I.Sparkles size={32} />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.032em', marginBottom: 10, fontFamily: "'Inter Tight', sans-serif" }}>
                How can I help you create?
              </h1>
              <p style={{ fontSize: 14.5, color: 'var(--text-muted)', marginBottom: 36, lineHeight: 1.6, maxWidth: 480 }}>
                Ask anything about content strategy, captions, hashtags, or post timing — I know your audience.
              </p>

              {/* Prompt grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, width: '100%' }}>
                {prompts.map((p, i) => (
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
                      width: 34, height: 34, borderRadius: 9,
                      background: 'var(--violet-50)', color: 'var(--violet-500)',
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}>
                      {React.cloneElement(p.icon, { size: 15 })}
                    </div>
                    <div>
                      <div className="font-semi text-strong mb-1" style={{ fontSize: 13.5 }}>{p.title}</div>
                      <div className="text-xs text-subtle">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="col gap-5" style={{ maxWidth: 780, margin: '0 auto' }}>
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} />
              ))}

              {/* Typing indicator */}
              {busy && (
                <div className="flex items-center gap-3" style={{ color: 'var(--text-subtle)' }}>
                  <div className="msg-ai-avatar">
                    <I.Sparkles size={14} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>Cadence AI is thinking</span>
                    <div className="flex gap-1" style={{ marginLeft: 4 }}>
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="typing-dot"
                          style={{ animationDelay: `${i * 0.18}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Composer */}
        <div style={{
          padding: '12px 20px 16px',
          borderTop: '1px solid var(--border-soft)',
          background: 'var(--surface-sunken)',
        }}>
          <form
            onSubmit={e => { e.preventDefault(); send(); }}
            style={{
              display: 'flex', alignItems: 'flex-end', gap: 8,
              padding: '10px 12px',
              background: 'white',
              borderRadius: 13,
              border: '1.5px solid var(--border)',
              transition: 'border-color var(--dur-base) var(--ease), box-shadow var(--dur-base) var(--ease)',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--border-focus)';
              e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(124, 58, 237, 0.08)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow   = 'none';
            }}
          >
            <button type="button" className="icon-btn" style={{ width: 30, height: 30 }}>
              <I.Paperclip />
            </button>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask Cadence AI anything…"
              rows={1}
              style={{
                flex: 1, border: 'none', outline: 'none',
                resize: 'none', background: 'transparent',
                fontSize: 14.5, color: 'var(--text-strong)',
                minHeight: 24, maxHeight: 120,
                padding: '3px 0', lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            />
            <button type="button" className="icon-btn" style={{ width: 30, height: 30 }}>
              <I.Hash />
            </button>
            <button
              type="submit"
              className="btn btn-gradient btn-sm"
              style={{ height: 34, flexShrink: 0 }}
              disabled={busy || !prompt.trim()}
            >
              <I.Send size={13} />Send
            </button>
          </form>

          <div className="flex items-center gap-4 mt-2" style={{ fontSize: 11.5, color: 'var(--text-faint)', fontWeight: 500 }}>
            <span>⏎ to send</span>
            <span>⇧ + ⏎ for new line</span>
            <span className="ml-auto" style={{ maxWidth: 340, textAlign: 'right', lineHeight: 1.4 }}>
              Cadence AI may produce inaccurate suggestions. Always review before publishing.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Chat message ── */

function ChatMessage({ message }) {
  const I = window.Ic;

  if (message.role === 'user') {
    return (
      <div className="msg-user">
        <div className="msg-user-bubble">{message.text}</div>
      </div>
    );
  }

  return (
    <div className="msg-ai">
      <div className="msg-ai-avatar">
        <I.Sparkles size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-default)', marginBottom: 14 }}>
          {message.text}
        </div>
        {message.cards && (
          <div className="col gap-3">
            {message.cards.map((c, i) => (
              <div key={i} className="card lift" style={{ padding: 16 }}>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="font-tight font-semi text-strong"
                    style={{ fontSize: 14.5, letterSpacing: '-0.015em' }}
                  >
                    {c.title}
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{ height: 26, padding: '0 10px', fontSize: 12 }}>
                    <I.PenLine size={11} />Draft this
                  </button>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {c.body}
                </div>
              </div>
            ))}

            {/* Action row */}
            <div className="flex gap-2 mt-1">
              <button className="btn btn-secondary btn-sm"><I.Refresh size={12} />Regenerate</button>
              <button className="btn btn-ghost btn-sm"><I.Copy size={12} />Copy all</button>
              <button className="btn btn-ghost btn-sm"><I.Star size={12} />Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.AIAssistant = AIAssistant;

// Settings — premium SaaS settings inspired by Linear, Notion, Stripe, Vercel
function SettingsPage({ data }) {
  const I = window.Ic;
  const [active, setActive] = React.useState('profile');

  const NAV_GROUPS = [
    {
      label: 'Account',
      items: [
        { key: 'profile',    icon: <I.User />,      label: 'Profile' },
        { key: 'appearance', icon: <I.Palette />,   label: 'Appearance' },
        { key: 'security',   icon: <I.Shield />,    label: 'Security' },
      ],
    },
    {
      label: 'Workspace',
      items: [
        { key: 'workspace',  icon: <I.Layers />,    label: 'Workspace' },
        { key: 'accounts',   icon: <I.Globe />,     label: 'Connected channels' },
        { key: 'brand',      icon: <I.Megaphone />, label: 'Brand voice' },
        { key: 'notifs',     icon: <I.Bell />,      label: 'Notifications' },
      ],
    },
    {
      label: 'Plan',
      items: [
        { key: 'billing',    icon: <I.Card />,      label: 'Plan & billing' },
      ],
    },
  ];

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="page-title-row">
          <div className="page-title">Settings</div>
          <div className="page-subtitle">Manage your account, workspace, and integrations.</div>
        </div>
      </div>

      <div className="settings-layout">

        {/* ── Sidebar nav ── */}
        <div className="settings-sidebar">
          <div className="card" style={{ padding: '8px 6px' }}>

            {/* Workspace identity chip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 10px 14px',
              borderBottom: '1px solid var(--border-soft)',
              marginBottom: 8,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'var(--gradient-ai)',
                display: 'grid', placeItems: 'center',
                color: 'white', fontSize: 12, fontWeight: 800, flexShrink: 0,
                boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
              }}>
                C
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Cadence Workspace
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                  <span style={{ fontSize: 10.5, color: 'var(--violet-600)', fontWeight: 700, background: 'var(--violet-50)', padding: '1px 6px', borderRadius: 99, border: '1px solid var(--violet-200)' }}>
                    Pro
                  </span>
                  <span style={{ fontSize: 10.5, color: 'var(--text-faint)' }}>4 seats</span>
                </div>
              </div>
            </div>

            {NAV_GROUPS.map((group, gi) => (
              <div key={group.label} style={{ marginBottom: gi < NAV_GROUPS.length - 1 ? 2 : 0 }}>
                <div style={{
                  padding: '6px 10px 3px',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.09em',
                  color: 'var(--text-faint)', textTransform: 'uppercase',
                }}>
                  {group.label}
                </div>
                {group.items.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setActive(s.key)}
                    className={`settings-nav-item${active === s.key ? ' active' : ''}`}
                  >
                    {React.cloneElement(s.icon, { size: 15 })}
                    <span>{s.label}</span>
                  </button>
                ))}
                {gi < NAV_GROUPS.length - 1 && (
                  <div className="hr" style={{ margin: '8px 4px' }} />
                )}
              </div>
            ))}

            <div className="hr" style={{ margin: '8px 4px' }} />
            <button className="settings-nav-item danger-nav">
              <I.LogOut size={15} />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        {/* ── Panel area ── */}
        <div className="col gap-5" style={{ minWidth: 0 }}>
          {active === 'profile'    && <ProfilePanel />}
          {active === 'workspace'  && <WorkspacePanel />}
          {active === 'accounts'   && <AccountsPanel data={data} />}
          {active === 'brand'      && <BrandVoicePanel />}
          {active === 'notifs'     && <NotificationsPanel />}
          {active === 'billing'    && <BillingPanel />}
          {active === 'security'   && <SecurityPanel />}
          {active === 'appearance' && <AppearancePanel />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Shared primitives
   ═══════════════════════════════════════════════════════ */

function PanelCard({ title, desc, badge, children, actions, noPadding }) {
  return (
    <div className="card">
      <div className="card-header card-header-lg">
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="card-title">{title}</div>
            {badge && (
              <span style={{
                fontSize: 10.5, fontWeight: 800, padding: '2px 7px', borderRadius: 99,
                background: badge === 'danger' ? '#FEF2F2' : 'var(--violet-50)',
                color: badge === 'danger' ? 'var(--error)' : 'var(--violet-600)',
                border: badge === 'danger' ? '1px solid #FECACA' : '1px solid var(--violet-200)',
              }}>
                {badge}
              </span>
            )}
          </div>
          {desc && <div className="card-sub" style={{ marginTop: 3 }}>{desc}</div>}
        </div>
        {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
      </div>
      <div style={noPadding ? {} : { padding: '0 24px 24px' }}>{children}</div>
    </div>
  );
}

function SettingsRow({ label, desc, control, last, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 24, padding: '14px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-soft)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: danger ? 'var(--error)' : 'var(--text-strong)', marginBottom: desc ? 3 : 0 }}>
          {label}
        </div>
        {desc && (
          <div className="text-sm text-subtle" style={{ maxWidth: 420, lineHeight: 1.5 }}>{desc}</div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}

function Toggle({ on: initial = false, onChange }) {
  const [on, setOn] = React.useState(initial);
  return (
    <button
      className={`toggle ${on ? 'on' : 'off'}`}
      onClick={() => { setOn(!on); onChange && onChange(!on); }}
      aria-checked={on} role="switch"
    >
      <span className="toggle-thumb" />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   Profile panel
   ═══════════════════════════════════════════════════════ */

function ProfilePanel() {
  const I = window.Ic;
  const [bio, setBio] = React.useState('Head of Content at Cadence. Writing about creator economy, brand voice, and AI.');
  const [hover, setHover] = React.useState(false);
  const BIO_LIMIT = 160;

  return (
    <>
      <PanelCard title="Profile" desc="How you appear across the workspace and in post previews.">

        {/* Avatar section */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          padding: '4px 0 22px',
          borderBottom: '1px solid var(--border-soft)',
          marginBottom: 22,
        }}>
          <div
            style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: 'var(--gradient-ai)',
              display: 'grid', placeItems: 'center',
              color: 'white', fontSize: 24, fontWeight: 800,
              fontFamily: "'Inter Tight', sans-serif",
              boxShadow: '0 0 0 3px white, 0 0 0 5px var(--violet-300)',
              position: 'relative', overflow: 'hidden',
              transition: 'box-shadow 0.15s',
            }}>
              SJ
              {hover && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.45)',
                  display: 'grid', placeItems: 'center',
                  color: 'white',
                  borderRadius: 18,
                }}>
                  <I.Image size={20} />
                </div>
              )}
            </div>
            <div style={{
              position: 'absolute', bottom: -3, right: -3,
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--violet-500)', color: 'white',
              border: '2.5px solid white',
              display: 'grid', placeItems: 'center',
            }}>
              <I.Plus size={10} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 2, letterSpacing: '-0.01em' }}>
              Sarah Johnson
            </div>
            <div className="text-sm text-subtle" style={{ marginBottom: 10 }}>sarah@cadence.app · Pacific Time</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm">
                <I.Image size={12} />Change photo
              </button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Name / handle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label className="label">Full name</label>
            <input className="input" defaultValue="Sarah Johnson" />
          </div>
          <div>
            <label className="label">Display handle</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-faint)', fontSize: 14, fontWeight: 500, pointerEvents: 'none',
              }}>@</span>
              <input className="input" defaultValue="sarahjohnson" style={{ paddingLeft: 24 }} />
            </div>
          </div>
        </div>

        {/* Email / role */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label className="label">Email</label>
            <input className="input" defaultValue="sarah@cadence.app" type="email" />
          </div>
          <div>
            <label className="label">Role / title</label>
            <input className="input" defaultValue="Head of Content" />
          </div>
        </div>

        {/* Timezone / language */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
          <div>
            <label className="label">Timezone</label>
            <select className="input">
              <option>Pacific Time (Los Angeles)</option>
              <option>Eastern Time (New York)</option>
              <option>Central European Time</option>
              <option>UTC</option>
            </select>
          </div>
          <div>
            <label className="label">Language</label>
            <select className="input">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <label className="label" style={{ margin: 0 }}>Bio</label>
            <span style={{
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
              color: bio.length > BIO_LIMIT * 0.88 ? (bio.length >= BIO_LIMIT ? 'var(--error)' : 'var(--warning)') : 'var(--text-faint)',
              background: bio.length > BIO_LIMIT * 0.88 ? (bio.length >= BIO_LIMIT ? '#FEF2F2' : '#FFFBEB') : 'var(--zinc-100)',
              padding: '2px 7px', borderRadius: 6,
            }}>
              {bio.length} / {BIO_LIMIT}
            </span>
          </div>
          <textarea
            className="textarea"
            value={bio}
            onChange={e => setBio(e.target.value.slice(0, BIO_LIMIT))}
            style={{ minHeight: 80, resize: 'vertical' }}
          />
          <div className="helper" style={{ marginTop: 4 }}>Shown in post previews, profile pages, and email signatures.</div>
        </div>

        <div className="flex gap-2 justify-end">
          <button className="btn btn-secondary">Discard</button>
          <button className="btn btn-primary">Save profile</button>
        </div>
      </PanelCard>

      {/* Social profiles */}
      <PanelCard title="Social profiles" desc="Public links shown on your author profile.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'X (Twitter)',    placeholder: '@username',             prefix: 'x.com/' },
            { label: 'LinkedIn',       placeholder: 'your-name',             prefix: 'linkedin.com/in/' },
            { label: 'Personal site',  placeholder: 'yoursite.com',          prefix: 'https://' },
          ].map(f => (
            <div key={f.label}>
              <label className="label">{f.label}</label>
              <div style={{ display: 'flex', alignItems: 'center', height: 38 }}>
                <span style={{
                  padding: '0 10px', height: '100%', display: 'flex', alignItems: 'center',
                  background: 'var(--zinc-100)', border: '1.5px solid var(--border)',
                  borderRight: 'none', borderRadius: '8px 0 0 8px',
                  fontSize: 12.5, color: 'var(--text-faint)', fontWeight: 500, whiteSpace: 'nowrap',
                }}>
                  {f.prefix}
                </span>
                <input
                  className="input"
                  placeholder={f.placeholder}
                  style={{ borderRadius: '0 8px 8px 0', flex: 1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </PanelCard>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Workspace panel
   ═══════════════════════════════════════════════════════ */

function WorkspacePanel() {
  const I = window.Ic;
  const AVATAR_COLORS = [
    'var(--gradient-ai)',
    'linear-gradient(135deg,#059669,#34D399)',
    'linear-gradient(135deg,#0EA5E9,#38BDF8)',
    'linear-gradient(135deg,#D97706,#FCD34D)',
  ];
  const members = [
    { name: 'Sarah Johnson', email: 'sarah@cadence.app',  role: 'Owner',  initials: 'SJ', active: 'Active now',    you: true,  ci: 0 },
    { name: 'Marcus Chen',   email: 'marcus@cadence.app', role: 'Admin',  initials: 'MC', active: '2 hrs ago',              ci: 1 },
    { name: 'Ava Park',      email: 'ava@cadence.app',    role: 'Editor', initials: 'AP', active: 'Yesterday',              ci: 2 },
    { name: 'Diego Rivera',  email: 'diego@cadence.app',  role: 'Viewer', initials: 'DR', active: '5 days ago',             ci: 3 },
  ];

  const rolePill = {
    Owner:  { bg: 'var(--violet-50)',  color: 'var(--violet-700)', border: 'var(--violet-200)' },
    Admin:  { bg: 'var(--zinc-100)',   color: 'var(--zinc-700)',   border: 'var(--zinc-300)'   },
    Editor: { bg: 'var(--info-soft)',  color: 'var(--info)',       border: 'var(--info)'       },
    Viewer: { bg: 'var(--zinc-50)',    color: 'var(--zinc-400)',   border: 'var(--zinc-200)'   },
  };

  return (
    <>
      {/* Identity */}
      <PanelCard title="Workspace" desc="Settings that apply across all members and channels.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label className="label">Workspace name</label>
            <input className="input" defaultValue="Cadence" />
          </div>
          <div>
            <label className="label">URL slug</label>
            <div style={{ display: 'flex', alignItems: 'center', height: 38 }}>
              <span style={{
                padding: '0 10px', height: '100%', display: 'flex', alignItems: 'center',
                background: 'var(--zinc-100)', border: '1.5px solid var(--border)',
                borderRight: 'none', borderRadius: '8px 0 0 8px',
                fontSize: 12, color: 'var(--text-faint)', fontWeight: 500, whiteSpace: 'nowrap',
              }}>
                app.cadence.ai/
              </span>
              <input className="input" defaultValue="cadence-team" style={{ borderRadius: '0 8px 8px 0' }} />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label className="label">Default scheduling timezone</label>
          <select className="input" style={{ maxWidth: 300 }}>
            <option>Pacific Time (Los Angeles)</option>
            <option>Eastern Time (New York)</option>
            <option>UTC</option>
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <button className="btn btn-secondary">Discard</button>
          <button className="btn btn-primary">Save</button>
        </div>
      </PanelCard>

      {/* Members */}
      <PanelCard
        title="Members"
        desc="4 active members · Pro plan allows up to 10 seats."
        actions={
          <button className="btn btn-gradient btn-sm">
            <I.Plus size={12} />Invite member
          </button>
        }
        noPadding
      >
        {members.map((m, i) => {
          const rp = rolePill[m.role] || rolePill.Viewer;
          return (
            <div key={m.email} className="member-row" style={{
              display: 'flex', alignItems: 'center', gap: 13,
              padding: '12px 24px',
              borderBottom: i < members.length - 1 ? '1px solid var(--border-soft)' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                background: AVATAR_COLORS[m.ci],
                display: 'grid', placeItems: 'center',
                color: 'white', fontSize: 12, fontWeight: 800,
              }}>
                {m.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>{m.name}</span>
                  {m.you && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-faint)', background: 'var(--zinc-100)', padding: '1px 7px', borderRadius: 99, letterSpacing: '0.04em' }}>
                      you
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 1 }}>
                  {m.email} · {m.active}
                </div>
              </div>
              <span style={{
                fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
                background: rp.bg, color: rp.color, border: `1px solid ${rp.border}`,
                flexShrink: 0,
              }}>
                {m.role}
              </span>
              {!m.you && (
                <select
                  className="input"
                  style={{ width: 100, padding: '4px 8px', fontSize: 12.5, height: 32 }}
                  defaultValue={m.role}
                >
                  <option>Owner</option>
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
              )}
              {!m.you && (
                <button className="icon-btn" style={{ width: 30, height: 30, flexShrink: 0 }}>
                  <I.MoreHoriz size={15} />
                </button>
              )}
            </div>
          );
        })}

        {/* Pending invite */}
        <div style={{
          margin: '12px 24px 20px',
          padding: '12px 16px',
          background: '#FFFBEB', border: '1px solid #FDE68A',
          borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: '#FEF3C7',
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <I.Clock size={14} style={{ color: '#D97706' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>luna@cadence.app</span>
            <span style={{ fontSize: 12, color: '#B45309', marginLeft: 6 }}>· Invitation pending · 2 days ago</span>
          </div>
          <button className="btn btn-sm" style={{ background: 'white', border: '1px solid #FDE68A', color: '#92400E', fontSize: 12, height: 28, padding: '0 10px', fontFamily: 'inherit', borderRadius: 7, cursor: 'pointer', fontWeight: 600 }}>
            Resend
          </button>
          <button className="btn btn-ghost btn-sm" style={{ color: '#B45309', fontSize: 12, height: 28 }}>
            Revoke
          </button>
        </div>
      </PanelCard>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Connected accounts panel
   ═══════════════════════════════════════════════════════ */

function AccountsPanel({ data }) {
  const I = window.Ic;

  const accountMeta = {
    x:  { growth: '+3.2%', synced: '2 min ago',  up: true  },
    fb: { growth: '+1.4%', synced: '2 min ago',  up: true  },
    ig: { growth: '+5.8%', synced: '2 min ago',  up: true  },
    li: { growth: '+2.1%', synced: '12 min ago', up: true  },
  };

  const integrations = [
    { name: 'Slack',    desc: 'Approvals & alerts',    connected: true,  color: '#4A154B', badge: null       },
    { name: 'Notion',   desc: 'Sync content briefs',   connected: false, color: '#000000', badge: null       },
    { name: 'Figma',    desc: 'Pull design assets',    connected: false, color: '#F24E1E', badge: null       },
    { name: 'Zapier',   desc: '5,000+ app workflows',  connected: false, color: '#FF4A00', badge: 'Popular'  },
    { name: 'Webhooks', desc: 'Custom event triggers',  connected: false, color: '#6366F1', badge: null       },
    { name: 'API',      desc: 'Build your own flows',  connected: false, color: '#18181B', badge: 'Beta'     },
  ];

  return (
    <>
      <PanelCard
        title="Connected channels"
        desc="Social accounts actively publishing from this workspace."
        actions={
          <button className="btn btn-secondary btn-sm">
            <I.Plus size={13} />Add channel
          </button>
        }
        noPadding
      >
        <div style={{ padding: '8px 24px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(data.accounts || []).map(a => {
            const meta = accountMeta[a.platform] || {};
            return (
              <div key={a.handle} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 16px',
                border: '1.5px solid var(--border)',
                borderRadius: 12,
                background: 'var(--surface)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}>
                <I.PlatformMark p={a.platform} size="lg" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 2 }}>
                    {a.handle}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="text-xs text-subtle">{I.PlatformName(a.platform)} · {a.followers} followers</span>
                    {meta.growth && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', background: 'var(--success-soft)', padding: '1px 6px', borderRadius: 99 }}>
                        ↑ {meta.growth}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className="badge badge-published"><span className="dot" />Active</span>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Synced {meta.synced}</div>
                </div>
                <button className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>Manage</button>
              </div>
            );
          })}
        </div>
      </PanelCard>

      {/* Integrations */}
      <PanelCard title="Integrations" desc="Extend Cadence with the tools your team already uses.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 4 }}>
          {integrations.map(int => (
            <button key={int.name} className="lift" style={{
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '13px 14px', borderRadius: 11,
              border: int.connected ? '1.5px solid var(--violet-300)' : '1.5px solid var(--border)',
              background: int.connected ? 'var(--violet-50)' : 'var(--surface)',
              textAlign: 'left', cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit', position: 'relative',
            }}>
              {/* Color swatch avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: int.connected ? 'var(--violet-100)' : 'var(--zinc-100)',
                display: 'grid', placeItems: 'center',
                fontSize: 12, fontWeight: 800,
                color: int.connected ? 'var(--violet-600)' : int.color,
              }}>
                {int.connected ? <I.CheckCircle size={16} /> : int.name.slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: int.connected ? 'var(--violet-700)' : 'var(--text-strong)', marginBottom: 2 }}>
                  {int.name}
                </div>
                <div className="text-xs text-subtle" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {int.desc}
                </div>
              </div>
              {int.badge && (
                <span style={{
                  position: 'absolute', top: 7, right: 7,
                  fontSize: 9.5, fontWeight: 800, padding: '1px 5px', borderRadius: 99,
                  background: 'var(--zinc-100)', color: 'var(--text-faint)',
                  border: '1px solid var(--border-soft)',
                }}>
                  {int.badge}
                </span>
              )}
              {int.connected && (
                <span style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }} />
              )}
            </button>
          ))}
        </div>
      </PanelCard>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Brand voice panel
   ═══════════════════════════════════════════════════════ */

function BrandVoicePanel() {
  const I = window.Ic;
  const [avoidWords, setAvoidWords] = React.useState(['leverage', 'synergy', 'utilize', 'best-in-class', 'robust', 'scalable']);
  const [champWords, setChampWords] = React.useState(['results', 'because', 'you', 'proof', 'data', 'story']);
  const [newAvoid, setNewAvoid] = React.useState('');
  const [newChamp, setNewChamp] = React.useState('');

  const addWord = (list, setList, val, setVal) => {
    const w = val.trim();
    if (w && !list.includes(w)) setList(prev => [...prev, w]);
    setVal('');
  };

  const attrs = [
    { label: 'Tone',          value: 'Warm · curious · slightly contrarian' },
    { label: 'Reading level', value: '9th grade — accessible, not dumbed down' },
    { label: 'Avoid',         value: 'Corporate jargon, em-dashes, "leverage"' },
    { label: 'Champion',      value: 'Concrete numbers, second-person CTAs' },
  ];

  return (
    <>
      <PanelCard title="Brand voice" desc="Cadence AI trains on your approved posts to match your tone and style.">

        {/* Training stats */}
        <div style={{
          display: 'flex', gap: 0,
          background: 'var(--surface-sunken)', borderRadius: 12,
          border: '1px solid var(--border-soft)',
          overflow: 'hidden', marginBottom: 22,
        }}>
          {[
            { num: '47',  label: 'Posts analyzed',        icon: <I.FileText size={14} /> },
            { num: '3d',  label: 'Since last training',   icon: <I.Clock size={14} />    },
            { num: '94%', label: 'Voice match score',     icon: <I.Target size={14} />   },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1, textAlign: 'center', padding: '16px 12px',
              borderRight: i < 2 ? '1px solid var(--border-soft)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, color: 'var(--violet-400)' }}>
                {s.icon}
              </div>
              <div className="font-tight" style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--violet-600)', lineHeight: 1 }}>
                {s.num}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Voice trait cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
          {attrs.map(a => (
            <div key={a.label} style={{
              padding: '13px 15px',
              background: 'var(--surface-sunken)',
              borderRadius: 10, border: '1px solid var(--border-soft)',
            }}>
              <div className="text-xs text-subtle uppercase" style={{ letterSpacing: '0.07em', fontWeight: 700, marginBottom: 5 }}>
                {a.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-strong)', lineHeight: 1.5 }}>
                {a.value}
              </div>
            </div>
          ))}
        </div>

        {/* Word lists — interactive */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
          {/* Avoid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: '#FEE2E2', display: 'grid', placeItems: 'center' }}>
                <I.X size={10} style={{ color: '#DC2626' }} />
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Avoid
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {avoidWords.map(w => (
                <span key={w} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 12, fontWeight: 500,
                  padding: '3px 8px 3px 9px', borderRadius: 99,
                  background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA',
                }}>
                  {w}
                  <button
                    onClick={() => setAvoidWords(prev => prev.filter(x => x !== w))}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', color: '#F87171', marginLeft: 1 }}
                  >
                    <I.X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="input"
                value={newAvoid}
                onChange={e => setNewAvoid(e.target.value)}
                placeholder="Add word…"
                style={{ flex: 1, height: 30, fontSize: 12, padding: '0 10px' }}
                onKeyDown={e => e.key === 'Enter' && addWord(avoidWords, setAvoidWords, newAvoid, setNewAvoid)}
              />
              <button className="btn btn-sm btn-secondary" style={{ height: 30, padding: '0 10px', fontSize: 12 }}
                onClick={() => addWord(avoidWords, setAvoidWords, newAvoid, setNewAvoid)}>
                Add
              </button>
            </div>
          </div>

          {/* Champion */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: '#D1FAE5', display: 'grid', placeItems: 'center' }}>
                <I.Check size={10} style={{ color: '#059669' }} />
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Champion
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {champWords.map(w => (
                <span key={w} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 12, fontWeight: 500,
                  padding: '3px 8px 3px 9px', borderRadius: 99,
                  background: '#F0FDF4', color: '#166534', border: '1px solid #86EFAC',
                }}>
                  {w}
                  <button
                    onClick={() => setChampWords(prev => prev.filter(x => x !== w))}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', color: '#4ADE80', marginLeft: 1 }}
                  >
                    <I.X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="input"
                value={newChamp}
                onChange={e => setNewChamp(e.target.value)}
                placeholder="Add word…"
                style={{ flex: 1, height: 30, fontSize: 12, padding: '0 10px' }}
                onKeyDown={e => e.key === 'Enter' && addWord(champWords, setChampWords, newChamp, setNewChamp)}
              />
              <button className="btn btn-sm btn-secondary" style={{ height: 30, padding: '0 10px', fontSize: 12 }}
                onClick={() => addWord(champWords, setChampWords, newChamp, setNewChamp)}>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Retrain banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 18px',
          background: 'var(--gradient-soft)',
          border: '1px solid var(--violet-100)',
          borderRadius: 12,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'var(--gradient-ai)', color: 'white',
            display: 'grid', placeItems: 'center',
            boxShadow: 'var(--shadow-violet)', flexShrink: 0,
          }}>
            <I.Sparkles size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 2 }}>
              Retrain voice model
            </div>
            <div className="text-xs text-subtle">
              Re-analyze your latest 30 published posts to sharpen the tone match.
            </div>
          </div>
          <button className="btn btn-primary btn-sm">Retrain now</button>
        </div>
      </PanelCard>

      {/* Custom examples */}
      <PanelCard title="Custom examples" desc="Paste exemplary posts to give the AI a concrete style reference.">
        <textarea
          className="textarea"
          placeholder="Paste one of your best-performing posts here — the AI will learn from its structure and tone…"
          style={{ minHeight: 110, marginBottom: 14 }}
        />
        <div className="flex justify-end">
          <button className="btn btn-primary btn-sm">
            <I.Plus size={12} />Add example
          </button>
        </div>
      </PanelCard>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Notifications panel
   ═══════════════════════════════════════════════════════ */

function NotificationsPanel() {
  const CHANNELS = ['Email', 'Push', 'Slack'];
  const COL_W = 60;

  const groups = [
    {
      label: 'Publishing',
      rows: [
        { label: 'Post published',    desc: 'When a scheduled post goes live',              email: true,  push: true,  slack: true  },
        { label: 'Publish failures',  desc: 'When a channel rejects or retries a post',     email: true,  push: true,  slack: true  },
        { label: 'Queue empty',       desc: 'When your publishing queue runs out',           email: false, push: false, slack: false },
      ],
    },
    {
      label: 'Collaboration',
      rows: [
        { label: 'Team activity',     desc: 'Edits, comments, and approvals from teammates', email: true,  push: true,  slack: true  },
        { label: 'Mentions',          desc: 'When someone @mentions you in a comment',        email: true,  push: true,  slack: false },
      ],
    },
    {
      label: 'AI & Insights',
      rows: [
        { label: 'AI suggestions',    desc: 'Daily digest of content recommendations',       email: false, push: false, slack: false },
        { label: 'Weekly recap',      desc: "Sunday summary of reach, growth, and top posts", email: true,  push: false, slack: false },
      ],
    },
    {
      label: 'Product',
      rows: [
        { label: 'Product updates',   desc: 'New features, improvements, and changelogs',    email: true,  push: false, slack: false },
        { label: 'Tips & practices',  desc: 'Occasional usage tips and resources',            email: false, push: false, slack: false },
      ],
    },
  ];

  return (
    <PanelCard title="Notifications" desc="Choose how and where Cadence alerts you.">
      {/* Column headers */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 0 10px',
        borderBottom: '1.5px solid var(--border)',
        marginBottom: 2,
      }}>
        <div style={{ flex: 1 }} />
        {CHANNELS.map(ch => (
          <div key={ch} style={{
            width: COL_W, textAlign: 'center',
            fontSize: 10.5, fontWeight: 800, color: 'var(--text-faint)',
            textTransform: 'uppercase', letterSpacing: '0.07em',
          }}>
            {ch}
          </div>
        ))}
      </div>

      {groups.map((group, gi) => (
        <div key={group.label}>
          <div style={{
            fontSize: 10.5, fontWeight: 800, color: 'var(--text-faint)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '14px 0 6px',
          }}>
            {group.label}
          </div>
          {group.rows.map((r, ri) => {
            const isLast = ri === group.rows.length - 1 && gi === groups.length - 1;
            return (
              <div key={r.label} style={{
                display: 'flex', alignItems: 'center',
                padding: '11px 0',
                borderBottom: !isLast ? '1px solid var(--border-soft)' : 'none',
              }}>
                <div style={{ flex: 1, paddingRight: 16 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 2 }}>
                    {r.label}
                  </div>
                  <div className="text-xs text-subtle">{r.desc}</div>
                </div>
                <div style={{ width: COL_W, display: 'flex', justifyContent: 'center' }}>
                  <Toggle on={r.email} />
                </div>
                <div style={{ width: COL_W, display: 'flex', justifyContent: 'center' }}>
                  <Toggle on={r.push} />
                </div>
                <div style={{ width: COL_W, display: 'flex', justifyContent: 'center' }}>
                  <Toggle on={r.slack} />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </PanelCard>
  );
}

/* ═══════════════════════════════════════════════════════
   Billing panel
   ═══════════════════════════════════════════════════════ */

function BillingPanel() {
  const I = window.Ic;
  const features = [
    '5,000 AI generations / month',
    '500 scheduled posts',
    '10 connected channels',
    'AI co-writer & brand voice',
    'Analytics & performance',
    'Up to 10 seats',
  ];

  const invoices = [
    { date: 'May 24, 2026', amount: '$116.00', status: 'Paid', id: 'INV-0048' },
    { date: 'Apr 24, 2026', amount: '$116.00', status: 'Paid', id: 'INV-0047' },
    { date: 'Mar 24, 2026', amount: '$116.00', status: 'Paid', id: 'INV-0046' },
  ];

  return (
    <>
      {/* Plan hero */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '24px 24px 20px',
          background: 'linear-gradient(135deg, var(--violet-50) 0%, #F0F9FF 100%)',
          borderBottom: '1px solid var(--border-soft)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <div>
              <span className="ai-pill" style={{ display: 'inline-flex', marginBottom: 12 }}>
                <I.Star size={11} /> Pro Plan
              </span>
              <div className="font-tight" style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--text-strong)', lineHeight: 1 }}>
                $29
                <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 5 }}>
                  / seat / mo
                </span>
              </div>
              <div className="text-sm text-subtle" style={{ marginTop: 7 }}>
                Renews June 24, 2026 · 4 seats · <strong style={{ color: 'var(--text-strong)' }}>$116 / mo total</strong>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary">Manage plan</button>
              <button className="btn btn-gradient">
                <I.Sparkles size={13} />Upgrade to Studio
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px 16px' }}>
            {features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <I.CheckCircle size={13} style={{ color: 'var(--violet-500)', flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage meters */}
        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <UsageBar label="AI generations"     used={1240} total={5000} />
          <UsageBar label="Scheduled posts"    used={86}   total={500}  />
          <UsageBar label="Connected channels" used={4}    total={10}   />
        </div>
      </div>

      {/* Seats */}
      <PanelCard title="Seats" desc="Each member with Editor access or above requires a seat.">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{
                  width: 11, height: 11, borderRadius: 4,
                  background: i < 4 ? 'var(--violet-500)' : 'var(--zinc-200)',
                  transition: 'background 0.2s',
                }} />
              ))}
            </div>
            <div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>4 of 10</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 5 }}>seats used</span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm"><I.Plus size={12} />Add seats</button>
        </div>
      </PanelCard>

      {/* Payment method */}
      <PanelCard title="Payment method" desc="Used for automatic plan renewal.">
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px',
          border: '1.5px solid var(--border)', borderRadius: 12, marginBottom: 14,
        }}>
          <div style={{
            width: 48, height: 32, borderRadius: 7,
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            display: 'grid', placeItems: 'center',
            color: 'white', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em',
            flexShrink: 0,
          }}>
            VISA
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>Visa ending in 4242</div>
            <div className="text-xs text-subtle">Expires 09 / 28</div>
          </div>
          <span className="badge badge-published"><span className="dot" />Default</span>
          <button className="btn btn-secondary btn-sm">Replace</button>
        </div>
        <button className="btn btn-ghost btn-sm">
          <I.Plus size={12} />Add payment method
        </button>
      </PanelCard>

      {/* Invoice history */}
      <PanelCard title="Billing history" desc="Download PDF invoices for your records.">
        {invoices.map((inv, i) => (
          <div key={inv.id} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 0',
            borderBottom: i < invoices.length - 1 ? '1px solid var(--border-soft)' : 'none',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'var(--zinc-100)', display: 'grid', placeItems: 'center',
              color: 'var(--text-subtle)', flexShrink: 0,
            }}>
              <I.FileText size={15} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>
                Pro Plan · {inv.date}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-faint)', fontFamily: "'JetBrains Mono', monospace" }}>{inv.id}</div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>{inv.amount}</span>
            <span className="badge badge-published"><span className="dot" />{inv.status}</span>
            <button className="btn btn-ghost btn-sm">
              <I.ArrowDown size={12} />PDF
            </button>
          </div>
        ))}
      </PanelCard>
    </>
  );
}

function UsageBar({ label, used, total }) {
  const pct = Math.min(used / total, 1) * 100;
  const warn = pct > 80;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-strong)' }}>{label}</span>
        <span style={{
          fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
          color: warn ? 'var(--warning)' : 'var(--text-subtle)', fontWeight: 600,
        }}>
          {used.toLocaleString()}<span style={{ color: 'var(--text-faint)' }}>/{total.toLocaleString()}</span>
        </span>
      </div>
      <div className="usage-bar-track">
        <div className="usage-bar-fill" style={{ width: `${pct}%`, background: warn ? 'var(--warning)' : undefined }} />
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--text-faint)', marginTop: 5, fontWeight: 500 }}>
        {Math.round(pct)}% used
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Security panel
   ═══════════════════════════════════════════════════════ */

function SecurityPanel() {
  const I = window.Ic;
  const sessions = [
    { dev: 'MacBook Pro',  browser: 'Chrome 124',  loc: 'San Francisco, CA', time: 'Active now',  current: true,  IconComp: I.Command,  iconBg: 'var(--violet-50)',  iconColor: 'var(--violet-500)' },
    { dev: 'iPhone 16',    browser: 'Cadence App', loc: 'San Francisco, CA', time: '2 hours ago', current: false, IconComp: I.Send,     iconBg: 'var(--zinc-100)',   iconColor: 'var(--text-subtle)' },
    { dev: 'Windows PC',   browser: 'Edge 123',    loc: 'Seattle, WA',       time: '3 days ago',  current: false, IconComp: I.Layout,   iconBg: 'var(--zinc-100)',   iconColor: 'var(--text-subtle)' },
  ];

  const apiKeys = [
    { name: 'Production API key',  token: 'cad_sk_live_••••••••4f2a', created: 'Apr 12, 2026', lastUsed: '2 min ago'   },
    { name: 'Dev / staging key',   token: 'cad_sk_test_••••••••8b91', created: 'Mar 3, 2026',  lastUsed: '14 days ago' },
  ];

  return (
    <>
      <PanelCard title="Sign-in" desc="Control how you authenticate into Cadence.">
        <SettingsRow
          label="Password"
          desc="Last changed 3 months ago"
          control={<button className="btn btn-secondary btn-sm">Change password</button>}
        />
        <SettingsRow
          label="Two-factor authentication"
          desc="Required for all owners and admins on this workspace"
          control={<Toggle on />}
        />
        <SettingsRow
          label="Passkeys"
          desc="Sign in using Face ID, fingerprint, or a hardware security key"
          control={<button className="btn btn-secondary btn-sm"><I.Plus size={12} />Add passkey</button>}
          last
        />
      </PanelCard>

      {/* Active sessions */}
      <PanelCard
        title="Active sessions"
        desc="All devices currently signed into your account."
        actions={
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', fontSize: 12 }}>
            Sign out all others
          </button>
        }
        noPadding
      >
        {sessions.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '13px 24px',
            borderBottom: i < sessions.length - 1 ? '1px solid var(--border-soft)' : 'none',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
              background: s.iconBg,
              display: 'grid', placeItems: 'center',
              color: s.iconColor,
            }}>
              <s.IconComp size={17} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>
                  {s.dev} · {s.browser}
                </span>
                {s.current && (
                  <span className="badge badge-published" style={{ fontSize: 10.5 }}>
                    <span className="dot" />This device
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
                {s.loc} · {s.time}
              </div>
            </div>
            {!s.current && (
              <button className="btn btn-secondary btn-sm">Revoke</button>
            )}
          </div>
        ))}
      </PanelCard>

      {/* API Keys */}
      <PanelCard
        title="API keys"
        desc="Authenticate Cadence API requests from your apps and scripts."
        actions={
          <button className="btn btn-secondary btn-sm"><I.Plus size={12} />New key</button>
        }
        noPadding
      >
        {apiKeys.map((k, i) => (
          <div key={k.name} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 24px',
            borderBottom: i < apiKeys.length - 1 ? '1px solid var(--border-soft)' : 'none',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--zinc-100)', display: 'grid', placeItems: 'center',
              color: 'var(--text-subtle)', flexShrink: 0,
            }}>
              <I.Command size={15} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 4 }}>{k.name}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <code style={{
                  fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--text-subtle)', background: 'var(--zinc-100)',
                  padding: '2px 8px', borderRadius: 5, letterSpacing: '0.02em',
                }}>
                  {k.token}
                </code>
                <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>Created {k.created}</span>
                <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>· Used {k.lastUsed}</span>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm"><I.Copy size={12} />Copy</button>
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Revoke</button>
          </div>
        ))}
      </PanelCard>

      {/* Danger zone */}
      <div className="card" style={{ border: '1.5px solid #FECACA' }}>
        <div className="card-header card-header-lg">
          <div>
            <div className="card-title" style={{ color: 'var(--error)' }}>Danger zone</div>
            <div className="card-sub">These actions are permanent and cannot be undone.</div>
          </div>
        </div>
        <div style={{ padding: '0 24px 24px' }}>
          <SettingsRow
            label="Export all data"
            desc="Download a zip of all posts, analytics, and workspace data."
            control={<button className="btn btn-secondary btn-sm"><I.ArrowDown size={12} />Export</button>}
          />
          <SettingsRow
            label="Delete workspace"
            desc="Permanently delete this workspace, all members, posts, and data."
            danger
            control={
              <button style={{
                fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 8,
                border: '1.5px solid var(--error)', color: 'var(--error)',
                background: 'transparent', fontFamily: 'inherit', cursor: 'pointer',
              }}>
                Delete workspace
              </button>
            }
            last
          />
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Appearance panel
   ═══════════════════════════════════════════════════════ */

function AppearancePanel() {
  const I = window.Ic;
  const [theme,   setTheme]   = React.useState('light');
  const [accent,  setAccent]  = React.useState('#7C3AED');
  const [density, setDensity] = React.useState('comfortable');

  const accents = [
    { color: '#7C3AED', name: 'Violet'  },
    { color: '#6366F1', name: 'Indigo'  },
    { color: '#0EA5E9', name: 'Sky'     },
    { color: '#059669', name: 'Emerald' },
    { color: '#D97706', name: 'Amber'   },
    { color: '#DC2626', name: 'Red'     },
    { color: '#18181B', name: 'Zinc'    },
  ];

  const themes = [
    {
      key: 'light', label: 'Light',
      preview: { bg: '#FFFFFF', surface: '#F4F4F5', text: '#09090B', accent: '#7C3AED' },
    },
    {
      key: 'dark', label: 'Dark',
      preview: { bg: '#09090B', surface: '#27272A', text: '#FAFAFA', accent: '#A78BFA' },
    },
    {
      key: 'system', label: 'System',
      preview: null,
    },
  ];

  return (
    <PanelCard title="Appearance" desc="Customize how Cadence looks and feels for you.">

      {/* Theme picker */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 12 }}>Theme</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {themes.map(t => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              style={{
                border: theme === t.key ? '2px solid var(--violet-500)' : '2px solid var(--border)',
                borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                background: 'transparent', fontFamily: 'inherit',
                boxShadow: theme === t.key ? '0 0 0 4px rgba(124,58,237,0.1)' : 'none',
                transition: 'all 0.15s', padding: 0,
              }}
            >
              {t.preview ? (
                <div style={{ height: 66, background: t.preview.bg, padding: '10px 8px', display: 'flex', gap: 5 }}>
                  <div style={{ width: 26, background: t.preview.surface, borderRadius: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
                    <div style={{ height: 5, background: t.preview.text, borderRadius: 3, opacity: 0.8, width: '75%' }} />
                    <div style={{ height: 4, background: t.preview.surface, borderRadius: 3, width: '90%' }} />
                    <div style={{ height: 4, background: t.preview.accent, borderRadius: 3, width: '45%', opacity: 0.8 }} />
                    <div style={{ height: 4, background: t.preview.surface, borderRadius: 3, width: '60%' }} />
                  </div>
                </div>
              ) : (
                <div style={{ height: 66, background: 'linear-gradient(135deg, #FFFFFF 50%, #09090B 50%)', display: 'grid', placeItems: 'center', fontSize: 22 }}>
                  ◐
                </div>
              )}
              <div style={{
                padding: '8px 10px', textAlign: 'center',
                background: theme === t.key ? 'var(--violet-50)' : 'var(--surface-sunken)',
                fontSize: 12.5, fontWeight: theme === t.key ? 700 : 500,
                color: theme === t.key ? 'var(--violet-700)' : 'var(--text-muted)',
                borderTop: theme === t.key ? '1px solid var(--violet-200)' : '1px solid var(--border-soft)',
              }}>
                {t.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <SettingsRow
        label="Accent color"
        desc="Applied to highlights, buttons, and active states across the app."
        control={
          <div style={{ display: 'flex', gap: 6 }}>
            {accents.map(a => (
              <button
                key={a.color}
                title={a.name}
                onClick={() => setAccent(a.color)}
                style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: a.color, cursor: 'pointer',
                  border: accent === a.color ? '2px solid white' : '2px solid transparent',
                  boxShadow: accent === a.color ? `0 0 0 2.5px ${a.color}` : '0 0 0 2.5px transparent',
                  transition: 'box-shadow 0.15s',
                  outline: 'none',
                }}
              />
            ))}
          </div>
        }
      />

      {/* Density */}
      <SettingsRow
        label="Density"
        desc="How compactly information is displayed in lists and tables."
        control={
          <div className="seg">
            {['Compact', 'Default', 'Spacious'].map(d => (
              <button
                key={d}
                className={density === d.toLowerCase() || (d === 'Default' && density === 'comfortable') ? 'active' : ''}
                onClick={() => setDensity(d === 'Default' ? 'comfortable' : d.toLowerCase())}
              >
                {d}
              </button>
            ))}
          </div>
        }
      />

      {/* Interface font */}
      <SettingsRow
        label="Interface font"
        desc="Typography used throughout the app."
        control={
          <select className="input" style={{ width: 170, padding: '6px 10px', fontSize: 13 }}>
            <option>Inter (Default)</option>
            <option>System UI</option>
            <option>Geist</option>
          </select>
        }
      />

      {/* Collapsed sidebar */}
      <SettingsRow
        label="Collapsed sidebar"
        desc="Show icons only — gives content more horizontal space."
        control={<Toggle />}
      />

      {/* Reduce motion */}
      <SettingsRow
        label="Reduce motion"
        desc="Minimises animations and transitions for accessibility."
        control={<Toggle />}
      />

      {/* High contrast */}
      <SettingsRow
        label="High contrast"
        desc="Increases border and text contrast for better readability."
        control={<Toggle />}
        last
      />

      <div className="flex justify-end" style={{ marginTop: 22 }}>
        <button className="btn btn-secondary" style={{ marginRight: 8 }}>Reset to defaults</button>
        <button className="btn btn-primary">Save preferences</button>
      </div>
    </PanelCard>
  );
}

window.SettingsPage = SettingsPage;

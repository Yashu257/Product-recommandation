// Settings — sectioned panels with sidebar nav
function SettingsPage({ data }) {
  const I = window.Ic;
  const [active, setActive] = React.useState('profile');

  const sections = [
    { key: 'profile',    icon: <I.User />,      label: 'Profile' },
    { key: 'workspace',  icon: <I.Layers />,    label: 'Workspace' },
    { key: 'accounts',   icon: <I.Globe />,     label: 'Connected channels' },
    { key: 'brand',      icon: <I.Megaphone />, label: 'Brand voice' },
    { key: 'notifs',     icon: <I.Bell />,      label: 'Notifications' },
    { key: 'billing',    icon: <I.Card />,      label: 'Plan & billing' },
    { key: 'security',   icon: <I.Shield />,    label: 'Security' },
    { key: 'appearance', icon: <I.Palette />,   label: 'Appearance' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: 28 }}>
        <div className="page-title-row">
          <div className="page-title">Settings</div>
          <div className="page-subtitle">Manage your workspace, billing, and integrations.</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '228px 1fr', gap: 20 }}>

        {/* Settings nav */}
        <div style={{ position: 'sticky', top: 72, alignSelf: 'start' }}>
          <div className="card" style={{ padding: '8px 6px' }}>
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`settings-nav-item${active === s.key ? ' active' : ''}`}
              >
                {React.cloneElement(s.icon, { size: 15 })}
                <span>{s.label}</span>
              </button>
            ))}
            <div className="hr" style={{ margin: '8px 4px' }} />
            <button
              className="settings-nav-item"
              style={{ color: 'var(--error)' }}
            >
              <I.LogOut size={15} style={{ color: 'var(--error)' }} />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        {/* Panel area */}
        <div className="col gap-5" style={{ maxWidth: 860 }}>
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

/* ── Shared panel primitives ── */

function PanelCard({ title, desc, children, actions }) {
  return (
    <div className="card">
      <div className="card-header card-header-lg">
        <div>
          <div className="card-title">{title}</div>
          {desc && <div className="card-sub" style={{ marginTop: 3 }}>{desc}</div>}
        </div>
        {actions}
      </div>
      <div style={{ padding: '0 24px 24px' }}>{children}</div>
    </div>
  );
}

function SettingsRow({ label, desc, control, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 24, padding: '16px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-soft)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)', marginBottom: desc ? 3 : 0 }}>
          {label}
        </div>
        {desc && (
          <div className="text-sm text-subtle" style={{ maxWidth: 480, lineHeight: 1.5 }}>{desc}</div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}

function Toggle({ on: initial = false }) {
  const [on, setOn] = React.useState(initial);
  return (
    <button
      className={`toggle ${on ? 'on' : 'off'}`}
      onClick={() => setOn(!on)}
      aria-checked={on}
      role="switch"
    >
      <span className="toggle-thumb" />
    </button>
  );
}

/* ── Profile panel ── */

function ProfilePanel() {
  return (
    <PanelCard title="Profile" desc="How you appear across the workspace.">
      {/* Avatar + name row */}
      <div className="flex items-center gap-5 mb-6 pb-6" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        <div className="avatar lg">SJ</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Sarah Johnson</div>
          <div className="text-sm text-subtle">sarah@cadence.app · Pacific Time</div>
        </div>
        <button className="btn btn-secondary btn-sm">
          <window.Ic.Image size={13} />Change photo
        </button>
      </div>

      {/* Form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label className="label">Full name</label>
          <input className="input" defaultValue="Sarah Johnson" />
        </div>
        <div>
          <label className="label">Display handle</label>
          <input className="input" defaultValue="@sarahjohnson" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label className="label">Email</label>
          <input className="input" defaultValue="sarah@cadence.app" />
        </div>
        <div>
          <label className="label">Timezone</label>
          <select className="input">
            <option>Pacific Time (Los Angeles)</option>
            <option>Eastern Time (New York)</option>
            <option>Central European Time (Berlin)</option>
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label className="label">Bio</label>
        <textarea
          className="textarea"
          defaultValue="Head of Content at Cadence. Writing about creator economy, brand voice, and AI."
          style={{ minHeight: 80 }}
        />
        <div className="helper">Used across your default post previews and signature blocks.</div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button className="btn btn-secondary">Cancel</button>
        <button className="btn btn-primary">Save changes</button>
      </div>
    </PanelCard>
  );
}

/* ── Workspace panel ── */

function WorkspacePanel() {
  const members = [
    { name: 'Sarah Johnson', email: 'sarah@cadence.app',  role: 'Owner',  avatar: 'SJ' },
    { name: 'Marcus Chen',   email: 'marcus@cadence.app', role: 'Admin',  avatar: 'MC' },
    { name: 'Ava Park',      email: 'ava@cadence.app',    role: 'Editor', avatar: 'AP' },
    { name: 'Diego Rivera',  email: 'diego@cadence.app',  role: 'Viewer', avatar: 'DR' },
  ];
  return (
    <PanelCard
      title="Workspace members"
      desc="Invite teammates and control their access level."
      actions={
        <button className="btn btn-gradient btn-sm">
          <window.Ic.Plus size={12} />Invite
        </button>
      }
    >
      <div>
        {members.map((m, i) => (
          <div key={m.email} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '13px 0',
            borderBottom: i < members.length - 1 ? '1px solid var(--border-soft)' : 'none',
          }}>
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 11 }}>{m.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>{m.name}</div>
              <div className="text-xs text-subtle">{m.email}</div>
            </div>
            <select className="input" style={{ width: 110, padding: '6px 10px', fontSize: 13 }} defaultValue={m.role}>
              <option>Owner</option>
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
            <button className="icon-btn" style={{ width: 30, height: 30 }}>
              <window.Ic.MoreHoriz />
            </button>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}

/* ── Accounts panel ── */

function AccountsPanel({ data }) {
  const I = window.Ic;
  return (
    <>
      <PanelCard
        title="Connected channels"
        desc="Manage social accounts that publish from this workspace."
        actions={
          <button className="btn btn-secondary btn-sm">
            <I.Plus size={13} />Add channel
          </button>
        }
      >
        <div className="col gap-3 mt-2">
          {data.accounts.map(a => (
            <div key={a.handle} className="flex items-center gap-4" style={{
              padding: '14px 16px',
              border: '1.5px solid var(--border)',
              borderRadius: 12,
              transition: 'all var(--dur-base) var(--ease)',
            }}>
              <I.PlatformMark p={a.platform} size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 2 }}>{a.handle}</div>
                <div className="text-sm text-subtle">
                  {I.PlatformName(a.platform)} · {a.followers} followers
                </div>
              </div>
              <span className="badge badge-published"><span className="dot" />Active</span>
              <button className="btn btn-secondary btn-sm">Manage</button>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard title="Integrations" desc="Extend Cadence with the tools your team uses.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 4 }}>
          {[
            { name: 'Slack',    desc: 'Approvals & notifications' },
            { name: 'Notion',   desc: 'Sync content briefs' },
            { name: 'Figma',    desc: 'Pull design assets' },
            { name: 'Webhooks', desc: 'Custom triggers' },
            { name: 'Zapier',   desc: '5,000+ app connections' },
            { name: 'API',      desc: 'Build your own flows' },
          ].map(int => (
            <button key={int.name} className="lift" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px', borderRadius: 11,
              border: '1.5px solid var(--border)', background: 'white',
              textAlign: 'left', cursor: 'pointer',
              transition: 'all var(--dur-slow) var(--ease)',
              fontFamily: 'inherit',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'var(--zinc-100)',
                display: 'grid', placeItems: 'center',
                color: 'var(--text-subtle)',
              }}>
                <I.Link size={16} />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{int.name}</div>
                <div className="text-xs text-subtle">{int.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </PanelCard>
    </>
  );
}

/* ── Brand voice panel ── */

function BrandVoicePanel() {
  const attrs = [
    { label: 'Tone',          value: 'Warm · curious · slightly contrarian' },
    { label: 'Reading level', value: '9th grade — accessible, not dumbed down' },
    { label: 'Avoid',         value: 'Corporate jargon, em-dashes, "leverage", "synergy"' },
    { label: 'Champion',      value: 'Concrete numbers, vulnerable moments, second-person CTAs' },
  ];
  return (
    <PanelCard title="Brand voice" desc="Cadence AI learns from approved posts to match your tone.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24, marginTop: 4 }}>
        {attrs.map(a => (
          <div key={a.label} style={{
            padding: '14px 16px',
            background: 'var(--surface-sunken)',
            borderRadius: 11,
            border: '1px solid var(--border-soft)',
          }}>
            <div className="text-xs text-subtle uppercase" style={{ letterSpacing: '0.06em', fontWeight: 700, marginBottom: 6 }}>
              {a.label}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-strong)', lineHeight: 1.5 }}>
              {a.value}
            </div>
          </div>
        ))}
      </div>

      {/* Retrain banner */}
      <div className="flex items-center gap-4" style={{
        padding: '16px 18px',
        background: 'var(--gradient-soft)',
        border: '1px solid var(--violet-100)',
        borderRadius: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: 'var(--gradient-ai)', color: 'white',
          display: 'grid', placeItems: 'center',
          boxShadow: 'var(--shadow-violet)',
        }}>
          <window.Ic.Sparkles size={17} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Retrain voice model</div>
          <div className="text-xs text-subtle">
            Re-analyze your latest 30 published posts to refine the tone.
          </div>
        </div>
        <button className="btn btn-primary btn-sm">Retrain</button>
      </div>
    </PanelCard>
  );
}

/* ── Notifications panel ── */

function NotificationsPanel() {
  const rows = [
    { label: 'Post published',      desc: 'When a scheduled post goes live successfully',    on: true },
    { label: 'Publish failures',    desc: 'When a channel rejects or retries a post',        on: true },
    { label: 'AI suggestions',      desc: 'Daily digest of new content recommendations',     on: false },
    { label: 'Team activity',       desc: 'When teammates edit, comment, or approve',        on: true },
    { label: 'Weekly performance',  desc: "Sunday recap of last week's reach and growth",    on: true },
    { label: 'Marketing & product', desc: 'Tips, new features, occasional invitations',      on: false },
  ];
  return (
    <PanelCard title="Notifications" desc="Choose where and how you'd like to be alerted.">
      {rows.map((r, i) => (
        <SettingsRow
          key={r.label}
          label={r.label}
          desc={r.desc}
          control={<Toggle on={r.on} />}
          last={i === rows.length - 1}
        />
      ))}
    </PanelCard>
  );
}

/* ── Billing panel ── */

function BillingPanel() {
  return (
    <>
      {/* Plan card */}
      <div className="card">
        <div style={{
          padding: '24px',
          background: 'var(--gradient-soft)',
          borderBottom: '1px solid var(--border-soft)',
          borderRadius: '14px 14px 0 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <span className="ai-pill mb-3" style={{ display: 'inline-flex', marginBottom: 10 }}>
              <window.Ic.Star size={11} /> Pro Plan
            </span>
            <div className="font-tight" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-strong)', marginTop: 6 }}>
              $29 <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-muted)' }}>/ user / month</span>
            </div>
            <div className="text-sm text-subtle" style={{ marginTop: 4 }}>
              Renews June 24, 2026 · 4 seats
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary">Manage plan</button>
            <button className="btn btn-gradient">
              <window.Ic.Sparkles size={13} />Upgrade to Studio
            </button>
          </div>
        </div>

        <div style={{
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
        }}>
          <UsageBar label="AI generations"      used={1240} total={5000} />
          <UsageBar label="Scheduled posts"     used={86}   total={500} />
          <UsageBar label="Connected channels"  used={4}    total={10} />
        </div>
      </div>

      {/* Payment method */}
      <PanelCard title="Payment method" desc="Cards on file for automatic renewal.">
        <div className="flex items-center gap-4 mt-2" style={{
          padding: '14px 16px',
          border: '1px solid var(--border)',
          borderRadius: 12,
        }}>
          <div style={{
            width: 44, height: 30, borderRadius: 6,
            background: 'linear-gradient(135deg, #1E293B, #0F172A)',
            display: 'grid', placeItems: 'center',
            color: 'white', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
          }}>
            VISA
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Visa ending in 4242</div>
            <div className="text-xs text-subtle">Expires 09 / 28 · default</div>
          </div>
          <button className="btn btn-secondary btn-sm">Edit</button>
        </div>
      </PanelCard>
    </>
  );
}

function UsageBar({ label, used, total }) {
  const pct = Math.min(used / total, 1) * 100;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-xs font-semi text-strong">{label}</span>
        <span className="mono text-xs text-subtle">{used.toLocaleString()} / {total.toLocaleString()}</span>
      </div>
      <div className="usage-bar-track">
        <div className="usage-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Security panel ── */

function SecurityPanel() {
  return (
    <>
      <PanelCard title="Sign-in" desc="Set how you log into Cadence.">
        <SettingsRow
          label="Password"
          desc="Last changed 3 months ago"
          control={<button className="btn btn-secondary btn-sm">Update</button>}
        />
        <SettingsRow
          label="Two-factor auth"
          desc="Required for all owners and admins"
          control={<Toggle on />}
        />
        <SettingsRow
          label="Passkeys"
          desc="Use Face ID, fingerprint, or hardware key"
          control={<button className="btn btn-secondary btn-sm">Add passkey</button>}
          last
        />
      </PanelCard>

      <PanelCard title="Active sessions" desc="Devices currently signed into your account.">
        {[
          { dev: 'MacBook Pro — Chrome', loc: 'San Francisco, CA', time: 'Active now', current: true },
          { dev: 'iPhone 16 — Cadence',  loc: 'San Francisco, CA', time: '2 hours ago' },
          { dev: 'Windows — Edge',        loc: 'Seattle, WA',       time: '3 days ago' },
        ].map((s, i, arr) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '13px 0',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border-soft)' : 'none',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'var(--zinc-100)',
              display: 'grid', placeItems: 'center',
              color: 'var(--text-subtle)',
            }}>
              <window.Ic.Shield size={14} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                {s.dev}
                {s.current && (
                  <span className="badge badge-published" style={{ marginLeft: 8, fontSize: 10 }}>
                    <span className="dot" />Current
                  </span>
                )}
              </div>
              <div className="text-xs text-subtle">{s.loc} · {s.time}</div>
            </div>
            {!s.current && (
              <button className="btn btn-secondary btn-sm">Sign out</button>
            )}
          </div>
        ))}
      </PanelCard>
    </>
  );
}

/* ── Appearance panel ── */

function AppearancePanel() {
  const accents = ['#7C3AED', '#6366F1', '#059669', '#D97706', '#DC2626', '#18181B'];
  return (
    <PanelCard title="Appearance" desc="Customize the look and feel of your workspace.">
      <SettingsRow
        label="Theme"
        desc="System matches your OS preference."
        control={
          <div className="seg">
            <button className="active">Light</button>
            <button>Dark</button>
            <button>System</button>
          </div>
        }
      />
      <SettingsRow
        label="Accent color"
        desc="Applied to highlights, links, and active states."
        control={
          <div className="flex gap-2">
            {accents.map((c, i) => (
              <button key={c} style={{
                width: 22, height: 22,
                borderRadius: 6,
                background: c,
                border: i === 0 ? '2px solid white' : '2px solid transparent',
                boxShadow: i === 0 ? '0 0 0 2px var(--violet-500)' : 'none',
                cursor: 'pointer',
              }} />
            ))}
          </div>
        }
      />
      <SettingsRow
        label="Density"
        desc="How tightly information is packed."
        control={
          <div className="seg">
            <button>Compact</button>
            <button className="active">Comfortable</button>
            <button>Spacious</button>
          </div>
        }
      />
      <SettingsRow
        label="Collapsed sidebar"
        desc="Free up more horizontal space."
        control={<Toggle />}
        last
      />
    </PanelCard>
  );
}

window.SettingsPage = SettingsPage;

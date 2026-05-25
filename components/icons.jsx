// Icon set — Lucide-inspired stroke icons, drawn inline.
// All icons: 24x24 viewBox, currentColor stroke, 1.75 width.
const Ic = {};
const __mkIcon = (paths) => ({ className = '', style = {}, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size, ...style } : style}
    dangerouslySetInnerHTML={{ __html: paths }}
  />
);

Ic.Home       = __mkIcon('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>');
Ic.Calendar   = __mkIcon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>');
Ic.PenLine    = __mkIcon('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>');
Ic.Sparkles   = __mkIcon('<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2"/><circle cx="12" cy="12" r="3.2"/>');
Ic.Settings   = __mkIcon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>');
Ic.Search     = __mkIcon('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>');
Ic.Bell       = __mkIcon('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>');
Ic.Plus       = __mkIcon('<path d="M12 5v14M5 12h14"/>');
Ic.ChevronLeft= __mkIcon('<path d="m15 18-6-6 6-6"/>');
Ic.ChevronRight=__mkIcon('<path d="m9 18 6-6-6-6"/>');
Ic.ChevronDown= __mkIcon('<path d="m6 9 6 6 6-6"/>');
Ic.MoreHoriz  = __mkIcon('<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>');
Ic.ArrowUp    = __mkIcon('<path d="M7 17 17 7M9 7h8v8"/>');
Ic.ArrowDown  = __mkIcon('<path d="M7 7l10 10M17 9v8H9"/>');
Ic.ArrowRight = __mkIcon('<path d="M5 12h14M13 5l7 7-7 7"/>');
Ic.ArrowLeft  = __mkIcon('<path d="M19 12H5M11 19l-7-7 7-7"/>');
Ic.Edit       = __mkIcon('<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>');
Ic.Trash      = __mkIcon('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1.5 14a2 2 0 0 1-2 1.8h-7a2 2 0 0 1-2-1.8L5 6"/>');
Ic.Copy       = __mkIcon('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>');
Ic.Refresh    = __mkIcon('<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>');
Ic.Send       = __mkIcon('<path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/>');
Ic.Save       = __mkIcon('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>');
Ic.Image      = __mkIcon('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>');
Ic.Video      = __mkIcon('<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>');
Ic.Smile      = __mkIcon('<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>');
Ic.Hash       = __mkIcon('<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>');
Ic.Clock      = __mkIcon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>');
Ic.Eye        = __mkIcon('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>');
Ic.TrendUp    = __mkIcon('<path d="M3 17 9 11l4 4 8-8"/><path d="M14 7h7v7"/>');
Ic.Bolt       = __mkIcon('<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>');
Ic.Lightbulb  = __mkIcon('<path d="M9 18h6"/><path d="M10 22h4"/><path d="M2 9a10 10 0 0 1 20 0c0 3.3-1.8 5.6-4 7-1 .7-1 1.4-1 2H7c0-.6 0-1.3-1-2-2.2-1.4-4-3.7-4-7z"/>');
Ic.Globe      = __mkIcon('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>');
Ic.Layers     = __mkIcon('<path d="m12 2 10 6-10 6L2 8l10-6z"/><path d="m2 16 10 6 10-6M2 12l10 6 10-6"/>');
Ic.Inbox      = __mkIcon('<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13a2 2 0 0 1 2 1.8l1 11A2 2 0 0 1 19.5 20h-15a2 2 0 0 1-2-2.2l1-11A2 2 0 0 1 5.5 5z"/>');
Ic.User       = __mkIcon('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>');
Ic.Shield     = __mkIcon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>');
Ic.Card       = __mkIcon('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>');
Ic.Palette    = __mkIcon('<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5s-.5-1.3-.5-2 .7-1.5 1.5-1.5h2c2.5 0 4.5-2 4.5-4.5C21 6 17 2 12 2z"/>');
Ic.Check      = __mkIcon('<path d="M20 6 9 17l-5-5"/>');
Ic.X          = __mkIcon('<path d="M18 6 6 18M6 6l12 12"/>');
Ic.FileText   = __mkIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>');
Ic.FileEdit   = __mkIcon('<path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5"/><polyline points="14 2 14 8 20 8"/><path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l1-3.95 5.42-5.44z"/>');
Ic.CheckCircle= __mkIcon('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>');
Ic.Filter     = __mkIcon('<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>');
Ic.Wand       = __mkIcon('<path d="m15 4 1.5 1.5L20 2l-1.5 3.5L20 7l-3.5-1.5L15 9l-1.5-3.5L10 4l3.5-1.5L15 0"/><path d="M2 22 13 11"/>');
Ic.Layout     = __mkIcon('<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>');
Ic.MessageCircle = __mkIcon('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>');
Ic.Paperclip  = __mkIcon('<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>');
Ic.History    = __mkIcon('<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/>');
Ic.Star       = __mkIcon('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>');
Ic.Megaphone  = __mkIcon('<path d="M3 11v3a1 1 0 0 0 1 1h2l3.5 5L11 19v-2"/><path d="M11 6V4l-1.5-1L3 7v3a1 1 0 0 0 1 1h7l8 5V1l-8 5"/>');
Ic.Zap        = __mkIcon('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>');
Ic.Target     = __mkIcon('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>');
Ic.Activity   = __mkIcon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>');
Ic.LogOut     = __mkIcon('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>');
Ic.Link       = __mkIcon('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>');
Ic.Command    = __mkIcon('<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>');

Ic.PlatformMark = ({ p, size = 'md' }) => {
  // p: 'x' | 'fb' | 'ig' | 'li'
  const cls = `pmark pmark-${p}${size === 'sm' ? ' sm' : size === 'lg' ? ' lg' : ''}`;
  const labels = { x: '𝕏', fb: 'f', ig: '◎', li: 'in' };
  return <span className={cls}>{labels[p]}</span>;
};

Ic.PlatformName = (p) => ({ x: 'X (Twitter)', fb: 'Facebook', ig: 'Instagram', li: 'LinkedIn' }[p]);
Ic.PlatformLimit = (p) => ({ x: 280, fb: 63206, ig: 2200, li: 3000 }[p]);

window.Ic = Ic;

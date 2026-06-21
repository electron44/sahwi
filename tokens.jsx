// Sahw - primitives éditoriales « Folio »

const C = {
  bg:'var(--bg)', surface:'var(--surface)',
  ink:'var(--ink)', ink2:'var(--ink-2)', ink3:'var(--ink-3)',
  rule:'var(--rule)', ruleStrong:'var(--rule-strong)', hover:'var(--hover)',
  accent:'var(--accent)',
  qabli:'var(--qabli)', badi:'var(--badi)', rien:'var(--rien)', reprendre:'var(--reprendre)',
};
const STATUT = { qabli:'var(--qabli)', badi:'var(--badi)', rien:'var(--rien)', reprendre:'var(--reprendre)' };

function Icon({ name, size = 18, stroke = 1.6, color = 'currentColor', style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    ref.current.appendChild(i);
    try { window.lucide.createIcons({ attrs: { width: size, height: size, 'stroke-width': stroke, stroke: color } }); } catch (e) {}
  });
  return <span ref={ref} aria-hidden="true" style={{ display:'inline-flex', lineHeight:0, width:size, height:size, ...style }} />;
}

function MetaText({ children, color = C.ink3, size = 12, spacing = 0.4, style }) {
  return (
    <span style={{ fontFamily:'var(--mono)', fontSize:size, fontWeight:400, letterSpacing:spacing, color, ...style }}>
      {children}
    </span>
  );
}

function Eyebrow({ children, color = C.ink3, style }) {
  return (
    <span style={{
      fontFamily:'var(--mono)', fontSize:11.5, fontWeight:500, letterSpacing:'0.22em',
      textTransform:'uppercase', color, ...style,
    }}>{children}</span>
  );
}

function StepNum({ n, total = 4, color = C.ink3 }) {
  const pad = (x) => String(x).padStart(2, '0');
  return (
    <span style={{ fontFamily:'var(--mono)', fontSize:12, letterSpacing:'0.1em', color }}>
      {pad(n)}<span style={{ color:C.ink3, opacity:0.55, padding:'0 4px' }}>/</span>{pad(total)}
    </span>
  );
}

function Display({ children, size, weight = 500, color = C.ink, italic, style, as = 'h1' }) {
  const Tag = as;
  return (
    <Tag style={{
      margin:0, fontFamily:'var(--display)', fontWeight:weight,
      fontSize: size || 'clamp(34px, 5.4vw, 48px)',
      lineHeight:1.1, letterSpacing:'-0.022em',
      fontStyle: italic ? 'italic' : 'normal',
      color, textWrap:'balance', fontOpticalSizing:'auto', ...style,
    }}>{children}</Tag>
  );
}

function Row({ title, sub, onClick, big, first, last, ariaLabel, dot }) {
  return (
    <button
      onClick={onClick}
      className="row tap focusable"
      aria-label={ariaLabel || title}
      style={{
        width:'100%', textAlign:'left', display:'block',
        borderTop: first ? 'none' : `1px solid ${C.rule}`,
        borderBottom: last ? `1px solid ${C.rule}` : 'none',
        padding: big ? '28px 6px' : '22px 6px',
        minHeight:48,
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:18 }}>
        {dot && <span style={{ width:7, height:7, borderRadius:999, background:dot, flexShrink:0 }} />}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontFamily:'var(--sans)', fontSize: big ? 19 : 17, fontWeight:500,
            color:C.ink, lineHeight:1.45, letterSpacing:'-0.01em', textWrap:'pretty',
          }}>{title}</div>
          {sub && <div style={{ fontSize:14, color:C.ink2, lineHeight:1.5, marginTop:6 }}>{sub}</div>}
        </div>
        <span className="row-arrow" style={{ color:C.ink2, flexShrink:0 }}>
          <Icon name="arrow-right" size={18} stroke={1.5} />
        </span>
      </div>
    </button>
  );
}

function ArabicQuote({ children, lines, size = 'clamp(32px, 6vw, 46px)', lh = 1.92, center, accent }) {
  const content = lines ? lines : (typeof children === 'string' ? [children] : null);
  return (
    <div
      className="naskh"
      style={{
        borderRight: center ? 'none' : `${accent ? 2 : 1}px solid ${accent || C.ruleStrong}`,
        padding: center ? '6px 0' : '4px 28px 4px 0',
        fontSize:size, lineHeight:lh, color:C.ink, fontWeight:400,
        textAlign: center ? 'center' : 'right',
      }}
    >
      {content ? content.map((l,i) => <div key={i}>{l}</div>) : children}
    </div>
  );
}

function TextLink({ children, onClick, href, color = C.accent, arrow, weight = 500, size = 16, disabled }) {
  const common = {
    className:`tap focusable`,
    style:{
      display:'inline-flex', alignItems:'baseline', gap:9, whiteSpace:'nowrap',
      fontFamily:'var(--sans)', fontWeight:weight, fontSize:size,
      color: disabled ? C.ink3 : color, letterSpacing:'-0.01em',
      cursor: disabled ? 'default' : 'pointer',
    },
  };
  const inner = (
    <>
      <span className={disabled ? '' : 'tlink'}>{children}</span>
      {arrow && <Icon name="arrow-right" size={16} stroke={1.7} style={{ alignSelf:'center' }} />}
    </>
  );
  if (href && !disabled) return <a href={href} {...common}>{inner}</a>;
  return <button onClick={disabled ? undefined : onClick} disabled={disabled} {...common}>{inner}</button>;
}

function Toggle({ value, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-pressed={value} aria-label={label}
      className="focusable tap"
      style={{
        width:44, height:26, borderRadius:999, flexShrink:0,
        background: value ? C.accent : C.ruleStrong,
        position:'relative', transition:'background 240ms var(--ease)',
      }}
    >
      <span style={{
        position:'absolute', top:3, left: value ? 21 : 3,
        width:20, height:20, borderRadius:999, background:'var(--surface)',
        boxShadow:'0 1px 2px rgba(0,0,0,0.18)',
        transition:'left 240ms var(--ease)',
      }} />
    </button>
  );
}

Object.assign(window, { C, STATUT, Icon, MetaText, Eyebrow, StepNum, Display, Row, ArabicQuote, TextLink, Toggle });

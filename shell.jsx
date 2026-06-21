// Sahw - shell responsive : sidebar (desktop) / nav basse (mobile),
// en-tête courante « folio », thème, invite A2HS.

const NAV_ITEMS = [
  { id:'sahw',    label:'Sahw' },
  { id:'learn',   label:'Apprendre' },
  { id:'profile', label:'Profil' },
  { id:'about',   label:'À propos' },
];

function useMediaQuery(query) {
  const [m, setM] = React.useState(() => window.matchMedia(query).matches);
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = e => setM(e.matches);
    mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn);
    setM(mq.matches);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', fn) : mq.removeListener(fn); };
  }, [query]);
  return m;
}

function ThemeButton({ theme, onToggle, withLabel }) {
  const dark = theme === 'dark';
  return (
    <button onClick={onToggle} className="tap focusable" aria-label={dark ? 'Passer en clair' : 'Passer en sombre'}
      style={{ display:'inline-flex', alignItems:'center', gap:9, color:C.ink2 }}>
      <Icon name={dark ? 'sun' : 'moon'} size={16} stroke={1.6} />
      {withLabel && <MetaText size={12} color={C.ink2} spacing={0.3}>{dark ? 'Clair' : 'Sombre'}</MetaText>}
    </button>
  );
}

function Wordmark({ size = 30 }) {
  return (
    <div>
      <Display as="div" size={size} weight={500} style={{ letterSpacing:'-0.03em', lineHeight:1 }}>Sahw</Display>
      <div style={{ marginTop:8 }}>
        <span className="ar-ui" style={{ fontSize:13, color:C.ink3, letterSpacing:0 }}>سُجود السَّهو</span>
      </div>
    </div>
  );
}

function SideRail({ active, onChange, theme, onToggleTheme }) {
  return (
    <aside className="siderail">
      <div style={{ cursor:'pointer' }} onClick={() => onChange('sahw')}>
        <Wordmark />
      </div>

      <nav aria-label="Navigation principale" style={{ marginTop:64, display:'flex', flexDirection:'column', gap:4 }}>
        {NAV_ITEMS.map(it => {
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => onChange(it.id)}
              className="nav-link tap focusable"
              aria-current={on ? 'page' : undefined}
              style={{
                position:'relative', textAlign:'left', padding:'10px 0 10px 18px',
                fontFamily:'var(--sans)', fontSize:18, fontWeight: on ? 600 : 400,
                letterSpacing:'-0.01em', color: on ? C.ink : C.ink3,
              }}>
              <span style={{
                position:'absolute', left:0, top:'50%', transform:'translateY(-50%)',
                width:2, height: on ? 20 : 0, background:C.accent,
                transition:'height 220ms var(--ease)',
              }} />
              {it.label}
            </button>
          );
        })}
      </nav>

      <div style={{ flex:1 }} />

      <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
        <ThemeButton theme={theme} onToggle={onToggleTheme} withLabel />
        <div style={{ borderTop:`1px solid ${C.rule}`, paddingTop:18 }}>
          <p style={{ margin:0, fontFamily:'var(--mono)', fontSize:11, lineHeight:1.7, color:C.ink3, letterSpacing:'0.02em' }}>
            Mukhtasar al-Akhdari<br/>charh Al-Misk al-Adhfari<br/>Madhhab mâlikî
          </p>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ theme, onToggleTheme, onHome }) {
  return (
    <header style={{
      position:'sticky', top:0, zIndex:30, background:C.bg,
      borderBottom:`1px solid ${C.rule}`,
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'15px var(--pad-x)' }}>
        <button onClick={onHome} className="tap focusable" aria-label="Accueil"
          style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
          <Eyebrow color={C.ink}>Sahw</Eyebrow>
          <span className="ar-ui" style={{ fontSize:12, color:C.ink3 }}>سُجود السَّهو</span>
        </button>
        <ThemeButton theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}

function BottomNav({ active, onChange }) {
  return (
    <nav aria-label="Navigation principale" style={{
      position:'sticky', bottom:0, left:0, right:0, zIndex:30,
      background:C.bg, borderTop:`1px solid ${C.rule}`,
      paddingBottom:'env(safe-area-inset-bottom, 8px)',
    }}>
      <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center', padding:'12px var(--pad-x) 12px' }}>
        {NAV_ITEMS.map(it => {
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => onChange(it.id)} className="nav-link tap focusable"
              aria-current={on ? 'page' : undefined}
              style={{ position:'relative', fontFamily:'var(--sans)', fontSize:13.5,
                fontWeight: on ? 600 : 500, letterSpacing:'-0.01em',
                color: on ? C.ink : C.ink3, padding:'4px 2px' }}>
              {it.label}
              <span style={{ position:'absolute', left:0, right:0, bottom:-5, height:2,
                background: on ? C.accent : 'transparent', transition:'background 200ms var(--ease)' }} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function FolioHeader({ eyebrow, step, total = 4, onBack }) {
  if (!eyebrow && !step && !onBack) return null;
  const hasRight = !!step;
  return (
    <div style={{ marginBottom:44 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        paddingBottom:16, borderBottom:`1px solid ${C.rule}`, minHeight:30, gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, minWidth:0 }}>
          {onBack && (
            <button onClick={onBack} className="tap focusable" aria-label="Retour"
              style={{ display:'inline-flex', alignItems:'center', gap:7, color:C.ink2, flexShrink:0 }}>
              <Icon name="arrow-left" size={15} stroke={1.7} />
              <MetaText size={11.5} color={C.ink2} spacing={0.4} style={{ textTransform:'uppercase' }}>Retour</MetaText>
            </button>
          )}
          {eyebrow && !onBack && <Eyebrow>{eyebrow}</Eyebrow>}
          {eyebrow && onBack && (
            <span className="only-desktop"><Eyebrow>{eyebrow}</Eyebrow></span>
          )}
        </div>
        {hasRight && <StepNum n={step} total={total} />}
      </div>
    </div>
  );
}

function Page({ eyebrow, step, total, onBack, fadeKey, children }) {
  return (
    <div className="page screen-fade" key={fadeKey}>
      <FolioHeader eyebrow={eyebrow} step={step} total={total} onBack={onBack} />
      {children}
    </div>
  );
}

function A2HSInvite() {
  const KEY = 'sahw-a2hs-dismissed';
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    let standalone = false;
    try { standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone; } catch(e){}
    let dismissed = false;
    try { dismissed = localStorage.getItem(KEY) === '1'; } catch(e){}
    if (!standalone && !dismissed) {
      const t = setTimeout(() => setShow(true), 1400);
      return () => clearTimeout(t);
    }
  }, []);
  if (!show) return null;
  function dismiss() { try { localStorage.setItem(KEY,'1'); } catch(e){} setShow(false); }
  return (
    <div className="a2hs only-mobile expand" role="note">
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:500, color:C.ink, letterSpacing:'-0.01em' }}>Installer Sahw</div>
        <div style={{ fontSize:12.5, color:C.ink2, lineHeight:1.5, marginTop:3 }}>
          Partager &rarr; « Sur l'écran d'accueil », pour l'avoir hors-ligne.
        </div>
      </div>
      <button onClick={dismiss} className="tap focusable" aria-label="Fermer"
        style={{ flexShrink:0, color:C.ink3, padding:6 }}>
        <Icon name="x" size={16} stroke={1.7} />
      </button>
    </div>
  );
}

Object.assign(window, {
  NAV_ITEMS, useMediaQuery, ThemeButton, Wordmark, SideRail, TopBar, BottomNav, FolioHeader, Page, A2HSInvite,
});

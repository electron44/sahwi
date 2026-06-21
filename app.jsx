// Sahw - application : state machine, shell responsive, thème, tweaks.

const ACCENTS = {
  foret:  ['#1F4842', '#4A8B7E'],
  encre:  ['#34322C', '#8C887B'],
  indigo: ['#26356A', '#7C92D6'],
  terre:  ['#5A3A2E', '#C0917A'],
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "anim": "cascade",
  "display": "newsreader",
  "accent": ["#1F4842", "#4A8B7E"]
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const isDesktop = useMediaQuery('(min-width: 940px)');

  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = t.theme === 'dark' ? 'dark' : 'light';
    root.dataset.anim = t.anim === 'reduit' ? 'reduit' : 'cascade';
    root.style.setProperty('--display', t.display === 'fraunces'
      ? "'Fraunces', Georgia, serif" : "'Newsreader', Georgia, 'Times New Roman', serif");
    const acc = Array.isArray(t.accent) ? t.accent : ACCENTS.foret;
    root.style.setProperty('--accent', t.theme === 'dark' ? acc[1] : acc[0]);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t.theme === 'dark' ? '#141414' : '#FAF8F5');
  }, [t.theme, t.anim, t.display, t.accent]);

  const toggleTheme = () => setTweak('theme', t.theme === 'dark' ? 'light' : 'dark');

  const [tab, setTab] = React.useState('sahw');
  const [stacks, setStacks] = React.useState({
    sahw:[{screen:'home'}], learn:[{screen:'learn'}], profile:[{screen:'profile'}], about:[{screen:'about'}],
  });
  const [mawsus, setMawsus] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  const stack = stacks[tab];
  const current = stack[stack.length - 1];

  const push = (node) => setStacks(p => ({ ...p, [tab]: [...p[tab], node] }));
  const pop = () => setStacks(p => {
    const s = p[tab];
    return s.length <= 1 ? p : { ...p, [tab]: s.slice(0, -1) };
  });
  function go(node) {
    if (node.reset) {
      const base = node.screen === 'category' ? [{screen:'home'},{screen:'category'}] : [{screen:'home'}];
      setStacks(p => ({ ...p, sahw: base })); setTab('sahw'); return;
    }
    if (node.tab && node.tab !== tab) {
      const { tab:tt, ...rest } = node;
      setTab(tt);
      if (rest.screen && rest.screen !== stacks[tt][0].screen) {
        setStacks(p => ({ ...p, [tt]: [...p[tt], rest] }));
      }
      return;
    }
    push(node);
  }

  React.useEffect(() => {
    if (current.screen === 'rule' && current.scenario) {
      setHistory(prev => {
        const key = `${current.scenario}__${current.branch||''}`;
        if (prev.some(h => `${h.scenario}__${h.branch||''}` === key)) return prev;
        return [{ scenario: current.scenario, branch: current.branch }, ...prev].slice(0, 8);
      });
    }
  }, [current]);

  function openHistory(h) {
    setStacks(p => ({ ...p, sahw: [{screen:'home'}, { screen:'rule', scenario:h.scenario, branch:h.branch }] }));
    setTab('sahw');
  }

  React.useEffect(() => { if (window.lucide) { try { window.lucide.createIcons(); } catch(e){} } });

  let content = null;
  if (tab === 'sahw') {
    switch (current.screen) {
      case 'home':      content = <HomeScreen go={go} mawsus={mawsus} />; break;
      case 'category':  content = <CategoryScreen go={go} back={pop} />; break;
      case 'precision': content = <PrecisionScreen categorie={current.categorie} go={go} back={pop} mawsus={mawsus} />; break;
      case 'notfound':  content = <NotFoundScreen back={pop} />; break;
      case 'branches':  content = <BranchesScreen scenario={current.scenario} go={go} back={pop} />; break;
      case 'rule':      content = <RuleScreen scenario={current.scenario} branch={current.branch} back={pop} go={go} />; break;
      default:          content = <HomeScreen go={go} mawsus={mawsus} />;
    }
  } else if (tab === 'learn') {
    switch (current.screen) {
      case 'sunan': content = <SunanScreen back={pop} />; break;
      case 'matn':  content = <MatnScreen back={pop} />; break;
      default:      content = <LearnScreen go={go} />;
    }
  } else if (tab === 'profile') {
    content = <ProfileScreen mawsus={mawsus} setMawsus={setMawsus} history={history}
      clearHistory={() => setHistory([])} openHistory={openHistory} go={go}
      theme={t.theme} onToggleTheme={toggleTheme} />;
  } else if (tab === 'about') {
    content = <AboutScreen />;
  }

  const tweaks = (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Apparence" />
      <TweakRadio label="Thème" value={t.theme}
        options={[{value:'light',label:'Clair'},{value:'dark',label:'Sombre'}]}
        onChange={v => setTweak('theme', v)} />
      <TweakColor label="Accent" value={t.accent}
        options={[ACCENTS.foret, ACCENTS.encre, ACCENTS.indigo, ACCENTS.terre]}
        onChange={v => setTweak('accent', v)} />
      <TweakSection label="Typographie" />
      <TweakRadio label="Display" value={t.display}
        options={[{value:'newsreader',label:'Newsreader'},{value:'fraunces',label:'Fraunces'}]}
        onChange={v => setTweak('display', v)} />
      <TweakSection label="Mouvement" />
      <TweakRadio label="Animations" value={t.anim}
        options={[{value:'cascade',label:'Cascade'},{value:'reduit',label:'Réduit'}]}
        onChange={v => setTweak('anim', v)} />
    </TweaksPanel>
  );

  if (isDesktop) {
    return (
      <div className="shell shell--desktop">
        <SideRail active={tab} onChange={setTab} theme={t.theme} onToggleTheme={toggleTheme} />
        <main className="main-col">
          <div className="reading">{content}</div>
        </main>
        {tweaks}
      </div>
    );
  }
  return (
    <div className="shell shell--mobile">
      <TopBar theme={t.theme} onToggleTheme={toggleTheme} onHome={() => setTab('sahw')} />
      <main className="reading-m" style={{ flex:1 }}>{content}</main>
      <A2HSInvite />
      <BottomNav active={tab} onChange={setTab} />
      {tweaks}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

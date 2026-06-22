// Sahw - écrans (direction « Folio »)

// ── 1. ACCUEIL ────────────────────────────────────────────────────
function HomeScreen({ go, mawsus }) {
  return (
    <Page fadeKey="home">
      <div className="rise" style={{ animationDelay:'0ms' }}>
        <Display size="clamp(40px, 6.4vw, 62px)" weight={500} style={{ lineHeight:1.05 }}>
          Que s'est-il passé<br/>dans votre prière&nbsp;?
        </Display>
        <p style={{ margin:'24px 0 0', fontSize:17, lineHeight:1.6, color:C.ink2, maxWidth:'32ch' }}>
          Trouvez la règle du sujūd as-sahw pour votre cas, sourcée et citée.
        </p>
      </div>

      <div className="rise" style={{ animationDelay:'90ms', marginTop:56, marginBottom:64 }}>
        <TextLink onClick={() => go({ screen:'category' })} arrow size={22} weight={500}>
          Commencer
        </TextLink>
      </div>

      <div className="rise" style={{ animationDelay:'180ms' }}>
        <div style={{ marginBottom:18 }}><Eyebrow>Ou consulter</Eyebrow></div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:18 }}>
          <TextLink onClick={() => go({ tab:'learn', screen:'sunan' })} color={C.ink} weight={500} size={16}>
            Les huit sunna mu'akkada
          </TextLink>
          <TextLink onClick={() => go({ tab:'learn', screen:'matn' })} color={C.ink} weight={500} size={16}>
            Le texte sur le sahw
          </TextLink>
          <TextLink onClick={() => go({ tab:'profile', screen:'profile' })} color={C.ink} weight={500} size={16}>
            Mode mawsūs{mawsus ? ' · actif' : ''}
          </TextLink>
        </div>
      </div>

      <div className="only-mobile" style={{ marginTop:64, paddingTop:22, borderTop:`1px solid ${C.rule}` }}>
        <p style={{ margin:0, fontFamily:'var(--mono)', fontSize:11.5, lineHeight:1.8, color:C.ink3 }}>
          Mukhtasar al-Akhdari · Madhhab mâlikî<br/>Validé par Sh. Mouhammad N'Diaye
        </p>
      </div>
    </Page>
  );
}

// ── 2. NATURE DE L'ÉVÉNEMENT ──────────────────────────────────────
function CategoryScreen({ go, back }) {
  return (
    <Page step={1} onBack={back} eyebrow="Le parcours" fadeKey="cat">
      <div style={{ marginBottom:48 }}>
        <Display>Que s'est-il passé&nbsp;?</Display>
      </div>
      <div>
        {CATEGORIES.map((c, i) => (
          <Row key={c.id} title={c.label} sub={c.sous_titre} big
            first={i === 0} last={i === CATEGORIES.length - 1}
            onClick={() => go({ screen:'precision', categorie:c.id })} />
        ))}
      </div>
    </Page>
  );
}

// ── 3. PRÉCISION ──────────────────────────────────────────────────
function PrecisionScreen({ categorie, go, back, mawsus }) {
  const [q, setQ] = React.useState('');
  const list = SCENARIOS.filter(s => s.categorie === categorie);
  const filtered = q.trim() ? list.filter(s => s.phrase.toLowerCase().includes(q.toLowerCase())) : list;

  return (
    <Page step={2} onBack={back} eyebrow="Le parcours" fadeKey={'prec-'+categorie}>
      <div style={{ marginBottom:28 }}>
        <Display>Précisez.</Display>
      </div>

      <div style={{ borderBottom:`1px solid ${C.rule}`, marginBottom:8, display:'flex', alignItems:'center', gap:10, paddingBottom:11 }}>
        <Icon name="search" size={15} stroke={1.6} color={C.ink3} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filtrer…"
          aria-label="Filtrer les cas" className="focusable"
          style={{ flex:1, fontSize:15.5, color:C.ink, padding:'2px 0' }} />
        {q && <button onClick={() => setQ('')} className="tap" aria-label="Effacer"><Icon name="x" size={14} color={C.ink3} /></button>}
      </div>

      {mawsus && categorie === 'shakk' && (
        <div className="rise" style={{ borderLeft:`2px solid ${C.accent}`, paddingLeft:18, margin:'22px 0 6px' }}>
          <p style={{ margin:0, fontSize:14, lineHeight:1.65, color:C.ink2 }}>
            Vous avez activé le mode mawsūs. Le texte recommande de bâtir sur votre première
            impression et de ne pas suivre le doute. Vous pouvez continuer pour consulter la règle ordinaire.
          </p>
        </div>
      )}

      <div>
        {filtered.map((s, i) => (
          <Row key={s.id} title={s.phrase} first={i === 0}
            sub={s.branches ? 'Selon votre situation' : undefined}
            onClick={() => go({ screen: s.branches ? 'branches' : 'rule', scenario:s.id })} />
        ))}
        {filtered.length === 0 && (
          <div style={{ borderTop:`1px solid ${C.rule}`, padding:'26px 6px', fontSize:14.5, color:C.ink2 }}>
            Aucun cas ne correspond à «&nbsp;{q}&nbsp;».
          </div>
        )}
        <Row title="Je ne trouve pas mon cas." last onClick={() => go({ screen:'notfound' })} />
      </div>
    </Page>
  );
}

// ── 3b. CAS NON TROUVÉ ────────────────────────────────────────────
function NotFoundScreen({ back }) {
  return (
    <Page onBack={back} eyebrow="Le parcours" fadeKey="nf">
      <div style={{ marginTop:8 }}>
        <Display size="clamp(28px, 4.4vw, 38px)">Un cas particulier.</Display>
        <p style={{ margin:'26px 0 0', fontSize:17, lineHeight:1.7, color:C.ink2, maxWidth:'42ch', textWrap:'pretty' }}>
          Cette application couvre les cas traités par le sharh du Mukhtasar al-Akhdari.
          Un cas qui n'y figure pas appelle l'avis d'un savant, qui prendra en compte
          ce que la liste ne peut anticiper.
        </p>
        <div style={{ marginTop:40 }}>
          <TextLink onClick={() => {}} color={C.accent} arrow>Contacter un relecteur</TextLink>
        </div>
        <p style={{ marginTop:52, fontSize:13, lineHeight:1.6, color:C.ink3 }}>
          Sahw est un outil de référence. Il ne se substitue pas à un savant.
        </p>
      </div>
    </Page>
  );
}

// ── 4b. BRANCHES (conditions) ─────────────────────────────────────
function BranchesScreen({ scenario, go, back }) {
  const s = SCENARIOS.find(x => x.id === scenario);
  const [picked, setPicked] = React.useState(null);
  if (!s) return null;

  return (
    <Page step={3} onBack={back} eyebrow="Le parcours" fadeKey={'br-'+scenario}>
      <div style={{ marginBottom:14 }}>
        <Display size="clamp(28px, 4.4vw, 38px)">Dans quelle situation&nbsp;?</Display>
      </div>
      <p style={{ margin:'0 0 32px', fontSize:16, color:C.ink2, lineHeight:1.6, fontFamily:'var(--display)', fontStyle:'italic' }}>
        «&nbsp;{s.phrase}&nbsp;»
      </p>

      <div role="radiogroup" aria-label="Conditions">
        {s.branches.map((b, i) => {
          const on = picked === b.id;
          return (
            <button key={b.id} role="radio" aria-checked={on} onClick={() => setPicked(b.id)}
              className="tap focusable"
              style={{ width:'100%', textAlign:'left', display:'flex', gap:16, alignItems:'flex-start',
                borderTop:`1px solid ${C.rule}`,
                borderBottom: i === s.branches.length - 1 ? `1px solid ${C.rule}` : 'none',
                padding:'22px 6px', minHeight:48,
                background: on ? C.hover : 'transparent', transition:'background 280ms var(--ease)' }}>
              <span style={{ marginTop:3, width:15, height:15, borderRadius:999, flexShrink:0,
                border:`1.5px solid ${on ? C.accent : C.ruleStrong}`, background: on ? C.accent : 'transparent',
                boxShadow: on ? `inset 0 0 0 3px var(--surface)` : 'none', transition:'all 200ms var(--ease)' }} />
              <span style={{ fontSize:16.5, lineHeight:1.55, color:C.ink, textWrap:'pretty' }}>{b.condition}</span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop:40 }}>
        <TextLink onClick={() => picked && go({ screen:'rule', scenario, branch:picked })}
          arrow size={18} disabled={!picked}>Voir la règle</TextLink>
      </div>
    </Page>
  );
}

// ── 4. LA RÈGLE - écran signature ─────────────────────────────────
function RuleScreen({ scenario, branch, back, go }) {
  const s = SCENARIOS.find(x => x.id === scenario);
  const [showDiv, setShowDiv] = React.useState(false);
  if (!s) return null;
  const br = branch && s.branches ? s.branches.find(b => b.id === branch) : null;
  const vcode = br ? br.verdict : s.verdict;
  const v = VERDICTS[vcode];
  const couleur = STATUT[v.couleur];
  const corps = br ? br.corps : s.corps;

  let step = 0;
  const delay = () => ({ animationDelay: `${(step++) * 95}ms` });

  return (
    <Page step={4} onBack={back} eyebrow="La règle" fadeKey={'rule-'+scenario+(branch||'')}>
      {/* phrase utilisateur */}
      <p className="rise" style={{ ...delay(), margin:0, fontSize:17, lineHeight:1.6, color:C.ink2,
        fontFamily:'var(--display)', fontStyle:'italic' }}>
        «&nbsp;{s.phrase}&nbsp;»
        {br && <span style={{ display:'block', marginTop:8, fontStyle:'normal', fontFamily:'var(--sans)', fontSize:14, color:C.ink3 }}>{br.condition}</span>}
      </p>

      {/* verdict */}
      <div className="rise" style={{ ...delay(), marginTop:56, display:'flex', gap:16, alignItems:'flex-start' }}>
        <span aria-hidden="true" style={{ marginTop:'0.5em', width:10, height:10, borderRadius:999, background:couleur, flexShrink:0 }} />
        <Display size="clamp(32px, 5vw, 46px)" weight={500} style={{ lineHeight:1.12 }}>
          {v.titre}<br/>{v.sous}
        </Display>
      </div>

      {corps && (
        <p className="rise" style={{ ...delay(), margin:'24px 0 0', paddingLeft:26, fontSize:17, lineHeight:1.65, color:C.ink, maxWidth:'42ch', textWrap:'pretty' }}>
          {corps}
        </p>
      )}

      {/* pourquoi */}
      {s.pourquoi && (
        <div className="rise" style={{ ...delay(), marginTop:52 }}>
          <div style={{ marginBottom:12 }}><Eyebrow>Pourquoi</Eyebrow></div>
          <p style={{ margin:0, fontSize:17, lineHeight:1.7, color:C.ink2, textWrap:'pretty' }}>{s.pourquoi}</p>
        </div>
      )}

      {/* citation arabe */}
      {s.source && s.source.extrait_ar && (
        <div className="rise" style={{ ...delay(), marginTop:60 }}>
          <ArabicQuote accent={couleur}>{s.source.extrait_ar}</ArabicQuote>
          <div style={{ marginTop:22 }}>
            <MetaText size={12} color={C.ink2} spacing={0.3}>
              {s.source.ouvrage}{s.source.sharh ? ` · charh ${s.source.sharh}` : ''}{s.source.page ? ` · p. ${s.source.page}` : ''}
            </MetaText>
          </div>
          {s.hadith && (
            <p style={{ margin:'14px 0 0', fontSize:13, lineHeight:1.6, color:C.ink3 }}>Hadith de référence&nbsp;: {s.hadith}</p>
          )}
        </div>
      )}

      {s.source && !s.source.extrait_ar && (
        <div className="rise" style={{ ...delay(), marginTop:44 }}>
          <MetaText size={12} color={C.ink2} spacing={0.3}>
            {s.source.ouvrage}{s.source.page ? ` · p. ${s.source.page}` : ''}
          </MetaText>
        </div>
      )}

      {/* divergence */}
      {s.divergence && (
        <div className="rise" style={{ ...delay(), marginTop:40 }}>
          <button onClick={() => setShowDiv(o => !o)} className="tap focusable"
            style={{ display:'inline-flex', alignItems:'center', gap:9, color:C.ink2 }}>
            <Eyebrow color={C.ink2}>Divergence</Eyebrow>
            <Icon name={showDiv ? 'minus' : 'plus'} size={13} color={C.ink3} />
          </button>
          {showDiv && (
            <p className="expand" style={{ margin:'14px 0 0', fontSize:14.5, lineHeight:1.7, color:C.ink2, textWrap:'pretty' }}>
              {s.divergence}
            </p>
          )}
        </div>
      )}

      {/* actions */}
      <div className="rise" style={{ ...delay(), marginTop:60, display:'flex', alignItems:'center', gap:22 }}>
        <TextLink onClick={() => go({ screen:'home', tab:'sahw', reset:true })} color={C.ink} weight={500}>Compris</TextLink>
        <span style={{ width:1, height:18, background:C.rule }} />
        <TextLink onClick={() => go({ screen:'category', tab:'sahw', reset:true })} color={C.ink2} weight={500}>Une autre question</TextLink>
      </div>

      <p style={{ marginTop:44, fontSize:13, lineHeight:1.6, color:C.ink3 }}>
        Pour un cas particulier, consultez un savant.
      </p>
    </Page>
  );
}

// ── APPRENDRE : HUB ───────────────────────────────────────────────
function LearnScreen({ go }) {
  return (
    <Page eyebrow="Apprendre" fadeKey="learn">
      <div style={{ marginBottom:24 }}>
        <Display>À votre rythme.</Display>
      </div>
      <div>
        <Row title="Les huit sunna mu'akkada" sub="Le vers mnémotechnique, et chaque sunna." big first onClick={() => go({ screen:'sunan' })} />
        <Row title="Le texte sur le sahw" sub="Le matn d'al-Akhdari, traduit." big last onClick={() => go({ screen:'matn' })} />
      </div>
    </Page>
  );
}

// ── APPRENDRE : SUNAN ─────────────────────────────────────────────
function SunanScreen({ back }) {
  const [open, setOpen] = React.useState(null);
  return (
    <Page onBack={back} eyebrow="Apprendre" fadeKey="sunan">
      <div style={{ marginBottom:8 }}>
        <Display size="clamp(26px, 4vw, 34px)">Les huit sunna mu'akkada</Display>
      </div>

      <div style={{ margin:'40px 0 16px' }}>
        <ArabicQuote center size="clamp(28px, 5vw, 38px)" lh={2} lines={[
          'سِينَانِ شِينَانِ كَذَا جِيمَانِ',
          'تَاءَانِ عَدَدُ السُّنَنِ الثَّمَانِ',
        ]} />
        <p style={{ margin:'20px auto 0', fontSize:14, lineHeight:1.6, color:C.ink2, textAlign:'center', maxWidth:'36ch' }}>
          Deux sīn, deux shīn, deux jīm de même, deux tā' : c'est le compte des huit sunna.
        </p>
      </div>

      <p style={{ margin:'30px 0 8px', fontSize:14, lineHeight:1.6, color:C.ink3 }}>
        L'omission de l'une d'elles se répare par sujūd qabli.
      </p>

      <div>
        {SUNAN.map((s, i) => {
          const on = open === i;
          return (
            <div key={i} style={{ borderTop:`1px solid ${C.rule}`, borderBottom: i === SUNAN.length-1 ? `1px solid ${C.rule}` : 'none' }}>
              <button onClick={() => setOpen(on ? null : i)} className="tap focusable" aria-expanded={on}
                style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:20, padding:'18px 6px', minHeight:48 }}>
                <span className="naskh" style={{ fontSize:46, lineHeight:1, color:C.accent, width:48, textAlign:'center', flexShrink:0 }}>{s.lettre}</span>
                <span style={{ flex:1, minWidth:0 }}>
                  <span className="ar-ui" style={{ display:'block', fontSize:18, color:C.ink, lineHeight:1.3 }}>{s.nom_ar}</span>
                  <span style={{ display:'block', fontSize:14, color:C.ink2, marginTop:4 }}>{s.nom_fr}</span>
                </span>
                <Icon name={on ? 'minus' : 'plus'} size={16} color={C.ink3} />
              </button>
              {on && (
                <div className="expand" style={{ padding:'0 6px 22px 74px' }}>
                  <p style={{ margin:0, fontSize:15.5, lineHeight:1.65, color:C.ink }}>{s.def}</p>
                  {s.exemple && <p style={{ margin:'8px 0 0', fontSize:13, lineHeight:1.55, color:C.ink3 }}>{s.exemple}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Page>
  );
}

// ── APPRENDRE : MATN ──────────────────────────────────────────────
function MatnScreen({ back }) {
  return (
    <Page onBack={back} eyebrow="Apprendre" fadeKey="matn">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
        <Display size="clamp(26px, 4vw, 34px)">Le matn</Display>
        <MetaText size={12} color={C.ink3}>{MATN.page} / {MATN.total}</MetaText>
      </div>
      <p style={{ margin:'0 0 40px', fontSize:13, color:C.ink3, lineHeight:1.6 }}>
        Section sur le sahw - Mukhtasar al-Akhdari.
      </p>

      <div className="naskh" style={{ fontSize:'clamp(24px, 3.6vw, 30px)', lineHeight:1.95, color:C.ink, textAlign:'right' }}>
        {MATN.ar.map((l,i) => <div key={i} style={{ marginBottom:6 }}>{l}</div>)}
      </div>

      <div style={{ marginTop:44, paddingTop:30, borderTop:`1px solid ${C.rule}` }}>
        <div style={{ marginBottom:14 }}><Eyebrow>Traduction</Eyebrow></div>
        {MATN.fr.map((l,i) => (
          <p key={i} style={{ margin:'0 0 6px', fontSize:16.5, lineHeight:1.7, color:C.ink2 }}>{l}</p>
        ))}
      </div>

      <div style={{ marginTop:38 }}>
        <TextLink color={C.ink3} disabled>Lecture audio - bientôt</TextLink>
      </div>
    </Page>
  );
}

// ── PROFIL ────────────────────────────────────────────────────────
function ProfileScreen({ mawsus, setMawsus, history, clearHistory, openHistory, go, theme, onToggleTheme }) {
  return (
    <Page eyebrow="Profil" fadeKey="profile">
      <div style={{ marginBottom:36 }}>
        <Display>Réglages.</Display>
      </div>

      {/* thème */}
      <div style={{ borderTop:`1px solid ${C.rule}`, padding:'24px 6px', display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:17, fontWeight:500, color:C.ink }}>Apparence</div>
          <p style={{ margin:'8px 0 0', fontSize:14, lineHeight:1.6, color:C.ink2 }}>
            Thème {theme === 'dark' ? 'sombre' : 'clair'}. Palette miroir pour la lecture de nuit.
          </p>
        </div>
        <Toggle value={theme === 'dark'} onChange={onToggleTheme} label="Mode sombre" />
      </div>

      {/* mawsus */}
      <div style={{ borderTop:`1px solid ${C.rule}`, padding:'24px 6px', display:'flex', alignItems:'flex-start', gap:16 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:17, fontWeight:500, color:C.ink }}>Mode mawsūs</div>
          <p style={{ margin:'8px 0 0', fontSize:14, lineHeight:1.6, color:C.ink2 }}>
            Pour les personnes souffrant de doute chronique. L'app rappelle alors de bâtir sur
            la première impression et de ne pas suivre le doute.
          </p>
        </div>
        <Toggle value={mawsus} onChange={setMawsus} label="Mode mawsūs" />
      </div>

      {/* historique */}
      <div style={{ borderTop:`1px solid ${C.rule}`, padding:'24px 6px' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: history.length ? 16 : 8 }}>
          <div style={{ fontSize:17, fontWeight:500, color:C.ink }}>Consultations récentes</div>
          {history.length > 0 && <TextLink onClick={clearHistory} color={C.ink3} size={13} weight={500}>Effacer</TextLink>}
        </div>
        {history.length === 0 ? (
          <p style={{ margin:0, fontSize:14, lineHeight:1.6, color:C.ink3 }}>Vos consultations apparaîtront ici.</p>
        ) : (
          <div>
            {history.map((h, i) => {
              const s = SCENARIOS.find(x => x.id === h.scenario);
              if (!s) return null;
              const br = h.branch ? s.branches?.find(b => b.id === h.branch) : null;
              const v = VERDICTS[br ? br.verdict : s.verdict];
              return (
                <button key={i} onClick={() => openHistory(h)} className="tap focusable"
                  style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:14,
                    borderTop: i === 0 ? 'none' : `1px solid ${C.rule}`, padding:'15px 0' }}>
                  <span style={{ width:7, height:7, borderRadius:999, background:STATUT[v.couleur], flexShrink:0 }} />
                  <span style={{ flex:1, minWidth:0, fontSize:14.5, color:C.ink, lineHeight:1.45, textWrap:'pretty' }}>{s.phrase}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* langue */}
      <div style={{ borderTop:`1px solid ${C.rule}`, padding:'24px 6px' }}>
        <div style={{ fontSize:17, fontWeight:500, color:C.ink, marginBottom:14 }}>Langue d'interface</div>
        <div style={{ display:'flex', gap:26, alignItems:'baseline' }}>
          <span style={{ fontSize:15, fontWeight:600, color:C.ink, position:'relative' }}>
            Français
            <span style={{ position:'absolute', left:0, right:0, bottom:-5, height:2, background:C.accent }} />
          </span>
          <span className="ar-ui" style={{ fontSize:15, color:C.ink3 }}>العربية <span style={{ fontFamily:'var(--sans)', fontSize:12 }}>(à venir)</span></span>
        </div>
      </div>

      <div>
        <Row title="À propos de Sahw" last onClick={() => go({ tab:'about', screen:'about' })} />
      </div>
    </Page>
  );
}

// ── À PROPOS ──────────────────────────────────────────────────────
function AboutScreen() {
  const rows = [
    ['Source', 'Mukhtasar al-Akhdari'],
    ['Commentaire', 'Al-Misk al-Adhfari'],
    ['Madhhab', 'Mâlikî'],
    ['Relecture savante', "Un serviteur"],
    ['Version du contenu', 'v1.0.0, 28 mai 2026'],
    ['Langue', 'Français · arabe à venir'],
    ['Licence', 'CC BY-NC-SA 4.0'],
  ];
  return (
    <Page eyebrow="À propos" fadeKey="about">
      <div style={{ marginBottom:26 }}>
        <Display>Sahw.</Display>
      </div>
      <p style={{ margin:'0 0 40px', fontSize:17, lineHeight:1.7, color:C.ink2, maxWidth:'46ch', textWrap:'pretty' }}>
        Un outil de référence pour trouver la règle à appliquer lorsqu'une erreur survient
        pendant la prière, selon le madhhab malikite. Il rend accessible un texte précis,
        sans s'y substituer.
      </p>

      <div>
        {rows.map(([k, v], i) => (
          <div key={i} style={{ borderTop:`1px solid ${C.rule}`, borderBottom: i === rows.length-1 ? `1px solid ${C.rule}` : 'none', padding:'15px 6px', display:'flex', gap:18 }}>
            <span style={{ width:'40%', flexShrink:0 }}><Eyebrow>{k}</Eyebrow></span>
            <span style={{ fontSize:15, color:C.ink, lineHeight:1.5 }}>{v}</span>
          </div>
        ))}
      </div>

      <p style={{ margin:'40px 0 8px', fontSize:14, lineHeight:1.7, color:C.ink2 }}>
        Sahw ne se substitue pas à un savant. Pour un cas particulier, consultez un imam
        ou un savant qualifié.
      </p>
    </Page>
  );
}

Object.assign(window, {
  HomeScreen, CategoryScreen, PrecisionScreen, NotFoundScreen,
  BranchesScreen, RuleScreen, LearnScreen, SunanScreen, MatnScreen,
  ProfileScreen, AboutScreen,
});

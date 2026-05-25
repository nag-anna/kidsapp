import { useState, useEffect, useCallback } from "react";

const COLORS = ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF922B","#CC5DE8","#20C997","#F06595"];
const SHAPES = ["⭐","🌈","🦄","🐸","🦁","🐬","🦋","🌸","🍭","🎈","🌟","🐙"];
const ANIMALS = [
  { emoji:"🐶", name:"Dog", sound:"Woof!" },
  { emoji:"🐱", name:"Cat", sound:"Meow!" },
  { emoji:"🐮", name:"Cow", sound:"Moo!" },
  { emoji:"🐷", name:"Pig", sound:"Oink!" },
  { emoji:"🦆", name:"Duck", sound:"Quack!" },
  { emoji:"🐸", name:"Frog", sound:"Ribbit!" },
];
const MATH_LEVELS = [
  { op:"+", max:5 },
  { op:"+", max:10 },
  { op:"-", max:10 },
];

function Confetti({ active }) {
  const [pieces] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.6,
      color: COLORS[i % COLORS.length],
      size: 8 + Math.random() * 8,
    }))
  );
  if (!active) return null;
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:999, overflow:"hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:"-20px",
          width:p.size, height:p.size,
          background:p.color, borderRadius:"50%",
          animation:`fall 1.4s ${p.delay}s ease-in forwards`,
        }}/>
      ))}
      <style>{`@keyframes fall{to{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

function HomeScreen({ setScreen, score }) {
  const [bounce, setBounce] = useState(false);
  useEffect(() => { const t = setInterval(() => setBounce(b => !b), 800); return () => clearInterval(t); }, []);
  const games = [
    { id:"animals", label:"Animal Sounds 🐾", bg:"#FF6B6B", icon:"🦁" },
    { id:"colors",  label:"Color Match 🎨",   bg:"#FFD93D", icon:"🌈" },
    { id:"math",    label:"Math Magic ✨",     bg:"#6BCB77", icon:"🔢" },
    { id:"memory",  label:"Memory Game 🧠",    bg:"#4D96FF", icon:"🃏" },
    { id:"draw",    label:"Doodle Board 🖌️",  bg:"#CC5DE8", icon:"🖌️" },
    { id:"quiz",    label:"Fun Quiz 🌟",       bg:"#FF922B", icon:"❓" },
  ];
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#667eea,#764ba2)", display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem", fontFamily:"'Fredoka One',cursive,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet"/>
      <div style={{ fontSize:bounce?"4.5rem":"4rem", transition:"font-size .3s", marginBottom:".5rem" }}>🌟</div>
      <h1 style={{ color:"#fff", fontSize:"clamp(1.8rem,6vw,3rem)", textShadow:"3px 3px 0 rgba(0,0,0,.2)", margin:0, textAlign:"center" }}>KidZone!</h1>
      <p style={{ color:"rgba(255,255,255,.85)", fontSize:"1.1rem", marginTop:".25rem", marginBottom:"1.5rem" }}>Let's learn & play!</p>
      {score > 0 && (
        <div style={{ background:"rgba(255,255,255,.2)", borderRadius:20, padding:"6px 20px", color:"#fff", fontSize:"1rem", marginBottom:"1rem" }}>
          ⭐ Stars earned: <strong>{score}</strong>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1rem", width:"100%", maxWidth:420 }}>
        {games.map(g => (
          <button key={g.id} onClick={() => setScreen(g.id)} style={{
            background:g.bg, border:"none", borderRadius:20, padding:"1.2rem .5rem",
            cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6,
            boxShadow:"0 6px 0 rgba(0,0,0,.15)", transition:"transform .1s, box-shadow .1s",
            fontFamily:"inherit",
          }}
            onMouseDown={e => { e.currentTarget.style.transform="translateY(4px)"; e.currentTarget.style.boxShadow="0 2px 0 rgba(0,0,0,.15)"; }}
            onMouseUp={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 6px 0 rgba(0,0,0,.15)"; }}
          >
            <span style={{ fontSize:"2.2rem" }}>{g.icon}</span>
            <span style={{ fontSize:".85rem", fontWeight:700, color:"#fff", textShadow:"1px 1px 0 rgba(0,0,0,.2)", textAlign:"center", lineHeight:1.2 }}>{g.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AnimalGame({ setScreen, addScore }) {
  const [current, setCurrent] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const pick = useCallback(() => {
    const a = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setCurrent(a); setFeedback(null);
  }, []);
  useEffect(() => { pick(); }, []);
  const answer = (animal) => {
    if (animal.name === current.name) {
      setFeedback("correct"); addScore(1); setConfetti(true);
      setTimeout(() => { setConfetti(false); pick(); }, 1200);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 700);
    }
  };
  const shuffled = [...ANIMALS].sort(() => Math.random() - .5).slice(0, 4);
  if (!shuffled.find(a => a.name === current?.name)) shuffled[0] = current;
  const opts = shuffled.sort(() => Math.random() - .5);
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#f093fb,#f5576c)", display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem", fontFamily:"'Fredoka One',cursive,sans-serif" }}>
      <Confetti active={confetti}/>
      <BackBtn setScreen={setScreen}/>
      <h2 style={{ color:"#fff", fontSize:"1.8rem", margin:"1rem 0 .5rem", textShadow:"2px 2px 0 rgba(0,0,0,.15)" }}>Animal Sounds 🐾</h2>
      {current && (
        <>
          <div style={{ fontSize:"6rem", margin:"1rem 0", filter:feedback==="wrong"?"hue-rotate(270deg)":"none", transition:"filter .3s", animation:"bobble 1s ease-in-out infinite" }}>
            {current.emoji}
          </div>
          <div style={{ background:"rgba(255,255,255,.25)", borderRadius:16, padding:"10px 24px", color:"#fff", fontSize:"1.3rem", marginBottom:"1.5rem" }}>
            This animal says: <strong>{current.sound}</strong>
          </div>
          <p style={{ color:"#fff", fontSize:"1.1rem", marginBottom:".75rem" }}>Which animal is this? 🤔</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem", width:"100%", maxWidth:360 }}>
            {opts.map(a => (
              <button key={a.name} onClick={() => answer(a)} style={{
                background: feedback==="correct" && a.name===current.name ? "#6BCB77" : "rgba(255,255,255,.9)",
                border:"3px solid transparent",
                borderRadius:16, padding:"12px 8px",
                fontSize:"1rem", fontWeight:700, cursor:"pointer",
                fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                boxShadow:"0 4px 0 rgba(0,0,0,.1)",
              }}>
                <span style={{ fontSize:"2rem" }}>{a.emoji}</span>
                {a.name}
              </button>
            ))}
          </div>
        </>
      )}
      <style>{`@keyframes bobble{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  );
}

function ColorMatch({ setScreen, addScore }) {
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const NAMED = [
    { name:"Red",    hex:"#FF6B6B" }, { name:"Yellow", hex:"#FFD93D" },
    { name:"Green",  hex:"#6BCB77" }, { name:"Blue",   hex:"#4D96FF" },
    { name:"Orange", hex:"#FF922B" }, { name:"Purple", hex:"#CC5DE8" },
    { name:"Pink",   hex:"#F06595" }, { name:"Teal",   hex:"#20C997" },
  ];
  const newRound = useCallback(() => {
    const t = NAMED[Math.floor(Math.random() * NAMED.length)];
    const others = NAMED.filter(c => c.name !== t.name).sort(() => Math.random() - .5).slice(0, 3);
    setTarget(t); setOptions([t, ...others].sort(() => Math.random() - .5)); setFeedback(null);
  }, []);
  useEffect(() => { newRound(); }, []);
  const guess = (c) => {
    if (c.name === target.name) {
      setFeedback("correct"); addScore(1); setConfetti(true);
      setTimeout(() => { setConfetti(false); newRound(); }, 1100);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 700);
    }
  };
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#a8edea,#fed6e3)", display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem", fontFamily:"'Fredoka One',cursive,sans-serif" }}>
      <Confetti active={confetti}/>
      <BackBtn setScreen={setScreen}/>
      <h2 style={{ color:"#444", fontSize:"1.8rem", margin:"1rem 0", textShadow:"1px 1px 0 rgba(0,0,0,.1)" }}>Color Match 🎨</h2>
      {target && (
        <>
          <div style={{ width:140, height:140, borderRadius:"50%", background:target.hex, boxShadow:`0 0 0 12px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.15)`, marginBottom:"1.5rem", animation:"pulse 1.5s ease-in-out infinite" }}/>
          <p style={{ color:"#555", fontSize:"1.1rem", marginBottom:"1rem" }}>What color is this? 🌈</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem", width:"100%", maxWidth:360 }}>
            {options.map(c => (
              <button key={c.name} onClick={() => guess(c)} style={{
                background:c.hex, border:"4px solid rgba(255,255,255,.6)",
                borderRadius:16, padding:"18px 8px",
                fontSize:"1.1rem", fontWeight:700, color:"#fff",
                textShadow:"1px 1px 2px rgba(0,0,0,.4)", cursor:"pointer",
                fontFamily:"inherit", boxShadow:"0 4px 12px rgba(0,0,0,.15)",
              }}>
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>
    </div>
  );
}

function MathGame({ setScreen, addScore }) {
  const [q, setQ] = useState(null);
  const [opts, setOpts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [level, setLevel] = useState(0);
  const newQ = useCallback((lvl) => {
    const cfg = MATH_LEVELS[lvl];
    const a = Math.floor(Math.random() * cfg.max) + 1;
    const b = Math.floor(Math.random() * (cfg.op==="-" ? a : cfg.max)) + (cfg.op==="-" ? 0 : 1);
    const ans = cfg.op==="+" ? a+b : a-b;
    const wrong = new Set([ans]);
    while (wrong.size < 4) wrong.add(Math.max(0, ans + Math.floor(Math.random()*6)-3));
    setQ({ a, b, op:cfg.op, ans });
    setOpts([...wrong].sort(() => Math.random()-.5));
    setFeedback(null);
  }, []);
  useEffect(() => { newQ(level); }, [level]);
  const guess = (n) => {
    if (n === q.ans) {
      setFeedback("correct"); addScore(2); setConfetti(true);
      setTimeout(() => { setConfetti(false); newQ(level); }, 1100);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 700);
    }
  };
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#43e97b,#38f9d7)", display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem", fontFamily:"'Fredoka One',cursive,sans-serif" }}>
      <Confetti active={confetti}/>
      <BackBtn setScreen={setScreen}/>
      <h2 style={{ color:"#fff", fontSize:"1.8rem", margin:"1rem 0", textShadow:"2px 2px 0 rgba(0,0,0,.1)" }}>Math Magic ✨</h2>
      <div style={{ display:"flex", gap:8, marginBottom:"1.2rem" }}>
        {MATH_LEVELS.map((l, i) => (
          <button key={i} onClick={() => { setLevel(i); }} style={{
            background: level===i ? "#fff" : "rgba(255,255,255,.4)",
            border:"none", borderRadius:20, padding:"6px 16px",
            fontFamily:"inherit", fontWeight:700, cursor:"pointer",
            color: level===i ? "#38f9d7" : "#fff",
          }}>Level {i+1}</button>
        ))}
      </div>
      {q && (
        <>
          <div style={{ background:"rgba(255,255,255,.3)", borderRadius:24, padding:"2rem 3rem", textAlign:"center", marginBottom:"1.5rem" }}>
            <span style={{ fontSize:"3.5rem", color:"#fff", textShadow:"2px 2px 0 rgba(0,0,0,.15)", letterSpacing:4 }}>
              {q.a} {q.op} {q.b} = ?
            </span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem", width:"100%", maxWidth:320 }}>
            {opts.map(n => (
              <button key={n} onClick={() => guess(n)} style={{
                background:"rgba(255,255,255,.85)",
                border: feedback==="correct" && n===q.ans ? "4px solid #FFD93D" : "4px solid transparent",
                borderRadius:18, padding:"18px 8px",
                fontSize:"1.8rem", fontWeight:700, color:"#333",
                cursor:"pointer", fontFamily:"inherit",
                boxShadow:"0 4px 0 rgba(0,0,0,.08)",
              }}>{n}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MemoryGame({ setScreen, addScore }) {
  const EMOJIS = ["🐶","🐱","🦄","🌈","⭐","🍭","🦋","🎈"];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [confetti, setConfetti] = useState(false);
  const [moves, setMoves] = useState(0);
  const init = () => {
    const deck = [...EMOJIS,...EMOJIS].sort(() => Math.random()-.5).map((e,i) => ({ id:i, emoji:e }));
    setCards(deck); setFlipped([]); setMatched(new Set()); setMoves(0);
  };
  useEffect(() => { init(); }, []);
  const flip = (card) => {
    if (flipped.length === 2 || flipped.find(c => c.id===card.id) || matched.has(card.emoji)) return;
    const next = [...flipped, card];
    setFlipped(next);
    setMoves(m => m+1);
    if (next.length === 2) {
      if (next[0].emoji === next[1].emoji) {
        const nm = new Set([...matched, card.emoji]);
        setMatched(nm);
        addScore(3);
        if (nm.size === EMOJIS.length) { setConfetti(true); setTimeout(() => setConfetti(false), 2000); }
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };
  const isFlipped = (card) => flipped.some(c => c.id===card.id) || matched.has(card.emoji);
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#4facfe,#00f2fe)", display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem", fontFamily:"'Fredoka One',cursive,sans-serif" }}>
      <Confetti active={confetti}/>
      <BackBtn setScreen={setScreen}/>
      <h2 style={{ color:"#fff", fontSize:"1.8rem", margin:"1rem 0", textShadow:"2px 2px 0 rgba(0,0,0,.1)" }}>Memory Game 🧠</h2>
      <div style={{ display:"flex", gap:16, marginBottom:"1rem" }}>
        <div style={{ color:"#fff", fontSize:"1rem" }}>Moves: <strong>{moves}</strong></div>
        <div style={{ color:"#fff", fontSize:"1rem" }}>Matched: <strong>{matched.size}/{EMOJIS.length}</strong></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, width:"100%", maxWidth:380 }}>
        {cards.map(card => (
          <button key={card.id} onClick={() => flip(card)} style={{
            aspectRatio:"1", background: isFlipped(card) ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.3)",
            border:"3px solid rgba(255,255,255,.5)", borderRadius:14,
            fontSize:isFlipped(card)?"2rem":"1.5rem", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all .2s", transform: isFlipped(card) ? "scale(1.05)" : "scale(1)",
            boxShadow: matched.has(card.emoji) ? "0 0 0 3px #FFD93D" : "none",
          }}>
            {isFlipped(card) ? card.emoji : "❓"}
          </button>
        ))}
      </div>
      {matched.size === EMOJIS.length && (
        <div style={{ marginTop:"1.5rem", background:"#FFD93D", borderRadius:20, padding:"12px 28px", fontSize:"1.3rem", fontWeight:700, color:"#333", boxShadow:"0 4px 0 rgba(0,0,0,.1)" }}>
          🎉 You won in {moves} moves!
        </div>
      )}
      <button onClick={init} style={{ marginTop:"1rem", background:"rgba(255,255,255,.3)", border:"none", borderRadius:20, padding:"10px 28px", color:"#fff", fontFamily:"inherit", fontSize:"1rem", fontWeight:700, cursor:"pointer" }}>
        🔄 New Game
      </button>
    </div>
  );
}

function DrawBoard({ setScreen }) {
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#FF6B6B");
  const [size, setSize] = useState(12);
  const [paths, setPaths] = useState([]);
  const [current, setCurrent] = useState(null);
  const svgRef = { current: null };
  const getPos = (e) => {
    const el = document.getElementById("draw-svg");
    const rect = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };
  const startDraw = (e) => { e.preventDefault(); const p = getPos(e); setDrawing(true); setCurrent({ color, size, points:[p] }); };
  const moveDraw = (e) => { e.preventDefault(); if (!drawing) return; const p = getPos(e); setCurrent(c => ({ ...c, points:[...c.points, p] })); };
  const endDraw = () => { if (current) setPaths(ps => [...ps, current]); setCurrent(null); setDrawing(false); };
  const toD = (points) => points.map((p,i) => `${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#f77062,#fe5196)", display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem", fontFamily:"'Fredoka One',cursive,sans-serif" }}>
      <BackBtn setScreen={setScreen}/>
      <h2 style={{ color:"#fff", fontSize:"1.8rem", margin:"1rem 0", textShadow:"2px 2px 0 rgba(0,0,0,.1)" }}>Doodle Board 🖌️</h2>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:"1rem" }}>
        {COLORS.map(c => (
          <button key={c} onClick={() => setColor(c)} style={{
            width:32, height:32, borderRadius:"50%", background:c, border: color===c ? "3px solid #fff" : "3px solid transparent",
            cursor:"pointer", boxShadow:"0 2px 4px rgba(0,0,0,.2)",
          }}/>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:"1rem" }}>
        <span style={{ color:"#fff", fontSize:".9rem" }}>Size:</span>
        {[6,12,20,32].map(s => (
          <button key={s} onClick={() => setSize(s)} style={{
            width:s+8, height:s+8, borderRadius:"50%", background:"#fff",
            border: size===s ? "3px solid #FFD93D" : "3px solid transparent",
            cursor:"pointer",
          }}/>
        ))}
        <button onClick={() => setPaths([])} style={{ background:"rgba(255,255,255,.3)", border:"none", borderRadius:16, padding:"6px 14px", color:"#fff", fontFamily:"inherit", fontWeight:700, cursor:"pointer" }}>🗑️ Clear</button>
      </div>
      <svg id="draw-svg"
        viewBox="0 0 380 320" style={{ background:"#fff", borderRadius:20, boxShadow:"0 8px 24px rgba(0,0,0,.15)", cursor:"crosshair", width:"100%", maxWidth:400, touchAction:"none" }}
        onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
        onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}>
        {paths.map((p,i) => <path key={i} d={toD(p.points)} stroke={p.color} strokeWidth={p.size} fill="none" strokeLinecap="round" strokeLinejoin="round"/>)}
        {current && <path d={toD(current.points)} stroke={current.color} strokeWidth={current.size} fill="none" strokeLinecap="round" strokeLinejoin="round"/>}
      </svg>
    </div>
  );
}

function FunQuiz({ setScreen, addScore }) {
  const QS = [
    { q:"How many legs does a spider have?", opts:["4","6","8","10"], ans:"8", emoji:"🕷️" },
    { q:"What color is the sky on a sunny day?", opts:["Green","Blue","Red","Purple"], ans:"Blue", emoji:"☀️" },
    { q:"Which animal is the fastest on land?", opts:["Lion","Horse","Cheetah","Giraffe"], ans:"Cheetah", emoji:"🐆" },
    { q:"How many colors are in a rainbow?", opts:["5","6","7","8"], ans:"7", emoji:"🌈" },
    { q:"What do caterpillars turn into?", opts:["Moths","Bees","Butterflies","Dragonflies"], ans:"Butterflies", emoji:"🦋" },
    { q:"Which planet is closest to the Sun?", opts:["Venus","Earth","Mars","Mercury"], ans:"Mercury", emoji:"🪐" },
  ];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [done, setDone] = useState(false);
  const q = QS[idx];
  const answer = (opt) => {
    if (opt === q.ans) {
      setFeedback("correct"); setScore(s => s+1); addScore(2); setConfetti(true);
      setTimeout(() => { setConfetti(false); if (idx+1 < QS.length) { setIdx(i => i+1); setFeedback(null); } else setDone(true); }, 1200);
    } else {
      setFeedback("wrong");
      setTimeout(() => { if (idx+1 < QS.length) { setIdx(i => i+1); setFeedback(null); } else setDone(true); }, 1000);
    }
  };
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#fa709a,#fee140)", display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem", fontFamily:"'Fredoka One',cursive,sans-serif" }}>
      <Confetti active={confetti}/>
      <BackBtn setScreen={setScreen}/>
      <h2 style={{ color:"#fff", fontSize:"1.8rem", margin:"1rem 0", textShadow:"2px 2px 0 rgba(0,0,0,.1)" }}>Fun Quiz 🌟</h2>
      {!done ? (
        <>
          <div style={{ background:"rgba(255,255,255,.2)", borderRadius:20, padding:"6px 20px", color:"#fff", marginBottom:"1rem" }}>
            Question {idx+1} of {QS.length}
          </div>
          <div style={{ fontSize:"4rem", marginBottom:".5rem" }}>{q.emoji}</div>
          <div style={{ background:"rgba(255,255,255,.9)", borderRadius:20, padding:"1.2rem 1.5rem", textAlign:"center", maxWidth:360, width:"100%", marginBottom:"1.5rem" }}>
            <p style={{ fontSize:"1.2rem", color:"#333", margin:0, lineHeight:1.4 }}>{q.q}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem", width:"100%", maxWidth:360 }}>
            {q.opts.map(opt => (
              <button key={opt} onClick={() => answer(opt)} style={{
                background: feedback==="correct" && opt===q.ans ? "#6BCB77" : feedback==="wrong" && opt===q.ans ? "#6BCB77" : "rgba(255,255,255,.9)",
                border:"3px solid transparent", borderRadius:16, padding:"14px 8px",
                fontSize:"1.1rem", fontWeight:700, color:"#333",
                cursor:"pointer", fontFamily:"inherit",
              }}>{opt}</button>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign:"center", marginTop:"2rem" }}>
          <div style={{ fontSize:"5rem" }}>{score >= 5 ? "🏆" : score >= 3 ? "🥈" : "🌟"}</div>
          <h3 style={{ color:"#fff", fontSize:"2rem", margin:"1rem 0" }}>
            {score >= 5 ? "Amazing!" : score >= 3 ? "Great job!" : "Keep trying!"}
          </h3>
          <p style={{ color:"rgba(255,255,255,.9)", fontSize:"1.2rem" }}>You got {score} out of {QS.length} right!</p>
          <button onClick={() => { setIdx(0); setScore(0); setFeedback(null); setDone(false); }} style={{
            marginTop:"1.5rem", background:"rgba(255,255,255,.9)", border:"none", borderRadius:20, padding:"12px 32px",
            fontSize:"1.1rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
          }}>🔄 Try Again</button>
        </div>
      )}
    </div>
  );
}

function BackBtn({ setScreen }) {
  return (
    <button onClick={() => setScreen("home")} style={{
      position:"absolute", top:16, left:16, background:"rgba(255,255,255,.3)",
      border:"none", borderRadius:12, padding:"8px 16px", color:"#fff",
      fontSize:".9rem", fontWeight:700, cursor:"pointer", fontFamily:"'Fredoka One',cursive,sans-serif",
    }}>← Home</button>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [score, setScore] = useState(0);
  const addScore = (n) => setScore(s => s + n);
  const screens = { home:<HomeScreen setScreen={setScreen} score={score}/>, animals:<AnimalGame setScreen={setScreen} addScore={addScore}/>, colors:<ColorMatch setScreen={setScreen} addScore={addScore}/>, math:<MathGame setScreen={setScreen} addScore={addScore}/>, memory:<MemoryGame setScreen={setScreen} addScore={addScore}/>, draw:<DrawBoard setScreen={setScreen}/>, quiz:<FunQuiz setScreen={setScreen} addScore={addScore}/> };
  return <div style={{ position:"relative" }}>{screens[screen]}</div>;
}

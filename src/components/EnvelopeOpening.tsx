import { useEffect, useMemo, useState } from "react";

/* ---------- Dried gold baby's-breath sprig (pure SVG) ---------- */
function GoldSprig({ className }: { className?: string }) {
  const parts = useMemo(() => {
    let s = 7 * 9301;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const base = { x: 110, y: 210 };
    const stems: string[] = [];
    const buds: { x: number; y: number; r: number; c: string }[] = [];
    const golds = ["#e9cd85", "#c9a24a", "#f3dc9c", "#b08732", "#dcb965"];
    const n = 11;
    for (let i = 0; i < n; i++) {
      const ang = (236 + (i / (n - 1)) * 48 + rand() * 5) * (Math.PI / 180);
      const len = 120 + rand() * 65;
      const ex = base.x + Math.cos(ang) * len;
      const ey = base.y + Math.sin(ang) * len;
      const cx = base.x + Math.cos(ang) * len * 0.5 + (rand() * 14 - 7);
      const cy = base.y + Math.sin(ang) * len * 0.5;
      stems.push(`M${base.x} ${base.y} Q ${cx} ${cy} ${ex} ${ey}`);
      // tip cluster
      const k = 5 + Math.floor(rand() * 5);
      for (let j = 0; j < k; j++) {
        const a = rand() * Math.PI * 2;
        const d = rand() * 9;
        buds.push({ x: ex + Math.cos(a) * d, y: ey + Math.sin(a) * d, r: 1.4 + rand() * 1.6, c: golds[Math.floor(rand() * golds.length)] });
      }
      // side twigs along the stem
      for (let t = 0.45; t < 0.95; t += 0.18) {
        const px = (1 - t) * (1 - t) * base.x + 2 * (1 - t) * t * cx + t * t * ex;
        const py = (1 - t) * (1 - t) * base.y + 2 * (1 - t) * t * cy + t * t * ey;
        const tx = px - 8 - rand() * 12;
        const ty = py - 10 - rand() * 10;
        stems.push(`M${px.toFixed(1)} ${py.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)}`);
        const kk = 2 + Math.floor(rand() * 3);
        for (let j = 0; j < kk; j++) {
          buds.push({ x: tx + rand() * 6 - 3, y: ty + rand() * 6 - 3, r: 1.1 + rand() * 1.3, c: golds[Math.floor(rand() * golds.length)] });
        }
      }
    }
    return { stems, buds };
  }, []);

  return (
    <svg viewBox="0 0 160 220" className={className} aria-hidden="true">
      <g stroke="#b08a3a" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.9">
        {parts.stems.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {parts.buds.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={b.c} />
      ))}
    </svg>
  );
}

/* ---------- Gold wax seal ---------- */
function WaxSeal() {
  const leaves = useMemo(() => {
    const out: { x: number; y: number; rot: number }[] = [];
    // left arc
    for (let i = 0; i < 7; i++) {
      const a = (120 + i * 17) * (Math.PI / 180);
      out.push({ x: 50 + Math.cos(a) * 36, y: 50 + Math.sin(a) * 36, rot: (a * 180) / Math.PI + 90 + (i % 2 ? 28 : -28) });
    }
    // right arc
    for (let i = 0; i < 7; i++) {
      const a = (60 - i * 17) * (Math.PI / 180);
      out.push({ x: 50 + Math.cos(a) * 36, y: 50 + Math.sin(a) * 36, rot: (a * 180) / Math.PI + 90 + (i % 2 ? 28 : -28) });
    }
    return out;
  }, []);

  return (
    <div className="eo-seal">
      <svg viewBox="0 0 100 100" className="eo-seal-art" aria-hidden="true">
        <defs>
          <linearGradient id="sealLeaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6e2a2" />
            <stop offset="1" stopColor="#8a6a1c" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#7a5c14" strokeOpacity="0.55" strokeWidth="1.4" />
        <circle cx="50" cy="50" r="40.6" fill="none" stroke="#fbe7a8" strokeOpacity="0.45" strokeWidth="0.6" />
        {leaves.map((l, i) => (
          <ellipse key={i} cx={l.x} cy={l.y} rx="2.3" ry="5" fill="url(#sealLeaf)" stroke="#6f5212" strokeOpacity="0.5" strokeWidth="0.4" transform={`rotate(${l.rot} ${l.x} ${l.y})`} />
        ))}
      </svg>
      <span>R&amp;R</span>
    </div>
  );
}

/* ---------- January 2027 calendar ---------- */
const WEEK = ["S", "M", "T", "W", "T", "F", "S"];
// January 2027 starts on a Friday; 31 shares the first Sunday slot (as on the printed card)
const DAYS: (number | null)[] = [31, null, null, null, null, 1, 2, ...Array.from({ length: 28 }, (_, i) => i + 3)];

function Calendar() {
  return (
    <div className="cal">
      {WEEK.map((d, i) => (
        <span key={`w${i}`} className="cal-w">
          {d}
        </span>
      ))}
      {DAYS.map((d, i) => (
        <span key={i} className={`cal-d ${d === 15 ? "is-day" : ""}`}>
          {d === 15 && (
            <svg viewBox="0 0 40 36" className="cal-heart" aria-hidden="true">
              <path
                d="M20 33S3 22.5 3 11.6C3 6.4 7 2.8 11.6 2.8c3.6 0 6.4 2 8.4 5 2-3 4.8-5 8.4-5C33 2.8 37 6.4 37 11.6 37 22.5 20 33 20 33z"
                fill="none"
                stroke="url(#goldStroke)"
                strokeWidth="1.6"
              />
              <defs>
                <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f3d98b" />
                  <stop offset="0.5" stopColor="#c99a3c" />
                  <stop offset="1" stopColor="#f0d48a" />
                </linearGradient>
              </defs>
            </svg>
          )}
          {d ?? ""}
        </span>
      ))}
    </div>
  );
}

/* ---------- Invitation card (the white card in the pocket) ---------- */
function CardContent() {
  return (
    <div className="card-inner">
      <p className="c-title">Wedding</p>
      <p className="c-title">Invitation</p>
      <div className="c-rule" />
      <h2 className="c-names">
        <span>Rashini</span>
        <span className="c-amp">&amp;</span>
        <span>Rumesh</span>
      </h2>
    </div>
  );
}

// Card finishes sliding out at ~3.05s (0.45s delay + 2.6s animation); then hold it 2s.
const AUTO_CONTINUE_MS = 5100;

export function EnvelopeOpening({ onComplete, onMusicStart }: { onComplete: () => void; onMusicStart?: () => void }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) {
      if (onMusicStart) onMusicStart();
      const timer = setTimeout(() => onComplete(), AUTO_CONTINUE_MS);
      return () => clearTimeout(timer);
    }
  }, [opened, onComplete, onMusicStart]);

  const open = () => {
    if (!opened) setOpened(true);
  };

  return (
    <>
      <style>{`
        .eo-shell {
          --emerald-950: #06301f;
          --emerald-900: #0a3d27;
          --emerald-800: #0e4a31;
          --emerald-700: #145c3c;
          --gold: linear-gradient(135deg, #b8892d 0%, #f3d98b 38%, #c99a3c 58%, #f0d48a 80%, #a87a24 100%);
          --gold-solid: #d4b062;
          min-height: 100svh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 22px;
          padding: 28px 16px;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
          background:
            radial-gradient(ellipse at 20% 8%, rgba(20,92,60,0.14), transparent 55%),
            radial-gradient(ellipse at 85% 92%, rgba(201,154,60,0.16), transparent 55%),
            linear-gradient(160deg, #f1efe6, #faf8f1 50%, #ece8da);
          font-family: "Cormorant Garamond", serif;
        }

        .eo-stage {
          position: relative;
          width: min(88vw, 410px, calc(80svh * 0.62));
          aspect-ratio: 0.62;
          cursor: pointer;
          outline: none;
          container-type: inline-size;
          transition: transform 1.2s cubic-bezier(.2,.8,.2,1);
        }
        .eo-stage:focus-visible { box-shadow: 0 0 0 3px rgba(201,154,60,0.6); border-radius: 6px; }
        .eo-stage:not(.is-open):hover { transform: translateY(-4px) rotate(-0.4deg); }

        /* shimmering emerald paper */
        .emerald {
          background:
            radial-gradient(ellipse at 25% 15%, rgba(255,255,255,0.16), transparent 50%),
            radial-gradient(ellipse at 80% 85%, rgba(255,255,255,0.08), transparent 55%),
            repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 5px),
            linear-gradient(160deg, var(--emerald-700), var(--emerald-800) 45%, var(--emerald-900));
        }

        /* ----- Back sheet (outer envelope behind) ----- */
        .eo-back {
          position: absolute; left: 3%; right: -4%; top: -2.5%; bottom: -2.5%;
          border-radius: 4px;
          transform: rotate(2deg);
          box-shadow: 0 30px 50px -18px rgba(6,48,31,0.55), 0 6px 14px rgba(0,0,0,0.12);
          transition: transform 1.2s cubic-bezier(.65,0,.35,1) 1.3s, opacity 1s ease 1.4s;
        }
        .eo-back::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,0.18); border-radius: inherit; }

        /* ----- Invitation card ----- */
        .eo-card {
          position: absolute; left: 28%; right: 3%; top: 2.5%; bottom: 2.5%;
          background: #fbfbf8 url("/download%20(1).png") center / cover no-repeat;
          border-radius: 2px;
          overflow: hidden;
          container-type: inline-size;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
          z-index: 2;
        }
        .is-open .eo-card { animation: eoCardOut 2.6s cubic-bezier(.6,0,.3,1) .45s forwards; }
        @keyframes eoCardOut {
          0%   { transform: none; }
          42%  { transform: translateX(16%); }
          100% { transform: translateX(-18%) scale(1.04); box-shadow: 0 30px 60px -20px rgba(6,48,31,0.45), 0 8px 18px rgba(0,0,0,0.1); }
        }

        .card-inner {
          position: relative; z-index: 1; height: 100%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 20cqw 7cqw 22cqw; box-sizing: border-box; color: #2f3a2a;
        }
        .card-inner p { margin: 0; }
        .card-inner { font-family: "Cormorant Garamond", serif; text-transform: uppercase; font-variant-numeric: lining-nums; }
        .c-title { font-family: "Cinzel", serif; font-weight: 700; font-size: 7.4cqw; letter-spacing: 0.2em; padding-left: 0.2em; line-height: 1.35; color: #1f4a32; }
        .c-rule { width: 40%; height: 1px; margin: 6cqw 0 2cqw; background: linear-gradient(90deg, transparent, #b8892d, transparent); }
        .c-names {
          font-family: "Great Vibes", cursive; font-weight: 400; text-transform: none;
          margin: 0; line-height: 1.12; display: flex; flex-direction: column; align-items: center;
          white-space: nowrap; font-size: 20cqw; padding: 0.1em 0.4em;
          background: linear-gradient(135deg, #8a6418 0%, #c99a3c 40%, #a87a24 70%, #b8892d 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent;
        }
        .c-amp { font-size: 0.6em; margin: 0; }

        /* ----- Pocket (front) ----- */
        .eo-pocket {
          position: absolute; left: 0; top: 0; bottom: 0; width: 60%;
          border-radius: 3px;
          z-index: 3;
          box-shadow: 4px 0 12px rgba(0,0,0,0.3), 0 26px 50px -20px rgba(6,48,31,0.55);
          display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
          padding-bottom: 12cqw; box-sizing: border-box;
          transition: transform 1.2s cubic-bezier(.65,0,.35,1) 1.3s, opacity 1s ease 1.4s;
        }
        .eo-pocket::before {
          content: ""; position: absolute; right: 0; top: 0; bottom: 0; width: 1px;
          background: rgba(255,255,255,0.22);
        }
        .is-open .eo-pocket { transform: translateX(-130%) rotate(-4deg); opacity: 0; }
        .is-open .eo-back { transform: translateX(130%) rotate(8deg); opacity: 0; }

        .gold-text {
          background: var(--gold);
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }
        /* script swashes overflow the glyph box; padding gives the gradient room to paint them */
        .p-month-script { font-family: "Great Vibes", cursive; font-size: 9cqw; line-height: 1.3; margin: -1.5cqw 0 -1.5cqw; padding: 0.15em 0.45em 0.2em; }
        .p-month { font-family: "Montserrat", sans-serif; font-size: 3cqw; letter-spacing: 0.24em; margin: 1.4cqw 0 2.4cqw; padding: 0.1em 0.1em 0.1em 0.34em; }

        .cal {
          display: grid; grid-template-columns: repeat(7, 6.6cqw); row-gap: 1.2cqw; column-gap: 0.3cqw;
          font-family: "Montserrat", sans-serif; text-align: center; color: var(--gold-solid);
        }
        .cal span { position: relative; font-size: 2.8cqw; line-height: 4.6cqw; }
        .cal-w { font-weight: 600; font-size: 2.5cqw !important; letter-spacing: 0.05em; }
        .cal-d.is-day { color: #f6e2a2; font-weight: 600; }
        .cal-heart { position: absolute; left: 50%; top: 50%; width: 8cqw; height: 7.2cqw; transform: translate(-50%, -46%); pointer-events: none; }

        .p-save { font-family: "Great Vibes", cursive; font-size: 7cqw; line-height: 1.3; margin: 2cqw 0 -1cqw; padding: 0.15em 0.45em 0.2em; }
        .p-rule { width: 24cqw; height: 1px; background: var(--gold); margin: 1.2cqw 0 2cqw; opacity: 0.85; }
        .p-names { font-family: "Montserrat", sans-serif; font-weight: 600; font-size: 3.4cqw; letter-spacing: 0.12em; margin: 0; padding: 0.1em 0.2em 0.1em 0.32em; white-space: nowrap; }

        /* ----- Gold chain cord ----- */
        .eo-cord { position: absolute; left: -2%; right: 1.5%; top: 30%; height: 10px; transform: translateY(-50%); z-index: 4; transition: opacity .6s ease .25s, transform .8s ease .2s; }
        .eo-cord i {
          position: absolute; left: 0; right: 0; height: 3px; border-radius: 3px;
          background:
            repeating-linear-gradient(90deg, #f3d98b 0 2px, #9c7429 2px 3px, #e2c06e 3px 5px, #7e5c1c 5px 6px);
          box-shadow: 0 1px 2px rgba(40,25,0,0.45);
        }
        .eo-cord i:nth-child(1) { top: 2px; transform: rotate(-0.35deg); }
        .eo-cord i:nth-child(2) { top: 5.5px; transform: rotate(0.3deg); }
        .is-open .eo-cord { opacity: 0; transform: translateY(40px) scaleX(1.08); }

        /* ----- Seal + sprig ----- */
        .eo-sprig {
          position: absolute; z-index: 5; width: 30cqw; left: 1cqw; top: calc(30% - 42cqw);
          filter: drop-shadow(0 1px 1.5px rgba(40,25,0,0.45));
          transition: transform .9s cubic-bezier(.5,-0.3,.6,1), opacity .7s ease .2s;
        }
        .is-open .eo-sprig { transform: translate(-30%, 40%) rotate(-30deg); opacity: 0; }

        .eo-seal-wrap {
          position: absolute; left: 22%; top: 30%; z-index: 6;
          width: 23cqw; aspect-ratio: 1;
          transform: translate(-50%, -50%);
          transition: transform .9s cubic-bezier(.5,-0.3,.6,1), opacity .7s ease .2s;
        }
        .eo-stage:not(.is-open) .eo-seal-wrap { animation: eoSealGlow 2.6s ease-in-out infinite; }
        @keyframes eoSealGlow {
          0%,100% { filter: drop-shadow(0 0 0 rgba(243,217,139,0)); }
          50% { filter: drop-shadow(0 0 10px rgba(243,217,139,0.7)); }
        }
        .is-open .eo-seal-wrap { transform: translate(-50%, 90%) rotate(-25deg); opacity: 0; }
        .eo-seal {
          position: absolute; inset: 0;
          border-radius: 47% 53% 49% 51% / 52% 46% 54% 48%;
          background: radial-gradient(circle at 34% 28%, #f8e6a6 0%, #d9b552 22%, #a9852a 55%, #6f5714 100%);
          box-shadow:
            inset -4px -6px 10px rgba(60,44,6,0.55),
            inset 4px 5px 8px rgba(255,240,180,0.6),
            0 6px 14px rgba(20,15,0,0.5);
          display: flex; align-items: center; justify-content: center;
        }
        .eo-seal-art { position: absolute; inset: 6%; width: 88%; height: 88%; }
        .eo-seal span {
          position: relative;
          font-family: "Great Vibes", cursive; font-size: 6.2cqw;
          color: #6b5312;
          text-shadow: 1px 1px 0 rgba(255,236,170,0.6), -1px -1px 0 rgba(60,44,6,0.45);
          letter-spacing: -0.02em;
        }

        .eo-hint {
          font-family: "Cinzel", serif; letter-spacing: 0.3em; font-size: 12px; text-transform: uppercase;
          color: var(--emerald-800);
          animation: eoPulse 2.2s ease-in-out infinite;
          text-align: center;
        }
        @keyframes eoPulse { 0%,100% { opacity: .45 } 50% { opacity: 1 } }

        .eo-hint.is-hidden { visibility: hidden; }

        @media (prefers-reduced-motion: reduce) {
          .eo-pocket, .eo-back, .eo-cord, .eo-seal-wrap, .eo-sprig, .eo-stage { transition-duration: .01s !important; transition-delay: 0s !important; }
          .is-open .eo-card { animation-duration: .01s !important; animation-delay: 0s !important; }
          .eo-hint, .eo-seal-wrap { animation: none !important; }
        }
      `}</style>

      <div className="eo-shell">
        <div
          className={`eo-stage ${opened ? "is-open" : ""}`}
          role="button"
          tabIndex={opened ? -1 : 0}
          aria-label="Open invitation"
          onClick={open}
          onKeyDown={(e) => {
            if (!opened && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              open();
            }
          }}
        >
          <div className="eo-back emerald" />

          <div className="eo-card">
            <CardContent />
          </div>

          <div className="eo-pocket emerald" aria-hidden="true">
            <p className="p-month-script gold-text">January</p>
            <p className="p-month gold-text">JANUARY · 2027</p>
            <Calendar />
            <p className="p-save gold-text">Save the Date</p>
            <div className="p-rule" />
            <p className="p-names gold-text">RASHINI &amp; RUMESH</p>
          </div>

          <div className="eo-cord" aria-hidden="true">
            <i />
            <i />
          </div>

          <GoldSprig className="eo-sprig" />

          <div className="eo-seal-wrap" aria-hidden="true">
            <WaxSeal />
          </div>
        </div>

        {/* stays in the layout (hidden) so the card doesn't jump when it disappears */}
        <div className={`eo-hint ${opened ? "is-hidden" : ""}`}>Tap the seal to open</div>
      </div>
    </>
  );
}

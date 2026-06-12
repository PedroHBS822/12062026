/* ============================================================
   Fundo mágico: vaga-lumes roxos e verdes + brilhos no cursor
   ============================================================ */

(function () {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles;

  const COLORS = [
    [124, 58, 237],  // roxo
    [167, 139, 250], // lilás
    [163, 230, 53],  // verde-limão
    [217, 249, 157], // limão claro
  ];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle(anywhere) {
    const c = COLORS[(Math.random() * COLORS.length) | 0];
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 20,
      r: 0.8 + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.12 + Math.random() * 0.4),
      c: c,
      tw: Math.random() * Math.PI * 2,        // fase do brilho
      tws: 0.01 + Math.random() * 0.03,       // velocidade do brilho
      a: 0.25 + Math.random() * 0.5,
    };
  }

  function init() {
    resize();
    const count = Math.min(110, Math.floor((W * H) / 14000));
    particles = [];
    for (let i = 0; i < count; i++) particles.push(makeParticle(true));
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.tw += p.tws;
      if (p.y < -20 || p.x < -20 || p.x > W + 20) {
        particles[i] = makeParticle(false);
        continue;
      }
      const glow = (Math.sin(p.tw) + 1) / 2;
      const alpha = p.a * (0.35 + 0.65 * glow);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      grad.addColorStop(0, "rgba(" + p.c[0] + "," + p.c[1] + "," + p.c[2] + "," + alpha + ")");
      grad.addColorStop(1, "rgba(" + p.c[0] + "," + p.c[1] + "," + p.c[2] + ",0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", function () { resize(); });
  init();
  tick();

  /* ----- brilhos que seguem o cursor / toque ----- */
  const layer = document.getElementById("sparkle-layer");
  const SPARK_COLORS = ["#a78bfa", "#7c3aed", "#d9f99d", "#a3e635", "#ffffff"];
  let lastSpark = 0;

  function spawnSpark(x, y) {
    const now = performance.now();
    if (now - lastSpark < 28) return;
    lastSpark = now;
    const s = document.createElement("div");
    s.className = "spark";
    const color = SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0];
    s.style.left = (x - 3) + "px";
    s.style.top = (y - 3) + "px";
    s.style.background = color;
    s.style.boxShadow = "0 0 10px " + color;
    s.style.setProperty("--sx", ((Math.random() - 0.5) * 50) + "px");
    s.style.setProperty("--sy", (-(15 + Math.random() * 45)) + "px");
    layer.appendChild(s);
    setTimeout(function () { s.remove(); }, 950);
  }

  window.addEventListener("pointermove", function (e) { spawnSpark(e.clientX, e.clientY); });

  /* ----- explosão de brilhos (usada nos acertos de senha) ----- */
  window.sparkleBurst = function (x, y, amount) {
    const n = amount || 26;
    for (let i = 0; i < n; i++) {
      setTimeout(function () {
        lastSpark = 0;
        spawnSpark(x + (Math.random() - 0.5) * 70, y + (Math.random() - 0.5) * 70);
      }, i * 22);
    }
  };
})();

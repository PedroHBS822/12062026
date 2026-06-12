/* ============================================================
   A Câmera de Lembranças — fases, enigmas e o grande final
   ============================================================ */

(function () {
  const stage = document.getElementById("stage");
  const hintModal = document.getElementById("hint-modal");
  const hintText = document.getElementById("hint-text");
  const flash = document.getElementById("flash");

  const SAVE_KEY = "lembrancas-fase";

  /* normaliza respostas: minúsculas, sem acentos, sem espaços nas pontas */
  function norm(s) {
    return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function digits(s) {
    return s.replace(/\D/g, "");
  }

  /* ----------------------------------------------------------
     As fases (textos exatamente como foram escritos)
     ---------------------------------------------------------- */
  const ROXO = { c: "#a78bfa", glow: "rgba(124, 58, 237, 0.5)", soft: "rgba(167, 139, 250, 0.3)" };
  const VERDE = { c: "#a3e635", glow: "rgba(163, 230, 53, 0.45)", soft: "rgba(163, 230, 53, 0.25)" };

  const PHASES = [
    {
      kicker: "A Luz Escura",
      accent: ROXO,
      text: ["Bem-vinda, senhorita Gabriela Kussuki. Por favor, digite a senha."],
      hint: "A senha além de desbloquear o nosso amor desbloqueia os nossos notebooks.",
      check: function (v) { return digits(v) === "22072022"; },
    },
    {
      kicker: "O Primeiro Beijo",
      accent: VERDE,
      text: ["Nesse dia da foto nós já namorávamos, só não sabíamos ainda. Foi exatamente um dia depois do nosso primeiro beijo (que, eu sei, pode não ter sido o mais memorável do mundo), mas foi um passo gigante para quem já estava se enrolando há 5 meses! Para acessar a nossa próxima memória, precisamos voltar um pouco no tempo, para antes mesmo desse beijo. Lembra que, há exatos 4 anos, a gente estava quebrando a cabeça fazendo aquele PBL? Pois é..."],
      hint: "A chave para o passado está no nosso primeiro grande trabalho juntos. Qual foi a última palavra do título do nosso primeiro PBL?",
      check: function (v) { return norm(v) === "linda"; },
    },
    {
      kicker: "A Linha do Tempo",
      accent: ROXO,
      text: ["Admito, fui ousado. Fiquei até com vergonha na hora que abri o arquivo hoje, não sei como o Pedro de 2022 teve coragem, a gente nem namorava ainda! Mas acho que funcionou, né? Isso que importa. Estava pensando aqui no tempo em que a gente já 'se conhecia', mas não estava junto. Nos conhecemos no sétimo ano, veio a pandemia, e eu com certeza te irritei nos trabalhos (admito, não era um aluno muito bom). Fomos para o oitavo, e acho que o nosso principal contato foi quando eu te dei 'feliz aniversário' (calma, eu sei que você está rindo e duvidando desse fato, mas a minha mente não falha!). Ela, pelo menos, não errou duas vezes nessa vida: quando decidiu se apaixonar por você e quando decidiu gravar o momento em que te dei parabéns. Depois disso nos reencontramos no nono ano. Mesma sala, viagem de férias (que legal, vamos lá ver uns bois morrendo...). Enfim, é o universo fazendo o trabalho dele, né? Lembra daquele cinema? Eu não queria assistir a um filme de um herói que eu não acho nada heroico, mas eu fui. Aceitei ir sem saber direito o motivo, mas hoje eu sei que era por você."],
      hint: "A pergunta é: qual é o nome do herói não tão heroico assim que foi mandado pelo universo para nos juntar?",
      check: function (v) { return norm(v) === "batman"; },
    },
    {
      kicker: "A Admiração",
      accent: VERDE,
      text: [
        "O nono ano foi passando e a gente passou a se ver todos os dias (que saudade dessa época). Passei os 5 meses seguintes àquela viagem te conhecendo o máximo que eu podia. Fiquei impressionado com a sua personalidade. Me sentia desafiado a te ler como um livro, um livro que aquecia meu coração a cada parágrafo que eu terminava de ler. Literalmente, ficava abismado quando você apresentava algum trabalho... como você podia ser tão perfeita?",
        "Como aquele tempo passou rápido... se a mesa que sentávamos fosse um relógio, em qual horário estaríamos?",
      ],
      hint: null,
      check: function (v) { const d = digits(v); return d === "0940" || d === "940"; },
    },
    {
      kicker: "A Base do Castelo",
      accent: ROXO,
      text: ["Começamos a trabalhar, voltamos a estar em salas diferentes. O Emerson infernizava seus dias com provas impossíveis que nem ele conseguia fazer sem errar, enquanto eu estava na terceira aula do Cadu do dia, discutindo com ele sobre um jogo qualquer. Acho que aquela 'distância' nos fez bem. Foi ali que desenvolvi a saudade: saudade de te ver, de ouvir sua voz, de tocar suas mãos. Aquela pequena distância de no máximo uns 10 metros amadureceu nosso relacionamento. Cada momento com você, nos intervalos, almoços e jantares, se tornava cada vez mais importante. Foram naqueles anos (2023, 2024 e 2025) que a base do nosso castelo foi construída. Os defeitos de cada um foram expostos e a paixão virou amor. Um amor que estou disposto a levar para toda a vida."],
      hint: "Será que você ainda tem os meus crachás dessa época? Não estou lembrando qual era o meu número de inscrição e preciso preencher essa informação para tirar o passaporte.",
      check: function (v) { return digits(v) === "20190173"; },
    },
    {
      kicker: "O Futuro",
      accent: VERDE,
      text: ["Quantos crachás meus eu te dei? Tem muitas versões de mim neles. Estava procurando alguns documentos meus aqui e achei alguns de quando eu não te conhecia ainda, uma criança. Se quiser completar a coleção... Uai, estou separando os documentos aqui para tirar o passaporte para viajar com você, e um dos que eu preciso é da certidão de casamento, mas não tô achando. Kkkkkkkk! Perdão, esqueci que ainda não somos casados. Esses 4 anos do seu lado foram tão bons que me esqueço que ainda tem muita coisa por vir. São tantas fotos nossas que o meu armazenamento acaba a cada novo clique que eu dou (e olha que eu sei que você tem muito mais foto do que eu). Cada foto dessa carrega um momento, duas lembranças, dois sentimentos, duas pessoas e uma paixão. A câmera física aí com você é simbólica: ela está aí para registrar qualquer momento da sua vida que você deseje guardar, sem que ele fique perdido por aí em uma nuvem artificial em um computador, muito provavelmente do Google."],
      finalButton: true,
    },
  ];

  /* ----------------------------------------------------------
     Sons mágicos (gerados na hora, sem arquivos de áudio)
     ---------------------------------------------------------- */
  let audioCtx = null;
  function tone(freq, start, dur, type, vol) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, audioCtx.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + start + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(audioCtx.currentTime + start);
    o.stop(audioCtx.currentTime + start + dur + 0.05);
  }
  function playSound(kind) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      if (kind === "success") {
        tone(523.25, 0, 0.5); tone(659.25, 0.12, 0.5); tone(783.99, 0.24, 0.7); tone(1046.5, 0.36, 0.9, "sine", 0.08);
      } else if (kind === "error") {
        tone(196, 0, 0.3, "triangle", 0.1); tone(174.6, 0.12, 0.4, "triangle", 0.1);
      } else if (kind === "shutter") {
        tone(2400, 0, 0.04, "square", 0.06); tone(1200, 0.05, 0.05, "square", 0.06); tone(320, 0.1, 0.18, "triangle", 0.1);
      } else if (kind === "pop") {
        tone(880, 0, 0.12, "sine", 0.07);
      }
    } catch (e) { /* sem som, sem problema */ }
  }

  /* ----------------------------------------------------------
     Decorações flutuantes da fase
     ---------------------------------------------------------- */
  let floatersEl = null;
  const ORB_COLORS = ["#7c3aed", "#a78bfa", "#a3e635", "#d9f99d"];
  function setFloaters() {
    if (floatersEl) floatersEl.remove();
    floatersEl = document.createElement("div");
    floatersEl.className = "floaters";
    for (let i = 0; i < 16; i++) {
      const f = document.createElement("span");
      f.className = "floater";
      f.style.left = (Math.random() * 100) + "vw";
      f.style.setProperty("--c", ORB_COLORS[(Math.random() * ORB_COLORS.length) | 0]);
      f.style.setProperty("--fs", (10 + Math.random() * 34) + "px");
      f.style.setProperty("--blur", (Math.random() * 3) + "px");
      f.style.setProperty("--dur", (14 + Math.random() * 16) + "s");
      f.style.setProperty("--delay", (-Math.random() * 24) + "s");
      f.style.setProperty("--sway", ((Math.random() - 0.5) * 120) + "px");
      f.style.setProperty("--op", (0.2 + Math.random() * 0.4).toFixed(2));
      floatersEl.appendChild(f);
    }
    document.body.appendChild(floatersEl);
  }

  /* ----------------------------------------------------------
     Construção e exibição de uma fase
     ---------------------------------------------------------- */
  let current = 0;

  function renderPhase(index) {
    const phase = PHASES[index];
    stage.innerHTML = "";
    setFloaters();

    const wrap = document.createElement("div");
    wrap.className = "phase";
    wrap.style.setProperty("--accent", phase.accent.c);
    wrap.style.setProperty("--accent-glow", phase.accent.glow);
    wrap.style.setProperty("--accent-soft", phase.accent.soft);

    const lens = document.createElement("div");
    lens.className = "phase-lens";
    wrap.appendChild(lens);

    const kicker = document.createElement("div");
    kicker.className = "phase-kicker";
    kicker.textContent = phase.kicker;
    wrap.appendChild(kicker);

    /* texto com revelação palavra por palavra */
    const textEl = document.createElement("div");
    textEl.className = "phase-text";
    let wordCount = 0;
    phase.text.forEach(function (paragraph) {
      const p = document.createElement("p");
      paragraph.split(" ").forEach(function (word, wi) {
        const span = document.createElement("span");
        span.className = "w";
        span.textContent = word;
        span.style.setProperty("--d", (wordCount * 0.045) + "s");
        p.appendChild(span);
        p.appendChild(document.createTextNode(" "));
        wordCount++;
      });
      textEl.appendChild(p);
    });
    wrap.appendChild(textEl);

    const skipTip = document.createElement("div");
    skipTip.className = "skip-tip";
    skipTip.textContent = "toque no texto para revelar tudo";
    wrap.appendChild(skipTip);

    /* portão da senha ou botão final */
    const gate = document.createElement("div");
    gate.className = "gate";
    if (phase.finalButton) {
      buildFinalButton(gate);
    } else {
      buildPasswordGate(gate, phase);
    }
    wrap.appendChild(gate);

    stage.appendChild(wrap);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wrap.classList.add("in");
        textEl.querySelectorAll(".w").forEach(function (w) { w.classList.add("on"); });
      });
    });

    const totalRevealMs = wordCount * 45 + 900;
    let gateShown = false;
    function showGate() {
      if (gateShown) return;
      gateShown = true;
      skipTip.classList.add("gone");
      gate.classList.add("in");
      const input = gate.querySelector("input");
      if (input && window.matchMedia("(min-width: 700px)").matches) input.focus();
    }
    const gateTimer = setTimeout(showGate, Math.min(totalRevealMs, 16000));
    textEl.addEventListener("click", function () {
      textEl.classList.add("revealed");
      clearTimeout(gateTimer);
      showGate();
    });

    return wrap;
  }

  function buildPasswordGate(gate, phase) {
    const row = document.createElement("div");
    row.className = "gate-row";

    const pwdWrap = document.createElement("div");
    pwdWrap.className = "pwd-wrap";
    const input = document.createElement("input");
    input.className = "pwd-input";
    input.type = "text";
    input.autocomplete = "off";
    input.autocapitalize = "off";
    input.spellcheck = false;
    input.placeholder = "digite a senha…";
    pwdWrap.appendChild(input);
    row.appendChild(pwdWrap);

    const go = document.createElement("button");
    go.className = "btn-go";
    go.type = "button";
    go.textContent = "Revelar";
    row.appendChild(go);

    if (phase.hint) {
      const hintBtn = document.createElement("button");
      hintBtn.className = "btn-hint";
      hintBtn.type = "button";
      hintBtn.textContent = "?";
      hintBtn.title = "uma dica…";
      hintBtn.addEventListener("click", function () {
        playSound("pop");
        hintText.textContent = phase.hint;
        hintModal.classList.remove("hidden");
      });
      row.appendChild(hintBtn);
    }

    gate.appendChild(row);

    const feedback = document.createElement("div");
    feedback.className = "gate-feedback";
    gate.appendChild(feedback);

    const WRONG_MESSAGES = [
      "Hmm… a magia não reconheceu essa senha. Tente de novo!",
      "Quase! Mas as lembranças continuam trancadas…",
      "Essa não é a chave certa. Respire fundo e pense de novo...",
    ];
    let wrongCount = 0;

    function attempt() {
      const value = input.value;
      if (!value.trim()) return;
      if (phase.check(value)) {
        playSound("success");
        const rect = go.getBoundingClientRect();
        if (window.sparkleBurst) {
          window.sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 34);
        }
        advance();
      } else {
        playSound("error");
        gate.classList.remove("error");
        void gate.offsetWidth; /* reinicia a animação de tremor */
        gate.classList.add("error");
        feedback.textContent = WRONG_MESSAGES[wrongCount % WRONG_MESSAGES.length];
        feedback.classList.add("show");
        wrongCount++;
        input.select();
      }
    }

    go.addEventListener("click", attempt);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") attempt();
      feedback.classList.remove("show");
      gate.classList.remove("error");
    });
  }

  /* ----------------------------------------------------------
     O botão final, que foge antes de deixar ser clicado
     ---------------------------------------------------------- */
  function buildFinalButton(gate) {
    const arena = document.createElement("div");
    arena.className = "final-arena";

    const btn = document.createElement("button");
    btn.id = "btn-final";
    btn.type = "button";
    btn.textContent = "Clique Aqui";

    let dodges = 0;
    const MAX_DODGES = 3;

    function dodge() {
      dodges++;
      playSound("pop");
      const aw = arena.clientWidth, bw = btn.offsetWidth;
      const x = Math.random() * Math.max(0, aw - bw);
      const y = Math.random() * 90;
      btn.style.left = x + "px";
      btn.style.top = y + "px";
      btn.style.position = "absolute";
    }

    btn.addEventListener("pointerenter", function (e) {
      if (e.pointerType === "mouse" && dodges < MAX_DODGES) dodge();
    });
    btn.addEventListener("click", function () {
      if (dodges < MAX_DODGES) { dodge(); return; }
      grandFinale();
    });

    arena.appendChild(btn);
    gate.appendChild(arena);
  }

  /* ----------------------------------------------------------
     O grande final: flash de câmera e a galeria viva
     ---------------------------------------------------------- */
  function grandFinale() {
    localStorage.setItem(SAVE_KEY, "fim");
    playSound("shutter");
    flash.classList.add("fire");
    setTimeout(function () {
      stage.style.display = "none";
      if (floatersEl) floatersEl.remove();
      window.startGallery();
    }, 420);
    setTimeout(function () { flash.classList.remove("fire"); }, 1300);
  }

  function advance() {
    const phaseEl = stage.querySelector(".phase");
    if (phaseEl) phaseEl.classList.add("out");
    current++;
    localStorage.setItem(SAVE_KEY, String(current));
    setTimeout(function () { renderPhase(current); }, 750);
  }

  /* ----------------------------------------------------------
     Modal da dica
     ---------------------------------------------------------- */
  document.getElementById("hint-close").addEventListener("click", function () {
    hintModal.classList.add("hidden");
  });
  hintModal.querySelector(".modal-backdrop").addEventListener("click", function () {
    hintModal.classList.add("hidden");
  });

  /* ----------------------------------------------------------
     Início: carrega o progresso salvo e abre a cortina
     ---------------------------------------------------------- */
  const params = new URLSearchParams(location.search);
  if (params.has("reiniciar")) {
    localStorage.removeItem(SAVE_KEY);
    history.replaceState(null, "", location.pathname);
  }
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved === "fim") {
    current = PHASES.length - 1;
  } else if (saved) {
    const n = parseInt(saved, 10);
    if (!isNaN(n) && n > 0 && n < PHASES.length) current = n;
  }
  if (params.has("fase")) {
    const n = parseInt(params.get("fase"), 10);
    if (!isNaN(n) && n >= 1 && n <= PHASES.length) current = n - 1;
  }

  window.addEventListener("load", function () {
    setTimeout(function () {
      document.getElementById("loader").classList.add("gone");
      renderPhase(current);
    }, 2400);
  });
})();

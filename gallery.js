/* ============================================================
   Galeria final: fotos vivas flutuando pela tela
   ============================================================
   - Funciona com qualquer quantidade de fotos (900+): só uma
     pequena parte fica na tela ao mesmo tempo, e as molduras
     vão trocando de foto sozinhas, percorrendo a coleção toda.
   - Clique em uma foto para vê-la grande (lightbox).
   ============================================================ */

(function () {
  const galleryEl = document.getElementById("gallery");
  const fieldEl = document.getElementById("gallery-field");
  const msgEl = document.getElementById("final-message");
  const msgBtn = document.getElementById("message-again");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");

  let photos = [];        // lista de {src, big} na ordem embaralhada
  let nextPhoto = 0;      // próximo índice da coleção a entrar na tela
  let cards = [];
  let running = false;
  let lbIndex = 0;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function buildPhotoList() {
    if (typeof DRIVE_PHOTO_IDS !== "undefined" && DRIVE_PHOTO_IDS.length > 0) {
      photos = DRIVE_PHOTO_IDS.map(function (id) {
        return {
          src: drivePhotoUrl(id, 400),
          fallback: drivePhotoFallbackUrl(id, 400),
          big: drivePhotoUrl(id, 1200),
          bigFallback: drivePhotoFallbackUrl(id, 1200),
        };
      });
    } else {
      photos = makePlaceholderPhotos(40).map(function (src) {
        return { src: src, fallback: src, big: src, bigFallback: src };
      });
    }
    shuffle(photos);
  }

  function takeNextPhotoIndex() {
    const idx = nextPhoto;
    nextPhoto = (nextPhoto + 1) % photos.length;
    return idx;
  }

  function setCardImage(card, photoIndex) {
    const photo = photos[photoIndex];
    const img = card.img;
    card.photoIndex = photoIndex;
    img.dataset.triedFallback = "";
    img.src = photo.src;
  }

  function makeCard() {
    const W = window.innerWidth, H = window.innerHeight;
    const size = 95 + Math.random() * 85;

    const el = document.createElement("div");
    el.className = "photo-card";
    el.style.setProperty("--pw", size + "px");
    el.style.setProperty("--ph", size + "px");
    el.style.zIndex = (10 + (Math.random() * 30) | 0);

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = "lembrança";
    img.addEventListener("error", function () {
      const photo = photos[card.photoIndex];
      if (!img.dataset.triedFallback && photo.fallback !== photo.src) {
        img.dataset.triedFallback = "1";
        img.src = photo.fallback;
      }
    });
    el.appendChild(img);

    const card = {
      el: el,
      img: img,
      size: size,
      x: Math.random() * (W - size),
      y: Math.random() * (H - size),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      bobPhase: Math.random() * Math.PI * 2,
      bobSpeed: 0.004 + Math.random() * 0.006,
      rotBase: (Math.random() - 0.5) * 14,
      photoIndex: 0,
    };

    el.addEventListener("click", function () { openLightbox(card.photoIndex); });
    setCardImage(card, takeNextPhotoIndex());
    fieldEl.appendChild(el);
    return card;
  }

  function animate(now) {
    if (!running) return;
    const W = window.innerWidth, H = window.innerHeight;
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      c.x += c.vx;
      c.y += c.vy;
      c.bobPhase += c.bobSpeed;
      const pad = c.size + 40;
      if (c.x < -pad) c.x = W + 10;
      if (c.x > W + pad) c.x = -10 - c.size;
      if (c.y < -pad) c.y = H + 10;
      if (c.y > H + pad) c.y = -10 - c.size;
      const bobY = Math.sin(c.bobPhase) * 9;
      const rot = c.rotBase + Math.sin(c.bobPhase * 0.7) * 5;
      c.el.style.transform =
        "translate(" + c.x + "px," + (c.y + bobY) + "px) rotate(" + rot + "deg)";
    }
    requestAnimationFrame(animate);
  }

  /* troca periódica: uma moldura aleatória recebe a próxima foto da coleção */
  function startSwapping() {
    setInterval(function () {
      if (!running || cards.length === 0 || photos.length <= cards.length) return;
      const card = cards[(Math.random() * cards.length) | 0];
      card.img.classList.add("swapping");
      setTimeout(function () {
        setCardImage(card, takeNextPhotoIndex());
        card.img.classList.remove("swapping");
      }, 820);
    }, 2600);
  }

  function showMessage() {
    msgEl.classList.remove("hidden");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { msgEl.classList.add("show"); });
    });
    setTimeout(function () {
      msgEl.classList.remove("show");
      setTimeout(function () {
        msgEl.classList.add("hidden");
        msgBtn.classList.remove("hidden");
      }, 1700);
    }, 13000);
  }

  /* ----- lightbox ----- */
  function openLightbox(photoIndex) {
    lbIndex = photoIndex;
    loadLightboxImage();
    lightbox.classList.remove("hidden");
  }
  function loadLightboxImage() {
    const photo = photos[lbIndex];
    lbImg.dataset.triedFallback = "";
    lbImg.src = photo.big;
  }
  lbImg.addEventListener("error", function () {
    const photo = photos[lbIndex];
    if (!lbImg.dataset.triedFallback && photo.bigFallback !== photo.big) {
      lbImg.dataset.triedFallback = "1";
      lbImg.src = photo.bigFallback;
    }
  });
  function stepLightbox(dir) {
    lbIndex = (lbIndex + dir + photos.length) % photos.length;
    loadLightboxImage();
  }
  document.getElementById("lb-close").addEventListener("click", function () {
    lightbox.classList.add("hidden");
  });
  document.getElementById("lb-prev").addEventListener("click", function () { stepLightbox(-1); });
  document.getElementById("lb-next").addEventListener("click", function () { stepLightbox(1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) lightbox.classList.add("hidden");
  });
  document.addEventListener("keydown", function (e) {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") lightbox.classList.add("hidden");
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  msgBtn.addEventListener("click", function () {
    msgBtn.classList.add("hidden");
    showMessage();
  });

  /* ----- ponto de entrada, chamado pelo app.js no grande final ----- */
  window.startGallery = function () {
    buildPhotoList();
    const area = window.innerWidth * window.innerHeight;
    const cardCount = Math.max(10, Math.min(26, Math.floor(area / 42000), photos.length));
    for (let i = 0; i < cardCount; i++) cards.push(makeCard());
    galleryEl.classList.remove("hidden");
    running = true;
    requestAnimationFrame(animate);
    startSwapping();
    setTimeout(showMessage, 3200);
  };
})();

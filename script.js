/* ===================================================================
   ROMANTIC BIRTHDAY EXPERIENCE FOR ANSHU - INTERACTION ENGINE
   Crafted with Code & Love by Satyam
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAudioEngine();
  initPetalCanvas();
  initConfettiCanvas();
  initCursorTrail();
  initUnwrapping();
  initTypewriter();
  initCountdown();
  initDeveloperTerminal();
  initCakeCandle();
  initWaxEnvelope();
  initReactions();
  initPhotoCustomizer();
  initLightbox();
});

/* ===================================================================
   1. ROMANTIC AUDIO ENGINE (Web Audio API Synthesizer)
   Produces a soothing, dreamy music-box / electric piano melody
=================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

function initAudioEngine() {
  const musicBtn = document.getElementById('music-btn');
  const musicStatus = document.getElementById('music-status');
  const musicIcon = document.getElementById('music-icon');

  function startMusic() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isMusicPlaying = true;
    musicStatus.textContent = 'ON';
    musicIcon.textContent = '💖';
    musicBtn.classList.add('pulse-glow');

    // Chords progression for romantic lullaby (F, C, Dm, Bb / A, C, E)
    // Melody notes in Hz
    const melodyNotes = [
      // Phrase 1
      { f: 523.25, d: 0.6 }, // C5
      { f: 587.33, d: 0.4 }, // D5
      { f: 659.25, d: 0.8 }, // E5
      { f: 783.99, d: 1.0 }, // G5
      { f: 659.25, d: 0.6 }, // E5
      { f: 523.25, d: 1.2 }, // C5

      // Phrase 2
      { f: 440.00, d: 0.6 }, // A4
      { f: 523.25, d: 0.6 }, // C5
      { f: 587.33, d: 0.8 }, // D5
      { f: 659.25, d: 1.2 }, // E5
      { f: 587.33, d: 1.4 }, // D5

      // Phrase 3
      { f: 523.25, d: 0.6 }, // C5
      { f: 659.25, d: 0.6 }, // E5
      { f: 783.99, d: 0.8 }, // G5
      { f: 880.00, d: 1.2 }, // A5
      { f: 783.99, d: 0.6 }, // G5
      { f: 659.25, d: 1.4 }, // E5

      // Phrase 4 (Warm resolution)
      { f: 587.33, d: 0.6 }, // D5
      { f: 659.25, d: 0.6 }, // E5
      { f: 523.25, d: 1.8 }  // C5
    ];

    let noteIndex = 0;
    function playNextNote() {
      if (!isMusicPlaying || !audioCtx) return;
      const note = melodyNotes[noteIndex];
      playChimeNote(note.f, note.d);

      // Play soft bass root chord note alongside
      if (noteIndex % 4 === 0) {
        const bassNotes = [261.63, 220.00, 349.23, 392.00];
        const bassFreq = bassNotes[(noteIndex / 4) % bassNotes.length];
        playSoftPad(bassFreq, 2.0);
      }

      noteIndex = (noteIndex + 1) % melodyNotes.length;
      musicInterval = setTimeout(playNextNote, note.d * 1000);
    }

    playNextNote();
  }

  function stopMusic() {
    isMusicPlaying = false;
    musicStatus.textContent = 'OFF';
    musicIcon.textContent = '🎵';
    musicBtn.classList.remove('pulse-glow');
    if (musicInterval) {
      clearTimeout(musicInterval);
      musicInterval = null;
    }
  }

  musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  // Store for global call
  window.triggerMusicStart = startMusic;
}

function playChimeNote(freq, duration) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  // Gentle bell/music-box envelope
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.1);
}

function playSoftPad(freq, duration) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq / 2, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.04, now + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.1);
}

/* ===================================================================
   2. FALLING CHERRY BLOSSOMS & STARDUST CANVAS
=================================================================== */
function initPetalCanvas() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = 38;

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 12 + 8,
      speedX: Math.random() * 1.5 - 0.5,
      speedY: Math.random() * 1.2 + 0.8,
      flip: Math.random() * 360,
      flipSpeed: Math.random() * 1.5 + 0.5,
      color: ['#ffb7b2', '#ff9aa2', '#ffd1dc', '#ff758c'][Math.floor(Math.random() * 4)],
      opacity: Math.random() * 0.5 + 0.3
    });
  }

  function drawPetals() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.flip * 0.02) * 1.2 + p.speedX;
      p.flip += p.flipSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.flip * Math.PI) / 180);
      ctx.scale(Math.sin((p.flip * Math.PI) / 180), 1);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;

      // Petal oval shape
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size / 2, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();

      ctx.restore();
    });

    requestAnimationFrame(drawPetals);
  }

  drawPetals();
}

/* ===================================================================
   3. FIREWORKS & CONFETTI ENGINE
=================================================================== */
let launchConfettiBurst = null;

function initConfettiCanvas() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const colors = ['#ff4081', '#ff79b0', '#ffd700', '#00e5ff', '#ffffff', '#ff9a9e'];

  function addBurst(originX, originY, count = 70) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 10 - 5,
        life: 1,
        decay: Math.random() * 0.015 + 0.01,
        isHeart: Math.random() > 0.6
      });
    }
  }

  launchConfettiBurst = addBurst;

  function renderConfetti() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.vx *= 0.98;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;

      if (p.isHeart) {
        // Heart particle
        const s = p.size / 2;
        ctx.beginPath();
        ctx.moveTo(0, s);
        ctx.bezierCurveTo(-s, -s / 2, -s * 2, s / 3, 0, s * 2);
        ctx.bezierCurveTo(s * 2, s / 3, s, -s / 2, 0, s);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }

      ctx.restore();
    }

    requestAnimationFrame(renderConfetti);
  }

  renderConfetti();
}

/* ===================================================================
   4. CURSOR SPARKLING TRAIL
=================================================================== */
function initCursorTrail() {
  const follower = document.getElementById('cursor-follower');
  if (!follower) return;

  document.addEventListener('mousemove', e => {
    follower.style.left = `${e.clientX}px`;
    follower.style.top = `${e.clientY}px`;

    // Occasional fairy sparkle
    if (Math.random() > 0.85) {
      createSparkle(e.clientX, e.clientY);
    }
  });

  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = ['✨', '🌸', '💖'][Math.floor(Math.random() * 3)];
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${x + (Math.random() * 20 - 10)}px`;
    sparkle.style.top = `${y + (Math.random() * 20 - 10)}px`;
    sparkle.style.fontSize = `${Math.random() * 14 + 10}px`;
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.transition = 'all 0.8s ease-out';
    sparkle.style.opacity = '1';
    sparkle.style.transform = 'translateY(0) scale(1)';

    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.style.opacity = '0';
      sparkle.style.transform = 'translateY(-25px) scale(0.4)';
    }, 20);

    setTimeout(() => sparkle.remove(), 850);
  }
}

/* ===================================================================
   5. UNBOXING / INTRO EXPERIENCE
=================================================================== */
function initUnwrapping() {
  const unwrapBtn = document.getElementById('unwrap-btn');
  const giftBox = document.getElementById('gift-box-trigger');
  const introOverlay = document.getElementById('intro-overlay');
  const mainContent = document.getElementById('main-content');

  function openGift() {
    // Sound chime & music start
    if (window.triggerMusicStart) {
      window.triggerMusicStart();
    }

    // Burst confetti from center
    if (launchConfettiBurst) {
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 120);
      setTimeout(() => {
        launchConfettiBurst(window.innerWidth * 0.3, window.innerHeight * 0.4, 60);
        launchConfettiBurst(window.innerWidth * 0.7, window.innerHeight * 0.4, 60);
      }, 300);
    }

    introOverlay.classList.add('fade-out');
    setTimeout(() => {
      introOverlay.style.display = 'none';
      mainContent.classList.remove('hidden-initially');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 750);
  }

  if (unwrapBtn) unwrapBtn.addEventListener('click', openGift);
  if (giftBox) giftBox.addEventListener('click', openGift);
}

/* ===================================================================
   6. TYPEWRITER EFFECT
=================================================================== */
function initTypewriter() {
  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;

  const phrases = [
    "From classroom benches in Class 10 to this very day...",
    "Some people make the whole world brighter just by smiling.",
    "A special coded surprise engineered with genuine care.",
    "Wishing you the happiest, most magical birthday, Anshu ✨",
    "May every star in the sky guide you to joy and success."
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeStep() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      textEl.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      textEl.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 30 : 65;

    if (!isDeleting && charIdx === currentPhrase.length) {
      speed = 2200; // Pause at end of line
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 500;
    }

    setTimeout(typeStep, speed);
  }

  typeStep();
}

/* ===================================================================
   7. BIRTHDAY COUNTDOWN / CELEBRATION TIMER
=================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  const bannerEl = document.getElementById('bday-today-banner');
  const timerBoxes = document.getElementById('timer-boxes');
  const countdownTitle = document.getElementById('countdown-title');

  function updateTimer() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Birthday is October 22nd (Month is 9 in JS 0-indexed)
    let target = new Date(currentYear, 9, 22, 0, 0, 0);

    // If today is October 22nd
    if (now.getMonth() === 9 && now.getDate() === 22) {
      if (timerBoxes) timerBoxes.classList.add('hidden');
      if (countdownTitle) countdownTitle.textContent = "🎉 IT'S YOUR BIRTHDAY TODAY! 🎉";
      if (bannerEl) bannerEl.classList.remove('hidden');
      return;
    }

    // If October 22nd already passed this year, point to next year
    if (now > target) {
      target = new Date(currentYear + 1, 9, 22, 0, 0, 0);
    }

    const diff = target - now;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ===================================================================
   8. DEVELOPER IDE CODE RUNNER
=================================================================== */
function initDeveloperTerminal() {
  const runBtn = document.getElementById('run-code-btn');
  const outputBox = document.getElementById('ide-output');

  if (!runBtn || !outputBox) return;

  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.innerHTML = '<span>⚙️ Compiling with Love...</span>';

    setTimeout(() => {
      outputBox.classList.remove('hidden');
      runBtn.innerHTML = '<span>✓ Wishes Compiled & Executed! 💖</span>';

      const rect = runBtn.getBoundingClientRect();
      if (launchConfettiBurst) {
        launchConfettiBurst(rect.left + rect.width / 2, rect.top, 80);
      }
    }, 700);
  });
}

/* ===================================================================
   9. INTERACTIVE CAKE & CANDLE
=================================================================== */
function initCakeCandle() {
  const candle = document.getElementById('birthday-candle');
  const flame = document.getElementById('candle-flame');
  const smoke = document.getElementById('candle-smoke');
  const hint = document.getElementById('cake-instruction');
  const toast = document.getElementById('wish-congrats');

  let isBlown = false;

  if (!candle || !flame) return;

  candle.addEventListener('click', () => {
    if (isBlown) return;
    isBlown = true;

    // Extinguish flame
    flame.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    flame.style.opacity = '0';
    flame.style.transform = 'translateX(-50%) scale(0)';

    // Show smoke
    if (smoke) smoke.classList.remove('hidden');

    if (hint) {
      hint.textContent = '✨ Wish Made & Flame Blown! ✨';
      hint.style.color = '#a8ff78';
    }

    if (toast) toast.classList.remove('hidden');

    // Confetti fireworks
    const rect = candle.getBoundingClientRect();
    if (launchConfettiBurst) {
      launchConfettiBurst(rect.left, rect.top, 100);
      setTimeout(() => {
        launchConfettiBurst(window.innerWidth * 0.3, window.innerHeight * 0.5, 60);
        launchConfettiBurst(window.innerWidth * 0.7, window.innerHeight * 0.5, 60);
      }, 250);
    }
  });
}

/* ===================================================================
   10. WAX SEALED SECRET LETTER
=================================================================== */
function initWaxEnvelope() {
  const waxSeal = document.getElementById('wax-seal-btn');
  const letter = document.getElementById('letter-content');

  if (!waxSeal || !letter) return;

  waxSeal.addEventListener('click', () => {
    waxSeal.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    waxSeal.style.transform = 'scale(1.4) rotate(45deg)';
    waxSeal.style.opacity = '0.3';

    setTimeout(() => {
      waxSeal.style.display = 'none';
    }, 500);

    letter.style.boxShadow = '0 0 35px rgba(255, 101, 132, 0.7)';
    const rect = waxSeal.getBoundingClientRect();
    if (launchConfettiBurst) {
      launchConfettiBurst(rect.left, rect.top, 50);
    }
  });
}

/* ===================================================================
   11. REACTION & MESSAGE PREPARATION
=================================================================== */
function initReactions() {
  const reactionBtns = document.querySelectorAll('.reaction-btn');
  const replyDialog = document.getElementById('reply-dialog');
  const replyPreview = document.getElementById('reply-preview');
  const whatsappShare = document.getElementById('whatsapp-share');
  const copyBtn = document.getElementById('copy-reaction-btn');

  reactionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-reaction');
      const fullMsg = `Hey Satyam! I just explored the birthday website you created for me... ${text} Thank you for making my birthday so special! ✨`;

      if (replyPreview) replyPreview.textContent = `"${text}"`;
      if (replyDialog) replyDialog.classList.remove('hidden');

      // WhatsApp URL
      const encoded = encodeURIComponent(fullMsg);
      if (whatsappShare) {
        whatsappShare.href = `https://api.whatsapp.com/send?text=${encoded}`;
      }

      const rect = btn.getBoundingClientRect();
      if (launchConfettiBurst) {
        launchConfettiBurst(rect.left + rect.width / 2, rect.top, 60);
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = replyPreview.textContent;
      navigator.clipboard.writeText(`Hey Satyam! ${text} Thank you for the wonderful birthday website!`);
      copyBtn.textContent = 'Copied to Clipboard! ✓';
      setTimeout(() => (copyBtn.textContent = 'Copy Text'), 2000);
    });
  }
}

/* ===================================================================
   12. PHOTO CUSTOMIZER (LOCAL STORAGE & INSTANT UPDATE)
=================================================================== */
function initPhotoCustomizer() {
  const openBtn = document.getElementById('photo-manager-btn');
  const modal = document.getElementById('photo-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const saveBtn = document.getElementById('save-modal-btn');
  const resetBtn = document.getElementById('reset-photos-btn');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }
  if (saveBtn && modal) {
    saveBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  // Load saved photos on startup
  loadSavedPhotos();

  // Handle file uploads
  bindUpload('upload-dp', 'anshu-dp', 'saved_anshu_dp');
  bindUpload('upload-p1', 'gallery-img-1', 'saved_photo_1');
  bindUpload('upload-p2', 'gallery-img-2', 'saved_photo_2');
  bindUpload('upload-p3', 'gallery-img-3', 'saved_photo_3');
  bindUpload('upload-p4', 'gallery-img-4', 'saved_photo_4');
  bindUpload('upload-p5', 'gallery-img-5', 'saved_photo_5');
  bindUpload('upload-p6', 'gallery-img-6', 'saved_photo_6');

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all photos to default aesthetic artworks?')) {
        localStorage.clear();
        location.reload();
      }
    });
  }
}

function bindUpload(inputId, imgId, storageKey) {
  const input = document.getElementById(inputId);
  const targetImg = document.getElementById(imgId);
  if (!input || !targetImg) return;

  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      targetImg.src = dataUrl;

      if (inputId === 'upload-dp') {
        const introAvatar = document.querySelector('.intro-avatar-circle');
        const clipImg = document.querySelector('.clip-img');
        if (introAvatar) introAvatar.src = dataUrl;
        if (clipImg) clipImg.src = dataUrl;
      }

      try {
        localStorage.setItem(storageKey, dataUrl);
      } catch (err) {
        console.warn('Storage limit reached, displaying in session.');
      }
    };
    reader.readAsDataURL(file);
  });
}

function loadSavedPhotos() {
  const mappings = [
    { key: 'saved_anshu_dp', id: 'anshu-dp' },
    { key: 'saved_photo_1', id: 'gallery-img-1' },
    { key: 'saved_photo_2', id: 'gallery-img-2' },
    { key: 'saved_photo_3', id: 'gallery-img-3' },
    { key: 'saved_photo_4', id: 'gallery-img-4' }
  ];

  mappings.forEach(item => {
    const saved = localStorage.getItem(item.key);
    if (saved) {
      const img = document.getElementById(item.id);
      if (img) img.src = saved;

      if (item.key === 'saved_anshu_dp') {
        const introAvatar = document.querySelector('.intro-avatar-circle');
        const clipImg = document.querySelector('.clip-img');
        if (introAvatar) introAvatar.src = saved;
        if (clipImg) clipImg.src = saved;
      }
    }
  });
}

/* ===================================================================
   13. LIGHTBOX ZOOM MODAL
=================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');

  if (!lightbox) return;

  const polaroids = document.querySelectorAll('.polaroid-item');
  polaroids.forEach(p => {
    p.addEventListener('click', () => {
      const img = p.querySelector('.polaroid-img');
      const title = p.querySelector('.caption-title');
      if (img && lbImg) {
        lbImg.src = img.src;
        lbCaption.textContent = title ? title.textContent : '';
        lightbox.classList.remove('hidden');
      }
    });
  });

  if (lbClose) {
    lbClose.addEventListener('click', () => lightbox.classList.add('hidden'));
  }
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.add('hidden');
  });
}

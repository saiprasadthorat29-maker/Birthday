const $ = s => document.querySelector(s);
const rand = (a, b) => a + Math.random() * (b - a);

/* ---------- Floating sky: petals, hearts, stars ---------- */
(function sky() {
  const sky = $('#sky');
  const add = (cls, txt, life) => {
    const s = document.createElement('span');
    s.className = cls;
    if (txt) s.textContent = txt;
    s.style.left = rand(0, 100) + '%';
    s.style.setProperty('--dx', rand(-120, 120) + 'px');
    s.style.animationDuration = life + 's'; 
    s.style.animationDelay = -rand(0, life) + 's';
    if (cls === 'star') { s.style.top = rand(0, 100) + '%'; }
    sky.appendChild(s);
  };
  const small = innerWidth < 600;
  for (let i = 0; i < (small ? 14 : 24); i++) add('petal', '', rand(9, 16));
  for (let i = 0; i < (small ? 7 : 12); i++) add('heartf', ['❤', '💗', '💖'][i % 3], rand(10, 18));
  for (let i = 0; i < (small ? 30 : 55); i++) add('star', '', rand(2, 5));
})();

/* ---------- Soft music (generated, no file needed) ---------- */
const Music = (() => {
  let ctx, master, playing = false, timer, step = 0;
  // "Happy Birthday" in C major, slow and gentle: [semitones from C4, beats]
  const tune = [[7,.75],[7,.25],[9,1],[7,1],[12,1],[11,2],
    [7,.75],[7,.25],[9,1],[7,1],[14,1],[12,2],
    [7,.75],[7,.25],[19,1],[16,1],[12,1],[11,1],[9,2],
    [17,.75],[17,.25],[16,1],[12,1],[14,1],[12,3]];
  const beat = 0.8;
  const hz = n => 261.63 * Math.pow(2, n / 12);
  function note(n, t, dur) {
    [1, 2].forEach((m, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = i ? 'sine' : 'triangle';
      o.frequency.value = hz(n) * m;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(i ? .035 : .09, t + .04);
      g.gain.exponentialRampToValueAtTime(.0001, t + dur * beat + .9);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + dur * beat + 1);
    });
  }
  function pad(root, t, len) {
    [0, 4, 7].forEach(k => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = hz(root + k - 12);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(.03, t + 1);
      g.gain.linearRampToValueAtTime(0, t + len);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + len);
    });
  }
  function schedule() {
    let t = ctx.currentTime + .1;
    pad(0, t, 8 * beat); pad(5, t + 8 * beat, 8 * beat); pad(0, t + 16 * beat, 8 * beat);
    tune.forEach(([n, d]) => { note(n, t, d); t += d * beat; });
    timer = setTimeout(() => playing && schedule(), (t - ctx.currentTime + 2.5) * 1000);
  }
  function setUI() { $('#musicBtn span').textContent = playing ? 'ON' : 'OFF'; }
  return {
    start() {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.gain.value = .9;
        const delay = ctx.createDelay(); delay.delayTime.value = .32;
        const fb = ctx.createGain(); fb.gain.value = .35;
        delay.connect(fb); fb.connect(delay);
        master.connect(ctx.destination); master.connect(delay); delay.connect(ctx.destination);
      }
      ctx.resume(); playing = true; schedule(); setUI();
    },
    stop() { playing = false; clearTimeout(timer); if (ctx) ctx.suspend(); setUI(); },
    toggle() { playing ? this.stop() : this.start(); }
  };
})();
$('#musicBtn').addEventListener('click', () => Music.toggle());

/* ---------- Open the surprise ---------- */
$('#openBtn').addEventListener('click', () => {
  Music.start();
  $('#welcome').classList.add('out');
  $('#site').hidden = false;
  $('#musicBtn').hidden = false;
  document.documentElement.classList.remove('locked');
  window.scrollTo(0, 0);
  setTimeout(() => { $('#welcome').hidden = true; }, 1300);
  watch();
});

/* ---------- Gallery: hide placeholder if image loads ---------- */
document.querySelectorAll('figure img').forEach(img => {
  const ok = () => img.parentElement.classList.add('has');
  const bad = () => img.remove();
  img.onload = ok; img.onerror = bad;
  if (img.complete) img.naturalWidth ? ok() : bad();
});

/* ---------- Typewriter letter ---------- */
const letterText = [
  'प्रिय गायत्री मॅम ❤️',
  'तुम्हाला वाढदिवसाच्या मनःपूर्वक शुभेच्छा! 🎂💐',
  'मॅम, आयुष्यात अनेक शिक्षक भेटतात, पण काही शिक्षक असे असतात जे फक्त शिकवत नाहीत, तर आपल्या आयुष्याला योग्य दिशा देतात. तुम्ही माझ्यासाठी त्यापैकीच एक आहात.',
  'माझ्या दहावीच्या बोर्ड परीक्षेच्या काळात तुम्ही मला दिलेली साथ, केलेले मार्गदर्शन आणि माझ्यावर दाखवलेला विश्वास मी कधीच विसरू शकणार नाही.',
  'आज मी माझी दहावीची परीक्षा उत्तीर्ण झालो आहे, पण त्या यशामागे तुमची मेहनत, तुमचा वेळ आणि तुमचे आशीर्वाद यांचाही खूप मोठा वाटा आहे.',
  'कधी तुम्ही शिक्षक म्हणून समजावले, कधी आईसारखी काळजी घेतली, तर कधी माझ्यात आत्मविश्वास निर्माण केला.',
  'मॅम, तुमचे उपकार शब्दांत व्यक्त करणे खरंच शक्य नाही. माझ्या यशामध्ये तुमचा एक अनमोल वाटा आहे आणि त्याबद्दल मी तुमचा मनापासून आभारी आहे.',
  '"काही माणसं आपल्या आयुष्यात येतात आणि आपलं भविष्य सुंदर बनवून जातात. माझ्यासाठी तुम्ही त्या खास व्यक्तींपैकी एक आहात." ❤️',
  'देवाकडे एवढीच प्रार्थना आहे की तुमच्या आयुष्यात नेहमी आनंद, समाधान, उत्तम आरोग्य आणि भरपूर यश असू दे.',
  'तुमच्या चेहऱ्यावरील हसू कधीही कमी होऊ नये.',
  'वाढदिवसाच्या खूप खूप शुभेच्छा, गायत्री मॅम! ❤️🎂',
  'तुमचा एक कृतज्ञ विद्यार्थी! 🙏'
];
let typed = false, skip = false;
async function typeLetter() {
  if (typed) return; typed = true;
  const box = $('#letter'), cur = '<span class="cursor"></span>';
  const seg = window.Intl && Intl.Segmenter ? new Intl.Segmenter('mr', { granularity: 'grapheme' }) : null;
  let out = '';
  for (const para of letterText) {
    const chars = seg ? Array.from(seg.segment(para), s => s.segment) : Array.from(para);
    for (const ch of chars) {
      if (skip) break;
      out += ch; box.innerHTML = out + cur;
      await new Promise(r => setTimeout(r, 38));
    }
    out = skip ? letterText.join('\n\n') : out + '\n\n';
    box.innerHTML = out + (skip ? '' : cur);
    if (skip) break;
    await new Promise(r => setTimeout(r, 350));
  }
  box.innerHTML = out.trim();
  $('#skipType').hidden = true;
}
$('#skipType').addEventListener('click', () => { skip = true; typeLetter(); });

/* ---------- Reveal on scroll ---------- */
function watch() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    if (e.target.id === 'letterSec') typeLetter();
    if (e.target.id === 'finalSec') $('#finalText').classList.add('go');
    if (e.target.classList.contains('card') || e.target.classList.contains('say')) e.target.classList.add('show');
    io.unobserve(e.target);
  }), { threshold: .35 });
  ['#letterSec', '#finalSec'].forEach(s => io.observe($(s)));
  document.querySelectorAll('.say').forEach(c => io.observe(c));
  document.querySelectorAll('.card').forEach((c, i) => { c.style.transitionDelay = i * .15 + 's'; io.observe(c); });
}

/* final message: split into words for staggered glow */
(() => {
  const el = $('#finalText');
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) =>
    `<span style="transition-delay:${i * .18}s">${w}</span>`).join(' ');
})();

/* ---------- Cake & confetti ---------- */
function confetti() {
  const colors = ['#e8c26a', '#f4a6c3', '#b389d6', '#fff', '#ff7aa8'];
  for (let i = 0; i < 110; i++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = rand(0, 100) + 'vw';
    c.style.width = rand(6, 11) + 'px'; c.style.height = rand(8, 16) + 'px';
    c.style.background = colors[i % colors.length];
    c.style.borderRadius = i % 3 ? '2px' : '50%';
    c.style.setProperty('--dx', rand(-150, 150) + 'px');
    c.style.setProperty('--r', rand(360, 1080) + 'deg');
    c.style.animationDuration = rand(2.8, 5.5) + 's';
    c.style.animationDelay = rand(0, 1.2) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 8000);
  }
}
$('#wishBtn').addEventListener('click', () => {
  $('#cake').classList.add('out');
  $('#wishMsg').hidden = false;
  $('#wishBtn').hidden = true;
  confetti();
  setTimeout(confetti, 1400);
});

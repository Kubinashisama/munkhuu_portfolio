// ── Portfolio Script ──

// Globals
let projects    = [];   // data/projects.json     — card/grid өгөгдөл
let caseStudies = {};   // data/case-studies.json — modal дэлгэрэнгүй
let IDS         = [];   // нийт project id-ийн жагсаалт

// ── DOM refs ──
const modal  = document.getElementById('modal');
const mHero  = document.getElementById('modal-hero');
const mCat   = document.getElementById('modal-cat');
const mTitle = document.getElementById('modal-title');
const mMeta  = document.getElementById('modal-meta');
const mBody  = document.getElementById('modal-body-content');
const mPrev  = document.getElementById('modal-prev');
const mNext  = document.getElementById('modal-next');
let curIdx = 0;

// ── Card үүсгэх ──
function buildCard(p) {
  const layoutClass = p.layout !== 'normal' ? ` ${p.layout}` : '';
  const imgPos = p.imgPos && p.imgPos !== 'center' ? ` style="object-position:${p.imgPos}"` : '';
  const tagsHTML = p.tags.map(t => `<span class="c-tag">${t}</span>`).join('');

  return `
    <div class="card${layoutClass} fi" data-c="${p.category}" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}" class="cimg"${imgPos}>
      <div class="ov">
        <div class="c-cat">${p.cat}</div>
        <div class="c-name">${p.name}</div>
        <div class="c-desc">${p.desc}</div>
        <div class="c-tags">${tagsHTML}</div>
      </div>
    </div>`;
}

function renderCards() {
  const pgrid = document.getElementById('pgrid');
  const cgrid = document.getElementById('cgrid');

  projects.forEach(p => {
    const html = buildCard(p);
    if (p.group === 'personal') pgrid.insertAdjacentHTML('beforeend', html);
    else                        cgrid.insertAdjacentHTML('beforeend', html);
  });

  // Card дээр event listener нэмэх
  document.querySelectorAll('.card[data-id]').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });

  // 3D tilt effect
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 5;
      const y = ((e.clientY - r.top)  / r.height - .5) * 5;
      card.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // IntersectionObserver — card-уудад .fi animation ажиллуулах
  document.querySelectorAll('.card.fi').forEach(el => io.observe(el));
}

// ── Modal functions ──
function openModal(id) {
  curIdx = IDS.indexOf(id);
  if (curIdx < 0) return;
  renderModal(curIdx);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.scrollTop = 0;
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  const v = mHero.querySelector('video');
  if (v) v.pause();
}

function renderModal(idx) {
  const p  = projects.find(x => x.id === IDS[idx]);
  const cs = caseStudies[IDS[idx]];
  if (!p || !cs) return;

  // Hero media — cs-аас авна (heroImg, heroVideo, heroHeight, heroGrad)
  let heroHTML = '';
  if (cs.heroVideo) {
    const isYT = /youtube\.com|youtu\.be/.test(cs.heroVideo);
    const isFB = /facebook\.com|fb\.watch/.test(cs.heroVideo);

    if (isYT) {
      const ytId = cs.heroVideo.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1] || '';
      heroHTML = `
        <a href="${cs.heroVideo}" target="_blank" rel="noopener"
           style="display:block;position:relative;padding-bottom:56.25%;height:0;overflow:hidden;cursor:pointer">
          <img src="https://img.youtube.com/vi/${ytId}/maxresdefault.jpg"
               style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                      background:rgba(0,0,0,.3);transition:background .2s">
            <svg width="68" height="48" viewBox="0 0 68 48">
              <path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.8 0 34 0 34 0S12.2 0 7.5 1.7a8.5 8.5 0 0 0-6 6C0 12.4 0 24 0 24s0 11.6 1.5 16.3a8.5 8.5 0 0 0 6 6C12.2 48 34 48 34 48s21.8 0 26.5-1.7a8.5 8.5 0 0 0 6-6C68 35.6 68 24 68 24s0-11.6-1.5-16.3z" fill="red"/>
              <path d="M27 34l18-10-18-10v20z" fill="white"/>
            </svg>
          </div>
        </a>`;
      mHero.style.height = 'auto';

    } else if (isFB) {
      heroHTML = `
        <a href="${cs.heroVideo}" target="_blank" rel="noopener"
           style="display:block;position:relative;height:100%;overflow:hidden;cursor:pointer">
          <img src="${cs.heroImg}"
               style="width:100%;height:100%;object-fit:cover">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                      background:rgba(0,0,0,.4)">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
          </div>
        </a>`;
      mHero.style.height = cs.heroHeight || '480px';

      
  // Video оруулах хэсэг (YouTube биш — mp4, cloudinary гэх мэт)/
    } else {
      heroHTML = `<video src="${cs.heroVideo}" autoplay muted loop playsinline
        style="
        width:100%;
        height:100%;
        object-fit:cover;
        display:block"></video>`;
      mHero.style.height = cs.heroHeight || '480px';
    }

  // Зураг оруулах хэсэг //
  } else {
    mHero.style.width = cs.heroWidth || '100%';
    mHero.style.height = cs.heroHeight || '480px';
    heroHTML = `<img src="${cs.heroImg}" alt="${p.name}"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
      style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block">
      <div class="modal-hero-ph ${cs.heroGrad}"
      style="display:none;position:absolute;inset:0;align-items:center;justify-content:center">
      <span style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.15)">${p.name}</span></div>`;
  }
  mHero.innerHTML = heroHTML;

  // Header
  mCat.textContent   = p.cat;
  mTitle.textContent = p.name;
  mMeta.innerHTML    = p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');

  // Body
  let html = `<div class="modal-section"><h3>Тоймлол</h3><p>${cs.overview.replace(/\n/g, '<br>')}</p></div>`;

  if (cs.gallery && cs.gallery.length) {
    html += `<div class="modal-gallery cols-${cs.cols}">`;
    cs.gallery.forEach(img => {
      const r   = img.ratio || '4/3';
      const pos = img.pos   || 'center';
      const fit = img.fit   || 'cover';
      // contain үед aspect-ratio хязгаарлахгүй — зураг өөрийн хэмжээгээрээ харагдана
      const wrapStyle = fit === 'contain'
        ? `position:relative;overflow:hidden;background:transparent`
        : `position:relative;overflow:hidden;background:var(--bg);aspect-ratio:${r}`;
      const imgStyle = fit === 'contain'
        ? `width:100%;height:auto;display:block`
        : `width:100%;height:100%;object-fit:${fit};object-position:${pos}`;
      html += `<div style="${wrapStyle}">
        <img src="${img.src}" alt="${img.ph || ''}" class="modal-img"
          style="${imgStyle}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="modal-img-ph g-vfx" style="display:none;aspect-ratio:${r}">
          <span>${img.ph || ''}</span></div></div>`;
    });
    html += '</div>';
  }

 if (cs.process) {
  html += `<div class="modal-section"><h3>Үйл явц</h3><p>${cs.process.replace(/\n/g, '<br>')}</p></div>`;
}
  if (cs.note) html += `<div style="padding:16px;border:0.5px dashed rgba(201,169,110,.3);border-radius:4px;font-size:12px;color:var(--text-dim);margin-bottom:28px">${cs.note}</div>`;

  mBody.innerHTML = html;
  mPrev.disabled  = idx === 0;
  mNext.disabled  = idx === IDS.length - 1;
  modal.scrollTop = 0;

  // Gallery зургуудад lightbox нэмэх
  const galleryImgs = Array.from(mBody.querySelectorAll('.modal-img'));
  galleryImgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(galleryImgs, i));
  });
}

// ── Lightbox ──
function openLightbox(imgs, startIdx) {
  let cur = startIdx;

  const lb = document.createElement('div');
  lb.id = 'lightbox';

  const btnStyle = `background:rgba(255,255,255,.08);border:0.5px solid rgba(255,255,255,.15);
    color:rgba(255,255,255,.7);cursor:pointer;border-radius:50%;
    width:44px;height:44px;display:flex;align-items:center;justify-content:center;
    font-size:20px;transition:background .2s,color .2s;flex-shrink:0`;

  lb.innerHTML = `
    <div id="lb-inner" style="position:fixed;inset:0;z-index:1000;
      background:rgba(0,0,0,.93);backdrop-filter:blur(16px);
      display:flex;flex-direction:column;">

      <!-- Topbar: × зүүн талд -->
      <div style="display:flex;align-items:center;padding:16px 24px;gap:12px;flex-shrink:0">
        <button id="lb-close" style="${btnStyle}">×</button>
        <span id="lb-counter" style="font-size:11px;letter-spacing:.1em;color:rgba(255,255,255,.35)"></span>
      </div>

      <!-- Зураг + сумнууд -->
      <div style="flex:1;display:flex;align-items:center;justify-content:center;gap:16px;padding:0 24px 24px;min-height:0">
        <button id="lb-prev" style="${btnStyle}">‹</button>
        <img id="lb-img" style="max-width:calc(100vw - 160px);max-height:calc(100vh - 120px);
          object-fit:contain;border-radius:4px;box-shadow:0 0 60px rgba(0,0,0,.6);
          animation:lbIn .18s ease">
        <button id="lb-next" style="${btnStyle}">›</button>
      </div>
    </div>`;

  document.body.appendChild(lb);

  function update() {
    const img = document.getElementById('lb-img');
    img.src = imgs[cur].src;
    img.alt = imgs[cur].alt;
    img.style.animation = 'none';
    requestAnimationFrame(() => { img.style.animation = 'lbIn .18s ease'; });
    document.getElementById('lb-counter').textContent = `${cur + 1} / ${imgs.length}`;
    document.getElementById('lb-prev').style.opacity = cur === 0 ? '.2' : '1';
    document.getElementById('lb-next').style.opacity = cur === imgs.length - 1 ? '.2' : '1';
  }

  update();

  document.getElementById('lb-close').addEventListener('click', () => lb.remove());
  document.getElementById('lb-prev').addEventListener('click', () => { if (cur > 0) { cur--; update(); } });
  document.getElementById('lb-next').addEventListener('click', () => { if (cur < imgs.length - 1) { cur++; update(); } });

  // Гадна дарахад хаах
  document.getElementById('lb-inner').addEventListener('click', e => {
    if (e.target === document.getElementById('lb-inner')) lb.remove();
  });

  // Keyboard
  const onKey = e => {
    if (e.key === 'Escape')      { lb.remove(); document.removeEventListener('keydown', onKey); }
    if (e.key === 'ArrowLeft')   { if (cur > 0) { cur--; update(); } }
    if (e.key === 'ArrowRight')  { if (cur < imgs.length - 1) { cur++; update(); } }
  };
  document.addEventListener('keydown', onKey);
  lb.addEventListener('remove', () => document.removeEventListener('keydown', onKey));
}

// Lightbox animation
if (!document.getElementById('lb-style')) {
  const s = document.createElement('style');
  s.id = 'lb-style';
  s.textContent = `@keyframes lbIn { from { opacity:0; transform:scale(.97) } to { opacity:1; transform:scale(1) } }
  #lb-close:hover, #lb-prev:hover, #lb-next:hover { background:rgba(255, 255, 255, 0)!important; color:#fff!important; }`;
  document.head.appendChild(s);
}

// ── Modal event listeners ──
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
mPrev.addEventListener('click', () => { if (curIdx > 0) renderModal(--curIdx); });
mNext.addEventListener('click', () => { if (curIdx < IDS.length - 1) renderModal(++curIdx); });

// ── Filter buttons ──
document.querySelectorAll('.fbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.f;
    document.querySelectorAll('#pgrid .card, #cgrid .card').forEach(c => {
      c.classList.toggle('hide', f !== 'all' && c.dataset.c !== f);
    });
  });
});

// ── IntersectionObserver — scroll animations ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('on');
    e.target.querySelectorAll('.sk-fill').forEach(b => {
      setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 250);
    });
    io.unobserve(e.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fi').forEach(el => io.observe(el));

// ── Nav scroll highlight ──
const secs   = document.querySelectorAll('section[id]');
const nLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  nLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--text)' : ''; });
}, { passive: true });

// ── Data ачаалах ──
Promise.all([
  fetch('data/projects.json').then(r => r.json()),
  fetch('data/case-studies.json').then(r => r.json())
]).then(([proj, cs]) => {
  projects    = proj;
  caseStudies = cs;
  IDS         = projects.map(p => p.id);
  renderCards();
}).catch(err => console.error('Data ачаалахад алдаа:', err));
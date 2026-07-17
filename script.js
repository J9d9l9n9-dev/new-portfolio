/* Main interactive behaviors for the portfolio
   - Mobile navigation toggle
   - Smooth in-page scrolling for anchor links
   - IntersectionObserver powered scroll reveal animations
   - Contact form validation and lightweight submission flow
   - Dynamic project rendering (fallback safe)
*/

'use strict';

// Utilities
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

document.addEventListener('DOMContentLoaded', () => {
  // Small initialization
  setCurrentYear();
  initNavToggle();
  initAnchorSmoothScroll();
  initScrollReveal();
  initContactForm();
  loadProjects();
  initScrollProgress();
  initActiveNav();
  initHideOnScroll();
  // ensure hero stats are updated as early as possible so counters animate correctly
  updateHeroStats();
  initHeroCounters();
  loadExperience();
  loadDeveloperDashboard();
  loadCertifications();
  loadAchievements();
  loadSkills();
  initAvatarUpload();
});

// Contact helper actions (copy email/url, loading & success animation)
function initContactHelpers(){
  const copyEmail = document.getElementById('copy-email');
  const copyUrl = document.getElementById('copy-url');
  if(copyEmail){
    copyEmail.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText('jampadurgalakshminarayana@gmail.com'); copyEmail.textContent = 'Copied ✓'; setTimeout(()=> copyEmail.textContent = 'Copy Email', 1800); } catch(e){ copyEmail.textContent = 'Copy failed'; setTimeout(()=> copyEmail.textContent = 'Copy Email',1800); }
    });
  }
  if(copyUrl){
    copyUrl.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(window.location.href); copyUrl.textContent = 'Copied ✓'; setTimeout(()=> copyUrl.textContent = 'Copy Portfolio URL', 1800); } catch(e){ copyUrl.textContent = 'Copy failed'; setTimeout(()=> copyUrl.textContent = 'Copy Portfolio URL',1800); }
    });
  }
}

// ----------------
// Skills (interactive categories)
// ----------------
function loadSkills(){
  const el = document.getElementById('skills-grid');
  if(!el) return;
  fetch('data/skills.json', {cache:'no-store'})
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => renderSkills(el, data))
    .catch(() => { el.innerHTML = '<p class="muted">Unable to load skills.</p>'; });
}

function renderSkills(container, data){
  container.innerHTML = '';
  if(!Array.isArray(data) || !data.length) return;
  const frag = document.createDocumentFragment();
  data.forEach(group => {
    const card = document.createElement('div'); card.className = 'skill-card'; card.tabIndex = 0; card.setAttribute('role', 'button'); card.setAttribute('aria-expanded', 'false');
    const h = document.createElement('h4'); h.textContent = group.category;
    const list = document.createElement('div'); list.className = 'skill-list-inner';
    (group.items||[]).forEach(it => {
      const row = document.createElement('div'); row.className = 'skill-item';
      const name = document.createElement('div'); name.textContent = it.name;
      const level = document.createElement('div'); level.className = 'level'; level.textContent = it.level;
      row.appendChild(name); row.appendChild(level); list.appendChild(row);
    });
    card.appendChild(h); card.appendChild(list);
    // collapse/expand on click or Enter
    const toggleCard = () => { const isOpen = card.classList.toggle('open'); card.setAttribute('aria-expanded', String(isOpen)); };
    card.addEventListener('click', toggleCard);
    card.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(); } });
    // small hover & focus affordance for polish
    card.addEventListener('mouseenter', () => card.classList.add('hover'));
    card.addEventListener('mouseleave', () => card.classList.remove('hover'));
    frag.appendChild(card);
  });
  container.appendChild(frag);
}

// ----------------
// Developer Dashboard (placeholders, data-driven)
// ----------------
function loadDeveloperDashboard(){
  const gEl = document.getElementById('github-profile');
  const cEl = document.getElementById('coding-profiles');
  if(gEl){
    fetch('data/github-placeholder.json', {cache:'no-store'})
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(json => renderGithubPlaceholder(gEl, json))
      .catch(() => { gEl.innerHTML = '<p class="muted">Unable to load GitHub data.</p>'; });
  }
  if(cEl){
    fetch('data/coding-profiles.json', {cache:'no-store'})
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(json => renderCodingProfiles(cEl, json))
      .catch(() => { cEl.innerHTML = '<p class="muted">Unable to load coding profiles.</p>'; });
  }
}

function renderGithubPlaceholder(container, data){
  if(!data || !data.profile) return; const p = data.profile;
  container.innerHTML = '';
  const name = document.createElement('div'); name.className = 'gh-name'; name.innerHTML = `<strong>${escapeHtml(p.name||p.username)}</strong> <span class="muted">@${escapeHtml(p.username)}</span>`;
  const bio = document.createElement('div'); bio.className = 'muted gh-bio'; bio.textContent = data.profile.bio || '';
  const stats = document.createElement('div'); stats.className = 'gh-stats'; stats.innerHTML = `<span>Repos: <strong>${p.repos}</strong></span> <span>Followers: <strong>${p.followers}</strong></span> <span>Stars: <strong>${p.stars}</strong></span>`;
  const profileLink = document.createElement('a');
  profileLink.href = `https://github.com/${encodeURIComponent(p.username)}`;
  profileLink.target = '_blank';
  profileLink.rel = 'noopener noreferrer';
  profileLink.textContent = 'View GitHub Profile';
  const pinned = document.createElement('div'); pinned.className = 'gh-pinned';
  if(Array.isArray(data.pinned) && data.pinned.length){
    const ul = document.createElement('ul'); ul.className = 'gh-list'; data.pinned.forEach(r => { const li = document.createElement('li'); li.innerHTML = `<a href="${escapeAttr(r.repo)}" target="_blank" rel="noopener noreferrer"><strong>${escapeHtml(r.name)}</strong></a> — <span class="muted">${escapeHtml(r.desc||'')}</span>`; ul.appendChild(li); }); pinned.appendChild(ul);
  }
  container.appendChild(name); container.appendChild(bio); container.appendChild(stats); container.appendChild(profileLink); container.appendChild(pinned);
}

function renderCodingProfiles(container, data){
  container.innerHTML = '';
  if(!data || !Array.isArray(data.profiles)) return;
  const grid = document.createElement('div'); grid.className = 'profiles-grid';
  data.profiles.forEach(p => {
    const c = document.createElement('div'); c.className = 'profile-card'; c.innerHTML = `<a href="${escapeAttr(p.url)}" target="_blank" rel="noopener noreferrer"><strong>${escapeHtml(p.site)}</strong></a><div class="muted small">Problems: ${escapeHtml(String(p.problems||0))}</div>`;
    grid.appendChild(c);
  });
  container.appendChild(grid);
}

// ----------------
// Certifications & Achievements
// ----------------
function loadCertifications(){
  const el = document.getElementById('cert-list');
  if(!el) return;
  fetch('data/certifications.json', {cache:'no-store'})
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => { renderCertifications(el, data); updateHeroStats(); })
    .catch(() => { el.innerHTML = '<p class="muted">Unable to load certifications.</p>'; updateHeroStats(); });
}

function renderCertifications(container, items){
  container.innerHTML = '';
  if(!Array.isArray(items) || !items.length){ container.innerHTML = '<p class="muted">No certifications found.</p>'; return; }
  const frag = document.createDocumentFragment();
  items.forEach(c => {
    const card = document.createElement('div'); card.className = 'cert-card';
    const imgWrap = document.createElement('div');
    if(c.image){ const img = document.createElement('img'); img.src = c.image; img.alt = c.title + ' certificate'; img.loading = 'lazy'; img.style.maxWidth = '120px'; img.style.borderRadius = '6px'; imgWrap.appendChild(img); }
    const inner = document.createElement('div'); inner.innerHTML = `<strong>${escapeHtml(c.title)}</strong><div class="muted small">${escapeHtml(c.issuer)} • ${escapeHtml(c.date)}</div><p>${escapeHtml((c.skills||[]).join(', '))}</p>`;
    if(imgWrap.children.length) { card.appendChild(imgWrap); }
    card.appendChild(inner);
    frag.appendChild(card);
  });
  container.appendChild(frag);
}

function loadAchievements(){
  const el = document.getElementById('ach-list');
  if(!el) return;
  fetch('data/achievements.json', {cache:'no-store'})
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => renderAchievements(el, data))
    .catch(() => { el.innerHTML = '<p class="muted">Unable to load achievements.</p>'; });
}

function renderAchievements(container, items){
  container.innerHTML = '';
  if(!Array.isArray(items) || !items.length){ container.innerHTML = '<p class="muted">No achievements found.</p>'; return; }
  const frag = document.createDocumentFragment();
  items.forEach(a => {
    const card = document.createElement('div'); card.className = 'ach-card';
    if(a.image){ const img = document.createElement('img'); img.src = a.image; img.alt = a.title + ' image'; img.loading = 'lazy'; img.style.maxWidth = '120px'; img.style.borderRadius = '6px'; card.appendChild(img); }
    card.innerHTML += `<strong>${escapeHtml(a.title)}</strong><div class="muted small">${escapeHtml(a.type || 'Achievement')} • ${escapeHtml(a.date)}</div><p>${escapeHtml(a.detail || '')}</p>`;
    frag.appendChild(card);
  });
  container.appendChild(frag);
}


function setCurrentYear(){
  const yearEl = $('#current-year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
}

// NAV TOGGLE (mobile)
function initNavToggle(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');
  if(!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  // Close nav when clicking a link (mobile)
  nav.addEventListener('click', (e) => {
    if(e.target.tagName.toLowerCase() === 'a'){
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Smooth scroll for internal anchors with preference for reduced motion
function initAnchorSmoothScroll(){
  if (!('scrollBehavior' in document.documentElement.style)) return; // older browsers
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced) return;

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if(!anchor) return;
    const href = anchor.getAttribute('href');
    if(!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if(!target) return;

    e.preventDefault();
    target.scrollIntoView({behavior: 'smooth', block: 'start'});
    history.pushState(null, '', href);
  }, {passive:false});
}

// IntersectionObserver reveal animation
function initScrollReveal(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  const targets = $$('.hero, .about, .projects, .skills, .contact, .project-card');
  targets.forEach(t => { t.classList.add('reveal-init'); observer.observe(t); });
}

// Contact form handling and validation
function initContactForm(){
  const form = $('#contact-form');
  if(!form) return;

  const name = $('#name');
  const email = $('#email');
  const message = $('#message');
  const status = $('#form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const errors = validateFields({name: name.value, email: email.value, message: message.value});
    if(Object.keys(errors).length){
      showErrors(errors);
      status.textContent = 'Please fix errors and try again.';
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${name.value.trim()}`);
    const body = encodeURIComponent(`Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\n${message.value.trim()}`);
    status.textContent = 'Opening your email application...';
    window.location.href = `mailto:jampadurgalakshminarayana@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
    return;
  });

  // Live validation on blur for better UX
  [name, email, message].forEach(input => {
    input.addEventListener('blur', () => {
      const errors = validateFields({name: name.value, email: email.value, message: message.value});
      showErrors(errors);
    });
  });

  form.addEventListener('reset', () => { clearErrors(); status.textContent = ''; });
}

function validateFields(values = {}){
  const errors = {};
  if(!values.name || values.name.trim().length < 2) errors.name = 'Please enter your name (2+ characters).';
  if(!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Please enter a valid email.';
  if(!values.message || values.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';
  return errors;
}

function showErrors(errors){
  clearErrors();
  if(errors.name){ $('#name-error').textContent = errors.name; }
  if(errors.email){ $('#email-error').textContent = errors.email; }
  if(errors.message){ $('#message-error').textContent = errors.message; }
}
function clearErrors(){ ['#name-error','#email-error','#message-error'].forEach(sel => { const el = $(sel); if(el) el.textContent = ''; }); }

// (Duplicate fakeSubmit removed — consolidated at top of script.js)

// Dynamic projects rendering (improved)
function loadProjects(){
  const container = $('#projects-grid');
  const search = $('#project-search');
  const filters = Array.from(document.querySelectorAll('.filter-btn'));
  const empty = $('#projects-empty');
  if(!container) return;

  fetch('data/projects.json', {cache: 'no-store'})
    .then(resp => { if(!resp.ok) throw new Error('No projects data'); return resp.json(); })
    .then(data => {
      // store projects in-memory for filtering/search
      window.__projects = Array.isArray(data) ? data : [];
      renderProjects(container, window.__projects);

      // update hero stats after projects load
      updateHeroStats();

      // attach search
      if(search){
        search.addEventListener('input', () => applyProjectFilters(container, empty));
      }

      // attach filters
      if(filters.length && !document.querySelector('.filter-btn.active')){
        filters[0].classList.add('active');
        filters[0].setAttribute('aria-pressed','true');
      }
      filters.forEach(b => b.addEventListener('click', (e) => {
        filters.forEach(x => { x.classList.remove('active'); x.setAttribute('aria-pressed','false'); });
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('aria-pressed','true');
        applyProjectFilters(container, empty);
      }));
    })
    .catch(() => {
      window.__projects = [];
      renderProjects(container, []);
      if(empty) empty.hidden = false;
      updateHeroStats();
    });
}

function applyProjectFilters(container, emptyEl){
  const q = ($('#project-search') && $('#project-search').value || '').trim().toLowerCase();
  const active = document.querySelector('.filter-btn.active');
  const tag = active ? active.dataset.filter : 'all';
  const items = (window.__projects || []).filter(p => {
    // filter by tag
    if(tag && tag !== 'all'){
      if(!(p.tags && p.tags.indexOf(tag) !== -1)) return false;
    }
    // search by title, tech, tags
    if(q){
      const hay = (p.title + ' ' + (p.summary||'') + ' ' + (p.tech||[]).join(' ') + ' ' + (p.tags||[]).join(' ')).toLowerCase();
      return hay.indexOf(q) !== -1;
    }
    return true;
  });
  renderProjects(container, items);
  if(emptyEl) emptyEl.hidden = items.length > 0;
}

function renderProjects(container, projects = []){
  container.innerHTML = '';
  if(!projects.length){
    return;
  }

  const frag = document.createDocumentFragment();
  projects.forEach(p => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('role','listitem');
    card.tabIndex = -1;

    const thumb = document.createElement('img');
    thumb.className = 'project-thumb';
    thumb.alt = p.title + ' thumbnail';
    thumb.src = p.image || 'assets/projects/placeholder.jpg';
    thumb.loading = 'lazy';
    thumb.addEventListener('error', () => {
      if (!thumb.src.endsWith('/assets/projects/placeholder.jpg')) {
        thumb.src = 'assets/projects/placeholder.jpg';
      }
    }, { once: true });

    const body = document.createElement('div'); body.className = 'project-body';

    const meta = document.createElement('div'); meta.className = 'project-meta';
    const title = document.createElement('h3'); title.className = 'project-title';
    // ensure unique id for aria-labelledby
    const titleId = (p.id || p.title.replace(/\s+/g,'-').toLowerCase()) + '-title';
    title.id = titleId;
    title.textContent = p.title;
    const status = document.createElement('div'); status.className = 'project-status muted'; status.textContent = p.status || '';
    meta.appendChild(title); meta.appendChild(status);

    const desc = document.createElement('p'); desc.className = 'project-desc'; desc.textContent = p.summary || '';

    const techWrap = document.createElement('div'); techWrap.className = 'project-tech';
    (p.tech||[]).forEach(t => { const tb = document.createElement('span'); tb.className = 'tech-badge'; tb.textContent = t; techWrap.appendChild(tb); });

    const actions = document.createElement('div'); actions.className = 'project-actions';
    if(p.repo) { const a = document.createElement('a'); a.href = p.repo; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'GitHub'; actions.appendChild(a); }
    if(p.url){ const a2 = document.createElement('a'); a2.href = p.url; a2.target = '_blank'; a2.rel = 'noopener'; a2.textContent = 'Live Demo'; actions.appendChild(a2); }

    // featured badge
    if(p.featured){ const f = document.createElement('div'); f.className = 'project-badge'; f.textContent = 'Featured'; card.style.position = 'relative'; card.appendChild(f); }

    body.appendChild(meta); body.appendChild(desc); body.appendChild(techWrap); body.appendChild(actions);
    card.appendChild(thumb); card.appendChild(body);
    card.setAttribute('aria-labelledby', titleId);

    frag.appendChild(card);
  });
  container.appendChild(frag);
}

// ----------------
// Experience timeline (data-driven)
// ----------------
function loadExperience(){
  const container = document.getElementById('timeline');
  if(!container) return;
  fetch('data/experience.json', {cache: 'no-store'})
    .then(r => { if(!r.ok) throw new Error('no data'); return r.json(); })
    .then(data => renderExperience(container, data))
    .catch(err => { console.error(err); container.innerHTML = '<div class="project-empty"><h3>No experience data</h3><p>Add data/experience.json to populate this section.</p></div>' });
}

function renderExperience(container, items){
  container.innerHTML = '';
  if(!Array.isArray(items) || !items.length) return;
  const frag = document.createDocumentFragment();
  items.forEach(it => {
    const item = document.createElement('article'); item.className = 'timeline-item'; item.tabIndex = 0;
    item.setAttribute('aria-labelledby', it.id + '-title');

    const icon = document.createElement('div'); icon.className = 'timeline-icon'; icon.setAttribute('aria-hidden', 'true');
    // support both emoji/text icons and image SVG paths
    if(it.icon && (typeof it.icon === 'string') && it.icon.indexOf('assets/') === 0){
      const img = document.createElement('img'); img.src = it.icon; img.alt = it.title + ' icon'; img.width = 48; img.height = 48; img.loading = 'lazy'; icon.appendChild(img);
    } else {
      icon.textContent = it.icon || '•';
    }
    const body = document.createElement('div'); body.className = 'timeline-body';

    const h = document.createElement('h3'); h.id = it.id + '-title'; h.textContent = it.title;
    const org = document.createElement('div'); org.className = 'timeline-meta'; org.innerHTML = `<strong>${escapeHtml(it.organization || '')}</strong> · <span>${escapeHtml(it.date || '')}</span>`;
    if(it.location) org.innerHTML += ` · <span>${escapeHtml(it.location)}</span>`;

    const desc = document.createElement('p'); desc.textContent = it.description || '';
    const tags = document.createElement('div'); tags.className = 'timeline-tags'; (it.tech||[]).forEach(t => { const s = document.createElement('span'); s.className = 'tech-badge'; s.textContent = t; tags.appendChild(s); });

    const status = document.createElement('div'); status.className = 'timeline-status ' + (it.status || ''); status.textContent = it.status || '';

    body.appendChild(h); body.appendChild(org); body.appendChild(desc); body.appendChild(tags);
    item.appendChild(icon); item.appendChild(body); item.appendChild(status);

    frag.appendChild(item);
  });
  container.appendChild(frag);

  // intersection observer for reveal and animation
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('reveal'); o.unobserve(e.target); }
    });
  }, {threshold:0.15});
  container.querySelectorAll('.timeline-item').forEach(n => obs.observe(n));

  // keyboard navigation (arrow up/down between timeline items)
  container.addEventListener('keydown', (e) => {
    const focused = document.activeElement;
    if(!focused || !focused.classList.contains('timeline-item')) return;
    if(e.key === 'ArrowDown'){
      e.preventDefault(); const next = focused.nextElementSibling; if(next) next.focus();
    } else if(e.key === 'ArrowUp'){
      e.preventDefault(); const prev = focused.previousElementSibling; if(prev) prev.focus();
    }
  });
}

// Simple HTML escaping utilities for dynamic insertion
function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/[&<>"']/g, (s) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
function escapeAttr(str){
  if(!str) return '';
  return String(str).replace(/"/g, '&quot;');
}

/* Optional: enhance keyboard and focus states for project cards */

// ----------------
// Hero stats: compute counts from project/cert data
// ----------------
function updateHeroStats(){
  // projects count from in-memory projects if available
  const projectCount = (window.__projects || []).length || 0;
  // certifications count from data file
  fetch('data/certifications.json', {cache:'no-store'})
    .then(r => r.ok ? r.json() : Promise.resolve([]))
    .then(certs => {
      const certCount = Array.isArray(certs) ? certs.length : 0;
      const problems = 0; // placeholder: later derive from coding profiles

      const projectsEl = document.querySelector('.hero-stats .num[data-key="projects"]');
      const certsEl = document.querySelector('.hero-stats .num[data-key="certifications"]');
      const probsEl = document.querySelector('.hero-stats .num[data-key="problems"]');

      if(projectsEl){ projectsEl.dataset.count = projectCount; projectsEl.textContent = projectCount; }
      if(certsEl){ certsEl.dataset.count = certCount; certsEl.textContent = certCount; }
      if(probsEl){ probsEl.dataset.count = problems; probsEl.textContent = problems; }
    })
    .catch(() => {});
}


document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape'){
    const nav = document.getElementById('primary-navigation');
    if(nav && nav.classList.contains('open')){
      nav.classList.remove('open');
      const toggle = document.querySelector('.nav-toggle');
      if(toggle) toggle.setAttribute('aria-expanded','false');
    }
  }
});

/* CSS class hooks applied by JS for reveal animation
   .reveal-init { opacity:0; transform: translateY(12px); transition: opacity var(--transition), transform var(--transition);
   .reveal { opacity:1; transform: none; }
*/

// Reveal styles (unchanged)
(function addRevealStyles(){
  const style = document.createElement('style');
  style.textContent = `
    .reveal-init{opacity:0; transform:translateY(12px); transition: opacity var(--transition), transform var(--transition)}
    .reveal{opacity:1; transform:none}
  `;
  document.head.appendChild(style);
})();

// Scroll progress indicator
function initScrollProgress(){
  const bar = document.querySelector('#scroll-progress .progress-bar');
  if(!bar) return;
  const update = () => {
    const pos = window.scrollY || window.pageYOffset;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? Math.min(100, Math.round((pos / h) * 100)) : 0;
    bar.style.width = pct + '%';
  };
  update();
  window.addEventListener('scroll', update, {passive:true});
}

// Highlight active nav link based on scroll
function initActiveNav(){
  const links = Array.from(document.querySelectorAll('.nav-list a'));
  if(!links.length) return;
  const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  function onScroll(){
    const y = window.scrollY + (window.innerHeight/6);
    let active = null;
    for(const s of sections){
      const r = s.getBoundingClientRect();
      const top = window.scrollY + r.top;
      if(top <= y) active = s;
    }
    links.forEach(l => l.classList.toggle('active', active && l.getAttribute('href') === ('#' + active.id)));
  }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
}

// Hide navbar on scroll down, show on scroll up
function initHideOnScroll(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  let last = window.scrollY;
  let ticking = false;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if(!ticking){
      window.requestAnimationFrame(() => {
        if(current > last && current > 120){
          header.style.transform = 'translateY(-110%)';
        } else {
          header.style.transform = '';
        }
        last = current;
        ticking = false;
      });
      ticking = true;
    }
  }, {passive:true});
}

// Hero counters (animate numbers)
function initHeroCounters(){
  const nums = document.querySelectorAll('.hero-stats .num');
  if(!nums.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target; const target = Number(el.dataset.count || 0);
        let start = 0; const duration = 900; const step = Math.max(1, Math.floor(target / (duration/30)));
        const t = setInterval(() => {
          start += step; if(start >= target){ el.textContent = target; clearInterval(t); } else el.textContent = start;
        }, 30);
        obs.unobserve(el);
      }
    });
  }, {threshold: 0.4});
  nums.forEach(n => observer.observe(n));
}

// ----------------
// Profile Avatar Upload & Crop (re-enabled from ui.js reference)
// ----------------
function initAvatarUpload() {
  const STORAGE_KEY = 'ui_system_user_v1';
  
  // Elements
  const profileAvatar = document.getElementById('profile-avatar');
  const heroAvatar = document.getElementById('hero-avatar');
  const uploadBtn = document.getElementById('avatar-upload-btn');
  const fileInput = document.getElementById('avatar-file-input');
  const modal = document.getElementById('avatar-modal');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  
  const cropFrame = document.getElementById('avatar-crop-frame');
  const cropImage = document.getElementById('avatar-crop-image');
  const zoomInput = document.getElementById('avatar-zoom');
  const rotateInput = document.getElementById('avatar-rotate');
  const saveBtn = document.getElementById('avatar-save');
  const cancelBtn = document.getElementById('avatar-cancel');
  const statusEl = document.getElementById('avatar-status');

  if (!profileAvatar || !heroAvatar || !uploadBtn || !fileInput || !modal) return;

  // Crop Math State
  let imgNatural = { width: 0, height: 0 };
  let baseScale = 1;
  let scale = 1;
  let rotateDeg = 0;
  let offset = { x: 0, y: 0 };
  let dragging = false;
  let dragStart = { x: 0, y: 0, ox: 0, oy: 0 };
  let currentImage = null;

  // Load avatar initially
  hydrateAvatar();

  // Attach button triggers
  uploadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', onFileSelected);

  // Close handlers
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  
  // Crop area pointer drag handlers
  if (cropFrame) {
    cropFrame.addEventListener('pointerdown', startDrag);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointermove', onDrag);
  }

  // Zoom / Rotate slider inputs
  if (zoomInput) {
    zoomInput.addEventListener('input', (e) => {
      scale = Number(e.target.value);
      updateTransform();
    });
  }
  if (rotateInput) {
    rotateInput.addEventListener('input', (e) => {
      rotateDeg = Number(e.target.value);
      updateTransform();
    });
  }

  // Save crop
  if (saveBtn) saveBtn.addEventListener('click', saveCrop);

  // Modal open/close logic
  function showModal() {
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    const focusable = modal.querySelector('button, input, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    if (fileInput) fileInput.value = '';
  }

  function onFileSelected(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('Image is too large (max 8MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      openCropEditor(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function openCropEditor(dataUrl) {
    showModal();
    if (statusEl) statusEl.textContent = '';
    
    const img = new Image();
    img.onload = () => {
      currentImage = img;
      imgNatural.width = img.naturalWidth;
      imgNatural.height = img.naturalHeight;
      setupCropBaseState();
      
      if (cropImage) {
        cropImage.src = img.src;
      }
      
      // Reset sliders
      if (zoomInput) zoomInput.value = 1;
      scale = 1;
      if (rotateInput) rotateInput.value = 0;
      rotateDeg = 0;
      updateTransform();
    };
    img.src = dataUrl;
  }

  function setupCropBaseState() {
    const frameRect = cropFrame.getBoundingClientRect();
    baseScale = Math.max(frameRect.width / imgNatural.width, frameRect.height / imgNatural.height);
    const dispW = imgNatural.width * baseScale;
    const dispH = imgNatural.height * baseScale;
    offset.x = (frameRect.width - dispW) / 2;
    offset.y = (frameRect.height - dispH) / 2;
  }

  function updateTransform() {
    if (!currentImage || !cropImage) return;
    const effScale = baseScale * scale;
    cropImage.style.transform = `translate(${offset.x}px, ${offset.y}px) scale(${effScale}) rotate(${rotateDeg}deg)`;
  }

  function startDrag(e) {
    e.preventDefault();
    cropFrame.setPointerCapture(e.pointerId);
    dragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    dragStart.ox = offset.x;
    dragStart.oy = offset.y;
  }

  function onDrag(e) {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    offset.x = dragStart.ox + dx;
    offset.y = dragStart.oy + dy;
    constrainOffset();
    updateTransform();
  }

  function endDrag() {
    dragging = false;
  }

  function constrainOffset() {
    const frameRect = cropFrame.getBoundingClientRect();
    const effScale = baseScale * scale;
    const dispW = imgNatural.width * effScale;
    const dispH = imgNatural.height * effScale;
    
    if (dispW <= frameRect.width) {
      offset.x = (frameRect.width - dispW) / 2;
    } else {
      if (offset.x > 0) offset.x = 0;
      if (offset.x < frameRect.width - dispW) offset.x = frameRect.width - dispW;
    }
    
    if (dispH <= frameRect.height) {
      offset.y = (frameRect.height - dispH) / 2;
    } else {
      if (offset.y > 0) offset.y = 0;
      if (offset.y < frameRect.height - dispH) offset.y = frameRect.height - dispH;
    }
  }

  async function saveCrop() {
    if (!currentImage) return;
    if (statusEl) statusEl.textContent = 'Saving...';
    if (saveBtn) saveBtn.disabled = true;

    try {
      const croppedUrl = await generateCroppedUrl(512);
      
      // Save user profile avatar to localStorage
      const userRaw = localStorage.getItem(STORAGE_KEY);
      const userObj = userRaw ? JSON.parse(userRaw) : {};
      userObj.avatar = croppedUrl;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
      
      // Apply to UI
      profileAvatar.src = croppedUrl;
      heroAvatar.src = croppedUrl;
      
      // Remove fallbacks
      profileAvatar.classList.remove('fallback');
      heroAvatar.classList.remove('fallback');
      
      if (statusEl) statusEl.textContent = 'Saved!';
      setTimeout(() => {
        closeModal();
      }, 600);
    } catch (err) {
      console.error(err);
      if (statusEl) statusEl.textContent = 'Error cropping image';
    } finally {
      if (saveBtn) saveBtn.disabled = false;
    }
  }

  function generateCroppedUrl(outputSize = 512) {
    return new Promise((resolve, reject) => {
      try {
        const frameRect = cropFrame.getBoundingClientRect();
        const effScale = baseScale * scale;
        const sx = Math.max(0, (-offset.x) / effScale);
        const sy = Math.max(0, (-offset.y) / effScale);
        const sWidth = Math.min(imgNatural.width - sx, frameRect.width / effScale);
        const sHeight = Math.min(imgNatural.height - sy, frameRect.height / effScale);

        const canvas = document.createElement('canvas');
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext('2d');

        if (rotateDeg % 360 !== 0) {
          const off = document.createElement('canvas');
          off.width = sWidth;
          off.height = sHeight;
          const offCtx = off.getContext('2d');
          offCtx.drawImage(currentImage, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
          
          ctx.save();
          ctx.translate(outputSize / 2, outputSize / 2);
          ctx.rotate((rotateDeg * Math.PI) / 180);
          const scaleFactor = Math.min(outputSize / sWidth, outputSize / sHeight);
          ctx.drawImage(off, -sWidth * scaleFactor / 2, -sHeight * scaleFactor / 2, sWidth * scaleFactor, sHeight * scaleFactor);
          ctx.restore();
        } else {
          ctx.drawImage(currentImage, sx, sy, sWidth, sHeight, 0, 0, outputSize, outputSize);
        }

        resolve(canvas.toDataURL('image/jpeg', 0.86));
      } catch (err) {
        reject(err);
      }
    });
  }

  function hydrateAvatar() {
    try {
      const userRaw = localStorage.getItem(STORAGE_KEY);
      const userObj = userRaw ? JSON.parse(userRaw) : null;
      if (userObj && userObj.avatar) {
        profileAvatar.src = userObj.avatar;
        heroAvatar.src = userObj.avatar;
      } else {
        renderFallback();
      }
    } catch (e) {
      console.error(e);
      renderFallback();
    }
  }

  function renderFallback() {
    profileAvatar.src = 'hero.jpg';
    heroAvatar.src = 'hero.jpg';
    profileAvatar.classList.remove('fallback');
    heroAvatar.classList.remove('fallback');
  }
}


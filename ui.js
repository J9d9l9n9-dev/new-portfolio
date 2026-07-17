/* DEPRECATED: ui.js — avatar upload and local UI demo retained for reference only.
   This file is not included in index.html and should not be deployed. Remove before production deployment if desired.
*/

/* Original implementation archived below for reference. */

/* UI System demo: authentication (local), profile persistence, avatar upload+crop, micro-interactions
   - Uses localStorage for persistence in this demo
   - Crop math: image is displayed inside the crop frame using base-fit scale (cover). Drag to pan, zoom and rotate controls available.
*/

'use strict';

// Utilities
const $ = q => document.querySelector(q);
const $$ = q => Array.from(document.querySelectorAll(q));

// App state keys
const STORAGE_KEY = 'ui_system_user_v1';

// Elements
const avatarImg = $('#avatar-img');
const editAvatarBtn = $('#edit-avatar-btn');
const uploadBtn = $('#upload-btn');
const removeAvatarBtn = $('#remove-avatar-btn');
const fileInput = $('#file-input');
const userNameEl = $('#user-name');
const userEmailEl = $('#user-email');
const profileForm = $('#profile-form');
const fullNameInput = $('#full-name');
const emailInput = $('#email-input');
const profileStatus = $('#profile-status');
const activityLog = $('#activity-log');
const yearEl = $('#year');

// Modals and crop
const avatarModal = $('#avatar-modal');
const authModal = $('#auth-modal');
const authBtn = $('#auth-btn');
const openAuth = $('#open-auth');
const authForm = $('#auth-form');
const authName = $('#auth-name');
const authEmail = $('#auth-email');

const cropFrame = $('#crop-frame') || $('#avatar-crop-frame');
const cropImage = $('#crop-image') || $('#avatar-crop-image');
const zoomInput = $('#zoom') || $('#avatar-zoom');
const rotateInput = $('#rotate') || document.getElementById('rotate');
const cropSave = $('#crop-save') || $('#avatar-save');
const cropCancel = $('#crop-cancel') || $('#avatar-cancel');
const cropStatus = $('#crop-status') || $('#avatar-status');

// Crop state
let imgNatural = {width:0, height:0};
let baseScale = 1; // scale to cover container
let scale = 1; // user zoom multiplier
let rotateDeg = 0; // rotation
let offset = {x:0, y:0}; // translate of image relative to container (px)
let dragging = false;
let dragStart = {x:0,y:0, ox:0, oy:0};
let currentImage = null; // HTMLImageElement for crop

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  if(yearEl) yearEl.textContent = new Date().getFullYear();
  bindUI();
  hydrate();
  renderAvatarFallback();
  log('App initialized');
});

function bindUI(){
  if(uploadBtn && fileInput) uploadBtn.addEventListener('click', () => fileInput.click());
  if(fileInput) fileInput.addEventListener('change', onFileSelected);
  if(editAvatarBtn) editAvatarBtn.addEventListener('click', openAvatarModalFromCurrent);
  if(removeAvatarBtn) removeAvatarBtn.addEventListener('click', removeAvatar);

  // Modal close handlers
  $$('.modal-close').forEach(b => b.addEventListener('click', closeModals));
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModals(); });

  // Crop interactions (guarded)
  if(cropFrame){
    cropFrame.addEventListener('pointerdown', startDrag);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointermove', onDrag);
  }

  if(zoomInput) zoomInput.addEventListener('input', (e) => { scale = Number(e.target.value); updateImageTransform(); });
  if(rotateInput) rotateInput.addEventListener('input', (e) => { rotateDeg = Number(e.target.value); updateImageTransform(); });
  if(cropSave) cropSave.addEventListener('click', onSaveCrop);
  if(cropCancel) cropCancel.addEventListener('click', closeModals);

  // Auth
  if(authBtn) authBtn.addEventListener('click', () => showModal(authModal));
  if(openAuth) openAuth.addEventListener('click', () => showModal(authModal));
  if(authForm) authForm.addEventListener('submit', onAuthSubmit);

  // Profile form
  if(profileForm) profileForm.addEventListener('submit', onProfileSubmit);
  const signoutBtn = $('#signout-btn'); if(signoutBtn) signoutBtn.addEventListener('click', signOut);
}

// Persistence
function hydrate(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return;
  try{
    const user = JSON.parse(raw);
    applyUser(user);
    log('Loaded user from storage');
  }catch(e){ console.error(e); }
}

function persist(user){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function applyUser(user){
  if(!user) return;
  const fullNameEl = $('#full-name');
  const emailInputEl = $('#email-input');
  if(fullNameEl) fullNameEl.value = user.name || '';
  if(emailInputEl) emailInputEl.value = user.email || '';
  if(userNameEl) userNameEl.textContent = user.name || 'Guest';
  if(userEmailEl) userEmailEl.textContent = user.email || 'Not signed in';
  if(authBtn) authBtn.textContent = user.name ? 'Account' : 'Sign in';
  if(user.avatar){ if(avatarImg) avatarImg.src = user.avatar; } else { if(avatarImg){ avatarImg.src = ''; renderAvatarFallback(); } }
}

function getUser(){
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function updateUser(updates){
  const user = getUser() || {};
  const merged = {...user, ...updates};
  persist(merged);
  applyUser(merged);
}

function signOut(){
  localStorage.removeItem(STORAGE_KEY);
  applyUser({name:'Guest', email:''});
  if(profileStatus) profileStatus.textContent = 'Signed out';
  log('User signed out');
}

// Auth flow (simulated)
function onAuthSubmit(e){
  e.preventDefault();
  const name = authName ? authName.value.trim() : '';
  const email = authEmail ? authEmail.value.trim() : '';
  clearAuthErrors();
  const authNameErr = $('#auth-name-error');
  const authEmailErr = $('#auth-email-error');
  if(!name || name.length < 2){ if(authNameErr) authNameErr.textContent = 'Enter a valid name'; return; }
  if(!validateEmail(email)){ if(authEmailErr) authEmailErr.textContent = 'Enter a valid email'; return; }
  // Simulate account creation / sign in
  const user = {name, email};
  persist(user);
  applyUser(user);
  closeModals();
  log('User signed in: ' + email);
  const authStatus = $('#auth-status'); if(authStatus) authStatus.textContent = 'Signed in';
}
function clearAuthErrors(){ $('#auth-name-error').textContent=''; $('#auth-email-error').textContent=''; $('#auth-status').textContent=''; }

// Profile form
function onProfileSubmit(e){
  e.preventDefault();
  const name = (fullNameInput && fullNameInput.value) ? fullNameInput.value.trim() : '';
  const email = (emailInput && emailInput.value) ? emailInput.value.trim() : '';
  const fullNameErr = $('#fullName-error'); if(fullNameErr) fullNameErr.textContent = '';
  const emailErr = $('#email-error'); if(emailErr) emailErr.textContent = '';
  if(!name || name.length < 2){ if(fullNameErr) fullNameErr.textContent = 'Please enter your name (2+ chars)'; return; }
  if(!validateEmail(email)){ if(emailErr) emailErr.textContent = 'Please enter a valid email'; return; }
  updateUser({name, email});
  if(profileStatus) profileStatus.textContent = 'Profile saved';
  log('Profile updated');
}

// Avatar upload / crop flow
function onFileSelected(e){
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')){ alert('Please select an image file'); return; }
  // Limit file size to 8MB (client-side safety)
  if(file.size > 8 * 1024 * 1024){ alert('Image too large (max 8MB)'); return; }

  const reader = new FileReader();
  reader.onload = (ev) => {
    openAvatarModal(ev.target.result);
  };
  reader.readAsDataURL(file);
  // reset input for future same-file selection
  if(fileInput) fileInput.value = '';
}

function openAvatarModalFromCurrent(){
  const user = getUser();
  if(user && user.avatar){
    openAvatarModal(user.avatar);
  } else {
    if(fileInput) fileInput.click();
  }
}

function openAvatarModal(dataUrl){
  showModal(avatarModal);
  if(cropStatus) cropStatus.textContent = '';
  // Load image
  const img = new Image();
  img.onload = () => {
    currentImage = img;
    imgNatural.width = img.naturalWidth; imgNatural.height = img.naturalHeight;
    setupCropState();
    if(cropImage) cropImage.src = img.src;
    // initialize controls
    if(zoomInput) { zoomInput.value = 1; }
    scale = 1;
    if(rotateInput) { rotateInput.value = 0; }
    rotateDeg = 0;
    updateImageTransform();
  };
  img.src = dataUrl;
}

function setupCropState(){
  const frameRect = cropFrame.getBoundingClientRect();
  // baseScale to cover container (cover)
  baseScale = Math.max(frameRect.width / imgNatural.width, frameRect.height / imgNatural.height);
  // initial displayed size
  const dispW = imgNatural.width * baseScale;
  const dispH = imgNatural.height * baseScale;
  // center image
  offset.x = (frameRect.width - dispW) / 2;
  offset.y = (frameRect.height - dispH) / 2;
}

function updateImageTransform(){
  if(!currentImage) return;
  const effectiveScale = baseScale * scale;
  cropImage.style.transform = `translate(${offset.x}px, ${offset.y}px) scale(${effectiveScale}) rotate(${rotateDeg}deg)`;
}

function startDrag(e){
  e.preventDefault();
  cropFrame.setPointerCapture(e.pointerId);
  dragging = true;
  dragStart.x = e.clientX; dragStart.y = e.clientY; dragStart.ox = offset.x; dragStart.oy = offset.y;
}
function onDrag(e){
  if(!dragging) return;
  const dx = e.clientX - dragStart.x; const dy = e.clientY - dragStart.y;
  offset.x = dragStart.ox + dx; offset.y = dragStart.oy + dy;
  constrainOffset();
  updateImageTransform();
}
function endDrag(e){
  if(!dragging) return;
  dragging = false;
}

function constrainOffset(){
  const frameRect = cropFrame.getBoundingClientRect();
  const effScale = baseScale * scale;
  const dispW = imgNatural.width * effScale;
  const dispH = imgNatural.height * effScale;
  // Constrain so image always covers frame
  const minX = Math.min(0, frameRect.width - dispW);
  const maxX = Math.max(0, frameRect.width - dispW); // usually <=0
  const minY = Math.min(0, frameRect.height - dispH);
  const maxY = Math.max(0, frameRect.height - dispH);
  if(dispW <= frameRect.width){
    // image narrower than frame -> center
    offset.x = (frameRect.width - dispW) / 2;
  } else {
    if(offset.x > 0) offset.x = 0;
    if(offset.x < frameRect.width - dispW) offset.x = frameRect.width - dispW;
  }
  if(dispH <= frameRect.height){
    offset.y = (frameRect.height - dispH) / 2;
  } else {
    if(offset.y > 0) offset.y = 0;
    if(offset.y < frameRect.height - dispH) offset.y = frameRect.height - dispH;
  }
}

async function onSaveCrop(){
  if(!currentImage) return;
  if(cropStatus) cropStatus.textContent = 'Saving…';
  if(cropSave) cropSave.disabled = true;
  try{
    const dataUrl = await generateCroppedDataUrl(512); // 512x512 output
    updateUser({avatar: dataUrl});
    if(avatarImg) avatarImg.src = dataUrl;
    if(cropStatus) cropStatus.textContent = 'Saved';
    log('Avatar saved');
    // small visual delay for UX
    setTimeout(() => { closeModals(); }, 600);
  }catch(err){
    console.error(err);
    if(cropStatus) cropStatus.textContent = 'An error occurred';
  }finally{ if(cropSave) cropSave.disabled = false; }
}

function generateCroppedDataUrl(outputSize = 512){
  return new Promise((resolve, reject) => {
    try{
      const frameRect = cropFrame.getBoundingClientRect();
      const effScale = baseScale * scale;
      // portion of natural image that maps to frame
      const sx = Math.max(0, (-offset.x) / effScale);
      const sy = Math.max(0, (-offset.y) / effScale);
      const sWidth = Math.min(imgNatural.width - sx, frameRect.width / effScale);
      const sHeight = Math.min(imgNatural.height - sy, frameRect.height / effScale);

      // Create canvas and draw
      const canvas = document.createElement('canvas');
      canvas.width = outputSize; canvas.height = outputSize;
      const ctx = canvas.getContext('2d');

      // If rotation is used, handle it by translating/rotating ctx
      if(rotateDeg % 360 !== 0){
        // draw rotated by creating an offscreen canvas for the source crop
        const off = document.createElement('canvas');
        off.width = sWidth; off.height = sHeight;
        const offCtx = off.getContext('2d');
        offCtx.drawImage(currentImage, sx, sy, sWidth, sHeight, 0,0, sWidth, sHeight);
        // rotate off onto main canvas
        ctx.save();
        ctx.translate(outputSize/2, outputSize/2);
        ctx.rotate((rotateDeg * Math.PI)/180);
        const scaleFactor = Math.min(outputSize / sWidth, outputSize / sHeight);
        ctx.drawImage(off, -sWidth*scaleFactor/2, -sHeight*scaleFactor/2, sWidth*scaleFactor, sHeight*scaleFactor);
        ctx.restore();
      } else {
        // No rotation: draw direct scaled crop to canvas
        const scaleFactor = Math.min(outputSize / sWidth, outputSize / sHeight);
        ctx.drawImage(currentImage, sx, sy, sWidth, sHeight, 0,0, outputSize, outputSize);
      }

      // Compress the exported image for performance
      const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
      resolve(dataUrl);
    }catch(e){ reject(e); }
  });
}

function removeAvatar(){
  const user = getUser() || {};
  if(!user.avatar){ if(profileStatus) profileStatus.textContent = 'No avatar to remove'; return; }
  delete user.avatar;
  persist(user);
  applyUser(user);
  renderAvatarFallback();
  if(profileStatus) profileStatus.textContent = 'Avatar removed';
  log('Avatar removed');
}

function renderAvatarFallback(){
  const user = getUser();
  const name = (user && user.name) || '';
  const initials = initialsFromName(name) || 'G';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><rect width='100%' height='100%' fill='#072226'/><text x='50%' y='50%' dy='.12em' font-family='${getComputedStyle(document.body).fontFamily}' font-size='96' fill='${'#5eead4'}' text-anchor='middle'>${escapeHtml(initials)}</text></svg>`;
  const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  if(avatarImg) avatarImg.src = dataUrl;
}

// Helpers
function showModal(modal){
  if(!modal) return;
  modal.setAttribute('aria-hidden','false'); modal.style.display='flex'; // small assist
  // set initial focus
  const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if(focusable) focusable.focus();
}
function closeModals(){ [avatarModal, authModal].forEach(m => { if(!m) return; m.setAttribute('aria-hidden','true'); m.style.display='none'; }); }

function onSaveProfileLocally(){ /* placeholder for backend integration */ }

function onAuthSubmitFake(e){ e.preventDefault(); }

function validateEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function initialsFromName(name){ if(!name) return ''; const parts = name.trim().split(/\s+/); if(parts.length === 1) return parts[0].slice(0,2).toUpperCase(); return (parts[0][0]+parts[parts.length-1][0]).toUpperCase(); }

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function log(msg){ if(!activityLog) return; const el = document.createElement('div'); el.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`; activityLog.prepend(el); }

// small helper to open avatar modal when clicking the edit button if no image exists
function openAvatarModalFromButton(){ const user = getUser(); if(user && user.avatar){ openAvatarModal(user.avatar); } else { fileInput.click(); } }

// Attach event for edit button that uses current avatar or upload
if(editAvatarBtn) editAvatarBtn.addEventListener('click', openAvatarModalFromButton);

// small utility used by some older browsers
function safeSet(el, prop, value){ if(el) el[prop] = value; }

// Simple initial render
(function initialRender(){ const user = getUser(); if(user){ applyUser(user); } else { applyUser({name:'Guest', email:''}); } })();

// Basic accessibility: trap focus in modal (lightweight)
document.addEventListener('focusin', (e) => {
  const modal = document.querySelector('.modal[aria-hidden="false"]');
  if(!modal) return;
  if(!modal.contains(e.target)){
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(focusable) focusable.focus();
  }
});

// Minimal inline tests for crop math (not required for production) are omitted intentionally

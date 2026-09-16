// Kodein Landing Page Interactive Engine
document.addEventListener('DOMContentLoaded', () => {
  // Initialize default playground
  if (typeof loadPlaygroundPreset === 'function') {
    loadPlaygroundPreset('card');
  }
});

// 1. Billing Plan Switcher (Monthly vs Yearly with 20% discount)
let currentBillingMode = 'monthly';

function setBillingPlan(mode) {
  currentBillingMode = mode;
  const btnM = document.getElementById('btnBillingMonthly');
  const btnY = document.getElementById('btnBillingYearly');
  const pricePro = document.getElementById('priceProDisplay');
  const periodPro = document.getElementById('periodProDisplay');
  const priceTeam = document.getElementById('priceTeamDisplay');
  const periodTeam = document.getElementById('periodTeamDisplay');

  if (mode === 'yearly') {
    if (btnY) {
      btnY.className = 'px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-cyan-500 text-slate-950 transition-all shadow-md cursor-pointer flex items-center gap-2';
    }
    if (btnM) {
      btnM.className = 'px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-all cursor-pointer';
    }
    if (pricePro) pricePro.textContent = 'Rp 79.000';
    if (periodPro) periodPro.textContent = ' / bulan (ditagih tahunan)';
    if (priceTeam) priceTeam.textContent = 'Rp 299.000';
    if (periodTeam) periodTeam.textContent = ' / bulan (ditagih tahunan)';

    showToast('🎉 Diskon tahunan 20% diterapkan ke semua paket!');
  } else {
    if (btnM) {
      btnM.className = 'px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-cyan-500 text-slate-950 transition-all shadow-md cursor-pointer';
    }
    if (btnY) {
      btnY.className = 'px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-all flex items-center gap-2 cursor-pointer';
    }
    if (pricePro) pricePro.textContent = 'Rp 99.000';
    if (periodPro) periodPro.textContent = ' / bulan';
    if (priceTeam) priceTeam.textContent = 'Rp 375.000';
    if (periodTeam) periodTeam.textContent = ' / bulan';

    showToast('Tagihan bulanan standar aktif.');
  }
}

// 2. Hero Interactive Simulator Presets
const heroPresets = {
  pricing: {
    prompt: '"Bikinkan kartu harga modern untuk produk SaaS dengan toggle diskon tahunan 20% dan tombol aksi."',
    html: `
      <div class="p-6 rounded-2xl bg-gradient-to-b from-[#131828] to-[#0d101c] border border-cyan-500/40 shadow-2xl relative w-full max-w-sm">
        <div class="flex items-center justify-between mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
            Kodein Pro
          </span>
          <span class="text-xs text-emerald-400 font-bold font-mono">Diskon 20% Aktif</span>
        </div>
        <div class="mb-4">
          <div class="text-3xl font-black text-white tracking-tight" id="heroMockPrice">Rp 79.000</div>
          <div class="text-xs text-slate-400" id="heroMockPeriod">per bulan (ditagih tahunan)</div>
        </div>
        <ul class="text-xs text-slate-300 space-y-2 mb-6">
          <li class="flex items-center gap-2"><span class="text-cyan-400">✓</span> Prompt AI Tanpa Batas</li>
          <li class="flex items-center gap-2"><span class="text-cyan-400">✓</span> Live Sandbox Multi-Berkas</li>
          <li class="flex items-center gap-2"><span class="text-cyan-400">✓</span> 1-Klik Push ke GitHub</li>
        </ul>
        <button onclick="handleCtaClick('Pilih Paket Mockup')" class="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-tight transition shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer">
          Pilih Paket Sekarang
        </button>
      </div>`
  },
  profile: {
    prompt: '"Buatkan komponen kartu profil developer interaktif dengan badge status aktif dan tombol koneksi."',
    html: `
      <div class="p-6 rounded-2xl bg-[#0f1322] border border-cyan-500/40 shadow-2xl w-full max-w-sm space-y-4">
        <div class="flex items-center gap-3.5">
          <div class="relative">
            <div class="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center border border-cyan-500/30 text-lg">SA</div>
            <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0f1322] rounded-full animate-pulse"></span>
          </div>
          <div>
            <h4 class="font-bold text-white text-sm">Sakhi Ammar F</h4>
            <p class="text-xs text-cyan-400">Owner & Lead Developer</p>
          </div>
        </div>
        <div class="p-3 bg-[#080b13] rounded-xl border border-slate-800 text-[11px] text-slate-300">
          🚀 Mengembangkan aplikasi AI generasi masa depan bersama Kodein Studio.
        </div>
        <button onclick="handleCtaClick('Koneksi Developer')" class="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90 text-slate-950 font-bold text-xs rounded-xl transition">
          Terhubung di GitHub 🐙
        </button>
      </div>`
  },
  analytics: {
    prompt: '"Tampilkan kartu ringkasan metrik performa AI dan waktu kompilasi sandbox."',
    html: `
      <div class="p-6 rounded-2xl bg-[#0f1322] border border-indigo-500/40 shadow-2xl w-full max-w-sm space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-bold text-indigo-400">PERFORMA ENGINE</span>
          <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Optimal</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 rounded-xl bg-[#080b13] border border-slate-800">
            <span class="text-[10px] text-slate-500 block">Latensi AI</span>
            <span class="text-xl font-black text-cyan-400">42 ms</span>
          </div>
          <div class="p-3 rounded-xl bg-[#080b13] border border-slate-800">
            <span class="text-[10px] text-slate-500 block">Kompilasi</span>
            <span class="text-xl font-black text-emerald-400">0.08 s</span>
          </div>
        </div>
        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <span>Tingkat Keberhasilan</span>
          <span class="font-bold text-white">99.98%</span>
        </div>
      </div>`
  }
};

function setHeroSimulatorPreset(key) {
  const preset = heroPresets[key];
  if (!preset) return;

  const promptEl = document.getElementById('heroPromptText');
  const compEl = document.getElementById('heroInteractiveComponent');

  // Update prompt text
  if (promptEl) promptEl.textContent = preset.prompt;

  // Update tabs active state
  document.querySelectorAll('.hero-tab-btn').forEach(btn => {
    btn.classList.remove('bg-cyan-500/15', 'text-cyan-300', 'border-cyan-500/30', 'active');
    btn.classList.add('bg-[#121624]', 'text-slate-400', 'border-[#1f2639]');
  });

  if (window.event && window.event.currentTarget) {
    const cur = window.event.currentTarget;
    cur.classList.remove('bg-[#121624]', 'text-slate-400', 'border-[#1f2639]');
    cur.classList.add('bg-cyan-500/15', 'text-cyan-300', 'border-cyan-500/30', 'active');
  }

  // Animate render
  if (compEl) {
    compEl.style.opacity = '0.3';
    setTimeout(() => {
      compEl.innerHTML = preset.html;
      compEl.style.opacity = '1';
      showToast('Komponen simulasi berhasil diperbarui!');
    }, 180);
  }
}

// 3. Interactive Playground Demo Presets
const playgroundPresets = {
  card: {
    prompt: 'Bikinkan kartu profil pengembang modern lengkap dengan badge status online dan tombol sapa.',
    code: `<div class="p-5 bg-[#0f1322] border border-cyan-500/30 rounded-2xl flex items-center justify-between gap-4 max-w-sm w-full">
  <div class="flex items-center gap-3">
    <div class="relative">
      <div class="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center">AF</div>
      <span class="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#0f1322] rounded-full"></span>
    </div>
    <div>
      <h4 class="font-bold text-white text-sm">Ahmad Fauzi</h4>
      <p class="text-xs text-cyan-400">Senior AI Engineer</p>
    </div>
  </div>
  <button onclick="handleCtaClick('Sapa Developer')" class="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs">
    Sapa 👋
  </button>
</div>`,
    component: `
      <div class="p-5 bg-[#0f1322] border border-cyan-500/30 rounded-2xl flex items-center justify-between gap-4 max-w-sm w-full shadow-xl">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center">AF</div>
            <span class="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#0f1322] rounded-full animate-pulse"></span>
          </div>
          <div>
            <h4 class="font-bold text-white text-sm">Ahmad Fauzi</h4>
            <p class="text-xs text-cyan-400">Senior AI Engineer</p>
          </div>
        </div>
        <button onclick="handleCtaClick('Sapa Developer')" class="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition active:scale-95 cursor-pointer">
          Sapa 👋
        </button>
      </div>`
  },
  calculator: {
    prompt: 'Buatkan kalkulator perkiraan penghematan waktu coding dengan AI.',
    code: `<div class="p-5 bg-[#0f1322] border border-amber-500/30 rounded-2xl max-w-sm w-full space-y-3">
  <div class="flex items-center justify-between">
    <span class="text-xs font-mono text-slate-400">Efisiensi Tim:</span>
    <span class="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">Teruji</span>
  </div>
  <div class="text-3xl font-black text-amber-300">+340% Lebih Cepat</div>
  <p class="text-xs text-slate-300">Menghemat rata-rata 18 jam pekerjaan repetitif per minggu.</p>
</div>`,
    component: `
      <div class="p-5 bg-[#0f1322] border border-amber-500/30 rounded-2xl max-w-sm w-full space-y-3 shadow-xl">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-slate-400">Efisiensi Tim:</span>
          <span class="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">Teruji</span>
        </div>
        <div class="text-3xl font-black text-amber-300">+340% Lebih Cepat</div>
        <p class="text-xs text-slate-300 leading-relaxed">Menghemat rata-rata 18 jam pekerjaan repetitif per minggu untuk setiap developer.</p>
        <button onclick="handleCtaClick('Kalkulasi Efisiensi')" class="w-full py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs">
          Hitung ROI Tim Anda 📊
        </button>
      </div>`
  },
  cta: {
    prompt: 'Bikinkan banner flash diskon promosi peluncuran dengan efek glowing modern.',
    code: `<div class="p-5 bg-gradient-to-r from-indigo-950/80 to-[#0f1322] border border-indigo-500/40 rounded-2xl max-w-sm w-full">
  <span class="text-[10px] font-mono font-bold text-cyan-400 uppercase">⚡ FLASH LAUNCH</span>
  <h4 class="text-base font-black text-white mt-1">Akses Spesial Pengguna Awal</h4>
  <p class="text-xs text-slate-300 mt-1 mb-3">Dapatkan akses kuota token tanpa batas untuk 100 pendaftar pertama.</p>
  <button class="w-full py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl">Klaim Kuota</button>
</div>`,
    component: `
      <div class="p-5 bg-gradient-to-r from-indigo-950/80 to-[#0f1322] border border-indigo-500/40 rounded-2xl max-w-sm w-full shadow-xl">
        <span class="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">⚡ FLASH LAUNCH</span>
        <h4 class="text-base font-black text-white mt-1">Akses Spesial Pengguna Awal</h4>
        <p class="text-xs text-slate-300 mt-1 mb-3 leading-relaxed">Dapatkan akses kuota token tanpa batas untuk 100 pendaftar pertama hari ini.</p>
        <button onclick="handleCtaClick('Klaim Kuota Promo')" class="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer">
          Klaim Promo Sekarang 🎁
        </button>
      </div>`
  }
};

let currentPresetKey = 'card';

function loadPlaygroundPreset(key) {
  currentPresetKey = key;
  const data = playgroundPresets[key];
  if (!data) return;

  const promptInput = document.getElementById('playgroundPromptInput');
  const codeDisplay = document.getElementById('playgroundCodeDisplay');
  const outputArea = document.getElementById('playgroundOutput');

  if (promptInput) promptInput.value = data.prompt;
  if (codeDisplay) codeDisplay.textContent = data.code;
  if (outputArea) outputArea.innerHTML = data.component;

  // Update button active states
  document.querySelectorAll('.playground-btn').forEach(btn => {
    btn.classList.remove('bg-cyan-500', 'text-slate-950');
    btn.classList.add('bg-[#161c2e]', 'text-slate-300');
  });

  if (window.event && window.event.currentTarget) {
    const cur = window.event.currentTarget;
    cur.classList.remove('bg-[#161c2e]', 'text-slate-300');
    cur.classList.add('bg-cyan-500', 'text-slate-950');
  }
}

function triggerRegenerate() {
  const outputArea = document.getElementById('playgroundOutput');
  const codeDisplay = document.getElementById('playgroundCodeDisplay');
  if (!outputArea || !codeDisplay) return;

  outputArea.innerHTML = `
    <div class="flex flex-col items-center justify-center p-8 text-cyan-400 gap-2">
      <svg class="w-7 h-7 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span class="text-xs text-slate-400 font-mono">Merender variasi AI...</span>
    </div>`;

  setTimeout(() => {
    loadPlaygroundPreset(currentPresetKey);
    showToast('Komponen berhasil dirender ulang!');
  }, 350);
}

function copyGeneratedCode() {
  const codeDisplay = document.getElementById('playgroundCodeDisplay');
  if (!codeDisplay) return;
  navigator.clipboard.writeText(codeDisplay.textContent || '');
  showToast('📋 Kode berhasil disalin ke clipboard!');
}

// 4. Interactive Accordion FAQ
function toggleFaq(index) {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item, idx) => {
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');
    if (!content) return;

    if (idx === index) {
      const isHidden = content.classList.contains('hidden');
      if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      } else {
        content.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180');
      }
    } else {
      content.classList.add('hidden');
      if (icon) icon.classList.remove('rotate-180');
    }
  });
}

// 5. Global Action Feedback / Toast
function handleCtaClick(actionName) {
  showToast(`✨ Aksi "${actionName}" dipilih! Selamat datang di Kodein.`);
}

function showToast(msg) {
  const toast = document.getElementById('liveToast');
  const toastText = document.getElementById('liveToastText');
  if (!toast || !toastText) return;

  toastText.textContent = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3200);
}

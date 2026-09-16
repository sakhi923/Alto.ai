import { ProjectFile } from '../types';

export const INITIAL_FILES: ProjectFile[] = [
  {
    id: 'file-1',
    name: 'index.html',
    path: 'index.html',
    language: 'html',
    isEntry: true,
    updatedAt: new Date().toISOString(),
    content: `<!DOCTYPE html>
<html lang="id" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aplikasi Web Interaktif</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-6 font-sans antialiased">
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header Banner -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur gap-4">
      <div>
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Preview Aktif
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-white">Aplikasi Web Interaktif</h1>
        <p class="text-sm text-slate-400">Dibuat &amp; dikembangkan dengan Hi Alto — Satu Tempat, Semua AI</p>
      </div>
      <div class="flex items-center gap-3">
        <button id="btnAction" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/20 active:scale-95">
          ✨ Jalankan Aksi
        </button>
      </div>
    </header>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Counter Card -->
      <div class="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Fitur Interaktif</span>
          <h2 class="text-lg font-semibold text-white mt-1">Penghitung Skor</h2>
          <p class="text-sm text-slate-400 mt-1">Uji reaktivitas JavaScript dengan tombol berikut.</p>
        </div>
        <div class="my-6 text-center">
          <span id="counterValue" class="text-5xl font-black tracking-tight text-blue-400">0</span>
        </div>
        <div class="flex gap-2">
          <button id="btnDec" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition active:scale-95">-</button>
          <button id="btnInc" class="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition active:scale-95">+</button>
        </div>
      </div>

      <!-- Quick Task Manager -->
      <div class="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-400">Tugas Proyek</span>
            <h2 class="text-lg font-semibold text-white mt-1">Daftar Rencana Coding</h2>
          </div>
          <span id="taskCount" class="text-xs px-2.5 py-1 bg-indigo-500/10 text-indigo-300 rounded-full border border-indigo-500/20">3 Tugas</span>
        </div>
        
        <div class="flex gap-2 mb-4">
          <input id="taskInput" type="text" placeholder="Tambah tugas baru..." class="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200">
          <button id="btnAddTask" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition active:scale-95">Tambah</button>
        </div>

        <ul id="taskList" class="space-y-2 flex-1 overflow-y-auto max-h-48 pr-1">
          <li class="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-sm">
            <span class="text-slate-300">Alto AI Engine Terkoneksi</span>
            <span class="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Selesai</span>
          </li>
          <li class="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-sm">
            <span class="text-slate-300">User Terdaftar: sakhiammarf@gmail.com</span>
            <span class="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Aktif</span>
          </li>
          <li class="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-sm">
            <span class="text-slate-300">Live preview &amp; Alto AI chat sync</span>
            <span class="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Berjalan</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Status Toast Notification -->
    <div id="toastMessage" class="hidden p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm text-center">
      Operasi berhasil dijalankan!
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>`
  },
  {
    id: 'file-2',
    name: 'style.css',
    path: 'style.css',
    language: 'css',
    updatedAt: new Date().toISOString(),
    content: `/* Custom Styling & Resilient CSS Fallback */
:root {
  color-scheme: dark;
}

body {
  margin: 0;
  padding: 1.5rem;
  background-color: #020617;
  color: #f8fafc;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  transition: background-color 0.3s ease;
}

button {
  cursor: pointer;
  font-family: inherit;
}

input {
  font-family: inherit;
}

/* Custom subtle scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.6);
}
::-webkit-scrollbar-thumb {
  background: rgba(51, 65, 85, 0.8);
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}`
  },
  {
    id: 'file-3',
    name: 'app.js',
    path: 'app.js',
    language: 'javascript',
    updatedAt: new Date().toISOString(),
    content: `// Logic Interaktif Gemini Studio App
(function() {
  let count = 0;
  const counterEl = document.getElementById('counterValue');
  const btnInc = document.getElementById('btnInc');
  const btnDec = document.getElementById('btnDec');
  const btnAction = document.getElementById('btnAction');
  const taskInput = document.getElementById('taskInput');
  const btnAddTask = document.getElementById('btnAddTask');
  const taskList = document.getElementById('taskList');
  const taskCount = document.getElementById('taskCount');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(msg) {
    if (!toastMessage) return;
    toastMessage.textContent = msg;
    toastMessage.classList.remove('hidden');
    setTimeout(() => {
      if (toastMessage) toastMessage.classList.add('hidden');
    }, 3000);
  }

  if (btnInc && counterEl) {
    btnInc.addEventListener('click', () => {
      count++;
      counterEl.textContent = count;
    });
  }

  if (btnDec && counterEl) {
    btnDec.addEventListener('click', () => {
      if (count > 0) count--;
      counterEl.textContent = count;
    });
  }

  if (btnAction) {
    btnAction.addEventListener('click', () => {
      showToast('✨ Gemini Code Studio: Live Preview berjalan dengan mulus!');
      console.log('[Studio]: Tombol aksi berhasil diklik pada ' + new Date().toLocaleTimeString());
    });
  }

  function updateTaskBadge() {
    if (!taskList) return;
    const items = taskList.querySelectorAll('li').length;
    if (taskCount) taskCount.textContent = items + ' Tugas';
  }

  if (btnAddTask && taskInput && taskList) {
    btnAddTask.addEventListener('click', () => {
      const text = taskInput.value.trim();
      if (!text) return;

      const li = document.createElement('li');
      li.className = 'flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 text-sm animate-fade-in';
      li.innerHTML = \`
        <span class="text-slate-300">\${text}</span>
        <button class="text-xs text-rose-400 hover:text-rose-300 delete-btn px-2 py-0.5">Hapus</button>
      \`;

      const deleteBtn = li.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          li.remove();
          updateTaskBadge();
          showToast('Tugas dihapus');
        });
      }

      taskList.appendChild(li);
      taskInput.value = '';
      updateTaskBadge();
      showToast('Tugas baru berhasil ditambahkan');
      console.log('[Studio]: Tugas baru ditambahkan: ' + text);
    });

    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnAddTask.click();
    });
  }

  console.log('[Studio]: Aplikasi Web Interaktif siap dijalankan!');
})();`
  },
  {
    id: 'file-4',
    name: 'README.md',
    path: 'README.md',
    language: 'markdown',
    updatedAt: new Date().toISOString(),
    content: `# Gemini Code Studio

Selamat datang di lingkungan coding AI terintegrasi!

## Status Registrasi Database
- **Pengguna Terdaftar**: sakhiammarf@gmail.com
- **Role**: Owner / Lead Developer
- **Status Database**: Terhubung & Aktif (Operasional)
- **Mesin AI**: Gemini 3.8 Flash

## Fitur Utama:
1. **Live Preview**: Jalankan kode HTML/CSS/JS secara instan dengan sandbox iframe.
2. **File Explorer**: Tambah, ubah, unggah, dan hapus berkas proyek.
3. **AI Coding Assistant**: Perintahkan AI untuk menambahkan fitur, merapikan kode, atau membuat halaman baru.
4. **Database Sinkron**: Semua perubahan tersimpan secara persisten ke database server.
`
  }
];

export const TEMPLATES = [
  {
    id: 'default',
    title: 'Aplikasi Interaktif',
    description: 'Dashboard interaktif dengan penghitung skor & task list',
    files: INITIAL_FILES
  },
  {
    id: 'calculator',
    title: 'Kalkulator Modern',
    description: 'Kalkulator digital dengan riwayat kalkulasi',
    files: [
      {
        id: 'file-calc-1',
        name: 'index.html',
        path: 'index.html',
        language: 'html',
        isEntry: true,
        updatedAt: new Date().toISOString(),
        content: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kalkulator Modern</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-sm bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
    <div class="flex items-center justify-between text-xs text-slate-400">
      <span class="font-medium">Gemini Calculator</span>
      <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">Aktif</span>
    </div>
    <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-right">
      <div id="prevExpr" class="text-xs text-slate-500 h-4"></div>
      <div id="calcDisplay" class="text-3xl font-black tracking-tight text-white overflow-hidden">0</div>
    </div>
    <div class="grid grid-cols-4 gap-2.5" id="buttonsGrid">
      <button class="calc-btn bg-slate-800 text-rose-400" data-val="C">C</button>
      <button class="calc-btn bg-slate-800 text-slate-300" data-val="DEL">⌫</button>
      <button class="calc-btn bg-slate-800 text-blue-400" data-val="%">%</button>
      <button class="calc-btn bg-blue-600 text-white font-bold" data-val="/">÷</button>
      
      <button class="calc-btn bg-slate-800/80 text-white" data-val="7">7</button>
      <button class="calc-btn bg-slate-800/80 text-white" data-val="8">8</button>
      <button class="calc-btn bg-slate-800/80 text-white" data-val="9">9</button>
      <button class="calc-btn bg-blue-600 text-white font-bold" data-val="*">×</button>
      
      <button class="calc-btn bg-slate-800/80 text-white" data-val="4">4</button>
      <button class="calc-btn bg-slate-800/80 text-white" data-val="5">5</button>
      <button class="calc-btn bg-slate-800/80 text-white" data-val="6">6</button>
      <button class="calc-btn bg-blue-600 text-white font-bold" data-val="-">-</button>
      
      <button class="calc-btn bg-slate-800/80 text-white" data-val="1">1</button>
      <button class="calc-btn bg-slate-800/80 text-white" data-val="2">2</button>
      <button class="calc-btn bg-slate-800/80 text-white" data-val="3">3</button>
      <button class="calc-btn bg-blue-600 text-white font-bold" data-val="+">+</button>
      
      <button class="calc-btn col-span-2 bg-slate-800/80 text-white" data-val="0">0</button>
      <button class="calc-btn bg-slate-800/80 text-white" data-val=".">.</button>
      <button class="calc-btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold" data-val="=">=</button>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`
      },
      {
        id: 'file-calc-2',
        name: 'style.css',
        path: 'style.css',
        language: 'css',
        updatedAt: new Date().toISOString(),
        content: `body {
  margin: 0;
  background-color: #020617;
  color: #f8fafc;
  font-family: system-ui, sans-serif;
}
.calc-btn {
  padding: 0.85rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.15s ease;
  border: 1px solid rgba(255,255,255,0.05);
}
.calc-btn:active {
  transform: scale(0.92);
}
.calc-btn:hover {
  filter: brightness(1.15);
}`
      },
      {
        id: 'file-calc-3',
        name: 'app.js',
        path: 'app.js',
        language: 'javascript',
        updatedAt: new Date().toISOString(),
        content: `(function() {
  const display = document.getElementById('calcDisplay');
  const prev = document.getElementById('prevExpr');
  let currentVal = '0';
  let shouldReset = false;

  document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (val === 'C') {
        currentVal = '0';
        prev.textContent = '';
      } else if (val === 'DEL') {
        currentVal = currentVal.length > 1 ? currentVal.slice(0, -1) : '0';
      } else if (val === '=') {
        try {
          prev.textContent = currentVal + ' =';
          const safeExpr = currentVal.replace(/[^0-9+\\-*\\/.]/g, '');
          currentVal = String(Function('"use strict";return (' + safeExpr + ')')());
          shouldReset = true;
        } catch (e) {
          currentVal = 'Error';
          shouldReset = true;
        }
      } else {
        if (shouldReset && !['+', '-', '*', '/'].includes(val)) {
          currentVal = val;
          shouldReset = false;
        } else {
          shouldReset = false;
          if (currentVal === '0' && val !== '.') {
            currentVal = val;
          } else {
            currentVal += val;
          }
        }
      }
      display.textContent = currentVal;
    });
  });
})();`
      }
    ]
  }
];

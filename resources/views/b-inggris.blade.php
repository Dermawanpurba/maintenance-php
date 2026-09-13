<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BELAJAR B INGGRIS PERSIAPAN TOEFL ITP - Paper Sketch Edition</title>
  <meta name="description" content="Aplikasi Management Persiapan TOEFL ITP Interaktif bergaya Retro Paper Sketch dengan AI Generator Materi, Simulasi Tes 15 Soal, dan Pembahasan Mendalam." />
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- FontAwesome 6 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <!-- Google Fonts: Retro Paper Sketch Styles -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Caveat:wght@400;600;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Kalam:wght@300;400;700&family=Patrick+Hand&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <!-- SweetAlert2 -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Canvas Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            paper: {
              DEFAULT: 'var(--paper-bg, #fbf8f1)',
              card: 'var(--paper-card, #ffffff)',
              warm: 'var(--paper-warm, #fefae0)',
              dark: '#292524',
              line: '#e7e0d3'
            },
            sketch: {
              primary: 'var(--color-primary, #fef3c7)',
              accent: 'var(--color-accent, #57534e)',
              pencil: 'var(--color-pencil, #3f3f46)',
              ink: '#1e293b',
              border: '#44403c',
              highlight: '#fde047',
              red: '#b91c1c',
              green: '#15803d',
              blue: '#1d4ed8'
            }
          },
          fontFamily: {
            sketch: ['"Patrick Hand"', 'cursive'],
            handwrite: ['"Caveat"', 'cursive'],
            notes: ['"Kalam"', 'cursive'],
            typewriter: ['"Courier Prime"', 'monospace'],
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            title: ['"Architects Daughter"', 'cursive']
          },
          boxShadow: {
            'sketch': '3px 3px 0px 0px #57534e',
            'sketch-lg': '5px 5px 0px 0px #57534e',
            'sketch-sm': '2px 2px 0px 0px #57534e',
            'sketch-hover': '1px 1px 0px 0px #57534e',
            'sketch-colored': '4px 4px 0px 0px #d97706',
            'paper-sheet': '0 1px 3px rgba(0,0,0,0.05), 0 10px 20px -5px rgba(87,83,78,0.15)'
          }
        }
      }
    }
  </script>

  <style>
    :root {
      --paper-bg: #fbf8f1;
      --paper-card: #ffffff;
      --paper-warm: #fefae0;
      --color-primary: #fef3c7;
      --color-accent: #57534e;
      --color-pencil: #292524;
      --sketch-border: #44403c;
      --font-body: 'Plus Jakarta Sans', sans-serif;
    }

    body {
      background-color: var(--paper-bg);
      color: var(--color-pencil);
      font-family: var(--font-body);
      background-image: 
        radial-gradient(#d6cebe 0.75px, transparent 0.75px),
        radial-gradient(#e5dec9 0.75px, var(--paper-bg) 0.75px);
      background-size: 30px 30px;
      background-position: 0 0, 15px 15px;
      min-height: 100vh;
    }

    .tabular-nums {
      font-variant-numeric: tabular-nums;
    }

    /* Paper Sketch Hand-drawn Borders & Shadows */
    .sketch-box {
      border: 2px solid var(--sketch-border);
      border-radius: 8px 12px 10px 14px/14px 10px 12px 8px;
      box-shadow: 3px 3px 0px 0px var(--color-accent);
      background: var(--paper-card);
      transition: all 0.2s ease;
    }

    .sketch-box:hover {
      border-radius: 10px 14px 8px 12px/12px 8px 14px 10px;
    }

    .sketch-btn {
      border: 2px solid var(--sketch-border);
      border-radius: 6px 10px 8px 12px/12px 8px 10px 6px;
      box-shadow: 3px 3px 0px 0px var(--color-accent);
      transition: all 0.15s ease-in-out;
      cursor: pointer;
      font-family: 'Patrick Hand', cursive;
      font-weight: 600;
    }

    .sketch-btn:hover {
      transform: translate(1px, 1px);
      box-shadow: 2px 2px 0px 0px var(--color-accent);
    }

    .sketch-btn:active {
      transform: translate(3px, 3px);
      box-shadow: 0px 0px 0px 0px var(--color-accent);
    }

    .sketch-input {
      border: 2px solid var(--sketch-border);
      border-radius: 6px 10px 7px 11px/11px 7px 10px 6px;
      background: #ffffff;
      box-shadow: inset 1px 1px 3px rgba(0,0,0,0.05);
      transition: all 0.2s ease;
    }

    .sketch-input:focus {
      outline: none;
      border-color: #b45309;
      box-shadow: 2px 2px 0px 0px var(--color-accent);
    }

    /* Washi Tape Effect */
    .washi-tape {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%) rotate(-1deg);
      width: 90px;
      height: 24px;
      background: rgba(253, 230, 138, 0.75);
      border-left: 2px dashed rgba(180, 83, 9, 0.3);
      border-right: 2px dashed rgba(180, 83, 9, 0.3);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      z-index: 10;
    }

    /* Sticky Note */
    .sticky-note {
      background: #fef08a;
      border: 1px solid #eab308;
      box-shadow: 4px 4px 10px rgba(0,0,0,0.08), 2px 2px 0px 0px #ca8a04;
      transform: rotate(0.8deg);
    }

    /* Ink Stamps */
    .ink-stamp {
      display: inline-block;
      padding: 2px 8px;
      text-transform: uppercase;
      font-family: 'Courier Prime', monospace;
      font-weight: 700;
      border: 2px solid currentColor;
      border-radius: 4px;
      transform: rotate(-3deg);
      letter-spacing: 1px;
    }

    .ink-stamp-pass {
      color: #15803d;
      border-color: #15803d;
      background: rgba(240, 253, 244, 0.8);
    }

    .ink-stamp-fail {
      color: #b91c1c;
      border-color: #b91c1c;
      background: rgba(254, 242, 242, 0.8);
    }

    .ink-stamp-gold {
      color: #b45309;
      border-color: #b45309;
      background: rgba(254, 243, 199, 0.8);
    }

    /* Print Stylesheet */
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        background-image: none !important;
      }
      aside, header, #mobileBottomNav, .no-print, button, .sketch-btn {
        display: none !important;
      }
      main {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }
      .sketch-box {
        box-shadow: none !important;
        border: 1px solid #000 !important;
      }
    }

    /* Radio Card Active State */
    .option-card.selected {
      background-color: #fef3c7 !important;
      border-color: #b45309 !important;
      box-shadow: 4px 4px 0px 0px #b45309 !important;
      transform: translate(-1px, -1px);
    }
  </style>
</head>
<body class="antialiased flex flex-col min-h-screen selection:bg-amber-200 selection:text-stone-900">

  <!-- TOP HEADER -->
  <header class="sticky top-0 z-40 bg-[#fbf8f1]/95 backdrop-blur-sm border-b-2 border-stone-700 px-4 py-2.5 flex items-center justify-between shadow-[0_2px_4px_rgba(87,83,78,0.08)]">
    <div class="flex items-center space-x-3">
      <!-- Mobile sidebar toggle -->
      <button onclick="toggleMobileSidebar()" class="md:hidden p-2 rounded-lg border-2 border-stone-800 bg-amber-100 hover:bg-amber-200 text-stone-800 shadow-sketch-sm">
        <i class="fa-solid fa-bars text-lg"></i>
      </button>

      <!-- App Brand Logo & Title -->
      <div class="flex items-center space-x-2.5 cursor-pointer" onclick="navigateTo('dashboard')">
        <div id="headerLogoContainer" class="w-10 h-10 rounded-lg border-2 border-stone-800 bg-amber-200 flex items-center justify-center shadow-sketch-sm rotate-[-2deg]">
          <i class="fa-solid fa-pencil text-stone-800 text-lg"></i>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-lg md:text-xl font-bold font-title tracking-tight text-stone-900 leading-none">
              BELAJAR B INGGRIS
            </h1>
            <span class="bg-stone-800 text-amber-200 text-[10px] font-typewriter px-1.5 py-0.5 rounded rotate-[1deg] font-bold">TOEFL ITP</span>
          </div>
          <p class="text-xs font-handwrite text-stone-600 font-bold tracking-wide -mt-0.5">
            📝 Sketsa Persiapan Skor 550+ | Powered by siaptuan_premium AI
          </p>
        </div>
      </div>
    </div>

    <!-- Center Search bar & Quick Prompts -->
    <div class="hidden lg:flex items-center flex-1 max-w-md mx-6">
      <div class="relative w-full">
        <input type="text" id="globalSearchInput" placeholder="Cari materi grammar, skill listening, reading passage..." 
               class="w-full text-sm font-handwrite text-stone-800 bg-white border-2 border-stone-700 rounded-full px-4 py-1.5 pl-9 shadow-sketch-sm focus:outline-none focus:border-amber-700 text-base"
               onkeyup="handleGlobalSearch(event)" />
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-stone-500 text-sm"></i>
      </div>
    </div>

    <!-- Right Header Actions -->
    <div class="flex items-center space-x-2 sm:space-x-3">
      <!-- AI Quick Generator Trigger -->
      <button onclick="openAIModal('materi')" class="sketch-btn bg-amber-200 hover:bg-amber-300 text-stone-900 text-xs sm:text-sm px-3 py-1.5 flex items-center space-x-1.5">
        <i class="fa-solid fa-wand-magic-sparkles text-amber-800"></i>
        <span class="hidden sm:inline">Buat Materi AI</span>
      </button>

      <!-- Target Score Pill -->
      <div class="hidden sm:flex items-center space-x-1.5 bg-stone-100 border-2 border-stone-700 px-2.5 py-1 rounded-full shadow-sketch-sm">
        <i class="fa-solid fa-bullseye text-amber-700 text-xs"></i>
        <span class="text-xs font-typewriter font-bold text-stone-800">Target: <span id="headerTargetScore" class="text-amber-800">550+</span></span>
      </div>

      <!-- Notification Center -->
      <div class="relative">
        <button onclick="toggleNotificationPopover()" class="sketch-btn w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-700 hover:bg-stone-100">
          <i class="fa-regular fa-bell text-sm"></i>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border border-white"></span>
        </button>
        <!-- Notification Dropdown -->
        <div id="notificationPopover" class="hidden absolute right-0 mt-2 w-72 bg-white sketch-box p-3 z-50 text-xs shadow-sketch-lg">
          <div class="flex justify-between items-center border-b pb-1.5 mb-2 font-sketch text-sm font-bold text-stone-800">
            <span><i class="fa-solid fa-bell mr-1 text-amber-600"></i> Catatan & Reminder</span>
            <span class="text-[10px] text-stone-500">Live</span>
          </div>
          <div class="space-y-2 font-handwrite text-sm">
            <div class="p-1.5 bg-amber-50 rounded border border-amber-200">
              📌 Jangan lupa latihan 15 soal hari ini untuk mempertajam <b>Structure & Written Expression</b>.
            </div>
            <div class="p-1.5 bg-emerald-50 rounded border border-emerald-200">
              💡 Tips: Perhatikan pola <i>Inversion</i> setelah negative adverbs (Never, Seldom, Rarely).
            </div>
          </div>
        </div>
      </div>

      <!-- User Profile Badge -->
      <div class="flex items-center space-x-2 pl-1 cursor-pointer" onclick="navigateTo('settings')">
        <div class="w-8 h-8 rounded-full border-2 border-stone-800 bg-amber-300 overflow-hidden shadow-sketch-sm flex items-center justify-center font-title font-bold text-sm text-stone-800" id="headerAvatarContainer">
          DP
        </div>
        <span class="hidden md:inline font-sketch text-stone-900 font-bold text-sm" id="headerUserName">Dermawan</span>
      </div>
    </div>
  </header>

  <!-- MAIN WRAPPER: SIDEBAR + CONTENT -->
  <div class="flex-1 flex overflow-hidden">
    
    <!-- DESKTOP LEFT SIDEBAR (Width: 240px) -->
    <aside id="desktopSidebar" class="hidden md:flex flex-col w-60 bg-[#faf6ee] border-r-2 border-stone-700 flex-shrink-0 justify-between relative shadow-[2px_0_4px_rgba(87,83,78,0.05)]">
      <!-- Binder Clip Decor -->
      <div class="absolute -top-3 left-6 w-8 h-4 bg-stone-700 rounded-t-sm shadow-sm border border-stone-900 z-10 opacity-75"></div>
      
      <!-- Nav List -->
      <div class="p-3 space-y-1.5 overflow-y-auto">
        <div class="px-3 py-1 font-typewriter text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-300 mb-2">
          // NAVIGASI UTAMA
        </div>

        <button onclick="navigateTo('dashboard')" id="nav-dashboard" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-sketch font-bold text-stone-800 hover:bg-amber-100/80 border-2 border-transparent transition">
          <i class="fa-solid fa-chalkboard-user w-5 text-center text-amber-800"></i>
          <span>Dashboard Overview</span>
        </button>

        <button onclick="navigateTo('materi')" id="nav-materi" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-sketch font-bold text-stone-800 hover:bg-amber-100/80 border-2 border-transparent transition">
          <i class="fa-solid fa-book-open-reader w-5 text-center text-blue-800"></i>
          <span>Materi TOEFL ITP</span>
          <span class="ml-auto text-[10px] bg-amber-200 text-stone-800 font-typewriter px-1.5 py-0.2 rounded border border-stone-600">PENTING</span>
        </button>

        <button onclick="navigateTo('test-center')" id="nav-test-center" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-sketch font-bold text-stone-800 hover:bg-amber-100/80 border-2 border-transparent transition">
          <i class="fa-solid fa-pen-nib w-5 text-center text-emerald-800"></i>
          <span>Tes TOEFL 15 Soal</span>
          <span class="ml-auto text-[10px] bg-emerald-100 text-emerald-900 font-typewriter px-1.5 py-0.2 rounded border border-emerald-700">15 SOAL</span>
        </button>

        <button onclick="navigateTo('pembahasan')" id="nav-pembahasan" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-sketch font-bold text-stone-800 hover:bg-amber-100/80 border-2 border-transparent transition">
          <i class="fa-solid fa-magnifying-glass-chart w-5 text-center text-indigo-800"></i>
          <span>Pembahasan & AI Tutor</span>
        </button>

        <button onclick="navigateTo('master-data')" id="nav-master-data" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-sketch font-bold text-stone-800 hover:bg-amber-100/80 border-2 border-transparent transition">
          <i class="fa-solid fa-database w-5 text-center text-stone-700"></i>
          <span>Bank Data & Riwayat</span>
        </button>

        <button onclick="navigateTo('kanban')" id="nav-kanban" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-sketch font-bold text-stone-800 hover:bg-amber-100/80 border-2 border-transparent transition">
          <i class="fa-solid fa-table-columns w-5 text-center text-amber-700"></i>
          <span>Kanban Target Belajar</span>
        </button>

        <button onclick="navigateTo('analytics')" id="nav-analytics" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-sketch font-bold text-stone-800 hover:bg-amber-100/80 border-2 border-transparent transition">
          <i class="fa-solid fa-chart-line w-5 text-center text-rose-800"></i>
          <span>Laporan & Evaluasi</span>
        </button>

        <button onclick="navigateTo('settings')" id="nav-settings" class="nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-sketch font-bold text-stone-800 hover:bg-amber-100/80 border-2 border-transparent transition">
          <i class="fa-solid fa-sliders w-5 text-center text-stone-800"></i>
          <span>Pengaturan & AI Key</span>
        </button>
      </div>

      <!-- Sidebar Sticky Quick Note -->
      <div class="p-3">
        <div class="sticky-note p-2.5 rounded text-xs font-handwrite text-stone-900 mb-3">
          <div class="font-bold border-b border-amber-400 pb-1 flex justify-between items-center">
            <span><i class="fa-solid fa-bolt text-amber-600"></i> Quick AI Tip</span>
            <span class="text-[10px] font-typewriter">siaptuan_premium</span>
          </div>
          <p class="mt-1 text-xs leading-tight">
            "Prioritaskan kuasai Clause Connectors & Verb Agreement sebelum tes untuk jaminan skor 500+!"
          </p>
        </div>

        <!-- Mandatory Watermark Sidebar (Desktop) -->
        <div style='text-align:center; font-size:12px; margin:10px 0; color:#888;'>
          develop by : dermawan.prb@gmail.com | <a href='https://www.linkedin.com/in/dermawan-purba-5b69241a9' target='_blank' style='color:#888; text-decoration:none;'>LinkedIn</a>
        </div>
      </div>
    </aside>

    <!-- MOBILE SIDEBAR OVERLAY -->
    <div id="mobileSidebarOverlay" class="fixed inset-0 bg-stone-900/60 z-50 hidden transition-opacity" onclick="toggleMobileSidebar()">
      <div class="w-64 bg-[#faf6ee] h-full p-4 border-r-2 border-stone-800 flex flex-col justify-between" onclick="event.stopPropagation()">
        <div>
          <div class="flex justify-between items-center border-b-2 border-stone-700 pb-3 mb-4">
            <h2 class="font-title font-bold text-lg text-stone-900">MENU TOEFL ITP</h2>
            <button onclick="toggleMobileSidebar()" class="p-1 rounded text-stone-700 hover:bg-stone-200">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
          <div class="space-y-2">
            <button onclick="navigateTo('dashboard'); toggleMobileSidebar();" class="w-full text-left p-2 font-sketch font-bold text-stone-800 hover:bg-amber-100 rounded">
              <i class="fa-solid fa-chalkboard-user mr-2 text-amber-800"></i> Dashboard
            </button>
            <button onclick="navigateTo('materi'); toggleMobileSidebar();" class="w-full text-left p-2 font-sketch font-bold text-stone-800 hover:bg-amber-100 rounded">
              <i class="fa-solid fa-book-open-reader mr-2 text-blue-800"></i> Materi TOEFL ITP
            </button>
            <button onclick="navigateTo('test-center'); toggleMobileSidebar();" class="w-full text-left p-2 font-sketch font-bold text-stone-800 hover:bg-amber-100 rounded">
              <i class="fa-solid fa-pen-nib mr-2 text-emerald-800"></i> Tes 15 Soal
            </button>
            <button onclick="navigateTo('pembahasan'); toggleMobileSidebar();" class="w-full text-left p-2 font-sketch font-bold text-stone-800 hover:bg-amber-100 rounded">
              <i class="fa-solid fa-magnifying-glass-chart mr-2 text-indigo-800"></i> Pembahasan Soal
            </button>
            <button onclick="navigateTo('master-data'); toggleMobileSidebar();" class="w-full text-left p-2 font-sketch font-bold text-stone-800 hover:bg-amber-100 rounded">
              <i class="fa-solid fa-database mr-2 text-stone-700"></i> Bank Data
            </button>
            <button onclick="navigateTo('kanban'); toggleMobileSidebar();" class="w-full text-left p-2 font-sketch font-bold text-stone-800 hover:bg-amber-100 rounded">
              <i class="fa-solid fa-table-columns mr-2 text-amber-700"></i> Kanban
            </button>
            <button onclick="navigateTo('analytics'); toggleMobileSidebar();" class="w-full text-left p-2 font-sketch font-bold text-stone-800 hover:bg-amber-100 rounded">
              <i class="fa-solid fa-chart-line mr-2 text-rose-800"></i> Laporan
            </button>
            <button onclick="navigateTo('settings'); toggleMobileSidebar();" class="w-full text-left p-2 font-sketch font-bold text-stone-800 hover:bg-amber-100 rounded">
              <i class="fa-solid fa-sliders mr-2 text-stone-800"></i> Pengaturan
            </button>
          </div>
        </div>

        <div style='text-align:center; font-size:11px; margin:10px 0; color:#888;'>
          develop by : dermawan.prb@gmail.com | <a href='https://www.linkedin.com/in/dermawan-purba-5b69241a9' target='_blank' style='color:#888; text-decoration:none;'>LinkedIn</a>
        </div>
      </div>
    </div>

    <!-- MAIN SCROLLABLE CONTENT VIEW CONTAINER -->
    <main class="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 pb-20 md:pb-8">
      
      <!-- VIEW 1: DASHBOARD OVERVIEW -->
      <section id="view-dashboard" class="app-view space-y-6">
        
        <!-- Welcome Hero Banner with Retro Paper Stamp -->
        <div class="sketch-box p-4 sm:p-6 bg-gradient-to-r from-amber-100/90 via-amber-50 to-orange-50 relative overflow-hidden">
          <div class="washi-tape"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1 z-10">
              <div class="flex items-center space-x-2">
                <span class="ink-stamp ink-stamp-gold text-xs">SKETSA BELAJAR</span>
                <span class="text-xs font-typewriter text-stone-600">Simulasi & Materi Terpadu</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-title font-bold text-stone-900">
                Halo, <span id="dashUserName">Dermawan</span>! Siap Taklukkan TOEFL ITP?
              </h2>
              <p class="text-sm font-handwrite text-stone-700 max-w-2xl text-base">
                Kuasai materi esensial grammar, trik listening, dan strategi reading. Uji pemahamanmu lewat simulasi 15 soal berstandar tinggi yang didukung penjelasan detail dari <b>AI siaptuan_premium</b>!
              </p>
            </div>
            
            <div class="flex flex-wrap gap-2 z-10">
              <button onclick="startStandardTest15()" class="sketch-btn bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm flex items-center space-x-2">
                <i class="fa-solid fa-play"></i>
                <span>Mulai Tes 15 Soal</span>
              </button>
              <button onclick="openAIModal('materi')" class="sketch-btn bg-white hover:bg-amber-50 text-stone-800 px-3.5 py-2 text-sm flex items-center space-x-1.5">
                <i class="fa-solid fa-brain text-amber-700"></i>
                <span>AI Generator Materi</span>
              </button>
            </div>
          </div>

          <i class="fa-solid fa-graduation-cap absolute -right-4 -bottom-6 text-9xl text-stone-800/5 -rotate-12 pointer-events-none"></i>
        </div>

        <!-- Executive KPI Cards with tabular-nums -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- KPI 1 -->
          <div class="sketch-box p-4 bg-white relative">
            <div class="flex justify-between items-start">
              <span class="text-xs font-sketch text-stone-600 font-bold uppercase tracking-wider">Total Sesi Tes</span>
              <div class="w-7 h-7 rounded bg-amber-100 border border-stone-700 flex items-center justify-center text-amber-800 text-xs">
                <i class="fa-solid fa-list-check"></i>
              </div>
            </div>
            <div class="mt-2 flex items-baseline space-x-2">
              <span id="kpiTotalTests" class="text-2xl sm:text-3xl font-title font-bold text-stone-900 tabular-nums">0</span>
              <span class="text-xs font-typewriter text-emerald-700 font-bold">↑ Sesi</span>
            </div>
            <p class="text-[11px] font-handwrite text-stone-500 mt-1">15 Soal per simulasi</p>
          </div>

          <!-- KPI 2 -->
          <div class="sketch-box p-4 bg-white relative">
            <div class="flex justify-between items-start">
              <span class="text-xs font-sketch text-stone-600 font-bold uppercase tracking-wider">Rata-Rata Skor ITP</span>
              <div class="w-7 h-7 rounded bg-blue-100 border border-stone-700 flex items-center justify-center text-blue-800 text-xs">
                <i class="fa-solid fa-award"></i>
              </div>
            </div>
            <div class="mt-2 flex items-baseline space-x-2">
              <span id="kpiAvgScore" class="text-2xl sm:text-3xl font-title font-bold text-stone-900 tabular-nums">0</span>
              <span class="text-xs font-typewriter text-stone-500">/ 677</span>
            </div>
            <div class="flex items-center space-x-1 mt-1">
              <span id="kpiScoreStatus" class="ink-stamp ink-stamp-pass text-[10px]">SIAP LATIHAN</span>
            </div>
          </div>

          <!-- KPI 3 -->
          <div class="sketch-box p-4 bg-white relative">
            <div class="flex justify-between items-start">
              <span class="text-xs font-sketch text-stone-600 font-bold uppercase tracking-wider">Akurasi Jawaban</span>
              <div class="w-7 h-7 rounded bg-emerald-100 border border-stone-700 flex items-center justify-center text-emerald-800 text-xs">
                <i class="fa-solid fa-bullseye"></i>
              </div>
            </div>
            <div class="mt-2 flex items-baseline space-x-2">
              <span id="kpiAccuracy" class="text-2xl sm:text-3xl font-title font-bold text-stone-900 tabular-nums">0%</span>
              <span class="text-xs font-typewriter text-emerald-700 font-bold">↑ Akurat</span>
            </div>
            <p class="text-[11px] font-handwrite text-stone-500 mt-1"><span id="kpiTotalAnswered">0</span> Soal dikerjakan</p>
          </div>

          <!-- KPI 4 -->
          <div class="sketch-box p-4 bg-white relative">
            <div class="flex justify-between items-start">
              <span class="text-xs font-sketch text-stone-600 font-bold uppercase tracking-wider">Materi Dikuasai</span>
              <div class="w-7 h-7 rounded bg-purple-100 border border-stone-700 flex items-center justify-center text-purple-800 text-xs">
                <i class="fa-solid fa-book-bookmark"></i>
              </div>
            </div>
            <div class="mt-2 flex items-baseline space-x-2">
              <span id="kpiMasteredSkills" class="text-2xl sm:text-3xl font-title font-bold text-stone-900 tabular-nums">12/20</span>
              <span class="text-xs font-typewriter text-purple-800 font-bold">Skills</span>
            </div>
            <p class="text-[11px] font-handwrite text-stone-500 mt-1">Structure, Listening, Reading</p>
          </div>
        </div>

        <!-- 2-Column Section: Learning Sections Progress & Quick Study Material -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left: Section Mastery Radar / Bar -->
          <div class="lg:col-span-2 sketch-box p-5 bg-white space-y-4">
            <div class="flex justify-between items-center border-b-2 border-stone-200 pb-2">
              <div>
                <h3 class="font-title font-bold text-lg text-stone-900">
                  <i class="fa-solid fa-chart-pie text-amber-700 mr-1.5"></i> Pemetaan Kekuatan per Bagian TOEFL
                </h3>
                <p class="text-xs font-handwrite text-stone-600 text-base">Evaluasi penguasaan Structure, Listening Comprehension, dan Reading</p>
              </div>
              <button onclick="navigateTo('analytics')" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-xs px-2.5 py-1 text-stone-800">
                Detail Laporan
              </button>
            </div>

            <!-- Hand-drawn style Chart -->
            <div class="h-64 relative">
              <canvas id="dashboardRadarChart"></canvas>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-typewriter">
              <div class="p-2 bg-amber-50 rounded border border-amber-200">
                <div class="font-bold text-amber-900">STRUCTURE</div>
                <div class="text-sm font-bold mt-0.5 text-stone-800" id="dashStructureAcc">78% Akurat</div>
              </div>
              <div class="p-2 bg-blue-50 rounded border border-blue-200">
                <div class="font-bold text-blue-900">LISTENING</div>
                <div class="text-sm font-bold mt-0.5 text-stone-800" id="dashListeningAcc">72% Akurat</div>
              </div>
              <div class="p-2 bg-emerald-50 rounded border border-emerald-200">
                <div class="font-bold text-emerald-900">READING</div>
                <div class="text-sm font-bold mt-0.5 text-stone-800" id="dashReadingAcc">80% Akurat</div>
              </div>
            </div>
          </div>

          <!-- Right: Quick Recommended Topics to Study First -->
          <div class="sketch-box p-5 bg-[#fffdfa] flex flex-col justify-between">
            <div>
              <div class="flex items-center space-x-2 border-b-2 border-stone-200 pb-2 mb-3">
                <i class="fa-solid fa-lightbulb text-amber-600 text-lg"></i>
                <h3 class="font-title font-bold text-lg text-stone-900">Materi Prioritas Hari Ini</h3>
              </div>
              
              <div class="space-y-3 font-handwrite" id="dashboardTopicSuggestions">
                <!-- Dynamically Rendered Priority Items -->
              </div>
            </div>

            <div class="mt-4 pt-3 border-t-2 border-stone-200">
              <button onclick="navigateTo('materi')" class="w-full sketch-btn bg-amber-200 hover:bg-amber-300 text-stone-900 py-2 text-sm flex items-center justify-center space-x-2">
                <span>Buka Seluruh Materi TOEFL</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Test Activity Log Table -->
        <div class="sketch-box p-5 bg-white space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-stone-200 pb-2">
            <div>
              <h3 class="font-title font-bold text-lg text-stone-900">
                <i class="fa-solid fa-clock-rotate-left text-stone-700 mr-1.5"></i> Riwayat Tes 15 Soal Terakhir
              </h3>
              <p class="text-xs font-handwrite text-stone-600 text-base">Hasil latihan, konversi skor scaled ITP, dan link ke pembahasan detail</p>
            </div>
            <div class="flex items-center space-x-2">
              <button onclick="navigateTo('test-center')" class="sketch-btn bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs px-3 py-1.5 font-bold">
                + Ujian 15 Soal Baru
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr class="border-b-2 border-stone-700 font-typewriter text-xs text-stone-600 bg-stone-50">
                  <th class="p-2.5">TANGGAL & WAKTU</th>
                  <th class="p-2.5">PAKET TES</th>
                  <th class="p-2.5 text-center">BENAR / TOTAL</th>
                  <th class="p-2.5 text-center">ESTIMASI SKOR ITP</th>
                  <th class="p-2.5 text-center">STATUS</th>
                  <th class="p-2.5 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody id="dashRecentHistoryTbody" class="divide-y divide-stone-200">
                <!-- Rendered dynamically -->
              </tbody>
            </table>
          </div>
        </div>

      </section>

      <!-- VIEW 2: MATERI TOEFL ITP (STUDY CENTER & AI GENERATOR) -->
      <section id="view-materi" class="app-view hidden space-y-6">
        
        <!-- Header & Filter Bar -->
        <div class="sketch-box p-5 bg-white">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-stone-200 pb-4">
            <div>
              <div class="flex items-center space-x-2">
                <span class="ink-stamp ink-stamp-gold text-xs">MODUL UTAMA</span>
                <span class="text-xs font-typewriter text-stone-600">Pelajari Materi Dulu Sebelum Tes</span>
              </div>
              <h2 class="text-2xl font-title font-bold text-stone-900 mt-1">
                Pusat Materi & Teori TOEFL ITP
              </h2>
              <p class="text-xs font-handwrite text-stone-700 text-base">
                Pahami kaidah tata bahasa, trik dialog pendek, dan strategi membedah teks panjang secara ringkas & praktis.
              </p>
            </div>
            
            <div class="flex flex-wrap items-center gap-2">
              <button onclick="openAIModal('materi')" class="sketch-btn bg-amber-200 hover:bg-amber-300 text-stone-900 text-xs sm:text-sm px-3.5 py-2 flex items-center space-x-1.5">
                <i class="fa-solid fa-wand-magic-sparkles text-amber-800"></i>
                <span>Generate Materi Baru (AI)</span>
              </button>
              <button onclick="printCurrentMaterial()" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm px-3 py-2 flex items-center space-x-1">
                <i class="fa-solid fa-print"></i>
                <span class="hidden sm:inline">Cetak Catatan</span>
              </button>
            </div>
          </div>

          <!-- Section Tabs & Search Filter -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
            <div class="flex flex-wrap gap-1.5" id="materiSectionTabs">
              <button onclick="filterMateriSection('ALL')" class="materi-tab-btn sketch-btn bg-stone-800 text-amber-200 text-xs px-3 py-1.5 active">
                Semua Bagian (<span id="countMateriAll">0</span>)
              </button>
              <button onclick="filterMateriSection('STRUCTURE')" class="materi-tab-btn sketch-btn bg-white text-stone-800 text-xs px-3 py-1.5">
                Structure & Written Expression (<span id="countMateriStructure">0</span>)
              </button>
              <button onclick="filterMateriSection('LISTENING')" class="materi-tab-btn sketch-btn bg-white text-stone-800 text-xs px-3 py-1.5">
                Listening Comprehension (<span id="countMateriListening">0</span>)
              </button>
              <button onclick="filterMateriSection('READING')" class="materi-tab-btn sketch-btn bg-white text-stone-800 text-xs px-3 py-1.5">
                Reading Comprehension (<span id="countMateriReading">0</span>)
              </button>
            </div>

            <div class="relative w-full sm:w-64">
              <input type="text" id="materiSearchInput" placeholder="Filter topik materi..." 
                     class="w-full text-xs font-handwrite bg-stone-50 border-2 border-stone-600 rounded-lg px-3 py-1.5 pl-8 focus:outline-none focus:bg-white text-base"
                     onkeyup="renderMateriCards()" />
              <i class="fa-solid fa-filter absolute left-2.5 top-2.5 text-stone-500 text-xs"></i>
            </div>
          </div>
        </div>

        <!-- Materi Cards Grid -->
        <div id="materiGridContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <!-- Rendered dynamically -->
        </div>

      </section>

      <!-- VIEW 3: SIMULASI TES TOEFL ITP 15 SOAL (ACTIVE EXAM ENGINE) -->
      <section id="view-test-center" class="app-view hidden space-y-6">
        
        <!-- Pre-Test Launcher Lobby -->
        <div id="testLobbyContainer" class="space-y-6">
          <div class="sketch-box p-6 bg-white text-center max-w-3xl mx-auto space-y-4">
            <div class="washi-tape"></div>
            <div class="w-16 h-16 rounded-full border-2 border-stone-800 bg-amber-200 flex items-center justify-center mx-auto text-2xl text-stone-800 shadow-sketch-sm rotate-[-3deg]">
              <i class="fa-solid fa-file-pen"></i>
            </div>
            
            <h2 class="text-2xl sm:text-3xl font-title font-bold text-stone-900">
              Simulasi Tes TOEFL ITP (15 Soal)
            </h2>
            <p class="text-sm font-handwrite text-stone-700 max-w-xl mx-auto text-base">
              Pilih paket soal simulasi standar atau generate paket baru dengan <b>AI siaptuan_premium</b>. Waktu pengerjaan standar adalah <b>25 Menit</b>. Setiap soal dilengkapi pembahasan mendalam.
            </p>

            <!-- Test Options Preset Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-left">
              <!-- Preset 1: Full Mix 15 -->
              <div onclick="selectTestPreset('mix')" class="test-preset-card sketch-box p-4 bg-amber-50/70 hover:bg-amber-100 cursor-pointer border-stone-700">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-title font-bold text-stone-900 text-base">Paket Mix Standar</span>
                  <span class="text-[10px] font-typewriter bg-amber-200 px-1 rounded border border-stone-700">15 SOAL</span>
                </div>
                <p class="text-xs font-handwrite text-stone-600 text-sm">
                  Kombinasi 5 Listening Dialog, 5 Structure & Error, 5 Reading Passage.
                </p>
                <div class="mt-3 text-xs font-typewriter text-stone-700 font-bold">⏱ 25 Menit</div>
              </div>

              <!-- Preset 2: Structure Focus 15 -->
              <div onclick="selectTestPreset('structure')" class="test-preset-card sketch-box p-4 bg-blue-50/70 hover:bg-blue-100 cursor-pointer border-stone-700">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-title font-bold text-stone-900 text-base">Structure Intensive</span>
                  <span class="text-[10px] font-typewriter bg-blue-200 px-1 rounded border border-stone-700">15 SOAL</span>
                </div>
                <p class="text-xs font-handwrite text-stone-600 text-sm">
                  15 Soal murni Grammar, Inversion, Appositive, Reduced Clauses & Parallelism.
                </p>
                <div class="mt-3 text-xs font-typewriter text-stone-700 font-bold">⏱ 20 Menit</div>
              </div>

              <!-- Preset 3: AI Custom Generator -->
              <div onclick="openAIModal('test')" class="test-preset-card sketch-box p-4 bg-purple-50/70 hover:bg-purple-100 cursor-pointer border-purple-800">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-title font-bold text-purple-950 text-base">AI Live Generator</span>
                  <span class="text-[10px] font-typewriter bg-purple-200 text-purple-900 px-1 rounded border border-purple-700">siaptuan_premium</span>
                </div>
                <p class="text-xs font-handwrite text-purple-800 text-sm">
                  Generate 15 soal baru secara dinamis menggunakan API OpenAI Compatible!
                </p>
                <div class="mt-3 text-xs font-typewriter text-purple-900 font-bold">✨ Unlimited Soal</div>
              </div>
            </div>

            <!-- Start Button -->
            <div class="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button onclick="startStandardTest15()" class="sketch-btn bg-emerald-600 hover:bg-emerald-700 text-white text-base px-6 py-2.5 flex items-center justify-center space-x-2">
                <i class="fa-solid fa-circle-play text-lg"></i>
                <span>Mulai Sesi Ujian Sekarang</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Active Exam Screen -->
        <div id="testActiveContainer" class="hidden space-y-4">
          
          <!-- Exam Control Sticky Top Bar -->
          <div class="sketch-box p-3 sm:p-4 bg-white flex flex-wrap items-center justify-between gap-3 sticky top-16 z-30 shadow-sketch-sm">
            <div class="flex items-center space-x-3">
              <span class="ink-stamp ink-stamp-gold text-xs" id="activeTestBadge">TOEFL ITP 15 SOAL</span>
              <span class="font-typewriter text-xs text-stone-600 font-bold" id="activeQuestionCounter">Soal 1 / 15</span>
            </div>

            <!-- Countdown Timer -->
            <div class="flex items-center space-x-2 bg-stone-900 text-amber-300 font-typewriter px-3.5 py-1.5 rounded-lg border-2 border-stone-700 shadow-sketch-sm">
              <i class="fa-regular fa-clock text-sm"></i>
              <span class="text-base font-bold" id="examTimerDisplay">25:00</span>
            </div>

            <div class="flex items-center space-x-2">
              <button onclick="flagCurrentQuestion()" id="flagBtn" class="sketch-btn bg-amber-100 hover:bg-amber-200 text-stone-800 text-xs px-2.5 py-1.5 flex items-center space-x-1">
                <i class="fa-solid fa-flag text-amber-700"></i>
                <span class="hidden sm:inline">Ragu-ragu</span>
              </button>
              <button onclick="clearCurrentAnswer()" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs px-2.5 py-1.5">
                Hapus
              </button>
              <button onclick="confirmSubmitTest()" class="sketch-btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 font-bold">
                <i class="fa-solid fa-check-double mr-1"></i> Submit Tes
              </button>
            </div>
          </div>

          <!-- Main Question Area + Right Side Palette Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            <!-- Left 3 Columns: Question Sheet -->
            <div class="lg:col-span-3 space-y-4">
              <div class="sketch-box p-6 sm:p-8 bg-white min-h-[420px] flex flex-col justify-between relative">
                
                <div class="space-y-4">
                  <!-- Section & Skill Tag -->
                  <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-stone-200 pb-2.5">
                    <div class="flex items-center space-x-2">
                      <span class="text-xs font-typewriter font-bold bg-amber-100 border border-stone-700 px-2 py-0.5 rounded" id="qSectionTag">STRUCTURE</span>
                      <span class="text-xs font-handwrite text-stone-600 font-bold" id="qSkillTag">Skill: Subject-Verb Agreement</span>
                    </div>
                    <!-- Audio Reader for Listening questions -->
                    <div id="qAudioContainer" class="hidden">
                      <button onclick="playListeningAudioSpeech()" class="sketch-btn bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs px-2.5 py-1 flex items-center space-x-1">
                        <i class="fa-solid fa-volume-high text-blue-700"></i>
                        <span>Putar Audio Percakapan</span>
                      </button>
                    </div>
                  </div>

                  <!-- Passage or Context Box -->
                  <div id="qPassageBox" class="hidden p-4 bg-stone-50 border-2 border-dashed border-stone-400 rounded-lg font-typewriter text-xs sm:text-sm text-stone-800 leading-relaxed max-h-48 overflow-y-auto">
                  </div>

                  <!-- Question Text -->
                  <div class="font-sans text-base sm:text-lg font-semibold text-stone-900 pt-2" id="qPromptText">
                  </div>

                  <!-- 4 Options (A, B, C, D) -->
                  <div class="space-y-3 pt-2" id="qOptionsContainer">
                  </div>
                </div>

                <!-- Bottom Navigation Buttons -->
                <div class="flex items-center justify-between border-t-2 border-stone-200 pt-4 mt-6">
                  <button onclick="prevQuestion()" id="prevQBtn" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2 text-sm flex items-center space-x-1.5">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>Sebelumnya</span>
                  </button>

                  <div class="font-handwrite text-stone-500 text-sm hidden sm:block">
                    Klik opsi A, B, C, atau D untuk menjawab
                  </div>

                  <button onclick="nextQuestion()" id="nextQBtn" class="sketch-btn bg-amber-200 hover:bg-amber-300 text-stone-900 px-4 py-2 text-sm flex items-center space-x-1.5">
                    <span>Selanjutnya</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>

              </div>
            </div>

            <!-- Right 1 Column: Question Palette (1-15) -->
            <div class="lg:col-span-1 space-y-4">
              <div class="sketch-box p-4 bg-[#faf8f3]">
                <div class="font-title font-bold text-stone-900 text-sm border-b-2 border-stone-300 pb-1.5 mb-3 flex justify-between items-center">
                  <span>Lembar Jawaban 1-15</span>
                  <span class="text-xs font-typewriter text-stone-500"><span id="paletteAnsweredCount">0</span>/15 Terisi</span>
                </div>

                <div class="grid grid-cols-5 gap-2" id="questionPaletteGrid">
                </div>

                <!-- Palette Legend -->
                <div class="mt-4 pt-3 border-t border-stone-300 space-y-1.5 text-[11px] font-handwrite text-stone-700">
                  <div class="flex items-center space-x-2">
                    <span class="w-3.5 h-3.5 rounded bg-emerald-200 border border-stone-700 inline-block"></span>
                    <span>Sudah Dijawab</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="w-3.5 h-3.5 rounded bg-amber-200 border border-stone-700 inline-block"></span>
                    <span>Ditandai Ragu-ragu</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="w-3.5 h-3.5 rounded bg-white border border-stone-700 inline-block"></span>
                    <span>Belum Dijawab</span>
                  </div>
                </div>
              </div>

              <div class="sticky-note p-3 rounded text-xs font-handwrite text-stone-900">
                <div class="font-bold border-b border-amber-400 pb-1 mb-1">
                  💡 Tips Strategi TOEFL
                </div>
                <p>
                  Jangan pernah biarkan lembar jawaban kosong! Tidak ada pengurangan nilai untuk jawaban salah pada tes TOEFL ITP.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>

      <!-- VIEW 4: PEMBAHASAN DETAIL & AI TUTOR (EXPLANATIONS FOR EVERY QUESTION) -->
      <section id="view-pembahasan" class="app-view hidden space-y-6">
        
        <!-- Score & Achievement Summary Banner -->
        <div class="sketch-box p-6 bg-white space-y-4" id="reviewSummaryCard">
          <div class="washi-tape"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-stone-200 pb-4">
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="ink-stamp ink-stamp-pass text-xs" id="reviewStamp">SELESAI DIUJI</span>
                <span class="text-xs font-typewriter text-stone-500" id="reviewDate">Tanggal: -</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-title font-bold text-stone-900">
                Hasil & Pembahasan 15 Soal TOEFL ITP
              </h2>
              <p class="text-xs font-handwrite text-stone-600 text-base">
                Setiap butir soal dianalisis secara lengkap. Pelajari alasan jawaban benar, jebakan opsi salah, dan tanyakan kepada AI Guru jika ada yang belum jelas!
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button onclick="retakeCurrentTest()" class="sketch-btn bg-amber-200 hover:bg-amber-300 text-stone-900 text-xs sm:text-sm px-3.5 py-2">
                <i class="fa-solid fa-rotate-right mr-1"></i> Kerjakan Ulang
              </button>
              <button onclick="printExplanationReport()" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm px-3 py-2">
                <i class="fa-solid fa-print mr-1"></i> Cetak Pembahasan
              </button>
            </div>
          </div>

          <!-- Score Metrics Row -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div class="p-3 bg-amber-50/80 rounded border-2 border-stone-700 text-center">
              <span class="text-[11px] font-typewriter text-stone-600 block">JAWABAN BENAR</span>
              <span class="text-2xl font-title font-bold text-emerald-800" id="reviewCorrectCount">0 / 15</span>
            </div>
            <div class="p-3 bg-blue-50/80 rounded border-2 border-stone-700 text-center">
              <span class="text-[11px] font-typewriter text-stone-600 block">ESTIMASI SKOR ITP</span>
              <span class="text-2xl font-title font-bold text-blue-900" id="reviewScaledScore">310</span>
            </div>
            <div class="p-3 bg-purple-50/80 rounded border-2 border-stone-700 text-center">
              <span class="text-[11px] font-typewriter text-stone-600 block">AKURASI</span>
              <span class="text-2xl font-title font-bold text-purple-900" id="reviewPercentage">0%</span>
            </div>
            <div class="p-3 bg-stone-100 rounded border-2 border-stone-700 text-center">
              <span class="text-[11px] font-typewriter text-stone-600 block">WAKTU TERPAKAI</span>
              <span class="text-2xl font-title font-bold text-stone-800" id="reviewTimeSpent">00:00</span>
            </div>
          </div>
        </div>

        <!-- Filter & Search Soal Pembahasan -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap gap-1.5" id="reviewFilterBtns">
            <button onclick="filterReviewQuestions('ALL')" class="review-filter-btn sketch-btn bg-stone-800 text-amber-200 text-xs px-3 py-1.5 active">
              Semua Soal (15)
            </button>
            <button onclick="filterReviewQuestions('CORRECT')" class="review-filter-btn sketch-btn bg-white text-emerald-800 text-xs px-3 py-1.5">
              Jawaban Benar (<span id="revFilterCorrect">0</span>)
            </button>
            <button onclick="filterReviewQuestions('WRONG')" class="review-filter-btn sketch-btn bg-white text-rose-800 text-xs px-3 py-1.5">
              Jawaban Salah (<span id="revFilterWrong">0</span>)
            </button>
            <button onclick="filterReviewQuestions('FLAGGED')" class="review-filter-btn sketch-btn bg-white text-amber-800 text-xs px-3 py-1.5">
              Ragu-ragu (<span id="revFilterFlagged">0</span>)
            </button>
          </div>

          <span class="text-xs font-handwrite text-stone-600">Klik "Tanya Guru AI" pada soal manapun untuk pendalaman materi.</span>
        </div>

        <!-- List of 15 Question Explanations -->
        <div class="space-y-6" id="reviewQuestionsList">
        </div>

      </section>

      <!-- VIEW 5: MASTER DATA & BANK SOAL (DATA MANAGEMENT) -->
      <section id="view-master-data" class="app-view hidden space-y-6">
        
        <!-- Top Toolbar -->
        <div class="sketch-box p-5 bg-white space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-stone-200 pb-3">
            <div>
              <h2 class="text-2xl font-title font-bold text-stone-900">
                Bank Data Soal & Master Arsip Ujian
              </h2>
              <p class="text-xs font-handwrite text-stone-600 text-base">
                Manajemen kumpulan paket 15 soal, riwayat ujian pengguna, dan ekspor data ke format CSV / Excel.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button onclick="openAIModal('test')" class="sketch-btn bg-amber-200 hover:bg-amber-300 text-stone-900 text-xs px-3 py-2 flex items-center space-x-1">
                <i class="fa-solid fa-plus text-amber-800"></i>
                <span>Generate Paket AI Baru</span>
              </button>
              <button onclick="exportHistoryCSV()" class="sketch-btn bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs px-3 py-2 flex items-center space-x-1">
                <i class="fa-solid fa-file-csv text-emerald-700"></i>
                <span>Export Data CSV</span>
              </button>
              <button onclick="printMasterTable()" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-3 py-2">
                <i class="fa-solid fa-print"></i>
              </button>
            </div>
          </div>

          <!-- Filter & Search Controls -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-typewriter font-bold text-stone-600 mb-1">PENCARIAN</label>
              <input type="text" id="masterDataSearch" placeholder="Cari nama paket, topik..." 
                     class="w-full text-xs font-sans bg-stone-50 border-2 border-stone-600 rounded px-3 py-1.5 focus:outline-none focus:bg-white"
                     onkeyup="renderMasterDataTable()" />
            </div>
            <div>
              <label class="block text-[11px] font-typewriter font-bold text-stone-600 mb-1">KATEGORI</label>
              <select id="masterDataCategoryFilter" class="w-full text-xs font-sans bg-stone-50 border-2 border-stone-600 rounded px-3 py-1.5 focus:outline-none focus:bg-white" onchange="renderMasterDataTable()">
                <option value="ALL">Semua Kategori</option>
                <option value="MIX">Full Mix (15 Soal)</option>
                <option value="STRUCTURE">Structure & Written Expression</option>
                <option value="LISTENING">Listening Comprehension</option>
                <option value="READING">Reading Comprehension</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-typewriter font-bold text-stone-600 mb-1">STATUS SKOR</label>
              <select id="masterDataStatusFilter" class="w-full text-xs font-sans bg-stone-50 border-2 border-stone-600 rounded px-3 py-1.5 focus:outline-none focus:bg-white" onchange="renderMasterDataTable()">
                <option value="ALL">Semua Status</option>
                <option value="EXCELLENT">Sangat Baik (Skor ≥ 550)</option>
                <option value="GOOD">Cukup Baik (450 - 540)</option>
                <option value="NEEDS_PRACTICE">Perlu Latihan (&lt; 450)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- High-Density Data Table -->
        <div class="sketch-box p-5 bg-white space-y-4">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr class="border-b-2 border-stone-700 font-typewriter text-xs text-stone-600 bg-stone-50">
                  <th class="p-2.5 cursor-pointer" onclick="sortMasterData('date')">
                    WAKTU <i class="fa-solid fa-sort text-stone-400"></i>
                  </th>
                  <th class="p-2.5">PAKET SOAL</th>
                  <th class="p-2.5">SEKSI / TIPE</th>
                  <th class="p-2.5 text-center cursor-pointer" onclick="sortMasterData('score')">
                    SKOR ITP <i class="fa-solid fa-sort text-stone-400"></i>
                  </th>
                  <th class="p-2.5 text-center">AKURASI</th>
                  <th class="p-2.5 text-center">STATUS</th>
                  <th class="p-2.5 text-right">TINDAKAN</th>
                </tr>
              </thead>
              <tbody id="masterDataTableBody" class="divide-y divide-stone-200 font-sans">
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-200 text-xs font-typewriter text-stone-600">
            <div>
              Menampilkan <span id="masterPaginationInfo">1 - 10 dari 25 data</span>
            </div>
            <div class="flex items-center space-x-1" id="masterPaginationButtons">
            </div>
          </div>
        </div>

      </section>

      <!-- VIEW 6: KANBAN TARGET BELAJAR (WORKFLOW MANAGEMENT) -->
      <section id="view-kanban" class="app-view hidden space-y-6">
        
        <!-- Header -->
        <div class="sketch-box p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center space-x-2">
              <span class="ink-stamp ink-stamp-gold text-xs">WORKFLOW</span>
              <span class="text-xs font-typewriter text-stone-600">Study Management Board</span>
            </div>
            <h2 class="text-2xl font-title font-bold text-stone-900 mt-1">
              Kanban Target & Rencana Belajar
            </h2>
            <p class="text-xs font-handwrite text-stone-600 text-base">
              Kelola topik TOEFL yang sedang dipelajari, dijadwalkan untuk latihan soal, hingga yang sudah dikuasai.
            </p>
          </div>
          <button onclick="openAddKanbanModal()" class="sketch-btn bg-amber-200 hover:bg-amber-300 text-stone-900 text-xs sm:text-sm px-3.5 py-2 flex items-center space-x-1">
            <i class="fa-solid fa-plus text-amber-800"></i>
            <span>Tambah Target Baru</span>
          </button>
        </div>

        <!-- 4 Kanban Columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          
          <!-- Column 1: Backlog -->
          <div class="sketch-box p-3 bg-[#faf6ee] flex flex-col min-h-[450px]">
            <div class="flex justify-between items-center border-b-2 border-stone-700 pb-2 mb-3">
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-stone-400 border border-stone-700"></span>
                <h3 class="font-title font-bold text-sm text-stone-900">Belum Dipelajari</h3>
              </div>
              <span class="font-typewriter text-xs font-bold bg-stone-200 px-1.5 py-0.5 rounded border border-stone-600" id="countColBacklog">0</span>
            </div>
            <div class="kanban-dropzone flex-1 space-y-3" id="kanbanColBacklog" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'backlog')">
            </div>
          </div>

          <!-- Column 2: In Progress -->
          <div class="sketch-box p-3 bg-amber-50/60 flex flex-col min-h-[450px]">
            <div class="flex justify-between items-center border-b-2 border-amber-700 pb-2 mb-3">
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-amber-400 border border-stone-700"></span>
                <h3 class="font-title font-bold text-sm text-stone-900">Sedang Dipelajari</h3>
              </div>
              <span class="font-typewriter text-xs font-bold bg-amber-200 px-1.5 py-0.5 rounded border border-amber-700" id="countColInProgress">0</span>
            </div>
            <div class="kanban-dropzone flex-1 space-y-3" id="kanbanColInProgress" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'in_progress')">
            </div>
          </div>

          <!-- Column 3: Testing -->
          <div class="sketch-box p-3 bg-blue-50/60 flex flex-col min-h-[450px]">
            <div class="flex justify-between items-center border-b-2 border-blue-700 pb-2 mb-3">
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-blue-400 border border-stone-700"></span>
                <h3 class="font-title font-bold text-sm text-stone-900">Latihan 15 Soal</h3>
              </div>
              <span class="font-typewriter text-xs font-bold bg-blue-200 px-1.5 py-0.5 rounded border border-blue-700" id="countColTesting">0</span>
            </div>
            <div class="kanban-dropzone flex-1 space-y-3" id="kanbanColTesting" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'testing')">
            </div>
          </div>

          <!-- Column 4: Mastered -->
          <div class="sketch-box p-3 bg-emerald-50/60 flex flex-col min-h-[450px]">
            <div class="flex justify-between items-center border-b-2 border-emerald-700 pb-2 mb-3">
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-emerald-400 border border-stone-700"></span>
                <h3 class="font-title font-bold text-sm text-stone-900">Sudah Dikuasai</h3>
              </div>
              <span class="font-typewriter text-xs font-bold bg-emerald-200 px-1.5 py-0.5 rounded border border-emerald-700" id="countColDone">0</span>
            </div>
            <div class="kanban-dropzone flex-1 space-y-3" id="kanbanColDone" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'done')">
            </div>
          </div>

        </div>

      </section>

      <!-- VIEW 7: ANALYTICS & LAPORAN EVALUASI -->
      <section id="view-analytics" class="app-view hidden space-y-6">
        
        <!-- Header -->
        <div class="sketch-box p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center space-x-2">
              <span class="ink-stamp ink-stamp-pass text-xs">RAPOR EVALUASI</span>
              <span class="text-xs font-typewriter text-stone-600">Proyeksi Skor 310 - 677</span>
            </div>
            <h2 class="text-2xl font-title font-bold text-stone-900 mt-1">
              Analisis Kemajuan & Diagnosis Kelemahan
            </h2>
            <p class="text-xs font-handwrite text-stone-600 text-base">
              Grafik perkembangan skor dari waktu ke waktu serta rekomendasi strategi belajar berbasis AI.
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button onclick="printAnalyticsReport()" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm px-3.5 py-2">
              <i class="fa-solid fa-print mr-1"></i> Cetak Laporan
            </button>
            <button onclick="exportHistoryCSV()" class="sketch-btn bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs sm:text-sm px-3.5 py-2">
              <i class="fa-solid fa-file-arrow-down mr-1"></i> Export Data
            </button>
          </div>
        </div>

        <!-- 2 Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Line Chart: Score Progression -->
          <div class="sketch-box p-5 bg-white space-y-3">
            <h3 class="font-title font-bold text-base text-stone-900 flex items-center space-x-2">
              <i class="fa-solid fa-chart-line text-emerald-700"></i>
              <span>Tren Skor TOEFL ITP (Scaled Score)</span>
            </h3>
            <div class="h-64">
              <canvas id="analyticsLineChart"></canvas>
            </div>
            <p class="text-xs font-handwrite text-stone-500">Target kelulusan adalah garis merah (550).</p>
          </div>

          <!-- Bar Chart: Accuracy per Section -->
          <div class="sketch-box p-5 bg-white space-y-3">
            <h3 class="font-title font-bold text-base text-stone-900 flex items-center space-x-2">
              <i class="fa-solid fa-chart-simple text-blue-700"></i>
              <span>Akurasi Jawaban per Kategori Soal</span>
            </h3>
            <div class="h-64">
              <canvas id="analyticsBarChart"></canvas>
            </div>
            <p class="text-xs font-handwrite text-stone-500">Evaluasi kekuatan relatif antar 3 bagian tes.</p>
          </div>
        </div>

        <!-- Diagnostic Feedback & Weakness Insights -->
        <div class="sketch-box p-6 bg-[#fffdf7] space-y-4">
          <div class="flex items-center space-x-2 border-b-2 border-stone-200 pb-2">
            <i class="fa-solid fa-stethoscope text-rose-700 text-lg"></i>
            <h3 class="font-title font-bold text-lg text-stone-900">Diagnosis Kelemahan & Rekomendasi Belajar</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-handwrite text-base">
            <!-- Strengths -->
            <div class="p-4 bg-emerald-50 rounded-lg border-2 border-emerald-700">
              <div class="font-bold text-emerald-950 flex items-center space-x-1.5 mb-1.5">
                <i class="fa-solid fa-circle-check text-emerald-700"></i>
                <span class="font-title">Kekuatan Tertinggi</span>
              </div>
              <p class="text-sm text-emerald-900" id="analyticsStrengthText">
                - Penguasaan Subject-Verb Agreement sangat konsisten (90% akurat).<br/>
                - Pemahaman Vocabulary in Context pada reading passage sangat baik.
              </p>
            </div>

            <!-- Weaknesses -->
            <div class="p-4 bg-rose-50 rounded-lg border-2 border-rose-700">
              <div class="font-bold text-rose-950 flex items-center space-x-1.5 mb-1.5">
                <i class="fa-solid fa-triangle-exclamation text-rose-700"></i>
                <span class="font-title">Perlu Perhatian Khusus</span>
              </div>
              <p class="text-sm text-rose-900" id="analyticsWeaknessText">
                - Inversion with Negative Expressions sering terjebak.<br/>
                - Dialog pendek dengan idiom dan ungkapan negatif ganda (double negative).
              </p>
            </div>

            <!-- AI Action Plan -->
            <div class="p-4 bg-amber-50 rounded-lg border-2 border-amber-700">
              <div class="font-bold text-amber-950 flex items-center space-x-1.5 mb-1.5">
                <i class="fa-solid fa-wand-magic-sparkles text-amber-700"></i>
                <span class="font-title">Rencana Tindakan AI</span>
              </div>
              <p class="text-sm text-amber-900">
                Generate 1 paket soal <b>Structure Intensive</b> berfokus pada Inversion & Participle Clauses untuk menaikkan estimasi skor menjadi di atas 580.
              </p>
            </div>
          </div>
        </div>

      </section>

      <!-- VIEW 8: PENGATURAN SISTEM, TEMA & API CONFIG -->
      <section id="view-settings" class="app-view hidden space-y-6">
        
        <!-- Header -->
        <div class="sketch-box p-5 bg-white">
          <h2 class="text-2xl font-title font-bold text-stone-900">
            Pengaturan Sistem, Profil & Kredensial AI
          </h2>
          <p class="text-xs font-handwrite text-stone-600 text-base">
            Sesuaikan preferensi tema sketsa, identitas pengguna, serta koneksi endpoint API OpenAI Compatible.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Column 1: API Configuration -->
          <div class="sketch-box p-6 bg-white space-y-4">
            <div class="flex items-center justify-between border-b-2 border-stone-200 pb-2">
              <div class="flex items-center space-x-2">
                <i class="fa-solid fa-robot text-amber-700 text-lg"></i>
                <h3 class="font-title font-bold text-lg text-stone-900">Konfigurasi AI Provider</h3>
              </div>
              <span class="ink-stamp ink-stamp-gold text-[10px]">OpenAI Compatible</span>
            </div>

            <div class="space-y-3 font-sans text-xs">
              <div>
                <label class="block font-typewriter font-bold text-stone-700 mb-1">BASE URL API</label>
                <input type="text" id="settingApiBaseUrl" value="https://siaptuan.my.id/v1" 
                       class="w-full sketch-input px-3 py-2 text-stone-800 font-typewriter" />
              </div>

              <div>
                <label class="block font-typewriter font-bold text-stone-700 mb-1">API KEY</label>
                <div class="relative">
                  <input type="password" id="settingApiKey" value="sk_portal_3f768521be1a205890f9ba4d4a87fed8aed0df0604f44738" 
                         class="w-full sketch-input px-3 py-2 pr-10 text-stone-800 font-typewriter" />
                  <button onclick="toggleApiKeyVisibility()" type="button" class="absolute right-2.5 top-2.5 text-stone-500 hover:text-stone-800">
                    <i class="fa-solid fa-eye" id="apiKeyEyeIcon"></i>
                  </button>
                </div>
              </div>

              <div>
                <label class="block font-typewriter font-bold text-stone-700 mb-1">MODEL NAME</label>
                <input type="text" id="settingApiModel" value="siaptuan_premium" 
                       class="w-full sketch-input px-3 py-2 text-stone-800 font-typewriter font-bold" />
              </div>

              <div class="pt-2 flex items-center space-x-2">
                <button onclick="saveApiSettings()" class="sketch-btn bg-amber-200 hover:bg-amber-300 text-stone-900 px-4 py-2 text-xs">
                  <i class="fa-solid fa-floppy-disk mr-1"></i> Simpan Konfigurasi
                </button>
                <button onclick="testApiConnection()" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-2 text-xs">
                  <i class="fa-solid fa-plug-circle-check mr-1"></i> Tes Koneksi
                </button>
              </div>
            </div>
          </div>

          <!-- Column 2: User Profile & Target -->
          <div class="sketch-box p-6 bg-white space-y-4">
            <div class="flex items-center space-x-2 border-b-2 border-stone-200 pb-2">
              <i class="fa-solid fa-user-pen text-blue-700 text-lg"></i>
              <h3 class="font-title font-bold text-lg text-stone-900">Profil & Target Belajar</h3>
            </div>

            <div class="space-y-3 font-sans text-xs">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-typewriter font-bold text-stone-700 mb-1">NAMA PENGGUNA</label>
                  <input type="text" id="settingUserName" value="Dermawan Purba" 
                         class="w-full sketch-input px-3 py-2 text-stone-800" />
                </div>
                <div>
                  <label class="block font-typewriter font-bold text-stone-700 mb-1">INISIAL / AVATAR</label>
                  <input type="text" id="settingUserInitial" value="DP" maxlength="3" 
                         class="w-full sketch-input px-3 py-2 text-stone-800 font-bold" />
                </div>
              </div>

              <div>
                <label class="block font-typewriter font-bold text-stone-700 mb-1">EMAIL / KONTAK</label>
                <input type="email" id="settingUserEmail" value="dermawan.prb@gmail.com" 
                       class="w-full sketch-input px-3 py-2 text-stone-800" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-typewriter font-bold text-stone-700 mb-1">TARGET SKOR TOEFL ITP</label>
                  <select id="settingTargetScore" class="w-full sketch-input px-3 py-2 text-stone-800 font-bold">
                    <option value="500+">500+ (Standar S1 / BUMN)</option>
                    <option value="550+" selected>550+ (Beasiswa LPDP / S2)</option>
                    <option value="600+">600+ (Skor Unggul Luar Negeri)</option>
                    <option value="650+">650+ (Mastery Level)</option>
                  </select>
                </div>
                <div>
                  <label class="block font-typewriter font-bold text-stone-700 mb-1">UPLOAD LOGO KUSTOM</label>
                  <input type="file" id="settingLogoFile" accept="image/*" onchange="handleLogoUpload(event)"
                         class="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-2 file:border-stone-700 file:text-xs file:font-sketch file:bg-amber-100 hover:file:bg-amber-200 cursor-pointer" />
                </div>
              </div>

              <div class="pt-2">
                <button onclick="saveUserProfile()" class="sketch-btn bg-blue-100 hover:bg-blue-200 text-blue-950 px-4 py-2 text-xs">
                  <i class="fa-solid fa-id-badge mr-1"></i> Perbarui Profil
                </button>
              </div>
            </div>
          </div>

          <!-- Live Theme Picker -->
          <div class="sketch-box p-6 bg-white space-y-4 lg:col-span-2">
            <div class="flex items-center justify-between border-b-2 border-stone-200 pb-2">
              <div class="flex items-center space-x-2">
                <i class="fa-solid fa-palette text-purple-700 text-lg"></i>
                <h3 class="font-title font-bold text-lg text-stone-900">Tema Sketsa Kertas & Palet Warna</h3>
              </div>
              <span class="text-xs font-handwrite text-stone-500">Live Dynamic Update</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <!-- Preset 1 -->
              <div onclick="applyThemePreset('parchment')" class="p-3 rounded-lg border-2 border-stone-800 bg-[#fbf8f1] cursor-pointer hover:shadow-sketch-sm">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="w-4 h-4 rounded-full bg-[#fef3c7] border border-stone-800"></span>
                  <span class="w-4 h-4 rounded-full bg-[#57534e] border border-stone-800"></span>
                </div>
                <div class="font-sketch font-bold text-stone-900 text-sm">Parchment Warm (Default)</div>
                <div class="text-[11px] font-handwrite text-stone-600">Kertas tua guratan pensil</div>
              </div>

              <!-- Preset 2 -->
              <div onclick="applyThemePreset('classic')" class="p-3 rounded-lg border-2 border-stone-800 bg-[#ffffff] cursor-pointer hover:shadow-sketch-sm">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="w-4 h-4 rounded-full bg-[#e2e8f0] border border-stone-800"></span>
                  <span class="w-4 h-4 rounded-full bg-[#334155] border border-stone-800"></span>
                </div>
                <div class="font-sketch font-bold text-stone-900 text-sm">Classic Notebook</div>
                <div class="text-[11px] font-handwrite text-stone-600">Buku tulis putih bersih</div>
              </div>

              <!-- Preset 3 -->
              <div onclick="applyThemePreset('kraft')" class="p-3 rounded-lg border-2 border-stone-800 bg-[#f7eedd] cursor-pointer hover:shadow-sketch-sm">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="w-4 h-4 rounded-full bg-[#fed7aa] border border-stone-800"></span>
                  <span class="w-4 h-4 rounded-full bg-[#451a03] border border-stone-800"></span>
                </div>
                <div class="font-sketch font-bold text-stone-900 text-sm">Vintage Kraft</div>
                <div class="text-[11px] font-handwrite text-stone-600">Kertas cokelat retro</div>
              </div>

              <!-- Preset 4 -->
              <div onclick="applyThemePreset('blueprint')" class="p-3 rounded-lg border-2 border-stone-800 bg-[#f0f9ff] cursor-pointer hover:shadow-sketch-sm">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="w-4 h-4 rounded-full bg-[#bae6fd] border border-stone-800"></span>
                  <span class="w-4 h-4 rounded-full bg-[#0c4a6e] border border-stone-800"></span>
                </div>
                <div class="font-sketch font-bold text-stone-900 text-sm">Drafting Blueprint</div>
                <div class="text-[11px] font-handwrite text-stone-600">Sketsa biru teknik</div>
              </div>
            </div>

            <!-- Custom HEX Pickers -->
            <div class="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
              <div>
                <label class="block font-typewriter font-bold text-stone-700 mb-1">PRIMARY ACCENT</label>
                <div class="flex items-center space-x-2">
                  <input type="color" id="themePrimaryPicker" value="#fef3c7" onchange="updateCustomColors()" class="w-8 h-8 rounded border-2 border-stone-700 cursor-pointer" />
                  <input type="text" id="themePrimaryText" value="#fef3c7" readonly class="sketch-input px-2 py-1 text-xs w-24 font-typewriter" />
                </div>
              </div>

              <div>
                <label class="block font-typewriter font-bold text-stone-700 mb-1">SECONDARY ACCENT</label>
                <div class="flex items-center space-x-2">
                  <input type="color" id="themeSecondaryPicker" value="#57534e" onchange="updateCustomColors()" class="w-8 h-8 rounded border-2 border-stone-700 cursor-pointer" />
                  <input type="text" id="themeSecondaryText" value="#57534e" readonly class="sketch-input px-2 py-1 text-xs w-24 font-typewriter" />
                </div>
              </div>

              <div>
                <label class="block font-typewriter font-bold text-stone-700 mb-1">PAPER BACKGROUND</label>
                <div class="flex items-center space-x-2">
                  <input type="color" id="themeBgPicker" value="#fbf8f1" onchange="updateCustomColors()" class="w-8 h-8 rounded border-2 border-stone-700 cursor-pointer" />
                  <input type="text" id="themeBgText" value="#fbf8f1" readonly class="sketch-input px-2 py-1 text-xs w-24 font-typewriter" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      <!-- MANDATORY WATERMARK (Mobile/Page Footer) -->
      <footer class="mt-8 pt-4 border-t-2 border-stone-300 no-print">
        <div style='text-align:center; font-size:12px; margin:20px 0; color:#888;'>
          develop by : dermawan.prb@gmail.com | <a href='https://www.linkedin.com/in/dermawan-purba-5b69241a9' target='_blank' style='color:#888; text-decoration:none;'>LinkedIn</a>
        </div>
      </footer>

    </main>
  </div>

  <!-- FIXED MOBILE BOTTOM NAVIGATION BAR (Height: 60px) -->
  <nav id="mobileBottomNav" class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#faf6ee] border-t-2 border-stone-800 z-40 flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(87,83,78,0.1)]">
    <button onclick="navigateTo('dashboard')" class="mobile-nav-btn flex flex-col items-center justify-center flex-1 text-stone-700 hover:text-amber-800">
      <i class="fa-solid fa-chalkboard-user text-base"></i>
      <span class="text-[10px] font-sketch font-bold mt-0.5">Home</span>
    </button>

    <button onclick="navigateTo('materi')" class="mobile-nav-btn flex flex-col items-center justify-center flex-1 text-stone-700 hover:text-blue-800">
      <i class="fa-solid fa-book-open-reader text-base"></i>
      <span class="text-[10px] font-sketch font-bold mt-0.5">Materi</span>
    </button>

    <button onclick="navigateTo('test-center')" class="mobile-nav-btn flex flex-col items-center justify-center flex-1 text-emerald-800 font-bold">
      <div class="w-10 h-10 -mt-5 rounded-full border-2 border-stone-800 bg-emerald-500 text-white flex items-center justify-center shadow-sketch-sm">
        <i class="fa-solid fa-pen-nib text-sm"></i>
      </div>
      <span class="text-[10px] font-sketch font-bold mt-0.5">Tes 15</span>
    </button>

    <button onclick="navigateTo('pembahasan')" class="mobile-nav-btn flex flex-col items-center justify-center flex-1 text-stone-700 hover:text-indigo-800">
      <i class="fa-solid fa-magnifying-glass-chart text-base"></i>
      <span class="text-[10px] font-sketch font-bold mt-0.5">Review</span>
    </button>

    <button onclick="toggleMobileSidebar()" class="mobile-nav-btn flex flex-col items-center justify-center flex-1 text-stone-700 hover:text-stone-900">
      <i class="fa-solid fa-bars text-base"></i>
      <span class="text-[10px] font-sketch font-bold mt-0.5">Menu</span>
    </button>
  </nav>

  <!-- MODALS -->
  <!-- MODAL: AI GENERATOR (Materi or Test) -->
  <div id="aiGeneratorModal" class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="sketch-box p-6 bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 relative" onclick="event.stopPropagation()">
      <div class="washi-tape"></div>
      
      <div class="flex justify-between items-start border-b-2 border-stone-200 pb-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded bg-amber-200 border-2 border-stone-800 flex items-center justify-center text-stone-800 shadow-sketch-sm">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div>
            <h3 class="font-title font-bold text-lg text-stone-900" id="aiModalTitle">AI Generator Materi TOEFL ITP</h3>
            <span class="text-xs font-typewriter text-amber-800 font-bold">Engine: siaptuan_premium (OpenAI Compatible)</span>
          </div>
        </div>
        <button onclick="closeAIModal()" class="text-stone-500 hover:text-stone-800 p-1">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div class="space-y-3 font-sans text-xs">
        <div>
          <label class="block font-typewriter font-bold text-stone-700 mb-1">BAGIAN TOEFL (SECTION)</label>
          <select id="aiPromptSection" class="w-full sketch-input px-3 py-2 text-stone-800 font-semibold" onchange="onAiSectionChanged()">
            <option value="STRUCTURE">Structure & Written Expression (Grammar)</option>
            <option value="LISTENING">Listening Comprehension (Dialogues & Talks)</option>
            <option value="READING">Reading Comprehension (Passages & Vocab)</option>
            <option value="MIX">Full Mix 15 Soal (5 Listening, 5 Structure, 5 Reading)</option>
          </select>
        </div>

        <div>
          <label class="flex items-center justify-between font-typewriter font-bold text-stone-700 mb-1">
            <span>TOPIK / SKILL KHUSUS</span>
            <span class="text-[10px] font-sans font-normal text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">💡 Panduan Pilihan Pemula</span>
          </label>
          <select id="aiPromptTopicSelect" class="w-full sketch-input px-3 py-2 text-stone-800 font-medium mb-1.5" onchange="onAiTopicDropdownChanged()">
            <!-- Populated dynamically by JS -->
          </select>
          <div id="aiCustomTopicWrapper" class="hidden">
            <input type="text" id="aiPromptTopic" placeholder="Contoh: Inversion, Reduced Relative Clauses, Idiom Listening, Main Idea Reading..." 
                   class="w-full sketch-input px-3 py-2 text-stone-800" />
          </div>
          <p id="aiTopicHelperText" class="text-[11px] font-handwrite text-stone-600 italic mt-0.5 leading-tight">
            Pilih kaidah materi di atas atau pilih opsi custom untuk tema khusus.
          </p>
        </div>

        <div>
          <label class="block font-typewriter font-bold text-stone-700 mb-1">INSTRUKSI TAMBAHAN (OPSIONAL)</label>
          <textarea id="aiPromptCustomNotes" rows="2" placeholder="Contoh: Berikan 3 contoh kalimat jebakan yang sering muncul di tes resmi..." 
                    class="w-full sketch-input px-3 py-2 text-stone-800"></textarea>
        </div>

        <!-- Progress Indicator -->
        <div id="aiLoadingIndicator" class="hidden p-3 bg-amber-50 rounded-lg border-2 border-amber-500 space-y-2">
          <div class="flex items-center space-x-2 text-amber-900 font-sketch font-bold text-sm">
            <i class="fa-solid fa-spinner fa-spin text-amber-700"></i>
            <span id="aiLoadingText">Menghubungi AI siaptuan_premium di siaptuan.my.id...</span>
          </div>
          <div class="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
            <div class="bg-amber-600 h-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-2 pt-2 border-t border-stone-200">
        <button onclick="closeAIModal()" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2 text-xs">
          Batal
        </button>
        <button onclick="executeAIGeneration()" id="aiSubmitBtn" class="sketch-btn bg-amber-300 hover:bg-amber-400 text-stone-900 px-5 py-2 text-xs font-bold flex items-center space-x-1.5">
          <i class="fa-solid fa-bolt"></i>
          <span>Mulai Generate AI</span>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: STUDY MATERIAL VIEWER -->
  <div id="materialReaderModal" class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-5">
    <div class="sketch-box p-5 sm:p-7 bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto space-y-4 relative flex flex-col justify-between" onclick="event.stopPropagation()">
      <div class="washi-tape"></div>

      <div class="space-y-3">
        <div class="flex justify-between items-start border-b-2 border-stone-200 pb-3">
          <div>
            <div class="flex items-center space-x-2">
              <span class="ink-stamp ink-stamp-gold text-xs" id="readerSectionBadge">STRUCTURE</span>
              <span class="text-xs font-typewriter text-stone-500" id="readerSkillCode">SKILL #1</span>
            </div>
            <h3 class="font-title font-bold text-xl sm:text-2xl text-stone-900 mt-1" id="readerTitle">Subject-Verb Agreement</h3>
          </div>
          <button onclick="closeMaterialReader()" class="text-stone-500 hover:text-stone-800 p-1">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <!-- Material Body Container -->
        <div id="readerContentBody" class="font-sans text-stone-800 text-sm leading-relaxed space-y-4 max-h-[58vh] overflow-y-auto pr-2">
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t-2 border-stone-200 mt-4">
        <div class="flex items-center space-x-2">
          <button onclick="playCurrentMaterialSpeech()" class="sketch-btn bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs px-3 py-1.5 flex items-center space-x-1">
            <i class="fa-solid fa-volume-high text-blue-700"></i>
            <span>Dengarkan (TTS)</span>
          </button>
          <button onclick="copyMaterialNotes()" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-3 py-1.5 flex items-center space-x-1">
            <i class="fa-solid fa-copy"></i>
            <span>Salin Catatan</span>
          </button>
          <button onclick="deleteMaterial(activeReadingMaterial?.id)" class="sketch-btn bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs px-3 py-1.5 flex items-center space-x-1 border border-rose-300">
            <i class="fa-solid fa-trash-can"></i>
            <span>Hapus</span>
          </button>
        </div>

        <div class="flex items-center space-x-2">
          <button id="readerBankSoalBtn" onclick="openSavedQuestionBankModal(activeReadingMaterial?.id)" class="hidden sketch-btn bg-purple-100 hover:bg-purple-200 text-purple-950 text-xs px-3 py-2 font-bold flex items-center space-x-1 border border-purple-400">
            <i class="fa-solid fa-layer-group text-purple-700"></i>
            <span id="readerBankSoalBtnText">Bank Soal AI</span>
          </button>
          <button onclick="launchQuickQuizFromMateri()" class="sketch-btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 font-bold flex items-center space-x-1.5">
            <i class="fa-solid fa-pencil"></i>
            <span>Latihan Soal Materi Ini</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: BANK SOAL AI TERPANTAU & TERSIMPAN -->
  <div id="savedQuestionBankModal" class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-5">
    <div class="sketch-box p-5 sm:p-7 bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto space-y-4 relative flex flex-col justify-between" onclick="event.stopPropagation()">
      <div class="washi-tape"></div>

      <div class="space-y-3">
        <div class="flex justify-between items-start border-b-2 border-stone-200 pb-3">
          <div>
            <div class="flex items-center space-x-2">
              <span class="ink-stamp ink-stamp-gold text-xs" id="qBankSectionBadge">STRUCTURE</span>
              <span class="text-xs font-typewriter text-purple-900 bg-purple-100 border border-purple-300 px-2 py-0.5 rounded font-bold" id="qBankCountBadge">15 Soal AI</span>
            </div>
            <h3 class="font-title font-bold text-xl sm:text-2xl text-stone-900 mt-1" id="qBankTitle">Bank Soal AI</h3>
            <p class="text-xs font-handwrite text-stone-600 text-base" id="qBankSubtitle">Koleksi butir soal hasil generasi AI siaptuan_premium yang tersimpan di memori lokal.</p>
          </div>
          <button onclick="closeSavedQuestionBankModal()" class="text-stone-500 hover:text-stone-800 p-1">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <!-- Bank Questions List -->
        <div id="qBankListContainer" class="font-sans text-stone-800 text-xs sm:text-sm space-y-4 max-h-[58vh] overflow-y-auto pr-2">
          <!-- Populated dynamically by JS -->
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t-2 border-stone-200 mt-4">
        <div class="flex items-center space-x-2">
          <button onclick="clearSavedQuestionBank()" class="sketch-btn bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs px-3 py-1.5 flex items-center space-x-1 border border-rose-300">
            <i class="fa-solid fa-trash-can"></i>
            <span>Kosongkan Bank Soal</span>
          </button>
          <button onclick="closeSavedQuestionBankModal()" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-3 py-1.5">
            Tutup
          </button>
        </div>

        <div class="flex items-center space-x-2">
          <button onclick="generateMoreQuestionsForBank()" class="sketch-btn bg-purple-100 hover:bg-purple-200 text-purple-950 text-xs px-3 py-2 font-bold flex items-center space-x-1.5 border border-purple-400">
            <i class="fa-solid fa-wand-magic-sparkles text-purple-700"></i>
            <span>+ Tambah 15 Soal (AI)</span>
          </button>
          <button onclick="startTestFromSavedBank()" class="sketch-btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 font-bold flex items-center space-x-1.5">
            <i class="fa-solid fa-play"></i>
            <span>Mulai Ujian dari Bank Soal Ini</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: TANYA GURU AI -->
  <div id="aiTutorModal" class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="sketch-box p-6 bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 relative" onclick="event.stopPropagation()">
      <div class="washi-tape"></div>

      <div class="flex justify-between items-start border-b-2 border-stone-200 pb-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded bg-indigo-200 border-2 border-stone-800 flex items-center justify-center text-indigo-900 shadow-sketch-sm">
            <i class="fa-solid fa-chalkboard-user"></i>
          </div>
          <div>
            <h3 class="font-title font-bold text-lg text-stone-900">Tanya Guru AI TOEFL</h3>
            <span class="text-xs font-typewriter text-indigo-800 font-bold" id="aiTutorQuestionTitle">Soal #1</span>
          </div>
        </div>
        <button onclick="closeAITutorModal()" class="text-stone-500 hover:text-stone-800 p-1">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Question Preview Snippet -->
      <div class="p-3 bg-stone-50 rounded border border-stone-300 font-typewriter text-xs text-stone-700" id="aiTutorQuestionSnippet">
      </div>

      <!-- Dialogue/Explanation Box -->
      <div id="aiTutorAnswerBox" class="p-4 bg-amber-50/70 rounded-lg border-2 border-amber-300 font-handwrite text-base text-stone-800 leading-relaxed min-h-[140px] max-h-60 overflow-y-auto">
        Tanyakan pertanyaan spesifik seperti: <i>"Kenapa opsi B salah?", "Bagaimana cara cepat mengenali pola kalimat ini?", atau "Berikan analogi yang lebih sederhana."</i>
      </div>

      <!-- User Query Input -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2">
          <input type="text" id="aiTutorCustomPrompt" placeholder="Ketik pertanyaan untuk Guru AI..." 
                 class="flex-1 sketch-input px-3 py-2 text-xs font-sans" onkeyup="if(event.key==='Enter') submitAITutorQuery()" />
          <button onclick="submitAITutorQuery()" id="aiTutorSendBtn" class="sketch-btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>

        <div class="flex flex-wrap gap-1.5 text-[11px] font-handwrite text-stone-600">
          <span class="font-bold">Quick Prompt:</span>
          <button onclick="setAITutorPrompt('Jelaskan kenapa jawaban saya salah dengan sangat rinci')" class="underline hover:text-indigo-800">Kenapa jawaban saya salah?</button> •
          <button onclick="setAITutorPrompt('Berikan rumus cepat dan trik 5 detik untuk soal seperti ini')" class="underline hover:text-indigo-800">Trik 5 Detik</button> •
          <button onclick="setAITutorPrompt('Berikan 2 contoh soal lain yang serupa beserta jawabannya')" class="underline hover:text-indigo-800">Contoh Serupa</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: ADD KANBAN ITEM -->
  <div id="kanbanModal" class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="sketch-box p-6 bg-white w-full max-w-md space-y-4 relative" onclick="event.stopPropagation()">
      <div class="washi-tape"></div>
      
      <div class="flex justify-between items-center border-b-2 border-stone-200 pb-2">
        <h3 class="font-title font-bold text-lg text-stone-900">Tambah Target Belajar</h3>
        <button onclick="closeAddKanbanModal()" class="text-stone-500 hover:text-stone-800">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div class="space-y-3 font-sans text-xs">
        <div>
          <label class="block font-typewriter font-bold text-stone-700 mb-1">JUDUL TOPIK / MATERI</label>
          <input type="text" id="kanbanInputTitle" placeholder="Contoh: Inversion after Place Prepositions" class="w-full sketch-input px-3 py-2 text-stone-800" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-typewriter font-bold text-stone-700 mb-1">BAGIAN (SECTION)</label>
            <select id="kanbanInputSection" class="w-full sketch-input px-3 py-2 text-stone-800 font-semibold">
              <option value="STRUCTURE">Structure & Written</option>
              <option value="LISTENING">Listening</option>
              <option value="READING">Reading</option>
            </select>
          </div>
          <div>
            <label class="block font-typewriter font-bold text-stone-700 mb-1">PRIORITAS</label>
            <select id="kanbanInputPriority" class="w-full sketch-input px-3 py-2 text-stone-800 font-bold">
              <option value="Urgent">🔥 Urgent</option>
              <option value="High" selected>⭐ High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-typewriter font-bold text-stone-700 mb-1">TARGET TANGGAL</label>
          <input type="date" id="kanbanInputDate" class="w-full sketch-input px-3 py-2 text-stone-800" />
        </div>
      </div>

      <div class="flex justify-end space-x-2 pt-2 border-t border-stone-200">
        <button onclick="closeAddKanbanModal()" class="sketch-btn bg-stone-100 text-stone-800 px-3 py-1.5 text-xs">Batal</button>
        <button onclick="saveNewKanbanCard()" class="sketch-btn bg-amber-300 text-stone-900 px-4 py-1.5 text-xs font-bold">Simpan Target</button>
      </div>
    </div>
  </div>

  <!-- JAVASCRIPT APPLICATION CORE ENGINE -->
  <script>
    const APP_CONFIG = {
      defaultApiBaseUrl: 'https://siaptuan.my.id/v1',
      defaultApiKey: 'sk_portal_3f768521be1a205890f9ba4d4a87fed8aed0df0604f44738',
      defaultModel: 'siaptuan_premium',
      examDurationSeconds: 25 * 60,
      // === GABUNGAN 1 TEMPAT (LARAVEL UNIFIED - PEMULA FRIENDLY) ===
      // Prioritas: Laravel API /api/ai/chat (tidak perlu proxy.php lagi)
      proxyUrl: '/api/ai/chat',
      healthUrl: '/api/ai/health',
      fallbackProxyUrl: './proxy.php',
      fallbackLocalUrl: 'http://localhost/B%20INGGRIS/proxy.php'
    };

    async function aiChatFetch(payload) {
      // UNIFIED MODE: 1 tempat Laravel. Coba /api/ai/chat dulu, fallback ke proxy.php hanya jika dibuka manual via file://
      const candidates = [APP_CONFIG.proxyUrl];
      if (location.protocol === 'file:') {
        candidates.push(APP_CONFIG.fallbackLocalUrl, APP_CONFIG.fallbackProxyUrl);
      }
      let lastErr = null;
      for (const url of candidates) {
        try {
          const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (resp.status === 404 && candidates.length > 1) continue;
          return resp;
        } catch (e) { lastErr = e; }
      }
      throw new Error(`Proxy AI tidak dapat diakses. Pastikan Laravel jalan (php artisan serve --port=8001) di http://localhost:8001. Detail: ${lastErr?.message}`);
    }

    let appState = {
      currentView: 'dashboard',
      user: {
        name: 'Dermawan Purba',
        email: 'dermawan.prb@gmail.com',
        initial: 'DP',
        targetScore: '550+',
        logoBase64: null
      },
      apiConfig: {
        baseUrl: APP_CONFIG.defaultApiBaseUrl,
        apiKey: APP_CONFIG.defaultApiKey,
        model: APP_CONFIG.defaultModel
      },
      currentTest: null,
      activeQuestionIndex: 0,
      userAnswers: {},
      flaggedQuestions: new Set(),
      testTimerInterval: null,
      timeRemaining: APP_CONFIG.examDurationSeconds,
      activeReviewData: null,
      materials: [],
      kanbanCards: [],
      testHistory: [],
      aiModalType: 'materi',
      activeAITutorQuestion: null
    };

    const SEED_MATERIALS = [
      {
        id: 'mat-1',
        section: 'STRUCTURE',
        skillCode: 'SKILL 01',
        title: 'Subject & Verb Completeness',
        category: 'Structure',
        summary: 'Setiap klausa utama dalam bahasa Inggris WAJIB memiliki setidaknya satu Subjek dan satu Kata Kerja (Verb).',
        content: `
          <h4 class="font-bold text-amber-900 border-b pb-1">Kaidah Utama:</h4>
          <p>Kalimat bahasa Inggris yang baku harus memiliki satu Subjek dan satu Predikat/Kata Kerja yang lengkap.</p>
          <div class="p-3 bg-amber-50 rounded border-l-4 border-amber-600 my-2 font-mono text-xs">
            <b>Rumus:</b> [Subject] + [Verb] + [Object/Complement]
          </div>
          <h4 class="font-bold text-amber-900 mt-3">Jebakan Umum TOEFL:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li><b>Subjek Ganda (Double Subject):</b> <i>My friend he is coming</i> (SALAH). Seharusnya: <i>My friend is coming</i>.</li>
            <li><b>Verb Hilang / Hanya Participle:</b> <i>The boy playing soccer</i> (SALAH - 'playing' bukan finite verb tanpa to be). Seharusnya: <i>The boy is playing soccer</i>.</li>
          </ul>
          <h4 class="font-bold text-amber-900 mt-3">Contoh Soal:</h4>
          <p class="font-typewriter bg-stone-100 p-2 rounded text-xs">______ was backed up for miles on the freeway.<br/>(A) Yesterday &nbsp; (B) In the morning &nbsp; <b>(C) Traffic</b> &nbsp; (D) Cars</p>
          <p class="text-xs text-stone-600"><b>Pembahasan:</b> Kalimat memiliki verb <i>was backed up</i> (singular) tetapi belum memiliki subjek. Pilihan (C) <i>Traffic</i> adalah subjek singular yang tepat.</p>
        `,
        priority: 'High',
        status: 'mastered',
        savedQuestions: []
      },
      {
        id: 'mat-2',
        section: 'STRUCTURE',
        skillCode: 'SKILL 02',
        title: 'Inversion after Negative Expressions',
        category: 'Structure',
        summary: 'Pola inversi (Auxiliary + Subject) saat kalimat diawali kata negatif (Never, Rarely, Seldom, Not only).',
        content: `
          <h4 class="font-bold text-amber-900 border-b pb-1">Kaidah Inversi Negatif:</h4>
          <p>Ketika ekspresi negatif atau pembatas diletakkan di awal kalimat untuk penekanan, susunan subjek dan kata kerja bantu (auxiliary) harus dibalik.</p>
          <div class="p-3 bg-amber-50 rounded border-l-4 border-amber-600 my-2 font-mono text-xs">
            <b>Kata Negatif:</b> Never, Rarely, Seldom, Scarcely, Barely, Hardley, At no time, Nowhere, Not only.<br/>
            <b>Pola:</b> [Negative Expression] + [Auxiliary / Be / Do / Have] + [Subject] + [Main Verb]
          </div>
          <h4 class="font-bold text-amber-900 mt-3">Contoh:</h4>
          <p class="font-typewriter bg-stone-100 p-2 rounded text-xs"><b>Never have I seen</b> such a breathtaking sunset. (BUKAN: <i>Never I have seen</i>)</p>
          <p class="font-typewriter bg-stone-100 p-2 rounded text-xs"><b>Rarely does he arrive</b> on time for the morning meeting.</p>
        `,
        priority: 'Urgent',
        status: 'in_progress',
        savedQuestions: []
      },
      {
        id: 'mat-3',
        section: 'STRUCTURE',
        skillCode: 'SKILL 03',
        title: 'Appositive Identification',
        category: 'Structure',
        summary: 'Appositive adalah frasa nomina yang menjelaskan subjek tanpa menjadi subjek utama.',
        content: `
          <h4 class="font-bold text-amber-900 border-b pb-1">Kaidah Appositive:</h4>
          <p>Appositive terletak di antara dua koma yang menerangkan kata benda di depannya. Jangan terkecoh menganggap appositive sebagai subjek utama.</p>
          <div class="p-3 bg-amber-50 rounded border-l-4 border-amber-600 my-2 font-mono text-xs">
            <b>Pola 1:</b> [Subject], [Appositive], [Verb] ...<br/>
            <b>Pola 2:</b> [Appositive], [Subject] + [Verb] ...
          </div>
          <p class="font-typewriter bg-stone-100 p-2 rounded text-xs"><i>Dr. Robert, <b>a renowned astrophysicist</b>, will deliver the keynote lecture.</i></p>
        `,
        priority: 'Medium',
        status: 'backlog',
        savedQuestions: []
      },
      {
        id: 'mat-4',
        section: 'LISTENING',
        skillCode: 'SKILL 04',
        title: 'Short Dialogues: Restatement & Synonyms',
        category: 'Listening',
        summary: 'Kunci jawaban listening bagian A hampir selalu merupakan restatement (parafrase sinonim) dari pembicara kedua.',
        content: `
          <h4 class="font-bold text-blue-900 border-b pb-1">Strategi Listening Part A:</h4>
          <ol class="list-decimal pl-5 space-y-1">
            <li>Fokus utama pada <b>Pembicara Kedua (Second Speaker)</b>.</li>
            <li>Cari pilihan jawaban yang memuat <b>Sinonim / Parafrase kata kunci</b>, bukan kata yang berbunyi sama (Sound-Alike trap).</li>
            <li>Hindari opsi yang mengulang kata persis dengan bunyi yang mirip karena 90% adalah jebakan distractor.</li>
          </ol>
          <div class="p-3 bg-blue-50 rounded border-l-4 border-blue-600 my-2 text-xs">
            <b>Contoh:</b><br/>
            Speaker 1: <i>"Do you want to go to the concert tonight?"</i><br/>
            Speaker 2: <i>"I can hardly keep my eyes open."</i><br/>
            <b>Makna Sebenarnya:</b> She is extremely tired / exhausted.
          </div>
        `,
        priority: 'High',
        status: 'mastered',
        savedQuestions: []
      },
      {
        id: 'mat-5',
        section: 'READING',
        skillCode: 'SKILL 05',
        title: 'Main Idea & Paragraph Organization',
        category: 'Reading',
        summary: 'Cara cepat menemukan ide pokok teks TOEFL dalam 30 detik tanpa membaca seluruh teks kata per kata.',
        content: `
          <h4 class="font-bold text-emerald-900 border-b pb-1">Trik Menemukan Main Idea:</h4>
          <ul class="list-disc pl-5 space-y-1">
            <li>Baca kalimat pertama (dan terkadang kalimat terakhir) pada setiap paragraf.</li>
            <li>Cari kata kunci yang berulang (recurring keywords/themes).</li>
            <li>Eliminasi opsi yang <b>terlalu sempit (too specific)</b> atau <b>terlalu luas (too general)</b>.</li>
          </ul>
          <div class="p-3 bg-emerald-50 rounded border-l-4 border-emerald-600 my-2 font-mono text-xs">
            <b>Pertanyaan Umum:</b> What is the primary topic of the passage? / Which title best summarizes the passage?
          </div>
        `,
        priority: 'Medium',
        status: 'in_progress',
        savedQuestions: []
      }
    ];

    const SEED_SUBJECT_VERB_SET_15 = [
      {
        id: 1,
        section: 'STRUCTURE',
        skill: 'Subject & Verb Completeness',
        passageOrAudioScript: null,
        questionText: 'The Hubble Space Telescope ______ high-resolution images of distant galaxies across the observable universe.',
        options: ['regularly captures', 'regularly capturing', 'which regularly captures', 'was regular capture'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Subjek kalimat adalah "The Hubble Space Telescope" (tunggal) dan kalimat belum memiliki kata kerja utama (main verb). Pilihan (A) "regularly captures" adalah finite verb yang melengkapi kalimat baku.',
          whyOthersWrong: {
            A: 'BENAR: Finite verb (V-s) yang melengkapi subjek tunggal.',
            B: 'SALAH: Present participle (-ing) tidak dapat menjadi verb utama tanpa auxiliary be.',
            C: 'SALAH: Mengubah kalimat menjadi anak kalimat yang menggantung tanpa induk kalimat.',
            D: 'SALAH: Susunan kata rancu.'
          },
          grammarRule: 'Subject + Verb Completeness: Setiap klausa utama wajib memiliki subjek dan kata kerja utama.',
          vocabulary: 'Observable universe = Alam semesta teramati; High-resolution = Resolusi tinggi.'
        }
      },
      {
        id: 2,
        section: 'STRUCTURE',
        skill: 'Missing Subject with Prepositional Distractor',
        passageOrAudioScript: null,
        questionText: 'In the early decades of the twentieth century, ______ developed innovative techniques for the mass production of penicillin.',
        options: ['microbiologists', 'when microbiologists', 'with microbiologists', 'that microbiologists'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kalimat diawali frasa preposisi penunjuk waktu ("In the early decades..."). Kalimat sudah memiliki predikat "developed" tetapi belum memiliki Subjek. Pilihan (A) "microbiologists" menyediakan subjek kata benda murni.',
          whyOthersWrong: {
            A: 'BENAR: Subjek kata benda murni.',
            B: 'SALAH: Menambahkan connector waktu "when" sehingga kalimat menggantung.',
            C: 'SALAH: Menjadikan kata benda sebagai objek preposisi ("with"), bukan subjek.',
            D: 'SALAH: Menambahkan relative marker "that".'
          },
          grammarRule: 'Prepositional phrase di awal kalimat BUKAN subjek; cari subjek murni setelah koma.',
          vocabulary: 'Innovative = Inovatif; Mass production = Produksi massal.'
        }
      },
      {
        id: 3,
        section: 'STRUCTURE',
        skill: 'Subject Separated by Prepositional Phrase',
        passageOrAudioScript: null,
        questionText: 'The valuable collection of antique porcelain vases from the Ming dynasty ______ currently exhibited at the national museum.',
        options: ['is', 'are', 'were', 'being'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Subjek inti kalimat adalah "The valuable collection" (tunggal / singular), bukan "vases" yang merupakan objek preposisi. Oleh karena itu, kata kerja harus berbentuk singular "is".',
          whyOthersWrong: {
            A: 'BENAR: Singular verb sesuai dengan head noun "collection".',
            B: 'SALAH: "are" adalah bentuk plural (terjebak kata "vases").',
            C: 'SALAH: "were" adalah bentuk plural lampau, padahal ada adverb "currently".',
            D: 'SALAH: "being" bukan finite verb.'
          },
          grammarRule: 'Prepositional phrases (of antique vases, from Ming dynasty) mengaburkan subjek inti.',
          vocabulary: 'Antique porcelain = Keramik porselen antik; Exhibited = Dipamerkan.'
        }
      },
      {
        id: 4,
        section: 'STRUCTURE',
        skill: 'Missing Finite Verb (Participle Trap)',
        passageOrAudioScript: null,
        questionText: 'Civil engineers ______ the suspension bridge over the bay completed their structural analysis yesterday.',
        options: ['inspecting', 'inspected', 'who inspecting', 'were inspected'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kalimat sudah memiliki kata kerja utama "completed" di bagian akhir. Oleh karena itu, bagian tengah harus berupa penjelas (participle modifier aktif "inspecting" = who were inspecting).',
          whyOthersWrong: {
            A: 'BENAR: Present participle aktif sebagai modifier subjek "Civil engineers".',
            B: 'SALAH: Menghasilkan double finite verb jika diartikan kalimat lampau ("inspected" dan "completed").',
            C: 'SALAH: Penggunaan relative pronoun "who" tanpa kata kerja bantu "were".',
            D: 'SALAH: Double verb pasif.'
          },
          grammarRule: 'Reduced relative clause aktif: Noun + V-ing modifier.',
          vocabulary: 'Civil engineers = Insinyur teknik sipil; Suspension bridge = Jembatan gantung.'
        }
      },
      {
        id: 5,
        section: 'STRUCTURE',
        skill: 'Double Subject Elimination',
        passageOrAudioScript: null,
        questionText: 'The migratory arctic tern, which travels thousands of miles every year, ______ the record for the longest animal migration.',
        options: ['holds', 'it holds', 'holding', 'which holds'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Subjek kalimat adalah "The migratory arctic tern". Klausa "which travels..." adalah anak kalimat penjelas. Induk kalimat memerlukan kata kerja utama tunggal "holds", BUKAN "it holds" (karena "it" akan menjadi subjek ganda yang salah).',
          whyOthersWrong: {
            A: 'BENAR: Kata kerja utama tunggal tanpa subjek ganda.',
            B: 'SALAH: Double Subject Trap (mengulang subjek dengan pronoun "it").',
            C: 'SALAH: Participle bukan finite verb.',
            D: 'SALAH: Menambahkan klausa penjelas baru tanpa verb induk.'
          },
          grammarRule: 'Jangan gunakan pronoun (he, she, it, they) tepat setelah subjek utama atau setelah adjective clause.',
          vocabulary: 'Arctic tern = Burung dara laut arktik; Migratory = Bermigrasi.'
        }
      },
      {
        id: 6,
        section: 'STRUCTURE',
        skill: 'Gerund as Singular Subject',
        passageOrAudioScript: null,
        questionText: 'Balancing complex international trade budgets ______ meticulous attention to macroeconomic indicators.',
        options: ['requires', 'require', 'requiring', 'are requiring'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Subjek kalimat adalah Gerund phrase "Balancing complex international trade budgets". Gerund sebagai subjek selalu dianggap TUNGGAL (singular), sehingga memerlukan verb dengan akhiran -s ("requires").',
          whyOthersWrong: {
            A: 'BENAR: Singular verb untuk gerund subject.',
            B: 'SALAH: Plural verb (terkecoh oleh kata jamak "budgets").',
            C: 'SALAH: Bukan finite verb.',
            D: 'SALAH: Plural continuous verb.'
          },
          grammarRule: 'Gerund (V-ing) sebagai subjek kalimat selalu mengambil kata kerja tunggal (singular verb).',
          vocabulary: 'Meticulous = Sangat teliti/cermat; Trade budget = Anggaran perdagangan.'
        }
      },
      {
        id: 7,
        section: 'STRUCTURE',
        skill: 'Compound Subject with Either/Or Neither/Nor',
        passageOrAudioScript: null,
        questionText: 'Neither the senior project manager nor the site engineers ______ willing to approve the unauthorized budget expansion.',
        options: ['were', 'was', 'is', 'being'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Pada konstruksi "Neither... nor...", kata kerja harus menyesuaikan dengan subjek yang PALING DEKAT dengan verb. Subjek terdekat adalah "the site engineers" (jamak), sehingga kata kerja yang tepat adalah "were".',
          whyOthersWrong: {
            A: 'BENAR: Plural verb sesuai dengan subjek terdekat "the site engineers".',
            B: 'SALAH: Singular verb (hanya jika subjek terdekat tunggal).',
            C: 'SALAH: Singular present verb.',
            D: 'SALAH: Participle bukan finite verb.'
          },
          grammarRule: 'Either... or / Neither... nor: Verb agrees with the CLOSER subject.',
          vocabulary: 'Unauthorized = Tanpa izin resmi; Expansion = Perluasan/pembengkakan.'
        }
      },
      {
        id: 8,
        section: 'STRUCTURE',
        skill: 'Indefinite Pronouns Agreement',
        passageOrAudioScript: null,
        questionText: 'Each of the newly synthesized chemical compounds ______ subjected to rigorous safety testing before clinical trials.',
        options: ['is', 'are', 'have been', 'were'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kata ganti tak tentu "Each", "Every", "Everyone", "Someone" selalu bersifat TUNGGAL (singular). Walaupun diikuti oleh "of the chemical compounds" (jamak), subjek intinya adalah "Each", sehingga verb yang tepat adalah "is".',
          whyOthersWrong: {
            A: 'BENAR: Singular verb sesuai dengan "Each".',
            B: 'SALAH: Plural verb.',
            C: 'SALAH: Plural perfect verb.',
            D: 'SALAH: Plural past verb.'
          },
          grammarRule: 'Each / Every / Everyone + of + [Plural Noun] + [SINGULAR VERB].',
          vocabulary: 'Synthesized = Disintesis/dibuat secara kimiawi; Rigorous = Sangat ketat.'
        }
      },
      {
        id: 9,
        section: 'STRUCTURE',
        skill: 'Missing Subject and Verb in Main Clause',
        passageOrAudioScript: null,
        questionText: 'Because the original parchment documents were extremely fragile, ______ only under specialized ultraviolet illumination.',
        options: ['they were examined', 'examined', 'were examined', 'their examination'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Klausa pertama adalah adverb clause ("Because... fragile,"). Klausa utama setelah koma membutuhkan Subjek dan Kata Kerja lengkap. Pilihan (A) "they were examined" menyediakan Subjek ("they") dan Verb ("were examined").',
          whyOthersWrong: {
            A: 'BENAR: Menyediakan Subjek dan Verb lengkap untuk klausa utama.',
            B: 'SALAH: Tanpa subjek dan auxiliary.',
            C: 'SALAH: Tanpa subjek.',
            D: 'SALAH: Hanya berupa noun phrase tanpa predikat verb.'
          },
          grammarRule: 'Adverb Clause, + [Subject + Verb + Object] (Main Clause wajib lengkap).',
          vocabulary: 'Parchment = Lembaran perkamen kulit hewan; Fragile = Rapuh.'
        }
      },
      {
        id: 10,
        section: 'STRUCTURE',
        skill: 'Expressions of Quantity Subject-Verb Agreement',
        passageOrAudioScript: null,
        questionText: 'Two-thirds of the agricultural land in this arid river valley ______ irrigated by meltwater from the nearby mountains.',
        options: ['is', 'are', 'were', 'have been'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Untuk ekspresi kuantitas / pecahan (All, Most, Two-thirds, Half), keselarasan verb ditentukan oleh kata benda setelah "of". "the agricultural land" adalah uncountable/singular noun, maka verb-nya harus singular "is".',
          whyOthersWrong: {
            A: 'BENAR: Singular verb karena "land" adalah benda tak terhitung (uncountable).',
            B: 'SALAH: Plural verb.',
            C: 'SALAH: Plural past verb.',
            D: 'SALAH: Plural perfect verb.'
          },
          grammarRule: 'Fraction / Percentage + of + [Uncountable Noun] -> Singular Verb.',
          vocabulary: 'Arid = Kering / gersang; Meltwater = Air lelehan salju.'
        }
      },
      {
        id: 11,
        section: 'STRUCTURE',
        skill: 'Subject with Introductory Adverbial Modifier',
        passageOrAudioScript: null,
        questionText: 'Although severely damaged during the category-five hurricane, ______ fully operational within six months.',
        options: ['the deep-water seaport became', 'becoming the seaport', 'when the seaport became', 'the seaport becoming'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Bagian awal adalah reduced clause ("Although [it was] severely damaged..."). Klausa utama membutuhkan Subjek ("the deep-water seaport") dan Main Verb ("became").',
          whyOthersWrong: {
            A: 'BENAR: Menyediakan Subjek dan Main Verb lengkap.',
            B: 'SALAH: Participle frase tanpa finite verb.',
            C: 'SALAH: Mengubah kalimat menjadi anak kalimat ganda.',
            D: 'SALAH: Participle tanpa verb finite.'
          },
          grammarRule: 'Reduced Clause, [Subject + Verb ...].',
          vocabulary: 'Deep-water seaport = Pelabuhan laut dalam; Operational = Beroperasi.'
        }
      },
      {
        id: 12,
        section: 'STRUCTURE',
        skill: 'There is / There are Agreement',
        passageOrAudioScript: null,
        questionText: 'There ______ significant discrepancies between the preliminary lab report and the final published paper.',
        options: ['were', 'was', 'is', 'has been'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Dalam konstruksi "There + be", subjek sebenarnya berada SETELAH kata kerja "be". Subjek kalimat adalah "significant discrepancies" (jamak / plural), sehingga verb yang tepat adalah "were".',
          whyOthersWrong: {
            A: 'BENAR: Plural verb sesuai dengan subjek jamak "discrepancies".',
            B: 'SALAH: Singular verb.',
            C: 'SALAH: Singular verb.',
            D: 'SALAH: Singular verb.'
          },
          grammarRule: 'There + [Verb] + [Real Subject]. Verb harus selaras dengan subjek setelahnya.',
          vocabulary: 'Discrepancies = Ketidakcocokan / perbedaan data; Preliminary = Awal.'
        }
      },
      {
        id: 13,
        section: 'STRUCTURE',
        skill: 'Collective Noun Acting as a Unit',
        passageOrAudioScript: null,
        questionText: 'The interdisciplinary research committee ______ its annual findings at the international symposium tomorrow.',
        options: ['will present', 'presenting', 'to present', 'will be presented'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Subjek kalimat "The interdisciplinary research committee" bertindak sebagai satu kesatuan utuh (terlihat dari pronoun "its"). Kalimat membutuhkan finite verb aktif masa depan "will present".',
          whyOthersWrong: {
            A: 'BENAR: Finite verb aktif yang melengkapi subjek.',
            B: 'SALAH: Participle tanpa modal/auxiliary be.',
            C: 'SALAH: Infinitive tidak dapat menjadi predikat utama.',
            D: 'SALAH: Makna pasif rancu (komite menyajikan, bukan disajikan).'
          },
          grammarRule: 'Collective Noun (Committee, Team, Jury) + Finite Verb.',
          vocabulary: 'Interdisciplinary = Lintas disiplin ilmu; Symposium = Simposium / konferensi ilmiah.'
        }
      },
      {
        id: 14,
        section: 'STRUCTURE',
        skill: 'Linking Verb with Predicate Adjective',
        passageOrAudioScript: null,
        questionText: 'The volcanic soil surrounding the dormant caldera ______ exceptionally fertile for agricultural cultivation.',
        options: ['remains', 'remaining', 'remain', 'which remains'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Subjek inti kalimat adalah "The volcanic soil" (singular/uncountable). Kalimat memerlukan linking verb tunggal "remains" yang menghubungkan subjek dengan kata sifat "fertile".',
          whyOthersWrong: {
            A: 'BENAR: Singular linking verb yang sesuai dengan "soil".',
            B: 'SALAH: Participle bukan predikat utama.',
            C: 'SALAH: Plural verb.',
            D: 'SALAH: Menjadikan kalimat anak kalimat yang tidak tuntas.'
          },
          grammarRule: 'Linking Verb (remain, seem, appear, become) + Adjective.',
          vocabulary: 'Dormant caldera = Kaldera gunung berapi tidur; Fertile = Subur.'
        }
      },
      {
        id: 15,
        section: 'STRUCTURE',
        skill: 'Written Expression (Subject-Verb Mismatch Error)',
        passageOrAudioScript: null,
        questionText: 'Identify the incorrect word or phrase:\n"The variety of (A) [indigenous plant species] growing in the botanical garden (B) [are] carefully documented (C) [by] resident (D) [horticulturists]."',
        options: ['A (indigenous plant species)', 'B (are)', 'C (by)', 'D (horticulturists)'],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Bagian (B) "are" SALAH. Subjek inti kalimat adalah "The variety" (tunggal), bukan "species" (objek preposisi). Oleh karena itu, kata kerja harus diubah menjadi singular "is" (is carefully documented).',
          whyOthersWrong: {
            A: 'BENAR (tidak salah): Frasa benda jamak yang tepat sebagai objek of.',
            B: 'SALAH (JAWABAN BENAR): Subjek singular "The variety" membutuhkan verb singular "is".',
            C: 'BENAR (tidak salah): Preposisi pelaku pasif yang tepat.',
            D: 'BENAR (tidak salah): Kata benda profesi jamak yang tepat.'
          },
          grammarRule: 'The variety of + [Plural Noun] + [SINGULAR VERB].',
          vocabulary: 'Indigenous = Asli / endemik; Horticulturists = Ahli hortikultura/taman.'
        }
      }
    ];

    const SEED_INVERSION_SET_15 = [
      {
        id: 1,
        section: 'STRUCTURE',
        skill: 'Subject-Verb Inversion (Not Only)',
        passageOrAudioScript: null,
        questionText: 'Not only ______ the Nobel Prize in Physics, but Marie Curie also won the Nobel Prize in Chemistry.',
        options: ['did she receive', 'she received', 'she did receive', 'she was receiving'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kalimat diawali dengan kata/frasa negatif korelatif "Not only...". Berdasarkan kaidah inversi, posisi auxiliary harus mendahului subjek: Auxiliary (did) + Subject (she) + Verb (receive).',
          whyOthersWrong: {
            A: 'BENAR: Pola inversi lampau yang tepat (did + she + receive).',
            B: 'SALAH: Susunan kalimat biasa tanpa inversi.',
            C: 'SALAH: Posisi auxiliary berada setelah subjek.',
            D: 'SALAH: Bentuk continuous yang tidak tepat.'
          },
          grammarRule: 'Inversion with Correlative Conjunction: Not only + Aux + S + V1, but S + also + V.',
          vocabulary: 'Nobel Prize = Hadiah Nobel; Receive = Menerima.'
        }
      },
      {
        id: 2,
        section: 'STRUCTURE',
        skill: 'Inversion after Negative Adverb (Rarely)',
        passageOrAudioScript: null,
        questionText: 'Rarely ______ such intense atmospheric disturbances in this temperate geographical latitude.',
        options: ['do meteorologists observe', 'meteorologists observe', 'meteorologists do observe', 'are meteorologists observing'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kalimat diawali dengan negative adverb "Rarely". Pola inversi wajib diterapkan: [Negative Adverb] + [Auxiliary (do)] + [Subject (meteorologists)] + [Main Verb (observe)].',
          whyOthersWrong: {
            A: 'BENAR: Pola inversi tepat (do + meteorologists + observe).',
            B: 'SALAH: Pola kalimat normal tanpa inversi.',
            C: 'SALAH: Auxiliary diletakkan setelah subjek.',
            D: 'SALAH: Makna continuous pasif/kurang lazim.'
          },
          grammarRule: 'Negative Adverb Inversion: Rarely + do/does/did + Subject + Verb 1.',
          vocabulary: 'Atmospheric disturbances = Gangguan atmosfer; Temperate latitude = Lintang beriklim sedang.'
        }
      },
      {
        id: 3,
        section: 'STRUCTURE',
        skill: 'Inversion after Negative Adverb (Never Before)',
        passageOrAudioScript: null,
        questionText: 'Never before ______ an earthquake of such catastrophic magnitude recorded in this stable tectonic region.',
        options: ['had seismologists', 'seismologists had', 'did seismologists had', 'seismologists were'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kalimat diawali dengan "Never before". Pola past perfect inversi: [Never before] + [Auxiliary (had)] + [Subject (seismologists)] + [Verb 3 (recorded / seen)].',
          whyOthersWrong: {
            A: 'BENAR: Pola inversi past perfect yang tepat.',
            B: 'SALAH: Susunan kalimat biasa tanpa inversi.',
            C: 'SALAH: "did" tidak dapat dipadukan dengan "had".',
            D: 'SALAH: Tanpa past perfect auxiliary yang sesuai.'
          },
          grammarRule: 'Never before + had + Subject + V3.',
          vocabulary: 'Catastrophic magnitude = Kekuatan gempa dahsyat; Tectonic region = Wilayah tektonik.'
        }
      },
      {
        id: 4,
        section: 'STRUCTURE',
        skill: 'Inversion after Negative Adverb (Seldom)',
        passageOrAudioScript: null,
        questionText: 'Seldom ______ migratory birds venture so far south during the relatively mild winter months.',
        options: ['do these', 'these', 'these do', 'are these'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Diawali dengan kata negatif pembatas "Seldom". Pola inversi: [Seldom] + [Auxiliary (do)] + [Subject (these migratory birds)] + [Verb (venture)].',
          whyOthersWrong: {
            A: 'BENAR: Pola inversi baku dengan auxiliary "do".',
            B: 'SALAH: Tanpa auxiliary inversi.',
            C: 'SALAH: Auxiliary ditaruh setelah subjek.',
            D: 'SALAH: "are" tidak cocok dengan bare infinitive "venture".'
          },
          grammarRule: 'Seldom + do/does + Subject + Verb 1.',
          vocabulary: 'Venture = Memberanikan diri menjelajah; Mild = Hangat / sejuk ringan.'
        }
      },
      {
        id: 5,
        section: 'STRUCTURE',
        skill: 'Inversion with Negative Prepositional Phrase',
        passageOrAudioScript: null,
        questionText: 'Under no circumstances ______ laboratory personnel permitted to enter the biohazard quarantine chamber without full protective suits.',
        options: ['are', 'is', 'they are', 'when are'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: '"Under no circumstances" adalah frasa preposisi negatif mutlak. Diikuti pola inversi to be: [Negative phrase] + [Be (are)] + [Subject (laboratory personnel - jamak)] + [Permitted].',
          whyOthersWrong: {
            A: 'BENAR: Bentuk to be jamak "are" yang diinversikan sebelum subjek "personnel".',
            B: 'SALAH: "is" berbentuk tunggal (personnel adalah kata benda jamak).',
            C: 'SALAH: Menyisipkan pronoun "they" dan tanpa inversi.',
            D: 'SALAH: Menambahkan connector waktu "when".'
          },
          grammarRule: 'Under no circumstances + [Be/Aux] + [Subject] + [Complement/Verb].',
          vocabulary: 'Biohazard = Bahaya biologis; Quarantine chamber = Ruang karantina.'
        }
      },
      {
        id: 6,
        section: 'STRUCTURE',
        skill: 'Inversion after Restrictive Phrase (Only after)',
        passageOrAudioScript: null,
        questionText: 'Only after the floodwaters had completely receded ______ the structural integrity of the suspension bridge.',
        options: ['could engineers assess', 'engineers could assess', 'engineers assessed', 'they could assess'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Ketika kalimat diawali dengan "Only after + [klausa/keterangan]", klausa utama SETELAHNYA wajib mengalami inversi: Modal (could) + Subject (engineers) + Verb (assess).',
          whyOthersWrong: {
            A: 'BENAR: Pola inversi pada klausa utama (could + engineers + assess).',
            B: 'SALAH: Klausa utama tidak diinversikan.',
            C: 'SALAH: Klausa biasa tanpa modal.',
            D: 'SALAH: Menggunakan pronoun subjek tanpa inversi modal.'
          },
          grammarRule: 'Only after / Only when + [Time Clause], + [Aux/Modal + Subject + Verb].',
          vocabulary: 'Receded = Surut; Structural integrity = Keutuhan struktur bangunan.'
        }
      },
      {
        id: 7,
        section: 'STRUCTURE',
        skill: 'Inversion after Restrictive Phrase (Only by)',
        passageOrAudioScript: null,
        questionText: 'Only by conducting rigorous double-blind clinical trials ______ the therapeutic efficacy of the newly developed medication.',
        options: ['can researchers establish', 'researchers can establish', 'researchers establishing', 'can establish researchers'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: '"Only by + [Gerund phrase]" di awal kalimat menuntut inversi pada klausa utama: Modal (can) + Subject (researchers) + Verb (establish).',
          whyOthersWrong: {
            A: 'BENAR: Modal (can) + Subject (researchers) + Main verb (establish).',
            B: 'SALAH: Pola kalimat normal tanpa inversi.',
            C: 'SALAH: Participle bukan finite verb.',
            D: 'SALAH: Susunan verb dan subjek terbalik tidak baku.'
          },
          grammarRule: 'Only by + [V-ing], + [Modal/Aux + Subject + Verb].',
          vocabulary: 'Therapeutic efficacy = Khasiat terapi penyembuhan; Double-blind = Uji klinis ganda rahasia.'
        }
      },
      {
        id: 8,
        section: 'STRUCTURE',
        skill: 'Inversion after Negative Expression (At no time)',
        passageOrAudioScript: null,
        questionText: 'At no time during the cross-examination ______ any admission of criminal liability regarding the environmental spill.',
        options: ['did the executive make', 'the executive made', 'the executive did make', 'was the executive made'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: '"At no time" adalah ekspresi negatif mutlak. Pola inversi lampau: [At no time] + [did] + [the executive (Subject)] + [make (Verb 1)].',
          whyOthersWrong: {
            A: 'BENAR: Inversi lampau tepat (did + Subject + make).',
            B: 'SALAH: Kalimat biasa tanpa inversi.',
            C: 'SALAH: Auxiliary ditaruh setelah subjek.',
            D: 'SALAH: Pola pasif yang mengubah makna kalimat.'
          },
          grammarRule: 'At no time + did + Subject + Verb 1.',
          vocabulary: 'Cross-examination = Pemeriksaan silang di pengadilan; Criminal liability = Pertanggungjawaban pidana.'
        }
      },
      {
        id: 9,
        section: 'STRUCTURE',
        skill: 'Inverted Conditional Type 3 (Had + Subject)',
        passageOrAudioScript: null,
        questionText: '______ more detailed satellite telemetry data, the mission control team would have averted the spacecraft\'s orbital decay.',
        options: ['Had the engineers received', 'If the engineers received', 'The engineers had received', 'Did the engineers receive'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Inversi Conditional Type 3 (menghilangkan kata "If"): "If the engineers had received" berubah susunannya menjadi "Had the engineers received".',
          whyOthersWrong: {
            A: 'BENAR: Pola inversi pengandaian lampau (Had + Subject + V3).',
            B: 'SALAH: "If + V2" adalah Type 2, tidak selaras dengan "would have averted" (Type 3).',
            C: 'SALAH: Tanpa connector atau inversi.',
            D: 'SALAH: "Did" bukan auxiliary conditional.'
          },
          grammarRule: 'Inverted Conditional 3: Had + Subject + V3, Subject + would have + V3.',
          vocabulary: 'Telemetry data = Data telemetri; Averted = Mencegah terjadinya bencana.'
        }
      },
      {
        id: 10,
        section: 'STRUCTURE',
        skill: 'Inverted Conditional Type 2 (Were + Subject)',
        passageOrAudioScript: null,
        questionText: '______ to melt entirely, global sea levels would rise by more than sixty meters, submerging coastal cities.',
        options: ['Were the Antarctic ice sheets', 'If the Antarctic ice sheets were', 'The Antarctic ice sheets were', 'Should the Antarctic ice sheets'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Inversi Conditional Type 2 dengan to be/to-infinitive: "If the Antarctic ice sheets were to melt" diinversikan menjadi "Were the Antarctic ice sheets to melt".',
          whyOthersWrong: {
            A: 'BENAR: Pola inversi Type 2 (Were + Subject + to-infinitive).',
            B: 'SALAH: Opsi "If..." membutuhkan kelanjutan "to melt" yang terpotong di soal.',
            C: 'SALAH: Tanpa kata sambung atau inversi.',
            D: 'SALAH: "Should" digunakan untuk Type 1 (bare infinitive melt, bukan to melt).'
          },
          grammarRule: 'Inverted Conditional 2: Were + Subject + to-infinitive, Subject + would + V1.',
          vocabulary: 'Submerging = Menenggelamkan; Coastal cities = Kota-kota pesisir.'
        }
      },
      {
        id: 11,
        section: 'STRUCTURE',
        skill: 'Inverted Conditional Type 1 (Should + Subject)',
        passageOrAudioScript: null,
        questionText: '______ any unforeseen technical anomalies arise during the launch sequence, abort the countdown immediately.',
        options: ['Should', 'If should', 'Were', 'Unless'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Inversi Conditional Type 1 untuk situasi formal/antisipasi: "If any anomalies should arise" diinversikan menjadi "Should any anomalies arise".',
          whyOthersWrong: {
            A: 'BENAR: Pola inversi formal (Should + Subject + Bare Infinitive).',
            B: 'SALAH: Penggabungan "If" dan "should" tanpa urutan subjek yang tepat.',
            C: 'SALAH: "Were" hanya untuk Conditional Type 2.',
            D: 'SALAH: "Unless" membutuhkan klausa biasa lengkap.'
          },
          grammarRule: 'Inverted Conditional 1: Should + Subject + Verb 1, [Imperative / S + will + V1].',
          vocabulary: 'Unforeseen anomalies = Kejanggalan tak terduga; Abort = Batalkan.'
        }
      },
      {
        id: 12,
        section: 'STRUCTURE',
        skill: 'Place Adverb Inversion',
        passageOrAudioScript: null,
        questionText: 'At the summit of the snow-capped mountain peak ______ a centuries-old astronomical observatory.',
        options: ['stands', 'standing', 'it stands', 'where stands'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Ketika ekspresi tempat/lokasi preposisi diletakkan di awal kalimat untuk penekanan deskriptif, terjadi inversi penuh antara Kata Kerja dan Subjek: [Place Expression] + [Verb (stands)] + [Subject (a centuries-old observatory)].',
          whyOthersWrong: {
            A: 'BENAR: Kata kerja tunggal yang diletakkan mendahului subjek inti.',
            B: 'SALAH: Participle bukan finite verb.',
            C: 'SALAH: Menyisipkan pronoun "it" yang merusak pola inversi tempat.',
            D: 'SALAH: Menambahkan relative adverb "where".'
          },
          grammarRule: 'Place Expression Inversion: Prepositional Phrase + [Main Verb] + [Subject].',
          vocabulary: 'Summit = Puncak gunung; Snow-capped = Berselimut salju.'
        }
      },
      {
        id: 13,
        section: 'STRUCTURE',
        skill: 'Directional Adverb Inversion',
        passageOrAudioScript: null,
        questionText: 'Down the steep mountain slope ______ the massive debris avalanche, obliterating everything in its path.',
        options: ['cascaded', 'it cascaded', 'cascading', 'was cascaded'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Frasa arah gerak ("Down the steep mountain slope") di awal kalimat memicu inversi langsung: [Direction Expression] + [Verb (cascaded)] + [Subject (the massive debris avalanche)].',
          whyOthersWrong: {
            A: 'BENAR: Kata kerja utama lampau mendahului subjek avalanche.',
            B: 'SALAH: Menambahkan pronoun "it".',
            C: 'SALAH: Participle tanpa finite verb.',
            D: 'SALAH: Bentuk pasif yang rancu.'
          },
          grammarRule: 'Direction / Movement Inversion: Down/Up/Into + [Verb] + [Subject].',
          vocabulary: 'Debris avalanche = Longsoran puing bebatuan; Obliterating = Menghancurkan total.'
        }
      },
      {
        id: 14,
        section: 'STRUCTURE',
        skill: 'Inversion with Hardly / Scarcely... when',
        passageOrAudioScript: null,
        questionText: 'Hardly ______ the experimental prototype engine when an unexpected fuel pressure loss occurred.',
        options: ['had the technicians ignited', 'the technicians had ignited', 'the technicians ignited', 'did the technicians ignited'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Konstruksi korelasi "Hardly... when" / "Scarcely... when": Klausa pertama diawali "Hardly" dan WAJIB diinversikan dalam bentuk past perfect: [Hardly] + [had] + [Subject] + [V3 (ignited)].',
          whyOthersWrong: {
            A: 'BENAR: Pola inversi tepat (had + the technicians + ignited).',
            B: 'SALAH: Susunan normal tanpa inversi.',
            C: 'SALAH: Simple past tanpa auxiliary inversi.',
            D: 'SALAH: "did" tidak boleh dipadukan dengan V2/V3 (ignited).'
          },
          grammarRule: 'Hardly / Scarcely + had + Subject + V3 ... when + S + V2.',
          vocabulary: 'Prototype engine = Mesin purwarupa; Ignited = Menyalakan pengapian.'
        }
      },
      {
        id: 15,
        section: 'STRUCTURE',
        skill: 'Written Expression (Inversion Word Order Error)',
        passageOrAudioScript: null,
        questionText: 'Identify the incorrect word or phrase:\n"Not until the late nineteenth century (A) [the electric generator] (B) [was] widely adopted (C) [for commercial power] generation and (D) [illumination]."',
        options: ['A (the electric generator)', 'B (was)', 'C (for commercial power)', 'D (illumination)'],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Bagian (A)-(B) memiliki kesalahan urutan inversi. Kalimat diawali oleh frasa pembatas "Not until...". Oleh karena itu, auxiliary "was" WAJIB mendahului subjek ("was the electric generator", bukan "the electric generator was").',
          whyOthersWrong: {
            A: 'SALAH SUSUNAN: Menjadi bagian dari kesalahan inversi dengan (B).',
            B: 'SALAH (JAWABAN BENAR): "was" seharusnya diletakkan SEBELUM "the electric generator".',
            C: 'BENAR (tidak salah): Frasa preposisi tujuan yang tepat.',
            D: 'BENAR (tidak salah): Noun paralel dengan "generation".'
          },
          grammarRule: 'Not until + [Time], + [Auxiliary + Subject + Verb].',
          vocabulary: 'Illumination = Penerangan lampu; Adopted = Diterapkan secara luas.'
        }
      }
    ];

    const SEED_APPOSITIVE_SET_15 = [
      {
        id: 1,
        section: 'STRUCTURE',
        skill: 'Appositive Identification (Subject Selection)',
        passageOrAudioScript: null,
        questionText: '______ , a prominent American astronomer, discovered Pluto in 1930.',
        options: ['Clyde Tombaugh', 'Clyde Tombaugh was', 'It was Clyde Tombaugh', 'Because Clyde Tombaugh'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Frasa ", a prominent American astronomer," adalah appositive di antara koma yang menjelaskan subjek. Kalimat sudah memiliki verb utama "discovered". Oleh karena itu, posisi awal hanya membutuhkan subjek tunggal murni "Clyde Tombaugh".',
          whyOthersWrong: {
            A: 'BENAR: Subjek murni yang melengkapi predikat "discovered".',
            B: 'SALAH: Menambahkan verb "was" berlebih (double verb).',
            C: 'SALAH: Membentuk cleft sentence yang menggantung.',
            D: 'SALAH: Menjadikan klausa subordinat yang tidak tuntas.'
          },
          grammarRule: '[Subject] + , [Appositive] , + [Main Verb] ...',
          vocabulary: 'Prominent = Terkemuka/terkenal; Astronomer = Ahli astronomi.'
        }
      },
      {
        id: 2,
        section: 'STRUCTURE',
        skill: 'Middle Appositive Phrase Selection',
        passageOrAudioScript: null,
        questionText: 'The Amazon River, ______, flows across northern South America before emptying into the Atlantic Ocean.',
        options: ['the largest river by discharge volume in the world', 'is the largest river in the world', 'which it is the largest river', 'it is the largest river'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Di antara dua koma setelah subjek "The Amazon River", dibutuhkan noun phrase appositive murni tanpa kata kerja (verb), karena predikat utama kalimat sudah ada yaitu "flows".',
          whyOthersWrong: {
            A: 'BENAR: Noun phrase appositive murni tanpa verb.',
            B: 'SALAH: Menambahkan verb "is" sehingga terjadi double verb ("is" dan "flows").',
            C: 'SALAH: Relative pronoun "which" dipadukan pronoun "it" berlebih.',
            D: 'SALAH: Menambahkan independent clause di antara koma.'
          },
          grammarRule: 'Subject, + [Noun Phrase Appositive], + Main Verb.',
          vocabulary: 'Discharge volume = Volume debit aliran air; Emptying into = Bermuara ke.'
        }
      },
      {
        id: 3,
        section: 'STRUCTURE',
        skill: 'Initial Appositive Phrase Selection',
        passageOrAudioScript: null,
        questionText: '______, Marie Curie conducted pioneering research on radioactive elements and discovered radium.',
        options: ['A trailblazing Nobel laureate in two scientific fields', 'She was a trailblazing Nobel laureate', 'Because she was a Nobel laureate', 'As a trailblazing Nobel laureate was'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Bagian sebelum koma adalah initial appositive (frasa penjelas di awal). Appositive harus berupa noun phrase murni tanpa subject/verb, karena subjek "Marie Curie" dan predikat "conducted" sudah lengkap setelah koma.',
          whyOthersWrong: {
            A: 'BENAR: Noun phrase appositive penjelas Marie Curie.',
            B: 'SALAH: Membentuk klausa mandiri yang menciptakan comma splice.',
            C: 'SALAH: Klausa adverbial sebab-akibat yang mengubah fokus struktur.',
            D: 'SALAH: Susunan kata rancu.'
          },
          grammarRule: '[Initial Appositive Noun Phrase], + [Subject + Verb + Object].',
          vocabulary: 'Trailblazing = Pelopor; Laureate = Peraih penghargaan bergengsi.'
        }
      },
      {
        id: 4,
        section: 'STRUCTURE',
        skill: 'Appositive with Proper Noun Subordinate',
        passageOrAudioScript: null,
        questionText: 'Dr. Charles Drew, ______, established the first large-scale blood bank system during World War II.',
        options: ['a pioneering African American surgeon', 'was a pioneering surgeon', 'who he was a pioneering surgeon', 'a pioneering surgeon who he'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Posisi di antara koma menerangkan "Dr. Charles Drew". Kalimat sudah memiliki predikat "established". Pilihan (A) menyediakan noun phrase appositive yang tepat tanpa verb berlebih.',
          whyOthersWrong: {
            A: 'BENAR: Noun phrase penjelas profesi Dr. Charles Drew.',
            B: 'SALAH: Menambahkan verb "was" (double verb).',
            C: 'SALAH: Double pronoun trap ("who he was").',
            D: 'SALAH: Struktur frasa rancu.'
          },
          grammarRule: 'Subject, [Appositive], Verb + Object.',
          vocabulary: 'Surgeon = Dokter bedah; Large-scale = Skala besar.'
        }
      },
      {
        id: 5,
        section: 'STRUCTURE',
        skill: 'Non-Essential Appositive with Superlative',
        passageOrAudioScript: null,
        questionText: 'The coastal redwood, ______, can reach heights exceeding one hundred meters in temperate rainforests.',
        options: ['the tallest living tree species on Earth', 'is the tallest tree species on Earth', 'which is it the tallest tree', 'it is the tallest tree species'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Subjek adalah "The coastal redwood" dan predikat utama adalah "can reach". Di antara dua koma hanya dibutuhkan frasa penjelas appositive (noun phrase) "the tallest living tree species on Earth".',
          whyOthersWrong: {
            A: 'BENAR: Appositive noun phrase murni.',
            B: 'SALAH: Mengandung verb "is" berlebih.',
            C: 'SALAH: Struktur relative clause salah.',
            D: 'SALAH: Klausa mandiri (double subject).'
          },
          grammarRule: 'Appositive menjelaskan identitas subjek tanpa membawa finite verb.',
          vocabulary: 'Coastal redwood = Pohon kayu merah pesisir; Exceeding = Melebihi.'
        }
      },
      {
        id: 6,
        section: 'STRUCTURE',
        skill: 'Initial Appositive for Chemical Element',
        passageOrAudioScript: null,
        questionText: '______, helium does not readily combine with other chemical elements to form compounds.',
        options: ['An odorless and completely inert noble gas', 'It is an odorless noble gas', 'Helium is an odorless noble gas', 'Because an odorless noble gas'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Frasa sebelum koma menerangkan subjek "helium". Pilihan (A) adalah noun phrase appositive yang mendeskripsikan sifat gas helium secara baku.',
          whyOthersWrong: {
            A: 'BENAR: Appositive di awal kalimat.',
            B: 'SALAH: Klausa mandiri (comma splice).',
            C: 'SALAH: Subjek helium terulang dua kali.',
            D: 'SALAH: Klausa subordinat tanpa verb.'
          },
          grammarRule: '[Initial Noun Phrase Appositive], [Subject + Verb].',
          vocabulary: 'Odorless = Tidak berbau; Inert noble gas = Gas mulia yang lembam (tidak reaktif).'
        }
      },
      {
        id: 7,
        section: 'STRUCTURE',
        skill: 'Appositive Specifying Work of Art / Architecture',
        passageOrAudioScript: null,
        questionText: 'Frank Lloyd Wright\'s architectural masterpiece, ______, was constructed directly over a natural waterfall in Pennsylvania.',
        options: ['Fallingwater', 'which named Fallingwater', 'it was Fallingwater', 'was Fallingwater'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Subjek kalimat adalah "Frank Lloyd Wright\'s architectural masterpiece" dan predikatnya adalah "was constructed". Di antara dua koma diletakkan nama spesifik karya tersebut ("Fallingwater") sebagai appositive penjelas.',
          whyOthersWrong: {
            A: 'BENAR: Nama benda sebagai appositive tunggal.',
            B: 'SALAH: Relative clause tanpa to be pasif (which was named).',
            C: 'SALAH: Klausa mandiri berlebih.',
            D: 'SALAH: Menambahkan verb "was".'
          },
          grammarRule: 'Appositive berupa nama diri (Proper Noun) diapit koma.',
          vocabulary: 'Masterpiece = Mahakarya; Waterfall = Air terjun.'
        }
      },
      {
        id: 8,
        section: 'STRUCTURE',
        skill: 'Appositive Explaining Scientific Instrument',
        passageOrAudioScript: null,
        questionText: 'The seismograph, ______, records the precise amplitude and duration of subsurface shockwaves.',
        options: ['an essential instrument in earthquake research', 'is an essential instrument', 'which it is an essential instrument', 'being an instrument which'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Predikat kalimat sudah ada ("records"). Posisi di antara koma membutuhkan appositive noun phrase "an essential instrument in earthquake research" yang menjelaskan alat seismograf.',
          whyOthersWrong: {
            A: 'BENAR: Noun phrase appositive murni.',
            B: 'SALAH: Menambahkan verb "is" berlebih.',
            C: 'SALAH: Relative clause rancu dengan pronoun "it".',
            D: 'SALAH: Struktur menggantung.'
          },
          grammarRule: 'Subject, [Appositive], Verb + Object.',
          vocabulary: 'Amplitude = Amplitudo gelombang; Subsurface = Di bawah permukaan bumi.'
        }
      },
      {
        id: 9,
        section: 'STRUCTURE',
        skill: 'Initial Appositive for Biological Organ',
        passageOrAudioScript: null,
        questionText: '______, the pancreas produces insulin and glucagon to regulate blood glucose homeostasis.',
        options: ['A vital organ of the human endocrine system', 'It is a vital organ of the system', 'The pancreas is a vital organ', 'Being that a vital organ'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Pilihan (A) adalah noun phrase appositive di awal kalimat yang menerangkan organ "the pancreas". Kalimat utama "the pancreas produces..." sudah memiliki Subjek dan Verb lengkap.',
          whyOthersWrong: {
            A: 'BENAR: Initial appositive yang tepat.',
            B: 'SALAH: Comma splice (klausa mandiri sebelum koma).',
            C: 'SALAH: Mengulang subjek pancreas.',
            D: 'SALAH: Frasa rancu.'
          },
          grammarRule: '[Appositive], [Subject + Verb + Object].',
          vocabulary: 'Endocrine system = Sistem endokrin; Homeostasis = Keseimbangan biologis tubuh.'
        }
      },
      {
        id: 10,
        section: 'STRUCTURE',
        skill: 'Appositive with Geographic Formation',
        passageOrAudioScript: null,
        questionText: 'Mount Everest, ______, attracts hundreds of experienced mountaineers during the brief spring climbing window.',
        options: ['the highest peak above sea level in the world', 'is the highest peak in the world', 'which peak is the highest', 'it stands as the highest peak'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Subjek "Mount Everest" dan predikat "attracts". Di antara koma disisipkan noun phrase appositive "the highest peak above sea level in the world".',
          whyOthersWrong: {
            A: 'BENAR: Appositive noun phrase yang tepat.',
            B: 'SALAH: Verb "is" menghasilkan double verb.',
            C: 'SALAH: Struktur relative clause salah.',
            D: 'SALAH: Klausa mandiri.'
          },
          grammarRule: 'Subject, + [Appositive], + Verb.',
          vocabulary: 'Peak = Puncak gunung; Mountaineers = Pendaki gunung.'
        }
      },
      {
        id: 11,
        section: 'STRUCTURE',
        skill: 'Appositive Distinguishing Famous Scientist',
        passageOrAudioScript: null,
        questionText: 'Jane Goodall, ______, transformed modern primatology through her pioneering field studies of wild chimpanzees.',
        options: ['a renowned British primatologist and anthropologist', 'she was a British primatologist', 'who she was a British primatologist', 'was a British primatologist who'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Diapit dua koma untuk menerangkan Jane Goodall. Predikat kalimat adalah "transformed". Pilihan (A) adalah appositive noun phrase murni tanpa verb.',
          whyOthersWrong: {
            A: 'BENAR: Noun phrase appositive profesi.',
            B: 'SALAH: Menyisipkan pronoun "she" dan verb "was".',
            C: 'SALAH: Double pronoun trap ("who she was").',
            D: 'SALAH: Struktur klausa menggantung.'
          },
          grammarRule: 'Subject, [Appositive], Verb + Object.',
          vocabulary: 'Primatology = Ilmu studi primata; Pioneering = Pelopor/rintisan.'
        }
      },
      {
        id: 12,
        section: 'STRUCTURE',
        skill: 'Initial Appositive Explaining Biological Process',
        passageOrAudioScript: null,
        questionText: '______, photosynthesis enables plants to convert sunlight into usable biochemical energy.',
        options: ['A fundamental biochemical process in green plants', 'Photosynthesis is a fundamental process', 'It is a fundamental process', 'Because a fundamental process is'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Initial appositive di awal kalimat mendeskripsikan "photosynthesis". Pilihan (A) menyediakan noun phrase appositive yang tepat.',
          whyOthersWrong: {
            A: 'BENAR: Initial appositive noun phrase.',
            B: 'SALAH: Mengulang subjek dan verb "Photosynthesis is".',
            C: 'SALAH: Comma splice.',
            D: 'SALAH: Subordinat yang tidak beraturan.'
          },
          grammarRule: '[Initial Appositive], [Subject + Verb].',
          vocabulary: 'Fundamental = Mendasar; Usable biochemical energy = Energi biokimiawi siap pakai.'
        }
      },
      {
        id: 13,
        section: 'STRUCTURE',
        skill: 'Trailing Appositive at the End of a Sentence',
        passageOrAudioScript: null,
        questionText: 'The NASA OSIRIS-REx spacecraft successfully collected mineral samples from Bennu, ______ orbiting millions of miles from Earth.',
        options: ['a near-Earth carbonaceous asteroid', 'is a carbonaceous asteroid', 'which it is an asteroid', 'it was a carbonaceous asteroid'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Appositive di akhir kalimat (trailing appositive) setelah koma menerangkan kata benda "Bennu". Pilihan (A) "a near-Earth carbonaceous asteroid" adalah noun phrase penjelas murni.',
          whyOthersWrong: {
            A: 'BENAR: Trailing noun phrase appositive.',
            B: 'SALAH: Menambahkan verb "is" tanpa connector.',
            C: 'SALAH: "which it is" mengandung double pronoun.',
            D: 'SALAH: Klausa mandiri setelah koma tanpa conjunction.'
          },
          grammarRule: 'Sentence, + [Trailing Appositive Noun Phrase].',
          vocabulary: 'Carbonaceous asteroid = Asteroid kaya karbon; Spacecraft = Pesawat ruang angkasa.'
        }
      },
      {
        id: 14,
        section: 'STRUCTURE',
        skill: 'Appositive Identifying Historical Figure',
        passageOrAudioScript: null,
        questionText: 'Johannes Gutenberg, ______, revolutionized the preservation and dissemination of human knowledge across Europe.',
        options: ['the inventor of movable metal type printing', 'he invented movable metal type', 'who he invented metal type', 'was the inventor of movable type'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Di antara dua koma menerangkan "Johannes Gutenberg". Predikat utama kalimat adalah "revolutionized". Pilihan (A) adalah noun phrase appositive murni.',
          whyOthersWrong: {
            A: 'BENAR: Appositive noun phrase penjelas penemu mesin cetak.',
            B: 'SALAH: Double subject dengan pronoun "he" dan verb "invented".',
            C: 'SALAH: Double pronoun trap ("who he").',
            D: 'SALAH: Menambahkan verb "was" berlebih.'
          },
          grammarRule: 'Subject, [Appositive], Verb + Object.',
          vocabulary: 'Movable metal type = Huruf cetak logam lepas-pasang; Dissemination = Penyebaran luas.'
        }
      },
      {
        id: 15,
        section: 'STRUCTURE',
        skill: 'Written Expression (Verb Trap in Appositive Error)',
        passageOrAudioScript: null,
        questionText: 'Identify the incorrect word or phrase:\n"The platypus, (A) [is a semi-aquatic mammal] endemic to eastern Australia, (B) [lays] eggs instead of (C) [giving birth] to live (D) [young]."',
        options: ['A (is a semi-aquatic mammal)', 'B (lays)', 'C (giving birth)', 'D (young)'],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Bagian (A) SALAH karena menyisipkan verb "is" di dalam appositive. Kalimat sudah memiliki predikat utama "lays" (The platypus... lays eggs). Frasa di antara koma harus berupa appositive murni tanpa verb: "a semi-aquatic mammal".',
          whyOthersWrong: {
            A: 'SALAH (JAWABAN BENAR): Hapus kata "is" agar menjadi appositive yang benar.',
            B: 'BENAR (tidak salah): Verb singular sesuai subjek "The platypus".',
            C: 'BENAR (tidak salah): Gerund setelah preposisi "instead of".',
            D: 'BENAR (tidak salah): Noun bermakna keturunan/anak hewan.'
          },
          grammarRule: 'Appositive di antara dua koma TIDAK BOLEH diawali kata kerja finite (is, was, were).',
          vocabulary: 'Semi-aquatic = Hidup di air dan darat; Endemic = Khas / asli wilayah tertentu.'
        }
      }
    ];

    const TOEFL_TOPICS_CATALOG = {
      STRUCTURE: [
        { value: 'Subject & Verb Completeness', label: '1. Subject & Verb Completeness (Kesesuaian Subjek & Kata Kerja Tunggal/Jamak)', desc: 'Dasar mutlak: setiap klausa utama wajib memiliki Subjek dan Kata Kerja (Verb) yang selaras.' },
        { value: 'Inversion after Negative Expressions', label: '2. Inversion (Pembalikan Subjek-Verb: Never, Rarely, Not Only, Seldom)', desc: 'Pola pembalikan kata kerja bantu ke depan subjek saat kalimat diawali kata negatif.' },
        { value: 'Appositive & Clause Structure', label: '3. Appositive (Keterangan Penjelas Subjek di Antara Koma)', desc: 'Frasa penjelas kata benda tanpa menjadi subjek utama.' },
        { value: 'Reduced Relative Clauses (Participles)', label: '4. Reduced Relative Clauses (Penyederhanaan Klausa: V-ing aktif & V3 pasif)', desc: 'Penyederhanaan anak kalimat menjadi participle aktif (-ing) atau pasif (V3).' },
        { value: 'Parallel Structure with Conjunctions', label: '5. Parallel Structure (Kesejajaran Kata: and, but, or, both...and)', desc: 'Bentuk kata yang setara dalam daftar atau pasangan kata hubung korelatif.' },
        { value: 'Coordinate & Adverb Connectors', label: '6. Clause Connectors (Kata Hubung Klausa: although, because, since, whereas)', desc: 'Penggunaan kata sambung antar klausa majemuk bertingkat.' },
        { value: 'Noun Clauses & Adjective Clauses', label: '7. Noun & Adjective Clauses (Klausa Benda & Sifat: that, which, who, whether)', desc: 'Pengenalan klausa kompleks sebagai subjek/objek atau penjelas kata benda.' },
        { value: 'Passive Voice & Causative Verbs', label: '8. Passive Voice & Causatives (Kalimat Pasif & Kausatif: have/make/get)', desc: 'Pola subjek menerima tindakan atau menyuruh pihak lain bertindak.' },
        { value: 'Conditionals & Wishes (If Clauses)', label: '9. Conditionals & Wishes (Pengandaian Tipe 1, 2, 3 & Harapan)', desc: 'Rumus pengandaian masa kini, masa lampau, dan penyesalan masa lalu.' },
        { value: 'Comparative & Superlative Degrees', label: '10. Comparatives (Tingkat Perbandingan & The more..., the more...)', desc: 'Perbandingan lebih/paling dan pola perbandingan ganda.' },
        { value: 'Word Form & Word Choice Errors', label: '11. Word Form (Kesalahan Bentuk Kata: Noun, Verb, Adjective, Adverb)', desc: 'Menemukan salah penempatan jenis kata dalam kalimat Written Expression.' },
        { value: 'Countable vs Uncountable Nouns & Quantifiers', label: '12. Nouns & Quantifiers (Much/Many, Little/Few, Each/Every)', desc: 'Kesesuaian jumlah pada benda hitung vs tak hitung.' },
        { value: 'Prepositional Phrases & Word Order', label: '13. Prepositions & Word Order (Frasa Preposisi & Urutan Kata Baku)', desc: 'Letak kata preposisi yang tepat dan susunan kata baku.' },
        { value: 'Modal Auxiliaries & Subjunctive', label: '14. Modals & Subjunctive (Kata Kerja Bantu & Mandat: demand that...)', desc: 'Kaidah kata kerja bantu dan bentuk dasar verb setelah klausa mandat.' },
        { value: 'Redundancy & Double Subjects', label: '15. Written Expression Traps (Penghapusan Pemborosan Kata & Subjek Ganda)', desc: 'Mendeteksi kata ganda mubazir yang sering muncul di tes resmi.' },
        { value: '__custom__', label: '✏️ [Ketik Topik Sendiri / Custom Topic...]', desc: 'Masukkan topik atau kaidah grammar spesifik yang Anda inginkan.' }
      ],
      LISTENING: [
        { value: 'Short Dialogues: Restatement & Synonyms', label: '1. Restatement & Synonyms (Part A: Parafrase Sinonim Pembicara Kedua)', desc: 'Kunci jawaban listening hampir selalu merupakan parafrase makna dari speaker kedua.' },
        { value: 'Negative Expressions & Double Negatives', label: '2. Negative Expressions (Part A: Ungkapan Negatif & Makna Sebenarnya)', desc: 'Mengartikan ungkapan negatif menjadi makna positif yang tersirat.' },
        { value: 'Suggestions & Polite Requests', label: '3. Suggestions (Part A: Ungkapan Saran - Why not, Let\'s, Why don\'t)', desc: 'Mengenali frasa ajakan atau rekomendasi santun dari lawan bicara.' },
        { value: 'Idiomatic Expressions & Everyday Phrasal Verbs', label: '4. Idioms & Phrasal Verbs (Part A: Makna Kiasan & Frasa Idiom)', desc: 'Makna kiasan umum dalam percakapan informal sehari-hari di Amerika.' },
        { value: 'Who, What, Where Inferences', label: '5. Inferences (Part A: Menentukan Siapa, Pekerjaan, & Lokasi Percakapan)', desc: 'Menyimpulkan profesi pembicara atau lokasi percakapan berdasarkan konteks suara.' },
        { value: 'Agreement & Disagreement Expressions', label: '6. Agreement (Part A: You can say that again, Neither do I, So do I)', desc: 'Ungkapan persetujuan dan sanggahan mutlak antar pembicara.' },
        { value: 'Wishes & Unreal Conditions in Dialogues', label: '7. Wishes & Unreal Conditions (Part A: Pengandaian & Harapan)', desc: 'Kondisi fakta berlawanan dari apa yang diucapkan pembicara.' },
        { value: 'Long Conversations on Campus Life', label: '8. Long Conversations (Part B: Percakapan Akademik & Kampus)', desc: 'Percakapan lebih panjang mengenai tugas kuliah, perpustakaan, atau asrama.' },
        { value: 'Academic Mini-Lectures & Scientific Talks', label: '9. Academic Talks (Part C: Kuliah Singkat Biologi, Sejarah, Sains)', desc: 'Monolog dosen mengenai materi sains, sejarah alam, seni, dan geologi.' },
        { value: '__custom__', label: '✏️ [Ketik Topik Sendiri / Custom Topic...]', desc: 'Masukkan topik listening spesifik yang Anda inginkan.' }
      ],
      READING: [
        { value: 'Main Idea & Paragraph Organization', label: '1. Main Idea (Menemukan Gagasan Pokok & Judul Teks)', desc: 'Strategi membaca cepat kalimat topik untuk menangkap tema sentral bacaan.' },
        { value: 'Stated Factual Detail Questions', label: '2. Stated Details (Menemukan Fakta Tertulis Menurut Bacaan)', desc: 'Menemukan informasi eksplisit yang dinyatakan dalam teks.' },
        { value: 'Unstated / Negative Detail (EXCEPT) Questions', label: '3. Negative Details / EXCEPT (Menemukan yang TIDAK Disebutkan)', desc: 'Mengeliminasi fakta yang benar untuk menemukan opsi yang salah/tidak ada.' },
        { value: 'Pronoun Referents Identification', label: '4. Pronoun Referents (Menentukan Rujukan Kata Ganti: it, they, which)', desc: 'Menemukan kata benda yang dirujuk oleh kata ganti pada baris tertentu.' },
        { value: 'Vocabulary in Context & Synonym Clues', label: '5. Vocabulary in Context (Menebak Arti Kosakata Berdasarkan Konteks)', desc: 'Menebak definisi kata sulit melalui petunjuk kalimat di sekitarnya.' },
        { value: 'Implied / Inference Questions', label: '6. Inferences (Menarik Kesimpulan Tersirat yang Logis)', desc: 'Menyimpulkan informasi yang tidak tertulis secara eksplisit.' },
        { value: 'Transition Paragraph Questions', label: '7. Transition Questions (Menebak Topik Paragraf Sebelum/Sesudah)', desc: 'Memprediksi isi paragraf pembuka atau penutup berdasarkan transisi.' },
        { value: 'Tone, Author\'s Attitude & Purpose', label: '8. Tone & Purpose (Menentukan Sikap, Nada Penulis, & Tujuan Tulisan)', desc: 'Mengidentifikasi emosi objektif, kritis, atau persuasif penulis teks.' },
        { value: '__custom__', label: '✏️ [Ketik Topik Sendiri / Custom Topic...]', desc: 'Masukkan topik reading spesifik yang Anda inginkan.' }
      ],
      MIX: [
        { value: 'Full Mix Simulation 15 Soal', label: '1. Full Simulation (5 Listening, 5 Structure, 5 Reading)', desc: 'Simulasi lengkap mencakup semua bagian tes resmi TOEFL ITP.' },
        { value: 'High-Yield TOEFL Rules & Traps', label: '2. Top High-Yield Rules (15 Aturan Paling Sering Diuji di TOEFL ITP)', desc: 'Kumpulan materi dan soal dengan frekuensi kemunculan tertinggi.' },
        { value: '__custom__', label: '✏️ [Ketik Topik Sendiri / Custom Topic...]', desc: 'Masukkan topik mix spesifik yang Anda inginkan.' }
      ]
    };

    const SEED_STRUCTURE_SET_15 = [
      {
        id: 1,
        section: 'STRUCTURE',
        skill: 'Subject & Verb Completeness',
        passageOrAudioScript: null,
        questionText: 'The Hubble Space Telescope ______ high-resolution images of distant galaxies across the observable universe.',
        options: [
          'regularly captures',
          'regularly capturing',
          'which regularly captures',
          'was regular capture'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Subjek kalimat adalah "The Hubble Space Telescope" (tunggal) dan kalimat belum memiliki kata kerja utama (main verb). Pilihan (A) "regularly captures" adalah finite verb yang melengkapi kalimat baku.',
          whyOthersWrong: {
            A: 'BENAR: Finite verb (V-s) yang melengkapi subjek tunggal.',
            B: 'SALAH: Present participle (-ing) tidak dapat menjadi verb utama tanpa auxiliary be.',
            C: 'SALAH: Mengubah kalimat menjadi anak kalimat (adjective clause) yang menggantung tanpa induk kalimat.',
            D: 'SALAH: Susunan kata rancu.'
          },
          grammarRule: 'Subject + Verb Completeness: Setiap klausa utama wajib memiliki subjek dan kata kerja utama.',
          vocabulary: 'Observable universe = Alam semesta teramati; High-resolution = Resolusi tinggi.'
        }
      },
      {
        id: 2,
        section: 'STRUCTURE',
        skill: 'Subject-Verb Inversion (Negative Expressions)',
        passageOrAudioScript: null,
        questionText: 'Not only ______ the Nobel Prize in Physics, but Marie Curie also won the Nobel Prize in Chemistry.',
        options: [
          'she received',
          'did she receive',
          'she did receive',
          'she was receiving'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Kalimat diawali dengan kata/frasa negatif korelatif "Not only...". Berdasarkan kaidah inversi, posisi auxiliary harus mendahului subjek: Auxiliary (did) + Subject (she) + Verb (receive).',
          whyOthersWrong: {
            A: 'SALAH: Susunan kalimat biasa tanpa inversi.',
            B: 'BENAR: Pola inversi lampau yang tepat (did + she + receive).',
            C: 'SALAH: Posisi auxiliary berada setelah subjek.',
            D: 'SALAH: Bentuk continuous yang tidak tepat.'
          },
          grammarRule: 'Inversion with Correlative Conjunction: Not only + Aux + S + V1, but S + also + V.',
          vocabulary: 'Nobel Prize = Hadiah Nobel; Receive = Menerima.'
        }
      },
      {
        id: 3,
        section: 'STRUCTURE',
        skill: 'Appositive Identification',
        passageOrAudioScript: null,
        questionText: '______ , a prominent American astronomer, discovered Pluto in 1930.',
        options: [
          'Clyde Tombaugh was',
          'Clyde Tombaugh',
          'It was Clyde Tombaugh',
          'Because Clyde Tombaugh'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Frasa ", a prominent American astronomer," adalah appositive (penjelas). Kalimat sudah memiliki predikat utama "discovered". Oleh karena itu, posisi awal kalimat hanya membutuhkan Subjek tunggal murni, yaitu "Clyde Tombaugh".',
          whyOthersWrong: {
            A: 'SALAH: Menambahkan verb "was" berlebih sehingga kalimat memiliki dua verb tanpa penghubung.',
            B: 'BENAR: Berfungsi sebagai subjek tunggal yang tepat.',
            C: 'SALAH: Menciptakan klausa split yang tidak lengkap.',
            D: 'SALAH: Menjadikan kalimat sebagai anak kalimat klausa adverbia yang menggantung.'
          },
          grammarRule: '[Subject] + , [Appositive] , + [Main Verb] ...',
          vocabulary: 'Prominent = Terkemuka/terkenal; Astronomer = Ahli astronomi.'
        }
      },
      {
        id: 4,
        section: 'STRUCTURE',
        skill: 'Reduced Relative Clause (Passive Participle)',
        passageOrAudioScript: null,
        questionText: 'The ancient manuscript ______ in the monastic vault dates back to the ninth century.',
        options: [
          'was discovered',
          'discovering',
          'discovered',
          'which discovered'
        ],
        correctAnswer: 'C',
        explanation: {
          whyCorrect: 'Kalimat sudah memiliki verb utama yaitu "dates back". Bagian kosong membutuhkan participle pasif yang mereduksi relative clause ("which was discovered" -> "discovered").',
          whyOthersWrong: {
            A: 'SALAH: Menghasilkan double verb ("was discovered" dan "dates back").',
            B: 'SALAH: Present participle bermakna aktif (naskah tidak menemukan dirinya sendiri).',
            C: 'BENAR: Past participle pasif yang tepat menjelaskan naskah yang ditemukan.',
            D: 'SALAH: Kalimat aktif yang rancu.'
          },
          grammarRule: 'Reduced Adjective Clause (Passive): Noun + V3 (Past Participle).',
          vocabulary: 'Manuscript = Naskah kuno; Monastic vault = Ruang besi biara.'
        }
      },
      {
        id: 5,
        section: 'STRUCTURE',
        skill: 'Parallel Structure with Conjunctions',
        passageOrAudioScript: null,
        questionText: 'Photosynthesis is the process by which green plants capture solar energy, convert it into chemical fuel, and ______ oxygen into the atmosphere.',
        options: [
          'release',
          'releasing',
          'they release',
          'to release'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Hukum paralelisme (Parallel Structure): Verb yang dihubungkan dengan koma dan kata "and" harus memiliki bentuk yang setara: "capture" (V1), "convert" (V1), and "release" (V1).',
          whyOthersWrong: {
            A: 'BENAR: Bentuk V1 paralel dengan capture & convert.',
            B: 'SALAH: Bentuk gerund/participle (-ing) tidak paralel.',
            C: 'SALAH: Menambahkan pronoun subjek yang tidak paralel.',
            D: 'SALAH: Bentuk to-infinitive tidak setara.'
          },
          grammarRule: 'Parallel Structure: V1, V1, and V1.',
          vocabulary: 'Photosynthesis = Fotosintesis; Solar energy = Energi surya.'
        }
      },
      {
        id: 6,
        section: 'STRUCTURE',
        skill: 'Clause Connectors (Adverb Clauses)',
        passageOrAudioScript: null,
        questionText: '______ the heavy downpour flooded several major intersections, the marathon runners continued their race.',
        options: [
          'Although',
          'Despite',
          'Because of',
          'However'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Klausa pertama memiliki Subject ("the heavy downpour") dan Verb ("flooded"). Oleh karena itu, dibutuhkan Subordinating Conjunction "Although", bukan preposisi ("Despite" / "Because of" yang hanya diikuti kata benda).',
          whyOthersWrong: {
            A: 'BENAR: "Although" diikuti Subject + Verb untuk menyatakan pertentangan.',
            B: 'SALAH: "Despite" adalah preposisi (harus diikuti Noun Phrase).',
            C: 'SALAH: "Because of" adalah preposisi sebab-akibat.',
            D: 'SALAH: "However" adalah conjunctive adverb, bukan subordinating connector.'
          },
          grammarRule: 'Although + Subject + Verb, Subject + Verb (Contrast Adverb Clause).',
          vocabulary: 'Downpour = Hujan lebat; Intersections = Persimpangan jalan.'
        }
      },
      {
        id: 7,
        section: 'STRUCTURE',
        skill: 'Noun Clause Markers',
        passageOrAudioScript: null,
        questionText: '______ surprised the evolutionary biologists was the discovery of complex multicellular fossils in ancient strata.',
        options: [
          'That',
          'What',
          'Which',
          'There'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: '"What" berfungsi ganda sebagai noun clause marker sekaligus subjek dari klausa "surprised the evolutionary biologists". Seluruh klausa bertindak sebagai subjek dari main verb "was".',
          whyOthersWrong: {
            A: 'SALAH: "That" sebagai marker membutuhkan klausa lengkap (Subject + Verb) setelahnya.',
            B: 'BENAR: "What" (= The thing that) menggantikan hal/subjek yang mengejutkan para ilmuwan.',
            C: 'SALAH: "Which" digunakan pada relative clause, bukan noun clause subjek awal.',
            D: 'SALAH: Tidak membentuk noun clause.'
          },
          grammarRule: 'Noun Clause as Subject: [What + Verb + Object] + Main Verb ...',
          vocabulary: 'Strata = Lapisan batuan geologis; Multicellular = Bersel banyak.'
        }
      },
      {
        id: 8,
        section: 'STRUCTURE',
        skill: 'Causative Verbs',
        passageOrAudioScript: null,
        questionText: 'The museum curator had the restoration expert ______ the centuries-old oil painting with extreme precision.',
        options: [
          'clean',
          'to clean',
          'cleaned',
          'cleaning'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Rumus kata kerja kausatif aktif dengan "have": [Subject] + [have/had] + [Person/Agent] + [Bare Infinitive / V1 murni]. Jadi setelah "the restoration expert" harus berbentuk V1 murni yaitu "clean".',
          whyOthersWrong: {
            A: 'BENAR: Bare infinitive (V1) setelah causative "had + agent".',
            B: 'SALAH: Tidak menggunakan "to" setelah have causative.',
            C: 'SALAH: Bentuk V3 hanya dipakai untuk causative pasif (had the painting cleaned).',
            D: 'SALAH: Bentuk participle -ing tidak tepat.'
          },
          grammarRule: 'Active Causative: Subject + have/had + Agent + Verb 1 (Bare Infinitive).',
          vocabulary: 'Curator = Pengurus museum; Restoration = Pemugaran/perbaikan karya seni.'
        }
      },
      {
        id: 9,
        section: 'STRUCTURE',
        skill: 'Inverted Conditionals (Past Unreal)',
        passageOrAudioScript: null,
        questionText: '______ more detailed geological surveys, the construction team would have avoided building over the fault line.',
        options: [
          'Had the engineers conducted',
          'If the engineers conducted',
          'The engineers had conducted',
          'Did the engineers conduct'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Bentuk inversi dari Conditional Type 3 (menghilangkan kata "If"): "If the engineers had conducted" diinversi menjadi "Had the engineers conducted".',
          whyOthersWrong: {
            A: 'BENAR: Pola inversi Conditional Type 3 (Had + Subject + V3).',
            B: 'SALAH: "If" dengan V2 (conducted) adalah Type 2, tidak cocok dengan "would have avoided" (Type 3).',
            C: 'SALAH: Kalimat tanpa connector menciptakan comma splice.',
            D: 'SALAH: "Did" bukan auxiliary untuk past unreal conditional.'
          },
          grammarRule: 'Inverted Conditional Type 3: Had + Subject + Past Participle (V3), Subject + would have + V3.',
          vocabulary: 'Fault line = Patahan lempeng bumi; Geological surveys = Survei geologi.'
        }
      },
      {
        id: 10,
        section: 'STRUCTURE',
        skill: 'Double Comparatives',
        passageOrAudioScript: null,
        questionText: 'The denser the medium through which a wave travels, ______ sound propagates.',
        options: [
          'the faster',
          'faster',
          'it is faster',
          'the most fast'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Pola perbandingan ganda (Double Comparative): "The + comparative ..., the + comparative ...". Karena klausa pertama "The denser...", maka klausa kedua wajib berpasangan dengan "the faster".',
          whyOthersWrong: {
            A: 'BENAR: "The faster" melengkapi pola [The comparative ..., the comparative ...].',
            B: 'SALAH: Tidak memiliki artikel "the".',
            C: 'SALAH: Tidak menggunakan formula perbandingan ganda.',
            D: 'SALAH: Bentuk superlatif yang tidak sesuai rumus.'
          },
          grammarRule: 'Double Comparative: The + [Comparative] + [S + V], the + [Comparative] + [S + V].',
          vocabulary: 'Propagate = Merambat; Medium = Zat perantara.'
        }
      },
      {
        id: 11,
        section: 'STRUCTURE',
        skill: 'Written Expression (Subject-Verb Agreement Error)',
        passageOrAudioScript: null,
        questionText: 'Identify the incorrect word or phrase:\n"Although (A) [most of] the planets in our solar system (B) [has] rings, Saturn\'s rings (C) [are] by far the most (D) [spectacular]."',
        options: [
          'A (most of)',
          'B (has)',
          'C (are)',
          'D (spectacular)'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Subjek klausa adalah "most of the planets" (kata benda jamak). Kata kerja yang menyertainya harus berbentuk jamak "have", bukan "has".',
          whyOthersWrong: {
            A: 'BENAR: Penggunaan "most of" sudah tepat sebelum noun plural definite.',
            B: 'SALAH GRAMMAR (Jawaban kuis): Seharusnya "have" karena subjeknya jamak (planets).',
            C: 'BENAR: "are" selaras dengan subjek jamak "Saturn\'s rings".',
            D: 'BENAR: "spectacular" adalah kata sifat yang tepat setelah superlative "the most".'
          },
          grammarRule: 'Quantifier Agreement: most of + Plural Noun + Plural Verb.',
          vocabulary: 'Spectacular = Menakjubkan.'
        }
      },
      {
        id: 12,
        section: 'STRUCTURE',
        skill: 'Written Expression (Word Form / Adverb Error)',
        passageOrAudioScript: null,
        questionText: 'Identify the incorrect word or phrase:\n"The economic committee (A) [thorough] reviewed the annual budget proposal and (B) [recommended] several (C) [crucial] amendments prior to the (D) [final] vote."',
        options: [
          'A (thorough)',
          'B (recommended)',
          'C (crucial)',
          'D (final)'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kata yang menjelaskan kata kerja "reviewed" harus berupa Kata Keterangan (Adverb) yaitu "thoroughly", bukan kata sifat (Adjective) "thorough".',
          whyOthersWrong: {
            A: 'SALAH GRAMMAR (Jawaban kuis): Seharusnya "thoroughly" untuk menerangkan kata kerja "reviewed".',
            B: 'BENAR: Verb lampau paralel dengan "reviewed".',
            C: 'BENAR: Adjective "crucial" tepat menerangkan kata benda "amendments".',
            D: 'BENAR: Adjective "final" tepat menerangkan "vote".'
          },
          grammarRule: 'Adverb modifying Verb: [Subject] + [Adverb -ly] + [Main Verb].',
          vocabulary: 'Thoroughly = Secara menyeluruh/saksama; Amendments = Perubahan/amandemen.'
        }
      },
      {
        id: 13,
        section: 'STRUCTURE',
        skill: 'Written Expression (Parallelism Error)',
        passageOrAudioScript: null,
        questionText: 'Identify the incorrect word or phrase:\n"Effective study habits include (A) [organizing] lecture notes, (B) [to review] key concepts daily, and (C) [participating] actively in (D) [group] discussions."',
        options: [
          'A (organizing)',
          'B (to review)',
          'C (participating)',
          'D (group)'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Prinsip kesejajaran (Parallel Structure): Kata-kata yang didaftarkan setelah "include" harus memiliki bentuk yang seragam: organizing (Gerund), reviewing (Gerund), dan participating (Gerund). Opsi (B) menggunakan infinitive "to review" sehingga merusak paralelisme.',
          whyOthersWrong: {
            A: 'BENAR: Bentuk gerund (-ing).',
            B: 'SALAH GRAMMAR (Jawaban kuis): Seharusnya "reviewing" agar paralel dengan organizing dan participating.',
            C: 'BENAR: Bentuk gerund (-ing).',
            D: 'BENAR: Noun adjunct yang menerangkan "discussions".'
          },
          grammarRule: 'Parallel Structure in Series: Gerund, Gerund, and Gerund.',
          vocabulary: 'Habits = Kebiasaan; Actively = Secara aktif.'
        }
      },
      {
        id: 14,
        section: 'STRUCTURE',
        skill: 'Written Expression (Pronoun Agreement Error)',
        passageOrAudioScript: null,
        questionText: 'Identify the incorrect word or phrase:\n"Each species of migratory bird (A) [has] (B) [their] own unique navigational system (C) [guided by] celestial cues and the Earth\'s (D) [magnetic] field."',
        options: [
          'A (has)',
          'B (their)',
          'C (guided by)',
          'D (magnetic)'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Subjek kalimat diawali kata "Each species" yang bersifat tunggal (singular). Oleh karena itu, kata ganti kepemilikan yang merujuk padanya harus berbentuk tunggal "its", bukan jamak "their".',
          whyOthersWrong: {
            A: 'BENAR: Verb singular "has" sesuai dengan subjek "Each species".',
            B: 'SALAH GRAMMAR (Jawaban kuis): Seharusnya "its" untuk merujuk pada subjek tunggal "Each species".',
            C: 'BENAR: Participle pasif yang tepat.',
            D: 'BENAR: Adjective "magnetic" tepat menerangkan "field".'
          },
          grammarRule: 'Pronoun Agreement: Each + Singular Noun dirujuk dengan pronoun tunggal (its / his / her).',
          vocabulary: 'Migratory = Bermigrasi; Celestial cues = Petunjuk posisi bintang/langit.'
        }
      },
      {
        id: 15,
        section: 'STRUCTURE',
        skill: 'Written Expression (Redundancy / Clause Error)',
        passageOrAudioScript: null,
        questionText: 'Identify the incorrect word or phrase:\n"The primary reason (A) [why] the lunar rover stopped transmitting data (B) [was because] its primary solar arrays became (C) [heavily] coated with fine (D) [dust]."',
        options: [
          'A (why)',
          'B (was because)',
          'C (heavily)',
          'D (dust)'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Kaidah baku TOEFL melarang frasa ganda mubazir "The reason ... was because ...". Pola yang benar adalah "The reason ... was that ...".',
          whyOthersWrong: {
            A: 'BENAR: Adverbial relative pronoun yang tepat untuk kata "reason".',
            B: 'SALAH GRAMMAR (Jawaban kuis): Seharusnya "was that" karena "The reason" sudah menyatakan sebab.',
            C: 'BENAR: Adverb menerangkan participle "coated".',
            D: 'BENAR: Uncountable noun yang tepat.'
          },
          grammarRule: 'Redundancy Rule: "The reason ... is that" (BUKAN "The reason ... is because").',
          vocabulary: 'Transmitting = Mengirimkan sinyal; Solar arrays = Panel surya.'
        }
      }
    ];

    const SEED_LISTENING_SET_15 = [
      {
        id: 1,
        section: 'LISTENING',
        skill: 'Restatement & Implication',
        passageOrAudioScript: `(Man) : "Did you get the tickets for tomorrow's chemistry seminar?"\n(Woman) : "They were completely sold out before I even reached the counter."\n(Narrator) : "What does the woman mean?"`,
        questionText: 'What does the woman mean?',
        options: [
          'She arrived too late to purchase the tickets.',
          'She bought all the remaining seminar tickets.',
          'The chemistry counter was closed for the day.',
          'She decided not to attend the seminar.'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Pembicara kedua menyatakan "They were completely sold out before I even reached the counter" yang berarti tiket sudah habis terjual sebelum dia tiba (She arrived too late).',
          whyOthersWrong: {
            A: 'BENAR: Parafrase tepat dari pernyataan pembicara kedua.',
            B: 'SALAH: Dia tidak berhasil membeli tiket sama sekali.',
            C: 'SALAH: Konter tidak tutup, melainkan tiketnya yang habis.',
            D: 'SALAH: Dia berniat datang namun tidak mendapatkan tiket.'
          },
          grammarRule: 'Listening Part A: Fokus pada kata kunci pembicara kedua dan cari parafrasenya.',
          vocabulary: 'Sold out = Habis terjual; Reached = Mencapai / tiba di.'
        }
      },
      {
        id: 2,
        section: 'LISTENING',
        skill: 'Negative Expressions',
        passageOrAudioScript: `(Woman) : "Are you feeling ready for Professor Miller's economics final?"\n(Man) : "I couldn't be more prepared!"\n(Narrator) : "What does the man imply?"`,
        questionText: 'What does the man imply?',
        options: [
          'He needs more time to study economics.',
          'He feels extremely ready for the examination.',
          'He has not prepared for the final test.',
          'He is worried about Professor Miller\'s grading.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Ungkapan "I couldn\'t be more prepared" adalah ekspresi idiomatik penekanan tingkat superlatif positif ("Saya sangat amat siap, tidak bisa lebih siap lagi dari ini").',
          whyOthersWrong: {
            A: 'SALAH: Bertolak belakang dengan makna "sangat siap".',
            B: 'BENAR: Merupakan makna akurat dari ungkapan tersebut.',
            C: 'SALAH: Jebakan kata negatif "couldn\'t".',
            D: 'SALAH: Tidak disebutkan tentang kekhawatiran nilai.'
          },
          grammarRule: 'Negative + Comparative = Superlative Meaning (e.g. couldn\'t be better = the best).',
          vocabulary: 'Prepared = Siap sedia; Final = Ujian akhir semester.'
        }
      },
      {
        id: 3,
        section: 'LISTENING',
        skill: 'Suggestions & Polite Requests',
        passageOrAudioScript: `(Man) : "I'm completely stuck on this computer programming assignment."\n(Woman) : "Why not ask Sarah? She's an absolute whiz at coding."\n(Narrator) : "What does the woman suggest the man do?"`,
        questionText: 'What does the woman suggest the man do?',
        options: [
          'Change his academic major to computer science.',
          'Seek assistance from Sarah for his assignment.',
          'Submit the assignment without finishing it.',
          'Ask the instructor for an extension.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Frasa "Why not ask Sarah?" merupakan pola saran (suggestion) langsung untuk meminta bantuan kepada Sarah yang sangat mahir (whiz at coding).',
          whyOthersWrong: {
            A: 'SALAH: Tidak ada saran mengganti jurusan.',
            B: 'BENAR: Rekomendasi langsung dari pembicara kedua.',
            C: 'SALAH: Tidak disarankan menyerah begitu saja.',
            D: 'SALAH: Tidak disebutkan meminta perpanjangan waktu ke dosen.'
          },
          grammarRule: 'Why not + Verb base = Struktur rekomendasi / anjuran santun.',
          vocabulary: 'Whiz = Orang yang sangat berbakat/ahli; Seek assistance = Meminta pertolongan.'
        }
      },
      {
        id: 4,
        section: 'LISTENING',
        skill: 'Unreal Conditions / Wishes',
        passageOrAudioScript: `(Woman) : "Did Mark join the hiking expedition to Mount Rainier?"\n(Man) : "If he hadn't caught the flu, he would have come along."\n(Narrator) : "What happened to Mark?"`,
        questionText: 'What does the man say about Mark?',
        options: [
          'Mark went on the hiking trip despite being sick.',
          'Mark was ill, so he did not participate in the hike.',
          'Mark caught the flu while climbing the mountain.',
          'Mark refused to go hiking with the group.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Conditional Type 3 ("If he hadn\'t caught the flu, he would have come") menyatakan fakta masa lampau yang berlawanan: Mark terkena flu sehingga ia TIDAK ikut mendaki.',
          whyOthersWrong: {
            A: 'SALAH: Mark tidak jadi ikut mendaki.',
            B: 'BENAR: Fakta nyata dari kondisi lampau tersebut.',
            C: 'SALAH: Dia terkena flu sebelum keberangkatan.',
            D: 'SALAH: Bukan menolak karena benci, tapi karena sakit flu.'
          },
          grammarRule: 'Past Unreal Conditional (If + Past Perfect, would have + V3) menggambarkan fakta lampau sebaliknya.',
          vocabulary: 'Caught the flu = Terserang flu; Come along = Ikut serta.'
        }
      },
      {
        id: 5,
        section: 'LISTENING',
        skill: 'Passive & Agreement Idioms',
        passageOrAudioScript: `(Man) : "The library renovation seems to be taking much longer than anticipated."\n(Woman) : "You can say that again! It was supposed to reopen last month."\n(Narrator) : "What does the woman mean?"`,
        questionText: 'What does the woman mean?',
        options: [
          'She wants the man to repeat his statement.',
          'She strongly agrees that the renovation is delayed.',
          'The library reopened on schedule last month.',
          'She does not know anything about the library.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Ungkapan "You can say that again!" adalah idiom persetujuan mutlak (I completely agree with you).',
          whyOthersWrong: {
            A: 'SALAH: Jebakan makna harfiah kata "say that again".',
            B: 'BENAR: Menunjukkan persetujuan penuh bahwa renovasi molor.',
            C: 'SALAH: Perpustakaan belum dibuka kembali.',
            D: 'SALAH: Pembicara sangat mengetahui status renovasi.'
          },
          grammarRule: 'Idiom Agreement: "You can say that again!" = "I agree 100%".',
          vocabulary: 'Renovation = Pemugaran/perbaikan; Delayed = Tertunda.'
        }
      },
      {
        id: 6,
        section: 'LISTENING',
        skill: 'Who, What, Where Inferences',
        passageOrAudioScript: `(Man) : "Could you tell me which aisle has the organic whole-wheat flour?"\n(Woman) : "It's right down in aisle four, next to the baking and sugar supplies."\n(Narrator) : "Where does this conversation most likely take place?"`,
        questionText: 'Where does this conversation most likely take place?',
        options: [
          'In a grocery supermarket',
          'In a biology laboratory',
          'In a restaurant kitchen',
          'In a university lecture hall'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kata kunci "aisle four", "whole-wheat flour", dan "baking and sugar supplies" adalah petunjuk lokasi supermarket / toko bahan makanan.',
          whyOthersWrong: {
            A: 'BENAR: Petunjuk lorong (aisle) dan tepung gandum merujuk ke supermarket.',
            B: 'SALAH: Bukan lingkungan laboratorium sains.',
            C: 'SALAH: Bukan dapur restoran karena pelanggan menanyakan letak lorong belanja.',
            D: 'SALAH: Tidak ada konteks perkuliahan.'
          },
          grammarRule: 'Inference Listening: Identifikasi kata kunci setting (aisle, counter, clerk).',
          vocabulary: 'Whole-wheat = Gandum utuh; Baking supplies = Bahan kue.'
        }
      },
      {
        id: 7,
        section: 'LISTENING',
        skill: 'Double Negatives',
        passageOrAudioScript: `(Woman) : "Did anyone pass Professor Harrison's rigorous physics exam?"\n(Man) : "No one failed to achieve at least a passing grade."\n(Narrator) : "What does the man mean?"`,
        questionText: 'What does the man mean?',
        options: [
          'No students were able to pass the exam.',
          'Every student passed the physics examination.',
          'Professor Harrison cancelled the grading.',
          'The exam was too difficult for everyone.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Pola negatif ganda "No one failed to achieve..." bermakna positif: Semua orang berhasil lulus ujian fisika tersebut.',
          whyOthersWrong: {
            A: 'SALAH: Makna terbalik dari double negative.',
            B: 'BENAR: No one + failed = Everyone passed.',
            C: 'SALAH: Tidak ada pembatalan ujian.',
            D: 'SALAH: Semua orang lulus.'
          },
          grammarRule: 'Double Negative Rule: Negatif + Negatif = Positif kuat.',
          vocabulary: 'Rigorous = Ketat/sulit; Passing grade = Nilai batas kelulusan.'
        }
      },
      {
        id: 8,
        section: 'LISTENING',
        skill: 'Negative Words with Comparative',
        passageOrAudioScript: `(Man) : "How was the acoustic quality in the newly constructed concert hall?"\n(Woman) : "It could hardly have been better!"\n(Narrator) : "What does the woman imply?"`,
        questionText: 'What does the woman imply?',
        options: [
          'The acoustic quality was somewhat disappointing.',
          'The sound quality was truly extraordinary and optimal.',
          'She was unable to hear the music clearly.',
          'The construction of the hall is still unfinished.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: '"Could hardly have been better" berarti kualitas tata suaranya luar biasa bagus dan hampir sempurna.',
          whyOthersWrong: {
            A: 'SALAH: Bertentangan dengan makna positif.',
            B: 'BENAR: Makna dari idiom superlatif tersebut.',
            C: 'SALAH: Pembicara sangat terkesan dengan suaranya.',
            D: 'SALAH: Gedung sudah selesai dibangun.'
          },
          grammarRule: 'Could hardly be better = The best possible quality.',
          vocabulary: 'Acoustic = Kualitas tata suara; Constructed = Dibangun.'
        }
      },
      {
        id: 9,
        section: 'LISTENING',
        skill: 'Wishes and Regrets',
        passageOrAudioScript: `(Woman) : "Are you flying to Chicago with the university debate team this weekend?"\n(Man) : "I only wish my passport hadn't expired yesterday."\n(Narrator) : "What does the man mean?"`,
        questionText: 'What does the man mean?',
        options: [
          'He has already renewed his travel passport.',
          'He cannot travel to Chicago because his passport is expired.',
          'He decided not to join the debate team.',
          'He will travel by train instead of flying.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: '"I wish my passport hadn\'t expired" menunjukkan fakta nyata: Paspornya sudah kedaluwarsa sehingga ia tidak dapat ikut bepergian.',
          whyOthersWrong: {
            A: 'SALAH: Paspor belum diperbarui.',
            B: 'BENAR: Fakta bahwa ia tidak dapat ikut akibat paspor kedaluwarsa.',
            C: 'SALAH: Dia adalah anggota tim namun terhalang dokumen.',
            D: 'SALAH: Tidak disebutkan opsi kereta api.'
          },
          grammarRule: 'Wish + Past Perfect menyatakan penyesalan atas fakta di masa lalu.',
          vocabulary: 'Expired = Kedaluwarsa; Debate team = Tim debat.'
        }
      },
      {
        id: 10,
        section: 'LISTENING',
        skill: 'Campus Life Routine',
        passageOrAudioScript: `(Woman) : "I can't seem to locate the assigned readings on the course reserve shelf."\n(Man) : "The librarian usually places them behind the main circulation desk."\n(Narrator) : "What should the woman do?"`,
        questionText: 'What should the woman do?',
        options: [
          'Purchase the books at the local bookstore.',
          'Ask the librarian at the main circulation desk.',
          'Wait until next semester to read the material.',
          'Search the general catalog online.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Pembicara kedua menyarankan bahwa buku tandon perkuliahan biasanya disimpan di balik meja sirkulasi utama.',
          whyOthersWrong: {
            A: 'SALAH: Tidak perlu membeli buku baru.',
            B: 'BENAR: Solusi langsung yang diberikan oleh pembicara kedua.',
            C: 'SALAH: Tindakan menunda yang tidak disarankan.',
            D: 'SALAH: Buku sudah ada di meja sirkulasi.'
          },
          grammarRule: 'Listening Campus Context: Perhatikan petunjuk teknis layanan akademik/perpustakaan.',
          vocabulary: 'Course reserve = Koleksi tandon mata kuliah; Circulation desk = Meja sirkulasi/peminjaman.'
        }
      },
      {
        id: 11,
        section: 'LISTENING',
        skill: 'Idiomatic Expressions',
        passageOrAudioScript: `(Man) : "Are you coming to the department welcome reception tonight?"\n(Woman) : "I\'m feeling a bit under the weather, so I\'ll take a rain check."\n(Narrator) : "What will the woman do?"`,
        questionText: 'What will the woman do?',
        options: [
          'Check the weather forecast before leaving.',
          'Attend the reception despite the heavy rain.',
          'Stay home because she feels unwell and attend another time.',
          'Help organize the reception activities.'
        ],
        correctAnswer: 'C',
        explanation: {
          whyCorrect: '"Under the weather" berarti kurang sehat/sakit ringan, dan "take a rain check" adalah idiom menunda janji ke lain waktu.',
          whyOthersWrong: {
            A: 'SALAH: Jebakan harfiah kata "weather".',
            B: 'SALAH: Jebakan harfiah kata "rain".',
            C: 'BENAR: Arti idiomatis yang sesungguhnya.',
            D: 'SALAH: Dia tidak hadir pada acara.'
          },
          grammarRule: 'Idioms: "Under the weather" = Sick; "Take a rain check" = Postpone.',
          vocabulary: 'Reception = Acara ramah tamah; Rain check = Penundaan janji.'
        }
      },
      {
        id: 12,
        section: 'LISTENING',
        skill: 'Long Conversation (Part B: Academic Advising)',
        passageOrAudioScript: `(Narrator) : "Listen to a conversation between a student and his academic advisor."\n(Student) : "Professor, I'm considering dropping my advanced statistics class to focus more on my senior thesis."\n(Advisor) : "Before you submit the drop slip, remember that statistics is a prerequisite for your graduate school application in econometrics."\n(Narrator) : "Why does the advisor caution the student against dropping the class?"`,
        questionText: 'Why does the advisor caution the student against dropping the class?',
        options: [
          'The course is required for his prospective graduate studies.',
          'The drop deadline has already passed.',
          'The student has the highest grade in the class.',
          'The senior thesis does not require much time.'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Advisor mengingatkan bahwa mata kuliah statistika lanjutan adalah mata kuliah prasyarat (prerequisite) untuk pendaftaran pascasarjana bidang ekonometrika.',
          whyOthersWrong: {
            A: 'BENAR: Sesuai penjelasan eksplisit penasihat akademik.',
            B: 'SALAH: Batas waktu drop belum lewat.',
            C: 'SALAH: Tidak disebutkan nilai mahasiswa.',
            D: 'SALAH: Bukan alasan yang diberikan dosen.'
          },
          grammarRule: 'Listening Part B: Catat hubungan sebab-akibat pada percakapan akademik.',
          vocabulary: 'Prerequisite = Mata kuliah prasyarat; Senior thesis = Skripsi tugas akhir.'
        }
      },
      {
        id: 13,
        section: 'LISTENING',
        skill: 'Long Conversation (Part B: Lab Work)',
        passageOrAudioScript: `(Narrator) : "Listen to two students discussing a chemistry lab project."\n(Man) : "Did you finish titrating all five acidic solutions?"\n(Woman) : "I completed four, but the pH sensor malfunctioned on the final sample."\n(Narrator) : "What problem did the woman encounter in the laboratory?"`,
        questionText: 'What problem did the woman encounter in the laboratory?',
        options: [
          'She ran out of acidic test solutions.',
          'The pH testing equipment stopped functioning properly.',
          'She forgot the laboratory safety procedure.',
          'She broke a glass beaker during the experiment.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Wanita tersebut menyatakan "the pH sensor malfunctioned on the final sample", yang berarti sensor pH mengalami kerusakan alat teknis.',
          whyOthersWrong: {
            A: 'SALAH: Larutan tidak habis.',
            B: 'BENAR: Parafrase tepat dari "sensor malfunctioned".',
            C: 'SALAH: Tidak ada pelanggaran prosedur.',
            D: 'SALAH: Tidak ada gelas pecah.'
          },
          grammarRule: 'Listening Part B: Deteksi kendala teknis dalam tugas lab.',
          vocabulary: 'Malfunctioned = Mengalami malafungsi/rusak; Titrating = Melakukan titrasi kimia.'
        }
      },
      {
        id: 14,
        section: 'LISTENING',
        skill: 'Academic Talk (Part C: Astronomy & Solar Wind)',
        passageOrAudioScript: `(Narrator) : "Listen to an astronomy professor lecture on the Aurora Borealis."\n(Professor) : "The Northern Lights occur when charged solar particles collide with atmospheric gases like oxygen and nitrogen in the Earth's upper thermosphere. Oxygen atoms emit green and red light, whereas nitrogen produces vibrant violet and blue glows."\n(Narrator) : "What gas in Earth's atmosphere is responsible for the red and green hues in auroras?"`,
        questionText: 'What atmospheric gas produces the green and red colors of the Aurora Borealis?',
        options: [
          'Oxygen',
          'Nitrogen',
          'Hydrogen',
          'Carbon dioxide'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Dosen menyatakan secara eksplisit: "Oxygen atoms emit green and red light".',
          whyOthersWrong: {
            A: 'BENAR: Oksigen menghasilkan pancaran cahaya hijau dan merah.',
            B: 'SALAH: Nitrogen menghasilkan warna violet dan biru.',
            C: 'SALAH: Hidrogen tidak disebutkan dalam konteks warna ini.',
            D: 'SALAH: Karbon dioksida tidak memancarkan warna aurora.'
          },
          grammarRule: 'Listening Part C: Catat asosiasi spesifik elemen ilmiah (Oksigen -> Hijau & Merah).',
          vocabulary: 'Aurora Borealis = Cahaya kutub utara; Collide = Bertumbukan; Emit = Memancarkan.'
        }
      },
      {
        id: 15,
        section: 'LISTENING',
        skill: 'Academic Talk (Part C: History of Printing)',
        passageOrAudioScript: `(Narrator) : "Listen to a history professor discuss the impact of the printing press."\n(Professor) : "Johannes Gutenberg\'s innovation in mid-fifteenth-century Germany was not merely the press itself, but the creation of durable, movable metal type. This drastically reduced the cost of reproducing books, sparking the rapid dissemination of scientific knowledge across Renaissance Europe."\n(Narrator) : "What was Gutenberg's crucial innovation according to the professor?"`,
        questionText: 'According to the professor, what was Gutenberg\'s primary breakthrough?',
        options: [
          'Inventing cheaper paper made from wood pulp',
          'Developing durable movable metal type',
          'Writing the first European encyclopedia',
          'Translating classical Greek manuscripts'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Dosen menegaskan bahwa terobosan utama Gutenberg adalah "the creation of durable, movable metal type" (huruf cetak logam yang dapat dipindah-pindah dan tahan lama).',
          whyOthersWrong: {
            A: 'SALAH: Kertas bubur kayu bukan inovasi utama yang disorot.',
            B: 'BENAR: Inovasi logam cetak bergerak (movable metal type).',
            C: 'SALAH: Gutenberg bukan penulis ensiklopedia.',
            D: 'SALAH: Tidak disebutkan penerjemahan naskah Yunani.'
          },
          grammarRule: 'Listening Part C: Kenali fokus tesis sejarawan tentang penemuan penting.',
          vocabulary: 'Movable metal type = Huruf cetak logam bergerak; Dissemination = Penyebarluasan informasi.'
        }
      }
    ];

    const SEED_READING_SET_15 = [
      {
        id: 1,
        section: 'READING',
        skill: 'Main Idea / Primary Topic',
        passageOrAudioScript: `Bioluminescence, the emission of light by living organisms, is a widespread phenomenon found across diverse marine ecosystems, from surface waters to the deep abyssal plains. While most commonly associated with jellyfish and deep-sea anglerfish, bioluminescent capabilities have evolved independently in over forty distinct evolutionary lineages. Organisms utilize this biological glow for essential survival mechanisms, including hunting prey, deterring predators with startling flashes, and communicating with potential mates in the pitch-black ocean depths. The chemical reaction responsible involves a light-emitting molecule called luciferin and an enzyme catalyst known as luciferase.`,
        questionText: 'What is the primary topic of the passage?',
        options: [
          'The chemical structure of luciferin and luciferase enzymes.',
          'The evolutionary lineages and hunting patterns of deep-sea anglerfish.',
          'The occurrence, functions, and mechanisms of bioluminescence in marine life.',
          'The danger of oceanic predators in the deep abyssal plains.'
        ],
        correctAnswer: 'C',
        explanation: {
          whyCorrect: 'Teks membahas secara menyeluruh tentang apa itu bioluminescence, di mana terjadinya, fungsi bertahan hidupnya, dan reaksi kimianya.',
          whyOthersWrong: {
            A: 'SALAH: Terlalu sempit (hanya disebutkan pada kalimat terakhir).',
            B: 'SALAH: Anglerfish hanya merupakan salah satu contoh.',
            C: 'BENAR: Merangkum seluruh gagasan utama teks secara komprehensif.',
            D: 'SALAH: Bukan fokus utama bacaan.'
          },
          grammarRule: 'Reading Main Idea: Pilih jawaban yang merangkum keseluruhan isi paragraf (tidak terlalu sempit/terlalu luas).',
          vocabulary: 'Bioluminescence = Pancaran cahaya hayati; Lineages = Garis keturunan evolusi.'
        }
      },
      {
        id: 2,
        section: 'READING',
        skill: 'Vocabulary in Context',
        passageOrAudioScript: `(Refers to the passage on Bioluminescence)\n"Organisms utilize this biological glow for essential survival mechanisms, including hunting prey, deterring predators with startling flashes..."`,
        questionText: 'In the passage, the word "deterring" is closest in meaning to which of the following?',
        options: [
          'Discouraging',
          'Attracting',
          'Consuming',
          'Observing'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kata "deterring" berarti mencegah atau menakuti pemangsa agar tidak menyerang (discouraging / repelling).',
          whyOthersWrong: {
            A: 'BENAR: "Discouraging" memiliki sinonim makna yang tepat dengan "deterring".',
            B: 'SALAH: "Attracting" berarti menarik/memikat (lawan kata).',
            C: 'SALAH: "Consuming" berarti memakan/mengonsumsi.',
            D: 'SALAH: "Observing" berarti mengamati.'
          },
          grammarRule: 'Vocabulary in Context: Analisis konteks kalimat "deterring predators with startling flashes".',
          vocabulary: 'Deter = Mencegah / menghalau; Startling = Mengejutkan.'
        }
      },
      {
        id: 3,
        section: 'READING',
        skill: 'Factual Detail',
        passageOrAudioScript: `(Refers to the passage on Bioluminescence)`,
        questionText: 'According to the passage, which of the following is an enzyme that catalyzes the light-producing reaction?',
        options: [
          'Luciferin',
          'Luciferase',
          'Abyssalin',
          'Chlorophyll'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Berdasarkan teks kalimat terakhir: "an enzyme catalyst known as luciferase". Luciferin adalah molekul penghasil cahaya, sedangkan Luciferase adalah enzim katalisnya.',
          whyOthersWrong: {
            A: 'SALAH: Luciferin adalah molekul substratnya, bukan enzimnya.',
            B: 'BENAR: Sesuai data eksplisit pada kalimat terakhir teks.',
            C: 'SALAH: Istilah karangan.',
            D: 'SALAH: Klorofil tidak disebutkan dalam teks.'
          },
          grammarRule: 'Factual Detail: Temukan kata kunci "enzyme catalyst" pada teks untuk jawaban presisi.',
          vocabulary: 'Enzyme catalyst = Katalis enzim.'
        }
      },
      {
        id: 4,
        section: 'READING',
        skill: 'Negative Factual Question (EXCEPT)',
        passageOrAudioScript: `(Refers to the passage on Bioluminescence)`,
        questionText: 'The author mentions all of the following as functions of bioluminescence EXCEPT:',
        options: [
          'Attracting prey for nourishment',
          'Repelling potential predators',
          'Signaling to prospective mates',
          'Regulating internal body temperature'
        ],
        correctAnswer: 'D',
        explanation: {
          whyCorrect: 'Teks menyebutkan 3 fungsi: hunting prey, deterring predators, dan communicating with mates. Mengatur suhu tubuh (regulating internal temperature) TIDAK PERNAH disebutkan.',
          whyOthersWrong: {
            A: 'DISEBUTKAN: "hunting prey".',
            B: 'DISEBUTKAN: "deterring predators".',
            C: 'DISEBUTKAN: "communicating with potential mates".',
            D: 'TIDAK DISEBUTKAN (BENAR untuk pertanyaan EXCEPT): Tidak ada fungsi termoregulasi.'
          },
          grammarRule: 'Negative Factual Question: Verifikasi satu per satu opsi pada teks untuk menemukan opsi yang tidak tercantum.',
          vocabulary: 'Prospective mates = Calon pasangan kawin; Nourishment = Nutrisi makanan.'
        }
      },
      {
        id: 5,
        section: 'READING',
        skill: 'Inference',
        passageOrAudioScript: `(Refers to the passage on Bioluminescence)`,
        questionText: 'It can be inferred from the passage that bioluminescence in marine life:',
        options: [
          'Originated from a single common ancestor species.',
          'Is entirely useless in surface waters with ample sunlight.',
          'Developed multiple times throughout evolutionary history.',
          'Is harmful to the organisms that produce it.'
        ],
        correctAnswer: 'C',
        explanation: {
          whyCorrect: 'Teks menyatakan: "bioluminescent capabilities have evolved independently in over forty distinct evolutionary lineages". Ini membuktikan bahwa kemampuan ini berkembang berkali-kali secara terpisah (developed multiple times).',
          whyOthersWrong: {
            A: 'SALAH: Bertentangan dengan fakta "forty distinct evolutionary lineages".',
            B: 'SALAH: Teks menyatakan ditemukan "from surface waters to deep abyssal plains".',
            C: 'BENAR: Inferensi logis dari evolusi independen di 40 garis keturunan berbeda.',
            D: 'SALAH: Teks menegaskan bahwa ini adalah mekanisme penting untuk bertahan hidup.'
          },
          grammarRule: 'Inference Question: Tarik kesimpulan logis berdasarkan fakta tekstual yang disajikan.',
          vocabulary: 'Inferred = Disimpulkan; Distinct = Berbeda / terpisah.'
        }
      },
      {
        id: 6,
        section: 'READING',
        skill: 'Main Idea / Passage Summary',
        passageOrAudioScript: `The ancient Maya civilization of Mesoamerica thrived in a karst landscape characterized by porous limestone bedrock that quickly absorbed rainfall, leaving virtually no permanent rivers or lakes in the northern Yucatan peninsula. To sustain massive urban centers like Tikal and Calakmul during prolonged annual dry seasons, Maya engineers constructed sophisticated hydraulic systems. They carved massive plaster-lined cisterns known as "chultuns" directly into the bedrock to harvest rainwater runoff from paved plazas and temple pyramids. Furthermore, artificial reservoirs flanked by gravity-fed filtration sandbeds provided clean, drinkable water to tens of thousands of city dwellers year-round.`,
        questionText: 'Which of the following best expresses the main idea of the passage?',
        options: [
          'The Maya civilization collapsed primarily due to irreversible groundwater contamination.',
          'Maya engineers developed advanced water collection and storage systems to overcome environmental water scarcity.',
          'Chultuns were religious shrines constructed beneath Maya temple pyramids.',
          'The northern Yucatan peninsula possessed abundant permanent rivers and lakes.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Teks berfokus pada bagaimana para insinyur Maya menciptakan sistem hidrolik dan penampungan air buatan (chultuns & reservoirs) untuk mengatasi kelangkaan air di bentang alam karst.',
          whyOthersWrong: {
            A: 'SALAH: Kontaminasi air tanah bukan bahasan teks.',
            B: 'BENAR: Merangkum topik utama tentang sistem hidrolik bangsa Maya.',
            C: 'SALAH: Chultun adalah penampung air hujan, bukan tempat ibadah.',
            D: 'SALAH: Teks menegaskan wilayah tersebut hampir tidak memiliki danau atau sungai permanen.'
          },
          grammarRule: 'Main Idea: Identifikasi masalah lingkungan (karst/tanpa sungai) dan solusi teknisnya (chultun/reservoirs).',
          vocabulary: 'Hydraulic systems = Sistem hidrolik air; Cisterns = Tangki/waduk penampung air.'
        }
      },
      {
        id: 7,
        section: 'READING',
        skill: 'Factual Detail',
        passageOrAudioScript: `(Refers to the passage on Maya Water Engineering)`,
        questionText: 'According to the passage, what natural feature made water conservation difficult in the northern Yucatan?',
        options: [
          'Thick volcanic ash that blocked irrigation canals',
          'Porous limestone bedrock that rapidly absorbed rainwater',
          'Freezing mountain temperatures that froze natural springs',
          'Excessive flooding from perennial rivers'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Teks menyatakan: "characterized by porous limestone bedrock that quickly absorbed rainfall". Batuan kapur berpori menyerap air hujan dengan cepat.',
          whyOthersWrong: {
            A: 'SALAH: Abu vulkanik tidak disebutkan.',
            B: 'BENAR: Sesuai data eksplisit batuan kapur berpori (porous limestone).',
            C: 'SALAH: Tidak ada suhu beku di Mesoamerika.',
            D: 'SALAH: Tidak ada sungai tahunan di kawasan tersebut.'
          },
          grammarRule: 'Factual Detail: Cocokkan kata kunci "limestone bedrock" pada teks.',
          vocabulary: 'Porous = Berpori / menyerap air; Bedrock = Lapisan batuan dasar.'
        }
      },
      {
        id: 8,
        section: 'READING',
        skill: 'Pronoun Referent',
        passageOrAudioScript: `(Refers to the passage on Maya Water Engineering)\n"They carved massive plaster-lined cisterns known as 'chultuns' directly into the bedrock to harvest rainwater runoff from paved plazas..."`,
        questionText: 'In the passage, the word "They" refers to:',
        options: [
          'Maya engineers',
          'Urban centers',
          'Limestone bedrocks',
          'Temple pyramids'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kata ganti "They" pada kalimat ketiga merujuk ke subjek pada kalimat sebelumnya, yaitu "Maya engineers".',
          whyOthersWrong: {
            A: 'BENAR: "Maya engineers" adalah subjek pelaku yang memahat chultun.',
            B: 'SALAH: Pusat kota bukan pelaku pembuat waduk.',
            C: 'SALAH: Batuan dasar adalah objek tempat dipahatnya waduk.',
            D: 'SALAH: Piramida kuil adalah sumber aliran air.'
          },
          grammarRule: 'Pronoun Referent: Cari subjek plural manusia pada klausa sebelumnya.',
          vocabulary: 'Harvest = Memanen/menampung; Runoff = Limpasan air hujan.'
        }
      },
      {
        id: 9,
        section: 'READING',
        skill: 'Vocabulary in Context',
        passageOrAudioScript: `(Refers to the passage on Maya Water Engineering)\n"To sustain massive urban centers like Tikal and Calakmul during prolonged annual dry seasons..."`,
        questionText: 'The word "prolonged" in the passage is closest in meaning to:',
        options: [
          'Extended',
          'Unpredictable',
          'Mild',
          'Beneficial'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: '"Prolonged" berarti berkepanjangan / berlangsung lama (extended / lengthened).',
          whyOthersWrong: {
            A: 'BENAR: "Extended" adalah sinonim langsung dari "prolonged".',
            B: 'SALAH: "Unpredictable" berarti tidak terduga.',
            C: 'SALAH: "Mild" berarti ringan/sejuk.',
            D: 'SALAH: "Beneficial" berarti bermanfaat.'
          },
          grammarRule: 'Vocabulary in Context: "Prolonged dry seasons" = Musim kemarau berkepanjangan.',
          vocabulary: 'Prolonged = Berkepanjangan; Sustain = Menopang / mempertahankan hidup.'
        }
      },
      {
        id: 10,
        section: 'READING',
        skill: 'Inference',
        passageOrAudioScript: `(Refers to the passage on Maya Water Engineering)`,
        questionText: 'It can be inferred from the passage that without hydraulic engineering, large Maya cities in northern Yucatan:',
        options: [
          'Would have relied exclusively on trade with South America for water.',
          'Could not have supported dense populations during the dry season.',
          'Would have relocated to coastal mangrove swamps.',
          'Would have flourished even faster without the labor burden.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Karena bentang alam tidak memiliki danau/sungai dan air hujan terserap batuan kapur, kota-kota besar tersebut tidak akan mampu menopang puluhan ribu penduduk selama musim kemarau tanpa sistem penampungan air buatan.',
          whyOthersWrong: {
            A: 'SALAH: Perdagangan air antar benua tidak masuk akal.',
            B: 'BENAR: Inferensi logis dari kebutuhan menopang populasi di musim kering.',
            C: 'SALAH: Tidak ada fakta perpindahan ke rawa bakau.',
            D: 'SALAH: Bertentangan dengan hukum kelangsungan hidup.'
          },
          grammarRule: 'Inference: Hubungkan ketiadaan air alami dengan fungsi vital rekayasa hidrolik.',
          vocabulary: 'Dense populations = Kepadatan penduduk tinggi; Hydraulic engineering = Rekayasa tata air.'
        }
      },
      {
        id: 11,
        section: 'READING',
        skill: 'Main Idea / Thesis Identification',
        passageOrAudioScript: `In 1912, German meteorologist Alfred Wegener proposed the groundbreaking theory of continental drift, hypothesizing that all contemporary continents were once joined together in a single supercontinent he named Pangaea. Wegener supported his audacious claim with diverse lines of empirical evidence, noting the remarkable jigsaw-puzzle fit of the Atlantic coastlines of South America and Africa. Furthermore, he documented identical fossil remains of the freshwater reptile Mesosaurus in both Brazil and southern Africa, creatures incapable of swimming across thousands of miles of saline ocean. Despite accumulating substantial paleoclimatic evidence, Wegener's hypothesis was initially rejected by the scientific establishment because he could not provide a plausible physical mechanism to explain how solid continents could plow through dense oceanic crust.`,
        questionText: 'What is the author\'s main purpose in this passage?',
        options: [
          'To disprove Alfred Wegener\'s hypothesis regarding Pangaea',
          'To introduce Wegener\'s continental drift theory, his evidence, and its initial reception',
          'To describe the anatomy and migratory habits of Mesosaurus reptiles',
          'To argue that the Atlantic coastline has remained unchanged for millions of years'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Penulis memperkenalkan teori pergeseran benua Wegener, memaparkan bukti-bukti fosil dan kecocokan garis pantainya, serta menjelaskan mengapa teori tersebut sempat ditolak di awal karena ketiadaan mekanisme penggerak.',
          whyOthersWrong: {
            A: 'SALAH: Penulis tidak membantah teori Wegener.',
            B: 'BENAR: Merangkum tujuan penulisan secara komprehensif.',
            C: 'SALAH: Mesosaurus hanya satu contoh bukti fosil.',
            D: 'SALAH: Garis pantai justru berubah karena pergeseran benua.'
          },
          grammarRule: 'Author Purpose: Identifikasi pengenalan teori, bukti pendukung, dan tanggapan komunitas ilmiah.',
          vocabulary: 'Continental drift = Pergeseran benua; Audacious = Berani / luar biasa.'
        }
      },
      {
        id: 12,
        section: 'READING',
        skill: 'Factual Detail',
        passageOrAudioScript: `(Refers to the passage on Continental Drift)`,
        questionText: 'According to the passage, why was the fossil of Mesosaurus significant evidence for continental drift?',
        options: [
          'Mesosaurus could fly across the Atlantic Ocean.',
          'As a freshwater reptile, it could not have traversed a vast saltwater ocean.',
          'It proved that dinosaurs survived the Ice Age in Pangaea.',
          'Its fossils were discovered in every modern continent.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Teks menyatakan bahwa Mesosaurus adalah reptil air tawar ("freshwater reptile") yang mustahil berenang menyeberangi ribuan mil lautan air asin ("incapable of swimming across thousands of miles of saline ocean"), membuktikan daratan Afrika dan Amerika Selatan dulunya menyatu.',
          whyOthersWrong: {
            A: 'SALAH: Mesosaurus adalah reptil air tawar, bukan hewan terbang.',
            B: 'BENAR: Tidak mampu menyeberangi lautan asin sehingga membuktikan kedua benua pernah bersatu.',
            C: 'SALAH: Bukan bukti bertahan hidupnya dinosaurus.',
            D: 'SALAH: Fosil hanya ditemukan di Brasil dan Afrika bagian selatan.'
          },
          grammarRule: 'Factual Detail: Perhatikan penjelasan mengapa fosil air tawar menjadi bukti kuat.',
          vocabulary: 'Freshwater = Air tawar; Saline = Mengandung garam / asin; Traversed = Menyeberangi.'
        }
      },
      {
        id: 13,
        section: 'READING',
        skill: 'Vocabulary in Context',
        passageOrAudioScript: `(Refers to the passage on Continental Drift)\n"Despite accumulating substantial paleoclimatic evidence, Wegener's hypothesis was initially rejected by the scientific establishment because he could not provide a plausible physical mechanism..."`,
        questionText: 'In the passage, the word "plausible" is closest in meaning to:',
        options: [
          'Believable',
          'Permanent',
          'Complicated',
          'Destructive'
        ],
        correctAnswer: 'A',
        explanation: {
          whyCorrect: 'Kata "plausible" berarti masuk akal / dapat dipercaya (believable / credible / reasonable).',
          whyOthersWrong: {
            A: 'BENAR: "Believable" adalah padanan makna tepat untuk "plausible".',
            B: 'SALAH: "Permanent" berarti permanen.',
            C: 'SALAH: "Complicated" berarti rumit.',
            D: 'SALAH: "Destructive" berarti merusak.'
          },
          grammarRule: 'Vocabulary in Context: "A plausible mechanism" = Mekanisme yang masuk akal.',
          vocabulary: 'Plausible = Masuk akal / beralasan; Establishment = Komunitas mapan.'
        }
      },
      {
        id: 14,
        section: 'READING',
        skill: 'Negative Factual Detail (EXCEPT)',
        passageOrAudioScript: `(Refers to the passage on Continental Drift)`,
        questionText: 'All of the following were cited by Wegener as evidence supporting continental drift EXCEPT:',
        options: [
          'The complementary jigsaw fit of South American and African coastlines',
          'Matching fossil remains of Mesosaurus in Brazil and southern Africa',
          'Direct GPS satellite measurements showing tectonic plate movements',
          'Substantial paleoclimatic observations'
        ],
        correctAnswer: 'C',
        explanation: {
          whyCorrect: 'Wegener mengajukan teorinya pada tahun 1912. Satelit GPS belum ditemukan pada saat itu. Bukti Wegener hanya berupa garis pantai, fosil Mesosaurus, dan paleoklimatologi.',
          whyOthersWrong: {
            A: 'DISEBUTKAN: "jigsaw-puzzle fit of the Atlantic coastlines".',
            B: 'DISEBUTKAN: "identical fossil remains of Mesosaurus".',
            C: 'TIDAK DISEBUTKAN (BENAR untuk pertanyaan EXCEPT): Pengukuran GPS satelit baru ada di era modern.',
            D: 'DISEBUTKAN: "substantial paleoclimatic evidence".'
          },
          grammarRule: 'Negative Question: Eliminasi opsi yang secara kronologis dan tekstual tidak ada dalam bacaan.',
          vocabulary: 'Complementary = Saling melengkapi; Substantial = Kuat/banyak.'
        }
      },
      {
        id: 15,
        section: 'READING',
        skill: 'Inference',
        passageOrAudioScript: `(Refers to the passage on Continental Drift)`,
        questionText: 'It can be inferred from the passage that the scientific community initially rejected continental drift because:',
        options: [
          'They doubted that South America and Africa were ever inhabited by reptiles.',
          'Wegener lacked a credible geological explanation for how tectonic landmasses moved.',
          'Wegener refused to publish his research findings in academic journals.',
          'The fossil discoveries in Brazil turned out to be forged.'
        ],
        correctAnswer: 'B',
        explanation: {
          whyCorrect: 'Teks menyatakan komunitas ilmiah menolak karena Wegener "could not provide a plausible physical mechanism to explain how solid continents could plow through dense oceanic crust" (kurang penjelasan geologis kredibel tentang mekanisme daya dorong pergerakan benua).',
          whyOthersWrong: {
            A: 'SALAH: Bukan karena meragukan keberadaan reptil.',
            B: 'BENAR: Ketiadaan mekanisme fisik pergerakan lempeng menjadi alasan penolakan awal.',
            C: 'SALAH: Wegener mempublikasikan teorinya secara luas pada tahun 1912.',
            D: 'SALAH: Fosil tidak dipalsukan.'
          },
          grammarRule: 'Inference: Simpulkan alasan penolakan berdasarkan kelemahan penjelasan mekanisme lempeng.',
          vocabulary: 'Physical mechanism = Mekanisme fisik; Landmasses = Daratan benua.'
        }
      }
    ];

    // Paket Standar Mix 15 Soal (5 Listening, 5 Structure, 5 Reading)
    const SEED_TEST_SET_15 = [
      // 5 Listening
      { ...SEED_LISTENING_SET_15[0], id: 1 },
      { ...SEED_LISTENING_SET_15[1], id: 2 },
      { ...SEED_LISTENING_SET_15[2], id: 3 },
      { ...SEED_LISTENING_SET_15[3], id: 4 },
      { ...SEED_LISTENING_SET_15[4], id: 5 },
      // 5 Structure
      { ...SEED_STRUCTURE_SET_15[0], id: 6 },
      { ...SEED_STRUCTURE_SET_15[1], id: 7 },
      { ...SEED_STRUCTURE_SET_15[2], id: 8 },
      { ...SEED_STRUCTURE_SET_15[3], id: 9 },
      { ...SEED_STRUCTURE_SET_15[4], id: 10 },
      // 5 Reading
      { ...SEED_READING_SET_15[0], id: 11 },
      { ...SEED_READING_SET_15[1], id: 12 },
      { ...SEED_READING_SET_15[2], id: 13 },
      { ...SEED_READING_SET_15[3], id: 14 },
      { ...SEED_READING_SET_15[4], id: 15 }
    ];

    function getOfflineQuestionsForSkill(skillName = '', section = 'STRUCTURE') {
      const norm = (skillName || '').toLowerCase();

      if (norm.includes('inversion')) {
        return SEED_INVERSION_SET_15;
      }
      if (norm.includes('appositive')) {
        return SEED_APPOSITIVE_SET_15;
      }
      if (norm.includes('subject') || norm.includes('verb') || norm.includes('completeness')) {
        return SEED_SUBJECT_VERB_SET_15;
      }
      if (norm.includes('dialogue') || norm.includes('restatement') || norm.includes('listening')) {
        return SEED_LISTENING_SET_15;
      }
      if (norm.includes('main idea') || norm.includes('reading') || norm.includes('paragraph')) {
        return SEED_READING_SET_15;
      }

      if (section === 'STRUCTURE') return SEED_STRUCTURE_SET_15;
      if (section === 'LISTENING') return SEED_LISTENING_SET_15;
      if (section === 'READING') return SEED_READING_SET_15;
      return SEED_TEST_SET_15;
    }

    function getOfflineQuestionsForSection(section) {
      if (section === 'STRUCTURE') return SEED_STRUCTURE_SET_15;
      if (section === 'LISTENING') return SEED_LISTENING_SET_15;
      if (section === 'READING') return SEED_READING_SET_15;
      return SEED_TEST_SET_15;
    }

    const SEED_KANBAN = [
      { id: 'kb-1', title: 'Subject-Verb Agreement & Double Subjects', section: 'STRUCTURE', priority: 'Urgent', targetDate: '2026-08-20', status: 'done' },
      { id: 'kb-2', title: 'Inversion after Negative Expressions', section: 'STRUCTURE', priority: 'High', targetDate: '2026-08-22', status: 'in_progress' },
      { id: 'kb-3', title: 'Listening Part A: Restatement & Sound-Alike traps', section: 'LISTENING', priority: 'High', targetDate: '2026-08-23', status: 'testing' },
      { id: 'kb-4', title: 'Reading: Vocabulary in Context & Inference', section: 'READING', priority: 'Medium', targetDate: '2026-08-25', status: 'backlog' },
      { id: 'kb-5', title: 'Reduced Relative Clauses & Parallelism', section: 'STRUCTURE', priority: 'Urgent', targetDate: '2026-08-26', status: 'backlog' }
    ];

    const SEED_HISTORY = [
      {
        id: 'hist-1',
        title: 'Simulasi TOEFL ITP Mix 15 Soal #01',
        date: '2026-08-16 14:30',
        section: 'MIX',
        totalQuestions: 15,
        correctCount: 13,
        scaledScore: 570,
        percentage: 86.7,
        timeSpent: '18:45',
        status: 'EXCELLENT',
        questions: SEED_TEST_SET_15,
        userAnswers: { 1:'A', 2:'B', 3:'B', 4:'B', 5:'B', 6:'B', 7:'B', 8:'C', 9:'A', 10:'B', 11:'C', 12:'A', 13:'B', 14:'D', 15:'A' }
      },
      {
        id: 'hist-2',
        title: 'Structure Intensive 15 Soal #02',
        date: '2026-08-15 10:15',
        section: 'STRUCTURE',
        totalQuestions: 15,
        correctCount: 11,
        scaledScore: 520,
        percentage: 73.3,
        timeSpent: '15:20',
        status: 'GOOD',
        questions: SEED_TEST_SET_15,
        userAnswers: { 1:'A', 2:'B', 3:'A', 4:'B', 5:'B', 6:'A', 7:'B', 8:'C', 9:'A', 10:'B', 11:'A', 12:'A', 13:'B', 14:'D', 15:'C' }
      }
    ];

    function initStorage() {
      const savedUser = localStorage.getItem('toefl_user_profile');
      if (savedUser) {
        try { appState.user = JSON.parse(savedUser); } catch(e){}
      }
      const savedApi = localStorage.getItem('toefl_api_config');
      if (savedApi) {
        try { appState.apiConfig = JSON.parse(savedApi); } catch(e){}
      }
      const savedMat = localStorage.getItem('toefl_materials');
      if (savedMat) {
        try { 
          appState.materials = JSON.parse(savedMat); 
          appState.materials.forEach(m => {
            if (m.id === 'mat-1') {
              m.savedQuestions = SEED_SUBJECT_VERB_SET_15;
            } else if (m.id === 'mat-2') {
              m.savedQuestions = SEED_INVERSION_SET_15;
            } else if (m.id === 'mat-3') {
              m.savedQuestions = SEED_APPOSITIVE_SET_15;
            } else if (m.id === 'mat-4') {
              m.savedQuestions = SEED_LISTENING_SET_15;
            } else if (m.id === 'mat-5') {
              m.savedQuestions = SEED_READING_SET_15;
            } else if (!m.savedQuestions || !Array.isArray(m.savedQuestions) || m.savedQuestions.length === 0) {
              m.savedQuestions = getOfflineQuestionsForSkill(m.title, m.section);
            }
          });
          localStorage.setItem('toefl_materials', JSON.stringify(appState.materials));
        } catch(e){ 
          appState.materials = SEED_MATERIALS; 
          localStorage.setItem('toefl_materials', JSON.stringify(SEED_MATERIALS));
        }
      } else {
        appState.materials = SEED_MATERIALS;
        appState.materials.forEach(m => {
          if (m.id === 'mat-1') m.savedQuestions = SEED_SUBJECT_VERB_SET_15;
          else if (m.id === 'mat-2') m.savedQuestions = SEED_INVERSION_SET_15;
          else if (m.id === 'mat-3') m.savedQuestions = SEED_APPOSITIVE_SET_15;
          else if (m.id === 'mat-4') m.savedQuestions = SEED_LISTENING_SET_15;
          else if (m.id === 'mat-5') m.savedQuestions = SEED_READING_SET_15;
          else m.savedQuestions = getOfflineQuestionsForSkill(m.title, m.section);
        });
        localStorage.setItem('toefl_materials', JSON.stringify(SEED_MATERIALS));
      }
      const savedKb = localStorage.getItem('toefl_kanban');
      if (savedKb) {
        try { appState.kanbanCards = JSON.parse(savedKb); } catch(e){ appState.kanbanCards = SEED_KANBAN; }
      } else {
        appState.kanbanCards = SEED_KANBAN;
        localStorage.setItem('toefl_kanban', JSON.stringify(SEED_KANBAN));
      }
      const savedHist = localStorage.getItem('toefl_history');
      if (savedHist) {
        try { appState.testHistory = JSON.parse(savedHist); } catch(e){ appState.testHistory = SEED_HISTORY; }
      } else {
        appState.testHistory = SEED_HISTORY;
        localStorage.setItem('toefl_history', JSON.stringify(SEED_HISTORY));
      }

      syncUserProfileUI();
      syncApiConfigUI();
      populateTopicDropdown('STRUCTURE');
    }

    function syncUserProfileUI() {
      document.getElementById('dashUserName').innerText = appState.user.name.split(' ')[0] || 'Siswa';
      document.getElementById('headerUserName').innerText = appState.user.name.split(' ')[0] || 'Siswa';
      document.getElementById('headerTargetScore').innerText = appState.user.targetScore || '550+';
      document.getElementById('headerAvatarContainer').innerText = appState.user.initial || 'DP';
      
      document.getElementById('settingUserName').value = appState.user.name;
      document.getElementById('settingUserInitial').value = appState.user.initial;
      document.getElementById('settingUserEmail').value = appState.user.email;
      document.getElementById('settingTargetScore').value = appState.user.targetScore;

      if (appState.user.logoBase64) {
        document.getElementById('headerLogoContainer').innerHTML = `<img src="${appState.user.logoBase64}" class="w-full h-full object-cover rounded-lg" alt="Logo" />`;
      }
    }

    function syncApiConfigUI() {
      document.getElementById('settingApiBaseUrl').value = appState.apiConfig.baseUrl;
      document.getElementById('settingApiKey').value = appState.apiConfig.apiKey;
      document.getElementById('settingApiModel').value = appState.apiConfig.model;
    }

    function navigateTo(viewName) {
      appState.currentView = viewName;
      document.querySelectorAll('.app-view').forEach(el => el.classList.add('hidden'));
      const targetView = document.getElementById(`view-${viewName}`);
      if (targetView) {
        targetView.classList.remove('hidden');
      }

      document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('bg-amber-200', 'border-stone-800', 'shadow-sketch-sm');
      });
      const activeBtn = document.getElementById(`nav-${viewName}`);
      if (activeBtn) {
        activeBtn.classList.add('bg-amber-200', 'border-stone-800', 'shadow-sketch-sm');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (viewName === 'dashboard') {
        updateDashboardKPIs();
        renderDashboardCharts();
      } else if (viewName === 'materi') {
        renderMateriCards();
      } else if (viewName === 'master-data') {
        renderMasterDataTable();
      } else if (viewName === 'kanban') {
        renderKanbanBoard();
      } else if (viewName === 'analytics') {
        renderAnalyticsCharts();
      }
    }

    function toggleMobileSidebar() {
      const overlay = document.getElementById('mobileSidebarOverlay');
      overlay.classList.toggle('hidden');
    }

    function toggleNotificationPopover() {
      const popover = document.getElementById('notificationPopover');
      popover.classList.toggle('hidden');
    }

    let dashboardRadarChartInstance = null;

    function updateDashboardKPIs() {
      const history = appState.testHistory || [];
      const totalTests = history.length;
      document.getElementById('kpiTotalTests').innerText = totalTests;

      let totalScore = 0;
      let totalAnswered = 0;
      let totalCorrect = 0;

      history.forEach(h => {
        totalScore += (h.scaledScore || 310);
        totalAnswered += (h.totalQuestions || 15);
        totalCorrect += (h.correctCount || 0);
      });

      const avgScore = totalTests > 0 ? Math.round(totalScore / totalTests) : 0;
      const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

      document.getElementById('kpiAvgScore').innerText = avgScore > 0 ? avgScore : 'Belum Ada';
      document.getElementById('kpiAccuracy').innerText = accuracy + '%';
      document.getElementById('kpiTotalAnswered').innerText = totalAnswered;

      const statusBadge = document.getElementById('kpiScoreStatus');
      if (avgScore >= 550) {
        statusBadge.className = 'ink-stamp ink-stamp-pass text-[10px]';
        statusBadge.innerText = 'TARGET TERCAPAI 550+';
      } else if (avgScore >= 480) {
        statusBadge.className = 'ink-stamp ink-stamp-gold text-[10px]';
        statusBadge.innerText = 'PROGRES BAIK';
      } else {
        statusBadge.className = 'ink-stamp ink-stamp-fail text-[10px]';
        statusBadge.innerText = 'PERLU LATIHAN';
      }

      renderDashboardRecentHistory();
      renderDashboardTopicSuggestions();
    }

    function renderDashboardRecentHistory() {
      const tbody = document.getElementById('dashRecentHistoryTbody');
      const recents = [...appState.testHistory].slice(0, 5);

      if (recents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center font-handwrite text-stone-500 text-base">Belum ada riwayat tes. Klik "Mulai Tes 15 Soal" untuk memulai!</td></tr>`;
        return;
      }

      tbody.innerHTML = recents.map(item => `
        <tr class="hover:bg-amber-50/50 transition">
          <td class="p-2.5 font-typewriter text-xs text-stone-700">${item.date}</td>
          <td class="p-2.5 font-semibold text-stone-900">${item.title}</td>
          <td class="p-2.5 text-center font-typewriter font-bold">${item.correctCount} / ${item.totalQuestions}</td>
          <td class="p-2.5 text-center font-title font-bold text-base text-amber-800">${item.scaledScore}</td>
          <td class="p-2.5 text-center">
            <span class="ink-stamp ${item.scaledScore >= 550 ? 'ink-stamp-pass' : 'ink-stamp-gold'} text-[10px]">
              ${item.scaledScore >= 550 ? 'LULUS' : 'LATIHAN'}
            </span>
          </td>
          <td class="p-2.5 text-right">
            <button onclick="viewPastTestExplanation('${item.id}')" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-2.5 py-1">
              Lihat Pembahasan
            </button>
          </td>
        </tr>
      `).join('');
    }

    function renderDashboardTopicSuggestions() {
      const container = document.getElementById('dashboardTopicSuggestions');
      const urgentMaterials = appState.materials.filter(m => m.priority === 'Urgent' || m.priority === 'High').slice(0, 3);
      
      container.innerHTML = urgentMaterials.map(m => `
        <div class="p-2.5 bg-amber-50/80 rounded border border-stone-600 flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center space-x-1.5">
              <span class="text-[10px] font-typewriter font-bold bg-amber-200 px-1 rounded border border-stone-600">${m.skillCode}</span>
              <span class="font-title font-bold text-stone-900 text-sm">${m.title}</span>
            </div>
            <p class="text-xs text-stone-600 mt-0.5">${m.summary}</p>
          </div>
          <button onclick="openMaterialReader('${m.id}')" class="sketch-btn bg-white hover:bg-amber-100 text-xs px-2 py-1 text-stone-800 flex-shrink-0">
            Pelajari
          </button>
        </div>
      `).join('');
    }

    function renderDashboardCharts() {
      const ctx = document.getElementById('dashboardRadarChart');
      if (!ctx) return;

      if (dashboardRadarChartInstance) {
        dashboardRadarChartInstance.destroy();
      }

      dashboardRadarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Subject-Verb', 'Inversion', 'Listening Dialogs', 'Reading Main Idea', 'Vocabulary', 'Participles'],
          datasets: [{
            label: 'Penguasaan Saat Ini (%)',
            data: [85, 65, 78, 82, 75, 70],
            backgroundColor: 'rgba(254, 243, 199, 0.65)',
            borderColor: '#b45309',
            borderWidth: 2,
            pointBackgroundColor: '#57534e',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#57534e'
          }, {
            label: 'Target Skor 550+ (%)',
            data: [90, 85, 85, 90, 85, 85],
            borderColor: '#94a3b8',
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointRadius: 0,
            backgroundColor: 'transparent'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { family: "'Patrick Hand', cursive", size: 12 } }
            }
          },
          scales: {
            r: {
              suggestedMin: 30,
              suggestedMax: 100,
              ticks: { stepSize: 20, font: { size: 10 } },
              pointLabels: { font: { family: "'Patrick Hand', cursive", size: 11 } }
            }
          }
        }
      });
    }

    let currentMateriFilter = 'ALL';

    function filterMateriSection(section) {
      currentMateriFilter = section;
      document.querySelectorAll('.materi-tab-btn').forEach(btn => {
        btn.classList.remove('bg-stone-800', 'text-amber-200', 'active');
        btn.classList.add('bg-white', 'text-stone-800');
      });
      event.target.classList.add('bg-stone-800', 'text-amber-200', 'active');
      event.target.classList.remove('bg-white', 'text-stone-800');
      renderMateriCards();
    }

    function renderMateriCards() {
      const container = document.getElementById('materiGridContainer');
      const searchQuery = (document.getElementById('materiSearchInput')?.value || '').toLowerCase();
      
      const allCount = appState.materials.length;
      const structCount = appState.materials.filter(m => m.section === 'STRUCTURE').length;
      const listenCount = appState.materials.filter(m => m.section === 'LISTENING').length;
      const readCount = appState.materials.filter(m => m.section === 'READING').length;

      document.getElementById('countMateriAll').innerText = allCount;
      document.getElementById('countMateriStructure').innerText = structCount;
      document.getElementById('countMateriListening').innerText = listenCount;
      document.getElementById('countMateriReading').innerText = readCount;

      let filtered = appState.materials.filter(m => {
        const matchesSection = (currentMateriFilter === 'ALL' || m.section === currentMateriFilter);
        const matchesSearch = (m.title.toLowerCase().includes(searchQuery) || m.summary.toLowerCase().includes(searchQuery));
        return matchesSection && matchesSearch;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="col-span-full sketch-box p-8 bg-white text-center font-handwrite text-stone-600 text-lg">
            Tidak ada materi yang sesuai filter. Ingin buat materi baru? Klik tombol <b>"Generate Materi Baru (AI)"</b> di atas!
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(mat => {
        let badgeColor = 'bg-amber-100 text-stone-800 border-stone-600';
        if (mat.section === 'STRUCTURE') badgeColor = 'bg-amber-100 text-amber-900 border-amber-700';
        if (mat.section === 'LISTENING') badgeColor = 'bg-blue-100 text-blue-900 border-blue-700';
        if (mat.section === 'READING') badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-700';

        const qCount = (mat.savedQuestions && Array.isArray(mat.savedQuestions)) ? mat.savedQuestions.length : 0;

        return `
          <div class="sketch-box p-5 bg-white flex flex-col justify-between hover:shadow-sketch-lg transition relative">
            <div>
              <div class="flex items-center justify-between gap-2 border-b border-stone-200 pb-2 mb-2">
                <div class="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span class="text-[11px] font-typewriter font-bold px-2 py-0.5 rounded border ${badgeColor}">
                    ${mat.skillCode} • ${mat.section}
                  </span>
                  ${qCount > 0 ? `
                    <span class="text-[10px] font-typewriter font-bold bg-purple-100 text-purple-900 border border-purple-400 px-1.5 py-0.5 rounded cursor-pointer hover:bg-purple-200" onclick="openSavedQuestionBankModal('${mat.id}')" title="Buka ${qCount} Soal AI Tersimpan">
                      <i class="fa-solid fa-cube text-purple-700 mr-0.5"></i> ${qCount} Soal AI
                    </span>
                  ` : ''}
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="ink-stamp ${mat.priority === 'Urgent' ? 'ink-stamp-fail' : 'ink-stamp-gold'} text-[9px]">
                    ${mat.priority}
                  </span>
                  <button onclick="event.stopPropagation(); deleteMaterial('${mat.id}')" title="Hapus Materi" 
                          class="sketch-btn bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300 w-6 h-6 flex items-center justify-center p-0 text-[11px] rounded transition">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              <h3 class="font-title font-bold text-lg text-stone-900">${mat.title}</h3>
              <p class="text-xs font-handwrite text-stone-600 mt-2 text-base leading-snug">${mat.summary}</p>
            </div>

            <div class="flex items-center justify-between border-t border-stone-200 pt-3 mt-4 gap-1.5 flex-wrap">
              <button onclick="openMaterialReader('${mat.id}')" class="sketch-btn bg-amber-200 hover:bg-amber-300 text-stone-900 text-xs px-3 py-1.5 flex items-center space-x-1">
                <i class="fa-solid fa-book-open text-xs"></i>
                <span>Baca Materi</span>
              </button>
              <div class="flex items-center space-x-1.5">
                ${qCount > 0 ? `
                  <button onclick="openSavedQuestionBankModal('${mat.id}')" class="sketch-btn bg-purple-100 hover:bg-purple-200 text-purple-950 text-xs px-2.5 py-1.5 flex items-center space-x-1 border border-purple-400 font-bold" title="Lihat Bank Soal AI">
                    <i class="fa-solid fa-layer-group text-purple-700"></i>
                    <span>Bank Soal (${qCount})</span>
                  </button>
                ` : ''}
                <button onclick="launchQuickTestForSkill('${mat.id}')" class="sketch-btn bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-2.5 py-1.5 flex items-center space-x-1 font-semibold">
                  <i class="fa-solid fa-pen"></i>
                  <span>Latihan Soal</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    let activeReadingMaterial = null;

    function openMaterialReader(materialId) {
      const mat = appState.materials.find(m => m.id === materialId);
      if (!mat) return;

      activeReadingMaterial = mat;
      document.getElementById('readerSectionBadge').innerText = mat.section;
      document.getElementById('readerSkillCode').innerText = mat.skillCode;
      document.getElementById('readerTitle').innerText = mat.title;
      document.getElementById('readerContentBody').innerHTML = mat.content;

      const qBankBtn = document.getElementById('readerBankSoalBtn');
      const qBankText = document.getElementById('readerBankSoalBtnText');
      const qCount = (mat.savedQuestions && Array.isArray(mat.savedQuestions)) ? mat.savedQuestions.length : 0;
      if (qBankBtn) {
        if (qCount > 0) {
          qBankBtn.classList.remove('hidden');
          if (qBankText) qBankText.innerText = `Bank Soal AI (${qCount})`;
        } else {
          qBankBtn.classList.add('hidden');
        }
      }

      document.getElementById('materialReaderModal').classList.remove('hidden');
    }

    function closeMaterialReader() {
      document.getElementById('materialReaderModal').classList.add('hidden');
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }

    function deleteMaterial(materialId) {
      if (!materialId) return;
      const mat = appState.materials.find(m => m.id === materialId);
      if (!mat) return;

      const qCount = (mat.savedQuestions && Array.isArray(mat.savedQuestions)) ? mat.savedQuestions.length : 0;

      Swal.fire({
        title: 'Hapus Materi & Bank Soal?',
        html: `
          <div class="text-left font-handwrite text-stone-800 text-base space-y-2">
            <p>Apakah Anda yakin ingin menghapus modul materi <b>"${mat.title}"</b>?</p>
            ${qCount > 0 ? `<div class="p-2.5 bg-purple-50 rounded border border-purple-300 text-xs font-sans text-purple-950 font-bold">📦 Terdapat <b>${qCount} butir soal AI tersimpan</b> pada materi ini yang juga akan dihapus.</div>` : ''}
            <p class="text-xs text-rose-700 font-bold">⚠️ Tindakan ini permanen dan akan menghapus modul dari pustaka lokal Anda.</p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#78716c',
        confirmButtonText: 'Ya, Hapus Sekarang',
        cancelButtonText: 'Batal'
      }).then((res) => {
        if (res.isConfirmed) {
          appState.materials = appState.materials.filter(m => m.id !== materialId);
          localStorage.setItem('toefl_materials', JSON.stringify(appState.materials));

          closeMaterialReader();
          closeSavedQuestionBankModal();
          renderMateriCards();
          updateDashboardKPIs();

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Materi berhasil dihapus!',
            showConfirmButton: false,
            timer: 2000
          });
        }
      });
    }

    let activeBankMaterial = null;

    function openSavedQuestionBankModal(materialId) {
      const mat = appState.materials.find(m => m.id === materialId);
      if (!mat) return;

      activeBankMaterial = mat;
      const questions = mat.savedQuestions || [];

      document.getElementById('qBankSectionBadge').innerText = mat.section;
      document.getElementById('qBankCountBadge').innerText = `${questions.length} Soal AI`;
      document.getElementById('qBankTitle').innerText = `Bank Soal: ${mat.title}`;
      document.getElementById('qBankSubtitle').innerText = `Koleksi butir soal tersimpan untuk materi "${mat.title}" (${mat.section}).`;

      const container = document.getElementById('qBankListContainer');
      if (questions.length === 0) {
        container.innerHTML = `
          <div class="p-8 text-center bg-stone-50 rounded-lg border-2 border-dashed border-stone-300 font-handwrite text-base text-stone-600 space-y-3">
            <i class="fa-solid fa-cube text-4xl text-purple-400"></i>
            <p class="font-bold text-stone-800 text-lg">Belum ada butir soal AI yang tersimpan untuk materi ini.</p>
            <p class="text-xs font-sans text-stone-500 max-w-md mx-auto">Klik tombol di bawah agar siaptuan_premium menyusun 15 butir soal autentik dan menyimpannya secara permanen ke pustaka materi ini.</p>
            <button onclick="generateMoreQuestionsForBank()" class="sketch-btn bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2.5 font-bold inline-flex items-center space-x-1.5 shadow-sketch-sm">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>Generate 15 Soal Pertama (AI)</span>
            </button>
          </div>
        `;
      } else {
        container.innerHTML = questions.map((q, idx) => {
          return `
            <div class="sketch-box p-4 bg-white space-y-2 border-stone-300">
              <div class="flex items-center justify-between gap-2 border-b border-stone-200 pb-1.5">
                <span class="text-[11px] font-typewriter font-bold bg-amber-100 text-amber-900 border border-amber-400 px-2 py-0.5 rounded">
                  Soal #${idx + 1} • ${q.section || mat.section} (${q.skill || mat.title})
                </span>
                <span class="text-xs font-typewriter font-bold text-emerald-800 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded">
                  Kunci: ${q.correctAnswer}
                </span>
              </div>
              ${q.passageOrAudioScript ? `<div class="p-2.5 bg-stone-50 rounded border border-stone-200 font-mono text-xs text-stone-700 whitespace-pre-wrap">${q.passageOrAudioScript}</div>` : ''}
              <p class="font-bold text-stone-900 text-sm font-sans">${idx + 1}. ${q.questionText}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                ${(q.options || []).map((opt, oIdx) => {
                  const letter = ['A','B','C','D'][oIdx];
                  const isCorrect = (letter === q.correctAnswer);
                  return `
                    <div class="p-2 rounded border flex items-center space-x-2 ${isCorrect ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950' : 'bg-stone-50 border-stone-200 text-stone-700'}">
                      <span class="w-5 h-5 rounded-full flex items-center justify-center font-typewriter text-[11px] ${isCorrect ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'}">${letter}</span>
                      <span>${opt}</span>
                    </div>
                  `;
                }).join('')}
              </div>
              ${q.explanation ? `
                <div class="p-2.5 bg-amber-50/70 rounded border border-amber-200 text-xs text-stone-700 font-sans space-y-1 mt-2">
                  <div class="font-bold text-amber-900">Pembahasan & Kaidah:</div>
                  <p>${q.explanation.whyCorrect || ''}</p>
                  ${q.explanation.grammarRule ? `<div class="font-typewriter text-[11px] text-amber-950 font-bold">📌 Rumus: ${q.explanation.grammarRule}</div>` : ''}
                  ${q.explanation.vocabulary ? `<div class="text-[11px] text-stone-600 italic">📖 Vocab: ${q.explanation.vocabulary}</div>` : ''}
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
      }

      document.getElementById('savedQuestionBankModal').classList.remove('hidden');
    }

    function closeSavedQuestionBankModal() {
      document.getElementById('savedQuestionBankModal').classList.add('hidden');
    }

    function startTestFromSavedBank() {
      if (!activeBankMaterial || !activeBankMaterial.savedQuestions || activeBankMaterial.savedQuestions.length === 0) {
        Swal.fire('Info', 'Bank soal masih kosong. Silakan generate soal terlebih dahulu.', 'info');
        return;
      }
      closeSavedQuestionBankModal();
      closeMaterialReader();
      startStandardTest15(activeBankMaterial.savedQuestions, `Bank Soal: ${activeBankMaterial.title} (${activeBankMaterial.savedQuestions.length} Soal)`);
    }

    async function generateMoreQuestionsForBank() {
      if (!activeBankMaterial) return;
      const mat = activeBankMaterial;
      closeSavedQuestionBankModal();
      await triggerAiQuestionGeneration(mat.title, mat.section, mat);
    }

    function clearSavedQuestionBank() {
      if (!activeBankMaterial) return;
      const mat = activeBankMaterial;

      Swal.fire({
        title: 'Kosongkan Bank Soal?',
        text: `Hapus seluruh ${mat.savedQuestions?.length || 0} butir soal tersimpan untuk materi "${mat.title}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#78716c',
        confirmButtonText: 'Ya, Kosongkan',
        cancelButtonText: 'Batal'
      }).then((res) => {
        if (res.isConfirmed) {
          mat.savedQuestions = [];
          localStorage.setItem('toefl_materials', JSON.stringify(appState.materials));
          renderMateriCards();
          openSavedQuestionBankModal(mat.id);

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Bank soal materi berhasil dikosongkan.',
            showConfirmButton: false,
            timer: 2000
          });
        }
      });
    }

    function playCurrentMaterialSpeech() {
      if (!activeReadingMaterial) return;
      if (!('speechSynthesis' in window)) {
        Swal.fire('Info', 'Browser tidak mendukung Text-to-Speech.', 'info');
        return;
      }
      window.speechSynthesis.cancel();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = activeReadingMaterial.content;
      const text = `${activeReadingMaterial.title}. ${tempDiv.innerText}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Memutar Audio Suara Catatan...',
        showConfirmButton: false,
        timer: 3000
      });
    }

    function copyMaterialNotes() {
      if (!activeReadingMaterial) return;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = activeReadingMaterial.content;
      const note = `[CATATAN SKETSA TOEFL ITP]\nTopik: ${activeReadingMaterial.title} (${activeReadingMaterial.skillCode})\n\n${tempDiv.innerText}`;
      
      navigator.clipboard.writeText(note).then(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Catatan materi berhasil disalin!',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }

    function printCurrentMaterial() {
      window.print();
    }

    function launchQuickQuizFromMateri() {
      if (!activeReadingMaterial) return;
      const id = activeReadingMaterial.id;
      const title = activeReadingMaterial.title;
      const section = activeReadingMaterial.section;
      closeMaterialReader();
      launchQuickTestForSkill(id, section);
    }

    async function launchQuickTestForSkill(materialIdOrTitle, explicitSection = null) {
      const mat = appState.materials.find(m => m.id === materialIdOrTitle || m.title === materialIdOrTitle);
      const skillName = mat ? mat.title : materialIdOrTitle;
      const section = mat ? mat.section : (explicitSection || 'STRUCTURE');
      const savedCount = (mat && mat.savedQuestions && Array.isArray(mat.savedQuestions)) ? mat.savedQuestions.length : 0;

      let modalHtml = `
        <div class="text-left font-handwrite text-stone-800 text-base space-y-2">
          <p>Pilih mode latihan soal untuk topik <b>${skillName}</b> (<span class="font-typewriter font-bold text-amber-900">${section}</span>):</p>
          ${savedCount > 0 ? `
            <div class="p-2.5 bg-purple-50 rounded border-l-4 border-purple-600 text-xs font-sans text-purple-950 font-bold">
              📦 Tersedia <b>${savedCount} butir soal AI tersimpan</b> di Bank Soal materi ini.
            </div>
          ` : ''}
          <div class="p-3 bg-amber-50 rounded border-l-4 border-amber-500 text-xs font-sans text-stone-700">
            ✨ <b>Mode AI:</b> siaptuan_premium akan merancang 15 butir soal autentik khusus materi "${skillName}".<br/>
            📝 <b>Mode Standar:</b> Membuka paket soal offline khusus subtema <b>${skillName}</b>.
          </div>
        </div>
      `;

      Swal.fire({
        title: `Latihan Soal: ${skillName}`,
        html: modalHtml,
        icon: 'question',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: savedCount > 0 ? `🚀 Buka Bank Soal (${savedCount} Soal)` : '✨ Generate 15 Soal AI (siaptuan_premium)',
        confirmButtonColor: savedCount > 0 ? '#7c3aed' : '#059669',
        denyButtonText: `📝 Paket Standar (${skillName.length > 20 ? skillName.substring(0, 20) + '...' : skillName})`,
        denyButtonColor: '#4b5563',
        cancelButtonText: savedCount > 0 ? '✨ Buat 15 Soal AI Baru' : 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (savedCount > 0) {
            startStandardTest15(mat.savedQuestions, `Bank Soal: ${skillName} (${savedCount} Soal)`);
            return;
          }
          await triggerAiQuestionGeneration(skillName, section, mat);
        } else if (result.isDenied) {
          const offlineSet = getOfflineQuestionsForSkill(skillName, section);
          startStandardTest15(offlineSet, `Latihan Standar: ${skillName} (15 Soal)`);
        } else if (result.dismiss === Swal.DismissReason.cancel && savedCount > 0) {
          await triggerAiQuestionGeneration(skillName, section, mat);
        }
      });
    }

    async function triggerAiQuestionGeneration(skillName, section, mat) {
      Swal.fire({
        title: 'Menyusun 15 Soal dengan AI...',
        text: `siaptuan_premium sedang membuat 15 butir soal autentik untuk topik "${skillName}" (${section})...`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        const promptContent = `
          Anda adalah Pembuat Soal Ujian Resmi TOEFL ITP Senior.
          Buatkan tepat 15 Soal TOEFL ITP berstandar tinggi dengan fokus topik: "${skillName}" (Kategori: ${section}).
          Setiap butir soal HARUS relevan dengan kategori ${section} dan topik ${skillName}.
          Setiap soal harus memiliki struktur JSON yang valid sebagai array of objects.
          Format JSON Wajib:
          [
            {
              "id": 1,
              "section": "${section}",
              "skill": "${skillName}",
              "passageOrAudioScript": "Teks bacaan atau naskah dialog percakapan (atau null jika tidak perlu)",
              "questionText": "Teks pertanyaan",
              "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
              "correctAnswer": "A",
              "explanation": {
                "whyCorrect": "Penjelasan mendalam mengapa opsi ini benar",
                "whyOthersWrong": {
                  "A": "Alasan A salah/benar",
                  "B": "Alasan B salah/benar",
                  "C": "Alasan C salah/benar",
                  "D": "Alasan D salah/benar"
                },
                "grammarRule": "Kaidah rumus grammar / tips listening / strategi reading",
                "vocabulary": "Kosakata kunci dan artinya"
              }
            }
          ]
          PENTING: Berikan HANYA JSON murni yang valid tanpa awalan atau akhiran teks lain.
        `;

        const response = await aiChatFetch({
          model: appState.apiConfig.model || 'siaptuan_premium',
          messages: [
            { role: 'system', content: 'You are a professional TOEFL ITP exam generator that returns strictly valid JSON array.' },
            { role: 'user', content: promptContent }
          ],
          temperature: 0.7
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const resData = await response.json();
        const content = resData.choices[0].message.content;
        let jsonStr = content.trim();
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const parsedQuestions = JSON.parse(jsonStr);
        if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
          if (mat) {
            mat.savedQuestions = (mat.savedQuestions || []).concat(parsedQuestions);
            localStorage.setItem('toefl_materials', JSON.stringify(appState.materials));
            renderMateriCards();
          }
          Swal.close();
          startStandardTest15(parsedQuestions, `Latihan AI: ${skillName} (15 Soal)`);
        } else {
          throw new Error('Format JSON tidak valid.');
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghubungi AI',
          text: `${err.message}. Membuka paket latihan offline ${section} sebagai alternatif...`,
          confirmButtonText: 'Buka Soal Standar'
        }).then(() => {
          const offlineSet = getOfflineQuestionsForSection(section);
          startStandardTest15(offlineSet, `Latihan Standar: ${skillName} (${section})`);
        });
      }
    }

    function selectTestPreset(type) {
      if (type === 'mix') {
        startStandardTest15(SEED_TEST_SET_15, 'Paket Mix Standar (15 Soal: 5 Listening, 5 Structure, 5 Reading)');
      } else if (type === 'structure') {
        startStandardTest15(SEED_STRUCTURE_SET_15, 'Structure Intensive (15 Soal Grammar)');
      } else if (type === 'listening') {
        startStandardTest15(SEED_LISTENING_SET_15, 'Listening Intensive (15 Soal Dialog & Lecture)');
      } else if (type === 'reading') {
        startStandardTest15(SEED_READING_SET_15, 'Reading Intensive (15 Soal Passage & Vocab)');
      }
    }

    function startStandardTest15(questionsArray = SEED_TEST_SET_15, testTitle = 'Simulasi TOEFL ITP (15 Soal)') {
      appState.currentTest = {
        title: testTitle,
        questions: JSON.parse(JSON.stringify(questionsArray)),
        startedAt: new Date(),
        durationSeconds: APP_CONFIG.examDurationSeconds
      };
      appState.activeQuestionIndex = 0;
      appState.userAnswers = {};
      appState.flaggedQuestions = new Set();
      appState.timeRemaining = APP_CONFIG.examDurationSeconds;

      document.getElementById('testLobbyContainer').classList.add('hidden');
      document.getElementById('testActiveContainer').classList.remove('hidden');

      clearInterval(appState.testTimerInterval);
      startExamTimer();

      renderCurrentQuestion();
      renderQuestionPalette();

      navigateTo('test-center');
    }

    function startExamTimer() {
      updateTimerDisplay();
      appState.testTimerInterval = setInterval(() => {
        appState.timeRemaining--;
        updateTimerDisplay();

        if (appState.timeRemaining <= 0) {
          clearInterval(appState.testTimerInterval);
          Swal.fire({
            icon: 'warning',
            title: 'Waktu Ujian Habis!',
            text: 'Waktu pengerjaan 25 menit telah berakhir. Jawaban Anda akan otomatis dikirim dan dinilai.',
            confirmButtonText: 'Lihat Hasil & Pembahasan'
          }).then(() => {
            finishAndSubmitTest();
          });
        }
      }, 1000);
    }

    function updateTimerDisplay() {
      const minutes = Math.floor(appState.timeRemaining / 60);
      const seconds = appState.timeRemaining % 60;
      const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      const timerDisplay = document.getElementById('examTimerDisplay');
      if (timerDisplay) {
        timerDisplay.innerText = formatted;
        if (appState.timeRemaining < 300) {
          timerDisplay.classList.add('text-red-400');
        } else {
          timerDisplay.classList.remove('text-red-400');
        }
      }
    }

    function renderCurrentQuestion() {
      if (!appState.currentTest) return;
      const qIndex = appState.activeQuestionIndex;
      const q = appState.currentTest.questions[qIndex];
      if (!q) return;

      document.getElementById('activeQuestionCounter').innerText = `Soal ${qIndex + 1} / ${appState.currentTest.questions.length}`;
      document.getElementById('qSectionTag').innerText = q.section || 'STRUCTURE';
      document.getElementById('qSkillTag').innerText = `Skill: ${q.skill || 'General'}`;

      const audioContainer = document.getElementById('qAudioContainer');
      if (q.section === 'LISTENING' && q.passageOrAudioScript) {
        audioContainer.classList.remove('hidden');
      } else {
        audioContainer.classList.add('hidden');
      }

      const passageBox = document.getElementById('qPassageBox');
      if (q.passageOrAudioScript) {
        passageBox.innerText = q.passageOrAudioScript;
        passageBox.classList.remove('hidden');
      } else {
        passageBox.classList.add('hidden');
      }

      document.getElementById('qPromptText').innerText = `${qIndex + 1}. ${q.questionText}`;

      const optionsContainer = document.getElementById('qOptionsContainer');
      const optionLabels = ['A', 'B', 'C', 'D'];
      const currentSelected = appState.userAnswers[q.id];

      optionsContainer.innerHTML = q.options.map((opt, idx) => {
        const letter = optionLabels[idx];
        const isSelected = (currentSelected === letter);
        return `
          <div onclick="selectAnswer('${q.id}', '${letter}')" 
               class="option-card sketch-box p-3.5 sm:p-4 bg-white hover:bg-amber-50 cursor-pointer flex items-center space-x-3 transition ${isSelected ? 'selected' : ''}">
            <div class="w-7 h-7 rounded-full border-2 border-stone-800 flex items-center justify-center font-typewriter font-bold text-sm ${isSelected ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-800'}">
              ${letter}
            </div>
            <div class="text-sm font-sans text-stone-900 font-medium">${opt}</div>
          </div>
        `;
      }).join('');

      const flagBtn = document.getElementById('flagBtn');
      if (appState.flaggedQuestions.has(q.id)) {
        flagBtn.classList.add('bg-amber-300', 'text-amber-950', 'border-amber-700');
      } else {
        flagBtn.classList.remove('bg-amber-300', 'text-amber-950', 'border-amber-700');
      }

      document.getElementById('prevQBtn').disabled = (qIndex === 0);
      document.getElementById('nextQBtn').innerText = (qIndex === appState.currentTest.questions.length - 1) ? 'Selesai' : 'Selanjutnya';
    }

    function selectAnswer(questionId, letter) {
      appState.userAnswers[questionId] = letter;
      renderCurrentQuestion();
      renderQuestionPalette();
    }

    function clearCurrentAnswer() {
      const q = appState.currentTest.questions[appState.activeQuestionIndex];
      if (q && appState.userAnswers[q.id]) {
        delete appState.userAnswers[q.id];
        renderCurrentQuestion();
        renderQuestionPalette();
      }
    }

    function flagCurrentQuestion() {
      const q = appState.currentTest.questions[appState.activeQuestionIndex];
      if (!q) return;
      if (appState.flaggedQuestions.has(q.id)) {
        appState.flaggedQuestions.delete(q.id);
      } else {
        appState.flaggedQuestions.add(q.id);
      }
      renderCurrentQuestion();
      renderQuestionPalette();
    }

    function prevQuestion() {
      if (appState.activeQuestionIndex > 0) {
        appState.activeQuestionIndex--;
        renderCurrentQuestion();
      }
    }

    function nextQuestion() {
      if (appState.activeQuestionIndex < appState.currentTest.questions.length - 1) {
        appState.activeQuestionIndex++;
        renderCurrentQuestion();
      } else {
        confirmSubmitTest();
      }
    }

    function jumpToQuestion(index) {
      appState.activeQuestionIndex = index;
      renderCurrentQuestion();
    }

    function renderQuestionPalette() {
      const grid = document.getElementById('questionPaletteGrid');
      if (!appState.currentTest) return;

      let answeredCount = 0;

      grid.innerHTML = appState.currentTest.questions.map((q, idx) => {
        const isCurrent = (idx === appState.activeQuestionIndex);
        const isAnswered = Boolean(appState.userAnswers[q.id]);
        const isFlagged = appState.flaggedQuestions.has(q.id);

        if (isAnswered) answeredCount++;

        let btnClass = 'bg-white text-stone-800 border-stone-700';
        if (isAnswered) btnClass = 'bg-emerald-200 text-emerald-950 font-bold border-stone-800';
        if (isFlagged) btnClass = 'bg-amber-200 text-amber-950 font-bold border-amber-800';
        if (isCurrent) btnClass += ' ring-2 ring-stone-900 scale-105';

        return `
          <button onclick="jumpToQuestion(${idx})" class="w-full h-8 rounded border-2 ${btnClass} font-typewriter text-xs flex items-center justify-center transition">
            ${idx + 1}
          </button>
        `;
      }).join('');

      document.getElementById('paletteAnsweredCount').innerText = answeredCount;
    }

    function playListeningAudioSpeech() {
      const q = appState.currentTest.questions[appState.activeQuestionIndex];
      if (!q || !q.passageOrAudioScript) return;

      if (!('speechSynthesis' in window)) {
        Swal.fire('Info', 'Audio browser tidak tersedia.', 'info');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(q.passageOrAudioScript);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }

    function confirmSubmitTest() {
      const answered = Object.keys(appState.userAnswers).length;
      const total = appState.currentTest.questions.length;
      const unanswered = total - answered;

      Swal.fire({
        title: 'Kirim Jawaban Ujian?',
        html: `
          <div class="font-handwrite text-left text-base text-stone-800">
            <p>Terjawab: <b>${answered} dari ${total} soal</b></p>
            ${unanswered > 0 ? `<p class="text-rose-700 font-bold">⚠️ Masih ada ${unanswered} soal yang belum dijawab!</p>` : '<p class="text-emerald-700 font-bold">✅ Seluruh 15 soal telah dijawab!</p>'}
            <p class="mt-2 text-xs font-sans text-stone-500">Hasil dan pembahasan lengkap akan langsung ditampilkan.</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#78716c',
        confirmButtonText: 'Ya, Selesaikan & Nilai',
        cancelButtonText: 'Lanjutkan Mengerjakan'
      }).then((res) => {
        if (res.isConfirmed) {
          finishAndSubmitTest();
        }
      });
    }

    function finishAndSubmitTest() {
      clearInterval(appState.testTimerInterval);

      const test = appState.currentTest;
      const questions = test.questions;
      let correctCount = 0;

      questions.forEach(q => {
        if (appState.userAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });

      const total = questions.length;
      const percentage = Math.round((correctCount / total) * 100);
      const scaledScore = Math.round(310 + ((correctCount / total) * (677 - 310)));
      const timeSpentSeconds = APP_CONFIG.examDurationSeconds - appState.timeRemaining;
      const mins = Math.floor(timeSpentSeconds / 60);
      const secs = timeSpentSeconds % 60;
      const timeSpentStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

      const historyItem = {
        id: 'hist-' + Date.now(),
        title: test.title,
        date: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        section: 'MIX',
        totalQuestions: total,
        correctCount: correctCount,
        scaledScore: scaledScore,
        percentage: percentage,
        timeSpent: timeSpentStr,
        status: (scaledScore >= 550) ? 'EXCELLENT' : (scaledScore >= 450 ? 'GOOD' : 'NEEDS_PRACTICE'),
        questions: test.questions,
        userAnswers: { ...appState.userAnswers }
      };

      appState.testHistory.unshift(historyItem);
      localStorage.setItem('toefl_history', JSON.stringify(appState.testHistory));

      document.getElementById('testActiveContainer').classList.add('hidden');
      document.getElementById('testLobbyContainer').classList.remove('hidden');

      if (percentage >= 80 && window.confetti) {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }

      loadExplanationView(historyItem);
    }

    let currentReviewFilter = 'ALL';

    function loadExplanationView(historyItem) {
      appState.activeReviewData = historyItem;
      document.getElementById('reviewCorrectCount').innerText = `${historyItem.correctCount} / ${historyItem.totalQuestions}`;
      document.getElementById('reviewScaledScore').innerText = historyItem.scaledScore;
      document.getElementById('reviewPercentage').innerText = historyItem.percentage + '%';
      document.getElementById('reviewTimeSpent').innerText = historyItem.timeSpent;
      document.getElementById('reviewDate').innerText = `Tanggal: ${historyItem.date}`;

      const stamp = document.getElementById('reviewStamp');
      if (historyItem.scaledScore >= 550) {
        stamp.className = 'ink-stamp ink-stamp-pass text-xs';
        stamp.innerText = 'LULUS TARGET 550+';
      } else {
        stamp.className = 'ink-stamp ink-stamp-gold text-xs';
        stamp.innerText = 'HASIL EVALUASI';
      }

      const corrects = historyItem.questions.filter(q => historyItem.userAnswers[q.id] === q.correctAnswer).length;
      const wrongs = historyItem.totalQuestions - corrects;
      document.getElementById('revFilterCorrect').innerText = corrects;
      document.getElementById('revFilterWrong').innerText = wrongs;
      document.getElementById('revFilterFlagged').innerText = appState.flaggedQuestions.size || 0;

      renderExplanationList();
      navigateTo('pembahasan');
    }

    function viewPastTestExplanation(historyId) {
      const item = appState.testHistory.find(h => h.id === historyId);
      if (item) {
        loadExplanationView(item);
      }
    }

    function filterReviewQuestions(filter) {
      currentReviewFilter = filter;
      document.querySelectorAll('.review-filter-btn').forEach(b => {
        b.classList.remove('bg-stone-800', 'text-amber-200', 'active');
        b.classList.add('bg-white');
      });
      event.target.classList.add('bg-stone-800', 'text-amber-200', 'active');
      renderExplanationList();
    }

    function renderExplanationList() {
      const container = document.getElementById('reviewQuestionsList');
      if (!appState.activeReviewData) return;

      const data = appState.activeReviewData;
      const optionLetters = ['A', 'B', 'C', 'D'];

      let filtered = data.questions.filter(q => {
        const userAns = data.userAnswers[q.id];
        const isCorrect = (userAns === q.correctAnswer);
        if (currentReviewFilter === 'CORRECT') return isCorrect;
        if (currentReviewFilter === 'WRONG') return !isCorrect;
        if (currentReviewFilter === 'FLAGGED') return appState.flaggedQuestions.has(q.id);
        return true;
      });

      if (filtered.length === 0) {
        container.innerHTML = `<div class="sketch-box p-6 bg-white text-center font-handwrite text-stone-600 text-lg">Tidak ada soal dalam filter ini.</div>`;
        return;
      }

      container.innerHTML = filtered.map((q, idx) => {
        const userAns = data.userAnswers[q.id] || 'Tidak Dijawab';
        const isCorrect = (userAns === q.correctAnswer);

        return `
          <div class="sketch-box p-5 sm:p-6 bg-white space-y-4 relative">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-stone-200 pb-2">
              <div class="flex items-center space-x-2">
                <span class="font-title font-bold text-lg text-stone-900">Soal #${q.id}</span>
                <span class="text-xs font-typewriter bg-stone-100 border border-stone-600 px-1.5 py-0.5 rounded font-bold">${q.section}</span>
                <span class="text-xs font-handwrite text-stone-600">(${q.skill})</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="ink-stamp ${isCorrect ? 'ink-stamp-pass' : 'ink-stamp-fail'} text-xs">
                  ${isCorrect ? 'BENAR ✓' : 'SALAH ✗'}
                </span>
                <button onclick="openAITutorForQuestion(${q.id})" class="sketch-btn bg-indigo-100 hover:bg-indigo-200 text-indigo-950 text-xs px-2.5 py-1 flex items-center space-x-1 font-bold">
                  <i class="fa-solid fa-chalkboard-user text-indigo-700"></i>
                  <span>Tanya Guru AI</span>
                </button>
              </div>
            </div>

            ${q.passageOrAudioScript ? `
              <div class="p-3 bg-stone-50 border-2 border-dashed border-stone-300 rounded font-typewriter text-xs text-stone-800">
                ${q.passageOrAudioScript}
              </div>
            ` : ''}

            <div class="font-sans font-semibold text-stone-900 text-base">
              ${q.questionText}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              ${q.options.map((opt, i) => {
                const letter = optionLetters[i];
                const isCorrectOption = (letter === q.correctAnswer);
                const isUserChosen = (letter === userAns);

                let cardBorder = 'border-stone-300 bg-white';
                let tag = '';

                if (isCorrectOption) {
                  cardBorder = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold';
                  tag = '<span class="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-typewriter ml-auto">KUNCI BENAR</span>';
                } else if (isUserChosen && !isCorrect) {
                  cardBorder = 'border-rose-600 bg-rose-50 text-rose-950';
                  tag = '<span class="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-typewriter ml-auto">PILIHAN ANDA</span>';
                }

                return `
                  <div class="p-2.5 rounded-lg border-2 ${cardBorder} flex items-center space-x-2">
                    <span class="font-typewriter font-bold text-xs">${letter}.</span>
                    <span>${opt}</span>
                    ${tag}
                  </div>
                `;
              }).join('')}
            </div>

            <div class="p-4 bg-amber-50/70 rounded-lg border-2 border-amber-300 space-y-2 text-xs font-sans text-stone-800">
              <div class="font-title font-bold text-sm text-amber-950 flex items-center space-x-1.5">
                <i class="fa-solid fa-lightbulb text-amber-700"></i>
                <span>Pembahasan & Analisis Kaidah:</span>
              </div>
              <p class="leading-relaxed font-handwrite text-base text-stone-900">
                ${q.explanation?.whyCorrect || 'Penjelasan kaidah tata bahasa untuk soal ini.'}
              </p>
              
              ${q.explanation?.grammarRule ? `
                <div class="pt-1 text-[11px] font-mono text-amber-900 border-t border-amber-200">
                  <b>Kaidah / Rulebook:</b> ${q.explanation.grammarRule}
                </div>
              ` : ''}

              ${q.explanation?.vocabulary ? `
                <div class="text-[11px] font-mono text-stone-600">
                  <b>Kosakata & Makna:</b> ${q.explanation.vocabulary}
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    function retakeCurrentTest() {
      if (appState.activeReviewData) {
        startStandardTest15(appState.activeReviewData.questions, appState.activeReviewData.title + ' (Retake)');
      }
    }

    function printExplanationReport() {
      window.print();
    }

    let masterDataSortColumn = 'date';
    let masterDataSortOrder = 'desc';
    let masterCurrentPage = 1;
    const masterItemsPerPage = 6;

    function renderMasterDataTable() {
      const tbody = document.getElementById('masterDataTableBody');
      const searchQuery = (document.getElementById('masterDataSearch')?.value || '').toLowerCase();
      const catFilter = document.getElementById('masterDataCategoryFilter')?.value || 'ALL';
      const statusFilter = document.getElementById('masterDataStatusFilter')?.value || 'ALL';

      let data = [...appState.testHistory];

      data = data.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery);
        const matchesCat = (catFilter === 'ALL' || item.section === catFilter);
        const matchesStatus = (statusFilter === 'ALL' || item.status === statusFilter);
        return matchesSearch && matchesCat && matchesStatus;
      });

      data.sort((a, b) => {
        if (masterDataSortColumn === 'score') {
          return masterDataSortOrder === 'asc' ? a.scaledScore - b.scaledScore : b.scaledScore - a.scaledScore;
        } else {
          return masterDataSortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
        }
      });

      const totalItems = data.length;
      const totalPages = Math.ceil(totalItems / masterItemsPerPage) || 1;
      if (masterCurrentPage > totalPages) masterCurrentPage = totalPages;

      const startIndex = (masterCurrentPage - 1) * masterItemsPerPage;
      const paginatedItems = data.slice(startIndex, startIndex + masterItemsPerPage);

      document.getElementById('masterPaginationInfo').innerText = `${totalItems === 0 ? 0 : startIndex + 1} - ${Math.min(startIndex + masterItemsPerPage, totalItems)} dari ${totalItems} data`;

      const pagBtnContainer = document.getElementById('masterPaginationButtons');
      let buttonsHtml = '';
      for (let p = 1; p <= totalPages; p++) {
        buttonsHtml += `
          <button onclick="changeMasterPage(${p})" class="px-2 py-1 rounded border ${p === masterCurrentPage ? 'bg-stone-800 text-amber-200 border-stone-900 font-bold' : 'bg-white text-stone-700 hover:bg-stone-100'}">
            ${p}
          </button>
        `;
      }
      pagBtnContainer.innerHTML = buttonsHtml;

      if (paginatedItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center font-handwrite text-stone-500 text-lg">Tidak ada rekaman data yang cocok.</td></tr>`;
        return;
      }

      tbody.innerHTML = paginatedItems.map(item => `
        <tr class="hover:bg-amber-50/50 transition">
          <td class="p-2.5 font-typewriter text-xs text-stone-600">${item.date}</td>
          <td class="p-2.5 font-semibold text-stone-900">${item.title}</td>
          <td class="p-2.5 font-typewriter text-xs text-stone-700">${item.section}</td>
          <td class="p-2.5 text-center font-title font-bold text-amber-800 text-base">${item.scaledScore}</td>
          <td class="p-2.5 text-center font-typewriter text-xs font-bold">${item.percentage}% (${item.correctCount}/${item.totalQuestions})</td>
          <td class="p-2.5 text-center">
            <span class="ink-stamp ${item.scaledScore >= 550 ? 'ink-stamp-pass' : 'ink-stamp-gold'} text-[10px]">
              ${item.status}
            </span>
          </td>
          <td class="p-2.5 text-right space-x-1">
            <button onclick="viewPastTestExplanation('${item.id}')" title="Lihat Pembahasan" class="p-1 text-stone-700 hover:text-indigo-800">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button onclick="retakeFromHistory('${item.id}')" title="Uji Ulang" class="p-1 text-stone-700 hover:text-emerald-800">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
            <button onclick="deleteHistoryItem('${item.id}')" title="Hapus" class="p-1 text-stone-700 hover:text-rose-800">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    function sortMasterData(column) {
      if (masterDataSortColumn === column) {
        masterDataSortOrder = (masterDataSortOrder === 'asc') ? 'desc' : 'asc';
      } else {
        masterDataSortColumn = column;
        masterDataSortOrder = 'desc';
      }
      renderMasterDataTable();
    }

    function changeMasterPage(page) {
      masterCurrentPage = page;
      renderMasterDataTable();
    }

    function deleteHistoryItem(id) {
      Swal.fire({
        title: 'Hapus Rekaman Ini?',
        text: 'Data riwayat tes akan dihapus permanen dari memori lokal.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b91c1c',
        cancelButtonColor: '#78716c',
        confirmButtonText: 'Ya, Hapus'
      }).then(res => {
        if (res.isConfirmed) {
          appState.testHistory = appState.testHistory.filter(h => h.id !== id);
          localStorage.setItem('toefl_history', JSON.stringify(appState.testHistory));
          renderMasterDataTable();
          updateDashboardKPIs();
        }
      });
    }

    function retakeFromHistory(id) {
      const item = appState.testHistory.find(h => h.id === id);
      if (item) {
        startStandardTest15(item.questions, item.title + ' (Retake)');
      }
    }

    function exportHistoryCSV() {
      if (!appState.testHistory || appState.testHistory.length === 0) {
        Swal.fire('Info', 'Belum ada data riwayat untuk diekspor.', 'info');
        return;
      }

      let csv = 'ID,Tanggal,Paket Ujian,Seksi,Total Soal,Jawaban Benar,Akurasi (%),Skor Scaled ITP,Waktu Terpakai,Status\n';
      appState.testHistory.forEach(h => {
        csv += `"${h.id}","${h.date}","${h.title}","${h.section}",${h.totalQuestions},${h.correctCount},${h.percentage},${h.scaledScore},"${h.timeSpent}","${h.status}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `TOEFL_ITP_History_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire('Sukses', 'File CSV berhasil diunduh.', 'success');
    }

    function printMasterTable() {
      window.print();
    }

    function renderKanbanBoard() {
      const cols = {
        backlog: document.getElementById('kanbanColBacklog'),
        in_progress: document.getElementById('kanbanColInProgress'),
        testing: document.getElementById('kanbanColTesting'),
        done: document.getElementById('kanbanColDone')
      };

      const counts = { backlog: 0, in_progress: 0, testing: 0, done: 0 };
      Object.values(cols).forEach(c => c.innerHTML = '');

      appState.kanbanCards.forEach(card => {
        const col = card.status || 'backlog';
        if (cols[col]) {
          counts[col]++;
          cols[col].innerHTML += `
            <div id="${card.id}" draggable="true" ondragstart="handleDragStart(event)" 
                 class="sketch-box p-3 bg-white hover:shadow-sketch-sm cursor-grab active:cursor-grabbing space-y-2 relative group">
              <div class="flex justify-between items-start">
                <span class="text-[10px] font-typewriter font-bold bg-amber-100 border border-stone-600 px-1 rounded">
                  ${card.section}
                </span>
                <span class="ink-stamp ${card.priority === 'Urgent' ? 'ink-stamp-fail' : 'ink-stamp-gold'} text-[8px]">
                  ${card.priority}
                </span>
              </div>
              <h4 class="font-title font-bold text-stone-900 text-sm leading-tight">${card.title}</h4>
              <div class="flex items-center justify-between text-[11px] font-handwrite text-stone-500 pt-1 border-t border-stone-200">
                <span>📅 ${card.targetDate || 'Fleksibel'}</span>
                <button onclick="deleteKanbanCard('${card.id}')" class="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-700 transition">
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>
          `;
        }
      });

      document.getElementById('countColBacklog').innerText = counts.backlog;
      document.getElementById('countColInProgress').innerText = counts.in_progress;
      document.getElementById('countColTesting').innerText = counts.testing;
      document.getElementById('countColDone').innerText = counts.done;
    }

    function handleDragStart(e) {
      e.dataTransfer.setData('text/plain', e.target.id);
    }

    function allowDrop(e) {
      e.preventDefault();
    }

    function handleDrop(e, targetStatus) {
      e.preventDefault();
      const cardId = e.dataTransfer.getData('text/plain');
      const card = appState.kanbanCards.find(c => c.id === cardId);
      if (card) {
        card.status = targetStatus;
        localStorage.setItem('toefl_kanban', JSON.stringify(appState.kanbanCards));
        renderKanbanBoard();
      }
    }

    function openAddKanbanModal() {
      document.getElementById('kanbanModal').classList.remove('hidden');
    }

    function closeAddKanbanModal() {
      document.getElementById('kanbanModal').classList.add('hidden');
    }

    function saveNewKanbanCard() {
      const title = document.getElementById('kanbanInputTitle').value.trim();
      const section = document.getElementById('kanbanInputSection').value;
      const priority = document.getElementById('kanbanInputPriority').value;
      const date = document.getElementById('kanbanInputDate').value;

      if (!title) {
        Swal.fire('Peringatan', 'Judul topik tidak boleh kosong.', 'warning');
        return;
      }

      const newCard = {
        id: 'kb-' + Date.now(),
        title: title,
        section: section,
        priority: priority,
        targetDate: date || 'Fleksibel',
        status: 'backlog'
      };

      appState.kanbanCards.push(newCard);
      localStorage.setItem('toefl_kanban', JSON.stringify(appState.kanbanCards));
      closeAddKanbanModal();
      renderKanbanBoard();
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Target berhasil ditambahkan!', showConfirmButton: false, timer: 1500 });
    }

    function deleteKanbanCard(id) {
      appState.kanbanCards = appState.kanbanCards.filter(c => c.id !== id);
      localStorage.setItem('toefl_kanban', JSON.stringify(appState.kanbanCards));
      renderKanbanBoard();
    }

    let analyticsLineChartInstance = null;
    let analyticsBarChartInstance = null;

    function renderAnalyticsCharts() {
      renderAnalyticsLineChart();
      renderAnalyticsBarChart();
    }

    function renderAnalyticsLineChart() {
      const ctx = document.getElementById('analyticsLineChart');
      if (!ctx) return;

      if (analyticsLineChartInstance) analyticsLineChartInstance.destroy();

      const labels = appState.testHistory.slice(0, 8).reverse().map((h, i) => `Sesi #${i+1}`);
      const scores = appState.testHistory.slice(0, 8).reverse().map(h => h.scaledScore);

      analyticsLineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels.length ? labels : ['Tes 1', 'Tes 2', 'Tes 3'],
          datasets: [
            {
              label: 'Skor TOEFL ITP (Scaled)',
              data: scores.length ? scores : [480, 520, 570],
              borderColor: '#059669',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              fill: true,
              tension: 0.3,
              borderWidth: 3,
              pointBackgroundColor: '#57534e',
              pointRadius: 5
            },
            {
              label: 'Target Kelulusan (550)',
              data: Array(labels.length || 3).fill(550),
              borderColor: '#dc2626',
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { min: 310, max: 677 }
          }
        }
      });
    }

    function renderAnalyticsBarChart() {
      const ctx = document.getElementById('analyticsBarChart');
      if (!ctx) return;

      if (analyticsBarChartInstance) analyticsBarChartInstance.destroy();

      analyticsBarChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Listening Part A', 'Structure (Grammar)', 'Written Expression', 'Reading Comprehension', 'Vocab In Context'],
          datasets: [{
            label: 'Persentase Akurasi (%)',
            data: [75, 86, 70, 82, 88],
            backgroundColor: [
              'rgba(254, 215, 170, 0.8)',
              'rgba(191, 219, 254, 0.8)',
              'rgba(254, 202, 202, 0.8)',
              'rgba(209, 250, 229, 0.8)',
              'rgba(233, 213, 255, 0.8)'
            ],
            borderColor: '#57534e',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { min: 0, max: 100 }
          }
        }
      });
    }

    function printAnalyticsReport() {
      window.print();
    }

    function populateTopicDropdown(section = 'STRUCTURE', selectedTopic = '') {
      const select = document.getElementById('aiPromptTopicSelect');
      const customWrapper = document.getElementById('aiCustomTopicWrapper');
      const input = document.getElementById('aiPromptTopic');
      const helper = document.getElementById('aiTopicHelperText');
      if (!select) return;

      const catalog = TOEFL_TOPICS_CATALOG[section] || TOEFL_TOPICS_CATALOG.STRUCTURE;
      select.innerHTML = catalog.map(item => `<option value="${item.value}">${item.label}</option>`).join('');

      if (selectedTopic && catalog.some(item => item.value === selectedTopic)) {
        select.value = selectedTopic;
      } else if (selectedTopic) {
        select.value = '__custom__';
        if (input) input.value = selectedTopic;
      } else {
        select.selectedIndex = 0;
      }

      onAiTopicDropdownChanged();
    }

    function onAiSectionChanged() {
      const section = document.getElementById('aiPromptSection').value;
      populateTopicDropdown(section);
    }

    function onAiTopicDropdownChanged() {
      const select = document.getElementById('aiPromptTopicSelect');
      const customWrapper = document.getElementById('aiCustomTopicWrapper');
      const input = document.getElementById('aiPromptTopic');
      const helper = document.getElementById('aiTopicHelperText');
      const section = document.getElementById('aiPromptSection').value;
      if (!select) return;

      const val = select.value;
      const catalog = TOEFL_TOPICS_CATALOG[section] || TOEFL_TOPICS_CATALOG.STRUCTURE;
      const currentItem = catalog.find(i => i.value === val);

      if (val === '__custom__') {
        if (customWrapper) customWrapper.classList.remove('hidden');
        if (input) {
          input.focus();
          if (!input.value) input.placeholder = 'Ketik topik spesifik yang ingin dipelajari/dibuat...';
        }
        if (helper) helper.innerText = 'Ketik topik spesifik yang Anda inginkan di kolom input atas.';
      } else {
        if (customWrapper) customWrapper.classList.add('hidden');
        if (input) input.value = val;
        if (helper && currentItem) {
          helper.innerText = '💡 ' + currentItem.desc;
        }
      }
    }

    function openAIModal(type = 'materi', prefillSection = null, prefillTopic = null) {
      appState.aiModalType = type;
      const title = document.getElementById('aiModalTitle');
      const submitBtn = document.getElementById('aiSubmitBtn');
      const sectionSelect = document.getElementById('aiPromptSection');

      const targetSection = prefillSection || (type === 'test' ? 'MIX' : 'STRUCTURE');
      if (sectionSelect) sectionSelect.value = targetSection;

      populateTopicDropdown(targetSection, prefillTopic || '');

      if (type === 'test') {
        title.innerText = 'AI 15-Question TOEFL ITP Generator';
        submitBtn.innerHTML = '<i class="fa-solid fa-bolt mr-1"></i> Generate 15 Soal Interaktif';
      } else {
        title.innerText = 'AI Generator Materi & Kaidah TOEFL ITP';
        submitBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Buat Modul Materi';
      }

      document.getElementById('aiLoadingIndicator').classList.add('hidden');
      document.getElementById('aiGeneratorModal').classList.remove('hidden');
    }

    function closeAIModal() {
      document.getElementById('aiGeneratorModal').classList.add('hidden');
    }

    async function executeAIGeneration() {
      const section = document.getElementById('aiPromptSection').value;
      const select = document.getElementById('aiPromptTopicSelect');
      let topic = '';
      if (select && select.value !== '__custom__') {
        topic = select.value;
      } else {
        topic = document.getElementById('aiPromptTopic').value.trim();
      }
      if (!topic) topic = 'General TOEFL ITP Skill';

      const customNotes = document.getElementById('aiPromptCustomNotes').value.trim();

      const loadingIndicator = document.getElementById('aiLoadingIndicator');
      const loadingText = document.getElementById('aiLoadingText');
      loadingIndicator.classList.remove('hidden');

      const baseUrl = appState.apiConfig.baseUrl.replace(/\/$/, '');
      const apiKey = appState.apiConfig.apiKey;
      const model = appState.apiConfig.model;

      try {
        if (appState.aiModalType === 'test') {
          loadingText.innerText = `Menghubungi siaptuan_premium untuk membuat 15 Soal TOEFL ITP (${topic})...`;

          const promptContent = `
            Anda adalah Pembuat Soal Ujian Resmi TOEFL ITP Senior.
            Buatkan tepat 15 Soal TOEFL ITP berstandar tinggi dengan topik: "${topic}" (${section}).
            Setiap soal harus memiliki struktur JSON yang valid sebagai array of objects.
            Format JSON Wajib:
            [
              {
                "id": 1,
                "section": "${section}",
                "skill": "Nama Skill Tata Bahasa / Listening / Reading",
                "passageOrAudioScript": "Teks bacaan atau naskah dialog percakapan (atau null jika tidak perlu)",
                "questionText": "Teks pertanyaan",
                "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
                "correctAnswer": "A" (pilih antara A, B, C, atau D),
                "explanation": {
                  "whyCorrect": "Penjelasan mendalam mengapa opsi ini benar",
                  "whyOthersWrong": {
                    "A": "Alasan A salah/benar",
                    "B": "Alasan B salah/benar",
                    "C": "Alasan C salah/benar",
                    "D": "Alasan D salah/benar"
                  },
                  "grammarRule": "Kaidah rumus grammar / tips listening / strategi reading",
                  "vocabulary": "Kosakata kunci dan artinya"
                }
              }
            ]
            PENTING: Berikan HANYA JSON murni yang valid tanpa awalan atau akhiran teks lain.
          `;

          const response = await aiChatFetch({
              model: model,
              messages: [
                { role: 'system', content: 'You are a professional TOEFL ITP exam generator that returns strictly valid JSON.' },
                { role: 'user', content: promptContent }
              ],
              temperature: 0.7
            });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
          const content = result.choices[0].message.content;

          let jsonStr = content.trim();
          if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
          } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
          }

          const parsedQuestions = JSON.parse(jsonStr);
          if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
            let targetMat = appState.materials.find(m => m.title.toLowerCase() === topic.toLowerCase());
            if (targetMat) {
              targetMat.savedQuestions = (targetMat.savedQuestions || []).concat(parsedQuestions);
            } else {
              targetMat = {
                id: 'mat-' + Date.now(),
                section: section === 'MIX' ? 'STRUCTURE' : section,
                skillCode: `SKILL AI`,
                title: topic,
                category: section,
                summary: `Bank Soal AI khusus (${parsedQuestions.length} Soal) mengenai ${topic}.`,
                content: `<h4 class="font-bold text-amber-900 border-b pb-1">Koleksi Bank Soal AI:</h4><p>Modul materi ini dilengkapi dengan ${parsedQuestions.length} butir soal autentik hasil rancangan AI siaptuan_premium yang tersimpan di Bank Soal.</p>`,
                priority: 'High',
                status: 'in_progress',
                savedQuestions: parsedQuestions
              };
              appState.materials.unshift(targetMat);
            }
            localStorage.setItem('toefl_materials', JSON.stringify(appState.materials));
            renderMateriCards();

            closeAIModal();
            Swal.fire('Sukses!', `Berhasil membuat ${parsedQuestions.length} Soal TOEFL ITP baru dari AI dan disimpan ke Bank Soal materi "${topic}".`, 'success');
            startStandardTest15(parsedQuestions, `Paket AI: ${topic} (15 Soal)`);
          } else {
            throw new Error('Format respon AI tidak valid.');
          }

        } else {
          loadingText.innerText = `Menghubungi siaptuan_premium untuk menyusun materi "${topic}"...`;

          const promptContent = `
            Anda adalah Pengajar & Pakar TOEFL ITP Master.
            Buatkan modul belajar ringkas, aplikatif, dan mendalam untuk persiapan TOEFL ITP dengan topik: "${topic}" (${section}).
            Catatan tambahan: "${customNotes}".
            
            Sertakan:
            1. Ringkasan konsep utama (Kaidah Emas)
            2. Rumus dan pola kalimat baku
            3. Contoh kalimat benar vs kalimat salah (Common Traps)
            4. Trik kilat menjawab soal tipe ini dalam 5 detik
            5. Contoh soal model TOEFL beserta analisis jawabannya

            Formatkan dalam bentuk HTML bersih (menggunakan tag <h4>, <p>, <ul>, <li>, <b>, <i>, <div class="p-3 bg-amber-50 rounded">) yang siap ditampilkan di antarmuka.
          `;

          const response = await aiChatFetch({
              model: model,
              messages: [
                { role: 'system', content: 'You are an elite TOEFL ITP instructor producing beautifully structured HTML lesson notes.' },
                { role: 'user', content: promptContent }
              ],
              temperature: 0.7
            });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
          const generatedHtml = result.choices[0].message.content;

          const newMaterial = {
            id: 'mat-' + Date.now(),
            section: section === 'MIX' ? 'STRUCTURE' : section,
            skillCode: `SKILL AI`,
            title: topic,
            category: section,
            summary: `Modul materi khusus hasil generasi AI siaptuan_premium mengenai ${topic}.`,
            content: generatedHtml,
            priority: 'High',
            status: 'in_progress',
            savedQuestions: []
          };

          appState.materials.unshift(newMaterial);
          localStorage.setItem('toefl_materials', JSON.stringify(appState.materials));

          closeAIModal();
          renderMateriCards();
          navigateTo('materi');
          openMaterialReader(newMaterial.id);
          Swal.fire('Sukses!', 'Modul materi baru berhasil digenerate dan disimpan ke pustaka.', 'success');
        }
      } catch (err) {
        console.error('AI Error:', err);
        loadingIndicator.classList.add('hidden');
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghubungi AI',
          text: `Detail error: ${err.message}. Pastikan koneksi internet aktif atau cek API key di Pengaturan.`
        });
      }
    }

    function openAITutorForQuestion(questionId) {
      if (!appState.activeReviewData) return;
      const q = appState.activeReviewData.questions.find(item => item.id === questionId);
      if (!q) return;

      appState.activeAITutorQuestion = q;
      document.getElementById('aiTutorQuestionTitle').innerText = `Soal #${q.id} (${q.section})`;
      document.getElementById('aiTutorQuestionSnippet').innerHTML = `
        <b>Pertanyaan:</b> ${q.questionText}<br/>
        <b>Kunci Benar:</b> ${q.correctAnswer}. ${q.options[['A','B','C','D'].indexOf(q.correctAnswer)]}<br/>
        <b>Jawaban Anda:</b> ${appState.activeReviewData.userAnswers[q.id] || 'Belum dijawab'}
      `;

      document.getElementById('aiTutorAnswerBox').innerHTML = `
        Halo! Saya Guru AI TOEFL Anda. Silakan tanyakan apapun mengenai soal ini, alasan pilihan salah, trik cepat, atau minta contoh kalimat serupa!
      `;

      document.getElementById('aiTutorModal').classList.remove('hidden');
    }

    function closeAITutorModal() {
      document.getElementById('aiTutorModal').classList.add('hidden');
    }

    function setAITutorPrompt(text) {
      document.getElementById('aiTutorCustomPrompt').value = text;
      submitAITutorQuery();
    }

    async function submitAITutorQuery() {
      const q = appState.activeAITutorQuestion;
      if (!q) return;

      const userPrompt = document.getElementById('aiTutorCustomPrompt').value.trim();
      if (!userPrompt) return;

      const answerBox = document.getElementById('aiTutorAnswerBox');
      const sendBtn = document.getElementById('aiTutorSendBtn');

      answerBox.innerHTML = '<div class="flex items-center space-x-2 text-stone-700"><i class="fa-solid fa-spinner fa-spin"></i> <span>Guru AI sedang menyusun penjelasan...</span></div>';
      sendBtn.disabled = true;

      const baseUrl = appState.apiConfig.baseUrl.replace(/\/$/, '');
      const apiKey = appState.apiConfig.apiKey;
      const model = appState.apiConfig.model;

      try {
        const fullPrompt = `
          Konteks Soal TOEFL ITP:
          Section: ${q.section} (${q.skill})
          Naskah / Konteks: ${q.passageOrAudioScript || 'Tidak ada'}
          Pertanyaan: ${q.questionText}
          Pilihan: ${JSON.stringify(q.options)}
          Kunci Jawaban: ${q.correctAnswer}
          Jawaban Siswa: ${appState.activeReviewData.userAnswers[q.id] || 'Tidak dijawab'}
          
          Pertanyaan Spesifik dari Siswa:
          "${userPrompt}"

          Jawablah sebagai Guru AI TOEFL yang ramah, jelas, terstruktur, dan berikan tips praktis berbahasa Indonesia.
        `;

        const response = await aiChatFetch({
            model: model,
            messages: [
              { role: 'system', content: 'You are a warm, encouraging, and razor-sharp TOEFL ITP private tutor.' },
              { role: 'user', content: fullPrompt }
            ],
            temperature: 0.7
          });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        const reply = result.choices[0].message.content;

        answerBox.innerHTML = `
          <div class="space-y-2">
            <div class="font-bold text-indigo-900 border-b border-amber-300 pb-1">Jawaban Guru AI:</div>
            <div class="whitespace-pre-wrap">${reply}</div>
          </div>
        `;
      } catch (err) {
        answerBox.innerHTML = `<span class="text-rose-700 font-bold">Gagal terhubung dengan Guru AI: ${err.message}</span>`;
      } finally {
        sendBtn.disabled = false;
      }
    }

    function saveApiSettings() {
      const baseUrl = document.getElementById('settingApiBaseUrl').value.trim();
      const apiKey = document.getElementById('settingApiKey').value.trim();
      const model = document.getElementById('settingApiModel').value.trim();

      if (!baseUrl || !apiKey || !model) {
        Swal.fire('Peringatan', 'Semua field API wajib diisi.', 'warning');
        return;
      }

      appState.apiConfig = { baseUrl, apiKey, model };
      localStorage.setItem('toefl_api_config', JSON.stringify(appState.apiConfig));
      Swal.fire('Tersimpan', 'Konfigurasi API berhasil diperbarui!', 'success');
    }

    async function testApiConnection() {
      const baseUrl = document.getElementById('settingApiBaseUrl').value.trim().replace(/\/$/, '');
      const apiKey = document.getElementById('settingApiKey').value.trim();
      const model = document.getElementById('settingApiModel').value.trim();

      Swal.fire({
        title: 'Menguji Koneksi API...',
        text: 'Mengirim ping ke endpoint siaptuan_premium...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        const response = await aiChatFetch({
            model: model,
            messages: [{ role: 'user', content: 'Ping. Respond with "PONG".' }],
            max_tokens: 10
          });

        if (response.ok) {
          const res = await response.json();
          Swal.fire('Koneksi Berhasil! ✅', `Terhubung ke model: ${model} (${res.choices[0].message.content.trim()})`, 'success');
        } else {
          throw new Error(`Status ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        Swal.fire('Koneksi Gagal ❌', `Tidak dapat menghubungi API: ${err.message}`, 'error');
      }
    }

    function toggleApiKeyVisibility() {
      const input = document.getElementById('settingApiKey');
      const icon = document.getElementById('apiKeyEyeIcon');
      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
      } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
      }
    }

    function saveUserProfile() {
      const name = document.getElementById('settingUserName').value.trim();
      const initial = document.getElementById('settingUserInitial').value.trim().toUpperCase() || 'DP';
      const email = document.getElementById('settingUserEmail').value.trim();
      const targetScore = document.getElementById('settingTargetScore').value;

      appState.user.name = name;
      appState.user.initial = initial;
      appState.user.email = email;
      appState.user.targetScore = targetScore;

      localStorage.setItem('toefl_user_profile', JSON.stringify(appState.user));
      syncUserProfileUI();
      Swal.fire('Berhasil', 'Profil pengguna telah diperbarui!', 'success');
    }

    function handleLogoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const base64 = e.target.result;
        appState.user.logoBase64 = base64;
        localStorage.setItem('toefl_user_profile', JSON.stringify(appState.user));
        document.getElementById('headerLogoContainer').innerHTML = `<img src="${base64}" class="w-full h-full object-cover rounded-lg" alt="Logo" />`;
        Swal.fire('Sukses', 'Logo kustom berhasil diunggah dan disimpan.', 'success');
      };
      reader.readAsDataURL(file);
    }

    function applyThemePreset(preset) {
      if (preset === 'parchment') {
        setThemeVariables('#fef3c7', '#57534e', '#fbf8f1');
      } else if (preset === 'classic') {
        setThemeVariables('#e2e8f0', '#334155', '#ffffff');
      } else if (preset === 'kraft') {
        setThemeVariables('#fed7aa', '#451a03', '#f7eedd');
      } else if (preset === 'blueprint') {
        setThemeVariables('#bae6fd', '#0c4a6e', '#f0f9ff');
      }
    }

    function setThemeVariables(primary, secondary, bg) {
      document.documentElement.style.setProperty('--color-primary', primary);
      document.documentElement.style.setProperty('--color-accent', secondary);
      document.documentElement.style.setProperty('--paper-bg', bg);

      document.getElementById('themePrimaryPicker').value = primary;
      document.getElementById('themePrimaryText').value = primary;
      document.getElementById('themeSecondaryPicker').value = secondary;
      document.getElementById('themeSecondaryText').value = secondary;
      document.getElementById('themeBgPicker').value = bg;
      document.getElementById('themeBgText').value = bg;

      localStorage.setItem('toefl_theme', JSON.stringify({ primary, secondary, bg }));
    }

    function updateCustomColors() {
      const primary = document.getElementById('themePrimaryPicker').value;
      const secondary = document.getElementById('themeSecondaryPicker').value;
      const bg = document.getElementById('themeBgPicker').value;
      setThemeVariables(primary, secondary, bg);
    }

    function loadSavedTheme() {
      const saved = localStorage.getItem('toefl_theme');
      if (saved) {
        try {
          const t = JSON.parse(saved);
          setThemeVariables(t.primary, t.secondary, t.bg);
        } catch(e){}
      }
    }

    function handleGlobalSearch(e) {
      if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (!query) return;
        navigateTo('materi');
        const searchInput = document.getElementById('materiSearchInput');
        if (searchInput) {
          searchInput.value = query;
          renderMateriCards();
        }
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      initStorage();
      loadSavedTheme();
      navigateTo('dashboard');
    });
  </script>
</body>
</html>

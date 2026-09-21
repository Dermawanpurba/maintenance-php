<x-filament-panels::page>
    @php
        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        $planning = $this->planningData;
        $metrics = $planning['metrics'];
        $filteredConsolidated = $this->filteredConsolidated;
        $displayUnitPlans = $this->displayUnitPlans;
    @endphp

    <div class="space-y-6">
        {{-- 1. PERIOD SELECTOR & ACTION BAR --}}
        <div class="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Periode Plan:</span>
                    <select wire:model.live="selectedMonth" class="text-sm font-semibold rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-1.5 px-3 focus:ring-amber-500">
                        @foreach ($monthNames as $num => $name)
                            <option value="{{ $num }}">{{ $name }}</option>
                        @endforeach
                    </select>
                    <select wire:model.live="selectedYear" class="text-sm font-semibold rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-1.5 px-3 focus:ring-amber-500">
                        @foreach ([2024, 2025, 2026, 2027] as $y)
                            <option value="{{ $y }}">{{ $y }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Target Jam Operasi: <strong>{{ count($planning['unitPlans']) }} Unit</strong></span>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    wire:click="exportCsv"
                    class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Ekspor CSV / Excel</span>
                </button>

                <button
                    type="button"
                    onclick="window.print()"
                    class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 transition"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    <span>Cetak Matrix</span>
                </button>
            </div>
        </div>

        {{-- 2. 5 METRIC SUMMARY CARDS --}}
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            {{-- Total Oli --}}
            <div class="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 shadow-sm">
                <span class="text-xs font-semibold text-blue-700 dark:text-blue-300">Total Pelumas / Oli</span>
                <div class="mt-2 flex items-baseline gap-1">
                    <span class="text-2xl font-black text-gray-900 dark:text-white">{{ number_format($metrics['totalOilsLiter'], 0, ',', '.') }}</span>
                    <span class="text-xs font-medium text-gray-500">Liter</span>
                </div>
                <p class="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-semibold">
                    ≈ {{ $metrics['totalOilsDrum'] }} Drum (200L)
                </p>
            </div>

            {{-- Total Filter --}}
            <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-sm">
                <span class="text-xs font-semibold text-amber-700 dark:text-amber-300">Kebutuhan Filter</span>
                <div class="mt-2 flex items-baseline gap-1">
                    <span class="text-2xl font-black text-gray-900 dark:text-white">{{ number_format($metrics['totalFiltersPcs'], 0, ',', '.') }}</span>
                    <span class="text-xs font-medium text-gray-500">Pieces</span>
                </div>
                <p class="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">
                    Oli, Solar, Udara, Hidrolik
                </p>
            </div>

            {{-- Botol SOS --}}
            <div class="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 shadow-sm">
                <span class="text-xs font-semibold text-purple-700 dark:text-purple-300">Botol Sampling SOS</span>
                <div class="mt-2 flex items-baseline gap-1">
                    <span class="text-2xl font-black text-gray-900 dark:text-white">{{ number_format($metrics['totalSOSBottles'], 0, ',', '.') }}</span>
                    <span class="text-xs font-medium text-gray-500">Botol</span>
                </div>
                <p class="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-semibold">
                    Lab Monitoring Pelumas
                </p>
            </div>

            {{-- Event Servis --}}
            <div class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Event Servis Terjadwal</span>
                <div class="mt-2 flex items-baseline gap-1">
                    <span class="text-2xl font-black text-gray-900 dark:text-white">{{ $metrics['totalPmEvents'] }}</span>
                    <span class="text-xs font-medium text-gray-500">PM Event</span>
                </div>
                <p class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                    Pada {{ $metrics['totalUnitsServiced'] }} Unit Pit
                </p>
            </div>

            {{-- Estimasi Biaya --}}
            <div class="col-span-2 md:col-span-1 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm">
                <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Est. Total Biaya Part</span>
                <div class="mt-2 flex items-baseline gap-1">
                    <span class="text-lg font-black text-gray-900 dark:text-white">Rp {{ number_format($metrics['totalEstimatedCost'], 0, ',', '.') }}</span>
                </div>
                <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    Anggaran kebutuhan plan
                </p>
            </div>
        </div>

        {{-- 3. ACTIVE UNIT ALLOCATION BANNER --}}
        @if ($selectedUnitFilter)
            <div class="p-4 bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-400 dark:border-blue-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div class="flex items-center gap-3">
                    <div class="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="text-xs font-black uppercase text-blue-900 dark:text-blue-200 tracking-wider">
                                Alokasi Unit Terjadwal Terpilih:
                            </span>
                            <span class="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-mono font-black text-xs shadow-sm">
                                {{ $selectedUnitFilter }}
                            </span>
                        </div>
                        <p class="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                            Menampilkan suku cadang & pelumas yang dialokasikan untuk unit <strong>{{ $selectedUnitFilter }}</strong> pada periode {{ $monthNames[$selectedMonth] ?? '' }} {{ $selectedYear }}.
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2 self-end sm:self-center">
                    <button
                        type="button"
                        wire:click="switchTab('per_unit')"
                        class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                    >
                        Lihat BOM Servis Unit
                    </button>
                    <button
                        type="button"
                        wire:click="resetUnitFilter"
                        class="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold transition"
                    >
                        ✕ Reset Filter Unit
                    </button>
                </div>
            </div>
        @endif

        {{-- 4. NAVIGATION TABS BAR --}}
        <div class="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3 overflow-x-auto">
            <button
                type="button"
                wire:click="switchTab('konsolidasi')"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition {{ $activeTab === 'konsolidasi' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 border border-gray-200 dark:border-gray-800' }}"
            >
                <span>Kebutuhan Part Konsolidasi (MRP)</span>
                <span class="text-xs px-2 py-0.5 rounded-full {{ $activeTab === 'konsolidasi' ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600' }}">
                    {{ count($filteredConsolidated) }} Part
                </span>
            </button>

            <button
                type="button"
                wire:click="switchTab('per_unit')"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition {{ $activeTab === 'per_unit' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 border border-gray-200 dark:border-gray-800' }}"
            >
                <span>Rincian Servis Per Unit Armada</span>
                <span class="text-xs px-2 py-0.5 rounded-full {{ $activeTab === 'per_unit' ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600' }}">
                    {{ count($planning['unitPlans']) }} Unit
                </span>
            </button>

            <button
                type="button"
                wire:click="switchTab('fluida_filter')"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition {{ $activeTab === 'fluida_filter' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 border border-gray-200 dark:border-gray-800' }}"
            >
                <span>Analisis Fluida & Filter (Drum/Pail)</span>
            </button>
        </div>

        {{-- 5. TAB 1: KEBUTUHAN PART KONSOLIDASI (MRP BULANAN) --}}
        @if ($activeTab === 'konsolidasi')
            <div class="space-y-4">
                {{-- Search & Filters --}}
                <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div class="relative flex-1 max-w-md">
                        <input
                            type="text"
                            wire:model.live.debounce.300ms="searchQuery"
                            placeholder="Cari nama part, nomor part, atau nomor unit..."
                            class="w-full text-sm rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2 px-3 focus:ring-amber-500"
                        />
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <select wire:model.live="categoryFilter" class="text-xs font-semibold rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-1.5 px-3">
                            <option value="ALL">Semua Kategori</option>
                            <option value="Lubricant & Oil">Lubricant & Oil</option>
                            <option value="Filter">Filter</option>
                            <option value="General">General / Other</option>
                        </select>

                        <select wire:model.live="stockFilter" class="text-xs font-semibold rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-1.5 px-3">
                            <option value="ALL">Semua Status Gudang</option>
                            <option value="SHORTAGE">🔴 Defisit / Perlu Order</option>
                            <option value="READY">🟢 Stok Aman / Cukup</option>
                        </select>
                    </div>
                </div>

                {{-- Table --}}
                <div class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr class="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-black uppercase tracking-wider">
                                    <th class="px-3 py-3 border-r border-gray-300 dark:border-gray-700 w-12 text-center">NO</th>
                                    <th class="px-4 py-3 border-r border-gray-300 dark:border-gray-700 min-w-[200px]">NAMA SUKU CADANG</th>
                                    <th class="px-4 py-3 border-r border-gray-300 dark:border-gray-700 min-w-[150px]">NOMOR PART / SPEK</th>
                                    <th class="px-3 py-3 border-r border-gray-300 dark:border-gray-700 min-w-[120px]">KATEGORI</th>
                                    <th class="px-3 py-3 border-r border-gray-300 dark:border-gray-700 text-center w-28 bg-blue-50/70 dark:bg-blue-950/40 font-bold text-blue-900 dark:text-blue-200">KEBUTUHAN PLAN</th>
                                    <th class="px-3 py-3 border-r border-gray-300 dark:border-gray-700 text-center w-28">STOK GUDANG</th>
                                    <th class="px-3 py-3 border-r border-gray-300 dark:border-gray-700 text-center w-28 text-rose-700 dark:text-rose-300">KEKURANGAN</th>
                                    <th class="px-3 py-3 border-r border-gray-300 dark:border-gray-700 text-center w-32">STATUS KESIAPAN</th>
                                    <th class="px-4 py-3 min-w-[220px]">ALOKASI UNIT TERJADWAL</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700 font-sans">
                                @forelse ($filteredConsolidated as $idx => $part)
                                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                                        <td class="px-3 py-2.5 border-r border-gray-200 dark:border-gray-700 text-center text-gray-500">{{ $idx + 1 }}</td>
                                        <td class="px-4 py-2.5 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-900 dark:text-white uppercase">{{ $part['part_name'] }}</td>
                                        <td class="px-4 py-2.5 border-r border-gray-200 dark:border-gray-700 font-mono font-semibold text-gray-800 dark:text-gray-200">{{ $part['part_number'] }}</td>
                                        <td class="px-3 py-2.5 border-r border-gray-200 dark:border-gray-700">
                                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                {{ $part['category'] }}
                                            </span>
                                        </td>
                                        <td class="px-3 py-2.5 border-r border-gray-200 dark:border-gray-700 text-center font-black text-sm text-blue-700 dark:text-blue-300 bg-blue-50/40 dark:bg-blue-950/20">
                                            {{ number_format($part['total_qty'], 0, ',', '.') }} <span class="text-[10px] font-normal text-gray-500">{{ $part['uom'] }}</span>
                                        </td>
                                        <td class="px-3 py-2.5 border-r border-gray-200 dark:border-gray-700 text-center font-semibold text-gray-800 dark:text-gray-200">
                                            {{ number_format($part['stock_qty'], 0, ',', '.') }} <span class="text-[10px] font-normal text-gray-400">{{ $part['uom'] }}</span>
                                        </td>
                                        <td class="px-3 py-2.5 border-r border-gray-200 dark:border-gray-700 text-center font-bold">
                                            @if ($part['shortage'] > 0)
                                                <span class="text-rose-600 dark:text-rose-400 font-black">
                                                    -{{ number_format($part['shortage'], 0, ',', '.') }} {{ $part['uom'] }}
                                                </span>
                                            @else
                                                <span class="text-emerald-600 dark:text-emerald-400 font-medium">Cukup</span>
                                            @endif
                                        </td>
                                        <td class="px-3 py-2.5 border-r border-gray-200 dark:border-gray-700 text-center">
                                            @if ($part['is_stock_sufficient'])
                                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                                                    ✓ STOK AMAN
                                                </span>
                                            @else
                                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                                                    ⚠ PERLU ORDER
                                                </span>
                                            @endif
                                        </td>
                                        {{-- Interactive Unit Allocation Badges --}}
                                        <td class="px-4 py-2.5">
                                            <div class="flex flex-wrap gap-1">
                                                @foreach ($part['units_allocated'] as $u)
                                                    @php
                                                        $isSelected = $selectedUnitFilter && strtoupper(trim($u['equip_no'])) === strtoupper(trim($selectedUnitFilter));
                                                    @endphp
                                                    <button
                                                        type="button"
                                                        wire:click="filterByUnit('{{ $u['equip_no'] }}')"
                                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono transition cursor-pointer {{ $isSelected ? 'bg-blue-600 text-white font-black ring-2 ring-blue-400 shadow-sm' : 'bg-gray-100 hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-blue-950 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:text-blue-700' }}"
                                                        title="Klik untuk memfilter atau fokus ke unit {{ $u['equip_no'] }} ({{ $u['model'] }})"
                                                    >
                                                        <strong>{{ $u['equip_no'] }}</strong>
                                                        <span class="opacity-80">({{ $u['pm_type'] }}: {{ $u['qty'] }})</span>
                                                    </button>
                                                @endforeach
                                            </div>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="9" class="px-6 py-12 text-center text-gray-400">
                                            Tidak ada kebutuhan part service yang cocok pada periode ini.
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        @endif

        {{-- 6. TAB 2: RINCIAN SERVIS PER UNIT ARMADA --}}
        @if ($activeTab === 'per_unit')
            <div class="space-y-3">
                @forelse ($displayUnitPlans as $unit)
                    @php
                        $isSelected = $selectedUnitFilter && strtoupper(trim($unit['equip_no'])) === strtoupper(trim($selectedUnitFilter));
                        $isExpanded = $isSelected || ($expandedUnit === $unit['equip_no']);
                    @endphp

                    <div class="bg-white dark:bg-gray-900 border rounded-2xl p-4 shadow-sm transition {{ $isSelected ? 'border-2 border-blue-500 ring-4 ring-blue-400/20 bg-blue-50/10 dark:bg-blue-950/25 shadow-md' : 'border-gray-200 dark:border-gray-800' }}">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div class="flex items-center gap-3">
                                <button
                                    type="button"
                                    wire:click="toggleExpandUnit('{{ $unit['equip_no'] }}')"
                                    class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 cursor-pointer"
                                >
                                    @if ($isExpanded)
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    @else
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                                    @endif
                                </button>

                                <div>
                                    <div class="flex flex-wrap items-center gap-2">
                                        <span class="text-base font-black text-gray-900 dark:text-white font-mono">{{ $unit['equip_no'] }}</span>
                                        @if ($isSelected)
                                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                                                ✓ ALOKASI TERPILIH
                                            </span>
                                        @endif
                                        <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                            {{ $unit['section'] }}
                                        </span>
                                        <span class="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                            {{ $unit['model'] }}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span>HM Awal: <strong>{{ number_format($unit['est_hm'], 0, ',', '.') }}</strong></span>
                                        @if ($unit['next_service_hours_due'])
                                            <span>•</span>
                                            <span>Target HM Servis: <strong>{{ number_format($unit['next_service_hours_due'], 0, ',', '.') }}</strong></span>
                                        @endif
                                        @if ($unit['next_service_date'])
                                            <span>•</span>
                                            <span>Est. Tanggal: <strong>{{ $unit['next_service_date'] }}</strong></span>
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                @foreach ($unit['pm_events'] as $ev)
                                    <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                                        {{ $ev['interval'] }} ({{ $ev['count'] }}x)
                                    </span>
                                @endforeach
                            </div>
                        </div>

                        {{-- BOM Checklist Details --}}
                        @if ($isExpanded)
                            <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <h4 class="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                                    Daftar Bill of Materials (BOM) Suku Cadang & Pelumas untuk {{ $unit['equip_no'] }}:
                                </h4>

                                <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <table class="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold border-b border-gray-200 dark:border-gray-700">
                                                <th class="py-2 px-3">INTERVAL</th>
                                                <th class="py-2 px-3">NAMA SUKU CADANG / OLI</th>
                                                <th class="py-2 px-3">NOMOR PART / SPEK</th>
                                                <th class="py-2 px-3">KATEGORI</th>
                                                <th class="py-2 px-3 text-right">JUMLAH KEBUTUHAN</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                                            @foreach ($unit['pm_events'] as $ev)
                                                @foreach ($ev['parts'] as $p)
                                                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <td class="py-2 px-3 font-semibold text-amber-700 dark:text-amber-300">{{ $ev['interval'] }}</td>
                                                        <td class="py-2 px-3 font-bold text-gray-900 dark:text-white uppercase">{{ $p['part_name'] }}</td>
                                                        <td class="py-2 px-3 font-mono text-gray-600 dark:text-gray-300">{{ $p['part_number'] }}</td>
                                                        <td class="py-2 px-3 text-gray-500">{{ $p['category'] }}</td>
                                                        <td class="py-2 px-3 text-right font-black text-blue-700 dark:text-blue-300">
                                                            {{ number_format($p['qty'], 0, ',', '.') }} {{ $p['uom'] }}
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        @endif
                    </div>
                @empty
                    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center text-gray-400">
                        Tidak ada armada yang terjadwal servis pada periode ini.
                    </div>
                @endforelse
            </div>
        @endif

        {{-- 7. TAB 3: ANALISIS FLUIDA & FILTER --}}
        @if ($activeTab === 'fluida_filter')
            @php
                $fluids = array_filter($planning['consolidated'], fn($p) => strtolower($p['uom']) === 'ltr' || str_contains(strtolower($p['category']), 'oil'));
                $filters = array_filter($planning['consolidated'], fn($p) => str_contains(strtolower($p['category']), 'filter') || str_contains(strtolower($p['part_name']), 'filter'));
            @endphp

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {{-- Fluida Logistics Card --}}
                <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Logistik Pelumas & Fluida (Kemasan Drum & Pail)</span>
                    </h3>

                    <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold border-b border-gray-200 dark:border-gray-700">
                                    <th class="py-2 px-3">JENIS PELUMAS</th>
                                    <th class="py-2 px-3 text-center">TOTAL LITER</th>
                                    <th class="py-2 px-3 text-center">DRUM (200L)</th>
                                    <th class="py-2 px-3 text-center">PAIL (20L)</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                                @forelse ($fluids as $f)
                                    <tr>
                                        <td class="py-2 px-3 font-semibold text-gray-900 dark:text-white">{{ $f['part_name'] }}</td>
                                        <td class="py-2 px-3 text-center font-black text-blue-600">{{ number_format($f['total_qty'], 0, ',', '.') }} L</td>
                                        <td class="py-2 px-3 text-center font-bold text-amber-600">{{ round($f['total_qty'] / 200, 1) }}</td>
                                        <td class="py-2 px-3 text-center text-gray-500">{{ ceil($f['total_qty'] / 20) }}</td>
                                    </tr>
                                @empty
                                    <tr><td colspan="4" class="py-4 text-center text-gray-400">Tidak ada fluida terjadwal.</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>

                {{-- Filter Elements Card --}}
                <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Monitoring Kesiapan Filter Element</span>
                    </h3>

                    <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                        <table class="w-full text-left text-xs">
                            <thead>
                                <tr class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold border-b border-gray-200 dark:border-gray-700">
                                    <th class="py-2 px-3">NAMA FILTER</th>
                                    <th class="py-2 px-3 text-center">KEBUTUHAN</th>
                                    <th class="py-2 px-3 text-center">STOK GUDANG</th>
                                    <th class="py-2 px-3 text-center">STATUS</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                                @forelse ($filters as $fl)
                                    <tr>
                                        <td class="py-2 px-3 font-semibold text-gray-900 dark:text-white">{{ $fl['part_name'] }}</td>
                                        <td class="py-2 px-3 text-center font-black text-blue-600">{{ $fl['total_qty'] }} PC</td>
                                        <td class="py-2 px-3 text-center font-semibold text-gray-700 dark:text-gray-300">{{ $fl['stock_qty'] }} PC</td>
                                        <td class="py-2 px-3 text-center">
                                            @if ($fl['is_stock_sufficient'])
                                                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">AMAN</span>
                                            @else
                                                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">DEFISIT</span>
                                            @endif
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="4" class="py-4 text-center text-gray-400">Tidak ada filter terjadwal.</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        @endif
    </div>
</x-filament-panels::page>

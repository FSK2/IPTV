// ScriptSense AI - Blockbuster Hollywood Intelligence Engine

document.addEventListener("DOMContentLoaded", () => {
    restoreScriptFromLocalStorage();
    updateLineNumbers();
    runScriptAnalysis(true);
    setupUnsavedChangesWarning();
    checkUserSession();
});

// Restore saved screenplay from browser storage on refresh
function restoreScriptFromLocalStorage() {
    const textarea = document.getElementById("scriptTextarea");
    const saved = localStorage.getItem("scriptsense_saved_script");
    if (textarea && saved && saved.trim().length > 0) {
        textarea.value = saved;
    }
}

// Auto-save script content to localStorage
function saveScriptToLocalStorage() {
    const textarea = document.getElementById("scriptTextarea");
    if (textarea) {
        localStorage.setItem("scriptsense_saved_script", textarea.value);
    }
}

// Warn user before refreshing or leaving page if script content exists
function setupUnsavedChangesWarning() {
    window.addEventListener("beforeunload", (event) => {
        const textarea = document.getElementById("scriptTextarea");
        if (textarea && textarea.value.trim().length > 0) {
            event.preventDefault();
            event.returnValue = "You have unsaved scene content in your editor. Are you sure you want to leave?";
            return event.returnValue;
        }
    });
}

// Manual Save & Formatted PDF Export Handler
function saveScriptFile() {
    const textarea = document.getElementById("scriptTextarea");
    if (!textarea || textarea.value.trim().length === 0) {
        showToast("⚠️ Screenplay is empty. Add scenes before saving as PDF.");
        return;
    }

    saveScriptToLocalStorage();

    // Create styled container mimicking a 12pt Courier Hollywood screenplay
    const container = document.createElement("div");
    container.style.padding = "45px 50px";
    container.style.backgroundColor = "#ffffff";
    container.style.color = "#000000";
    container.style.fontFamily = "'Courier New', Courier, monospace";
    container.style.fontSize = "12pt";
    container.style.lineHeight = "1.5";
    container.style.maxWidth = "800px";

    // Title / Header
    const header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.fontWeight = "bold";
    header.style.fontSize = "14pt";
    header.style.marginBottom = "30px";
    header.style.textTransform = "uppercase";
    header.style.letterSpacing = "2px";
    header.style.borderBottom = "2px solid #000000";
    header.style.paddingBottom = "10px";
    header.textContent = "SCRIPTSENSE AI — MASTER SCREENPLAY";
    container.appendChild(header);

    const lines = textarea.value.split("\n");
    const contentBody = document.createElement("div");

    lines.forEach(line => {
        const lineEl = document.createElement("div");
        const trimmed = line.trim();

        if (trimmed.length === 0) {
            lineEl.style.height = "14px";
        } else if (/^(INT\.|EXT\.|INT\/EXT\.)/i.test(trimmed)) {
            // Scene Heading
            lineEl.style.fontWeight = "bold";
            lineEl.style.marginTop = "20px";
            lineEl.style.marginBottom = "8px";
            lineEl.style.textTransform = "uppercase";
            lineEl.textContent = trimmed;
        } else if (/^[A-Z]{2,}(?:\s[A-Z]{2,})?$/.test(trimmed)) {
            // Character Name (Centered)
            lineEl.style.textAlign = "center";
            lineEl.style.fontWeight = "bold";
            lineEl.style.marginTop = "14px";
            lineEl.style.marginBottom = "2px";
            lineEl.textContent = trimmed;
        } else if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
            // Parenthetical
            lineEl.style.textAlign = "center";
            lineEl.style.fontStyle = "italic";
            lineEl.textContent = trimmed;
        } else if (line.startsWith("\t") || line.startsWith("  ")) {
            // Dialogue
            lineEl.style.marginLeft = "auto";
            lineEl.style.marginRight = "auto";
            lineEl.style.maxWidth = "420px";
            lineEl.style.marginBottom = "6px";
            lineEl.textContent = trimmed;
        } else {
            // Action / Description
            lineEl.style.marginBottom = "10px";
            lineEl.textContent = line;
        }

        contentBody.appendChild(lineEl);
    });

    container.appendChild(contentBody);

    const opt = {
        margin:       0.5,
        filename:     'Master_Screenplay.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    showToast("✦ Generating Screenplay PDF...");

    if (window.html2pdf) {
        html2pdf().set(opt).from(container).save().then(() => {
            showToast("✦ Screenplay Saved & Downloaded (Master_Screenplay.pdf)");
        }).catch(err => {
            console.error("html2pdf error:", err);
            fallbackPrintPDF(container);
        });
    } else {
        fallbackPrintPDF(container);
    }
}

function fallbackPrintPDF(container) {
    const win = window.open('', '_blank');
    if (win) {
        win.document.write(`
            <html>
            <head>
                <title>Master_Screenplay.pdf</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 40px; color: black; background: white; }
                    @page { margin: 1in; }
                </style>
            </head>
            <body>${container.innerHTML}</body>
            </html>
        `);
        win.document.close();
        win.focus();
        win.print();
        showToast("✦ Screenplay Opened in PDF Print Dialog");
    }
}

// Update Line Numbers Gutter dynamically as screenplay text changes
function handleScriptInput() {
    updateLineNumbers();
    runScriptAnalysis(true);
    saveScriptToLocalStorage();
}

function updateLineNumbers() {
    const textarea = document.getElementById("scriptTextarea");
    const gutter = document.getElementById("lineNumbersGutter");
    const display = document.getElementById("lineCountDisplay");

    if (!textarea || !gutter) return;

    const lines = textarea.value.split("\n");
    const lineCount = textarea.value.length === 0 ? 0 : lines.length;

    let numbersHtml = "";
    for (let i = 1; i <= Math.max(1, lineCount); i++) {
        numbersHtml += `<div>${i}</div>`;
    }
    gutter.innerHTML = numbersHtml;

    if (display) {
        display.textContent = `${lineCount} ${lineCount === 1 ? 'Line' : 'Lines'}`;
    }
}

// Clear Script Canvas
function clearScriptCanvas() {
    const textarea = document.getElementById("scriptTextarea");
    if (textarea) {
        textarea.value = "";
        localStorage.removeItem("scriptsense_saved_script");
        updateLineNumbers();
        runScriptAnalysis(true);
        showToast("Script canvas cleared. Clean startup state ready.");
    }
}

// Quick Sample Script Loader (For Competition Demonstration)
function loadSampleScript() {
    const sample = `INT. COFFEE SHOP - DAY

JOHN (30s, nervous) sits at a corner table, checking his watch repeatedly. The shop is busy with morning customers.

SARAH (28, confident, sharp suit) walks in, spots John, and approaches with purpose.

SARAH
You're late.

JOHN
Sorry, traffic was crazy. I brought the documents.

John slides a manila folder across the table. Sarah flips through pages quickly.

SARAH
(flipping through)
This is everything?

JOHN
Everything. Bank records, emails, the whole operation.

Sarah looks up, serious.

SARAH
Do you understand what this means?

JOHN
I understand. Once this goes public, there's no going back.

Sarah closes the folder and glances around the coffee shop cautiously.

SARAH
We need to move fast. They'll know by tomorrow.

JOHN
Then we leak it tonight.

Sarah nods slowly, then stands up.

SARAH
Meet me at the usual place. Midnight. Don't be late this time.

She walks out. John sits alone, staring at his coffee, hands shaking slightly.

EXT. ROOFTOP ALLEY - NIGHT

SARAH meets MARCUS under the flashing neon sign.

MARCUS
Did John deliver the files?

SARAH
He thinks he's in control. The leak happens tonight.`;

    const textarea = document.getElementById("scriptTextarea");
    if (textarea) {
        textarea.value = sample;
        updateLineNumbers();
        runScriptAnalysis(false);
        showToast("✦ Loaded Sample Screenplay: 2 Scenes, 3 Characters!");
    }
}

// Hollywood Dynamic Script Parser & AI Engine
function runScriptAnalysis(isSilent = false) {
    const textarea = document.getElementById("scriptTextarea");
    if (!textarea) return;

    const rawText = textarea.value;
    const lines = rawText.split("\n");
    const isBlank = rawText.trim().length === 0;

    // 1. Dynamic Character Detection (Find uppercase character names)
    const characterCounts = {};
    const excludeKeywords = new Set(["INT", "EXT", "DAY", "NIGHT", "FADE", "CUT", "SCENE", "CONTINUED", "ANGLE", "CLOSE", "VIEW"]);

    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        // Character lines are uppercase words without punctuation (e.g. SARAH or JOHN (30s))
        const cleanName = trimmed.replace(/\(.*\)/, "").trim();
        if (/^[A-Z]{2,}(?:\s[A-Z]{2,})?$/.test(cleanName) && !excludeKeywords.has(cleanName)) {
            // Check if followed by dialogue in next line
            if (idx + 1 < lines.length && lines[idx + 1].trim().length > 0) {
                characterCounts[cleanName] = (characterCounts[cleanName] || 0) + 1;
            }
        }
    });

    renderDynamicCharacters(characterCounts);

    // 2. Dynamic Scene Headings Parser
    const sceneRegex = /^(INT\.|EXT\.|INT\/EXT\.)\s+([^-]+)(?:-\s*(DAY|NIGHT|EVENING|MORNING|CONTINUOUS|LATER|DUSK|DAWN))?/i;
    const scenes = [];

    lines.forEach((line, idx) => {
        const match = line.trim().match(sceneRegex);
        if (match) {
            scenes.push({
                index: scenes.length + 1,
                locationType: match[1].toUpperCase(),
                name: match[2].trim().toUpperCase(),
                timeOfDay: match[3] ? match[3].toUpperCase() : "DAY",
                lineIndex: idx
            });
        }
    });

    renderDynamicScenes(scenes, rawText);

    // 3. Hollywood 5-Tier Budget Engine Calculation
    const budget = calculateHollywoodBudget(scenes, lines.length, Object.keys(characterCounts).length, isBlank);
    const budgetElem = document.getElementById("budgetEstimateVal");
    if (budgetElem) {
        budgetElem.textContent = isBlank ? "$0" : `$${budget.toLocaleString()}`;
    }

    // 4. Update Shooting Schedule Forecast Days
    const forecastDays = isBlank ? 0 : Math.max(1, Math.ceil(lines.length / 12));
    const daysBadge = document.getElementById("forecastDaysBadge");
    if (daysBadge) daysBadge.textContent = `${forecastDays} ${forecastDays === 1 ? 'DAY' : 'DAYS'}`;

    const w1 = Math.min(forecastDays, 6);
    const w2 = Math.min(Math.max(0, forecastDays - 6), 8);
    const w3 = Math.min(Math.max(0, forecastDays - 14), 10);
    const w4 = Math.max(0, forecastDays - 24);

    document.getElementById("w1Days").textContent = `${w1} Days`;
    document.getElementById("w2Days").textContent = `${w2} Days`;
    document.getElementById("w3Days").textContent = `${w3} Days`;
    document.getElementById("w4Days").textContent = `${w4} Days`;

    // 5. Update Scene Breakdown Density Histogram
    renderHistogram(lines.length, scenes.length, isBlank);

    // 6. Update Character Arc SVG Graph
    renderArcGraph(characterCounts, isBlank);

    // 7. Update Daily Production Report (DPR) Sheet Modal
    updateDPRModal(scenes, isBlank ? 0 : budget);

    // 8. Update Dedicated Analytics Command Center Viewport
    syncAnalyticsView();

    if (!isSilent && !isBlank) {
        showToast("✦ AI Analysis Completed: Budget, stripboard & character metrics updated.");
    }
}

// Render Character Ratio Progress Cards
function renderDynamicCharacters(characterCounts) {
    const listContainer = document.getElementById("dynamicCharacterList");
    const countBadge = document.getElementById("totalCharCountBadge");

    const names = Object.keys(characterCounts);
    if (countBadge) countBadge.textContent = `${names.length} ${names.length === 1 ? 'CHARACTER' : 'CHARACTERS'}`;

    if (!listContainer) return;

    if (names.length === 0) {
        listContainer.innerHTML = `
            <div class="p-4 rounded bg-[#0C0E12] border border-noir-border text-center text-gray-500 text-xs">
                No characters detected.<br/>Type ALL CAPS character names (e.g. <code class="text-action-gold">SARAH</code>, <code class="text-cinema-blue">JOHN</code>) before dialogue.
            </div>
        `;
        return;
    }

    const totalLines = names.reduce((sum, name) => sum + characterCounts[name], 0);
    const palette = ['#FFD341', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#F59E0B'];

    listContainer.innerHTML = names.map((name, idx) => {
        const count = characterCounts[name];
        const percent = Math.round((count / totalLines) * 100);
        const color = palette[idx % palette.length];

        return `
            <div class="space-y-1 bg-[#0C0E12] p-3 rounded border border-noir-border">
                <div class="flex justify-between text-white font-mono text-xs">
                    <span class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full" style="background-color: ${color}"></span> ${name}
                    </span>
                    <span class="font-bold" style="color: ${color}">${percent}% (${count} lines)</span>
                </div>
                <div class="w-full bg-noir-container rounded-full h-2 overflow-hidden border border-noir-border">
                    <div class="h-full rounded-full transition-all duration-500" style="width: ${percent}%; background-color: ${color}"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Scene Timeline Cards (Supports Drag-and-Drop, Dropdown Position Selector, and Delete)
function renderDynamicScenes(scenes, rawText) {
    const listContainer = document.getElementById("sceneTimelineList");
    const badge = document.getElementById("sceneCountBadge");
    const stripboardList = document.getElementById("stripboardList");

    if (badge) badge.textContent = `${scenes.length} ${scenes.length === 1 ? 'SCENE' : 'SCENES'} LOADED`;

    if (!listContainer) return;

    if (scenes.length === 0) {
        listContainer.innerHTML = `
            <div class="p-4 rounded bg-[#0C0E12] border border-noir-border text-center text-gray-500 text-xs">
                No scenes detected yet.<br/>Type a scene heading (e.g. <code class="text-action-gold font-mono">INT. COFFEE SHOP - DAY</code>) to populate.
            </div>
        `;
        if (stripboardList) {
            stripboardList.innerHTML = `<div class="p-8 text-center text-gray-500">No stripboard generated yet. Add scene headings to generate schedule strips.</div>`;
        }
        return;
    }

    const getPosOptions = (currentIdx) => {
        let opts = '';
        for (let i = 0; i < scenes.length; i++) {
            const selected = i === currentIdx ? 'selected' : '';
            opts += `<option value="${i}" ${selected}>Pos ${i + 1}</option>`;
        }
        return opts;
    };

    listContainer.innerHTML = scenes.map((sc, idx) => `
        <div draggable="true"
             ondragstart="handleSceneDragStart(event, ${idx})"
             ondragover="handleSceneDragOver(event)"
             ondragleave="handleSceneDragLeave(event)"
             ondrop="handleSceneDrop(event, ${idx})"
             ondragend="handleSceneDragEnd(event)"
             class="scene-drag-card p-3 rounded bg-noir-container border border-action-gold/30 hover:border-action-gold transition-all space-y-1.5 cursor-grab active:cursor-grabbing relative group">

            <div class="flex justify-between items-center text-white font-bold text-xs">
                <span class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-gray-500 text-xs cursor-grab hover:text-white" title="Drag to reorder scene">drag_indicator</span>
                    <span>SCENE ${sc.index}</span>
                </span>
                <div class="flex items-center gap-1">
                    <select onclick="event.stopPropagation()" onchange="moveScene(${idx}, parseInt(this.value, 10))" title="Jump to position" class="bg-[#0C0E12] border border-noir-border rounded px-1.5 py-0.5 text-[10px] text-action-gold focus:outline-none focus:border-action-gold font-mono cursor-pointer">
                        ${getPosOptions(idx)}
                    </select>
                    <button type="button" onclick="event.stopPropagation(); moveScene(${idx}, ${idx - 1});" ${idx === 0 ? 'disabled class="text-gray-600 cursor-not-allowed p-0.5"' : 'class="text-gray-400 hover:text-action-gold p-0.5 transition-colors"'} title="Move Up">
                        <span class="material-symbols-outlined text-xs">arrow_upward</span>
                    </button>
                    <button type="button" onclick="event.stopPropagation(); moveScene(${idx}, ${idx + 1});" ${idx === scenes.length - 1 ? 'disabled class="text-gray-600 cursor-not-allowed p-0.5"' : 'class="text-gray-400 hover:text-action-gold p-0.5 transition-colors"'} title="Move Down">
                        <span class="material-symbols-outlined text-xs">arrow_downward</span>
                    </button>
                    <button type="button" onclick="event.stopPropagation(); confirmDeleteSingleScene(${idx});" title="Delete Scene ${sc.index} (With Warning)" class="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-500/10 ml-0.5">
                        <span class="material-symbols-outlined text-xs">delete</span>
                    </button>
                </div>
            </div>

            <div class="flex justify-between items-center text-[10px] text-gray-400 font-mono pt-1">
                <span class="text-action-gold truncate max-w-[140px]">${sc.locationType} ${sc.name}</span>
                <span class="text-emerald-400 shrink-0">${sc.timeOfDay}</span>
            </div>
        </div>
    `).join('');

    if (stripboardList) {
        stripboardList.innerHTML = scenes.map((sc, idx) => `
            <div draggable="true"
                 ondragstart="handleSceneDragStart(event, ${idx})"
                 ondragover="handleSceneDragOver(event)"
                 ondragleave="handleSceneDragLeave(event)"
                 ondrop="handleSceneDrop(event, ${idx})"
                 ondragend="handleSceneDragEnd(event)"
                 class="scene-drag-card p-3 rounded bg-[#0C0E12] border-l-4 border-l-action-gold border border-noir-border hover:border-action-gold flex justify-between items-center cursor-grab active:cursor-grabbing group transition-all">

                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-gray-500 text-sm cursor-grab hover:text-white" title="Drag to reorder scene">drag_indicator</span>
                    <div class="space-y-1">
                        <span class="font-bold text-white">STRIP ${sc.index}: ${sc.locationType} ${sc.name}</span>
                        <div class="text-[11px] text-gray-400">${sc.timeOfDay} • EST. 4 HOURS FILMING</div>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <select onclick="event.stopPropagation()" onchange="moveScene(${idx}, parseInt(this.value, 10))" title="Jump to position" class="bg-noir-container border border-noir-border rounded px-2 py-1 text-xs text-action-gold focus:outline-none focus:border-action-gold font-mono cursor-pointer">
                        ${getPosOptions(idx)}
                    </select>
                    <div class="flex items-center gap-0.5 font-mono text-xs">
                        <button type="button" onclick="event.stopPropagation(); moveScene(${idx}, ${idx - 1});" ${idx === 0 ? 'disabled class="text-gray-600 cursor-not-allowed p-1"' : 'class="text-gray-400 hover:text-action-gold p-1 transition-colors"'} title="Move Up">
                            <span class="material-symbols-outlined text-sm">arrow_upward</span>
                        </button>
                        <button type="button" onclick="event.stopPropagation(); moveScene(${idx}, ${idx + 1});" ${idx === scenes.length - 1 ? 'disabled class="text-gray-600 cursor-not-allowed p-1"' : 'class="text-gray-400 hover:text-action-gold p-1 transition-colors"'} title="Move Down">
                            <span class="material-symbols-outlined text-sm">arrow_downward</span>
                        </button>
                    </div>
                    <span class="px-2 py-1 bg-action-gold/10 text-action-gold border border-action-gold/30 text-[10px]">SCHEDULED</span>
                    <button type="button" onclick="event.stopPropagation(); confirmDeleteSingleScene(${idx});" title="Delete Scene ${sc.index} (With Warning)" class="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/10">
                        <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    setTimeout(() => { initSortable(); }, 50);
}

// Calculate Hollywood 5-Tier Budget Formula
function calculateHollywoodBudget(scenes, totalLines, characterCount, isBlank) {
    if (isBlank || (scenes.length === 0 && totalLines < 2)) return 0;

    const select = document.getElementById("budgetTierSelect");
    const customInput = document.getElementById("customRateInput");

    let baseRatePerPage = 25000;
    if (select) {
        if (select.value === 'custom') {
            document.getElementById("customRateContainer").classList.remove("hidden");
            baseRatePerPage = parseFloat(customInput.value) || 10000;
        } else {
            document.getElementById("customRateContainer").classList.add("hidden");
            baseRatePerPage = parseFloat(select.value);
        }
    }

    const pages = Math.max(0.5, totalLines / 30);
    let totalBudget = pages * baseRatePerPage;

    // Apply Location & Time multipliers
    scenes.forEach(sc => {
        let mult = 1.0;
        if (sc.locationType.includes("EXT")) mult += 0.4; // Exterior +40%
        if (sc.timeOfDay.includes("NIGHT")) mult += 0.25; // Night +25%
        totalBudget += (baseRatePerPage * 0.2 * mult);
    });

    totalBudget += (characterCount * 1500); // Cast SAG day rate bonus
    return Math.round(totalBudget / 500) * 500;
}

// Render SVG Character Arc Graph
function renderArcGraph(characterCounts, isBlank) {
    const path1 = document.getElementById("arcPath1");
    const path2 = document.getElementById("arcPath2");
    const path3 = document.getElementById("arcPath3");
    const legend = document.getElementById("arcLegend");

    const names = Object.keys(characterCounts);

    if (isBlank || names.length === 0) {
        if (path1) { path1.setAttribute("d", "M 0,50 L 300,50"); path1.setAttribute("stroke", "#282A2E"); path1.setAttribute("stroke-width", "2"); }
        if (path2) { path2.setAttribute("d", "M 0,50 L 300,50"); path2.setAttribute("stroke", "#282A2E"); path2.setAttribute("stroke-width", "2"); }
        if (path3) { path3.setAttribute("d", "M 0,50 L 300,50"); path3.setAttribute("stroke", "#282A2E"); path3.setAttribute("stroke-width", "2"); }
        if (legend) legend.innerHTML = `<span class="text-gray-500 italic">No character arcs detected</span>`;
        return;
    }

    // Dynamic Palette for Character Arc Lines
    const colors = [
        { stroke: "#FFD341", bg: "bg-action-gold/10", border: "border-action-gold/40", text: "text-action-gold" },
        { stroke: "#3B82F6", bg: "bg-cinema-blue/10", border: "border-cinema-blue/40", text: "text-cinema-blue" },
        { stroke: "#10B981", bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-400" }
    ];

    // Build Legend Badges
    if (legend) {
        legend.innerHTML = names.slice(0, 3).map((name, i) => `
            <span class="px-2 py-0.5 rounded border ${colors[i].bg} ${colors[i].border} ${colors[i].text} flex items-center gap-1 font-bold">
                <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${colors[i].stroke}"></span> ${name}
            </span>
        `).join('');
    }

    // Path 1 (Primary Character e.g. SARAH)
    if (path1) {
        path1.setAttribute("d", "M 10,75 Q 75,15 150,55 T 290,15");
        path1.setAttribute("stroke", colors[0].stroke);
        path1.setAttribute("stroke-width", "3.5");
        path1.style.filter = "drop-shadow(0px 0px 6px rgba(255, 211, 65, 0.7))";
    }

    // Path 2 (Secondary Character e.g. JOHN)
    if (path2) {
        if (names.length > 1) {
            path2.setAttribute("d", "M 10,35 Q 80,85 160,35 T 290,75");
            path2.setAttribute("stroke", colors[1].stroke);
            path2.setAttribute("stroke-width", "3.5");
            path2.style.filter = "drop-shadow(0px 0px 6px rgba(59, 130, 246, 0.7))";
        } else {
            path2.setAttribute("d", "M 0,50 L 300,50");
            path2.setAttribute("stroke", "#282A2E");
            path2.setAttribute("stroke-width", "1");
        }
    }

    // Path 3 (Tertiary Character)
    if (path3) {
        if (names.length > 2) {
            path3.setAttribute("d", "M 10,50 Q 70,20 140,80 T 290,45");
            path3.setAttribute("stroke", colors[2].stroke);
            path3.setAttribute("stroke-width", "3");
            path3.style.filter = "drop-shadow(0px 0px 6px rgba(16, 185, 129, 0.7))";
        } else {
            path3.setAttribute("d", "M 0,50 L 300,50");
            path3.setAttribute("stroke", "#282A2E");
            path3.setAttribute("stroke-width", "1");
        }
    }
}

// Render Scene Breakdown Density Histogram
function renderHistogram(lineCount, sceneCount, isBlank) {
    const bars = [1, 2, 3, 4, 5, 6].map(i => document.getElementById(`bar${i}`));
    const badge = document.getElementById("densityBadge");

    if (isBlank || lineCount === 0) {
        bars.forEach(b => {
            if (b) {
                b.style.height = "10%";
                b.className = "flex-1 bg-gray-800 h-[10%] rounded-t transition-all duration-500";
            }
        });
        if (badge) badge.textContent = "ZERO STATE";
        return;
    }

    // Glowing Colors for populated histogram bars
    const gradientStyles = [
        "bg-gradient-to-t from-action-gold/20 via-action-gold to-amber-300 border-t-2 border-action-gold shadow-[0_0_12px_rgba(255,211,65,0.5)]",
        "bg-gradient-to-t from-cinema-blue/20 via-cinema-blue to-cyan-300 border-t-2 border-cinema-blue shadow-[0_0_12px_rgba(59,130,246,0.5)]",
        "bg-gradient-to-t from-emerald-500/20 via-emerald-400 to-teal-200 border-t-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]",
        "bg-gradient-to-t from-purple-500/20 via-purple-400 to-indigo-200 border-t-2 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]",
        "bg-gradient-to-t from-pink-500/20 via-pink-400 to-rose-200 border-t-2 border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.5)]",
        "bg-gradient-to-t from-amber-500/20 via-action-gold to-yellow-200 border-t-2 border-action-gold shadow-[0_0_12px_rgba(255,211,65,0.5)]"
    ];

    // Compute dynamic heights based on screenplay line density
    const heights = [45, 80, 55, 90, 70, 95];
    bars.forEach((b, i) => {
        if (b) {
            const heightVal = Math.min(95, Math.max(30, heights[i] + (lineCount % 12)));
            b.style.height = `${heightVal}%`;
            b.className = `flex-1 rounded-t transition-all duration-500 ${gradientStyles[i % gradientStyles.length]}`;
            b.title = `Chunk ${i+1}: ${heightVal}% Density`;
        }
    });

    if (badge) badge.textContent = `ACTIVE DENSITY (${sceneCount} ${sceneCount === 1 ? 'SCENE' : 'SCENES'}, ${lineCount} LINES)`;
}

// Synchronize Analytics Viewport Components
function syncAnalyticsView() {
    const budgetVal = document.getElementById("budgetEstimateVal") ? document.getElementById("budgetEstimateVal").textContent : "$0";
    const daysVal = document.getElementById("forecastDaysBadge") ? document.getElementById("forecastDaysBadge").textContent : "0 Days";
    const scenesBadge = document.getElementById("sceneCountBadge") ? document.getElementById("sceneCountBadge").textContent : "0 SCENES";
    const charBadge = document.getElementById("totalCharCountBadge") ? document.getElementById("totalCharCountBadge").textContent : "0 CHARACTERS";

    if (document.getElementById("analyticsBudgetVal")) document.getElementById("analyticsBudgetVal").textContent = budgetVal;
    if (document.getElementById("analyticsDaysVal")) document.getElementById("analyticsDaysVal").textContent = daysVal;
    if (document.getElementById("analyticsScenesVal")) document.getElementById("analyticsScenesVal").textContent = scenesBadge.split(' ')[0] + ' Scenes';
    if (document.getElementById("analyticsCharsVal")) document.getElementById("analyticsCharsVal").textContent = charBadge.split(' ')[0] + ' Leads';

    const charList = document.getElementById("dynamicCharacterList");
    const fullCharList = document.getElementById("fullAnalyticsCharList");
    if (charList && fullCharList) {
        fullCharList.innerHTML = charList.innerHTML;
    }

    const execSummary = document.getElementById("aiReportExecutiveSummary");
    const fullSummary = document.getElementById("fullAnalyticsSummary");
    if (execSummary && fullSummary) {
        fullSummary.innerHTML = execSummary.innerHTML;
    }
}

// Switch Viewport Tabs
function switchTab(tabId) {
    document.querySelectorAll(".top-nav-btn").forEach(btn => {
        btn.className = "top-nav-btn px-3.5 py-1.5 rounded text-gray-400 hover:text-white hover:bg-noir-container flex items-center gap-2 font-mono text-xs";
    });

    const activeBtn = document.getElementById(`tab-${tabId}`);
    if (activeBtn) {
        activeBtn.className = "top-nav-btn active px-3.5 py-1.5 rounded text-action-gold bg-noir-container border border-action-gold/30 flex items-center gap-2 font-mono text-xs";
    }

    const mainGrid = document.getElementById("main-grid");
    const dashView = document.getElementById("view-dashboard");
    const stripView = document.getElementById("view-stripboard");
    const analyticsView = document.getElementById("view-analytics");

    if (tabId === 'analytics') {
        if (mainGrid) mainGrid.classList.add("hidden");
        if (analyticsView) {
            analyticsView.classList.remove("hidden");
            runScriptAnalysis(true);
            syncAnalyticsView();
        }
    } else {
        if (mainGrid) mainGrid.classList.remove("hidden");
        if (analyticsView) analyticsView.classList.add("hidden");

        if (tabId === 'stripboard') {
            if (dashView) dashView.classList.add("hidden");
            if (stripView) stripView.classList.remove("hidden");
        } else {
            if (dashView) dashView.classList.remove("hidden");
            if (stripView) stripView.classList.add("hidden");
        }
    }

    showToast(`Switched view to: ${tabId.toUpperCase()}`);
}

// Left Module Links Selector
function selectModule(moduleKey) {
    document.querySelectorAll(".module-link").forEach(link => {
        link.className = "module-link flex items-center justify-between p-3 rounded text-gray-400 hover:text-white hover:bg-noir-container transition-all font-mono text-xs";
    });

    let e = null;
    if (typeof window.event !== "undefined") e = window.event;
    else if (typeof event !== "undefined") e = event;

    if (e) {
        const target = e.currentTarget || (e.target ? e.target.closest(".module-link") : null);
        if (target) {
            target.className = "module-link active flex items-center justify-between p-3 rounded bg-cinema-blue/20 text-cinema-blueLight border border-cinema-blue/40 font-semibold font-mono text-xs";
        }
    }
    showToast(`Loaded module: ${moduleKey}`);
}

// Modal Handlers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        if (modalId === 'sequenceModal') {
            prepareNextSequenceInput();
        } else if (modalId === 'dprModal') {
            runScriptAnalysis(true);
        } else if (modalId === 'reorderModal') {
            populateReorderModal();
        }
        modal.classList.remove("hidden");
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
    }
}

// Synchronize and render Daily Production Report (DPR) Sheet
function updateDPRModal(scenes, totalBudget) {
    const dprScenes = document.getElementById("dprScenesDisplay");
    const dprBudget = document.getElementById("dprBudgetDisplay");
    const dprTier = document.getElementById("dprTierDisplay");
    const dprList = document.getElementById("dprSceneList");
    const badge = document.getElementById("dprSceneCountBadge");

    const cameraElem = document.getElementById("dprCameraVal");
    const soundElem = document.getElementById("dprSoundVal");
    const gripElem = document.getElementById("dprGripVal");
    const burnElem = document.getElementById("dprBurnVal");

    if (dprScenes) {
        dprScenes.textContent = `${scenes.length} ${scenes.length === 1 ? 'SCENE' : 'SCENES'}`;
    }
    if (badge) {
        badge.textContent = `${scenes.length} ${scenes.length === 1 ? 'SCENE LOGGED' : 'SCENES LOGGED'}`;
    }
    if (dprBudget) {
        dprBudget.textContent = totalBudget === 0 ? "$0" : `$${totalBudget.toLocaleString()}`;
    }

    // Zero-state check for Department Payroll & Variance
    if (scenes.length === 0 || totalBudget === 0) {
        if (cameraElem) cameraElem.textContent = "$0 / Day";
        if (soundElem) soundElem.textContent = "$0 / Day";
        if (gripElem) gripElem.textContent = "$0 / Day";
        if (burnElem) burnElem.textContent = "$0 / DAY";
    } else {
        if (cameraElem) cameraElem.textContent = "$4,500 / Day";
        if (soundElem) soundElem.textContent = "$1,800 / Day";
        if (gripElem) gripElem.textContent = "$3,200 / Day";
        if (burnElem) burnElem.textContent = "$9,500 / DAY";
    }

    const select = document.getElementById("budgetTierSelect");
    if (dprTier && select) {
        const selectedText = select.options[select.selectedIndex].text;
        dprTier.textContent = selectedText.split('(')[0].trim();
    }

    if (dprList) {
        if (scenes.length === 0) {
            dprList.innerHTML = `<div class="p-3 text-center text-gray-500 text-xs">No active production scenes. Add scene headings to populate DPR log.</div>`;
        } else {
            dprList.innerHTML = scenes.map(sc => `
                <div class="flex justify-between items-center p-2.5 bg-noir-container rounded border border-noir-border text-xs">
                    <span class="font-bold text-white">STRIP ${sc.index}: ${sc.locationType} ${sc.name}</span>
                    <span class="text-action-gold font-mono">${sc.timeOfDay} • EST. 4 HOURS FILMING</span>
                </div>
            `).join('');
        }
    }
}

// Calculate existing scenes for auto-numbering
function getExistingSceneCount() {
    const textarea = document.getElementById("scriptTextarea");
    if (!textarea) return 0;
    const lines = textarea.value.split("\n");
    const sceneRegex = /^(INT\.|EXT\.|INT\/EXT\.)\s+/i;
    let count = 0;
    lines.forEach(line => {
        if (sceneRegex.test(line.trim())) count++;
    });
    return count;
}

// Auto-fill scene number in creation modal
function prepareNextSequenceInput() {
    const nextNum = getExistingSceneCount() + 1;
    const seqNumInput = document.getElementById("seqNumber");
    if (seqNumInput) {
        seqNumInput.value = `SCENE ${nextNum}`;
    }
}

// Auto-extract Characters and Heading from raw scene text
function autoExtractSceneMetadata() {
    const content = document.getElementById("seqContent") ? document.getElementById("seqContent").value : "";
    if (!content.trim()) return;

    // 1. Detect Heading if line starts with INT. / EXT.
    const lines = content.split("\n");
    const headingInput = document.getElementById("seqHeading");
    const sceneRegex = /^(INT\.|EXT\.|INT\/EXT\.)\s+([^-]+)-\s*(DAY|NIGHT|EVENING|MORNING|CONTINUOUS)/i;
    let foundHeading = false;

    for (const line of lines) {
        const match = line.trim().match(sceneRegex);
        if (match) {
            if (headingInput) headingInput.value = line.trim().toUpperCase();
            foundHeading = true;
            break;
        }
    }

    // Heuristic slugline generator if missing
    if (!foundHeading && headingInput && (!headingInput.value || headingInput.value === "EXT. CITY STREET - NIGHT")) {
        const lower = content.toLowerCase();
        if (lower.includes("rooftop") || lower.includes("suv") || lower.includes("ramp") || lower.includes("car")) {
            headingInput.value = "EXT. ROOFTOP - NIGHT";
        } else if (lower.includes("office") || lower.includes("desk")) {
            headingInput.value = "INT. OFFICE - DAY";
        } else if (lower.includes("coffee") || lower.includes("table")) {
            headingInput.value = "INT. COFFEE SHOP - DAY";
        }
    }

    // 2. Detect Character Names
    const charInput = document.getElementById("seqCharacters");
    const detected = new Set();
    const excludeKeywords = new Set(["INT", "EXT", "DAY", "NIGHT", "FADE", "CUT", "SCENE", "CONTINUED", "ANGLE", "CLOSE", "VIEW", "UPLOADED", "OUT"]);

    lines.forEach(line => {
        const trimmed = line.trim();
        const cleanName = trimmed.replace(/\(.*\)/, "").trim();
        if (/^[A-Z]{2,}(?:\s[A-Z]{2,})?$/.test(cleanName) && !excludeKeywords.has(cleanName)) {
            detected.add(cleanName);
        }
        if (/\bSarah\b/i.test(trimmed)) detected.add("SARAH");
        if (/\bJohn\b/i.test(trimmed)) detected.add("JOHN");
        if (/\bMarcus\b/i.test(trimmed)) detected.add("MARCUS");
        if (/\bMark\b/i.test(trimmed)) detected.add("MARK");
    });

    if (charInput && detected.size > 0) {
        charInput.value = Array.from(detected).join(", ");
    }
}

// Quick Sample Loader for Rooftop Scene
function loadRooftopScenePreset() {
    const presetText = `If I close the laptop, the connection breaks! The servers will reject the incomplete packet! We're at seventy percent!

A sleek, black SUV roars up the final ramp onto the rooftop level. Its high beams flick on, instantly blinding them both.

SARAH
(Screaming over the engine roar)
I said get in the car, John!

John grabs the laptop, keeping it open, and scrambles into the driver's seat.

The SUV's doors swing open in the glaring light. Two large silhouettes step out.

Sarah raises her weapon, her calm completely shattered, replaced by cold survival instinct.

SARAH
(To John)
Drive! Now!

John slams the car into gear, the tires spinning on the wet pavement as the laptop slides dangerously across the passenger seat.

The progress bar inches up: 89% UPLOADED.

FADE OUT.`;

    const contentElem = document.getElementById("seqContent");
    if (contentElem) {
        contentElem.value = presetText;
        autoExtractSceneMetadata();
        showToast("✦ Loaded Rooftop Action Scene & Auto-Extracted Metadata!");
    }
}

// Sequence Creator Form Handler (With Double-Submit Guard & Strict Single Heading Enforcement)
let isSubmittingSequence = false;

function handleSequenceCreate(event) {
    const e = event || window.event;
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmittingSequence) return;
    isSubmittingSequence = true;

    try {
        const numberInput = document.getElementById("seqNumber").value.trim();
        const headingInput = document.getElementById("seqHeading").value.trim();
        const charactersInput = document.getElementById("seqCharacters").value.trim();
        const contentInput = document.getElementById("seqContent") ? document.getElementById("seqContent").value.trim() : "";

        let heading = headingInput.toUpperCase();
        if (!/^(INT\.|EXT\.|INT\/EXT\.)/i.test(heading)) {
            heading = "EXT. " + heading;
        }
        if (!/-\s*(DAY|NIGHT|EVENING|MORNING|CONTINUOUS|LATER|DUSK|DAWN)/i.test(heading)) {
            heading = heading + " - NIGHT";
        }

        // Construct block with EXACTLY ONE scene heading at top
        let sequenceBlock = `${heading}\n\n`;

        let cleanContent = "";
        if (contentInput) {
            let contentLines = contentInput.split("\n");
            // Completely filter out ANY scene heading lines inside the content body to prevent duplicate scene creation
            contentLines = contentLines.filter(line => !/^(INT\.|EXT\.|INT\/EXT\.)/i.test(line.trim()));
            cleanContent = contentLines.join("\n").trim();
        }

        if (cleanContent.length > 0) {
            sequenceBlock += `${cleanContent}\n\n`;
        } else {
            const characters = charactersInput
                ? charactersInput.split(",").map(c => c.trim().toUpperCase()).filter(Boolean)
                : [];

            if (characters.length > 0) {
                characters.forEach((char, i) => {
                    sequenceBlock += `${char}\n`;
                    if (i === 0) {
                        sequenceBlock += `(entering scene)\nLet's get straight to business.\n\n`;
                    } else {
                        sequenceBlock += `I'm listening. What's the plan?\n\n`;
                    }
                });
            } else {
                sequenceBlock += `A quiet tension fills the room.\n\nCHARACTER\nDialogue line goes here...\n\n`;
            }
        }

        const textarea = document.getElementById("scriptTextarea");
        if (textarea) {
            const val = textarea.value;
            const separator = val.length === 0 ? "" : (val.endsWith("\n\n") ? "" : (val.endsWith("\n") ? "\n" : "\n\n"));

            textarea.value = val + separator + sequenceBlock;
            updateLineNumbers();
            runScriptAnalysis(false);

            // Scroll editor to bottom so user sees newly appended scene
            textarea.scrollTop = textarea.scrollHeight;
        }

        closeModal("sequenceModal");
        showToast(`✦ Appended ${numberInput} (${heading}) to screenplay!`);

        // Reset inputs and prepare next scene number
        document.getElementById("seqHeading").value = "";
        document.getElementById("seqCharacters").value = "";
        if (document.getElementById("seqContent")) document.getElementById("seqContent").value = "";
        prepareNextSequenceInput();
    } finally {
        setTimeout(() => {
            isSubmittingSequence = false;
        }, 400);
    }
}

// Format Actions (Undo/Redo simulation)
function formatSelection(action) {
    showToast(`${action.toUpperCase()} action executed.`);
}

// Trigger AI Intelligence Analysis with Spinner Animation & Report Modal
function triggerAIAnalysis() {
    const btnText = document.getElementById("aiAnalyzeBtnText");
    const btnIcon = document.getElementById("aiAnalyzeBtnIcon");

    if (btnText) btnText.textContent = "Parsing Script & Running AI Intelligence...";
    if (btnIcon) {
        btnIcon.textContent = "sync";
        btnIcon.classList.add("animate-spin");
    }

    setTimeout(() => {
        runScriptAnalysis(false);
        populateAIModalReport();
        openModal("aiAnalysisModal");

        if (btnText) btnText.textContent = "✦ Analyze Script with AI Intelligence";
        if (btnIcon) {
            btnIcon.textContent = "auto_awesome";
            btnIcon.classList.remove("animate-spin");
        }
    }, 700);
}

// Populate AI Analysis Breakdown Modal Report
function populateAIModalReport() {
    const textarea = document.getElementById("scriptTextarea");
    const rawText = textarea ? textarea.value : "";
    const lines = rawText.split("\n");
    const isBlank = rawText.trim().length === 0;

    // Detect Scenes
    const sceneRegex = /^(INT\.|EXT\.|INT\/EXT\.)\s+([^-]+)(?:-\s*(DAY|NIGHT|EVENING|MORNING|CONTINUOUS|LATER|DUSK|DAWN))?/i;
    const scenes = [];
    lines.forEach((line, idx) => {
        const match = line.trim().match(sceneRegex);
        if (match) {
            scenes.push({
                locationType: match[1].toUpperCase(),
                name: match[2].trim().toUpperCase(),
                timeOfDay: match[3] ? match[3].toUpperCase() : "DAY"
            });
        }
    });

    // Detect Characters
    const characterCounts = {};
    const excludeKeywords = new Set(["INT", "EXT", "DAY", "NIGHT", "FADE", "CUT", "SCENE", "CONTINUED", "ANGLE", "CLOSE", "VIEW", "UPLOADED", "OUT"]);
    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        const cleanName = trimmed.replace(/\(.*\)/, "").trim();
        if (/^[A-Z]{2,}(?:\s[A-Z]{2,})?$/.test(cleanName) && !excludeKeywords.has(cleanName)) {
            if (idx + 1 < lines.length && lines[idx + 1].trim().length > 0) {
                characterCounts[cleanName] = (characterCounts[cleanName] || 0) + 1;
            }
        }
    });

    const budgetVal = document.getElementById("budgetEstimateVal") ? document.getElementById("budgetEstimateVal").textContent : "$0";
    const daysVal = document.getElementById("forecastDaysBadge") ? document.getElementById("forecastDaysBadge").textContent : "0 Days";
    const charNames = Object.keys(characterCounts);

    // Set Header Cards
    if (document.getElementById("aiReportSceneCount")) document.getElementById("aiReportSceneCount").textContent = `${scenes.length} Scenes`;
    if (document.getElementById("aiReportBudget")) document.getElementById("aiReportBudget").textContent = budgetVal;
    if (document.getElementById("aiReportDays")) document.getElementById("aiReportDays").textContent = daysVal;
    if (document.getElementById("aiReportCharCount")) document.getElementById("aiReportCharCount").textContent = `${charNames.length} Lead${charNames.length === 1 ? '' : 's'}`;

    // Generate Executive Summary
    const summaryElem = document.getElementById("aiReportExecutiveSummary");
    if (summaryElem) {
        if (isBlank) {
            summaryElem.innerHTML = `<span class="text-amber-400 font-bold">⚠️ Screenplay Editor is empty.</span> Please write or load a screenplay (e.g. click <code class="text-action-gold">Load Sample</code> at top right) to run full AI analysis.`;
        } else {
            const hasNight = scenes.some(s => s.timeOfDay.includes("NIGHT"));
            const hasExt = scenes.some(s => s.locationType.includes("EXT"));
            summaryElem.innerHTML = `
                <p>✦ <strong>Screenplay Analysis Complete:</strong> Detected <strong>${scenes.length} scene(s)</strong> and <strong>${lines.length} lines</strong> of formatted screenplay content.</p>
                <p class="mt-2 text-gray-300">✦ <strong>Character Dialogue Dynamics:</strong> Active dialogue identified for <strong>${charNames.length > 0 ? charNames.join(', ') : 'Characters'}</strong>. Story pacing reflects ${hasExt ? 'high-mobility exterior sequences' : 'contained interior drama'}.</p>
                <p class="mt-2 text-emerald-400">✦ <strong>Production Cost Metric:</strong> Total estimated budget is calculated at <strong>${budgetVal}</strong> across <strong>${daysVal}</strong> of forecasted principal photography.</p>
            `;
        }
    }

    // Generate Recommendations Cards
    const recsElem = document.getElementById("aiReportRecommendations");
    if (recsElem) {
        if (isBlank) {
            recsElem.innerHTML = `<div class="p-3 bg-[#0C0E12] border border-noir-border text-gray-500 rounded text-xs">No active scenes to evaluate. Load a sample or create a new sequence.</div>`;
        } else {
            const extCount = scenes.filter(s => s.locationType.includes("EXT")).length;
            const nightCount = scenes.filter(s => s.timeOfDay.includes("NIGHT")).length;

            let html = `
                <div class="p-3 bg-[#0C0E12] rounded border-l-4 border-l-action-gold border border-noir-border space-y-1">
                    <div class="text-white font-bold">1. Cover & Lighting Allocation</div>
                    <div class="text-gray-400 text-[11px]">Detected ${nightCount} Night Shoot(s) & ${extCount} Exterior Location(s). Ensure G&E generator truck and night differential pay are budgeted.</div>
                </div>
                <div class="p-3 bg-[#0C0E12] rounded border-l-4 border-l-cinema-blue border border-noir-border space-y-1">
                    <div class="text-white font-bold">2. Cast Coverage & SAG Agreements</div>
                    <div class="text-gray-400 text-[11px]">Active lead roles (${charNames.join(', ') || 'N/A'}) have high dialogue density. Recommended 2-camera setup for over-the-shoulder coverage.</div>
                </div>
            `;
            recsElem.innerHTML = html;
        }
    }
}

// Toast Notification System
function showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-6 right-6 z-50 bg-action-gold text-black font-mono font-bold text-xs p-4 rounded shadow-2xl flex items-center gap-2 border border-black/20 animate-bounce";
    toast.innerHTML = `<span class="material-symbols-outlined text-base">auto_awesome</span><span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// ==========================================
// EMAIL AUTHENTICATION & SESSION SYSTEM
// ==========================================

function checkUserSession() {
    const userEmail = localStorage.getItem("scriptsense_user_email");
    const authContainer = document.getElementById("userAuthContainer");
    if (!authContainer) return;

    if (userEmail) {
        const initials = getInitials(userEmail);
        authContainer.innerHTML = `
            <div class="relative group">
                <button onclick="toggleUserDropdown()" class="flex items-center gap-2 p-1 px-2.5 rounded-full bg-noir-container border border-action-gold/50 text-action-gold hover:border-action-gold transition-all shadow-lg">
                    <div class="w-7 h-7 rounded-full bg-action-gold text-black font-bold flex items-center justify-center text-xs shadow-md">
                        ${initials}
                    </div>
                    <span class="hidden sm:inline font-mono text-xs font-semibold text-white max-w-[130px] truncate">${userEmail}</span>
                    <span class="material-symbols-outlined text-xs text-gray-400">expand_more</span>
                </button>

                <!-- Dropdown Menu -->
                <div id="userDropdown" class="hidden absolute right-0 mt-2 w-60 bg-noir-surface border border-noir-border rounded-lg shadow-2xl p-2 z-50 font-mono text-xs space-y-2">
                    <div class="p-2 border-b border-noir-border text-gray-400">
                        <div class="text-[10px] uppercase text-action-gold tracking-widest font-bold">LOGGED IN AS</div>
                        <div class="text-white font-bold truncate text-xs mt-0.5">${userEmail}</div>
                    </div>
                    <div class="px-2 py-1 text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> PRO STUDIO LICENSE ACTIVE
                    </div>
                    <button onclick="logoutUser()" class="w-full text-left p-2 rounded text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-all font-bold">
                        <span class="material-symbols-outlined text-sm">logout</span>
                        <span>Sign Out of Studio</span>
                    </button>
                </div>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <button onclick="openModal('authModal')" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-action-gold text-black font-bold hover:bg-action-goldDark transition-all text-xs glow-gold-sm">
                <span class="material-symbols-outlined text-sm">login</span>
                <span>Sign In</span>
            </button>
        `;
    }
}

function getInitials(email) {
    const namePart = email.split("@")[0];
    const parts = namePart.split(/[\._-]/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return namePart.substring(0, 2).toUpperCase();
}

function toggleUserDropdown() {
    const dropdown = document.getElementById("userDropdown");
    if (dropdown) dropdown.classList.toggle("hidden");
}

// Close dropdown if user clicks outside
document.addEventListener("click", (e) => {
    const container = document.getElementById("userAuthContainer");
    if (container && !container.contains(e.target)) {
        const dropdown = document.getElementById("userDropdown");
        if (dropdown) dropdown.classList.add("hidden");
    }
});

function switchAuthTab(mode) {
    const modeInput = document.getElementById("authMode");
    const tabSignIn = document.getElementById("authTabSignIn");
    const tabSignUp = document.getElementById("authTabSignUp");
    const confirmGroup = document.getElementById("confirmPasswordGroup");
    const submitBtnText = document.getElementById("authSubmitBtnText");

    if (mode === 'signup') {
        if (modeInput) modeInput.value = "signup";
        if (tabSignUp) tabSignUp.className = "flex-1 py-2.5 text-center font-bold text-action-gold border-b-2 border-action-gold transition-all";
        if (tabSignIn) tabSignIn.className = "flex-1 py-2.5 text-center text-gray-400 border-b-2 border-transparent hover:text-white transition-all";
        if (confirmGroup) confirmGroup.classList.remove("hidden");
        if (submitBtnText) submitBtnText.textContent = "Create Studio Account";
    } else {
        if (modeInput) modeInput.value = "signin";
        if (tabSignIn) tabSignIn.className = "flex-1 py-2.5 text-center font-bold text-action-gold border-b-2 border-action-gold transition-all";
        if (tabSignUp) tabSignUp.className = "flex-1 py-2.5 text-center text-gray-400 border-b-2 border-transparent hover:text-white transition-all";
        if (confirmGroup) confirmGroup.classList.add("hidden");
        if (submitBtnText) submitBtnText.textContent = "Sign In to Studio";
    }
}

function fillDemoAuth() {
    const email = document.getElementById("authEmail");
    const pass = document.getElementById("authPassword");
    if (email) email.value = "director@hollywood.com";
    if (pass) pass.value = "studio2026";
    showToast("✦ Demo credentials filled! Click 'Sign In'.");
}

function handleAuthSubmit(event) {
    const e = event || window.event;
    if (e && e.preventDefault) e.preventDefault();
    const mode = document.getElementById("authMode") ? document.getElementById("authMode").value : "signin";
    const email = document.getElementById("authEmail") ? document.getElementById("authEmail").value.trim() : "";
    const pass = document.getElementById("authPassword") ? document.getElementById("authPassword").value : "";
    const confirmPass = document.getElementById("authConfirmPassword") ? document.getElementById("authConfirmPassword").value : "";

    if (!email || !pass) {
        showToast("⚠️ Please enter your email and password.");
        return;
    }

    if (mode === "signup" && pass !== confirmPass) {
        showToast("⚠️ Passwords do not match.");
        return;
    }

    localStorage.setItem("scriptsense_user_email", email);
    checkUserSession();
    closeModal("authModal");

    if (mode === "signup") {
        showToast(`✦ Welcome to ScriptSense AI Pro, ${email}!`);
    } else {
        showToast(`✦ Signed in successfully as ${email}!`);
    }
}

function logoutUser() {
    localStorage.removeItem("scriptsense_user_email");
    checkUserSession();
    showToast("✦ Signed out from ScriptSense AI Studio.");
}

// ==========================================
// SCENE REORDERING (DRAG & DROP) & DELETION
// ==========================================

// Parse raw script text into scene blocks
function parseScriptSceneBlocks() {
    const textarea = document.getElementById("scriptTextarea");
    if (!textarea) return { prologue: "", blocks: [] };

    const lines = textarea.value.split("\n");
    const sceneRegex = /^(INT\.|EXT\.|INT\/EXT\.)\s+([^-]+)(?:-\s*(DAY|NIGHT|EVENING|MORNING|CONTINUOUS|LATER|DUSK|DAWN))?/i;

    const sceneIndices = [];
    lines.forEach((line, idx) => {
        if (sceneRegex.test(line.trim())) {
            sceneIndices.push(idx);
        }
    });

    if (sceneIndices.length === 0) {
        return { prologue: textarea.value, blocks: [] };
    }

    const prologue = lines.slice(0, sceneIndices[0]).join("\n");
    const blocks = [];

    for (let i = 0; i < sceneIndices.length; i++) {
        const start = sceneIndices[i];
        const end = (i + 1 < sceneIndices.length) ? sceneIndices[i + 1] : lines.length;
        const blockLines = lines.slice(start, end);
        blocks.push({
            header: lines[start],
            text: blockLines.join("\n")
        });
    }

    return { prologue, blocks };
}

// Re-assemble screenplay text from blocks
function reassembleScript(prologue, blocks) {
    let result = prologue ? (prologue.trim() + "\n\n") : "";
    result += blocks.map(b => b.text.trim()).join("\n\n") + "\n";
    return result;
}

// Universal Scene Move Function (Used by both Drag-and-Drop and Arrow Controls)
function moveScene(fromIdx, toIdx) {
    const { prologue, blocks } = parseScriptSceneBlocks();
    if (blocks.length <= 1) return;
    if (fromIdx < 0 || fromIdx >= blocks.length) return;
    if (toIdx < 0 || toIdx >= blocks.length) return;

    const [moved] = blocks.splice(fromIdx, 1);
    blocks.splice(toIdx, 0, moved);

    const newScriptText = reassembleScript(prologue, blocks);
    const textarea = document.getElementById("scriptTextarea");
    if (textarea) {
        textarea.value = newScriptText;
        saveScriptToLocalStorage();
        updateLineNumbers();
        runScriptAnalysis(false);
        showToast(`✦ Reordered Scene ${fromIdx + 1} → Position ${toIdx + 1}`);
    }
}

// Drag & Drop State & Event Handlers
let draggedSceneIndex = null;

function handleSceneDragStart(event, idx) {
    draggedSceneIndex = idx;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        try {
            event.dataTransfer.setData("text/plain", idx.toString());
        } catch (e) {}
    }
    const card = event.currentTarget.closest(".scene-drag-card") || event.currentTarget;
    card.classList.add("opacity-40", "scale-[0.98]");
}

function handleSceneDragOver(event) {
    event.preventDefault();
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
    }
    const card = event.currentTarget.closest(".scene-drag-card") || event.currentTarget;
    if (card) {
        card.classList.add("border-action-gold", "bg-action-gold/20", "shadow-lg");
    }
}

function handleSceneDragLeave(event) {
    const card = event.currentTarget.closest(".scene-drag-card") || event.currentTarget;
    if (card) {
        card.classList.remove("border-action-gold", "bg-action-gold/20", "shadow-lg");
    }
}

function handleSceneDragEnd(event) {
    document.querySelectorAll(".scene-drag-card").forEach(el => {
        el.classList.remove("opacity-40", "scale-[0.98]", "border-action-gold", "bg-action-gold/20", "shadow-lg");
    });
}

function handleSceneDrop(event, targetIdx) {
    event.preventDefault();
    event.stopPropagation();

    document.querySelectorAll(".scene-drag-card").forEach(el => {
        el.classList.remove("opacity-40", "scale-[0.98]", "border-action-gold", "bg-action-gold/20", "shadow-lg");
    });

    let sourceIdx = draggedSceneIndex;
    if (sourceIdx === null || sourceIdx === undefined || isNaN(sourceIdx)) {
        try {
            const data = event.dataTransfer.getData("text/plain");
            if (data !== "") sourceIdx = parseInt(data, 10);
        } catch (e) {}
    }

    if (sourceIdx !== null && !isNaN(sourceIdx) && sourceIdx !== targetIdx) {
        moveScene(sourceIdx, targetIdx);
    }
    draggedSceneIndex = null;
}

// Single Scene Deletion With Warning Modal
let pendingDeleteSceneIndex = null;

function confirmDeleteSingleScene(idx) {
    const { blocks } = parseScriptSceneBlocks();
    if (idx < 0 || idx >= blocks.length) return;

    pendingDeleteSceneIndex = idx;
    const block = blocks[idx];
    const headerTitle = block.header.trim();

    const titleEl = document.getElementById("confirmModalTitle");
    const msgEl = document.getElementById("confirmModalMessage");
    const actionBtn = document.getElementById("confirmModalActionBtn");

    if (titleEl) titleEl.textContent = `Delete SCENE ${idx + 1}?`;
    if (msgEl) {
        msgEl.innerHTML = `
            <div class="space-y-2">
                <p class="text-amber-400 font-bold">⚠️ Production Deletion Warning:</p>
                <p>Are you sure you want to delete <strong class="text-white">${headerTitle}</strong>?</p>
                <p class="text-gray-400 text-[11px]">This will permanently remove SCENE ${idx + 1} and its associated dialogue and action lines from your screenplay editor.</p>
            </div>
        `;
    }

    if (actionBtn) {
        actionBtn.onclick = () => executeDeleteSingleScene();
    }

    openModal("confirmModal");
}

function executeDeleteSingleScene() {
    if (pendingDeleteSceneIndex === null) return;

    const { prologue, blocks } = parseScriptSceneBlocks();
    if (pendingDeleteSceneIndex < 0 || pendingDeleteSceneIndex >= blocks.length) return;

    const deletedIdx = pendingDeleteSceneIndex;
    blocks.splice(deletedIdx, 1);

    const newScriptText = reassembleScript(prologue, blocks);
    const textarea = document.getElementById("scriptTextarea");
    if (textarea) {
        textarea.value = newScriptText;
        saveScriptToLocalStorage();
        updateLineNumbers();
        runScriptAnalysis(false);
        showToast(`✦ Deleted SCENE ${deletedIdx + 1} from screenplay.`);
    }

    pendingDeleteSceneIndex = null;
    closeModal("confirmModal");
}

// Bulk Delete All Scenes With Warning Modal
function confirmDeleteAllScenes() {
    const { blocks } = parseScriptSceneBlocks();
    if (blocks.length === 0) {
        showToast("⚠️ No scenes currently loaded to delete.");
        return;
    }

    const titleEl = document.getElementById("confirmModalTitle");
    const msgEl = document.getElementById("confirmModalMessage");
    const actionBtn = document.getElementById("confirmModalActionBtn");

    if (titleEl) titleEl.textContent = `Delete ALL ${blocks.length} Scenes?`;
    if (msgEl) {
        msgEl.innerHTML = `
            <div class="space-y-2">
                <p class="text-red-400 font-bold">⚠️ CRITICAL PRODUCTION WARNING:</p>
                <p>Are you sure you want to delete <strong class="text-white">ALL ${blocks.length} SCENES</strong> from your screenplay studio?</p>
                <p class="text-gray-400 text-[11px]">This action will clear all scene headings, action descriptions, dialogue, stripboard schedules, and analytics.</p>
            </div>
        `;
    }

    if (actionBtn) {
        actionBtn.onclick = () => executeDeleteAllScenes();
    }

    openModal("confirmModal");
}

function executeDeleteAllScenes() {
    clearScriptCanvas();
    closeModal("confirmModal");
    showToast("✦ All scenes deleted. Clean screenplay slate ready.");
}

// ==========================================
// SORTABLEJS INTEGRATION & REORDER MODAL
// ==========================================

let sortableTimeline = null;
let sortableStripboard = null;

function initSortable() {
    if (typeof Sortable === 'undefined') return;

    const timelineEl = document.getElementById("sceneTimelineList");
    if (timelineEl) {
        if (sortableTimeline) sortableTimeline.destroy();
        sortableTimeline = new Sortable(timelineEl, {
            animation: 150,
            handle: '.cursor-grab',
            ghostClass: 'opacity-40',
            chosenClass: 'bg-action-gold/20',
            onEnd: function(evt) {
                if (evt.oldIndex !== evt.newIndex && evt.oldIndex !== undefined && evt.newIndex !== undefined) {
                    moveScene(evt.oldIndex, evt.newIndex);
                }
            }
        });
    }

    const stripboardEl = document.getElementById("stripboardList");
    if (stripboardEl) {
        if (sortableStripboard) sortableStripboard.destroy();
        sortableStripboard = new Sortable(stripboardEl, {
            animation: 150,
            handle: '.cursor-grab',
            ghostClass: 'opacity-40',
            chosenClass: 'bg-action-gold/20',
            onEnd: function(evt) {
                if (evt.oldIndex !== evt.newIndex && evt.oldIndex !== undefined && evt.newIndex !== undefined) {
                    moveScene(evt.oldIndex, evt.newIndex);
                }
            }
        });
    }
}

function populateReorderModal() {
    const list = document.getElementById("reorderModalList");
    const badge = document.getElementById("reorderModalBadge");
    const { blocks } = parseScriptSceneBlocks();

    if (badge) badge.textContent = `${blocks.length} ${blocks.length === 1 ? 'Scene' : 'Scenes'}`;

    if (!list) return;

    if (blocks.length === 0) {
        list.innerHTML = `<div class="p-4 rounded bg-[#0C0E12] border border-noir-border text-center text-gray-500 text-xs">No scenes currently loaded in master screenplay.</div>`;
        return;
    }

    const getPosOptions = (currentIdx) => {
        let opts = '';
        for (let i = 0; i < blocks.length; i++) {
            const selected = i === currentIdx ? 'selected' : '';
            opts += `<option value="${i}" ${selected}>Position ${i + 1}</option>`;
        }
        return opts;
    };

    list.innerHTML = blocks.map((block, idx) => `
        <div class="p-3 bg-[#0C0E12] border border-noir-border hover:border-action-gold/50 rounded flex justify-between items-center font-mono text-xs transition-all">
            <div class="space-y-1 max-w-[240px] sm:max-w-[280px]">
                <div class="font-bold text-white truncate">SCENE ${idx + 1}: ${block.header.trim()}</div>
                <div class="text-[10px] text-gray-400 truncate">${block.text.split('\n').slice(1).join(' ').trim().substring(0, 45)}...</div>
            </div>

            <div class="flex items-center gap-2">
                <select onchange="moveScene(${idx}, parseInt(this.value, 10)); populateReorderModal();" class="bg-noir-container border border-noir-border rounded px-2 py-1 text-xs text-action-gold focus:outline-none focus:border-action-gold font-mono cursor-pointer">
                    ${getPosOptions(idx)}
                </select>

                <div class="flex items-center gap-0.5">
                    <button type="button" onclick="moveScene(${idx}, ${idx - 1}); populateReorderModal();" ${idx === 0 ? 'disabled class="text-gray-600 cursor-not-allowed p-1"' : 'class="text-gray-400 hover:text-action-gold p-1 transition-colors"'} title="Move Up">
                        <span class="material-symbols-outlined text-sm">arrow_upward</span>
                    </button>
                    <button type="button" onclick="moveScene(${idx}, ${idx + 1}); populateReorderModal();" ${idx === blocks.length - 1 ? 'disabled class="text-gray-600 cursor-not-allowed p-1"' : 'class="text-gray-400 hover:text-action-gold p-1 transition-colors"'} title="Move Down">
                        <span class="material-symbols-outlined text-sm">arrow_downward</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

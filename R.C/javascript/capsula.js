/* =========================================================
   CÁPSULA DO TEMPO — VERSÃO DEFINITIVA E PRONTA
   Raphael & Camilly ❤️
========================================================= */
(() => {
    "use strict";

    const MASTER_KEY = "$2a$10$jgCEe7C/vB1FylB/j6oBsuJKWa.0lxRgmA5PMWXAus6voJWf7.Km";
    const BIN_ID = "6ae6579affd5d160539c0675";
    const STORAGE_KEY = "camilly_capsula_letters_v1";

    const $ = id => document.getElementById(id);
    const sections = ["capsulaEditor", "capsulaRevisao", "capsulaLista", "capsulaLeitura"];
    
    let pendingLetter = null;

    const todayLocal = () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 10);
    };

    const dateInput = $("capsulaData");
    if (dateInput) {
        dateInput.min = todayLocal();
    }

    // --- LEITURA E GRAVAÇÃO LOCAL ---
    function getLocalLetters() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Erro ao ler localStorage:", e);
            return [];
        }
    }

    function saveLocalLetters(letters) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
        } catch (e) {
            console.error("Erro ao salvar no localStorage:", e);
        }
    }

    // --- BUSCA GERAL (LOCAL + NUVEM) ---
    async function fetchAllLetters() {
        let localLetters = getLocalLetters();

        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
                headers: { "X-Master-Key": MASTER_KEY }
            });

            if (response.ok) {
                const result = await response.json();
                if (result && result.record && Array.isArray(result.record.letters)) {
                    // Mesclar cartas da nuvem com as locais sem duplicar
                    const cloudLetters = result.record.letters;
                    const map = new Map();
                    
                    localLetters.forEach(l => map.set(l.id, l));
                    cloudLetters.forEach(l => map.set(l.id, l));

                    const merged = Array.from(map.values());
                    saveLocalLetters(merged);
                    return merged;
                }
            }
        } catch (e) {
            console.warn("Servidor offline ou restrito. Exibindo dados locais.");
        }

        return localLetters;
    }

    // --- SALVAR CARTA ---
    async function saveLetter(letter) {
        const letters = getLocalLetters();
        
        const novaCarta = {
            id: Date.now(),
            title: letter.title,
            message: letter.message,
            opening_date: letter.date,
            created_at: new Date().toISOString()
        };
        
        letters.push(novaCarta);
        saveLocalLetters(letters); // Guarda instantaneamente no navegador

        // Tenta sincronizar com o JSONBin em segundo plano
        try {
            await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": MASTER_KEY
                },
                body: JSON.stringify({ letters: letters })
            });
        } catch (e) {
            console.warn("Servidor ignorado por CORS, mantido localmente.");
        }

        return letters;
    }

    // --- PAINÉIS E NAVEGAÇÃO ---
    function showPanel(id) {
        sections.forEach(sectionId => {
            const el = $(sectionId);
            if (el) el.hidden = sectionId !== id;
        });
        const start = $("capsulaInicio");
        if (start) start.hidden = Boolean(id);
        if (!id) {
            sections.forEach(sectionId => { if ($(sectionId)) $(sectionId).hidden = true; });
            if (start) start.hidden = false;
        }
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        const parts = dateString.split("T")[0].split("-").map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "long", year: "numeric"
        });
    }

    function escapeHTML(value) {
        return String(value || "").replace(/[&<>"']/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[char]);
    }

    function clearForm() {
        const form = $("capsulaFormulario");
        if (form) form.reset();
        if (dateInput) dateInput.min = todayLocal();
        const count = $("capsulaContagem");
        if (count) count.textContent = "0";
        pendingLetter = null;
    }

    const safeClick = (id, fn) => {
        const el = $(id);
        if (el) el.addEventListener("click", fn);
    };

    // --- EVENTOS DO FORMULÁRIO E BOTOES ---
    safeClick("capsulaAbrirEscrita", () => {
        clearForm();
        showPanel("capsulaEditor");
        const titleInput = $("capsulaTitulo");
        if (titleInput) titleInput.focus();
    });

    safeClick("capsulaCancelarEscrita", () => {
        clearForm();
        showPanel(null);
    });

    const textInput = $("capsulaTexto");
    if (textInput) {
        textInput.addEventListener("input", () => {
            const count = $("capsulaContagem");
            if (count) count.textContent = textInput.value.length;
        });
    }

    const form = $("capsulaFormulario");
    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();
            const titleInput = $("capsulaTitulo");
            const title = titleInput ? titleInput.value.trim() || "Uma carta para o futuro" : "Uma carta para o futuro";
            const message = textInput ? textInput.value.trim() : "";
            const date = dateInput ? dateInput.value : "";

            if (!message) {
                alert("Escreva sua mensagem antes de continuar. ❤️");
                if (textInput) textInput.focus();
                return;
            }
            if (!date || date < todayLocal()) {
                alert("Escolha hoje ou uma data futura para abrir a carta.");
                if (dateInput) dateInput.focus();
                return;
            }

            pendingLetter = { title, message, date };
            if ($("capsulaPreviewTitulo")) $("capsulaPreviewTitulo").textContent = title;
            if ($("capsulaPreviewData")) $("capsulaPreviewData").textContent = "Para abrir em " + formatDate(date);
            if ($("capsulaPreviewTexto")) $("capsulaPreviewTexto").textContent = message;
            showPanel("capsulaRevisao");
        });
    }

    safeClick("capsulaCorrigir", () => {
        showPanel("capsulaEditor");
        if (textInput) textInput.focus();
    });

    safeClick("capsulaConfirmar", async () => {
        if (!pendingLetter) return;

        const senhaInformada = prompt("Para selar e guardar esta carta, digite a senha da cápsula (ex: 2929):");
        if (!senhaInformada) return;

        const updatedLetters = await saveLetter(pendingLetter);

        clearForm();
        alert("Carta guardada com sucesso! ❤️");
        
        renderList(updatedLetters);
        showPanel("capsulaLista");
    });

    safeClick("capsulaAbrirLista", async () => {
        const letters = await fetchAllLetters();
        renderList(letters);
        showPanel("capsulaLista");
    });

    safeClick("capsulaVoltarInicio", () => showPanel(null));
    safeClick("capsulaVoltarLista", async () => {
        const letters = await fetchAllLetters();
        renderList(letters);
        showPanel("capsulaLista");
    });

    // --- RENDERIZAR E LER CARTAS ---
    function renderList(letters) {
        const list = $("capsulaCartasLista");
        if (!list) return;
        list.innerHTML = "";

        if (!letters || !letters.length) {
            list.innerHTML = '<div class="capsula-vazio"><div style="font-size:28px;margin-bottom:10px">💌</div>Ainda não há cartas guardadas.<br>Que tal escrever a primeira lembrança para o futuro?</div>';
            return;
        }

        const hoje = todayLocal();

        letters.forEach(letter => {
            const isOpen = letter.opening_date <= hoje;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "capsula-item";
            button.disabled = !isOpen;
            button.innerHTML = `
                <span class="capsula-item-icone"><i class="fa-solid ${isOpen ? "fa-envelope-open" : "fa-lock"}"></i></span>
                <span class="capsula-item-info">
                    <strong>${escapeHTML(letter.title || "Uma carta para o futuro")}</strong>
                    <small>${isOpen ? "Disponível para abrir" : "Para abrir em " + formatDate(letter.opening_date)}</small>
                </span>
                <span class="capsula-item-status">${isOpen ? "Abrir →" : "🔒 Selada"}</span>`;
            
            if (isOpen) {
                button.addEventListener("click", () => openLetter(letter.id));
            }
            list.appendChild(button);
        });
    }

    function openLetter(id) {
        const letters = getLocalLetters();
        const letter = letters.find(item => item.id === id);
        if (!letter) return;
        
        const hoje = todayLocal();
        if (letter.opening_date > hoje) {
            alert("Essa carta ainda está selada. ❤️");
            return;
        }

        if ($("capsulaLeituraData")) $("capsulaLeituraData").textContent = "Aberta a partir de " + formatDate(letter.opening_date);
        if ($("capsulaLeituraTitulo")) $("capsulaLeituraTitulo").textContent = letter.title || "Uma carta para o futuro";
        if ($("capsulaLeituraTexto")) $("capsulaLeituraTexto").textContent = letter.message;
        showPanel("capsulaLeitura");
    }

    showPanel(null);
})();
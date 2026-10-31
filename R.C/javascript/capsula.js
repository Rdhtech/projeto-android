/* =========================================================
   CÁPSULA DO TEMPO — NUVEM PÚBLICA (NPOINT.IO)
   Raphael & Camilly ❤️
========================================================= */
(() => {
    "use strict";

    const NPOINT_BIN_ID = "7517a163ea271d4378cf"; 
    const API_URL = `https://api.npoint.io/${NPOINT_BIN_ID}`;

    const $ = id => document.getElementById(id);
    const sections = ["capsulaEditor", "capsulaRevisao", "capsulaLista", "capsulaLeitura"];
    
    let pendingLetter = null;
    let cachedLetters = [];

    const todayLocal = () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 10);
    };

    const dateInput = $("capsulaData");
    if (dateInput) {
        dateInput.min = todayLocal();
    }

    // --- BUSCAR CARTAS NA NUVEM ---
    async function fetchCloudLetters() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Erro ao carregar dados da nuvem.");
            
            const data = await response.json();
            if (data && Array.isArray(data.letters)) {
                cachedLetters = data.letters;
                return data.letters;
            }
            return [];
        } catch (error) {
            console.error("Erro na busca online:", error);
            return cachedLetters || [];
        }
    }

    // --- SALVAR CARTA NA NUVEM PARA TODOS VEREM ---
    async function saveLetterToCloud(letter) {
        try {
            const currentLetters = await fetchCloudLetters();
            
            const novaCarta = {
                id: Date.now(),
                title: letter.title,
                message: letter.message,
                opening_date: letter.date,
                created_at: new Date().toISOString()
            };
            
            currentLetters.push(novaCarta);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ letters: currentLetters })
            });

            if (!response.ok) throw new Error("Não foi possível salvar na nuvem.");

            cachedLetters = currentLetters;
            return { success: true };
        } catch (error) {
            console.error("Erro ao salvar:", error);
            return { success: false, error: "Falha na conexão com o servidor da cápsula." };
        }
    }

    // --- CONTROLE DE TELAS ---
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

    // --- NAVEGAÇÃO E FORMULÁRIO ---
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

        const resultado = await saveLetterToCloud(pendingLetter);

        if (!resultado || !resultado.success) {
            alert(resultado?.error || "Erro ao salvar a carta na nuvem.");
            return;
        }

        clearForm();
        alert("Carta guardada com sucesso na nuvem! ❤️");
        await renderLetters();
        showPanel("capsulaLista");
    });

    safeClick("capsulaAbrirLista", async () => {
        await renderLetters();
        showPanel("capsulaLista");
    });

    safeClick("capsulaVoltarInicio", () => showPanel(null));
    safeClick("capsulaVoltarLista", async () => {
        await renderLetters();
        showPanel("capsulaLista");
    });

    // --- EXIBIÇÃO E LEITURA DE CARTAS ---
    async function renderLetters() {
        const list = $("capsulaCartasLista");
        if (!list) return;
        list.innerHTML = '<div class="capsula-vazio">Buscando cartas na nuvem... 💌</div>';

        const letters = await fetchCloudLetters();
        list.innerHTML = "";

        if (!letters || !letters.length) {
            list.innerHTML = '<div class="capsula-vazio"><div style="font-size:28px;margin-bottom:10px">💌</div>Ainda não há cartas guardadas na nuvem.<br>Que tal escrever a primeira lembrança para o futuro?</div>';
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
        const letter = cachedLetters.find(item => item.id === id);
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
/* =========================================================
   CÁPSULA DO TEMPO — interface local
   Observação: esta versão salva no navegador. Não é armazenamento
   seguro nem compartilhado entre dispositivos. Veja as instruções
   que acompanham os arquivos antes de publicar como cápsula privada.
========================================================= */
(() => {
    "use strict";

    const $ = id => document.getElementById(id);
    const editor = $("capsulaEditor");
    if (!editor) return;

    const sections = ["capsulaEditor", "capsulaRevisao", "capsulaLista", "capsulaLeitura"];
    const form = $("capsulaFormulario");
    const titleInput = $("capsulaTitulo");
    const textInput = $("capsulaTexto");
    const dateInput = $("capsulaData");
    const count = $("capsulaContagem");
    const STORAGE_KEY = "raphael-camilly-capsula-v1";
    let pendingLetter = null;
    let activeLetterId = null;

    const todayLocal = () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 10);
    };

    dateInput.min = todayLocal();

    function getLetters() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.warn("Não foi possível ler as cartas salvas.", error);
            return [];
        }
    }

    function saveLetters(letters) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
            return true;
        } catch (error) {
            alert("Não foi possível guardar a carta neste navegador. Verifique o espaço disponível.");
            return false;
        }
    }

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
        const parts = dateString.split("-").map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "long", year: "numeric"
        });
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[char]);
    }

    function clearForm() {
        form.reset();
        dateInput.min = todayLocal();
        count.textContent = "0";
        pendingLetter = null;
    }

    $("capsulaAbrirEscrita").addEventListener("click", () => {
        clearForm();
        showPanel("capsulaEditor");
        titleInput.focus();
    });

    $("capsulaCancelarEscrita").addEventListener("click", () => {
        clearForm();
        showPanel(null);
    });

    textInput.addEventListener("input", () => {
        count.textContent = textInput.value.length;
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        const title = titleInput.value.trim() || "Uma carta para o futuro";
        const message = textInput.value.trim();
        const date = dateInput.value;

        if (!message) {
            alert("Escreva sua mensagem antes de continuar. ❤️");
            textInput.focus();
            return;
        }
        if (!date || date < todayLocal()) {
            alert("Escolha hoje ou uma data futura para abrir a carta.");
            dateInput.focus();
            return;
        }

        pendingLetter = { title, message, date };
        $("capsulaPreviewTitulo").textContent = title;
        $("capsulaPreviewData").textContent = "Para abrir em " + formatDate(date);
        $("capsulaPreviewTexto").textContent = message;
        showPanel("capsulaRevisao");
    });

    $("capsulaCorrigir").addEventListener("click", () => {
        showPanel("capsulaEditor");
        textInput.focus();
    });

    $("capsulaConfirmar").addEventListener("click", () => {
        if (!pendingLetter) return;
        const yes = window.confirm("Tem certeza de que deseja selar esta carta até " +
            formatDate(pendingLetter.date) + "? Revise o texto antes de confirmar.");
        if (!yes) return;

        const letters = getLetters();
        letters.push({
            id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2),
            title: pendingLetter.title,
            message: pendingLetter.message,
            date: pendingLetter.date,
            createdAt: new Date().toISOString()
        });
        if (!saveLetters(letters)) return;

        clearForm();
        alert("Carta guardada neste navegador. ❤️");
        renderLetters();
        showPanel("capsulaLista");
    });

    $("capsulaAbrirLista").addEventListener("click", () => {
        renderLetters();
        showPanel("capsulaLista");
    });

    $("capsulaVoltarInicio").addEventListener("click", () => showPanel(null));
    $("capsulaVoltarLista").addEventListener("click", () => {
        renderLetters();
        showPanel("capsulaLista");
    });

    function renderLetters() {
        const list = $("capsulaCartasLista");
        const letters = getLetters().sort((a, b) => a.date.localeCompare(b.date));
        list.innerHTML = "";

        if (!letters.length) {
            list.innerHTML = '<div class="capsula-vazio"><div style="font-size:28px;margin-bottom:10px">💌</div>Ainda não há cartas guardadas.<br>Que tal escrever a primeira lembrança para o futuro?</div>';
            return;
        }

        letters.forEach(letter => {
            const isOpen = todayLocal() >= letter.date;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "capsula-item";
            button.disabled = !isOpen;
            button.innerHTML = `
                <span class="capsula-item-icone"><i class="fa-solid ${isOpen ? "fa-envelope-open" : "fa-lock"}"></i></span>
                <span class="capsula-item-info">
                    <strong>${escapeHTML(letter.title || "Uma carta para o futuro")}</strong>
                    <small>${isOpen ? "Disponível para abrir" : "Selada até " + escapeHTML(formatDate(letter.date))}</small>
                </span>
                <span class="capsula-item-status">${isOpen ? "Abrir →" : "🔒 Selada"}</span>`;
            if (isOpen) {
                button.addEventListener("click", () => openLetter(letter.id));
            }
            list.appendChild(button);
        });
    }

    function openLetter(id) {
        const letter = getLetters().find(item => item.id === id);
        if (!letter) return;
        if (todayLocal() < letter.date) {
            alert("Essa carta ainda está selada. ❤️");
            return;
        }
        activeLetterId = id;
        $("capsulaLeituraData").textContent = "Escrita em " +
            new Date(letter.createdAt).toLocaleDateString("pt-BR") +
            " · Aberta a partir de " + formatDate(letter.date);
        $("capsulaLeituraTitulo").textContent = letter.title || "Uma carta para o futuro";
        $("capsulaLeituraTexto").textContent = letter.message;
        showPanel("capsulaLeitura");
    }

    // Initialize state
    showPanel(null);
})();

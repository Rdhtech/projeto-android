/* =========================================================
   CÁPSULA DO TEMPO — SUPABASE CLIENT OFICIAL CORRIGIDO
   Raphael & Camilly ❤️
========================================================= */
(() => {
    "use strict";

    // URL base limpa (sem /rest/v1)
    const SUPABASE_URL = "https://gjtxfyjxsxutbacmhvuc.supabase.co";
    const SUPABASE_KEY = "sb_publishable_kUtf8biwpTBneuNf1NnSKg_fNF7k2mZ"; // <--- Certifica-te de que a tua Publishable key está aqui inteira

    let supabaseClient = null;

    function getSupabase() {
        if (!supabaseClient && window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
        return supabaseClient;
    }

    const $ = id => document.getElementById(id);
    const editor = $("capsulaEditor");
    if (!editor) return;

    const sections = ["capsulaEditor", "capsulaRevisao", "capsulaLista", "capsulaLeitura"];
    const form = $("capsulaFormulario");
    const titleInput = $("capsulaTitulo");
    const textInput = $("capsulaTexto");
    const dateInput = $("capsulaData");
    const count = $("capsulaContagem");
    
    let pendingLetter = null;
    let currentLettersCache = [];

    const todayLocal = () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 10);
    };

    dateInput.min = todayLocal();

    async function getLetters() {
        try {
            const client = getSupabase();
            if (!client) return [];

            const { data, error } = await client.rpc("get_capsule_letters");
            if (error) throw error;
            if (Array.isArray(data)) {
                currentLettersCache = data;
                return data;
            }
            return [];
        } catch (error) {
            console.error("Erro ao buscar cartas:", error);
            return [];
        }
    }

    async function saveLetterToSupabase(letter, password) {
        try {
            const client = getSupabase();
            if (!client) return { success: false, error: "Supabase não inicializado." };

            const { data, error } = await client.rpc("create_capsule_letter", {
                p_title: letter.title,
                p_author: "Raphael & Camilly",
                p_message: letter.message,
                p_opening_date: letter.date,
                p_password: password
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Erro ao salvar carta:", error);
            return { success: false, error: error.message || "Erro de ligação com o servidor." };
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

    $("capsulaConfirmar").addEventListener("click", async () => {
        if (!pendingLetter) return;

        const senhaInformada = prompt("Para selar e guardar esta carta, digite a senha da cápsula:");
        if (!senhaInformada) return;

        const resultado = await saveLetterToSupabase(pendingLetter, senhaInformada);

        if (!resultado || resultado.success === false) {
            alert(resultado?.error || "Erro ao salvar a carta. Verifique a senha.");
            return;
        }

        clearForm();
        alert("Carta guardada com sucesso no servidor online! ❤️");
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

    async function renderLetters() {
        const list = $("capsulaCartasLista");
        list.innerHTML = '<div class="capsula-vazio">Carregando cartas do servidor... 💌</div>';

        const letters = await getLetters();
        list.innerHTML = "";

        if (!letters || !letters.length) {
            list.innerHTML = '<div class="capsula-vazio"><div style="font-size:28px;margin-bottom:10px">💌</div>Ainda não há cartas guardadas no servidor.<br>Que tal escrever a primeira lembrança para o futuro?</div>';
            return;
        }

        letters.forEach(letter => {
            const isOpen = letter.is_unlocked;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "capsula-item";
            button.disabled = !isOpen;
            button.innerHTML = `
                <span class="capsula-item-icone"><i class="fa-solid ${isOpen ? "fa-envelope-open" : "fa-lock"}"></i></span>
                <span class="capsula-item-info">
                    <strong>${escapeHTML(letter.title || "Uma carta para o futuro")}</strong>
                    <small>${isOpen ? "Disponível para abrir" : escapeHTML(letter.message)}</small>
                </span>
                <span class="capsula-item-status">${isOpen ? "Abrir →" : "🔒 Selada"}</span>`;
            
            if (isOpen) {
                button.addEventListener("click", () => openLetter(letter.id));
            }
            list.appendChild(button);
        });
    }

    function openLetter(id) {
        const letter = currentLettersCache.find(item => item.id === id);
        if (!letter) return;
        
        if (!letter.is_unlocked) {
            alert("Essa carta ainda está selada. ❤️");
            return;
        }

        $("capsulaLeituraData").textContent = "Aberta a partir de " + formatDate(letter.opening_date);
        $("capsulaLeituraTitulo").textContent = letter.title || "Uma carta para o futuro";
        $("capsulaLeituraTexto").textContent = letter.message;
        showPanel("capsulaLeitura");
    }

    showPanel(null);
})();
/* =========================================================
   NAVEGAÇÃO
========================================================= */

function mostrarPagina(id) {
    const paginas = document.querySelectorAll(".pagina");

    paginas.forEach(pagina => {
        pagina.classList.remove("ativa");
    });

    const pagina = document.getElementById(id);

    if (pagina) {
        pagina.classList.add("ativa");
    }

    fecharMenuMobile();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   MENU MOBILE ESTILO APPLE
========================================================= */

const menuMobileBtn = document.getElementById("menuMobileBtn");
const menuMobileOverlay = document.getElementById("menuMobileOverlay");
const appleHeader = document.querySelector(".apple-header");

function toggleMenuMobile() {
    if (!menuMobileOverlay || !appleHeader) return;
    
    const estaAberto = menuMobileOverlay.classList.contains("aberto");

    if (estaAberto) {
        fecharMenuMobile();
    } else {
        abrirMenuMobile();
    }
}

function abrirMenuMobile() {
    if (!menuMobileOverlay || !appleHeader) return;
    menuMobileOverlay.classList.add("aberto");
    appleHeader.classList.add("aberto");
    document.body.classList.add("menu-aberto");
}

function fecharMenuMobile() {
    if (!menuMobileOverlay || !appleHeader) return;
    menuMobileOverlay.classList.remove("aberto");
    appleHeader.classList.remove("aberto");
    document.body.classList.remove("menu-aberto");
}

if (menuMobileBtn) {
    menuMobileBtn.addEventListener("click", toggleMenuMobile);
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        fecharMenuMobile();
    }
});


/* =========================================================
   CONTADOR
========================================================= */

const dataNamoro = new Date(2026, 2, 29, 0, 0, 0);

function atualizarTempo() {
    const agora = new Date();
    let diferenca = agora - dataNamoro;

    if (diferenca < 0) diferenca = 0;

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    diferenca %= (1000 * 60 * 60 * 24);

    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    diferenca %= (1000 * 60 * 60);

    const minutos = Math.floor(diferenca / (1000 * 60));
    diferenca %= (1000 * 60);

    const segundos = Math.floor(diferenca / 1000);

    const tempo = document.getElementById("tempo");

    if (tempo) {
        tempo.textContent = `${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos ❤️`;
    }
}

setInterval(atualizarTempo, 1000);
atualizarTempo();


/* =========================================================
   EU TE AMO
========================================================= */

function euTeAmo() {
    const mensagem = document.getElementById("mensagem-amor");
    if (!mensagem) return;

    mensagem.innerHTML = `
        <p>Eu te amo mais do que consigo explicar. ❤️</p>
        <p>Você é uma das melhores partes da minha vida. ❤️</p>
    `;

    for (let i = 0; i < 15; i++) {
        const coracao = document.createElement("div");
        coracao.classList.add("coracao");
        coracao.textContent = "❤️";
        coracao.style.left = Math.random() * 100 + "vw";
        coracao.style.animationDuration = (3 + Math.random() * 2) + "s";
        coracao.style.fontSize = (18 + Math.random() * 20) + "px";

        document.body.appendChild(coracao);

        setTimeout(() => {
            coracao.remove();
        }, 5000);
    }
}


/* =========================================================
   CONVERSA SIMULADA
========================================================= */

const mensagensConversa = [
    { lado: "ela", video: true },
    { lado: "eu", texto: "Nossa Hungria slk muitooo bomm" },
    { lado: "eu", texto: "Vc tbm gosta de Hungria?" },
    { lado: "ela", resposta: "Vc tbm gosta de Hungria?", texto: "Simmm" },
    { lado: "ela", texto: "lgc kakkakaka" },
    { lado: "ela", texto: "Meu sonho é dirigir num civic g10 preto de noite escutando Hungria" },
    { lado: "eu", texto: "Meu sonho tbmm, nossa só de imaginar kkkkkkk" }
];

let indiceConversa = 0;
const chatConversa = document.getElementById("conversaChat");
const botaoProxima = document.getElementById("proximaConversa");
const botaoReiniciar = document.getElementById("reiniciarConversa");

function adicionarMensagem(mensagem) {
    if (!chatConversa) return;

    const linha = document.createElement("div");
    linha.className = "mensagem-linha " + mensagem.lado;

    if (mensagem.video) {
        linha.innerHTML = `
            <div class="conversa-video">
                <img src="image/capa-video.jpeg" alt="Vídeo do Hungria">
                <div class="conversa-play">▶</div>
                <div class="conversa-video-label">vídeo</div>
            </div>
        `;
    } else if (mensagem.resposta) {
        linha.innerHTML = `
            <div class="mensagem-balao">
                <div class="mensagem-resposta">
                    <div class="resposta-conteudo">
                        <strong>Você</strong>
                        ${mensagem.resposta}
                    </div>
                </div>
                ${mensagem.texto}
            </div>
        `;
    } else {
        linha.innerHTML = `<div class="mensagem-balao">${mensagem.texto}</div>`;
    }

    chatConversa.appendChild(linha);
    requestAnimationFrame(() => linha.classList.add("aparecer"));
    chatConversa.scrollTop = chatConversa.scrollHeight;
}

if (botaoProxima) {
    botaoProxima.addEventListener("click", () => {
        if (indiceConversa < mensagensConversa.length) {
            adicionarMensagem(mensagensConversa[indiceConversa]);
            indiceConversa++;

            if (indiceConversa === mensagensConversa.length) {
                botaoProxima.textContent = "Fim da conversa ❤️";
                botaoProxima.disabled = true;
                botaoProxima.style.opacity = "0.7";
            }
        }
    });
}

if (botaoReiniciar) {
    botaoReiniciar.addEventListener("click", () => {
        indiceConversa = 0;
        if (chatConversa) chatConversa.innerHTML = "";
        if (botaoProxima) {
            botaoProxima.textContent = "Próxima mensagem ❤️";
            botaoProxima.disabled = false;
            botaoProxima.style.opacity = "1";
        }
    });
}


/* =========================================================
   PLAYER SPOTIFY
========================================================= */

const spPlaylist = [
    { title: "Na Linha do Tempo", artist: "Raphael & Camilly", src: "music/musica1.mp3", cover: "image/foto1.jpg" },
    { title: "Nossa Música Especial", artist: "Raphael & Camilly", src: "music/musica2.mp3", cover: "image/foto2.jpg" }
];

let spIndex = 0;
const spAudio = document.getElementById("spAudio");

function carregarSpMusica(index) {
    if (!spAudio) return;
    spIndex = index;
    spAudio.src = spPlaylist[index].src;
    
    const titleEl = document.getElementById("spTitle");
    const artistEl = document.getElementById("spArtist");
    const coverEl = document.getElementById("spCover");
    
    if (titleEl) titleEl.innerText = spPlaylist[index].title;
    if (artistEl) artistEl.innerText = spPlaylist[index].artist;
    if (coverEl) coverEl.src = spPlaylist[index].cover;
    
    spAudio.load();
    destacarMusicaAtiva();
}

function toggleSpPlay() {
    if (!spAudio) return;
    const playIcon = document.getElementById("spPlayIcon");
    if (spAudio.paused) {
        spAudio.play().then(() => {
            if (playIcon) playIcon.className = "fa-solid fa-pause";
        }).catch(err => console.log(err));
    } else {
        spAudio.pause();
        if (playIcon) playIcon.className = "fa-solid fa-play";
    }
}

function mudarSpMusica(direcao) {
    if (direcao === 'next') {
        spIndex = (spIndex + 1) % spPlaylist.length;
    } else {
        spIndex = (spIndex - 1 + spPlaylist.length) % spPlaylist.length;
    }
    carregarSpMusica(spIndex);
    
    if (spAudio) {
        spAudio.play().then(() => {
            const playIcon = document.getElementById("spPlayIcon");
            if (playIcon) playIcon.className = "fa-solid fa-pause";
        }).catch(err => console.log(err));
    }
}

if (spAudio) {
    spAudio.ontimeupdate = function() {
        if (spAudio.duration) {
            const pct = (spAudio.currentTime / spAudio.duration) * 100;
            const bar = document.getElementById("spProgressBar");
            if (bar) bar.style.width = pct + "%";
            
            const cur = document.getElementById("spCurrentTime");
            const dur = document.getElementById("spDurationTime");
            if (cur) cur.innerText = formatSpTime(spAudio.currentTime);
            if (dur) dur.innerText = formatSpTime(spAudio.duration);
        }
    };
}

function seekSpAudio(e) {
    if (!spAudio || !spAudio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    spAudio.currentTime = pos * spAudio.duration;
}

function formatSpTime(s) {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function curtirSpotify(btn) {
    btn.style.transform = "scale(1.4)";
    setTimeout(() => btn.style.transform = "scale(1)", 200);
}

function renderizarListaSpotify() {
    const listaContainer = document.getElementById("spTrackList");
    if (!listaContainer) return;
    
    listaContainer.innerHTML = "";
    spPlaylist.forEach((musica, idx) => {
        const item = document.createElement("div");
        item.className = `sp-track-item ${idx === spIndex ? 'ativa' : ''}`;
        item.innerHTML = `
            <img src="${musica.cover}" alt="${musica.title}">
            <div class="sp-track-info">
                <strong>${musica.title}</strong>
                <span>${musica.artist}</span>
            </div>
            <span>♫</span>
        `;
        item.onclick = () => {
            carregarSpMusica(idx);
            if (spAudio) {
                spAudio.play().then(() => {
                    const playIcon = document.getElementById("spPlayIcon");
                    if (playIcon) playIcon.className = "fa-solid fa-pause";
                });
            }
        };
        listaContainer.appendChild(item);
    });
}

function destacarMusicaAtiva() {
    const itens = document.querySelectorAll(".sp-track-item");
    itens.forEach((item, idx) => {
        if (idx === spIndex) {
            item.classList.add("ativa");
        } else {
            item.classList.remove("ativa");
        }
    });
}

if (spPlaylist.length > 0) {
    carregarSpMusica(0);
    renderizarListaSpotify();
}


/* =========================================================
   JOGO DA MEMÓRIA
========================================================= */

function iniciarJogoDaMemoria() {
    const tabuleiro = document.getElementById("memoriaTabuleiro");
    if (!tabuleiro) return;

    const imagensCasal = [
        "image/foto12.jpeg",
        "image/foto13.jpeg",
        "image/foto14.jpeg",
        "image/foto15.jpeg",
        "image/foto16.jpg",
        "image/foto17.jpeg",
        "image/foto18.jpeg",
        "image/foto19.jpeg",
        "image/foto20.jpeg",
        "image/foto21.jpeg"
    ];

    const movimentosEl = document.getElementById("memoriaMovimentos");
    const paresEl = document.getElementById("memoriaPares");
    const tempoEl = document.getElementById("memoriaTempo");
    const statusEl = document.getElementById("memoriaStatus");
    const dificuldadeEl = document.getElementById("memoriaDificuldade");
    const reiniciarBtn = document.getElementById("memoriaReiniciar");
    const jogarNovamenteBtn = document.getElementById("memoriaJogarNovamente");
    const vitoriaEl = document.getElementById("memoriaVitoria");
    const resultadoEl = document.getElementById("memoriaResultado");

    let primeiraCarta = null;
    let segundaCarta = null;
    let bloqueado = false;
    let movimentos = 0;
    let paresEncontrados = 0;
    let cartasViradas = [];
    let inicio = null;
    let relogio = null;
    let jogoEncerrado = false;
    let totalPares = dificuldadeEl ? Number(dificuldadeEl.value) : 10;

    function embaralhar(lista) {
        for (let i = lista.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lista[i], lista[j]] = [lista[j], lista[i]];
        }
        return lista;
    }

    function formatarTempo(segundos) {
        const min = Math.floor(segundos / 60).toString().padStart(2, "0");
        const seg = (segundos % 60).toString().padStart(2, "0");
        return `${min}:${seg}`;
    }

    function atualizarTempoJogo() {
        if (!inicio || jogoEncerrado || !tempoEl) return;
        tempoEl.textContent = formatarTempo(Math.floor((Date.now() - inicio) / 1000));
    }

    function iniciarRelogio() {
        if (inicio) return;
        inicio = Date.now();
        relogio = window.setInterval(atualizarTempoJogo, 1000);
    }

    function pararRelogio() {
        if (relogio) window.clearInterval(relogio);
        relogio = null;
    }

    function atualizarPainel() {
        if (movimentosEl) movimentosEl.textContent = movimentos;
        if (paresEl) paresEl.textContent = `${paresEncontrados} / ${totalPares}`;
    }

    function virarCarta(carta) {
        if (
            bloqueado ||
            jogoEncerrado ||
            carta.classList.contains("virada") ||
            carta.classList.contains("encontrada")
        ) {
            return;
        }

        iniciarRelogio();
        carta.classList.add("virada");
        cartasViradas.push(carta);

        if (cartasViradas.length === 1) {
            primeiraCarta = carta;
            if (statusEl) statusEl.textContent = "Agora encontre a foto igual! ❤️";
            return;
        }

        segundaCarta = carta;
        movimentos++;
        atualizarPainel();

        if (primeiraCarta.dataset.par === segundaCarta.dataset.par) {
            primeiraCarta.classList.add("encontrada");
            segundaCarta.classList.add("encontrada");

            paresEncontrados++;
            cartasViradas = [];
            primeiraCarta = null;
            segundaCarta = null;

            atualizarPainel();

            if (statusEl) statusEl.textContent = "Boa! Você encontrou um par. 💖";

            if (paresEncontrados === totalPares) {
                jogoEncerrado = true;
                pararRelogio();
                atualizarTempoJogo();

                const segundos = Math.floor((Date.now() - inicio) / 1000);

                if (resultadoEl) {
                    resultadoEl.textContent =
                        `Você completou em ${movimentos} movimentos e ` +
                        `${formatarTempo(segundos)}. O amor venceu! ❤️`;
                }

                if (vitoriaEl) vitoriaEl.hidden = false;
                if (statusEl) statusEl.textContent = "Missão cumprida, casal! 🥹❤️";
            }
            return;
        }

        bloqueado = true;
        primeiraCarta.classList.add("errada");
        segundaCarta.classList.add("errada");

        if (statusEl) statusEl.textContent = "Quase! Essas fotos são diferentes. Tente de novo.";

        window.setTimeout(() => {
            primeiraCarta.classList.remove("virada", "errada");
            segundaCarta.classList.remove("virada", "errada");

            cartasViradas = [];
            primeiraCarta = null;
            segundaCarta = null;
            bloqueado = false;
        }, 850);
    }

    function criarCarta(foto, indice) {
        const carta = document.createElement("button");
        carta.type = "button";
        carta.className = "memoria-carta";
        carta.dataset.par = foto;
        carta.dataset.numero = indice + 1;
        carta.setAttribute("aria-label", "Carta fechada");

        carta.innerHTML = `
            <span class="memoria-carta-inner">
                <span class="memoria-verso" aria-hidden="true">❤️</span>
                <span class="memoria-frente">
                    <img src="${foto}" alt="Lembrança do casal" loading="lazy">
                </span>
            </span>
        `;

        carta.addEventListener("click", () => virarCarta(carta));
        return carta;
    }

    function resetarEIniciar() {
        pararRelogio();
        tabuleiro.innerHTML = "";

        primeiraCarta = null;
        segundaCarta = null;
        bloqueado = false;
        movimentos = 0;
        paresEncontrados = 0;
        cartasViradas = [];
        inicio = null;
        jogoEncerrado = false;

        if (tempoEl) tempoEl.textContent = "00:00";
        if (vitoriaEl) vitoriaEl.hidden = true;

        totalPares = dificuldadeEl ? Number(dificuldadeEl.value) : 10;

        if (statusEl) {
            statusEl.textContent = "Encontre os pares iguais para completar o jogo! ❤️";
        }

        const fotosSelecionadas = embaralhar([...imagensCasal]).slice(0, totalPares);
        const cartas = embaralhar([...fotosSelecionadas, ...fotosSelecionadas]);

        cartas.forEach((foto, indice) => {
            tabuleiro.appendChild(criarCarta(foto, indice));
        });

        atualizarPainel();
    }

    if (reiniciarBtn) reiniciarBtn.addEventListener("click", resetarEIniciar);
    if (jogarNovamenteBtn) jogarNovamenteBtn.addEventListener("click", resetarEIniciar);
    if (dificuldadeEl) dificuldadeEl.addEventListener("change", resetarEIniciar);

    resetarEIniciar();
}


/* =========================================================
   INICIAR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    atualizarTempo();
    iniciarJogoDaMemoria();
});
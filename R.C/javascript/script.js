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
   MENU MOBILE
========================================================= */

const menuMobile = document.getElementById("menuMobile");
const menuMobileBtn = document.getElementById("menuMobileBtn");
const fecharMenuBtn = document.getElementById("fecharMenuMobile");
const menuMobileOverlay = document.getElementById("menuMobileOverlay");


function abrirMenuMobile() {

    if (!menuMobile || !menuMobileOverlay) return;

    menuMobile.classList.add("aberto");
    menuMobileOverlay.classList.add("aberto");

    document.body.style.overflow = "hidden";
}


function fecharMenuMobile() {

    if (!menuMobile || !menuMobileOverlay) return;

    menuMobile.classList.remove("aberto");
    menuMobileOverlay.classList.remove("aberto");

    document.body.style.overflow = "";
}


if (menuMobileBtn) {

    menuMobileBtn.addEventListener("click", abrirMenuMobile);

}


if (fecharMenuBtn) {

    fecharMenuBtn.addEventListener("click", fecharMenuMobile);

}


if (menuMobileOverlay) {

    menuMobileOverlay.addEventListener("click", fecharMenuMobile);

}


/* ESC FECHA O MENU */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        fecharMenuMobile();
    }

});


/* =========================================================
   CONTADOR
========================================================= */

const dataNamoro = new Date(
    2026,
    2,
    29,
    0,
    0,
    0
);


function atualizarTempo() {

    const agora = new Date();

    let diferenca = agora - dataNamoro;

    if (diferenca < 0) {
        diferenca = 0;
    }

    const dias = Math.floor(
        diferenca / (1000 * 60 * 60 * 24)
    );

    diferenca %= (1000 * 60 * 60 * 24);

    const horas = Math.floor(
        diferenca / (1000 * 60 * 60)
    );

    diferenca %= (1000 * 60 * 60);

    const minutos = Math.floor(
        diferenca / (1000 * 60)
    );

    diferenca %= (1000 * 60);

    const segundos = Math.floor(
        diferenca / 1000
    );

    const tempo = document.getElementById("tempo");

    if (tempo) {

        tempo.textContent =
            `${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos ❤️`;

    }
}


setInterval(atualizarTempo, 1000);

atualizarTempo();


/* =========================================================
   EU TE AMO
========================================================= */

function euTeAmo() {

    const mensagem =
        document.getElementById("mensagem-amor");

    if (!mensagem) return;


    mensagem.innerHTML = `
        <p>Eu te amo mais do que consigo explicar. ❤️</p>
        <p>Você é uma das melhores partes da minha vida. ❤️</p>
    `;


    for (let i = 0; i < 15; i++) {

        const coracao =
            document.createElement("div");

        coracao.classList.add("coracao");

        coracao.textContent = "❤️";

        coracao.style.left =
            Math.random() * 100 + "vw";

        coracao.style.animationDuration =
            (3 + Math.random() * 2) + "s";

        coracao.style.fontSize =
            (18 + Math.random() * 20) + "px";

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

    {
        lado: "ela",
        video: true
    },

    {
        lado: "eu",
        texto: "Nossa Hungria slk muitooo bomm"
    },

    {
        lado: "eu",
        texto: "Vc tbm gosta de Hungria?"
    },

    {
        lado: "ela",
        resposta: "Vc tbm gosta de Hungria?",
        texto: "Simmm"
    },

    {
        lado: "ela",
        texto: "lgc kakkakaka"
    },

    {
        lado: "ela",
        texto: "Meu sonho é dirigir num civic g10 preto de noite escutando Hungria"
    },

    {
        lado: "eu",
        texto: "Meu sonho tbmm, nossa só de imaginar kkkkkkk"
    }

];


let indiceConversa = 0;

const chatConversa =
    document.getElementById("conversaChat");

const botaoProxima =
    document.getElementById("proximaConversa");

const botaoReiniciar =
    document.getElementById("reiniciarConversa");


function adicionarMensagem(mensagem) {

    if (!chatConversa) return;


    const linha =
        document.createElement("div");

    linha.className =
        "mensagem-linha " + mensagem.lado;


    /* =====================================================
       VÍDEO
    ===================================================== */

    if (mensagem.video) {

        linha.innerHTML = `

            <div class="conversa-video">

                <img
                    src="image/capa-video.jpeg"
                    alt="Vídeo do Hungria"
                >

                <div class="conversa-play">
                    ▶
                </div>

                <div class="conversa-video-label">
                    vídeo
                </div>

            </div>

        `;

    }


    /* =====================================================
       RESPOSTA
    ===================================================== */

    else if (mensagem.resposta) {

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

    }


    /* =====================================================
       MENSAGEM NORMAL
    ===================================================== */

    else {

        linha.innerHTML = `

            <div class="mensagem-balao">

                ${mensagem.texto}

            </div>

        `;

    }


    chatConversa.appendChild(linha);


    requestAnimationFrame(() => {

        linha.classList.add("aparecer");

    });


    chatConversa.scrollTop =
        chatConversa.scrollHeight;

}


/* =========================================================
   PRÓXIMA MENSAGEM
========================================================= */

if (botaoProxima) {

    botaoProxima.addEventListener("click", () => {

        if (
            indiceConversa <
            mensagensConversa.length
        ) {

            adicionarMensagem(
                mensagensConversa[indiceConversa]
            );

            indiceConversa++;


            if (
                indiceConversa ===
                mensagensConversa.length
            ) {

                botaoProxima.textContent =
                    "Fim da conversa ❤️";

                botaoProxima.disabled = true;

                botaoProxima.style.opacity = "0.7";

            }

        }

    });

}


/* =========================================================
   REINICIAR CONVERSA
========================================================= */

if (botaoReiniciar) {

    botaoReiniciar.addEventListener("click", () => {

        indiceConversa = 0;

        if (chatConversa) {
            chatConversa.innerHTML = "";
        }

        if (botaoProxima) {

            botaoProxima.textContent =
                "Próxima mensagem ❤️";

            botaoProxima.disabled = false;

            botaoProxima.style.opacity = "1";

        }

    });

}


/* =========================================================
   NOSSA CASA - PONTOS
========================================================= */

const pontosCasa =
    document.querySelectorAll(".casa-ponto");

const casaCard =
    document.getElementById("casaCard");

const cardTitulo =
    document.getElementById("cardTitulo");

const cardTexto =
    document.getElementById("cardTexto");

const cardImagem =
    document.getElementById("cardImagem");

const fecharCard =
    document.getElementById("fecharCard");


function abrirAmbiente(elemento) {

    if (!elemento || !casaCard) return;


    if (cardTitulo) {

        cardTitulo.textContent =
            elemento.dataset.titulo || "Nossa casa";

    }


    if (cardTexto) {

        cardTexto.textContent =
            elemento.dataset.texto || "";

    }


    if (
        cardImagem &&
        elemento.dataset.imagem
    ) {

        cardImagem.src =
            elemento.dataset.imagem;

        cardImagem.alt =
            elemento.dataset.titulo || "";

        cardImagem.classList.add("visivel");

    }


    casaCard.classList.add("aberto");

}


/* =========================================================
   PONTOS DA CASA
========================================================= */

pontosCasa.forEach(ponto => {

    ponto.addEventListener("click", () => {

        abrirAmbiente(ponto);

    });

});


/* =========================================================
   CARDS DOS AMBIENTES
========================================================= */

document
    .querySelectorAll(".ambiente")
    .forEach(ambiente => {

        ambiente.addEventListener("click", () => {

            abrirAmbiente(ambiente);

        });

    });


/* =========================================================
   FECHAR CARD
========================================================= */

if (fecharCard) {

    fecharCard.addEventListener("click", () => {

        if (casaCard) {

            casaCard.classList.remove("aberto");

        }

    });

}


/* =========================================================
   CLICAR FORA DO CARD
========================================================= */

if (casaCard) {

    document.addEventListener("click", event => {

        if (
            casaCard.classList.contains("aberto") &&
            !casaCard.contains(event.target) &&
            !event.target.closest(".casa-ponto") &&
            !event.target.closest(".ambiente")
        ) {

            casaCard.classList.remove("aberto");

        }

    });

}


/* =========================================================
   INICIAR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    atualizarTempo();

});
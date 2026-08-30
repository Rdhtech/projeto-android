/* =========================================
   NAVEGAÇÃO
========================================= */

function mostrarPagina(id) {

    const paginas = document.querySelectorAll(".pagina");

    paginas.forEach(pagina => {
        pagina.classList.remove("ativa");
    });

    const pagina = document.getElementById(id);

    if (pagina) {
        pagina.classList.add("ativa");
        window.scrollTo(0, 0);
    }

    fecharMenu();
}


/* =========================================
   MENU
========================================= */

const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

function fecharMenu() {

    if (!menuToggle || !siteNav) return;

    menuToggle.classList.remove("ativo");
    siteNav.classList.remove("menu-aberto");
    menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && siteNav) {

    menuToggle.addEventListener("click", () => {

        const estaAberto = siteNav.classList.toggle("menu-aberto");

        menuToggle.classList.toggle("ativo", estaAberto);
        menuToggle.setAttribute("aria-expanded", String(estaAberto));
    });

    document.addEventListener("click", event => {

        if (!event.target.closest("header")) {
            fecharMenu();
        }
    });
}


/* =========================================
   CONTADOR
========================================= */

const dataNamoro = new Date(2026, 2, 29, 0, 0, 0);

function atualizarTempo() {

    const agora = new Date();

    let diferenca = agora - dataNamoro;

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

        tempo.innerHTML =
            `${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos ❤️`;

    }
}

setInterval(atualizarTempo, 1000);

atualizarTempo();


/* =========================================
   EU TE AMO
========================================= */

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

        coracao.innerHTML = "❤️";

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


/* =========================================
   CONVERSA SIMULADA
========================================= */

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


    /* VÍDEO */

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


    /* RESPOSTA */

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


    /* MENSAGEM NORMAL */

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


/* PRÓXIMA */

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
            }

        }

    });

}


/* REINICIAR */

if (botaoReiniciar) {

    botaoReiniciar.addEventListener("click", () => {

        indiceConversa = 0;

        chatConversa.innerHTML = "";

        botaoProxima.textContent =
            "Próxima mensagem ❤️";

    });

}

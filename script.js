// ============================================================================
// ÍCONES E PINTURA DOS ÍCONES
// ============================================================================

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></svg>`,
  wallet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.5h14a2 2 0 0 1 2 2V19H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z"/></svg>`,
  history: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6Z"/><path d="M14 2v5h5"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.2M8.7 13.3l6.6 4.2"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  calendar: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M16 3v4M8 3v4M3 10h18"/>
  </svg>
`,

users: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
`,

hourglass: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 2h12M6 22h12"/>
    <path d="M8 2v5a4 4 0 0 0 2 3.5L12 12l2-1.5A4 4 0 0 0 16 7V2"/>
    <path d="M8 22v-5a4 4 0 0 1 2-3.5L12 12l2 1.5a4 4 0 0 1 2 3.5v5"/>
  </svg>
`,

back: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 12H5"/>
    <path d="m12 19-7-7 7-7"/>
  </svg>
`,

lock: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="10" width="16" height="11" rx="2"/>
    <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
  </svg>
`,

print: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 9V2h12v7"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
`,

trend: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3 17 6-6 4 4 8-8"/>
    <path d="M15 7h6v6"/>
  </svg>
`,

cash: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M6 9H5a1 1 0 0 0-1 1v1"/>
    <path d="M18 15h1a1 1 0 0 0 1-1v-1"/>
  </svg>
`,

pix: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="m12 3 4.5 4.5a3 3 0 0 0 4.2 0"/>
    <path d="m12 21-4.5-4.5a3 3 0 0 0-4.2 0"/>
    <path d="m3 12 4.5-4.5a3 3 0 0 1 4.2 0L16.2 12"/>
    <path d="m21 12-4.5 4.5a3 3 0 0 1-4.2 0L7.8 12"/>
  </svg>
`,

card: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M2 10h20"/>
    <path d="M6 15h4"/>
  </svg>
`
,
barcode: `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 5v14M7 5v14M10 5v14M14 5v14M17 5v14M21 5v14"/>
    <path d="M5 5v14M12 5v14M19 5v14" stroke-width=".8"/>
  </svg>
`
};

function paintIcons(root = document) {
  root.querySelectorAll("[data-ico]").forEach((node) => {
    const name = node.dataset.ico;
    if (ICONS[name]) node.innerHTML = ICONS[name];
  });
}

// ============================================================================
// PARTE 1
// CONFIGURAÇÃO DA API, ESTADO, AUTENTICAÇÃO E FUNÇÕES AUXILIARES
// ============================================================================


// ============================================================================
// CONFIGURAÇÃO DA API
// ============================================================================

/*
  CONFIGURAÇÃO DA API

  - No próprio computador: usa localhost.
  - No celular, conectado ao mesmo Wi-Fi e abrindo o front pelo IP do
    computador: usa automaticamente o mesmo IP na porta 3000.
  - Quando o backend estiver hospedado na internet, coloque a URL pública
    em URL_BACKEND_PRODUCAO, sem "/api" no final.

  Exemplo:
  const URL_BACKEND_PRODUCAO = "https://nogueira-api.onrender.com";
*/
const URL_BACKEND_PRODUCAO =
  "https://mercadinho-nogueira.onrender.com";

const API_BASE_URL = (() => {
  const protocolo = window.location.protocol;
  const hostname = window.location.hostname;

  const executandoNoComputador =
    hostname === "localhost" ||
    hostname === "127.0.0.1";

  const executandoNaRedeLocal =
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

  if (executandoNoComputador) {
    return "http://localhost:3000/api";
  }

  if (executandoNaRedeLocal) {
    return `http://${hostname}:3000/api`;
  }

  if (URL_BACKEND_PRODUCAO.trim()) {
    return `${URL_BACKEND_PRODUCAO.trim().replace(/\/+$/, "")}/api`;
  }

  /*
    Esta opção só funciona quando frontend e backend estão publicados
    no mesmo domínio, com as rotas da API disponíveis em "/api".
  */
  return `${protocolo}//${window.location.host}/api`;
})();

const TOKEN_KEY = "caderneta_token";
const USER_KEY = "caderneta_usuario";
const THEME_KEY = "caderneta_tema";


// ============================================================================
// MESES
// ============================================================================

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];


// ============================================================================
// ESTADO PRINCIPAL DO FRONT-END
// ============================================================================

const state = {
  usuario: null,

  paginaAtual: "inicio",

  contaAtual: null,

  historicoAtual: null,

  clienteSelecionado: null,

  contaPendenteSelecionada: null,

  compraEditando: null,

  formaPagamento: "DINHEIRO",

  dashboard: {
    ano: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
  },

  contas: {
    pesquisa: "",
    ordenacao: "mais_recente",
    pagina: 1,
    limite: 50,
  },

  historico: {
    pesquisa: "",
    pagina: 1,
    limite: 50,
  },

  relatorios: {
    periodo: "mes_atual",
    ano: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
  },

  produtos: {
    pesquisa: "",
    ativo: "true",
    pagina: 1,
    limite: 20,
    totalPaginas: 1,
    editando: null,
    escaneado: null,
  },
};


// ============================================================================
// FUNÇÕES AUXILIARES PARA ELEMENTOS HTML
// ============================================================================

function elemento(id) {
  return document.getElementById(id);
}


function elementos(seletor, raiz = document) {
  return Array.from(
    raiz.querySelectorAll(seletor),
  );
}


function definirTexto(id, valor) {
  const elementoHtml = elemento(id);

  if (!elementoHtml) {
    return;
  }

  elementoHtml.textContent =
    valor ?? "";
}


function definirOculto(id, oculto) {
  const elementoHtml = elemento(id);

  if (!elementoHtml) {
    return;
  }

  elementoHtml.hidden =
    Boolean(oculto);
}


function definirDesabilitado(
  id,
  desabilitado,
  titulo = "",
) {
  const elementoHtml = elemento(id);

  if (!elementoHtml) {
    return;
  }

  elementoHtml.disabled =
    Boolean(desabilitado);

  elementoHtml.title =
    titulo;
}


// ============================================================================
// PROTEÇÃO DE TEXTOS INSERIDOS NO HTML
//
// Evita que dados recebidos da API sejam interpretados como código HTML.
// ============================================================================

function escaparHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// ============================================================================
// INICIAIS DO NOME
//
// Exemplo:
// João da Silva → JS
// ============================================================================

function obterIniciais(nome = "") {
  const partes = nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (partes.length === 0) {
    return "—";
  }

  return partes
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}


// ============================================================================
// CONVERSÃO DE NÚMEROS
// ============================================================================

function converterNumero(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return 0;
  }

  return numero;
}


// ============================================================================
// FORMATAÇÃO DE MOEDA
// ============================================================================

function formatarMoeda(valor) {
  return converterNumero(valor)
    .toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      },
    );
}


// ============================================================================
// FORMATAÇÃO DE DATA
// ============================================================================

function formatarData(valor) {
  if (!valor) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      timeZone:
        "America/Manaus",

      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "numeric",
    },
  ).format(
    new Date(valor),
  );
}


// ============================================================================
// FORMATAÇÃO DE HORA
// ============================================================================

function formatarHora(valor) {
  if (!valor) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      timeZone:
        "America/Manaus",

      hour:
        "2-digit",

      minute:
        "2-digit",

      hour12:
        false,
    },
  ).format(
    new Date(valor),
  );
}


// ============================================================================
// FORMATAÇÃO DE DATA E HORA
// ============================================================================

function formatarDataHora(valor) {
  if (!valor) {
    return "—";
  }

  return (
    `${formatarData(valor)}, ` +
    `às ${formatarHora(valor)}`
  );
}


// ============================================================================
// FORMATAÇÃO DE COMPETÊNCIA
//
// Exemplo:
// ano = 2026
// mes = 7
// resultado = Julho de 2026
// ============================================================================

function formatarCompetencia(
  ano,
  mes,
) {
  const nomeMes =
    MESES[mes - 1] || "";

  const mesFormatado =
    nomeMes.charAt(0).toUpperCase() +
    nomeMes.slice(1);

  return `${mesFormatado} de ${ano}`;
}


// ============================================================================
// CONVERTER VALOR DIGITADO PARA NÚMERO
//
// Exemplos:
// 12,50 → 12.5
// 1.200,50 → 1200.5
// ============================================================================

function converterValorInput(valor) {
  const texto =
    String(valor ?? "").trim();

  if (!texto) {
    return Number.NaN;
  }

  if (texto.includes(",")) {
    return Number(
      texto
        .replace(/\./g, "")
        .replace(",", "."),
    );
  }

  return Number(texto);
}


// ============================================================================
// FORMATAR FORMA DE PAGAMENTO
// ============================================================================

function formatarFormaPagamento(forma) {
  const formas = {
    DINHEIRO:
      "Dinheiro",

    PIX:
      "Pix",

    CARTAO:
      "Cartão",
  };

  return formas[forma] || forma || "—";
}


// ============================================================================
// FORMATAR STATUS DA CONTA
// ============================================================================

function formatarStatusConta(status) {
  const statusDisponiveis = {
    ABERTA:
      "Aberta",

    FECHADA:
      "Fechada",

    PAGA:
      "Paga",

    CANCELADA:
      "Cancelada",
  };

  return (
    statusDisponiveis[status] ||
    status ||
    "—"
  );
}


// ============================================================================
// MENSAGENS DO SISTEMA
// ============================================================================

function mostrarToast(
  mensagem,
  icone = "check",
) {
  const toast =
    elemento("toast");

  if (!toast) {
    console.log(mensagem);
    return;
  }

  toast.innerHTML = `
    <span class="ico">
      ${ICONS[icone] || ""}
    </span>

    <span>
      ${escaparHtml(mensagem)}
    </span>
  `;

  toast.classList.add(
    "is-show",
  );

  clearTimeout(
    mostrarToast.timeout,
  );

  mostrarToast.timeout =
    setTimeout(
      () => {
        toast.classList.remove(
          "is-show",
        );
      },
      3000,
    );
}


// ============================================================================
// TOKEN JWT
// ============================================================================

function obterToken() {
  return localStorage.getItem(
    TOKEN_KEY,
  );
}


function salvarSessao(
  token,
  usuario,
) {
  localStorage.setItem(
    TOKEN_KEY,
    token,
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(usuario),
  );

  state.usuario =
    usuario;
}


function limparSessao() {
  localStorage.removeItem(
    TOKEN_KEY,
  );

  localStorage.removeItem(
    USER_KEY,
  );

  state.usuario =
    null;
}


function carregarUsuarioSalvo() {
  try {
    const usuarioSalvo =
      localStorage.getItem(
        USER_KEY,
      );

    state.usuario =
      usuarioSalvo
        ? JSON.parse(usuarioSalvo)
        : null;
  } catch (erro) {
    state.usuario =
      null;

    localStorage.removeItem(
      USER_KEY,
    );
  }
}


// ============================================================================
// FUNÇÃO PRINCIPAL PARA ACESSAR A API
// ============================================================================

async function api(
  rota,
  opcoes = {},
) {
  const token =
    obterToken();

  const cabecalhos =
    new Headers(
      opcoes.headers || {},
    );

  if (
    !(opcoes.body instanceof FormData)
  ) {
    cabecalhos.set(
      "Content-Type",
      "application/json",
    );
  }

  if (token) {
    cabecalhos.set(
      "Authorization",
      `Bearer ${token}`,
    );
  }

  let resposta;

  try {
    resposta = await fetch(
      `${API_BASE_URL}${rota}`,
      {
        ...opcoes,
        headers:
          cabecalhos,
      },
    );
  } catch (erro) {
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se o backend está ligado.",
    );
  }

  // Se o token estiver vencido ou inválido.
  if (resposta.status === 401) {
    limparSessao();

    if (
      !window.location.pathname.endsWith(
        "login.html",
      )
    ) {
      window.location.href =
        "login.html";
    }

    throw new Error(
      "Sua sessão expirou. Entre novamente.",
    );
  }

  const tipoConteudo =
    resposta.headers.get(
      "content-type",
    ) || "";

  // Respostas em PDF não podem ser convertidas para JSON.
  if (
    tipoConteudo.includes(
      "application/pdf",
    )
  ) {
    if (!resposta.ok) {
      throw new Error(
        "Não foi possível gerar o PDF.",
      );
    }

    return resposta;
  }

  let resultado = null;

  try {
    resultado =
      await resposta.json();
  } catch (erro) {
    resultado =
      null;
  }

  if (!resposta.ok) {
    const erro =
      new Error(
        resultado?.mensagem ||
          `Erro ${resposta.status} ao acessar o servidor.`,
      );

    erro.status =
      resposta.status;

    erro.codigo =
      resultado?.codigo;

    erro.detalhes =
      resultado?.detalhes;

    throw erro;
  }

  return resultado;
}


// ============================================================================
// CARREGAR USUÁRIO DA SESSÃO
// ============================================================================

async function carregarUsuarioAtual() {
  const resultado =
    await api(
      "/auth/me",
    );

  state.usuario =
    resultado.dados.usuario;

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(
      state.usuario,
    ),
  );

  atualizarInformacoesUsuario();
}


// ============================================================================
// MOSTRAR DADOS DO USUÁRIO NA INTERFACE
// ============================================================================

function atualizarInformacoesUsuario() {
  if (!state.usuario) {
    return;
  }

  const nome =
    state.usuario.nome ||
    state.usuario.usuario ||
    "Usuário";

  const perfil =
    state.usuario.perfil ===
    "ADMINISTRADOR"
      ? "Administrador"
      : "Atendente";

  elementos(
    ".mini-profile strong",
  ).forEach(
    (elementoHtml) => {
      elementoHtml.textContent =
        nome;
    },
  );

  elementos(
    ".mini-profile small",
  ).forEach(
    (elementoHtml) => {
      elementoHtml.textContent =
        perfil;
    },
  );

  elementos(
    ".avatar",
  ).forEach(
    (elementoHtml) => {
      elementoHtml.textContent =
        obterIniciais(nome);
    },
  );

  const perfilNome =
    elemento("perfilNome");

  if (perfilNome) {
    perfilNome.value =
      nome;
  }

  const emailPerfil =
    document.querySelector(
      ".profile-card .muted",
    );

  if (emailPerfil) {
    emailPerfil.textContent =
      state.usuario.email ||
      state.usuario.usuario ||
      "";
  }
}


// ============================================================================
// DEBOUNCE
//
// Evita chamar a API a cada tecla pressionada.
// ============================================================================

function debounce(
  callback,
  tempo = 300,
) {
  let timeout;

  return (...argumentos) => {
    clearTimeout(timeout);

    timeout = setTimeout(
      () => {
        callback(...argumentos);
      },
      tempo,
    );
  };
}


// ============================================================================
// ESTADO DE CARREGAMENTO DOS BOTÕES
// ============================================================================

function definirCarregamentoBotao(
  botao,
  carregando,
  textoCarregando =
    "Carregando...",
) {
  if (!botao) {
    return;
  }

  if (carregando) {
    botao.dataset.textoOriginal =
      botao.innerHTML;

    botao.disabled =
      true;

    botao.textContent =
      textoCarregando;

    return;
  }

  botao.disabled =
    false;

  if (
    botao.dataset.textoOriginal
  ) {
    botao.innerHTML =
      botao.dataset.textoOriginal;

    delete botao.dataset
      .textoOriginal;

    paintIcons(botao);
  }
}


// ============================================================================
// ABRIR E FECHAR MODAIS
// ============================================================================

function abrirModal(modal) {
  if (!modal) {
    return;
  }

  modal.hidden = false;
  modal.removeAttribute("aria-hidden");
  modal.classList.add("is-open");
  paintIcons(modal);

  const primeiroCampo = modal.querySelector(
    "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled])",
  );

  if (primeiroCampo) {
    window.setTimeout(() => primeiroCampo.focus(), 50);
  }
}


function fecharModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modal.hidden = true;
}


// ============================================================================
// EVENTOS PADRÃO DOS MODAIS
// ============================================================================

elementos(
  ".modal-overlay",
).forEach(
  (modal) => {
    modal.addEventListener(
      "click",
      (evento) => {
        if (
          evento.target === modal
        ) {
          fecharModal(modal);
        }
      },
    );

    elementos(
      "[data-close]",
      modal,
    ).forEach(
      (botao) => {
        botao.addEventListener(
          "click",
          () => {
            fecharModal(modal);
          },
        );
      },
    );
  },
);

// ============================================================================
// PARTE 2
// NAVEGAÇÃO, MENU MOBILE, TEMA E LOGOUT
// ============================================================================


// ============================================================================
// TÍTULOS DAS PÁGINAS
// ============================================================================

const TITULOS_PAGINAS = {
  inicio: {
    titulo: "Início",
    subtitulo: "Visão geral da sua loja",
  },

  contas: {
    titulo: "Contas",
    subtitulo: "Contas abertas e fechadas aguardando pagamento",
  },

  "conta-detalhe": {
    titulo: "Detalhes da conta",
    subtitulo: "Compras e movimentações desta conta",
  },

  historico: {
    titulo: "Histórico",
    subtitulo: "Contas que já foram pagas",
  },

  "historico-detalhe": {
    titulo: "Detalhes do histórico",
    subtitulo: "Consulta da conta finalizada",
  },

  relatorios: {
    titulo: "Relatórios",
    subtitulo: "Desempenho financeiro da loja",
  },

  produtos: {
    titulo: "Produtos",
    subtitulo: "Cadastro, preços e códigos de barras",
  },

  configuracoes: {
    titulo: "Configurações",
    subtitulo: "Preferências da loja e do sistema",
  },

  perfil: {
    titulo: "Perfil",
    subtitulo: "Dados do usuário conectado",
  },
};


// ============================================================================
// IR PARA UMA PÁGINA
// ============================================================================

async function irParaPagina(nomePagina) {
  const paginaDestino =
    elemento(`page-${nomePagina}`);

  if (!paginaDestino) {
    console.error(
      `Página não encontrada: ${nomePagina}`,
    );

    return;
  }

  // Esconde todas as páginas.
  elementos(".page").forEach(
    (pagina) => {
      pagina.classList.remove(
        "is-active",
      );
    },
  );

  // Mostra a página escolhida.
  paginaDestino.classList.add(
    "is-active",
  );

  // Atualiza o menu lateral.
  elementos(
    ".nav-item[data-page]",
  ).forEach(
    (botao) => {
      botao.classList.toggle(
        "is-active",
        botao.dataset.page ===
          nomePagina,
      );
    },
  );

  // Atualiza o menu inferior mobile.
  elementos(
    ".bn-item[data-page]",
  ).forEach(
    (botao) => {
      botao.classList.toggle(
        "is-active",
        botao.dataset.page ===
          nomePagina,
      );
    },
  );

  const configuracaoPagina =
    TITULOS_PAGINAS[
      nomePagina
    ] || {
      titulo: "",
      subtitulo: "",
    };

  definirTexto(
    "pageTitle",
    configuracaoPagina.titulo,
  );

  definirTexto(
    "pageSubtitle",
    configuracaoPagina.subtitulo,
  );

  state.paginaAtual =
    nomePagina;

  fecharMenuMais();

  try {
    /*
      Essas funções serão criadas nas próximas partes.

      O typeof evita erro enquanto elas ainda não foram adicionadas.
    */

    if (
      nomePagina === "inicio" &&
      typeof carregarDashboard ===
        "function"
    ) {
      await carregarDashboard();
    }

    if (
      nomePagina === "contas" &&
      typeof carregarContas ===
        "function"
    ) {
      await carregarContas();
    }

    if (
      nomePagina ===
        "historico" &&
      typeof carregarHistorico ===
        "function"
    ) {
      await carregarHistorico();
    }

    if (
      nomePagina ===
        "relatorios" &&
      typeof carregarRelatorios ===
        "function"
    ) {
      await carregarRelatorios();
    }

    if (
      nomePagina === "produtos" &&
      typeof carregarProdutos === "function"
    ) {
      if (state.usuario?.perfil !== "ADMINISTRADOR") {
        mostrarToast("Somente administradores podem acessar produtos.", "close");
        return irParaPagina("inicio");
      }
      await carregarProdutos();
    }

    if (
      nomePagina ===
        "configuracoes" &&
      typeof carregarConfiguracoes ===
        "function"
    ) {
      await carregarConfiguracoes();
    }

    if (
      nomePagina === "perfil"
    ) {
      atualizarInformacoesUsuario();
    }
  } catch (erro) {
    console.error(erro);

    mostrarToast(
      erro.message ||
        "Não foi possível carregar a página.",
      "close",
    );
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


// ============================================================================
// EVENTOS DOS BOTÕES DE NAVEGAÇÃO
// ============================================================================

elementos(
  "[data-page]",
).forEach(
  (botao) => {
    botao.addEventListener(
      "click",
      () => {
        const pagina =
          botao.dataset.page;

        if (pagina) {
          irParaPagina(
            pagina,
          );
        }
      },
    );
  },
);


// ============================================================================
// BOTÕES DE VOLTAR
// ============================================================================

elementos(
  "[data-back]",
).forEach(
  (botao) => {
    botao.addEventListener(
      "click",
      () => {
        const pagina =
          botao.dataset.back;

        if (pagina) {
          irParaPagina(
            pagina,
          );
        }
      },
    );
  },
);


// ============================================================================
// MENU "MAIS" NO CELULAR
// ============================================================================

const menuMaisOverlay =
  elemento("maisOverlay");


function abrirMenuMais() {
  if (!menuMaisOverlay) {
    return;
  }

  menuMaisOverlay.classList.add(
    "is-open",
  );

  paintIcons(
    menuMaisOverlay,
  );
}


function fecharMenuMais() {
  if (!menuMaisOverlay) {
    return;
  }

  menuMaisOverlay.classList.remove(
    "is-open",
  );
}


const botaoMais =
  elemento("btnMais");

if (botaoMais) {
  botaoMais.addEventListener(
    "click",
    abrirMenuMais,
  );
}


if (menuMaisOverlay) {
  menuMaisOverlay.addEventListener(
    "click",
    (evento) => {
      if (
        evento.target ===
        menuMaisOverlay
      ) {
        fecharMenuMais();
      }
    },
  );
}


// ============================================================================
// TEMA CLARO E ESCURO
// ============================================================================

function aplicarTema(tema) {
  const temaValido =
    tema === "dark"
      ? "dark"
      : "light";

  document.documentElement
    .setAttribute(
      "data-theme",
      temaValido,
    );

  localStorage.setItem(
    THEME_KEY,
    temaValido,
  );

  const seletorTema =
    elemento(
      "darkModeToggle",
    );

  if (seletorTema) {
    seletorTema.checked =
      temaValido === "dark";
  }
}


function carregarTemaSalvo() {
  const temaSalvo =
    localStorage.getItem(
      THEME_KEY,
    );

  if (temaSalvo) {
    aplicarTema(
      temaSalvo,
    );

    return;
  }

  /*
    Caso ainda não exista preferência salva,
    usa o tema configurado no sistema operacional.
  */

  const prefereEscuro =
    window.matchMedia &&
    window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

  aplicarTema(
    prefereEscuro
      ? "dark"
      : "light",
  );
}


const seletorTema =
  elemento(
    "darkModeToggle",
  );

if (seletorTema) {
  seletorTema.addEventListener(
    "change",
    (evento) => {
      aplicarTema(
        evento.target.checked
          ? "dark"
          : "light",
      );
    },
  );
}


// ============================================================================
// MODAL DE SAÍDA
// ============================================================================

const modalSair =
  elemento("modalSair");


const botaoSair =
  elemento("btnSair");


const botaoSairMais =
  elemento("btnSairMais");


const botaoConfirmarSair =
  elemento(
    "btnConfirmarSair",
  );


if (botaoSair) {
  botaoSair.addEventListener(
    "click",
    () => {
      abrirModal(
        modalSair,
      );
    },
  );
}


if (botaoSairMais) {
  botaoSairMais.addEventListener(
    "click",
    () => {
      fecharMenuMais();

      abrirModal(
        modalSair,
      );
    },
  );
}


// ============================================================================
// REALIZAR LOGOUT
// ============================================================================

async function realizarLogout() {
  try {
    /*
      Tenta avisar o backend que o usuário saiu.

      Mesmo que essa chamada falhe, a sessão local será apagada.
    */

    if (obterToken()) {
      await api(
        "/auth/logout",
        {
          method: "POST",
        },
      );
    }
  } catch (erro) {
    console.warn(
      "Não foi possível registrar o logout no servidor:",
      erro.message,
    );
  } finally {
    limparSessao();

    fecharModal(
      modalSair,
    );

    window.location.href =
      "login.html";
  }
}


if (botaoConfirmarSair) {
  botaoConfirmarSair.addEventListener(
    "click",
    realizarLogout,
  );
}


// ============================================================================
// ATUALIZAR PERFIL VISUAL
// ============================================================================

function atualizarPerfilVisual() {
  atualizarInformacoesUsuario();

  if (!state.usuario) {
    return;
  }

  const campoNome =
    elemento("perfilNome");

  if (campoNome) {
    campoNome.value =
      state.usuario.nome || "";
  }

  const campoTelefone =
    elemento(
      "perfilTelefone",
    );

  /*
    A tabela de usuários atual ainda não possui telefone.

    Por isso, o campo permanece vazio até adicionarmos essa informação
    ao banco ou utilizarmos o telefone da loja.
  */

  if (campoTelefone) {
    campoTelefone.value =
      state.usuario.telefone || "";
  }
}


// ============================================================================
// PROTEGER A PÁGINA
// ============================================================================

function verificarSessaoAntesDeIniciar() {
  const token =
    obterToken();

  if (!token) {
    window.location.href =
      "login.html";

    return false;
  }

  return true;
}


// ============================================================================
// INICIALIZAÇÃO VISUAL DESTA PARTE
// ============================================================================

function iniciarInterfaceBasica() {
  paintIcons();

  carregarTemaSalvo();

  carregarUsuarioSalvo();

  atualizarPerfilVisual();
}

// ============================================================================
// PARTE 3
// DASHBOARD / PÁGINA INICIAL
// ============================================================================


// ============================================================================
// ATUALIZAR TEXTO E BOTÕES DO MÊS
// ============================================================================

function atualizarNavegacaoMesDashboard() {
  definirTexto(
    "homeMonthLabel",
    formatarCompetencia(
      state.dashboard.ano,
      state.dashboard.mes,
    ),
  );

  const dataAtual =
    new Date();

  const anoAtual =
    dataAtual.getFullYear();

  const mesAtual =
    dataAtual.getMonth() + 1;

  const estaNoMesAtual =
    state.dashboard.ano === anoAtual &&
    state.dashboard.mes === mesAtual;

  definirDesabilitado(
    "btnMesProximo",
    estaNoMesAtual,
    estaNoMesAtual
      ? "Você já está no mês atual."
      : "",
  );

  definirOculto(
    "btnMesAtual",
    estaNoMesAtual,
  );
}


// ============================================================================
// CARREGAR DASHBOARD
// ============================================================================

async function carregarDashboard() {
  atualizarNavegacaoMesDashboard();

  const parametros =
    new URLSearchParams({
      ano:
        state.dashboard.ano,

      mes:
        state.dashboard.mes,
    });

  const resultado =
    await api(
      `/dashboard?${parametros.toString()}`,
    );

  const dados =
    resultado.dados || {};

  const cards =
    dados.cards || {};

  const movimentacoes =
    dados.ultimas_movimentacoes || [];

  renderizarCardsDashboard(
    cards,
  );

  renderizarUltimasMovimentacoes(
    movimentacoes,
  );
}


// ============================================================================
// RENDERIZAR CARDS DO DASHBOARD
// ============================================================================

function renderizarCardsDashboard(
  cards,
) {
  definirTexto(
    "statClientes",
    cards.clientes_cadastrados ?? 0,
  );

  definirTexto(
    "statAReceber",
    formatarMoeda(
      cards.total_a_receber,
    ),
  );

  definirTexto(
    "statConcluidos",
    formatarMoeda(
      cards.total_recebido,
    ),
  );

  definirTexto(
    "statAReceberMes",
    `${
      cards.contas_abertas ?? 0
    } aberta(s) e ${
      cards.contas_fechadas ?? 0
    } fechada(s)`,
  );

  definirTexto(
    "statConcluidosMes",
    `${
      cards.pagamentos_concluidos ?? 0
    } pagamento(s) concluído(s)`,
  );
}


// ============================================================================
// RENDERIZAR AS ÚLTIMAS CINCO MOVIMENTAÇÕES
// ============================================================================

function renderizarUltimasMovimentacoes(
  movimentacoes,
) {
  const lista =
    elemento("movesList");

  if (!lista) {
    return;
  }

  if (
    movimentacoes.length === 0
  ) {
    lista.innerHTML = `
      <div class="empty-state">

        <span
          class="ico ico-lg"
          data-ico="wallet"
        ></span>

        <h3>
          Nenhuma movimentação recente
        </h3>

        <p>
          As contas com novas compras aparecerão aqui.
        </p>

      </div>
    `;

    paintIcons(lista);

    return;
  }

  lista.innerHTML =
    movimentacoes
      .map(
        (movimentacao) => {
          const nomeCliente =
            movimentacao.cliente_nome ||
            "Cliente";

          const descricao =
            movimentacao.ultima_descricao ||
            movimentacao.descricao ||
            "Compra registrada";

          const valorUltimaCompra =
            movimentacao.ultimo_valor ??
            movimentacao.valor ??
            0;

          const dataUltimaCompra =
            movimentacao.ultima_movimentacao ||
            movimentacao.data_compra;

          const totalConta =
            movimentacao.total_conta ??
            0;

          return `
            <div class="move-item">

              <div class="move-main">

                <span class="move-avatar">
                  ${escaparHtml(
                    obterIniciais(
                      nomeCliente,
                    ),
                  )}
                </span>

                <div class="move-text">

                  <strong>
                    ${escaparHtml(
                      nomeCliente,
                    )}
                  </strong>

                  <span>
                    ${escaparHtml(
                      descricao,
                    )}
                  </span>

                  <small>
                    Última compra:
                    ${formatarMoeda(
                      valorUltimaCompra,
                    )}
                    ·
                    ${formatarDataHora(
                      dataUltimaCompra,
                    )}
                  </small>

                </div>

              </div>

              <div class="move-right">

                <strong>
                  Total:
                  ${formatarMoeda(
                    totalConta,
                  )}
                </strong>

                <button
                  class="btn btn-secondary"
                  data-open-acc="${
                    movimentacao.conta_id
                  }"
                >
                  Ver conta
                </button>

              </div>

            </div>
          `;
        },
      )
      .join("");

  conectarBotoesAbrirConta(
    lista,
  );
}


// ============================================================================
// CONECTAR BOTÕES "VER CONTA"
//
// A função abrirDetalhesConta será criada na parte de contas.
// ============================================================================

function conectarBotoesAbrirConta(raiz) {
  elementos("[data-open-acc]", raiz).forEach((botao) => {
    botao.onclick = async () => {
      const contaId = botao.dataset.openAcc;

      if (!contaId || botao.dataset.loading === "true") {
        return;
      }

      botao.dataset.loading = "true";
      botao.disabled = true;

      try {
        await abrirDetalhesConta(contaId);
      } catch (erro) {
        console.error("Erro ao abrir conta:", erro);
        mostrarToast(
          erro.message || "Não foi possível abrir a conta.",
          "close",
        );
      } finally {
        delete botao.dataset.loading;
        botao.disabled = false;
      }
    };
  });
}


// ============================================================================
// MÊS ANTERIOR
// ============================================================================

const botaoMesAnterior =
  elemento(
    "btnMesAnterior",
  );

if (botaoMesAnterior) {
  botaoMesAnterior.addEventListener(
    "click",
    async () => {
      state.dashboard.mes -= 1;

      if (
        state.dashboard.mes < 1
      ) {
        state.dashboard.mes =
          12;

        state.dashboard.ano -=
          1;
      }

      try {
        await carregarDashboard();
      } catch (erro) {
        mostrarToast(
          erro.message ||
            "Não foi possível carregar o mês anterior.",
          "close",
        );
      }
    },
  );
}


// ============================================================================
// PRÓXIMO MÊS
//
// Nunca permite avançar além do mês atual.
// ============================================================================

const botaoMesProximo =
  elemento(
    "btnMesProximo",
  );

if (botaoMesProximo) {
  botaoMesProximo.addEventListener(
    "click",
    async () => {
      const dataAtual =
        new Date();

      const competenciaSelecionada =
        new Date(
          state.dashboard.ano,
          state.dashboard.mes - 1,
          1,
        );

      const competenciaAtual =
        new Date(
          dataAtual.getFullYear(),
          dataAtual.getMonth(),
          1,
        );

      if (
        competenciaSelecionada >=
        competenciaAtual
      ) {
        return;
      }

      state.dashboard.mes += 1;

      if (
        state.dashboard.mes > 12
      ) {
        state.dashboard.mes =
          1;

        state.dashboard.ano +=
          1;
      }

      try {
        await carregarDashboard();
      } catch (erro) {
        mostrarToast(
          erro.message ||
            "Não foi possível carregar o próximo mês.",
          "close",
        );
      }
    },
  );
}


// ============================================================================
// VOLTAR AO MÊS ATUAL
// ============================================================================

const botaoMesAtual =
  elemento(
    "btnMesAtual",
  );

if (botaoMesAtual) {
  botaoMesAtual.addEventListener(
    "click",
    async () => {
      const dataAtual =
        new Date();

      state.dashboard.ano =
        dataAtual.getFullYear();

      state.dashboard.mes =
        dataAtual.getMonth() + 1;

      try {
        await carregarDashboard();
      } catch (erro) {
        mostrarToast(
          erro.message ||
            "Não foi possível retornar ao mês atual.",
          "close",
        );
      }
    },
  );
}

// ============================================================================
// PARTE 4
// LISTAGEM DE CONTAS, PESQUISA E ORDENAÇÃO
// ============================================================================


// ============================================================================
// CARREGAR CONTAS
// ============================================================================

async function carregarContas() {
  const parametros =
    new URLSearchParams({
      pesquisa:
        state.contas.pesquisa,

      ordenacao:
        state.contas.ordenacao,

      pagina:
        state.contas.pagina,

      limite:
        state.contas.limite,
    });

  const resultado =
    await api(
      `/contas?${parametros.toString()}`,
    );

  const contas =
    resultado.dados || [];

  renderizarContas(
    contas,
  );
}


// ============================================================================
// CRIAR BADGE DE STATUS
// ============================================================================

function criarBadgeConta(status) {
  const classe =
    status === "FECHADA"
      ? "badge-closed"
      : "badge-open";

  return `
    <span class="badge ${classe}">
      ${escaparHtml(
        formatarStatusConta(
          status,
        ),
      )}
    </span>
  `;
}


// ============================================================================
// RENDERIZAR CONTAS
// ============================================================================

function renderizarContas(contas) {
  definirOculto(
    "contasEmpty",
    contas.length > 0,
  );

  const corpoTabela =
    elemento(
      "tableContasBody",
    );

  const listaMobile =
    elemento(
      "cardsContasMobile",
    );

  if (corpoTabela) {
    corpoTabela.innerHTML =
      contas
        .map(
          (conta) =>
            criarLinhaConta(
              conta,
            ),
        )
        .join("");
  }

  if (listaMobile) {
    listaMobile.innerHTML =
      contas
        .map(
          (conta) =>
            criarCardConta(
              conta,
            ),
        )
        .join("");
  }

  [
    corpoTabela,
    listaMobile,
  ]
    .filter(Boolean)
    .forEach(
      (raiz) => {
        conectarBotoesAbrirConta(
          raiz,
        );

        conectarBotoesAdicionarCompra(
          raiz,
        );
      },
    );
}


// ============================================================================
// CRIAR LINHA DA TABELA
// ============================================================================

function criarLinhaConta(conta) {
  const contaAberta =
    conta.status ===
    "ABERTA";

  const tituloBotao =
    contaAberta
      ? ""
      : "Conta fechada aguardando pagamento.";

  return `
    <tr>

      <td>
        <strong>
          ${escaparHtml(
            conta.cliente_nome,
          )}
        </strong>
      </td>

      <td>
        ${criarBadgeConta(
          conta.status,
        )}
      </td>

      <td>
        ${formatarData(
          conta.data_abertura,
        )}
      </td>

      <td>
        ${
          conta.ultima_compra
            ? formatarDataHora(
                conta.ultima_compra,
              )
            : "—"
        }
      </td>

      <td>
        ${
          conta.quantidade_registros ??
          0
        }
      </td>

      <td>
        <strong>
          ${formatarMoeda(
            conta.total_conta,
          )}
        </strong>
      </td>

      <td>

        <div class="row-actions">

          <button
            class="btn btn-secondary"
            data-open-acc="${
              conta.id
            }"
          >
            Ver conta
          </button>

          <button
            class="btn btn-primary"
            data-add-compra="${
              conta.id
            }"
            ${
              contaAberta
                ? ""
                : "disabled"
            }
            title="${tituloBotao}"
          >
            ${
              contaAberta
                ? "Adicionar compra"
                : "Fechada"
            }
          </button>

        </div>

      </td>

    </tr>
  `;
}


// ============================================================================
// CRIAR CARD MOBILE
// ============================================================================

function criarCardConta(conta) {
  const contaAberta =
    conta.status ===
    "ABERTA";

  return `
    <div class="item-card">

      <div class="item-card-top">

        <strong>
          ${escaparHtml(
            conta.cliente_nome,
          )}
        </strong>

        <span class="value">
          ${formatarMoeda(
            conta.total_conta,
          )}
        </span>

      </div>

      <p>
        ${criarBadgeConta(
          conta.status,
        )}
      </p>

      <p>
        Conta aberta em
        ${formatarData(
          conta.data_abertura,
        )}
      </p>

      <p>
        ${
          conta.ultima_compra
            ? `Última compra: ${formatarDataHora(
                conta.ultima_compra,
              )}`
            : "Sem compras registradas"
        }
      </p>

      <p>
        ${
          conta.quantidade_registros ??
          0
        }
        registro(s)
      </p>

      <div class="item-actions">

        <button
          class="btn btn-secondary"
          data-open-acc="${
            conta.id
          }"
        >
          Ver conta
        </button>

        <button
          class="btn btn-primary"
          data-add-compra="${
            conta.id
          }"
          ${
            contaAberta
              ? ""
              : "disabled"
          }
        >
          ${
            contaAberta
              ? "Adicionar compra"
              : "Fechada"
          }
        </button>

      </div>

    </div>
  `;
}


// ============================================================================
// CONECTAR BOTÕES "ADICIONAR COMPRA"
//
// A função abrirModalCompra será criada na próxima parte.
// ============================================================================

function conectarBotoesAdicionarCompra(raiz) {
  elementos("[data-add-compra]", raiz).forEach((botao) => {
    botao.onclick = (evento) => {
      evento.stopPropagation();

      if (botao.disabled) {
        return;
      }

      const contaId = botao.dataset.addCompra;

      if (!contaId) {
        mostrarToast("A conta não foi identificada.", "close");
        return;
      }

      abrirModalCompra(contaId);
    };
  });
}


// ============================================================================
// PESQUISAR CONTAS
// ============================================================================

const campoPesquisaContas =
  elemento(
    "searchContas",
  );

if (campoPesquisaContas) {
  campoPesquisaContas.addEventListener(
    "input",
    debounce(
      async (evento) => {
        state.contas.pesquisa =
          evento.target.value.trim();

        state.contas.pagina =
          1;

        try {
          await carregarContas();
        } catch (erro) {
          mostrarToast(
            erro.message ||
              "Não foi possível pesquisar as contas.",
            "close",
          );
        }
      },
      350,
    ),
  );
}


// ============================================================================
// ORDENAR CONTAS
// ============================================================================

const seletorOrdenacaoContas =
  elemento(
    "sortContas",
  );

if (seletorOrdenacaoContas) {
  seletorOrdenacaoContas.addEventListener(
    "change",
    async (evento) => {
      state.contas.ordenacao =
        evento.target.value;

      state.contas.pagina =
        1;

      try {
        await carregarContas();
      } catch (erro) {
        mostrarToast(
          erro.message ||
            "Não foi possível ordenar as contas.",
          "close",
        );
      }
    },
  );
}


// ============================================================================
// GARANTIR VALOR CORRETO DO SELECT
//
// O backend aceita:
//
// mais_recente
// mais_antiga
// maior_valor
// menor_valor
// ============================================================================

if (seletorOrdenacaoContas) {
  seletorOrdenacaoContas.value =
    state.contas.ordenacao;
}

// ============================================================================
// PARTE 5
// DETALHES DA CONTA, ADICIONAR, EDITAR E EXCLUIR COMPRAS
// ============================================================================


// ============================================================================
// ABRIR DETALHES DA CONTA
// ============================================================================

async function abrirDetalhesConta(contaId) {
  const resultado =
    await api(
      `/contas/${contaId}`,
    );

  const dados =
    resultado.dados;

  const conta =
    dados.conta;

  const compras =
    dados.compras || [];

  state.contaAtual =
    conta;

  definirTexto(
    "dcNome",
    conta.cliente_nome,
  );

  definirTexto(
    "dcMeta",
    `Aberta em ${formatarData(
      conta.data_abertura,
    )} · Última movimentação: ${
      conta.ultima_compra
        ? formatarDataHora(
            conta.ultima_compra,
          )
        : "—"
    }`,
  );

  definirTexto(
    "dcTotal",
    formatarMoeda(
      conta.total_conta,
    ),
  );

  const contaFechada =
    conta.status ===
    "FECHADA";

  definirOculto(
    "dcClosedBanner",
    !contaFechada,
  );

  definirDesabilitado(
    "btnAddCompra",
    !dados.pode_adicionar_compra,
    contaFechada
      ? "Esta conta está fechada e não aceita novas compras."
      : "",
  );

  const contaSemCompras =
    converterNumero(
      conta.total_conta,
    ) <= 0;

  definirDesabilitado(
    "btnConcluirPagamento",
    !dados.pode_concluir_pagamento ||
      contaSemCompras,
    contaSemCompras
      ? "Adicione pelo menos uma compra antes de concluir o pagamento."
      : "",
  );

  renderizarComprasConta(
    compras,
    conta.status,
  );

  await irParaPagina(
    "conta-detalhe",
  );
}


// ============================================================================
// RENDERIZAR COMPRAS DA CONTA
// ============================================================================

function renderizarComprasConta(
  compras,
  statusConta,
) {
  const lista =
    elemento(
      "purchasesList",
    );

  if (!lista) {
    return;
  }

  if (
    compras.length === 0
  ) {
    lista.innerHTML = `
      <div class="empty-state">

        <span
          class="ico ico-lg"
          data-ico="wallet"
        ></span>

        <h3>
          Nenhuma compra registrada
        </h3>

        <p>
          Adicione a primeira compra desta conta.
        </p>

      </div>
    `;

    paintIcons(lista);

    return;
  }

  const podeEditar =
    statusConta ===
    "ABERTA";

  const comprasOrdenadas =
    [...compras].sort(
      (compraA, compraB) =>
        new Date(
          compraB.data_compra,
        ) -
        new Date(
          compraA.data_compra,
        ),
    );

  lista.innerHTML =
    comprasOrdenadas
      .map(
        (compra) => `
          <div class="purchase-item">

            <div>

              <strong>
                ${escaparHtml(
                  compra.descricao,
                )}
              </strong>

              <div class="p-meta">
                ${formatarData(
                  compra.data_compra,
                )}
                às
                ${formatarHora(
                  compra.data_compra,
                )}
              </div>

              ${
                compra.observacao
                  ? `
                    <div class="p-obs">
                      ${escaparHtml(
                        compra.observacao,
                      )}
                    </div>
                  `
                  : ""
              }

            </div>

            <div
              style="
                display:flex;
                align-items:center;
                gap:14px;
              "
            >

              <span class="purchase-value">
                ${formatarMoeda(
                  compra.valor,
                )}
              </span>

              ${
                podeEditar
                  ? `
                    <div class="purchase-actions">

                      <button
                        class="icon-btn"
                        data-edit-purchase="${
                          compra.id
                        }"
                        aria-label="Editar compra"
                        title="Editar compra"
                      >
                        <span
                          class="ico"
                          data-ico="edit"
                        ></span>
                      </button>

                      <button
                        class="icon-btn danger"
                        data-delete-purchase="${
                          compra.id
                        }"
                        aria-label="Excluir compra"
                        title="Excluir compra"
                      >
                        <span
                          class="ico"
                          data-ico="trash"
                        ></span>
                      </button>

                    </div>
                  `
                  : ""
              }

            </div>

          </div>
        `,
      )
      .join("");

  paintIcons(
    lista,
  );

  conectarBotoesEditarCompra(
    lista,
  );

  conectarBotoesExcluirCompra(
    lista,
  );
}


// ============================================================================
// BOTÃO PRINCIPAL "ADICIONAR COMPRA"
// ============================================================================

const botaoAdicionarCompra =
  elemento(
    "btnAddCompra",
  );

if (botaoAdicionarCompra) {
  botaoAdicionarCompra.addEventListener(
    "click",
    () => {
      if (
        !state.contaAtual
      ) {
        return;
      }

      abrirModalCompra(
        state.contaAtual.id,
      );
    },
  );
}


// ============================================================================
// MODAL DE COMPRA
// ============================================================================

const modalCompra =
  elemento(
    "modalCompra",
  );


// ============================================================================
// ABRIR MODAL PARA ADICIONAR OU EDITAR COMPRA
// ============================================================================

async function abrirModalCompra(
  contaId,
  compraId = null,
) {
  state.compraEditando =
    null;

  if (!contaId) {
    mostrarToast(
      "Conta inválida.",
      "close",
    );

    return;
  }

  const campoDescricao =
    elemento(
      "compraDesc",
    );

  const campoValor =
    elemento(
      "compraValor",
    );

  const campoObservacao =
    elemento(
      "compraObs",
    );

  const tituloModal =
    document.querySelector(
      "#modalCompra .modal-head h3",
    );

  if (compraId) {
    try {
      const resultado =
        await api(
          `/compras/${compraId}`,
        );

      const compra =
        resultado.dados.compra;

      state.compraEditando =
        compra;

      if (campoDescricao) {
        campoDescricao.value =
          compra.descricao || "";
      }

      if (campoValor) {
        campoValor.value =
          converterNumero(
            compra.valor,
          )
            .toFixed(2)
            .replace(".", ",");
      }

      if (campoObservacao) {
        campoObservacao.value =
          compra.observacao || "";
      }

      if (tituloModal) {
        tituloModal.textContent =
          "Editar compra";
      }
    } catch (erro) {
      mostrarToast(
        erro.message ||
          "Não foi possível carregar a compra.",
        "close",
      );

      return;
    }
  } else {
    if (campoDescricao) {
      campoDescricao.value =
        "";
    }

    if (campoValor) {
      campoValor.value =
        "";
    }

    if (campoObservacao) {
      campoObservacao.value =
        "";
    }

    if (tituloModal) {
      tituloModal.textContent =
        "Adicionar compra";
    }
  }

  modalCompra.dataset.contaId =
    String(contaId);

  abrirModal(
    modalCompra,
  );
}


// ============================================================================
// CONECTAR BOTÕES DE EDITAR COMPRA
// ============================================================================

function conectarBotoesEditarCompra(
  raiz,
) {
  elementos(
    "[data-edit-purchase]",
    raiz,
  ).forEach(
    (botao) => {
      botao.addEventListener(
        "click",
        () => {
          if (
            !state.contaAtual
          ) {
            return;
          }

          abrirModalCompra(
            state.contaAtual.id,
            botao.dataset
              .editPurchase,
          );
        },
      );
    },
  );
}


// ============================================================================
// CONECTAR BOTÕES DE EXCLUIR COMPRA
// ============================================================================

function conectarBotoesExcluirCompra(
  raiz,
) {
  elementos(
    "[data-delete-purchase]",
    raiz,
  ).forEach(
    (botao) => {
      botao.addEventListener(
        "click",
        () => {
          excluirCompra(
            botao.dataset
              .deletePurchase,
          );
        },
      );
    },
  );
}


// ============================================================================
// SALVAR COMPRA
// ============================================================================

let salvandoCompra = false;

const botaoSalvarCompra = elemento("btnSalvarCompra");

if (botaoSalvarCompra) {
  botaoSalvarCompra.onclick = async () => {
    if (salvandoCompra) {
      return;
    }

    const descricao = elemento("compraDesc")?.value.trim();
    const valor = converterValorInput(elemento("compraValor")?.value);
    const observacao = elemento("compraObs")?.value.trim() || "";
    const contaId = modalCompra?.dataset.contaId;

    if (!descricao) {
      mostrarToast("Informe o produto ou a descrição.", "close");
      elemento("compraDesc")?.focus();
      return;
    }

    if (!Number.isFinite(valor) || valor <= 0) {
      mostrarToast("Informe um valor válido.", "close");
      elemento("compraValor")?.focus();
      return;
    }

    if (!contaId) {
      mostrarToast("A conta da compra não foi identificada.", "close");
      return;
    }

    salvandoCompra = true;
    definirCarregamentoBotao(botaoSalvarCompra, true, "Salvando...");

    try {
      let mensagemSucesso;

      if (state.compraEditando) {
        await api(`/compras/${state.compraEditando.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            descricao,
            valor,
            observacao,
          }),
        });

        mensagemSucesso = "Compra atualizada com sucesso.";
      } else {
        await api(`/contas/${contaId}/compras`, {
          method: "POST",
          body: JSON.stringify({
            descricao,
            valor,
            observacao,
          }),
        });

        mensagemSucesso = "Compra registrada com sucesso.";
      }

      // O modal é fechado antes de qualquer atualização posterior da tela.
      fecharModal(modalCompra);

      const campoDescricao = elemento("compraDesc");
      const campoValor = elemento("compraValor");
      const campoObservacao = elemento("compraObs");

      if (campoDescricao) campoDescricao.value = "";
      if (campoValor) campoValor.value = "";
      if (campoObservacao) campoObservacao.value = "";

      state.compraEditando = null;
      mostrarToast(mensagemSucesso);

      // Atualizações independentes: uma falha não prende o modal nem repete a compra.
      await Promise.allSettled([
        typeof carregarContas === "function" ? carregarContas() : Promise.resolve(),
        typeof carregarDashboard === "function" ? carregarDashboard() : Promise.resolve(),
      ]);

      try {
        await abrirDetalhesConta(contaId);
      } catch (erroDetalhes) {
        console.error(
          "Compra salva, mas os detalhes da conta não puderam ser atualizados:",
          erroDetalhes,
        );

        await irParaPagina("contas");
        mostrarToast(
          "Compra salva. A lista de contas foi atualizada.",
          "check",
        );
      }
    } catch (erro) {
      console.error("Erro ao salvar compra:", erro);
      mostrarToast(
        erro.message || "Não foi possível salvar a compra.",
        "close",
      );
    } finally {
      salvandoCompra = false;
      definirCarregamentoBotao(botaoSalvarCompra, false);
    }
  };
}


// ============================================================================
// MÁSCARA DO CAMPO VALOR
// ============================================================================

const campoValorCompra =
  elemento(
    "compraValor",
  );

if (campoValorCompra) {
  campoValorCompra.addEventListener(
    "input",
    (evento) => {
      let numeros =
        evento.target.value.replace(
          /\D/g,
          "",
        );

      if (!numeros) {
        evento.target.value =
          "";

        return;
      }

      const valor =
        Number(numeros) /
        100;

      evento.target.value =
        valor.toLocaleString(
          "pt-BR",
          {
            minimumFractionDigits:
              2,

            maximumFractionDigits:
              2,
          },
        );
    },
  );
}


// ============================================================================
// EXCLUIR COMPRA
// ============================================================================

async function excluirCompra(
  compraId,
) {
  const confirmou =
    window.confirm(
      "Deseja realmente excluir esta compra?",
    );

  if (!confirmou) {
    return;
  }

  try {
    await api(
      `/compras/${compraId}`,
      {
        method:
          "DELETE",
      },
    );

    mostrarToast(
      "Compra excluída.",
      "trash",
    );

    if (
      state.contaAtual
    ) {
      await abrirDetalhesConta(
        state.contaAtual.id,
      );
    }
  } catch (erro) {
    mostrarToast(
      erro.message ||
        "Não foi possível excluir a compra.",
      "close",
    );
  }
}

// ============================================================================
// PARTE 6
// CLIENTES E ABERTURA DE NOVA CONTA
// ============================================================================


// ============================================================================
// MODAL DE NOVA CONTA
// ============================================================================

const modalNovaConta =
  elemento(
    "modalNovaConta",
  );


// ============================================================================
// ABRIR MODAL DE NOVA CONTA
// ============================================================================

function abrirModalNovaConta() {
  state.clienteSelecionado =
    null;

  state.contaPendenteSelecionada =
    null;

  const camposParaLimpar = [
    "searchClientModal",
    "newClientNome",
    "newClientApelido",
    "newClientTelefone",
    "newClientObs",
  ];

  camposParaLimpar.forEach(
    (idCampo) => {
      const campo =
        elemento(
          idCampo,
        );

      if (campo) {
        campo.value =
          "";
      }
    },
  );

  definirOculto(
    "clientHasOpenWarning",
    true,
  );

  const resultados =
    elemento(
      "clientResults",
    );

  if (resultados) {
    resultados.innerHTML =
      "";
  }

  abrirModal(
    modalNovaConta,
  );
}


// ============================================================================
// BOTÕES PARA ABRIR NOVA CONTA
// ============================================================================

const botaoNovaContaTopo =
  elemento(
    "btnNovaContaTop",
  );

const botaoNovaContaPagina =
  elemento(
    "btnNovaContaContas",
  );

if (botaoNovaContaTopo) {
  botaoNovaContaTopo.addEventListener(
    "click",
    abrirModalNovaConta,
  );
}

if (botaoNovaContaPagina) {
  botaoNovaContaPagina.addEventListener(
    "click",
    abrirModalNovaConta,
  );
}


// ============================================================================
// PESQUISAR CLIENTES NO MODAL
// ============================================================================

const campoPesquisaCliente =
  elemento(
    "searchClientModal",
  );

if (campoPesquisaCliente) {
  campoPesquisaCliente.addEventListener(
    "input",
    debounce(
      async (evento) => {
        const pesquisa =
          evento.target.value.trim();

        const listaResultados =
          elemento(
            "clientResults",
          );

        if (!listaResultados) {
          return;
        }

        if (!pesquisa) {
          listaResultados.innerHTML =
            "";

          return;
        }

        try {
          const parametros =
            new URLSearchParams({
              pesquisa,
              limite:
                8,
            });

          const resultado =
            await api(
              `/clientes?${parametros.toString()}`,
            );

          const clientes =
            resultado.dados || [];

          renderizarResultadosClientes(
            clientes,
          );
        } catch (erro) {
          listaResultados.innerHTML = `
            <p
              class="muted"
              style="padding:8px 2px;"
            >
              ${escaparHtml(
                erro.message ||
                  "Não foi possível pesquisar os clientes.",
              )}
            </p>
          `;
        }
      },
      350,
    ),
  );
}


// ============================================================================
// RENDERIZAR RESULTADOS DE CLIENTES
// ============================================================================

function renderizarResultadosClientes(
  clientes,
) {
  const listaResultados =
    elemento(
      "clientResults",
    );

  if (!listaResultados) {
    return;
  }

  if (
    clientes.length === 0
  ) {
    listaResultados.innerHTML = `
      <p
        class="muted"
        style="padding:8px 2px;"
      >
        Nenhum cliente encontrado.
        Cadastre abaixo.
      </p>
    `;

    return;
  }

  listaResultados.innerHTML =
    clientes
      .map(
        (cliente) => `
          <div class="client-row">

            <div>

              <div class="cr-name">
                ${escaparHtml(
                  cliente.nome,
                )}
              </div>

              <div class="cr-phone">
                ${escaparHtml(
                  cliente.telefone ||
                    "Sem telefone",
                )}
              </div>

            </div>

            <button
              class="btn btn-primary"
              data-pick-client="${
                cliente.id
              }"
            >
              Selecionar
            </button>

          </div>
        `,
      )
      .join("");

  conectarBotoesSelecionarCliente(
    listaResultados,
  );
}


// ============================================================================
// CONECTAR BOTÕES DE SELEÇÃO DE CLIENTE
// ============================================================================

function conectarBotoesSelecionarCliente(
  raiz,
) {
  elementos(
    "[data-pick-client]",
    raiz,
  ).forEach(
    (botao) => {
      botao.addEventListener(
        "click",
        async () => {
          const clienteId =
            botao.dataset.pickClient;

          try {
            await selecionarClienteParaConta(
              clienteId,
            );
          } catch (erro) {
            mostrarToast(
              erro.message ||
                "Não foi possível selecionar o cliente.",
              "close",
            );
          }
        },
      );
    },
  );
}


// ============================================================================
// VERIFICAR SE CLIENTE PODE ABRIR CONTA
// ============================================================================

async function selecionarClienteParaConta(
  clienteId,
) {
  const resultado =
    await api(
      `/clientes/${clienteId}/pode-abrir-conta`,
    );

  const dados =
    resultado.dados;

  state.clienteSelecionado =
    dados.cliente;

  if (
    !dados.pode_abrir_conta
  ) {
    state.contaPendenteSelecionada =
      dados.conta_pendente;

    const textoAviso =
      dados.conta_pendente?.status ===
      "FECHADA"
        ? "Este cliente possui uma conta fechada aguardando pagamento. É necessário concluir o pagamento antes de abrir uma nova conta."
        : "Este cliente já possui uma conta em aberto.";

    definirTexto(
      "clientHasOpenWarningText",
      textoAviso,
    );

    definirOculto(
      "clientHasOpenWarning",
      false,
    );

    return;
  }

  await criarNovaConta(
    clienteId,
  );
}


// ============================================================================
// ACESSAR CONTA PENDENTE EXISTENTE
// ============================================================================

const botaoAcessarContaAtual =
  elemento(
    "btnAcessarContaAtual",
  );

if (botaoAcessarContaAtual) {
  botaoAcessarContaAtual.addEventListener(
    "click",
    async () => {
      const contaId =
        state.contaPendenteSelecionada?.id;

      if (!contaId) {
        mostrarToast(
          "A conta atual não foi encontrada.",
          "close",
        );

        return;
      }

      fecharModal(
        modalNovaConta,
      );

      try {
        await abrirDetalhesConta(
          contaId,
        );
      } catch (erro) {
        mostrarToast(
          erro.message ||
            "Não foi possível abrir a conta atual.",
          "close",
        );
      }
    },
  );
}


// ============================================================================
// CADASTRAR CLIENTE E ABRIR CONTA
// ============================================================================

const botaoCadastrarEAbrir =
  elemento(
    "btnCadastrarEAbrir",
  );

if (botaoCadastrarEAbrir) {
  botaoCadastrarEAbrir.addEventListener(
    "click",
    async () => {
      const nome =
        elemento(
          "newClientNome",
        )?.value.trim();

      const apelido =
        elemento(
          "newClientApelido",
        )?.value.trim() || "";

      const telefone =
        elemento(
          "newClientTelefone",
        )?.value.trim() || "";

      const observacao =
        elemento(
          "newClientObs",
        )?.value.trim() || "";

      if (!nome) {
        mostrarToast(
          "Informe o nome do cliente.",
          "close",
        );

        return;
      }

      definirCarregamentoBotao(
        botaoCadastrarEAbrir,
        true,
        "Cadastrando...",
      );

      try {
        const resultadoCliente =
          await api(
            "/clientes",
            {
              method:
                "POST",

              body:
                JSON.stringify({
                  nome,
                  apelido,
                  telefone,
                  observacao,
                }),
            },
          );

        const novoCliente =
          resultadoCliente.dados.cliente;

        await criarNovaConta(
          novoCliente.id,
        );
      } catch (erro) {
        mostrarToast(
          erro.message ||
            "Não foi possível cadastrar o cliente.",
          "close",
        );
      } finally {
        definirCarregamentoBotao(
          botaoCadastrarEAbrir,
          false,
        );
      }
    },
  );
}


// ============================================================================
// CRIAR NOVA CONTA
// ============================================================================

async function criarNovaConta(
  clienteId,
) {
  const resultado =
    await api(
      "/contas",
      {
        method:
          "POST",

        body:
          JSON.stringify({
            cliente_id:
              Number(clienteId),

            observacao:
              "",
          }),
      },
    );

  const novaConta =
    resultado.dados.conta;

  fecharModal(
    modalNovaConta,
  );

  mostrarToast(
    "Conta criada com sucesso.",
  );

  if (
    typeof carregarContas ===
    "function"
  ) {
    await carregarContas();
  }

  await abrirDetalhesConta(
    novaConta.id,
  );
}

// ============================================================================
// PARTE 7
// CONCLUSÃO DE PAGAMENTO
// ============================================================================


// ============================================================================
// MODAL DE PAGAMENTO
// ============================================================================

const modalPagamento =
  elemento(
    "modalPagamento",
  );


// ============================================================================
// ABRIR MODAL DE PAGAMENTO
// ============================================================================

function abrirModalPagamento(
  conta,
) {
  if (!conta) {
    mostrarToast(
      "Conta inválida.",
      "close",
    );

    return;
  }

  if (
    converterNumero(
      conta.total_conta,
    ) <= 0
  ) {
    mostrarToast(
      "Não é possível concluir uma conta sem compras.",
      "close",
    );

    return;
  }

  state.formaPagamento =
    "DINHEIRO";

  const resumo =
    elemento(
      "paySummary",
    );

  if (resumo) {
    resumo.innerHTML = `
      <div class="ps-row">

        <span>
          Cliente
        </span>

        <strong>
          ${escaparHtml(
            conta.cliente_nome,
          )}
        </strong>

      </div>

      <div class="ps-row">

        <span>
          Aberta em
        </span>

        <span>
          ${formatarData(
            conta.data_abertura,
          )}
        </span>

      </div>

      <div class="ps-row">

        <span>
          Registros
        </span>

        <span>
          ${
            conta.quantidade_registros ??
            0
          }
        </span>

      </div>

      <div class="ps-row ps-total">

        <span>
          Total
        </span>

        <strong>
          ${formatarMoeda(
            conta.total_conta,
          )}
        </strong>

      </div>
    `;
  }

  elementos(
    "#payMethods .method-btn",
  ).forEach(
    (botao) => {
      botao.classList.toggle(
        "is-active",
        botao.dataset.method ===
          "DINHEIRO",
      );
    },
  );

  const campoObservacao =
    elemento(
      "pagamentoObs",
    );

  if (campoObservacao) {
    campoObservacao.value =
      "";
  }

  abrirModal(
    modalPagamento,
  );
}


// ============================================================================
// BOTÃO "CONCLUIR PAGAMENTO"
// ============================================================================

const botaoConcluirPagamento =
  elemento(
    "btnConcluirPagamento",
  );

if (botaoConcluirPagamento) {
  botaoConcluirPagamento.addEventListener(
    "click",
    () => {
      if (
        !state.contaAtual
      ) {
        mostrarToast(
          "Nenhuma conta foi selecionada.",
          "close",
        );

        return;
      }

      abrirModalPagamento(
        state.contaAtual,
      );
    },
  );
}


// ============================================================================
// SELECIONAR FORMA DE PAGAMENTO
// ============================================================================

elementos(
  "#payMethods .method-btn",
).forEach(
  (botao) => {
    botao.addEventListener(
      "click",
      () => {
        const forma =
          botao.dataset.method;

        if (
          ![
            "DINHEIRO",
            "PIX",
            "CARTAO",
          ].includes(forma)
        ) {
          mostrarToast(
            "Forma de pagamento inválida.",
            "close",
          );

          return;
        }

        state.formaPagamento =
          forma;

        elementos(
          "#payMethods .method-btn",
        ).forEach(
          (item) => {
            item.classList.toggle(
              "is-active",
              item === botao,
            );
          },
        );
      },
    );
  },
);


// ============================================================================
// CONFIRMAR PAGAMENTO
// ============================================================================

const botaoConfirmarPagamento =
  elemento(
    "btnConfirmarPagamento",
  );

if (botaoConfirmarPagamento) {
  botaoConfirmarPagamento.addEventListener(
    "click",
    async () => {
      if (
        !state.contaAtual?.id
      ) {
        mostrarToast(
          "Nenhuma conta foi selecionada.",
          "close",
        );

        return;
      }

      const observacao =
        elemento(
          "pagamentoObs",
        )?.value.trim() || "";

      definirCarregamentoBotao(
        botaoConfirmarPagamento,
        true,
        "Concluindo...",
      );

      try {
        await api(
          `/contas/${
            state.contaAtual.id
          }/pagamento`,
          {
            method:
              "POST",

            body:
              JSON.stringify({
                forma:
                  state.formaPagamento,

                observacao,
              }),
          },
        );

        fecharModal(
          modalPagamento,
        );

        mostrarToast(
          "Pagamento concluído com sucesso.",
        );

        state.contaAtual =
          null;

        if (
          typeof carregarDashboard ===
          "function"
        ) {
          await carregarDashboard();
        }

        if (
          typeof carregarContas ===
          "function"
        ) {
          await carregarContas();
        }

        await irParaPagina(
          "contas",
        );
      } catch (erro) {
        mostrarToast(
          erro.message ||
            "Não foi possível concluir o pagamento.",
          "close",
        );
      } finally {
        definirCarregamentoBotao(
          botaoConfirmarPagamento,
          false,
        );
      }
    },
  );
}

// ============================================================================
// PARTE 8
// HISTÓRICO E DETALHES DAS CONTAS PAGAS
// ============================================================================


// ============================================================================
// CARREGAR HISTÓRICO
// ============================================================================

async function carregarHistorico() {
  const parametros =
    new URLSearchParams({
      pesquisa:
        state.historico.pesquisa,

      pagina:
        state.historico.pagina,

      limite:
        state.historico.limite,
    });

  const resultado =
    await api(
      `/historico?${parametros.toString()}`,
    );

  const historico =
    resultado.dados || [];

  renderizarHistorico(
    historico,
  );
}


// ============================================================================
// RENDERIZAR HISTÓRICO
// ============================================================================

function renderizarHistorico(
  historico,
) {
  definirOculto(
    "historicoEmpty",
    historico.length > 0,
  );

  const corpoTabela =
    elemento(
      "tableHistoricoBody",
    );

  const listaMobile =
    elemento(
      "cardsHistoricoMobile",
    );

  if (corpoTabela) {
    corpoTabela.innerHTML =
      historico
        .map(
          (registro) =>
            criarLinhaHistorico(
              registro,
            ),
        )
        .join("");
  }

  if (listaMobile) {
    listaMobile.innerHTML =
      historico
        .map(
          (registro) =>
            criarCardHistorico(
              registro,
            ),
        )
        .join("");
  }

  [
    corpoTabela,
    listaMobile,
  ]
    .filter(Boolean)
    .forEach(
      (raiz) => {
        conectarBotoesHistorico(
          raiz,
        );
      },
    );
}


// ============================================================================
// CRIAR LINHA DO HISTÓRICO
// ============================================================================

function criarLinhaHistorico(
  registro,
) {
  return `
    <tr>

      <td>
        <strong>
          ${escaparHtml(
            registro.cliente_nome,
          )}
        </strong>
      </td>

      <td>
        ${formatarMoeda(
          registro.valor_pago,
        )}
      </td>

      <td>
        ${formatarData(
          registro.data_pagamento,
        )}
        às
        ${formatarHora(
          registro.data_pagamento,
        )}
      </td>

      <td>
        ${escaparHtml(
          formatarFormaPagamento(
            registro.forma,
          ),
        )}
      </td>

      <td>

        <div class="row-actions">

          <button
            class="btn btn-secondary"
            data-open-hist="${
              registro.conta_id
            }"
          >
            Ver detalhes
          </button>

        </div>

      </td>

    </tr>
  `;
}


// ============================================================================
// CRIAR CARD MOBILE DO HISTÓRICO
// ============================================================================

function criarCardHistorico(
  registro,
) {
  return `
    <div class="item-card">

      <div class="item-card-top">

        <strong>
          ${escaparHtml(
            registro.cliente_nome,
          )}
        </strong>

        <span class="value">
          ${formatarMoeda(
            registro.valor_pago,
          )}
        </span>

      </div>

      <p>
        ${formatarDataHora(
          registro.data_pagamento,
        )}
        ·
        ${escaparHtml(
          formatarFormaPagamento(
            registro.forma,
          ),
        )}
      </p>

      <div class="item-actions">

        <button
          class="btn btn-secondary"
          data-open-hist="${
            registro.conta_id
          }"
        >
          Ver detalhes
        </button>

      </div>

    </div>
  `;
}


// ============================================================================
// CONECTAR BOTÕES "VER DETALHES"
// ============================================================================

function conectarBotoesHistorico(
  raiz,
) {
  elementos(
    "[data-open-hist]",
    raiz,
  ).forEach(
    (botao) => {
      botao.addEventListener(
        "click",
        async () => {
          const contaId =
            botao.dataset.openHist;

          try {
            await abrirDetalhesHistorico(
              contaId,
            );
          } catch (erro) {
            mostrarToast(
              erro.message ||
                "Não foi possível abrir o histórico.",
              "close",
            );
          }
        },
      );
    },
  );
}


// ============================================================================
// PESQUISAR HISTÓRICO
// ============================================================================

const campoPesquisaHistorico =
  elemento(
    "searchHistorico",
  );

if (campoPesquisaHistorico) {
  campoPesquisaHistorico.addEventListener(
    "input",
    debounce(
      async (evento) => {
        state.historico.pesquisa =
          evento.target.value.trim();

        state.historico.pagina =
          1;

        try {
          await carregarHistorico();
        } catch (erro) {
          mostrarToast(
            erro.message ||
              "Não foi possível pesquisar o histórico.",
            "close",
          );
        }
      },
      350,
    ),
  );
}


// ============================================================================
// ABRIR DETALHES DO HISTÓRICO
// ============================================================================

async function abrirDetalhesHistorico(
  contaId,
) {
  const resultado =
    await api(
      `/historico/${contaId}`,
    );

  const dados =
    resultado.dados;

  state.historicoAtual =
    dados;

  const conta =
    dados.conta;

  const compras =
    dados.compras || [];

  const pagamento =
    dados.pagamento;

  definirTexto(
    "hdNome",
    conta.cliente_nome,
  );

  definirTexto(
    "hdMeta",
    `Conta nº ${conta.id} · ` +
      `Aberta em ${formatarData(
        conta.data_abertura,
      )} · ` +
      `Concluída em ${formatarDataHora(
        pagamento.data_pagamento,
      )} · ` +
      `${formatarFormaPagamento(
        pagamento.forma,
      )}`,
  );

  renderizarComprasHistorico(
    compras,
    pagamento,
  );

  definirDesabilitado(
    "btnNovaContaCliente",
    !dados.pode_abrir_nova_conta,
    dados.pode_abrir_nova_conta
      ? ""
      : "Este cliente já possui uma conta pendente.",
  );

  configurarAcoesHistorico(
    conta,
    dados,
  );

  await irParaPagina(
    "historico-detalhe",
  );
}


// ============================================================================
// RENDERIZAR COMPRAS DO HISTÓRICO
// ============================================================================

function renderizarComprasHistorico(
  compras,
  pagamento,
) {
  const lista =
    elemento(
      "hdPurchasesList",
    );

  if (!lista) {
    return;
  }

  const comprasOrdenadas =
    [...compras].sort(
      (compraA, compraB) =>
        new Date(
          compraB.data_compra,
        ) -
        new Date(
          compraA.data_compra,
        ),
    );

  lista.innerHTML =
    comprasOrdenadas
      .map(
        (compra) => `
          <div class="purchase-item">

            <div>

              <strong>
                ${escaparHtml(
                  compra.descricao,
                )}
              </strong>

              <div class="p-meta">
                ${formatarData(
                  compra.data_compra,
                )}
                às
                ${formatarHora(
                  compra.data_compra,
                )}
              </div>

              ${
                compra.observacao
                  ? `
                    <div class="p-obs">
                      ${escaparHtml(
                        compra.observacao,
                      )}
                    </div>
                  `
                  : ""
              }

            </div>

            <span class="purchase-value">
              ${formatarMoeda(
                compra.valor,
              )}
            </span>

          </div>
        `,
      )
      .join("") +
    `
      <div
        class="purchase-item"
        style="
          background:var(--ivory-2);
        "
      >

        <strong>
          Total pago
        </strong>

        <span class="purchase-value">
          ${formatarMoeda(
            pagamento.valor_pago,
          )}
        </span>

      </div>
    `;
}


// ============================================================================
// CONFIGURAR AÇÕES DO HISTÓRICO
// ============================================================================

function configurarAcoesHistorico(
  conta,
  dados,
) {
  const botaoPdf =
    elemento(
      "btnExportarPDF",
    );

  const botaoImprimir =
    elemento(
      "btnImprimir",
    );

  const botaoCompartilhar =
    elemento(
      "btnCompartilhar",
    );

  const botaoNovaContaCliente =
    elemento(
      "btnNovaContaCliente",
    );

  if (botaoPdf) {
    botaoPdf.onclick =
      () => {
        baixarPdfConta(
          conta.id,
        );
      };
  }

  if (botaoImprimir) {
    botaoImprimir.onclick =
      () => {
        visualizarPdfConta(
          conta.id,
        );
      };
  }

  if (botaoCompartilhar) {
    botaoCompartilhar.onclick =
      () => {
        compartilharPdfConta(
          conta.id,
        );
      };
  }

  if (botaoNovaContaCliente) {
    botaoNovaContaCliente.onclick =
      async () => {
        if (
          !dados.pode_abrir_nova_conta
        ) {
          mostrarToast(
            "Este cliente já possui uma conta pendente.",
            "close",
          );

          return;
        }

        try {
          await criarNovaConta(
            conta.cliente_id,
          );
        } catch (erro) {
          mostrarToast(
            erro.message ||
              "Não foi possível abrir uma nova conta.",
            "close",
          );
        }
      };
  }
}


// ============================================================================
// BAIXAR PDF
// ============================================================================

async function baixarPdfConta(
  contaId,
) {
  try {
    const resposta =
      await api(
        `/historico/${contaId}/pdf`,
      );

    const arquivo =
      await resposta.blob();

    const url =
      URL.createObjectURL(
        arquivo,
      );

    const link =
      document.createElement(
        "a",
      );

    link.href =
      url;

    link.download =
      `comprovante_conta_${contaId}.pdf`;

    document.body.appendChild(
      link,
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
      url,
    );

    mostrarToast(
      "PDF baixado com sucesso.",
      "file",
    );
  } catch (erro) {
    mostrarToast(
      erro.message ||
        "Não foi possível baixar o PDF.",
      "close",
    );
  }
}


// ============================================================================
// VISUALIZAR E IMPRIMIR PDF
// ============================================================================

async function visualizarPdfConta(
  contaId,
) {
  let urlPdf = null;

  try {
    const resposta =
      await api(
        `/historico/${contaId}/pdf/visualizar`,
      );

    const arquivo =
      await resposta.blob();

    if (
      !arquivo ||
      arquivo.size === 0
    ) {
      throw new Error(
        "O PDF gerado está vazio.",
      );
    }

    urlPdf =
      URL.createObjectURL(
        arquivo,
      );

    const novaAba =
      window.open(
        urlPdf,
        "_blank",
      );

    if (!novaAba) {
      URL.revokeObjectURL(
        urlPdf,
      );

      mostrarToast(
        "O navegador bloqueou a janela de impressão. Permita pop-ups para este site.",
        "close",
      );

      return;
    }

    novaAba.focus();

    /*
      Aguarda o PDF carregar na nova aba antes de tentar abrir
      a caixa de impressão.
    */
    const tentarImprimir =
      () => {
        try {
          novaAba.focus();
          novaAba.print();
        } catch (erro) {
          console.warn(
            "Não foi possível abrir a impressão automaticamente:",
            erro,
          );
        }
      };

    /*
      Alguns navegadores disparam o evento load normalmente.
    */
    novaAba.addEventListener(
      "load",
      () => {
        setTimeout(
          tentarImprimir,
          800,
        );
      },
      {
        once: true,
      },
    );

    /*
      Fallback para navegadores que não disparam load corretamente
      ao abrir um PDF em Blob URL.
    */
    setTimeout(
      tentarImprimir,
      1800,
    );

    /*
      Mantém a URL disponível por tempo suficiente para leitura
      e impressão. Depois, libera a memória.
    */
    setTimeout(
      () => {
        if (urlPdf) {
          URL.revokeObjectURL(
            urlPdf,
          );

          urlPdf = null;
        }
      },
      120000,
    );
  } catch (erro) {
    if (urlPdf) {
      URL.revokeObjectURL(
        urlPdf,
      );
    }

    console.error(
      "Erro ao visualizar ou imprimir o PDF:",
      erro,
    );

    mostrarToast(
      erro.message ||
        "Não foi possível preparar o PDF para impressão.",
      "close",
    );
  }
}

// ============================================================================
// COMPARTILHAR PDF
// ============================================================================

async function compartilharPdfConta(
  contaId,
) {
  try {
    const resposta =
      await api(
        `/historico/${contaId}/pdf`,
      );

    const arquivoBlob =
      await resposta.blob();

    const arquivo =
      new File(
        [
          arquivoBlob,
        ],
        `comprovante_conta_${contaId}.pdf`,
        {
          type:
            "application/pdf",
        },
      );

    const podeCompartilhar =
      navigator.canShare &&
      navigator.canShare({
        files: [
          arquivo,
        ],
      });

    if (podeCompartilhar) {
      await navigator.share({
        title:
          "Comprovante da conta",

        text:
          "Comprovante gerado pela Caderneta Digital.",

        files: [
          arquivo,
        ],
      });

      return;
    }

    await baixarPdfConta(
      contaId,
    );

    mostrarToast(
      "O PDF foi baixado para você compartilhar.",
      "share",
    );
  } catch (erro) {
    if (
      erro.name ===
      "AbortError"
    ) {
      return;
    }

    mostrarToast(
      erro.message ||
        "Não foi possível compartilhar o PDF.",
      "close",
    );
  }
}

// ============================================================================
// PARTE 9
// RELATÓRIOS, GRÁFICO DE PAGAMENTOS E RANKING DE CLIENTES
// ============================================================================


// ============================================================================
// CONFIGURAR FILTROS DE RELATÓRIO
// ============================================================================

function configurarFiltrosRelatorio() {
  const seletorMes =
    elemento(
      "selMes",
    );

  const seletorAno =
    elemento(
      "selAno",
    );

  if (
    !seletorMes ||
    !seletorAno
  ) {
    return;
  }

  const dataAtual =
    new Date();

  seletorMes.innerHTML =
    MESES
      .map(
        (
          nomeMes,
          indice,
        ) => `
          <option value="${
            indice + 1
          }">

            ${
              nomeMes
                .charAt(0)
                .toUpperCase() +
              nomeMes.slice(1)
            }

          </option>
        `,
      )
      .join("");

  const anos = [];

  for (
    let ano =
      dataAtual.getFullYear();
    ano >=
      dataAtual.getFullYear() -
        10;
    ano -= 1
  ) {
    anos.push(ano);
  }

  seletorAno.innerHTML =
    anos
      .map(
        (ano) => `
          <option value="${ano}">
            ${ano}
          </option>
        `,
      )
      .join("");

  seletorMes.value =
    String(
      state.relatorios.mes,
    );

  seletorAno.value =
    String(
      state.relatorios.ano,
    );

  seletorMes.addEventListener(
    "change",
    async () => {
      state.relatorios.mes =
        Number(
          seletorMes.value,
        );

      try {
        await carregarRelatorios();
      } catch (erro) {
        mostrarToast(
          erro.message ||
            "Não foi possível carregar o relatório.",
          "close",
        );
      }
    },
  );

  seletorAno.addEventListener(
    "change",
    async () => {
      state.relatorios.ano =
        Number(
          seletorAno.value,
        );

      try {
        await carregarRelatorios();
      } catch (erro) {
        mostrarToast(
          erro.message ||
            "Não foi possível carregar o relatório.",
          "close",
        );
      }
    },
  );
}


// ============================================================================
// BOTÕES DOS FILTROS
// ============================================================================

elementos(
  "#reportFilters .chip",
).forEach(
  (botao) => {
    botao.addEventListener(
      "click",
      async () => {
        elementos(
          "#reportFilters .chip",
        ).forEach(
          (item) => {
            item.classList.remove(
              "is-active",
            );
          },
        );

        botao.classList.add(
          "is-active",
        );

        state.relatorios.periodo =
          botao.dataset.filter;

        definirOculto(
          "customFilter",
          state.relatorios.periodo !==
            "personalizado",
        );

        try {
          await carregarRelatorios();
        } catch (erro) {
          mostrarToast(
            erro.message ||
              "Não foi possível carregar o relatório.",
            "close",
          );
        }
      },
    );
  },
);


// ============================================================================
// CARREGAR RELATÓRIOS
// ============================================================================

async function carregarRelatorios() {
  const parametros =
    new URLSearchParams({
      periodo:
        state.relatorios.periodo,
    });

  if (
    state.relatorios.periodo ===
    "personalizado"
  ) {
    parametros.set(
      "ano",
      state.relatorios.ano,
    );

    parametros.set(
      "mes",
      state.relatorios.mes,
    );
  }

  const resultado =
    await api(
      `/relatorios?${parametros.toString()}`,
    );

  const dados =
    resultado.dados;

  renderizarResumoRelatorios(
    dados.resumo,
  );

  renderizarGraficoPagamentos(
    dados.formas_pagamento || [],
  );

  renderizarRankingClientes(
    dados.clientes_mais_compraram ||
      [],
  );
}


// ============================================================================
// RENDERIZAR CARDS DOS RELATÓRIOS
// ============================================================================

function renderizarResumoRelatorios(
  resumo,
) {
  definirTexto(
    "repFaturamento",
    formatarMoeda(
      resumo.faturamento,
    ),
  );

  definirTexto(
    "repAReceber",
    formatarMoeda(
      resumo.total_a_receber,
    ),
  );

  definirTexto(
    "repQtdPagos",
    resumo.pagamentos_concluidos ??
      0,
  );

  const contasPendentes =
    converterNumero(
      resumo.contas_abertas,
    ) +
    converterNumero(
      resumo.contas_fechadas,
    );

  definirTexto(
    "repQtdAbertas",
    contasPendentes,
  );
}


// ============================================================================
// RENDERIZAR GRÁFICO DE FORMAS DE PAGAMENTO
// ============================================================================

function renderizarGraficoPagamentos(
  formasPagamento,
) {
  const grafico =
    elemento(
      "donutChart",
    );

  const legenda =
    elemento(
      "donutLegend",
    );

  if (
    !grafico ||
    !legenda
  ) {
    return;
  }

  const cores = {
    DINHEIRO:
      "#2E9B5C",

    PIX:
      "#3E7BC4",

    CARTAO:
      "#C68A4E",
  };

  const valorTotal =
    formasPagamento.reduce(
      (
        total,
        forma,
      ) =>
        total +
        converterNumero(
          forma.valor_total,
        ),
      0,
    );

  const raio =
    50;

  const centro =
    60;

  const circunferencia =
    2 *
    Math.PI *
    raio;

  let acumulado =
    0;

  const segmentos =
    formasPagamento.map(
      (forma) => {
        const percentual =
          valorTotal > 0
            ? converterNumero(
                forma.valor_total,
              ) /
              valorTotal
            : 0;

        const segmento = {
          ...forma,

          percentual,

          inicio:
            acumulado,
        };

        acumulado +=
          percentual;

        return segmento;
      },
    );

  const circulos =
    segmentos
      .filter(
        (segmento) =>
          segmento.percentual >
          0,
      )
      .map(
        (segmento) => {
          const tamanho =
            circunferencia *
            segmento.percentual;

          const restante =
            circunferencia -
            tamanho;

          const deslocamento =
            -circunferencia *
            segmento.inicio;

          return `
            <circle
              cx="${centro}"
              cy="${centro}"
              r="${raio}"
              fill="none"
              stroke="${
                cores[
                  segmento.forma
                ] ||
                "#999999"
              }"
              stroke-width="14"
              stroke-dasharray="
                ${tamanho}
                ${restante}
              "
              stroke-dashoffset="
                ${deslocamento}
              "
              transform="
                rotate(
                  -90
                  ${centro}
                  ${centro}
                )
              "
            />
          `;
        },
      )
      .join("");

  grafico.innerHTML = `
    <circle
      cx="${centro}"
      cy="${centro}"
      r="${raio}"
      fill="none"
      stroke="var(--line)"
      stroke-width="14"
    />

    ${circulos}

    <text
      x="${centro}"
      y="${centro - 2}"
      text-anchor="middle"
      font-size="14"
      font-weight="700"
      fill="var(--ink)"
    >
      ${escaparHtml(
        formatarMoeda(
          valorTotal,
        ),
      )}
    </text>

    <text
      x="${centro}"
      y="${centro + 14}"
      text-anchor="middle"
      font-size="8.5"
      fill="var(--ink-faint)"
    >
      recebido
    </text>
  `;

  legenda.innerHTML =
    formasPagamento
      .map(
        (forma) => `
          <div class="legend-row">

            <span
              class="legend-dot"
              style="
                background:
                ${
                  cores[
                    forma.forma
                  ] ||
                  "#999999"
                };
              "
            ></span>

            <span>

              ${escaparHtml(
                formatarFormaPagamento(
                  forma.forma,
                ),
              )}

              <span class="legend-sub">

                (${
                  forma.quantidade_pagamentos ??
                  0
                }
                pagto.)

              </span>

            </span>

            <strong>

              ${formatarMoeda(
                forma.valor_total,
              )}

            </strong>

          </div>
        `,
      )
      .join("");
}


// ============================================================================
// RENDERIZAR RANKING DE CLIENTES
// ============================================================================

function renderizarRankingClientes(
  clientes,
) {
  const lista =
    elemento(
      "rankingList",
    );

  if (!lista) {
    return;
  }

  if (
    clientes.length === 0
  ) {
    lista.innerHTML = `
      <p class="muted">
        Nenhum dado no período selecionado.
      </p>
    `;

    return;
  }

  lista.innerHTML =
    clientes
      .map(
        (cliente) => `
          <div class="rank-row">

            <span class="rank-pos">

              ${
                cliente.posicao
              }

            </span>

            <div class="rank-name">

              <strong>

                ${escaparHtml(
                  cliente.cliente_nome,
                )}

              </strong>

              <small>

                ${
                  cliente.contas_pagas ??
                  0
                }
                conta(s) concluída(s)

              </small>

            </div>

            <span class="rank-value">

              ${formatarMoeda(
                cliente.total_comprado,
              )}

            </span>

          </div>
        `,
      )
      .join("");
}



// ============================================================================
// PARTE 11 — PRODUTOS E LEITURA DE CÓDIGO DE BARRAS
// ============================================================================

function atualizarVisibilidadeAdministrativa() {
  const administrador = state.usuario?.perfil === "ADMINISTRADOR";
  elementos(".admin-only").forEach((item) => {
    item.hidden = !administrador;
  });
}

async function carregarCategoriasProdutos() {
  const resultado = await api("/categorias-produtos");
  const seletor = elemento("produtoCategoria");
  if (!seletor) return;
  const valorAtual = seletor.value;
  seletor.innerHTML = `<option value="">Sem categoria</option>` +
    resultado.dados.categorias.map((categoria) =>
      `<option value="${categoria.id}">${escaparHtml(categoria.nome)}</option>`
    ).join("");
  seletor.value = valorAtual;
}

async function carregarProdutos() {
  if (state.usuario?.perfil !== "ADMINISTRADOR") return;
  const parametros = new URLSearchParams({
    pagina: String(state.produtos.pagina),
    limite: String(state.produtos.limite),
  });
  if (state.produtos.pesquisa) parametros.set("pesquisa", state.produtos.pesquisa);
  if (state.produtos.ativo !== "") parametros.set("ativo", state.produtos.ativo);

  const resultado = await api(`/produtos?${parametros.toString()}`);
  const produtos = resultado.dados.produtos || [];
  const meta = resultado.meta || {};
  state.produtos.totalPaginas = meta.total_paginas || 1;
  renderizarProdutos(produtos);
  atualizarPaginacaoProdutos(meta);
}

function renderizarProdutos(produtos) {
  const tbody = elemento("tableProdutosBody");
  const mobile = elemento("cardsProdutosMobile");
  const vazio = elemento("produtosEmpty");
  if (vazio) vazio.hidden = produtos.length > 0;

  const linha = (produto) => `
    <tr>
      <td><strong>${escaparHtml(produto.nome)}</strong></td>
      <td><code>${escaparHtml(produto.codigo_barras)}</code></td>
      <td>${escaparHtml(produto.categoria_nome || "Sem categoria")}</td>
      <td><strong>${formatarMoeda(produto.preco_venda)}</strong></td>
      <td><span class="badge ${produto.ativo ? "badge-success" : "badge-muted"}">${produto.ativo ? "Ativo" : "Desativado"}</span></td>
      <td><button class="btn btn-secondary btn-sm" data-edit-product="${produto.id}"><span class="ico" data-ico="edit"></span> Editar</button></td>
    </tr>`;

  const card = (produto) => `
    <article class="product-card">
      <div class="product-card-head"><strong>${escaparHtml(produto.nome)}</strong><span class="badge ${produto.ativo ? "badge-success" : "badge-muted"}">${produto.ativo ? "Ativo" : "Desativado"}</span></div>
      <div class="product-code">${escaparHtml(produto.codigo_barras)}</div>
      <div class="product-card-meta"><span>${escaparHtml(produto.categoria_nome || "Sem categoria")}</span><strong>${formatarMoeda(produto.preco_venda)}</strong></div>
      <button class="btn btn-secondary btn-block" data-edit-product="${produto.id}"><span class="ico" data-ico="edit"></span> Editar produto</button>
    </article>`;

  if (tbody) tbody.innerHTML = produtos.map(linha).join("");
  if (mobile) mobile.innerHTML = produtos.map(card).join("");
  conectarBotoesEditarProduto(document);
  paintIcons(document);
}

function atualizarPaginacaoProdutos(meta) {
  const container = elemento("produtosPaginacao");
  if (!container) return;
  const totalPaginas = meta.total_paginas || 1;
  container.hidden = (meta.total_registros || 0) <= state.produtos.limite;
  definirTexto("produtosPaginaInfo", `Página ${meta.pagina || 1} de ${totalPaginas}`);
  definirDesabilitado("btnProdutosAnterior", (meta.pagina || 1) <= 1);
  definirDesabilitado("btnProdutosProximo", (meta.pagina || 1) >= totalPaginas);
}

async function abrirModalProduto(produtoId = null) {
  state.produtos.editando = null;
  await carregarCategoriasProdutos();
  const modal = elemento("modalProduto");
  definirTexto("tituloModalProduto", produtoId ? "Editar produto" : "Novo produto");
  elemento("produtoCodigoBarras").value = "";
  elemento("produtoNome").value = "";
  elemento("produtoPreco").value = "";
  elemento("produtoCategoria").value = "";
  elemento("produtoDescricao").value = "";
  elemento("produtoAtivo").checked = true;

  if (produtoId) {
    const resultado = await api(`/produtos/${produtoId}`);
    const produto = resultado.dados.produto;
    if (!produto) throw new Error("Produto não encontrado.");
    state.produtos.editando = produto;
    elemento("produtoCodigoBarras").value = produto.codigo_barras || "";
    elemento("produtoNome").value = produto.nome || "";
    elemento("produtoPreco").value = Number(produto.preco_venda).toFixed(2).replace(".", ",");
    elemento("produtoCategoria").value = produto.categoria_id || "";
    elemento("produtoDescricao").value = produto.descricao || "";
    elemento("produtoAtivo").checked = Boolean(produto.ativo);
  }
  abrirModal(modal);
}

function conectarBotoesEditarProduto(raiz) {
  elementos("[data-edit-product]", raiz).forEach((botao) => {
    botao.onclick = () => abrirModalProduto(botao.dataset.editProduct).catch((erro) => mostrarToast(erro.message, "close"));
  });
}

let salvandoProduto = false;
const botaoSalvarProduto = elemento("btnSalvarProduto");
if (botaoSalvarProduto) {
  botaoSalvarProduto.onclick = async () => {
    if (salvandoProduto) return;
    const codigo_barras = elemento("produtoCodigoBarras")?.value.trim();
    const nome = elemento("produtoNome")?.value.trim();
    const preco_venda = converterValorInput(elemento("produtoPreco")?.value);
    const categoriaValor = elemento("produtoCategoria")?.value;
    const descricao = elemento("produtoDescricao")?.value.trim() || "";
    const ativo = Boolean(elemento("produtoAtivo")?.checked);
    if (!codigo_barras || !nome || !Number.isFinite(preco_venda) || preco_venda <= 0) {
      mostrarToast("Preencha código, nome e preço corretamente.", "close");
      return;
    }
    salvandoProduto = true;
    definirCarregamentoBotao(botaoSalvarProduto, true, "Salvando...");
    try {
      const corpo = {
        codigo_barras, nome, preco_venda, descricao, ativo,
        categoria_id: categoriaValor ? Number(categoriaValor) : null,
      };
      if (state.produtos.editando) {
        await api(`/produtos/${state.produtos.editando.id}`, { method: "PATCH", body: JSON.stringify(corpo) });
        mostrarToast("Produto atualizado com sucesso.");
      } else {
        await api("/produtos", { method: "POST", body: JSON.stringify(corpo) });
        mostrarToast("Produto cadastrado com sucesso.");
      }
      fecharModal(elemento("modalProduto"));
      await carregarProdutos();
    } catch (erro) {
      mostrarToast(erro.message || "Não foi possível salvar o produto.", "close");
    } finally {
      salvandoProduto = false;
      definirCarregamentoBotao(botaoSalvarProduto, false);
    }
  };
}

let scannerStream = null;
let scannerTimer = null;
let produtoEscaneado = null;
let codigoEmProcessamento = false;

async function buscarProdutoPorCodigo(codigo) {
  if (codigoEmProcessamento) return;
  codigoEmProcessamento = true;
  try {
    const resultado = await api(`/produtos/codigo/${encodeURIComponent(codigo)}`);
    produtoEscaneado = resultado.dados.produto;
    state.produtos.escaneado = produtoEscaneado;
    const caixa = elemento("scannerResultado");
    caixa.hidden = false;
    caixa.innerHTML = `<strong>${escaparHtml(produtoEscaneado.nome)}</strong><span>${formatarMoeda(produtoEscaneado.preco_venda)}</span><small>Código: ${escaparHtml(produtoEscaneado.codigo_barras)}</small>`;
    elemento("btnConfirmarProdutoEscaneado").hidden = false;
    definirTexto("scannerMensagem", "Produto encontrado. Confirme para adicionar à conta.");
    pararScanner();
  } catch (erro) {
    produtoEscaneado = null;
    elemento("btnConfirmarProdutoEscaneado").hidden = true;
    definirTexto("scannerMensagem", erro.message || "Produto não encontrado.");
  } finally {
    window.setTimeout(() => { codigoEmProcessamento = false; }, 800);
  }
}

async function iniciarScanner() {
  const modal = elemento("modalScanner");
  produtoEscaneado = null;
  elemento("scannerResultado").hidden = true;
  elemento("btnConfirmarProdutoEscaneado").hidden = true;
  elemento("scannerCodigoManual").value = "";
  definirTexto("scannerMensagem", "Aponte a câmera para o código de barras do produto.");
  abrirModal(modal);

  if (!navigator.mediaDevices?.getUserMedia) {
    definirTexto("scannerMensagem", "Este navegador não permite acesso à câmera. Digite o código abaixo.");
    return;
  }
  try {
    scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
    const video = elemento("scannerVideo");
    video.srcObject = scannerStream;
    await video.play();

    if (!("BarcodeDetector" in window)) {
      definirTexto("scannerMensagem", "A câmera abriu, mas a leitura automática não é suportada neste navegador. Digite o código abaixo.");
      return;
    }
    const detector = new BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"] });
    scannerTimer = window.setInterval(async () => {
      if (!video.videoWidth || codigoEmProcessamento) return;
      try {
        const codigos = await detector.detect(video);
        if (codigos[0]?.rawValue) await buscarProdutoPorCodigo(codigos[0].rawValue);
      } catch (erro) {
        console.error("Falha na leitura do código:", erro);
      }
    }, 600);
  } catch (erro) {
    definirTexto("scannerMensagem", "Não foi possível abrir a câmera. Autorize o acesso ou digite o código abaixo.");
  }
}

function pararScanner() {
  if (scannerTimer) window.clearInterval(scannerTimer);
  scannerTimer = null;
  if (scannerStream) scannerStream.getTracks().forEach((track) => track.stop());
  scannerStream = null;
  const video = elemento("scannerVideo");
  if (video) video.srcObject = null;
}

const btnEscanear = elemento("btnEscanearProduto");
if (btnEscanear) btnEscanear.onclick = iniciarScanner;
const btnFecharScanner = elemento("btnFecharScanner");
if (btnFecharScanner) btnFecharScanner.onclick = () => { pararScanner(); fecharModal(elemento("modalScanner")); };
const btnBuscarCodigo = elemento("btnBuscarCodigoManual");
if (btnBuscarCodigo) btnBuscarCodigo.onclick = () => {
  const codigo = elemento("scannerCodigoManual")?.value.trim();
  if (!codigo) return mostrarToast("Digite o código de barras.", "close");
  buscarProdutoPorCodigo(codigo);
};
const btnConfirmarEscaneado = elemento("btnConfirmarProdutoEscaneado");
if (btnConfirmarEscaneado) btnConfirmarEscaneado.onclick = async () => {
  const contaId = modalCompra?.dataset.contaId;
  if (!contaId || !produtoEscaneado) return;
  definirCarregamentoBotao(btnConfirmarEscaneado, true, "Adicionando...");
  try {
    await api(`/contas/${contaId}/compras/produto`, {
      method: "POST",
      body: JSON.stringify({ codigo_barras: produtoEscaneado.codigo_barras }),
    });
    pararScanner();
    fecharModal(elemento("modalScanner"));
    fecharModal(modalCompra);
    mostrarToast("Produto adicionado à conta com sucesso.");
    await Promise.allSettled([carregarContas(), carregarDashboard()]);
    await abrirDetalhesConta(contaId);
  } catch (erro) {
    mostrarToast(erro.message || "Não foi possível adicionar o produto.", "close");
  } finally {
    definirCarregamentoBotao(btnConfirmarEscaneado, false);
  }
};

const btnNovoProduto = elemento("btnNovoProduto");
if (btnNovoProduto) btnNovoProduto.onclick = () => abrirModalProduto().catch((erro) => mostrarToast(erro.message, "close"));
const searchProdutos = elemento("searchProdutos");
if (searchProdutos) searchProdutos.addEventListener("input", debounce(async (evento) => {
  state.produtos.pesquisa = evento.target.value.trim();
  state.produtos.pagina = 1;
  await carregarProdutos();
}, 350));
const filtroProdutos = elemento("filterProdutosAtivos");
if (filtroProdutos) filtroProdutos.onchange = async (evento) => {
  state.produtos.ativo = evento.target.value;
  state.produtos.pagina = 1;
  await carregarProdutos();
};
const btnProdutosAnterior = elemento("btnProdutosAnterior");
if (btnProdutosAnterior) btnProdutosAnterior.onclick = async () => {
  if (state.produtos.pagina > 1) { state.produtos.pagina -= 1; await carregarProdutos(); }
};
const btnProdutosProximo = elemento("btnProdutosProximo");
if (btnProdutosProximo) btnProdutosProximo.onclick = async () => {
  if (state.produtos.pagina < state.produtos.totalPaginas) { state.produtos.pagina += 1; await carregarProdutos(); }
};


// ============================================================================
// PARTE 10
// CONFIGURAÇÕES DA LOJA, PERFIL E INICIALIZAÇÃO FINAL
// ============================================================================


// ============================================================================
// CARREGAR CONFIGURAÇÕES DA LOJA
// ============================================================================

async function carregarConfiguracoes() {
  const resultado =
    await api(
      "/configuracoes",
    );

  const configuracoes =
    resultado.dados.configuracoes;

  atualizarConfiguracoesNaTela(
    configuracoes,
  );
}


// ============================================================================
// MOSTRAR CONFIGURAÇÕES NA INTERFACE
// ============================================================================

function atualizarConfiguracoesNaTela(
  configuracoes,
) {
  const nomeLoja =
    configuracoes.nome_fantasia ||
    configuracoes.nome_loja ||
    "Nogueira";

  const campoNomeLoja =
    elemento(
      "configNomeLoja",
    );

  if (campoNomeLoja) {
    campoNomeLoja.value =
      nomeLoja;
  }

  elementos(
    ".brand-text strong",
  ).forEach(
    (elementoHtml) => {
      elementoHtml.textContent =
        nomeLoja;
    },
  );

  /*
    O nome exibido no rodapé lateral representa a loja,
    não necessariamente o nome do usuário conectado.
  */

  elementos(
    ".mini-profile strong",
  ).forEach(
    (elementoHtml) => {
      elementoHtml.textContent =
        nomeLoja;
    },
  );

  const seletorTema =
    elemento(
      "darkModeToggle",
    );

  if (seletorTema) {
    seletorTema.checked =
      document.documentElement
        .getAttribute(
          "data-theme",
        ) === "dark";
  }
}


// ============================================================================
// ALTERAR NOME DA LOJA
//
// Essa ação é permitida somente para administrador.
// ============================================================================

const campoNomeLoja =
  elemento(
    "configNomeLoja",
  );

if (campoNomeLoja) {
  campoNomeLoja.addEventListener(
    "change",
    async (evento) => {
      const novoNome =
        evento.target.value.trim();

      if (!novoNome) {
        mostrarToast(
          "Informe o nome da loja.",
          "close",
        );

        return;
      }

      if (
        state.usuario?.perfil !==
        "ADMINISTRADOR"
      ) {
        mostrarToast(
          "Somente administradores podem alterar as configurações.",
          "close",
        );

        await carregarConfiguracoes();

        return;
      }

      evento.target.disabled =
        true;

      try {
        await api(
          "/configuracoes",
          {
            method:
              "PATCH",

            body:
              JSON.stringify({
                nome_fantasia:
                  novoNome,
              }),
          },
        );

        mostrarToast(
          "Nome da loja atualizado.",
        );

        await carregarConfiguracoes();
      } catch (erro) {
        mostrarToast(
          erro.message ||
            "Não foi possível atualizar o nome da loja.",
          "close",
        );
      } finally {
        evento.target.disabled =
          false;
      }
    },
  );
}


// ============================================================================
// CARREGAR PERFIL
// ============================================================================

function carregarPerfil() {
  atualizarInformacoesUsuario();

  if (!state.usuario) {
    return;
  }

  const campoNome =
    elemento(
      "perfilNome",
    );

  const campoTelefone =
    elemento(
      "perfilTelefone",
    );

  if (campoNome) {
    campoNome.value =
      state.usuario.nome || "";

    /*
      O HTML atual não possui botão para salvar o perfil.

      Por segurança, este campo ficará somente para visualização
      até adicionarmos uma ação específica de atualização.
    */

    campoNome.readOnly =
      true;
  }

  if (campoTelefone) {
    /*
      A tabela usuarios criada no backend não possui telefone.

      O campo ficará vazio e somente para visualização.
    */

    campoTelefone.value =
      state.usuario.telefone || "";

    campoTelefone.readOnly =
      true;
  }
}


// ============================================================================
// VERIFICAR DISPONIBILIDADE DO BACKEND
// ============================================================================

async function verificarServidor() {
  try {
    const resposta =
      await fetch(
        `${API_BASE_URL}/pronto`,
      );

    if (!resposta.ok) {
      throw new Error();
    }

    return true;
  } catch (erro) {
    mostrarToast(
      "O servidor está indisponível. Verifique se o backend está ligado.",
      "close",
    );

    return false;
  }
}


// ============================================================================
// VALIDAR ELEMENTOS IMPORTANTES DO HTML
//
// Ajuda a encontrar IDs ausentes ou digitados incorretamente.
// ============================================================================

function validarEstruturaHtml() {
  const idsObrigatorios = [
    "page-inicio",
    "page-contas",
    "page-conta-detalhe",
    "page-historico",
    "page-historico-detalhe",
    "page-relatorios",

    "statClientes",
    "statAReceber",
    "statConcluidos",
    "movesList",

    "tableContasBody",
    "cardsContasMobile",
    "purchasesList",

    "tableHistoricoBody",
    "cardsHistoricoMobile",
    "hdPurchasesList",

    "modalNovaConta",
    "modalCompra",
    "modalPagamento",
    "modalSair",

    "toast",
  ];

  const idsAusentes =
    idsObrigatorios.filter(
      (id) => !elemento(id),
    );

  if (
    idsAusentes.length > 0
  ) {
    console.warn(
      "Alguns elementos esperados não foram encontrados no HTML:",
      idsAusentes,
    );
  }
}


// ============================================================================
// TRATAMENTO DE ERROS GERAIS DO FRONT-END
// ============================================================================

window.addEventListener(
  "unhandledrejection",
  (evento) => {
    console.error(
      "Promise sem tratamento:",
      evento.reason,
    );
  },
);


window.addEventListener(
  "error",
  (evento) => {
    console.error(
      "Erro no Front-end:",
      evento.error ||
        evento.message,
    );
  },
);


// ============================================================================
// ATUALIZAR DADOS QUANDO A ABA VOLTAR A FICAR ATIVA
// ============================================================================

document.addEventListener(
  "visibilitychange",
  async () => {
    if (
      document.visibilityState !==
        "visible" ||
      !obterToken()
    ) {
      return;
    }

    try {
      if (
        state.paginaAtual ===
        "inicio"
      ) {
        await carregarDashboard();
      }

      if (
        state.paginaAtual ===
        "contas"
      ) {
        await carregarContas();
      }

      if (
        state.paginaAtual ===
        "historico"
      ) {
        await carregarHistorico();
      }

      if (
        state.paginaAtual ===
        "relatorios"
      ) {
        await carregarRelatorios();
      }

      if (state.paginaAtual === "produtos" && state.usuario?.perfil === "ADMINISTRADOR") {
        await carregarProdutos();
      }
    } catch (erro) {
      console.error(
        "Não foi possível atualizar a página:",
        erro,
      );
    }
  },
);


// ============================================================================
// NORMALIZAR MODAIS AO INICIAR
// ============================================================================

function normalizarModais() {
  elementos(".modal-overlay").forEach((modal) => {
    if (!modal.classList.contains("is-open")) {
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
    }
  });
}


// ============================================================================
// INICIALIZAÇÃO COMPLETA DO SISTEMA
// ============================================================================

async function iniciarAplicacao() {
  validarEstruturaHtml();

  normalizarModais();

  paintIcons();

  carregarTemaSalvo();

  carregarUsuarioSalvo();

  configurarFiltrosRelatorio();

  /*
    O sistema só pode abrir a página principal quando existir um token.
  */

  if (
    !verificarSessaoAntesDeIniciar()
  ) {
    return;
  }

  const servidorDisponivel =
    await verificarServidor();

  if (!servidorDisponivel) {
    return;
  }

  try {
    /*
      Confirma no backend se o token continua válido
      e carrega os dados reais do usuário.
    */

    await carregarUsuarioAtual();

    atualizarPerfilVisual();

    atualizarVisibilidadeAdministrativa();

    carregarPerfil();

    /*
      Carrega as configurações para exibir o nome correto da loja.
    */

    try {
      await carregarConfiguracoes();
    } catch (erro) {
      console.warn(
        "Não foi possível carregar as configurações da loja:",
        erro.message,
      );
    }

    /*
      Abre a tela inicial e carrega o dashboard.
    */

    await irParaPagina(
      "inicio",
    );
  } catch (erro) {
    console.error(erro);

    mostrarToast(
      erro.message ||
        "Não foi possível iniciar o sistema.",
      "close",
    );
  }
}


// ============================================================================
// INICIAR SOMENTE DEPOIS QUE O HTML ESTIVER PRONTO
// ============================================================================

document.addEventListener(
  "DOMContentLoaded",
  iniciarAplicacao,
);
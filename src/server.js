// ============================================================================
// CADERNETA DIGITAL
// Backend Node.js + Express + PostgreSQL
// ============================================================================

// ============================================================================
// IMPORTAÇÕES
// ============================================================================

import "dotenv/config";

import express from "express";
import pg from "pg";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import PDFDocument from "pdfkit";


// ============================================================================
// CONFIGURAÇÕES INICIAIS
// ============================================================================

const app = express();
const { Pool } = pg;

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
let servidorHttp = null;
let intervaloTarefasAutomaticas = null;


// ============================================================================
// VALIDAÇÃO DAS VARIÁVEIS DE AMBIENTE
// ============================================================================

const variaveisObrigatorias = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "JWT_SECRET",
];

for (const variavel of variaveisObrigatorias) {
  if (!process.env[variavel]) {
    console.error(
      `❌ A variável ${variavel} não foi definida no arquivo .env.`,
    );

    process.exit(1);
  }
}


// ============================================================================
// CONEXÃO COM O POSTGRESQL
// ============================================================================

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  max: 15,

  idleTimeoutMillis: 30000,

  connectionTimeoutMillis: 5000,

  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

pool.on("connect", () => {
  if (NODE_ENV === "development") {
    console.log("🟢 Uma conexão foi aberta com o PostgreSQL.");
  }
});

pool.on("error", (erro) => {
  console.error("🔴 Erro inesperado no pool do PostgreSQL:");
  console.error(erro);
});


// ============================================================================
// FUNÇÃO PARA TESTAR O BANCO DE DADOS
// ============================================================================

async function testarConexaoBanco() {
  const cliente = await pool.connect();

  try {
    const resultado = await cliente.query(`
      SELECT
        CURRENT_DATABASE() AS banco,
        CURRENT_USER AS usuario,
        NOW() AS data_hora
    `);

    return resultado.rows[0];
  } finally {
    cliente.release();
  }
}


// ============================================================================
// CONFIGURAÇÕES DO EXPRESS
// ============================================================================

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

const origensPermitidas = [
  process.env.FRONTEND_URL,
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin(origem, callback) {
      // Permite ferramentas como Postman e Thunder Client.
      if (!origem) {
        return callback(null, true);
      }

      if (origensPermitidas.includes(origem)) {
        return callback(null, true);
      }

      return callback(
        new Error("Origem não permitida pela configuração de CORS."),
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// ============================================================================
// LIMITADORES DE REQUISIÇÃO
// ============================================================================

const limitadorGeral = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 500,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    sucesso: false,
    mensagem:
      "Muitas requisições foram realizadas. Tente novamente mais tarde.",
  },
});

const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    sucesso: false,
    mensagem:
      "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.",
  },
});

app.use("/api", limitadorGeral);


// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function respostaSucesso(
  response,
  {
    status = 200,
    mensagem,
    dados = null,
    meta = undefined,
  },
) {
  const resposta = {
    sucesso: true,
    mensagem,
  };

  if (dados !== null) {
    resposta.dados = dados;
  }

  if (meta !== undefined) {
    resposta.meta = meta;
  }

  return response.status(status).json(resposta);
}


function criarErro(
  mensagem,
  status = 400,
  codigo = "ERRO_REQUISICAO",
  detalhes = undefined,
) {
  const erro = new Error(mensagem);

  erro.status = status;
  erro.codigo = codigo;
  erro.detalhes = detalhes;

  return erro;
}


function normalizarTexto(texto) {
  if (typeof texto !== "string") {
    return texto;
  }

  return texto.trim().replace(/\s+/g, " ");
}


function normalizarUsuario(usuario) {
  if (typeof usuario !== "string") {
    return usuario;
  }

  return usuario.trim().toLowerCase();
}


function usuarioPublico(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    usuario: usuario.usuario,
    email: usuario.email,
    perfil: usuario.perfil,
    ativo: usuario.ativo,
    foto_url: usuario.foto_url,
    ultimo_acesso: usuario.ultimo_acesso,
    criado_em: usuario.criado_em,
  };
}


// ============================================================================
// VALIDAÇÃO DE DADOS COM ZOD
// ============================================================================

function validarDados(schema, dados) {
  const resultado = schema.safeParse(dados);

  if (!resultado.success) {
    const erros = resultado.error.issues.map((erro) => ({
      campo: erro.path.join("."),
      mensagem: erro.message,
    }));

    throw criarErro(
      "Existem dados inválidos na requisição.",
      422,
      "DADOS_INVALIDOS",
      erros,
    );
  }

  return resultado.data;
}


// ============================================================================
// SCHEMAS DE AUTENTICAÇÃO
// ============================================================================

const schemaCriarPrimeiroAdministrador = z.object({
  nome: z
    .string({
      required_error: "O nome é obrigatório.",
    })
    .trim()
    .min(3, "O nome deve possuir pelo menos 3 caracteres.")
    .max(120, "O nome deve possuir no máximo 120 caracteres."),

  usuario: z
    .string({
      required_error: "O usuário é obrigatório.",
    })
    .trim()
    .min(3, "O usuário deve possuir pelo menos 3 caracteres.")
    .max(60, "O usuário deve possuir no máximo 60 caracteres.")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "O usuário só pode conter letras, números, ponto, traço e underline.",
    ),

  email: z
    .string()
    .trim()
    .email("Informe um endereço de e-mail válido.")
    .max(150, "O e-mail deve possuir no máximo 150 caracteres.")
    .optional()
    .or(z.literal("")),

  senha: z
    .string({
      required_error: "A senha é obrigatória.",
    })
    .min(8, "A senha deve possuir pelo menos 8 caracteres.")
    .max(72, "A senha deve possuir no máximo 72 caracteres."),
});


const schemaLogin = z.object({
  usuario: z
    .string({
      required_error: "O usuário é obrigatório.",
    })
    .trim()
    .min(1, "Informe o usuário."),

  senha: z
    .string({
      required_error: "A senha é obrigatória.",
    })
    .min(1, "Informe a senha."),
});


const schemaAlterarSenha = z.object({
  senha_atual: z
    .string({
      required_error: "A senha atual é obrigatória.",
    })
    .min(1, "Informe a senha atual."),

  nova_senha: z
    .string({
      required_error: "A nova senha é obrigatória.",
    })
    .min(8, "A nova senha deve possuir pelo menos 8 caracteres.")
    .max(72, "A nova senha deve possuir no máximo 72 caracteres."),

  confirmar_nova_senha: z
    .string({
      required_error: "A confirmação da senha é obrigatória.",
    }),
}).refine(
  (dados) =>
    dados.nova_senha === dados.confirmar_nova_senha,
  {
    mensagem: "A confirmação da senha está diferente da nova senha.",
    path: ["confirmar_nova_senha"],
  },
);


// ============================================================================
// AUTENTICAÇÃO JWT
// ============================================================================

function gerarTokenAcesso(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      usuario: usuario.usuario,
      perfil: usuario.perfil,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      issuer: "caderneta-digital",
      audience: "caderneta-digital-web",
      subject: String(usuario.id),
    },
  );
}


function verificarTokenAcesso(token) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET,
    {
      issuer: "caderneta-digital",
      audience: "caderneta-digital-web",
    },
  );
}


// ============================================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ============================================================================

async function autenticar(request, response, next) {
  try {
    const cabecalhoAutorizacao =
      request.headers.authorization;

    if (!cabecalhoAutorizacao) {
      throw criarErro(
        "Token de autenticação não informado.",
        401,
        "TOKEN_NAO_INFORMADO",
      );
    }

    const partes = cabecalhoAutorizacao.split(" ");

    if (
      partes.length !== 2 ||
      partes[0] !== "Bearer" ||
      !partes[1]
    ) {
      throw criarErro(
        "Formato do token de autenticação inválido.",
        401,
        "TOKEN_INVALIDO",
      );
    }

    const token = partes[1];

    let payload;

    try {
      payload = verificarTokenAcesso(token);
    } catch (erro) {
      if (erro.name === "TokenExpiredError") {
        throw criarErro(
          "Sua sessão expirou. Entre novamente.",
          401,
          "TOKEN_EXPIRADO",
        );
      }

      throw criarErro(
        "Token de autenticação inválido.",
        401,
        "TOKEN_INVALIDO",
      );
    }

    const resultado = await pool.query(
      `
        SELECT
          id,
          nome,
          usuario,
          email,
          perfil,
          ativo,
          foto_url,
          ultimo_acesso,
          criado_em
        FROM usuarios
        WHERE id = $1
        LIMIT 1
      `,
      [payload.id],
    );

    if (resultado.rowCount === 0) {
      throw criarErro(
        "Usuário da sessão não foi encontrado.",
        401,
        "USUARIO_NAO_ENCONTRADO",
      );
    }

    const usuario = resultado.rows[0];

    if (!usuario.ativo) {
      throw criarErro(
        "Este usuário está desativado.",
        403,
        "USUARIO_DESATIVADO",
      );
    }

    request.usuario = usuario;

    return next();
  } catch (erro) {
    return next(erro);
  }
}


// ============================================================================
// MIDDLEWARE DE ADMINISTRADOR
// ============================================================================

function somenteAdministrador(request, response, next) {
  if (!request.usuario) {
    return next(
      criarErro(
        "Usuário não autenticado.",
        401,
        "NAO_AUTENTICADO",
      ),
    );
  }

  if (request.usuario.perfil !== "ADMINISTRADOR") {
    return next(
      criarErro(
        "Somente administradores podem realizar esta ação.",
        403,
        "ACESSO_NEGADO",
      ),
    );
  }

  return next();
}


// ============================================================================
// REGISTRO DO HISTÓRICO DE AÇÕES
// ============================================================================

async function registrarHistorico({
  usuarioId = null,
  acao,
  entidade,
  entidadeId = null,
  descricao = null,
  dadosAnteriores = null,
  dadosNovos = null,
  enderecoIp = null,
  clienteBanco = pool,
}) {
  try {
    await clienteBanco.query(
      `
        INSERT INTO historico_acoes (
          usuario_id,
          acao,
          entidade,
          entidade_id,
          descricao,
          dados_anteriores,
          dados_novos,
          endereco_ip
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8
        )
      `,
      [
        usuarioId,
        acao,
        entidade,
        entidadeId,
        descricao,
        dadosAnteriores
          ? JSON.stringify(dadosAnteriores)
          : null,
        dadosNovos
          ? JSON.stringify(dadosNovos)
          : null,
        enderecoIp,
      ],
    );
  } catch (erro) {
    // O histórico não deve derrubar uma requisição que já funcionou.
    console.error(
      "Não foi possível registrar o histórico:",
      erro.message,
    );
  }
}


// ============================================================================
// ROTAS GERAIS
// ============================================================================

app.get("/", (request, response) => {
  return respostaSucesso(response, {
    mensagem: "API da Caderneta Digital funcionando.",
    dados: {
      sistema: "Caderneta Digital",
      versao: "1.0.0",
      ambiente: NODE_ENV,
    },
  });
});


app.get("/api/saude", async (request, response, next) => {
  try {
    const resultado = await pool.query(`
      SELECT
        CURRENT_DATABASE() AS banco,
        NOW() AS data_hora
    `);

    return respostaSucesso(response, {
      mensagem: "Servidor e banco de dados funcionando.",
      dados: {
        servidor: "online",
        banco: resultado.rows[0].banco,
        data_hora: resultado.rows[0].data_hora,
      },
    });
  } catch (erro) {
    return next(erro);
  }
});


// ============================================================================
// ROTA PARA CRIAR O PRIMEIRO ADMINISTRADOR
//
// Essa rota funciona somente quando ainda não existir nenhum usuário.
// Depois do primeiro usuário, ela será automaticamente bloqueada.
// ============================================================================

app.post(
  "/api/configuracao/primeiro-administrador",
  limitadorLogin,
  async (request, response, next) => {
    const clienteBanco = await pool.connect();

    try {
      const dados = validarDados(
        schemaCriarPrimeiroAdministrador,
        request.body,
      );

      await clienteBanco.query("BEGIN");

      const totalUsuarios = await clienteBanco.query(`
        SELECT COUNT(*)::INTEGER AS total
        FROM usuarios
      `);

      if (totalUsuarios.rows[0].total > 0) {
        throw criarErro(
          "O primeiro administrador já foi configurado.",
          409,
          "ADMINISTRADOR_JA_CONFIGURADO",
        );
      }

      const nome = normalizarTexto(dados.nome);
      const usuario = normalizarUsuario(dados.usuario);

      const email =
        dados.email && dados.email.trim()
          ? dados.email.trim().toLowerCase()
          : null;

      const senhaHash = await bcrypt.hash(
        dados.senha,
        12,
      );

      const resultado = await clienteBanco.query(
        `
          INSERT INTO usuarios (
            nome,
            usuario,
            email,
            senha_hash,
            perfil,
            ativo
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            'ADMINISTRADOR',
            TRUE
          )
          RETURNING
            id,
            nome,
            usuario,
            email,
            perfil,
            ativo,
            foto_url,
            ultimo_acesso,
            criado_em
        `,
        [
          nome,
          usuario,
          email,
          senhaHash,
        ],
      );

      const administrador = resultado.rows[0];

      await registrarHistorico({
        usuarioId: administrador.id,
        acao: "CRIACAO",
        entidade: "usuarios",
        entidadeId: administrador.id,
        descricao:
          "Primeiro administrador do sistema criado.",
        dadosNovos: usuarioPublico(administrador),
        enderecoIp: request.ip,
        clienteBanco,
      });

      await clienteBanco.query("COMMIT");

      const token = gerarTokenAcesso(administrador);

      return respostaSucesso(response, {
        status: 201,
        mensagem:
          "Primeiro administrador criado com sucesso.",
        dados: {
          usuario: usuarioPublico(administrador),
          token,
        },
      });
    } catch (erro) {
      await clienteBanco.query("ROLLBACK");

      return next(erro);
    } finally {
      clienteBanco.release();
    }
  },
);


// ============================================================================
// LOGIN
// ============================================================================

app.post(
  "/api/auth/login",
  limitadorLogin,
  async (request, response, next) => {
    try {
      const dados = validarDados(
        schemaLogin,
        request.body,
      );

      const identificador = normalizarUsuario(
        dados.usuario,
      );

      const resultado = await pool.query(
        `
          SELECT
            id,
            nome,
            usuario,
            email,
            senha_hash,
            perfil,
            ativo,
            foto_url,
            ultimo_acesso,
            tentativas_login,
            bloqueado_ate,
            criado_em
          FROM usuarios
          WHERE
            LOWER(usuario) = LOWER($1)
            OR LOWER(COALESCE(email, '')) = LOWER($1)
          LIMIT 1
        `,
        [identificador],
      );

      if (resultado.rowCount === 0) {
        throw criarErro(
          "Usuário ou senha incorretos.",
          401,
          "CREDENCIAIS_INVALIDAS",
        );
      }

      const usuario = resultado.rows[0];

      if (!usuario.ativo) {
        throw criarErro(
          "Este usuário está desativado.",
          403,
          "USUARIO_DESATIVADO",
        );
      }

      if (
        usuario.bloqueado_ate &&
        new Date(usuario.bloqueado_ate) > new Date()
      ) {
        throw criarErro(
          "Este usuário está temporariamente bloqueado.",
          423,
          "USUARIO_BLOQUEADO",
        );
      }

      const senhaCorreta = await bcrypt.compare(
        dados.senha,
        usuario.senha_hash,
      );

      if (!senhaCorreta) {
        const novasTentativas =
          Number(usuario.tentativas_login || 0) + 1;

        const bloquearUsuario =
          novasTentativas >= 5;

        await pool.query(
          `
            UPDATE usuarios
            SET
              tentativas_login = $1,
              bloqueado_ate = CASE
                WHEN $2 = TRUE
                THEN NOW() + INTERVAL '15 minutes'
                ELSE bloqueado_ate
              END,
              atualizado_em = NOW()
            WHERE id = $3
          `,
          [
            bloquearUsuario ? 0 : novasTentativas,
            bloquearUsuario,
            usuario.id,
          ],
        );

        throw criarErro(
          bloquearUsuario
            ? "Usuário bloqueado por 15 minutos devido a várias tentativas incorretas."
            : "Usuário ou senha incorretos.",
          bloquearUsuario ? 423 : 401,
          bloquearUsuario
            ? "USUARIO_BLOQUEADO"
            : "CREDENCIAIS_INVALIDAS",
        );
      }

      const usuarioAtualizado = await pool.query(
        `
          UPDATE usuarios
          SET
            ultimo_acesso = NOW(),
            tentativas_login = 0,
            bloqueado_ate = NULL,
            atualizado_em = NOW()
          WHERE id = $1
          RETURNING
            id,
            nome,
            usuario,
            email,
            perfil,
            ativo,
            foto_url,
            ultimo_acesso,
            criado_em
        `,
        [usuario.id],
      );

      const usuarioLogado =
        usuarioAtualizado.rows[0];

      const token = gerarTokenAcesso(usuarioLogado);

      await registrarHistorico({
        usuarioId: usuarioLogado.id,
        acao: "LOGIN",
        entidade: "usuarios",
        entidadeId: usuarioLogado.id,
        descricao: "Login realizado com sucesso.",
        enderecoIp: request.ip,
      });

      return respostaSucesso(response, {
        mensagem: "Login realizado com sucesso.",
        dados: {
          usuario: usuarioPublico(usuarioLogado),
          token,
        },
      });
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// USUÁRIO AUTENTICADO
// ============================================================================

app.get(
  "/api/auth/me",
  autenticar,
  async (request, response) => {
    return respostaSucesso(response, {
      mensagem:
        "Dados do usuário carregados com sucesso.",
      dados: {
        usuario: usuarioPublico(request.usuario),
      },
    });
  },
);


// ============================================================================
// ALTERAR A PRÓPRIA SENHA
// ============================================================================

app.patch(
  "/api/auth/alterar-senha",
  autenticar,
  async (request, response, next) => {
    try {
      const dados = validarDados(
        schemaAlterarSenha,
        request.body,
      );

      const resultado = await pool.query(
        `
          SELECT
            id,
            senha_hash
          FROM usuarios
          WHERE id = $1
          LIMIT 1
        `,
        [request.usuario.id],
      );

      if (resultado.rowCount === 0) {
        throw criarErro(
          "Usuário não encontrado.",
          404,
          "USUARIO_NAO_ENCONTRADO",
        );
      }

      const senhaAtualCorreta =
        await bcrypt.compare(
          dados.senha_atual,
          resultado.rows[0].senha_hash,
        );

      if (!senhaAtualCorreta) {
        throw criarErro(
          "A senha atual está incorreta.",
          401,
          "SENHA_ATUAL_INCORRETA",
        );
      }

      const novaSenhaIgualAtual =
        await bcrypt.compare(
          dados.nova_senha,
          resultado.rows[0].senha_hash,
        );

      if (novaSenhaIgualAtual) {
        throw criarErro(
          "A nova senha deve ser diferente da senha atual.",
          422,
          "NOVA_SENHA_IGUAL_ATUAL",
        );
      }

      const novaSenhaHash = await bcrypt.hash(
        dados.nova_senha,
        12,
      );

      await pool.query(
        `
          UPDATE usuarios
          SET
            senha_hash = $1,
            atualizado_em = NOW()
          WHERE id = $2
        `,
        [
          novaSenhaHash,
          request.usuario.id,
        ],
      );

      await registrarHistorico({
        usuarioId: request.usuario.id,
        acao: "EDICAO",
        entidade: "usuarios",
        entidadeId: request.usuario.id,
        descricao:
          "O usuário alterou a própria senha.",
        enderecoIp: request.ip,
      });

      return respostaSucesso(response, {
        mensagem: "Senha alterada com sucesso.",
      });
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// LOGOUT
//
// Como esta primeira versão usa access token sem refresh token,
// o Front-end deve apagar o token armazenado.
// ============================================================================

app.post(
  "/api/auth/logout",
  autenticar,
  async (request, response, next) => {
    try {
      await registrarHistorico({
        usuarioId: request.usuario.id,
        acao: "LOGOUT",
        entidade: "usuarios",
        entidadeId: request.usuario.id,
        descricao: "Logout realizado.",
        enderecoIp: request.ip,
      });

      return respostaSucesso(response, {
        mensagem:
          "Logout realizado. Remova o token no Front-end.",
      });
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// ROTA PROTEGIDA DE TESTE
// ============================================================================

app.get(
  "/api/teste-autenticacao",
  autenticar,
  async (request, response) => {
    return respostaSucesso(response, {
      mensagem:
        "Você acessou uma rota protegida.",
      dados: {
        usuario: usuarioPublico(request.usuario),
      },
    });
  },
);


// ============================================================================
// ROTA PROTEGIDA PARA ADMINISTRADORES
// ============================================================================

app.get(
  "/api/teste-administrador",
  autenticar,
  somenteAdministrador,
  async (request, response) => {
    return respostaSucesso(response, {
      mensagem:
        "Você acessou uma rota exclusiva de administrador.",
    });
  },
);


// ============================================================================
// ROTA NÃO ENCONTRADA
// ============================================================================

app.use((request, response, next) => {
  return next(
    criarErro(
      `A rota ${request.method} ${request.originalUrl} não foi encontrada.`,
      404,
      "ROTA_NAO_ENCONTRADA",
    ),
  );
});


// ============================================================================
// TRATAMENTO GLOBAL DE ERROS
// ============================================================================

app.use((erro, request, response, next) => {
  console.error("============================================");
  console.error("ERRO NA API");
  console.error("Método:", request.method);
  console.error("Rota:", request.originalUrl);
  console.error("Mensagem:", erro.message);

  if (NODE_ENV === "development") {
    console.error(erro.stack);
  }

  console.error("============================================");

  if (erro instanceof z.ZodError) {
    return response.status(422).json({
      sucesso: false,
      mensagem:
        "Existem dados inválidos na requisição.",
      codigo: "DADOS_INVALIDOS",
      detalhes: erro.issues.map((item) => ({
        campo: item.path.join("."),
        mensagem: item.message,
      })),
    });
  }

  // Chave duplicada no PostgreSQL.
  if (erro.code === "23505") {
    return response.status(409).json({
      sucesso: false,
      mensagem:
        "Já existe um registro com essas informações.",
      codigo: "REGISTRO_DUPLICADO",
    });
  }

  // Violação de chave estrangeira.
  if (erro.code === "23503") {
    return response.status(409).json({
      sucesso: false,
      mensagem:
        "A operação não pode ser realizada porque existem registros relacionados.",
      codigo: "REGISTRO_RELACIONADO",
    });
  }

  // Violação de CHECK.
  if (erro.code === "23514") {
    return response.status(422).json({
      sucesso: false,
      mensagem:
        "Um valor informado não atende às regras do banco de dados.",
      codigo: "REGRA_DO_BANCO_VIOLADA",
    });
  }

  // Valor inválido para ENUM.
  if (erro.code === "22P02") {
    return response.status(422).json({
      sucesso: false,
      mensagem:
        "Um dos valores informados possui formato inválido.",
      codigo: "VALOR_INVALIDO",
    });
  }

  const status =
    Number.isInteger(erro.status)
      ? erro.status
      : 500;

  const resposta = {
    sucesso: false,

    mensagem:
      status === 500
        ? "Ocorreu um erro interno no servidor."
        : erro.message,

    codigo:
      erro.codigo || "ERRO_INTERNO",
  };

  if (erro.detalhes !== undefined) {
    resposta.detalhes = erro.detalhes;
  }

  if (
    NODE_ENV === "development" &&
    status === 500
  ) {
    resposta.erro_desenvolvimento = erro.message;
  }

  return response.status(status).json(resposta);
});


// ============================================================================
// ENCERRAMENTO SEGURO
// ============================================================================

async function encerrarServidor(
  sinal,
) {
  console.log(
    `\n⚠️ Sinal ${sinal} recebido.`,
  );

  console.log(
    "Encerrando o servidor com segurança...",
  );

  if (
    intervaloTarefasAutomaticas
  ) {
    clearInterval(
      intervaloTarefasAutomaticas,
    );

    intervaloTarefasAutomaticas =
      null;
  }

  const encerrarHttp =
    new Promise((resolve) => {
      if (!servidorHttp) {
        return resolve();
      }

      servidorHttp.close(
        () => {
          console.log(
            "✅ Servidor HTTP encerrado.",
          );

          resolve();
        },
      );

      setTimeout(
        () => {
          console.warn(
            "⚠️ Encerramento HTTP forçado após o tempo limite.",
          );

          resolve();
        },
        10000,
      ).unref();
    });

  try {
    await encerrarHttp;

    await pool.end();

    console.log(
      "✅ Conexões com o PostgreSQL encerradas.",
    );

    process.exit(0);
  } catch (erro) {
    console.error(
      "❌ Erro durante o encerramento:",
      erro,
    );

    process.exit(1);
  }
}

// ============================================================================
// ERROS NÃO TRATADOS DO NODE.JS
// ============================================================================

process.on("unhandledRejection", (motivo) => {
  console.error(
    "❌ Promise rejeitada sem tratamento:",
    motivo,
  );
});

process.on("uncaughtException", (erro) => {
  console.error(
    "❌ Exceção não capturada:",
    erro,
  );

  process.exit(1);
});


// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

async function iniciarServidor() {
  try {
    const conexao =
      await testarConexaoBanco();

    console.log("");
    console.log(
      "============================================",
    );

    console.log(
      "✅ PostgreSQL conectado com sucesso!",
    );

    console.log(
      `📦 Banco: ${conexao.banco}`,
    );

    console.log(
      `👤 Usuário: ${conexao.usuario}`,
    );

    console.log(
      `🕒 Horário: ${conexao.data_hora}`,
    );

    console.log(
      "============================================",
    );

    // Executa as tarefas assim que o servidor inicia.
    await executarTarefasAutomaticas();

    servidorHttp =
      app.listen(
        PORT,
        "0.0.0.0",
        () => {
          console.log("");
          console.log(
            "============================================",
          );

          console.log(
            "🚀 CADERNETA DIGITAL",
          );

          console.log(
            `🌐 Servidor: http://localhost:${PORT}`,
          );

          console.log(
            `❤️ Saúde: http://localhost:${PORT}/api/saude`,
          );

          console.log(
            `✅ Prontidão: http://localhost:${PORT}/api/pronto`,
          );

          console.log(
            `⚙️ Ambiente: ${NODE_ENV}`,
          );

          console.log(
            "============================================",
          );

          console.log("");
        },
      );

    /*
      A cada hora, o sistema verifica:

      - contas abertas de meses anteriores;
      - tokens expirados;
      - registros que precisam de manutenção.

      Não é necessário executar exatamente à meia-noite.
      Na primeira verificação do novo mês, as contas serão fechadas.
    */

    intervaloTarefasAutomaticas =
      setInterval(
        executarTarefasAutomaticas,
        60 * 60 * 1000,
      );

    intervaloTarefasAutomaticas.unref();
  } catch (erro) {
    console.error("");
    console.error(
      "❌ Não foi possível iniciar o servidor.",
    );

    console.error(
      `Motivo: ${erro.message}`,
    );

    console.error("");

    process.exit(1);
  }
}


// ROTA NÃO ENCONTRADA

// ============================================================================
// PARTE 2
// USUÁRIOS, CLIENTES E CONTAS
// ============================================================================


// ============================================================================
// FUNÇÕES AUXILIARES DA PARTE 2
// ============================================================================

function validarId(valor, nomeCampo = "id") {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro(
      `O campo ${nomeCampo} deve ser um número inteiro positivo.`,
      422,
      "ID_INVALIDO",
    );
  }

  return id;
}


function obterPaginacao(query) {
  const pagina = Math.max(
    Number.parseInt(query.pagina, 10) || 1,
    1,
  );

  const limiteSolicitado =
    Number.parseInt(query.limite, 10) || 20;

  const limite = Math.min(
    Math.max(limiteSolicitado, 1),
    100,
  );

  const offset = (pagina - 1) * limite;

  return {
    pagina,
    limite,
    offset,
  };
}


function calcularTotalPaginas(totalRegistros, limite) {
  return Math.max(
    Math.ceil(totalRegistros / limite),
    1,
  );
}


// ============================================================================
// FECHAMENTO AUTOMÁTICO DE CONTAS
//
// Toda conta aberta de um mês anterior será marcada como FECHADA.
// Ela continuará aguardando pagamento, mas não receberá novas compras.
// ============================================================================

async function fecharContasVencidas(
  clienteBanco = pool,
  usuarioId = null,
) {
  const resultado = await clienteBanco.query(
    `
      UPDATE contas
      SET
        status = 'FECHADA',
        data_fechamento = COALESCE(
          data_fechamento,
          NOW()
        ),
        fechada_automaticamente = TRUE,
        fechada_por = COALESCE(
          fechada_por,
          $1
        ),
        atualizado_em = NOW()
      WHERE status = 'ABERTA'
        AND competencia <
          DATE_TRUNC(
            'month',
            CURRENT_DATE
          )::DATE
      RETURNING
        id,
        cliente_id,
        competencia,
        status,
        data_fechamento
    `,
    [usuarioId],
  );

  return resultado.rows;
}


// ============================================================================
// SCHEMAS DE USUÁRIOS
// ============================================================================

const schemaCriarUsuario = z.object({
  nome: z
    .string()
    .trim()
    .min(
      3,
      "O nome deve possuir pelo menos 3 caracteres.",
    )
    .max(
      120,
      "O nome deve possuir no máximo 120 caracteres.",
    ),

  usuario: z
    .string()
    .trim()
    .min(
      3,
      "O usuário deve possuir pelo menos 3 caracteres.",
    )
    .max(
      60,
      "O usuário deve possuir no máximo 60 caracteres.",
    )
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "O usuário só pode conter letras, números, ponto, traço e underline.",
    ),

  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .max(
      150,
      "O e-mail deve possuir no máximo 150 caracteres.",
    )
    .optional()
    .or(z.literal("")),

  senha: z
    .string()
    .min(
      8,
      "A senha deve possuir pelo menos 8 caracteres.",
    )
    .max(
      72,
      "A senha deve possuir no máximo 72 caracteres.",
    ),

  perfil: z
    .enum([
      "ADMINISTRADOR",
      "ATENDENTE",
    ])
    .default("ATENDENTE"),
});


const schemaAtualizarUsuario = z.object({
  nome: z
    .string()
    .trim()
    .min(
      3,
      "O nome deve possuir pelo menos 3 caracteres.",
    )
    .max(120)
    .optional(),

  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .max(150)
    .nullable()
    .optional()
    .or(z.literal("")),

  perfil: z
    .enum([
      "ADMINISTRADOR",
      "ATENDENTE",
    ])
    .optional(),

  ativo: z
    .boolean()
    .optional(),
}).refine(
  (dados) =>
    Object.keys(dados).length > 0,
  {
    mensagem:
      "Informe pelo menos um campo para atualizar.",
  },
);


const schemaRedefinirSenhaUsuario = z.object({
  nova_senha: z
    .string()
    .min(
      8,
      "A nova senha deve possuir pelo menos 8 caracteres.",
    )
    .max(
      72,
      "A nova senha deve possuir no máximo 72 caracteres.",
    ),

  confirmar_nova_senha: z
    .string(),
}).refine(
  (dados) =>
    dados.nova_senha ===
    dados.confirmar_nova_senha,
  {
    mensagem:
      "A confirmação da senha está diferente.",
    path: ["confirmar_nova_senha"],
  },
);


// ============================================================================
// SCHEMAS DE CLIENTES
// ============================================================================

const schemaCriarCliente = z.object({
  nome: z
    .string()
    .trim()
    .min(
      2,
      "O nome deve possuir pelo menos 2 caracteres.",
    )
    .max(
      150,
      "O nome deve possuir no máximo 150 caracteres.",
    ),

  apelido: z
    .string()
    .trim()
    .max(
      100,
      "O apelido deve possuir no máximo 100 caracteres.",
    )
    .optional()
    .or(z.literal("")),

  telefone: z
    .string()
    .trim()
    .max(
      20,
      "O telefone deve possuir no máximo 20 caracteres.",
    )
    .optional()
    .or(z.literal("")),

  observacao: z
    .string()
    .trim()
    .max(
      1000,
      "A observação deve possuir no máximo 1000 caracteres.",
    )
    .optional()
    .or(z.literal("")),
});


const schemaAtualizarCliente =
  schemaCriarCliente
    .partial()
    .extend({
      ativo: z
        .boolean()
        .optional(),
    })
    .refine(
      (dados) =>
        Object.keys(dados).length > 0,
      {
        mensagem:
          "Informe pelo menos um campo para atualizar.",
      },
    );


// ============================================================================
// SCHEMA PARA ABRIR CONTA
// ============================================================================

const schemaAbrirConta = z.object({
  cliente_id: z.coerce
    .number()
    .int(
      "O cliente deve ser um número inteiro.",
    )
    .positive(
      "Informe um cliente válido.",
    ),

  observacao: z
    .string()
    .trim()
    .max(
      1000,
      "A observação deve possuir no máximo 1000 caracteres.",
    )
    .optional()
    .or(z.literal("")),
});


// ============================================================================
// USUÁRIOS — CRIAR
// Somente administradores.
// ============================================================================

app.post(
  "/api/usuarios",
  autenticar,
  somenteAdministrador,
  async (request, response, next) => {
    try {
      const dados = validarDados(
        schemaCriarUsuario,
        request.body,
      );

      const nome = normalizarTexto(
        dados.nome,
      );

      const usuario = normalizarUsuario(
        dados.usuario,
      );

      const email =
        dados.email &&
        dados.email.trim()
          ? dados.email
              .trim()
              .toLowerCase()
          : null;

      const usuarioExistente =
        await pool.query(
          `
            SELECT id
            FROM usuarios
            WHERE
              LOWER(usuario) = LOWER($1)
              OR (
                $2::TEXT IS NOT NULL
                AND LOWER(
                  COALESCE(email, '')
                ) = LOWER($2)
              )
            LIMIT 1
          `,
          [
            usuario,
            email,
          ],
        );

      if (
        usuarioExistente.rowCount > 0
      ) {
        throw criarErro(
          "Já existe um usuário ou e-mail cadastrado.",
          409,
          "USUARIO_DUPLICADO",
        );
      }

      const senhaHash =
        await bcrypt.hash(
          dados.senha,
          12,
        );

      const resultado =
        await pool.query(
          `
            INSERT INTO usuarios (
              nome,
              usuario,
              email,
              senha_hash,
              perfil,
              ativo
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              TRUE
            )
            RETURNING
              id,
              nome,
              usuario,
              email,
              perfil,
              ativo,
              foto_url,
              ultimo_acesso,
              criado_em
          `,
          [
            nome,
            usuario,
            email,
            senhaHash,
            dados.perfil,
          ],
        );

      const novoUsuario =
        resultado.rows[0];

      await registrarHistorico({
        usuarioId:
          request.usuario.id,

        acao: "CRIACAO",

        entidade: "usuarios",

        entidadeId:
          novoUsuario.id,

        descricao:
          `Usuário ${novoUsuario.usuario} criado.`,

        dadosNovos:
          usuarioPublico(
            novoUsuario,
          ),

        enderecoIp:
          request.ip,
      });

      return respostaSucesso(
        response,
        {
          status: 201,

          mensagem:
            "Usuário criado com sucesso.",

          dados: {
            usuario:
              usuarioPublico(
                novoUsuario,
              ),
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// USUÁRIOS — LISTAR
// ============================================================================

app.get(
  "/api/usuarios",
  autenticar,
  somenteAdministrador,
  async (request, response, next) => {
    try {
      const {
        pagina,
        limite,
        offset,
      } = obterPaginacao(
        request.query,
      );

      const pesquisa =
        normalizarTexto(
          request.query.pesquisa || "",
        );

      const ativo =
        request.query.ativo;

      const parametros = [];
      const condicoes = [];

      if (pesquisa) {
        parametros.push(
          `%${pesquisa}%`,
        );

        condicoes.push(`
          (
            nome ILIKE $${parametros.length}
            OR usuario ILIKE $${parametros.length}
            OR email ILIKE $${parametros.length}
          )
        `);
      }

      if (
        ativo === "true" ||
        ativo === "false"
      ) {
        parametros.push(
          ativo === "true",
        );

        condicoes.push(
          `ativo = $${parametros.length}`,
        );
      }

      const where =
        condicoes.length > 0
          ? `WHERE ${condicoes.join(
              " AND ",
            )}`
          : "";

      const totalResultado =
        await pool.query(
          `
            SELECT COUNT(*)::INTEGER
              AS total
            FROM usuarios
            ${where}
          `,
          parametros,
        );

      const parametrosLista = [
        ...parametros,
        limite,
        offset,
      ];

      const resultado =
        await pool.query(
          `
            SELECT
              id,
              nome,
              usuario,
              email,
              perfil,
              ativo,
              foto_url,
              ultimo_acesso,
              criado_em,
              atualizado_em
            FROM usuarios
            ${where}
            ORDER BY nome ASC
            LIMIT $${parametros.length + 1}
            OFFSET $${parametros.length + 2}
          `,
          parametrosLista,
        );

      const total =
        totalResultado.rows[0]
          .total;

      return respostaSucesso(
        response,
        {
          mensagem:
            "Usuários carregados com sucesso.",

          dados:
            resultado.rows,

          meta: {
            pagina,
            limite,
            total_registros:
              total,

            total_paginas:
              calcularTotalPaginas(
                total,
                limite,
              ),
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// USUÁRIOS — BUSCAR POR ID
// ============================================================================

app.get(
  "/api/usuarios/:id",
  autenticar,
  somenteAdministrador,
  async (request, response, next) => {
    try {
      const usuarioId =
        validarId(
          request.params.id,
          "id do usuário",
        );

      const resultado =
        await pool.query(
          `
            SELECT
              id,
              nome,
              usuario,
              email,
              perfil,
              ativo,
              foto_url,
              ultimo_acesso,
              tentativas_login,
              bloqueado_ate,
              criado_em,
              atualizado_em
            FROM usuarios
            WHERE id = $1
            LIMIT 1
          `,
          [usuarioId],
        );

      if (
        resultado.rowCount === 0
      ) {
        throw criarErro(
          "Usuário não encontrado.",
          404,
          "USUARIO_NAO_ENCONTRADO",
        );
      }

      return respostaSucesso(
        response,
        {
          mensagem:
            "Usuário encontrado com sucesso.",

          dados: {
            usuario:
              resultado.rows[0],
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// USUÁRIOS — ATUALIZAR
// ============================================================================

app.patch(
  "/api/usuarios/:id",
  autenticar,
  somenteAdministrador,
  async (request, response, next) => {
    const clienteBanco =
      await pool.connect();

    try {
      const usuarioId =
        validarId(
          request.params.id,
          "id do usuário",
        );

      const dados = validarDados(
        schemaAtualizarUsuario,
        request.body,
      );

      await clienteBanco.query(
        "BEGIN",
      );

      const usuarioAtual =
        await clienteBanco.query(
          `
            SELECT
              id,
              nome,
              usuario,
              email,
              perfil,
              ativo,
              foto_url,
              ultimo_acesso,
              criado_em
            FROM usuarios
            WHERE id = $1
            FOR UPDATE
          `,
          [usuarioId],
        );

      if (
        usuarioAtual.rowCount ===
        0
      ) {
        throw criarErro(
          "Usuário não encontrado.",
          404,
          "USUARIO_NAO_ENCONTRADO",
        );
      }

      if (
        usuarioId ===
          request.usuario.id &&
        dados.ativo === false
      ) {
        throw criarErro(
          "Você não pode desativar seu próprio usuário.",
          422,
          "NAO_PODE_DESATIVAR_PROPRIO_USUARIO",
        );
      }

      const usuarioAnterior =
        usuarioAtual.rows[0];

      const nome =
        dados.nome !== undefined
          ? normalizarTexto(
              dados.nome,
            )
          : usuarioAnterior.nome;

      let email =
        dados.email !== undefined
          ? dados.email
          : usuarioAnterior.email;

      if (
        typeof email ===
        "string"
      ) {
        email =
          email.trim() === ""
            ? null
            : email
                .trim()
                .toLowerCase();
      }

      const perfil =
        dados.perfil !== undefined
          ? dados.perfil
          : usuarioAnterior.perfil;

      const ativo =
        dados.ativo !== undefined
          ? dados.ativo
          : usuarioAnterior.ativo;

      if (email) {
        const emailExistente =
          await clienteBanco.query(
            `
              SELECT id
              FROM usuarios
              WHERE
                LOWER(email) =
                  LOWER($1)
                AND id <> $2
              LIMIT 1
            `,
            [
              email,
              usuarioId,
            ],
          );

        if (
          emailExistente.rowCount >
          0
        ) {
          throw criarErro(
            "Este e-mail já está sendo utilizado.",
            409,
            "EMAIL_DUPLICADO",
          );
        }
      }

      const resultado =
        await clienteBanco.query(
          `
            UPDATE usuarios
            SET
              nome = $1,
              email = $2,
              perfil = $3,
              ativo = $4,
              atualizado_em = NOW()
            WHERE id = $5
            RETURNING
              id,
              nome,
              usuario,
              email,
              perfil,
              ativo,
              foto_url,
              ultimo_acesso,
              criado_em,
              atualizado_em
          `,
          [
            nome,
            email,
            perfil,
            ativo,
            usuarioId,
          ],
        );

      const usuarioAtualizado =
        resultado.rows[0];

      await registrarHistorico({
        usuarioId:
          request.usuario.id,

        acao: "EDICAO",

        entidade: "usuarios",

        entidadeId:
          usuarioId,

        descricao:
          `Usuário ${usuarioAtualizado.usuario} atualizado.`,

        dadosAnteriores:
          usuarioAnterior,

        dadosNovos:
          usuarioAtualizado,

        enderecoIp:
          request.ip,

        clienteBanco,
      });

      await clienteBanco.query(
        "COMMIT",
      );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Usuário atualizado com sucesso.",

          dados: {
            usuario:
              usuarioAtualizado,
          },
        },
      );
    } catch (erro) {
      await clienteBanco.query(
        "ROLLBACK",
      );

      return next(erro);
    } finally {
      clienteBanco.release();
    }
  },
);


// ============================================================================
// USUÁRIOS — REDEFINIR SENHA
// Somente administrador.
// ============================================================================

app.patch(
  "/api/usuarios/:id/redefinir-senha",
  autenticar,
  somenteAdministrador,
  async (request, response, next) => {
    try {
      const usuarioId =
        validarId(
          request.params.id,
          "id do usuário",
        );

      const dados = validarDados(
        schemaRedefinirSenhaUsuario,
        request.body,
      );

      const usuarioResultado =
        await pool.query(
          `
            SELECT
              id,
              usuario
            FROM usuarios
            WHERE id = $1
            LIMIT 1
          `,
          [usuarioId],
        );

      if (
        usuarioResultado.rowCount ===
        0
      ) {
        throw criarErro(
          "Usuário não encontrado.",
          404,
          "USUARIO_NAO_ENCONTRADO",
        );
      }

      const senhaHash =
        await bcrypt.hash(
          dados.nova_senha,
          12,
        );

      await pool.query(
        `
          UPDATE usuarios
          SET
            senha_hash = $1,
            tentativas_login = 0,
            bloqueado_ate = NULL,
            atualizado_em = NOW()
          WHERE id = $2
        `,
        [
          senhaHash,
          usuarioId,
        ],
      );

      await registrarHistorico({
        usuarioId:
          request.usuario.id,

        acao: "EDICAO",

        entidade: "usuarios",

        entidadeId:
          usuarioId,

        descricao:
          `Senha do usuário ${usuarioResultado.rows[0].usuario} redefinida pelo administrador.`,

        enderecoIp:
          request.ip,
      });

      return respostaSucesso(
        response,
        {
          mensagem:
            "Senha redefinida com sucesso.",
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// CLIENTES — CADASTRAR
//
// Não existe uma página separada de clientes,
// mas o cadastro é necessário para abrir e manter as contas.
// ============================================================================

app.post(
  "/api/clientes",
  autenticar,
  async (request, response, next) => {
    try {
      const dados = validarDados(
        schemaCriarCliente,
        request.body,
      );

      const nome =
        normalizarTexto(
          dados.nome,
        );

      const apelido =
        dados.apelido &&
        dados.apelido.trim()
          ? normalizarTexto(
              dados.apelido,
            )
          : null;

      const telefone =
        dados.telefone &&
        dados.telefone.trim()
          ? dados.telefone.trim()
          : null;

      const observacao =
        dados.observacao &&
        dados.observacao.trim()
          ? dados.observacao.trim()
          : null;

      const resultado =
        await pool.query(
          `
            INSERT INTO clientes (
              nome,
              apelido,
              telefone,
              observacao,
              ativo,
              cadastrado_por
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              TRUE,
              $5
            )
            RETURNING
              id,
              nome,
              apelido,
              telefone,
              observacao,
              ativo,
              criado_em,
              atualizado_em
          `,
          [
            nome,
            apelido,
            telefone,
            observacao,
            request.usuario.id,
          ],
        );

      const novoCliente =
        resultado.rows[0];

      await registrarHistorico({
        usuarioId:
          request.usuario.id,

        acao: "CRIACAO",

        entidade: "clientes",

        entidadeId:
          novoCliente.id,

        descricao:
          `Cliente ${novoCliente.nome} cadastrado.`,

        dadosNovos:
          novoCliente,

        enderecoIp:
          request.ip,
      });

      return respostaSucesso(
        response,
        {
          status: 201,

          mensagem:
            "Cliente cadastrado com sucesso.",

          dados: {
            cliente:
              novoCliente,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// CLIENTES — PESQUISAR
//
// Usada na tela de abertura de conta.
// ============================================================================

app.get(
  "/api/clientes",
  autenticar,
  async (request, response, next) => {
    try {
      const {
        pagina,
        limite,
        offset,
      } = obterPaginacao(
        request.query,
      );

      const pesquisa =
        normalizarTexto(
          request.query.pesquisa || "",
        );

      const somenteAtivos =
        request.query.ativos !==
        "false";

      const parametros = [];
      const condicoes = [];

      if (somenteAtivos) {
        condicoes.push(
          "cl.ativo = TRUE",
        );
      }

      if (pesquisa) {
        parametros.push(
          `%${pesquisa}%`,
        );

        condicoes.push(`
          (
            cl.nome ILIKE
              $${parametros.length}
            OR cl.apelido ILIKE
              $${parametros.length}
            OR cl.telefone ILIKE
              $${parametros.length}
          )
        `);
      }

      const where =
        condicoes.length > 0
          ? `WHERE ${condicoes.join(
              " AND ",
            )}`
          : "";

      const totalResultado =
        await pool.query(
          `
            SELECT
              COUNT(*)::INTEGER
                AS total
            FROM clientes cl
            ${where}
          `,
          parametros,
        );

      const parametrosLista = [
        ...parametros,
        limite,
        offset,
      ];

      const resultado =
        await pool.query(
          `
            SELECT
              cl.id,
              cl.nome,
              cl.apelido,
              cl.telefone,
              cl.observacao,
              cl.ativo,
              cl.criado_em,

              conta.id
                AS conta_pendente_id,

              conta.status
                AS conta_pendente_status,

              conta.competencia
                AS conta_pendente_competencia,

              COALESCE(
                conta.total_conta,
                0
              )::NUMERIC(12, 2)
                AS total_pendente

            FROM clientes cl

            LEFT JOIN LATERAL (
              SELECT
                c.id,
                c.status,
                c.competencia,
                COALESCE(
                  SUM(ic.valor),
                  0
                ) AS total_conta
              FROM contas c
              LEFT JOIN itens_conta ic
                ON ic.conta_id = c.id
              WHERE
                c.cliente_id =
                  cl.id
                AND c.status IN (
                  'ABERTA',
                  'FECHADA'
                )
              GROUP BY
                c.id,
                c.status,
                c.competencia
              LIMIT 1
            ) conta
              ON TRUE

            ${where}

            ORDER BY
              cl.nome ASC

            LIMIT $${parametros.length + 1}
            OFFSET $${parametros.length + 2}
          `,
          parametrosLista,
        );

      const total =
        totalResultado.rows[0]
          .total;

      return respostaSucesso(
        response,
        {
          mensagem:
            "Clientes carregados com sucesso.",

          dados:
            resultado.rows,

          meta: {
            pagina,
            limite,

            total_registros:
              total,

            total_paginas:
              calcularTotalPaginas(
                total,
                limite,
              ),
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// CLIENTES — BUSCAR POR ID
// ============================================================================

app.get(
  "/api/clientes/:id",
  autenticar,
  async (request, response, next) => {
    try {
      const clienteId =
        validarId(
          request.params.id,
          "id do cliente",
        );

      const resultado =
        await pool.query(
          `
            SELECT
              cl.id,
              cl.nome,
              cl.apelido,
              cl.telefone,
              cl.observacao,
              cl.ativo,
              cl.criado_em,
              cl.atualizado_em,

              (
                SELECT COUNT(*)::INTEGER
                FROM contas c
                WHERE
                  c.cliente_id =
                    cl.id
              ) AS quantidade_contas,

              (
                SELECT COUNT(*)::INTEGER
                FROM contas c
                WHERE
                  c.cliente_id =
                    cl.id
                  AND c.status =
                    'PAGA'
              ) AS contas_pagas,

              (
                SELECT
                  COALESCE(
                    SUM(p.valor_pago),
                    0
                  )
                FROM contas c
                JOIN pagamentos p
                  ON p.conta_id = c.id
                WHERE
                  c.cliente_id =
                    cl.id
              )::NUMERIC(12, 2)
                AS total_pago

            FROM clientes cl
            WHERE cl.id = $1
            LIMIT 1
          `,
          [clienteId],
        );

      if (
        resultado.rowCount === 0
      ) {
        throw criarErro(
          "Cliente não encontrado.",
          404,
          "CLIENTE_NAO_ENCONTRADO",
        );
      }

      const contaPendente =
        await pool.query(
          `
            SELECT
              c.id,
              c.competencia,
              c.status,
              c.data_abertura,
              c.data_fechamento,
              COUNT(ic.id)::INTEGER
                AS quantidade_registros,
              COALESCE(
                SUM(ic.valor),
                0
              )::NUMERIC(12, 2)
                AS total_conta,
              MAX(ic.data_compra)
                AS ultima_compra
            FROM contas c
            LEFT JOIN itens_conta ic
              ON ic.conta_id = c.id
            WHERE
              c.cliente_id = $1
              AND c.status IN (
                'ABERTA',
                'FECHADA'
              )
            GROUP BY c.id
            LIMIT 1
          `,
          [clienteId],
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Cliente encontrado com sucesso.",

          dados: {
            cliente:
              resultado.rows[0],

            conta_pendente:
              contaPendente.rowCount >
              0
                ? contaPendente.rows[0]
                : null,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// CLIENTES — ATUALIZAR
// ============================================================================

app.patch(
  "/api/clientes/:id",
  autenticar,
  async (request, response, next) => {
    const clienteBanco =
      await pool.connect();

    try {
      const clienteId =
        validarId(
          request.params.id,
          "id do cliente",
        );

      const dados = validarDados(
        schemaAtualizarCliente,
        request.body,
      );

      await clienteBanco.query(
        "BEGIN",
      );

      const resultadoAtual =
        await clienteBanco.query(
          `
            SELECT
              id,
              nome,
              apelido,
              telefone,
              observacao,
              ativo,
              criado_em,
              atualizado_em
            FROM clientes
            WHERE id = $1
            FOR UPDATE
          `,
          [clienteId],
        );

      if (
        resultadoAtual.rowCount ===
        0
      ) {
        throw criarErro(
          "Cliente não encontrado.",
          404,
          "CLIENTE_NAO_ENCONTRADO",
        );
      }

      const anterior =
        resultadoAtual.rows[0];

      const nome =
        dados.nome !== undefined
          ? normalizarTexto(
              dados.nome,
            )
          : anterior.nome;

      const apelido =
        dados.apelido !== undefined
          ? dados.apelido.trim()
            ? normalizarTexto(
                dados.apelido,
              )
            : null
          : anterior.apelido;

      const telefone =
        dados.telefone !==
        undefined
          ? dados.telefone.trim()
            ? dados.telefone.trim()
            : null
          : anterior.telefone;

      const observacao =
        dados.observacao !==
        undefined
          ? dados.observacao.trim()
            ? dados.observacao.trim()
            : null
          : anterior.observacao;

      const ativo =
        dados.ativo !== undefined
          ? dados.ativo
          : anterior.ativo;

      const resultado =
        await clienteBanco.query(
          `
            UPDATE clientes
            SET
              nome = $1,
              apelido = $2,
              telefone = $3,
              observacao = $4,
              ativo = $5,
              atualizado_em = NOW()
            WHERE id = $6
            RETURNING
              id,
              nome,
              apelido,
              telefone,
              observacao,
              ativo,
              criado_em,
              atualizado_em
          `,
          [
            nome,
            apelido,
            telefone,
            observacao,
            ativo,
            clienteId,
          ],
        );

      const atualizado =
        resultado.rows[0];

      await registrarHistorico({
        usuarioId:
          request.usuario.id,

        acao: "EDICAO",

        entidade: "clientes",

        entidadeId:
          clienteId,

        descricao:
          `Cliente ${atualizado.nome} atualizado.`,

        dadosAnteriores:
          anterior,

        dadosNovos:
          atualizado,

        enderecoIp:
          request.ip,

        clienteBanco,
      });

      await clienteBanco.query(
        "COMMIT",
      );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Cliente atualizado com sucesso.",

          dados: {
            cliente:
              atualizado,
          },
        },
      );
    } catch (erro) {
      await clienteBanco.query(
        "ROLLBACK",
      );

      return next(erro);
    } finally {
      clienteBanco.release();
    }
  },
);


// ============================================================================
// CONTAS — FECHAR CONTAS VENCIDAS MANUALMENTE
//
// A API também executará essa função automaticamente
// nas rotas de listagem e abertura de conta.
// ============================================================================

app.post(
  "/api/contas/fechar-vencidas",
  autenticar,
  async (request, response, next) => {
    try {
      const contasFechadas =
        await fecharContasVencidas(
          pool,
          request.usuario.id,
        );

      for (
        const conta of
        contasFechadas
      ) {
        await registrarHistorico({
          usuarioId:
            request.usuario.id,

          acao:
            "FECHAMENTO_CONTA",

          entidade:
            "contas",

          entidadeId:
            conta.id,

          descricao:
            "Conta fechada automaticamente por encerramento do mês.",

          dadosNovos:
            conta,

          enderecoIp:
            request.ip,
        });
      }

      return respostaSucesso(
        response,
        {
          mensagem:
            contasFechadas.length > 0
              ? `${contasFechadas.length} conta(s) vencida(s) foram fechadas.`
              : "Não existem contas vencidas para fechar.",

          dados: {
            quantidade:
              contasFechadas.length,

            contas:
              contasFechadas,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// CONTAS — ABRIR NOVA CONTA
// ============================================================================

app.post(
  "/api/contas",
  autenticar,
  async (request, response, next) => {
    const clienteBanco =
      await pool.connect();

    try {
      const dados = validarDados(
        schemaAbrirConta,
        request.body,
      );

      await clienteBanco.query(
        "BEGIN",
      );

      await fecharContasVencidas(
        clienteBanco,
        request.usuario.id,
      );

      const clienteResultado =
        await clienteBanco.query(
          `
            SELECT
              id,
              nome,
              apelido,
              telefone,
              ativo
            FROM clientes
            WHERE id = $1
            FOR UPDATE
          `,
          [dados.cliente_id],
        );

      if (
        clienteResultado.rowCount ===
        0
      ) {
        throw criarErro(
          "Cliente não encontrado.",
          404,
          "CLIENTE_NAO_ENCONTRADO",
        );
      }

      const cliente =
        clienteResultado.rows[0];

      if (!cliente.ativo) {
        throw criarErro(
          "Não é possível abrir uma conta para um cliente desativado.",
          422,
          "CLIENTE_DESATIVADO",
        );
      }

      const contaPendente =
        await clienteBanco.query(
          `
            SELECT
              id,
              competencia,
              status,
              data_abertura
            FROM contas
            WHERE
              cliente_id = $1
              AND status IN (
                'ABERTA',
                'FECHADA'
              )
            LIMIT 1
          `,
          [dados.cliente_id],
        );

      if (
        contaPendente.rowCount > 0
      ) {
        throw criarErro(
          "Este cliente já possui uma conta aberta ou fechada aguardando pagamento.",
          409,
          "CLIENTE_POSSUI_CONTA_PENDENTE",
          {
            conta:
              contaPendente.rows[0],
          },
        );
      }

      const observacao =
        dados.observacao &&
        dados.observacao.trim()
          ? dados.observacao.trim()
          : null;

      const resultado =
        await clienteBanco.query(
          `
            INSERT INTO contas (
              cliente_id,
              competencia,
              status,
              data_abertura,
              observacao,
              criada_por
            )
            VALUES (
              $1,
              DATE_TRUNC(
                'month',
                CURRENT_DATE
              )::DATE,
              'ABERTA',
              NOW(),
              $2,
              $3
            )
            RETURNING
              id,
              cliente_id,
              competencia,
              status,
              data_abertura,
              data_fechamento,
              data_pagamento,
              observacao,
              criada_por,
              criado_em
          `,
          [
            dados.cliente_id,
            observacao,
            request.usuario.id,
          ],
        );

      const conta =
        resultado.rows[0];

      await registrarHistorico({
        usuarioId:
          request.usuario.id,

        acao:
          "ABERTURA_CONTA",

        entidade:
          "contas",

        entidadeId:
          conta.id,

        descricao:
          `Conta aberta para o cliente ${cliente.nome}.`,

        dadosNovos: {
          ...conta,
          cliente_nome:
            cliente.nome,
        },

        enderecoIp:
          request.ip,

        clienteBanco,
      });

      await clienteBanco.query(
        "COMMIT",
      );

      return respostaSucesso(
        response,
        {
          status: 201,

          mensagem:
            "Conta aberta com sucesso.",

          dados: {
            conta: {
              ...conta,

              cliente: {
                id:
                  cliente.id,

                nome:
                  cliente.nome,

                apelido:
                  cliente.apelido,

                telefone:
                  cliente.telefone,
              },

              quantidade_registros: 0,

              total_conta:
                "0.00",

              ultima_compra:
                null,
            },
          },
        },
      );
    } catch (erro) {
      await clienteBanco.query(
        "ROLLBACK",
      );

      return next(erro);
    } finally {
      clienteBanco.release();
    }
  },
);


// ============================================================================
// CONTAS — LISTAR CONTAS PENDENTES
//
// Por padrão, mostra ABERTAS e FECHADAS.
//
// Ordenações permitidas:
// mais_recente
// mais_antiga
// maior_valor
// menor_valor
// ============================================================================

app.get(
  "/api/contas",
  autenticar,
  async (request, response, next) => {
    try {
      await fecharContasVencidas(
        pool,
        request.usuario.id,
      );

      const {
        pagina,
        limite,
        offset,
      } = obterPaginacao(
        request.query,
      );

      const pesquisa =
        normalizarTexto(
          request.query.pesquisa || "",
        );

      const ordenacao =
        request.query.ordenacao ||
        "mais_recente";

      const statusSolicitado =
        request.query.status;

      const ordenacoes = {
        mais_recente: `
          COALESCE(
            MAX(ic.data_compra),
            c.data_abertura
          ) DESC
        `,

        mais_antiga: `
          COALESCE(
            MAX(ic.data_compra),
            c.data_abertura
          ) ASC
        `,

        maior_valor: `
          COALESCE(
            SUM(ic.valor),
            0
          ) DESC
        `,

        menor_valor: `
          COALESCE(
            SUM(ic.valor),
            0
          ) ASC
        `,
      };

      if (
        !ordenacoes[ordenacao]
      ) {
        throw criarErro(
          "Ordenação inválida.",
          422,
          "ORDENACAO_INVALIDA",
          {
            opcoes: [
              "mais_recente",
              "mais_antiga",
              "maior_valor",
              "menor_valor",
            ],
          },
        );
      }

      const parametros = [];
      const condicoes = [];

      if (
        statusSolicitado ===
        "ABERTA"
      ) {
        condicoes.push(
          "c.status = 'ABERTA'",
        );
      } else if (
        statusSolicitado ===
        "FECHADA"
      ) {
        condicoes.push(
          "c.status = 'FECHADA'",
        );
      } else {
        condicoes.push(`
          c.status IN (
            'ABERTA',
            'FECHADA'
          )
        `);
      }

      if (pesquisa) {
        parametros.push(
          `%${pesquisa}%`,
        );

        condicoes.push(`
          (
            cl.nome ILIKE
              $${parametros.length}
            OR cl.apelido ILIKE
              $${parametros.length}
          )
        `);
      }

      const where = `
        WHERE ${condicoes.join(
          " AND ",
        )}
      `;

      const totalResultado =
        await pool.query(
          `
            SELECT
              COUNT(*)::INTEGER
                AS total
            FROM contas c
            JOIN clientes cl
              ON cl.id =
                c.cliente_id
            ${where}
          `,
          parametros,
        );

      const parametrosLista = [
        ...parametros,
        limite,
        offset,
      ];

      const resultado =
        await pool.query(
          `
            SELECT
              c.id,
              c.cliente_id,
              cl.nome
                AS cliente_nome,
              cl.apelido,
              cl.telefone,
              c.competencia,
              c.status,
              c.data_abertura,
              c.data_fechamento,
              c.fechada_automaticamente,
              c.observacao,

              COUNT(ic.id)::INTEGER
                AS quantidade_registros,

              COALESCE(
                SUM(ic.valor),
                0
              )::NUMERIC(12, 2)
                AS total_conta,

              MAX(ic.data_compra)
                AS ultima_compra

            FROM contas c

            JOIN clientes cl
              ON cl.id =
                c.cliente_id

            LEFT JOIN itens_conta ic
              ON ic.conta_id =
                c.id

            ${where}

            GROUP BY
              c.id,
              c.cliente_id,
              cl.nome,
              cl.apelido,
              cl.telefone,
              c.competencia,
              c.status,
              c.data_abertura,
              c.data_fechamento,
              c.fechada_automaticamente,
              c.observacao

            ORDER BY
              ${ordenacoes[ordenacao]},
              cl.nome ASC

            LIMIT $${parametros.length + 1}
            OFFSET $${parametros.length + 2}
          `,
          parametrosLista,
        );

      const total =
        totalResultado.rows[0]
          .total;

      return respostaSucesso(
        response,
        {
          mensagem:
            "Contas carregadas com sucesso.",

          dados:
            resultado.rows,

          meta: {
            pagina,
            limite,

            total_registros:
              total,

            total_paginas:
              calcularTotalPaginas(
                total,
                limite,
              ),

            ordenacao,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// CONTAS — DETALHES
// ============================================================================

app.get(
  "/api/contas/:id",
  autenticar,
  async (request, response, next) => {
    try {
      const contaId =
        validarId(
          request.params.id,
          "id da conta",
        );

      const contaResultado =
        await pool.query(
          `
            SELECT
              c.id,
              c.cliente_id,

              cl.nome
                AS cliente_nome,

              cl.apelido,
              cl.telefone,

              c.competencia,
              c.status,
              c.data_abertura,
              c.data_fechamento,
              c.data_pagamento,
              c.fechada_automaticamente,
              c.observacao,

              criador.nome
                AS criada_por_nome,

              fechador.nome
                AS fechada_por_nome,

              COUNT(ic.id)::INTEGER
                AS quantidade_registros,

              COALESCE(
                SUM(ic.valor),
                0
              )::NUMERIC(12, 2)
                AS total_conta,

              MAX(ic.data_compra)
                AS ultima_compra

            FROM contas c

            JOIN clientes cl
              ON cl.id =
                c.cliente_id

            LEFT JOIN usuarios criador
              ON criador.id =
                c.criada_por

            LEFT JOIN usuarios fechador
              ON fechador.id =
                c.fechada_por

            LEFT JOIN itens_conta ic
              ON ic.conta_id =
                c.id

            WHERE c.id = $1

            GROUP BY
              c.id,
              c.cliente_id,
              cl.nome,
              cl.apelido,
              cl.telefone,
              c.competencia,
              c.status,
              c.data_abertura,
              c.data_fechamento,
              c.data_pagamento,
              c.fechada_automaticamente,
              c.observacao,
              criador.nome,
              fechador.nome

            LIMIT 1
          `,
          [contaId],
        );

      if (
        contaResultado.rowCount ===
        0
      ) {
        throw criarErro(
          "Conta não encontrada.",
          404,
          "CONTA_NAO_ENCONTRADA",
        );
      }

      const itensResultado =
        await pool.query(
          `
            SELECT
              ic.id,
              ic.descricao,
              ic.valor,
              ic.observacao,
              ic.data_compra,
              ic.criado_em,
              ic.atualizado_em,

              registrador.nome
                AS registrado_por_nome,

              editor.nome
                AS editado_por_nome

            FROM itens_conta ic

            LEFT JOIN usuarios registrador
              ON registrador.id =
                ic.registrado_por

            LEFT JOIN usuarios editor
              ON editor.id =
                ic.editado_por

            WHERE ic.conta_id = $1

            ORDER BY
              ic.data_compra ASC,
              ic.id ASC
          `,
          [contaId],
        );

      const pagamentoResultado =
        await pool.query(
          `
            SELECT
              p.id,
              p.valor_pago,
              p.forma,
              p.observacao,
              p.data_pagamento,

              u.nome
                AS recebido_por_nome

            FROM pagamentos p

            LEFT JOIN usuarios u
              ON u.id =
                p.recebido_por

            WHERE p.conta_id = $1

            LIMIT 1
          `,
          [contaId],
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Conta carregada com sucesso.",

          dados: {
            conta:
              contaResultado.rows[0],

            compras:
              itensResultado.rows,

            pagamento:
              pagamentoResultado.rowCount >
              0
                ? pagamentoResultado
                    .rows[0]
                : null,

            pode_adicionar_compra:
              contaResultado.rows[0]
                .status ===
              "ABERTA",

            pode_concluir_pagamento:
              [
                "ABERTA",
                "FECHADA",
              ].includes(
                contaResultado.rows[0]
                  .status,
              ),
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ROTA NÃO ENCONTRADA

// ============================================================================
// PARTE 3
// COMPRAS / ITENS DA CONTA
// ============================================================================


// ============================================================================
// SCHEMAS DAS COMPRAS
// ============================================================================

const schemaAdicionarCompra = z.object({
  descricao: z
    .string({
      required_error: "A descrição da compra é obrigatória.",
    })
    .trim()
    .min(
      1,
      "Informe o nome ou a descrição da compra.",
    )
    .max(
      255,
      "A descrição deve possuir no máximo 255 caracteres.",
    ),

  valor: z.coerce
    .number({
      required_error: "O valor da compra é obrigatório.",
      invalid_type_error: "Informe um valor válido.",
    })
    .positive(
      "O valor da compra deve ser maior que zero.",
    )
    .max(
      9999999999.99,
      "O valor informado ultrapassa o limite permitido.",
    ),

  observacao: z
    .string()
    .trim()
    .max(
      1000,
      "A observação deve possuir no máximo 1000 caracteres.",
    )
    .optional()
    .or(z.literal("")),
});


const schemaEditarCompra = z
  .object({
    descricao: z
      .string()
      .trim()
      .min(
        1,
        "Informe o nome ou a descrição da compra.",
      )
      .max(
        255,
        "A descrição deve possuir no máximo 255 caracteres.",
      )
      .optional(),

    valor: z.coerce
      .number({
        invalid_type_error: "Informe um valor válido.",
      })
      .positive(
        "O valor da compra deve ser maior que zero.",
      )
      .max(
        9999999999.99,
        "O valor informado ultrapassa o limite permitido.",
      )
      .optional(),

    observacao: z
      .string()
      .trim()
      .max(
        1000,
        "A observação deve possuir no máximo 1000 caracteres.",
      )
      .nullable()
      .optional()
      .or(z.literal("")),

    data_compra: z
      .string()
      .datetime({
        message:
          "A data da compra deve estar no formato ISO 8601.",
      })
      .optional(),
  })
  .refine(
    (dados) => Object.keys(dados).length > 0,
    {
      message:
        "Informe pelo menos um campo para atualizar.",
    },
  );


// ============================================================================
// FUNÇÃO PARA BUSCAR E BLOQUEAR UMA CONTA
// ============================================================================

async function buscarContaParaMovimentacao(
  clienteBanco,
  contaId,
) {
  const resultado = await clienteBanco.query(
    `
      SELECT
        c.id,
        c.cliente_id,
        c.competencia,
        c.status,
        c.data_abertura,

        cl.nome AS cliente_nome

      FROM contas c

      JOIN clientes cl
        ON cl.id = c.cliente_id

      WHERE c.id = $1

      FOR UPDATE
    `,
    [contaId],
  );

  if (resultado.rowCount === 0) {
    throw criarErro(
      "Conta não encontrada.",
      404,
      "CONTA_NAO_ENCONTRADA",
    );
  }

  return resultado.rows[0];
}


// ============================================================================
// FUNÇÃO PARA VALIDAR SE A CONTA ACEITA COMPRAS
// ============================================================================

function validarContaAbertaParaCompra(conta) {
  if (conta.status === "FECHADA") {
    throw criarErro(
      "Esta conta está fechada e não pode receber novas compras.",
      409,
      "CONTA_FECHADA",
    );
  }

  if (conta.status === "PAGA") {
    throw criarErro(
      "Esta conta já foi paga e não pode receber novas compras.",
      409,
      "CONTA_PAGA",
    );
  }

  if (conta.status === "CANCELADA") {
    throw criarErro(
      "Esta conta está cancelada e não pode receber novas compras.",
      409,
      "CONTA_CANCELADA",
    );
  }

  if (conta.status !== "ABERTA") {
    throw criarErro(
      "A conta não está disponível para receber compras.",
      409,
      "CONTA_INDISPONIVEL",
    );
  }
}


// ============================================================================
// FUNÇÃO PARA OBTER O RESUMO ATUAL DA CONTA
// ============================================================================

async function obterResumoConta(
  clienteBanco,
  contaId,
) {
  const resultado = await clienteBanco.query(
    `
      SELECT
        c.id,
        c.cliente_id,
        c.competencia,
        c.status,
        c.data_abertura,
        c.data_fechamento,
        c.data_pagamento,

        COUNT(ic.id)::INTEGER
          AS quantidade_registros,

        COALESCE(
          SUM(ic.valor),
          0
        )::NUMERIC(12, 2)
          AS total_conta,

        MAX(ic.data_compra)
          AS ultima_compra

      FROM contas c

      LEFT JOIN itens_conta ic
        ON ic.conta_id = c.id

      WHERE c.id = $1

      GROUP BY c.id
    `,
    [contaId],
  );

  if (resultado.rowCount === 0) {
    throw criarErro(
      "Conta não encontrada.",
      404,
      "CONTA_NAO_ENCONTRADA",
    );
  }

  return resultado.rows[0];
}


// ============================================================================
// COMPRAS — ADICIONAR COMPRA
// ============================================================================

app.post(
  "/api/contas/:contaId/compras",
  autenticar,
  async (request, response, next) => {
    const clienteBanco = await pool.connect();

    try {
      const contaId = validarId(
        request.params.contaId,
        "id da conta",
      );

      const dados = validarDados(
        schemaAdicionarCompra,
        request.body,
      );

      await clienteBanco.query("BEGIN");

      // Fecha automaticamente contas de meses anteriores.
      await fecharContasVencidas(
        clienteBanco,
        request.usuario.id,
      );

      const conta = await buscarContaParaMovimentacao(
        clienteBanco,
        contaId,
      );

      validarContaAbertaParaCompra(conta);

      const descricao = normalizarTexto(
        dados.descricao,
      );

      const observacao =
        dados.observacao &&
        dados.observacao.trim()
          ? dados.observacao.trim()
          : null;

      const resultado = await clienteBanco.query(
        `
          INSERT INTO itens_conta (
            conta_id,
            descricao,
            valor,
            observacao,
            data_compra,
            registrado_por
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            NOW(),
            $5
          )
          RETURNING
            id,
            conta_id,
            descricao,
            valor,
            observacao,
            data_compra,
            registrado_por,
            criado_em,
            atualizado_em
        `,
        [
          contaId,
          descricao,
          dados.valor,
          observacao,
          request.usuario.id,
        ],
      );

      const compra = resultado.rows[0];

      const resumoConta = await obterResumoConta(
        clienteBanco,
        contaId,
      );

      await registrarHistorico({
        usuarioId: request.usuario.id,
        acao: "CRIACAO",
        entidade: "itens_conta",
        entidadeId: compra.id,
        descricao:
          `Compra registrada na conta de ${conta.cliente_nome}.`,
        dadosNovos: compra,
        enderecoIp: request.ip,
        clienteBanco,
      });

      await clienteBanco.query("COMMIT");

      return respostaSucesso(response, {
        status: 201,
        mensagem: "Compra registrada com sucesso.",
        dados: {
          compra,
          conta: resumoConta,
        },
      });
    } catch (erro) {
      await clienteBanco.query("ROLLBACK");
      return next(erro);
    } finally {
      clienteBanco.release();
    }
  },
);


// ============================================================================
// COMPRAS — LISTAR COMPRAS DE UMA CONTA
// ============================================================================

app.get(
  "/api/contas/:contaId/compras",
  autenticar,
  async (request, response, next) => {
    try {
      const contaId = validarId(
        request.params.contaId,
        "id da conta",
      );

      const contaResultado = await pool.query(
        `
          SELECT
            c.id,
            c.status,
            c.competencia,
            c.data_abertura,

            cl.id AS cliente_id,
            cl.nome AS cliente_nome,
            cl.apelido,
            cl.telefone

          FROM contas c

          JOIN clientes cl
            ON cl.id = c.cliente_id

          WHERE c.id = $1

          LIMIT 1
        `,
        [contaId],
      );

      if (contaResultado.rowCount === 0) {
        throw criarErro(
          "Conta não encontrada.",
          404,
          "CONTA_NAO_ENCONTRADA",
        );
      }

      const comprasResultado = await pool.query(
        `
          SELECT
            ic.id,
            ic.conta_id,
            ic.descricao,
            ic.valor,
            ic.observacao,
            ic.data_compra,
            ic.criado_em,
            ic.atualizado_em,

            registrador.id
              AS registrado_por_id,

            registrador.nome
              AS registrado_por_nome,

            editor.id
              AS editado_por_id,

            editor.nome
              AS editado_por_nome

          FROM itens_conta ic

          LEFT JOIN usuarios registrador
            ON registrador.id =
              ic.registrado_por

          LEFT JOIN usuarios editor
            ON editor.id =
              ic.editado_por

          WHERE ic.conta_id = $1

          ORDER BY
            ic.data_compra ASC,
            ic.id ASC
        `,
        [contaId],
      );

      const resumoConta = await obterResumoConta(
        pool,
        contaId,
      );

      return respostaSucesso(response, {
        mensagem:
          "Compras da conta carregadas com sucesso.",
        dados: {
          conta: {
            ...contaResultado.rows[0],
            quantidade_registros:
              resumoConta.quantidade_registros,
            total_conta:
              resumoConta.total_conta,
            ultima_compra:
              resumoConta.ultima_compra,
          },

          compras: comprasResultado.rows,

          pode_adicionar_compra:
            contaResultado.rows[0].status ===
            "ABERTA",
        },
      });
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// COMPRAS — BUSCAR UMA COMPRA ESPECÍFICA
// ============================================================================

app.get(
  "/api/compras/:id",
  autenticar,
  async (request, response, next) => {
    try {
      const compraId = validarId(
        request.params.id,
        "id da compra",
      );

      const resultado = await pool.query(
        `
          SELECT
            ic.id,
            ic.conta_id,
            ic.descricao,
            ic.valor,
            ic.observacao,
            ic.data_compra,
            ic.criado_em,
            ic.atualizado_em,

            c.status AS conta_status,
            c.competencia,

            cl.id AS cliente_id,
            cl.nome AS cliente_nome,

            registrador.nome
              AS registrado_por_nome,

            editor.nome
              AS editado_por_nome

          FROM itens_conta ic

          JOIN contas c
            ON c.id = ic.conta_id

          JOIN clientes cl
            ON cl.id = c.cliente_id

          LEFT JOIN usuarios registrador
            ON registrador.id =
              ic.registrado_por

          LEFT JOIN usuarios editor
            ON editor.id =
              ic.editado_por

          WHERE ic.id = $1

          LIMIT 1
        `,
        [compraId],
      );

      if (resultado.rowCount === 0) {
        throw criarErro(
          "Compra não encontrada.",
          404,
          "COMPRA_NAO_ENCONTRADA",
        );
      }

      return respostaSucesso(response, {
        mensagem:
          "Compra encontrada com sucesso.",
        dados: {
          compra: resultado.rows[0],
        },
      });
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// COMPRAS — EDITAR COMPRA
// ============================================================================

app.patch(
  "/api/compras/:id",
  autenticar,
  async (request, response, next) => {
    const clienteBanco = await pool.connect();

    try {
      const compraId = validarId(
        request.params.id,
        "id da compra",
      );

      const dados = validarDados(
        schemaEditarCompra,
        request.body,
      );

      await clienteBanco.query("BEGIN");

      await fecharContasVencidas(
        clienteBanco,
        request.usuario.id,
      );

      const compraResultado = await clienteBanco.query(
        `
          SELECT
            ic.id,
            ic.conta_id,
            ic.descricao,
            ic.valor,
            ic.observacao,
            ic.data_compra,
            ic.registrado_por,
            ic.editado_por,
            ic.criado_em,
            ic.atualizado_em,

            c.status AS conta_status,

            cl.nome AS cliente_nome

          FROM itens_conta ic

          JOIN contas c
            ON c.id = ic.conta_id

          JOIN clientes cl
            ON cl.id = c.cliente_id

          WHERE ic.id = $1

          FOR UPDATE
        `,
        [compraId],
      );

      if (compraResultado.rowCount === 0) {
        throw criarErro(
          "Compra não encontrada.",
          404,
          "COMPRA_NAO_ENCONTRADA",
        );
      }

      const compraAnterior =
        compraResultado.rows[0];

      validarContaAbertaParaCompra({
        status: compraAnterior.conta_status,
      });

      if (
        dados.data_compra !== undefined &&
        request.usuario.perfil !==
          "ADMINISTRADOR"
      ) {
        throw criarErro(
          "Somente administradores podem alterar a data e a hora da compra.",
          403,
          "ALTERACAO_DATA_NAO_PERMITIDA",
        );
      }

      const descricao =
        dados.descricao !== undefined
          ? normalizarTexto(dados.descricao)
          : compraAnterior.descricao;

      const valor =
        dados.valor !== undefined
          ? dados.valor
          : compraAnterior.valor;

      let observacao =
        compraAnterior.observacao;

      if (dados.observacao !== undefined) {
        observacao =
          dados.observacao &&
          dados.observacao.trim()
            ? dados.observacao.trim()
            : null;
      }

      const dataCompra =
        dados.data_compra !== undefined
          ? new Date(dados.data_compra)
          : compraAnterior.data_compra;

      const resultado = await clienteBanco.query(
        `
          UPDATE itens_conta
          SET
            descricao = $1,
            valor = $2,
            observacao = $3,
            data_compra = $4,
            editado_por = $5,
            atualizado_em = NOW()
          WHERE id = $6
          RETURNING
            id,
            conta_id,
            descricao,
            valor,
            observacao,
            data_compra,
            registrado_por,
            editado_por,
            criado_em,
            atualizado_em
        `,
        [
          descricao,
          valor,
          observacao,
          dataCompra,
          request.usuario.id,
          compraId,
        ],
      );

      const compraAtualizada =
        resultado.rows[0];

      const resumoConta = await obterResumoConta(
        clienteBanco,
        compraAnterior.conta_id,
      );

      await registrarHistorico({
        usuarioId: request.usuario.id,
        acao: "EDICAO",
        entidade: "itens_conta",
        entidadeId: compraId,
        descricao:
          `Compra da conta de ${compraAnterior.cliente_nome} atualizada.`,
        dadosAnteriores: {
          id: compraAnterior.id,
          conta_id: compraAnterior.conta_id,
          descricao: compraAnterior.descricao,
          valor: compraAnterior.valor,
          observacao: compraAnterior.observacao,
          data_compra:
            compraAnterior.data_compra,
        },
        dadosNovos: compraAtualizada,
        enderecoIp: request.ip,
        clienteBanco,
      });

      await clienteBanco.query("COMMIT");

      return respostaSucesso(response, {
        mensagem: "Compra atualizada com sucesso.",
        dados: {
          compra: compraAtualizada,
          conta: resumoConta,
        },
      });
    } catch (erro) {
      await clienteBanco.query("ROLLBACK");
      return next(erro);
    } finally {
      clienteBanco.release();
    }
  },
);


// ============================================================================
// COMPRAS — EXCLUIR COMPRA
// ============================================================================

app.delete(
  "/api/compras/:id",
  autenticar,
  async (request, response, next) => {
    const clienteBanco = await pool.connect();

    try {
      const compraId = validarId(
        request.params.id,
        "id da compra",
      );

      await clienteBanco.query("BEGIN");

      await fecharContasVencidas(
        clienteBanco,
        request.usuario.id,
      );

      const compraResultado = await clienteBanco.query(
        `
          SELECT
            ic.id,
            ic.conta_id,
            ic.descricao,
            ic.valor,
            ic.observacao,
            ic.data_compra,
            ic.registrado_por,
            ic.editado_por,
            ic.criado_em,
            ic.atualizado_em,

            c.status AS conta_status,

            cl.nome AS cliente_nome

          FROM itens_conta ic

          JOIN contas c
            ON c.id = ic.conta_id

          JOIN clientes cl
            ON cl.id = c.cliente_id

          WHERE ic.id = $1

          FOR UPDATE
        `,
        [compraId],
      );

      if (compraResultado.rowCount === 0) {
        throw criarErro(
          "Compra não encontrada.",
          404,
          "COMPRA_NAO_ENCONTRADA",
        );
      }

      const compra = compraResultado.rows[0];

      validarContaAbertaParaCompra({
        status: compra.conta_status,
      });

      await clienteBanco.query(
        `
          DELETE FROM itens_conta
          WHERE id = $1
        `,
        [compraId],
      );

      const resumoConta = await obterResumoConta(
        clienteBanco,
        compra.conta_id,
      );

      await registrarHistorico({
        usuarioId: request.usuario.id,
        acao: "EXCLUSAO",
        entidade: "itens_conta",
        entidadeId: compraId,
        descricao:
          `Compra excluída da conta de ${compra.cliente_nome}.`,
        dadosAnteriores: {
          id: compra.id,
          conta_id: compra.conta_id,
          descricao: compra.descricao,
          valor: compra.valor,
          observacao: compra.observacao,
          data_compra: compra.data_compra,
          registrado_por:
            compra.registrado_por,
          editado_por: compra.editado_por,
          criado_em: compra.criado_em,
          atualizado_em:
            compra.atualizado_em,
        },
        enderecoIp: request.ip,
        clienteBanco,
      });

      await clienteBanco.query("COMMIT");

      return respostaSucesso(response, {
        mensagem: "Compra excluída com sucesso.",
        dados: {
          compra_excluida: {
            id: compra.id,
            descricao: compra.descricao,
            valor: compra.valor,
          },
          conta: resumoConta,
        },
      });
    } catch (erro) {
      await clienteBanco.query("ROLLBACK");
      return next(erro);
    } finally {
      clienteBanco.release();
    }
  },
);


// ROTA NÃO ENCONTRADA

// ============================================================================
// PARTE 4
// PAGAMENTOS E HISTÓRICO
// ============================================================================


// ============================================================================
// SCHEMA DO PAGAMENTO
// ============================================================================

const schemaConcluirPagamento = z.object({
  forma: z.enum(
    [
      "DINHEIRO",
      "PIX",
      "CARTAO",
    ],
    {
      errorMap: () => ({
        message:
          "A forma de pagamento deve ser DINHEIRO, PIX ou CARTAO.",
      }),
    },
  ),

  observacao: z
    .string()
    .trim()
    .max(
      1000,
      "A observação deve possuir no máximo 1000 caracteres.",
    )
    .optional()
    .or(z.literal("")),
});


// ============================================================================
// FUNÇÃO PARA BUSCAR O TOTAL DE UMA CONTA
// ============================================================================

async function calcularTotalConta(
  clienteBanco,
  contaId,
) {
  const resultado =
    await clienteBanco.query(
      `
        SELECT
          COALESCE(
            SUM(valor),
            0
          )::NUMERIC(12, 2)
            AS total
        FROM itens_conta
        WHERE conta_id = $1
      `,
      [contaId],
    );

  return Number(
    resultado.rows[0].total,
  );
}


// ============================================================================
// FUNÇÃO PARA FORMATAR VALORES MONETÁRIOS
// ============================================================================

function formatarMoeda(valor) {
  return Number(valor).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );
}


// ============================================================================
// PAGAMENTOS — CONCLUIR PAGAMENTO
//
// O pagamento é integral.
// A conta pode estar ABERTA ou FECHADA.
// Depois do pagamento, passa para PAGA.
// ============================================================================

app.post(
  "/api/contas/:contaId/pagamento",
  autenticar,
  async (request, response, next) => {
    const clienteBanco =
      await pool.connect();

    try {
      const contaId = validarId(
        request.params.contaId,
        "id da conta",
      );

      const dados = validarDados(
        schemaConcluirPagamento,
        request.body,
      );

      await clienteBanco.query(
        "BEGIN",
      );

      await fecharContasVencidas(
        clienteBanco,
        request.usuario.id,
      );

      const contaResultado =
        await clienteBanco.query(
          `
            SELECT
              c.id,
              c.cliente_id,
              c.competencia,
              c.status,
              c.data_abertura,
              c.data_fechamento,
              c.data_pagamento,
              c.observacao,

              cl.nome
                AS cliente_nome,

              cl.apelido,
              cl.telefone

            FROM contas c

            JOIN clientes cl
              ON cl.id =
                c.cliente_id

            WHERE c.id = $1

            FOR UPDATE
          `,
          [contaId],
        );

      if (
        contaResultado.rowCount ===
        0
      ) {
        throw criarErro(
          "Conta não encontrada.",
          404,
          "CONTA_NAO_ENCONTRADA",
        );
      }

      const conta =
        contaResultado.rows[0];

      if (
        conta.status === "PAGA"
      ) {
        throw criarErro(
          "Esta conta já foi paga.",
          409,
          "CONTA_JA_PAGA",
        );
      }

      if (
        conta.status ===
        "CANCELADA"
      ) {
        throw criarErro(
          "Não é possível pagar uma conta cancelada.",
          409,
          "CONTA_CANCELADA",
        );
      }

      if (
        ![
          "ABERTA",
          "FECHADA",
        ].includes(conta.status)
      ) {
        throw criarErro(
          "Esta conta não está disponível para pagamento.",
          409,
          "CONTA_INDISPONIVEL_PARA_PAGAMENTO",
        );
      }

      const pagamentoExistente =
        await clienteBanco.query(
          `
            SELECT id
            FROM pagamentos
            WHERE conta_id = $1
            LIMIT 1
          `,
          [contaId],
        );

      if (
        pagamentoExistente.rowCount >
        0
      ) {
        throw criarErro(
          "Já existe um pagamento registrado para esta conta.",
          409,
          "PAGAMENTO_DUPLICADO",
        );
      }

      const totalConta =
        await calcularTotalConta(
          clienteBanco,
          contaId,
        );

      if (totalConta <= 0) {
        throw criarErro(
          "Não é possível concluir uma conta sem compras registradas.",
          422,
          "CONTA_SEM_COMPRAS",
        );
      }

      const observacao =
        dados.observacao &&
        dados.observacao.trim()
          ? dados.observacao.trim()
          : null;

      const pagamentoResultado =
        await clienteBanco.query(
          `
            INSERT INTO pagamentos (
              conta_id,
              valor_pago,
              forma,
              observacao,
              data_pagamento,
              recebido_por
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              NOW(),
              $5
            )
            RETURNING
              id,
              conta_id,
              valor_pago,
              forma,
              observacao,
              data_pagamento,
              recebido_por,
              criado_em,
              atualizado_em
          `,
          [
            contaId,
            totalConta,
            dados.forma,
            observacao,
            request.usuario.id,
          ],
        );

      const pagamento =
        pagamentoResultado.rows[0];

      const contaAtualizadaResultado =
        await clienteBanco.query(
          `
            UPDATE contas
            SET
              status = 'PAGA',

              data_pagamento =
                $1,

              data_fechamento =
                COALESCE(
                  data_fechamento,
                  $1
                ),

              atualizado_em =
                NOW()

            WHERE id = $2

            RETURNING
              id,
              cliente_id,
              competencia,
              status,
              data_abertura,
              data_fechamento,
              data_pagamento,
              observacao,
              criado_em,
              atualizado_em
          `,
          [
            pagamento.data_pagamento,
            contaId,
          ],
        );

      const contaAtualizada =
        contaAtualizadaResultado.rows[0];

      await registrarHistorico({
        usuarioId:
          request.usuario.id,

        acao: "PAGAMENTO",

        entidade:
          "pagamentos",

        entidadeId:
          pagamento.id,

        descricao:
          `Pagamento da conta de ${conta.cliente_nome} concluído no valor de ${formatarMoeda(totalConta)}.`,

        dadosNovos: {
          pagamento,
          conta:
            contaAtualizada,
          cliente_nome:
            conta.cliente_nome,
        },

        enderecoIp:
          request.ip,

        clienteBanco,
      });

      await clienteBanco.query(
        "COMMIT",
      );

      return respostaSucesso(
        response,
        {
          status: 201,

          mensagem:
            "Pagamento concluído com sucesso.",

          dados: {
            cliente: {
              id:
                conta.cliente_id,

              nome:
                conta.cliente_nome,

              apelido:
                conta.apelido,

              telefone:
                conta.telefone,
            },

            conta:
              contaAtualizada,

            pagamento,

            nova_conta_liberada:
              true,
          },
        },
      );
    } catch (erro) {
      await clienteBanco.query(
        "ROLLBACK",
      );

      return next(erro);
    } finally {
      clienteBanco.release();
    }
  },
);


// ============================================================================
// PAGAMENTOS — BUSCAR PAGAMENTO DE UMA CONTA
// ============================================================================

app.get(
  "/api/contas/:contaId/pagamento",
  autenticar,
  async (request, response, next) => {
    try {
      const contaId = validarId(
        request.params.contaId,
        "id da conta",
      );

      const resultado =
        await pool.query(
          `
            SELECT
              p.id,
              p.conta_id,
              p.valor_pago,
              p.forma,
              p.observacao,
              p.data_pagamento,
              p.criado_em,
              p.atualizado_em,

              c.competencia,
              c.status,
              c.data_abertura,
              c.data_fechamento,

              cl.id
                AS cliente_id,

              cl.nome
                AS cliente_nome,

              cl.apelido,

              u.id
                AS recebido_por_id,

              u.nome
                AS recebido_por_nome

            FROM pagamentos p

            JOIN contas c
              ON c.id =
                p.conta_id

            JOIN clientes cl
              ON cl.id =
                c.cliente_id

            LEFT JOIN usuarios u
              ON u.id =
                p.recebido_por

            WHERE p.conta_id = $1

            LIMIT 1
          `,
          [contaId],
        );

      if (
        resultado.rowCount === 0
      ) {
        throw criarErro(
          "Pagamento não encontrado para esta conta.",
          404,
          "PAGAMENTO_NAO_ENCONTRADO",
        );
      }

      return respostaSucesso(
        response,
        {
          mensagem:
            "Pagamento encontrado com sucesso.",

          dados: {
            pagamento:
              resultado.rows[0],
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// HISTÓRICO — LISTAR CONTAS PAGAS
//
// Pesquisa pelo nome ou apelido.
// Ordenação padrão: pagamento mais recente.
// ============================================================================

app.get(
  "/api/historico",
  autenticar,
  async (request, response, next) => {
    try {
      const {
        pagina,
        limite,
        offset,
      } = obterPaginacao(
        request.query,
      );

      const pesquisa =
        normalizarTexto(
          request.query.pesquisa ||
            "",
        );

      const ano =
        request.query.ano
          ? Number(
              request.query.ano,
            )
          : null;

      const mes =
        request.query.mes
          ? Number(
              request.query.mes,
            )
          : null;

      const parametros = [];
      const condicoes = [
        "c.status = 'PAGA'",
      ];

      if (pesquisa) {
        parametros.push(
          `%${pesquisa}%`,
        );

        condicoes.push(`
          (
            cl.nome ILIKE
              $${parametros.length}
            OR cl.apelido ILIKE
              $${parametros.length}
          )
        `);
      }

      if (ano !== null) {
        if (
          !Number.isInteger(ano) ||
          ano < 2000 ||
          ano > 2100
        ) {
          throw criarErro(
            "Ano inválido.",
            422,
            "ANO_INVALIDO",
          );
        }

        parametros.push(ano);

        condicoes.push(`
          EXTRACT(
            YEAR FROM c.competencia
          ) = $${parametros.length}
        `);
      }

      if (mes !== null) {
        if (
          !Number.isInteger(mes) ||
          mes < 1 ||
          mes > 12
        ) {
          throw criarErro(
            "Mês inválido.",
            422,
            "MES_INVALIDO",
          );
        }

        parametros.push(mes);

        condicoes.push(`
          EXTRACT(
            MONTH FROM c.competencia
          ) = $${parametros.length}
        `);
      }

      const where = `
        WHERE ${condicoes.join(
          " AND ",
        )}
      `;

      const totalResultado =
        await pool.query(
          `
            SELECT
              COUNT(*)::INTEGER
                AS total

            FROM contas c

            JOIN clientes cl
              ON cl.id =
                c.cliente_id

            JOIN pagamentos p
              ON p.conta_id =
                c.id

            ${where}
          `,
          parametros,
        );

      const parametrosLista = [
        ...parametros,
        limite,
        offset,
      ];

      const resultado =
        await pool.query(
          `
            SELECT
              c.id
                AS conta_id,

              c.cliente_id,

              cl.nome
                AS cliente_nome,

              cl.apelido,
              cl.telefone,

              c.competencia,
              c.data_abertura,
              c.data_fechamento,
              c.data_pagamento,

              COUNT(ic.id)::INTEGER
                AS quantidade_registros,

              COALESCE(
                SUM(ic.valor),
                0
              )::NUMERIC(12, 2)
                AS total_conta,

              p.id
                AS pagamento_id,

              p.valor_pago,
              p.forma,
              p.observacao
                AS observacao_pagamento,

              p.data_pagamento,

              u.nome
                AS recebido_por_nome

            FROM contas c

            JOIN clientes cl
              ON cl.id =
                c.cliente_id

            JOIN pagamentos p
              ON p.conta_id =
                c.id

            LEFT JOIN itens_conta ic
              ON ic.conta_id =
                c.id

            LEFT JOIN usuarios u
              ON u.id =
                p.recebido_por

            ${where}

            GROUP BY
              c.id,
              c.cliente_id,
              cl.nome,
              cl.apelido,
              cl.telefone,
              c.competencia,
              c.data_abertura,
              c.data_fechamento,
              c.data_pagamento,
              p.id,
              p.valor_pago,
              p.forma,
              p.observacao,
              p.data_pagamento,
              u.nome

            ORDER BY
              p.data_pagamento DESC,
              c.id DESC

            LIMIT $${parametros.length + 1}
            OFFSET $${parametros.length + 2}
          `,
          parametrosLista,
        );

      const total =
        totalResultado.rows[0]
          .total;

      return respostaSucesso(
        response,
        {
          mensagem:
            "Histórico carregado com sucesso.",

          dados:
            resultado.rows,

          meta: {
            pagina,
            limite,

            total_registros:
              total,

            total_paginas:
              calcularTotalPaginas(
                total,
                limite,
              ),
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// HISTÓRICO — DETALHES DE UMA CONTA PAGA
// ============================================================================

app.get(
  "/api/historico/:contaId",
  autenticar,
  async (request, response, next) => {
    try {
      const contaId = validarId(
        request.params.contaId,
        "id da conta",
      );

      const contaResultado =
        await pool.query(
          `
            SELECT
              c.id,
              c.cliente_id,
              c.competencia,
              c.status,
              c.data_abertura,
              c.data_fechamento,
              c.data_pagamento,
              c.observacao
                AS observacao_conta,

              cl.nome
                AS cliente_nome,

              cl.apelido,
              cl.telefone,
              cl.observacao
                AS observacao_cliente,

              criador.nome
                AS criada_por_nome,

              fechador.nome
                AS fechada_por_nome

            FROM contas c

            JOIN clientes cl
              ON cl.id =
                c.cliente_id

            LEFT JOIN usuarios criador
              ON criador.id =
                c.criada_por

            LEFT JOIN usuarios fechador
              ON fechador.id =
                c.fechada_por

            WHERE c.id = $1
              AND c.status =
                'PAGA'

            LIMIT 1
          `,
          [contaId],
        );

      if (
        contaResultado.rowCount ===
        0
      ) {
        throw criarErro(
          "Conta paga não encontrada no histórico.",
          404,
          "HISTORICO_NAO_ENCONTRADO",
        );
      }

      const comprasResultado =
        await pool.query(
          `
            SELECT
              ic.id,
              ic.descricao,
              ic.valor,
              ic.observacao,
              ic.data_compra,

              registrador.nome
                AS registrado_por_nome,

              editor.nome
                AS editado_por_nome

            FROM itens_conta ic

            LEFT JOIN usuarios registrador
              ON registrador.id =
                ic.registrado_por

            LEFT JOIN usuarios editor
              ON editor.id =
                ic.editado_por

            WHERE ic.conta_id = $1

            ORDER BY
              ic.data_compra ASC,
              ic.id ASC
          `,
          [contaId],
        );

      const pagamentoResultado =
        await pool.query(
          `
            SELECT
              p.id,
              p.valor_pago,
              p.forma,
              p.observacao,
              p.data_pagamento,

              u.id
                AS recebido_por_id,

              u.nome
                AS recebido_por_nome

            FROM pagamentos p

            LEFT JOIN usuarios u
              ON u.id =
                p.recebido_por

            WHERE p.conta_id = $1

            LIMIT 1
          `,
          [contaId],
        );

      if (
        pagamentoResultado.rowCount ===
        0
      ) {
        throw criarErro(
          "O pagamento desta conta não foi encontrado.",
          404,
          "PAGAMENTO_NAO_ENCONTRADO",
        );
      }

      const totalConta =
        comprasResultado.rows.reduce(
          (
            acumulador,
            compra,
          ) =>
            acumulador +
            Number(compra.valor),
          0,
        );

      const clienteId =
        contaResultado.rows[0]
          .cliente_id;

      const contaPendenteResultado =
        await pool.query(
          `
            SELECT
              id,
              competencia,
              status,
              data_abertura

            FROM contas

            WHERE cliente_id = $1
              AND status IN (
                'ABERTA',
                'FECHADA'
              )

            LIMIT 1
          `,
          [clienteId],
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Detalhes do histórico carregados com sucesso.",

          dados: {
            conta: {
              ...contaResultado
                .rows[0],

              quantidade_registros:
                comprasResultado
                  .rowCount,

              total_conta:
                totalConta.toFixed(
                  2,
                ),
            },

            compras:
              comprasResultado.rows,

            pagamento:
              pagamentoResultado
                .rows[0],

            cliente_possui_conta_pendente:
              contaPendenteResultado
                .rowCount > 0,

            conta_pendente:
              contaPendenteResultado
                .rowCount > 0
                ? contaPendenteResultado
                    .rows[0]
                : null,

            pode_abrir_nova_conta:
              contaPendenteResultado
                .rowCount === 0,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// HISTÓRICO — CONTAS PAGAS DE UM CLIENTE
// ============================================================================

app.get(
  "/api/clientes/:clienteId/historico",
  autenticar,
  async (request, response, next) => {
    try {
      const clienteId = validarId(
        request.params.clienteId,
        "id do cliente",
      );

      const clienteResultado =
        await pool.query(
          `
            SELECT
              id,
              nome,
              apelido,
              telefone,
              observacao,
              ativo,
              criado_em

            FROM clientes

            WHERE id = $1

            LIMIT 1
          `,
          [clienteId],
        );

      if (
        clienteResultado.rowCount ===
        0
      ) {
        throw criarErro(
          "Cliente não encontrado.",
          404,
          "CLIENTE_NAO_ENCONTRADO",
        );
      }

      const resultado =
        await pool.query(
          `
            SELECT
              c.id
                AS conta_id,

              c.competencia,
              c.data_abertura,
              c.data_fechamento,
              c.data_pagamento,

              COUNT(ic.id)::INTEGER
                AS quantidade_registros,

              COALESCE(
                SUM(ic.valor),
                0
              )::NUMERIC(12, 2)
                AS total_conta,

              p.forma,
              p.valor_pago,
              p.data_pagamento

            FROM contas c

            JOIN pagamentos p
              ON p.conta_id =
                c.id

            LEFT JOIN itens_conta ic
              ON ic.conta_id =
                c.id

            WHERE
              c.cliente_id = $1
              AND c.status =
                'PAGA'

            GROUP BY
              c.id,
              c.competencia,
              c.data_abertura,
              c.data_fechamento,
              c.data_pagamento,
              p.forma,
              p.valor_pago,
              p.data_pagamento

            ORDER BY
              c.competencia DESC,
              p.data_pagamento DESC
          `,
          [clienteId],
        );

      const totalPago =
        resultado.rows.reduce(
          (
            acumulador,
            conta,
          ) =>
            acumulador +
            Number(
              conta.valor_pago,
            ),
          0,
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Histórico do cliente carregado com sucesso.",

          dados: {
            cliente:
              clienteResultado
                .rows[0],

            resumo: {
              quantidade_contas_pagas:
                resultado.rowCount,

              total_pago:
                totalPago.toFixed(
                  2,
                ),
            },

            contas:
              resultado.rows,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// CONTAS — VERIFICAR SE CLIENTE PODE ABRIR NOVA CONTA
// ============================================================================

app.get(
  "/api/clientes/:clienteId/pode-abrir-conta",
  autenticar,
  async (request, response, next) => {
    try {
      const clienteId = validarId(
        request.params.clienteId,
        "id do cliente",
      );

      await fecharContasVencidas(
        pool,
        request.usuario.id,
      );

      const clienteResultado =
        await pool.query(
          `
            SELECT
              id,
              nome,
              apelido,
              ativo

            FROM clientes

            WHERE id = $1

            LIMIT 1
          `,
          [clienteId],
        );

      if (
        clienteResultado.rowCount ===
        0
      ) {
        throw criarErro(
          "Cliente não encontrado.",
          404,
          "CLIENTE_NAO_ENCONTRADO",
        );
      }

      const cliente =
        clienteResultado.rows[0];

      if (!cliente.ativo) {
        return respostaSucesso(
          response,
          {
            mensagem:
              "Cliente desativado.",

            dados: {
              pode_abrir_conta:
                false,

              motivo:
                "CLIENTE_DESATIVADO",

              cliente,
              conta_pendente:
                null,
            },
          },
        );
      }

      const contaResultado =
        await pool.query(
          `
            SELECT
              c.id,
              c.competencia,
              c.status,
              c.data_abertura,
              c.data_fechamento,

              COALESCE(
                SUM(ic.valor),
                0
              )::NUMERIC(12, 2)
                AS total_conta

            FROM contas c

            LEFT JOIN itens_conta ic
              ON ic.conta_id =
                c.id

            WHERE
              c.cliente_id = $1
              AND c.status IN (
                'ABERTA',
                'FECHADA'
              )

            GROUP BY c.id

            LIMIT 1
          `,
          [clienteId],
        );

      const possuiContaPendente =
        contaResultado.rowCount > 0;

      return respostaSucesso(
        response,
        {
          mensagem:
            possuiContaPendente
              ? "O cliente ainda possui uma conta pendente."
              : "O cliente pode abrir uma nova conta.",

          dados: {
            pode_abrir_conta:
              !possuiContaPendente,

            motivo:
              possuiContaPendente
                ? "CONTA_PENDENTE"
                : null,

            cliente,

            conta_pendente:
              possuiContaPendente
                ? contaResultado
                    .rows[0]
                : null,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);



// ROTA NÃO ENCONTRADA

// ============================================================================
// PARTE 5
// DASHBOARD / PÁGINA INICIAL
// ============================================================================


// ============================================================================
// FUNÇÃO PARA VALIDAR ANO E MÊS DO DASHBOARD
// ============================================================================

function obterCompetenciaDashboard(query) {
  const agora = new Date();

  const anoAtual = agora.getFullYear();
  const mesAtual = agora.getMonth() + 1;

  const ano =
    query.ano !== undefined
      ? Number(query.ano)
      : anoAtual;

  const mes =
    query.mes !== undefined
      ? Number(query.mes)
      : mesAtual;

  if (
    !Number.isInteger(ano) ||
    ano < 2000 ||
    ano > 2100
  ) {
    throw criarErro(
      "O ano informado é inválido.",
      422,
      "ANO_INVALIDO",
    );
  }

  if (
    !Number.isInteger(mes) ||
    mes < 1 ||
    mes > 12
  ) {
    throw criarErro(
      "O mês informado é inválido.",
      422,
      "MES_INVALIDO",
    );
  }

  return {
    ano,
    mes,
  };
}


// ============================================================================
// FUNÇÃO PARA CRIAR A DATA DE COMPETÊNCIA
//
// Exemplo:
// ano = 2026
// mes = 7
// resultado = 2026-07-01
// ============================================================================

function criarCompetencia(ano, mes) {
  const mesFormatado = String(mes).padStart(
    2,
    "0",
  );

  return `${ano}-${mesFormatado}-01`;
}


// ============================================================================
// DASHBOARD — RESUMO COMPLETO
//
// Retorna:
// - clientes cadastrados;
// - total a receber da competência;
// - total recebido da competência;
// - contas abertas;
// - contas fechadas;
// - pagamentos concluídos;
// - últimas cinco contas que receberam compras.
// ============================================================================

app.get(
  "/api/dashboard",
  autenticar,
  async (request, response, next) => {
    try {
      await fecharContasVencidas(
        pool,
        request.usuario.id,
      );

      const { ano, mes } =
        obterCompetenciaDashboard(
          request.query,
        );

      const competencia =
        criarCompetencia(
          ano,
          mes,
        );

      // ----------------------------------------------------------------------
      // TOTAL DE CLIENTES CADASTRADOS
      // ----------------------------------------------------------------------

      const clientesResultado =
        await pool.query(
          `
            SELECT
              COUNT(*)::INTEGER
                AS total_clientes
            FROM clientes
            WHERE ativo = TRUE
          `,
        );

      const totalClientes =
        clientesResultado.rows[0]
          .total_clientes;

      // ----------------------------------------------------------------------
      // RESUMO FINANCEIRO DA COMPETÊNCIA
      //
      // Total a receber:
      // soma das contas ABERTAS ou FECHADAS daquele mês.
      //
      // Total recebido:
      // soma dos pagamentos das contas pertencentes àquele mês,
      // mesmo que o pagamento tenha acontecido depois.
      // ----------------------------------------------------------------------

      const resumoResultado =
        await pool.query(
          `
            WITH totais_contas AS (
              SELECT
                c.id,
                c.status,
                c.competencia,

                COALESCE(
                  SUM(ic.valor),
                  0
                )::NUMERIC(12, 2)
                  AS total_conta

              FROM contas c

              LEFT JOIN itens_conta ic
                ON ic.conta_id = c.id

              WHERE c.competencia = $1::DATE

              GROUP BY
                c.id,
                c.status,
                c.competencia
            )

            SELECT
              COUNT(*) FILTER (
                WHERE tc.status = 'ABERTA'
              )::INTEGER
                AS contas_abertas,

              COUNT(*) FILTER (
                WHERE tc.status = 'FECHADA'
              )::INTEGER
                AS contas_fechadas,

              COUNT(*) FILTER (
                WHERE tc.status = 'PAGA'
              )::INTEGER
                AS pagamentos_concluidos,

              COALESCE(
                SUM(tc.total_conta) FILTER (
                  WHERE tc.status IN (
                    'ABERTA',
                    'FECHADA'
                  )
                ),
                0
              )::NUMERIC(12, 2)
                AS total_a_receber,

              COALESCE(
                SUM(p.valor_pago),
                0
              )::NUMERIC(12, 2)
                AS total_recebido

            FROM totais_contas tc

            LEFT JOIN pagamentos p
              ON p.conta_id = tc.id
          `,
          [competencia],
        );

      const resumo =
        resumoResultado.rows[0];

      // ----------------------------------------------------------------------
      // ÚLTIMAS CINCO CONTAS MOVIMENTADAS POR COMPRA
      //
      // Cada conta aparece apenas uma vez.
      // É considerada a compra mais recente daquela conta.
      // ----------------------------------------------------------------------

      const movimentacoesResultado =
        await pool.query(
          `
            SELECT
              c.id
                AS conta_id,

              c.cliente_id,

              cl.nome
                AS cliente_nome,

              cl.apelido,

              c.competencia,

              c.status,

              c.data_abertura,

              ultima_compra.id
                AS ultima_compra_id,

              ultima_compra.descricao
                AS ultima_descricao,

              ultima_compra.valor
                AS ultimo_valor,

              ultima_compra.observacao
                AS ultima_observacao,

              ultima_compra.data_compra
                AS ultima_movimentacao,

              resumo.total_conta,

              resumo.quantidade_registros

            FROM contas c

            JOIN clientes cl
              ON cl.id = c.cliente_id

            JOIN LATERAL (
              SELECT
                ic.id,
                ic.descricao,
                ic.valor,
                ic.observacao,
                ic.data_compra

              FROM itens_conta ic

              WHERE ic.conta_id = c.id

              ORDER BY
                ic.data_compra DESC,
                ic.id DESC

              LIMIT 1
            ) ultima_compra
              ON TRUE

            JOIN LATERAL (
              SELECT
                COUNT(ic.id)::INTEGER
                  AS quantidade_registros,

                COALESCE(
                  SUM(ic.valor),
                  0
                )::NUMERIC(12, 2)
                  AS total_conta

              FROM itens_conta ic

              WHERE ic.conta_id = c.id
            ) resumo
              ON TRUE

            WHERE c.status IN (
              'ABERTA',
              'FECHADA'
            )

            ORDER BY
              ultima_compra.data_compra DESC,
              ultima_compra.id DESC

            LIMIT 5
          `,
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Dashboard carregado com sucesso.",

          dados: {
            competencia: {
              ano,
              mes,
              data:
                competencia,
            },

            cards: {
              clientes_cadastrados:
                totalClientes,

              total_a_receber:
                resumo.total_a_receber,

              total_recebido:
                resumo.total_recebido,

              pagamentos_concluidos:
                resumo.pagamentos_concluidos,

              contas_abertas:
                resumo.contas_abertas,

              contas_fechadas:
                resumo.contas_fechadas,
            },

            ultimas_movimentacoes:
              movimentacoesResultado.rows,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// DASHBOARD — SOMENTE OS CARDS
//
// Pode ser usado caso o Front-end deseje atualizar apenas os valores.
// ============================================================================

app.get(
  "/api/dashboard/cards",
  autenticar,
  async (request, response, next) => {
    try {
      await fecharContasVencidas(
        pool,
        request.usuario.id,
      );

      const { ano, mes } =
        obterCompetenciaDashboard(
          request.query,
        );

      const competencia =
        criarCompetencia(
          ano,
          mes,
        );

      const resultado =
        await pool.query(
          `
            WITH totais_contas AS (
              SELECT
                c.id,
                c.status,

                COALESCE(
                  SUM(ic.valor),
                  0
                )::NUMERIC(12, 2)
                  AS total_conta

              FROM contas c

              LEFT JOIN itens_conta ic
                ON ic.conta_id = c.id

              WHERE c.competencia = $1::DATE

              GROUP BY
                c.id,
                c.status
            )

            SELECT
              (
                SELECT
                  COUNT(*)::INTEGER
                FROM clientes
                WHERE ativo = TRUE
              ) AS clientes_cadastrados,

              COUNT(*) FILTER (
                WHERE tc.status = 'ABERTA'
              )::INTEGER
                AS contas_abertas,

              COUNT(*) FILTER (
                WHERE tc.status = 'FECHADA'
              )::INTEGER
                AS contas_fechadas,

              COUNT(*) FILTER (
                WHERE tc.status = 'PAGA'
              )::INTEGER
                AS pagamentos_concluidos,

              COALESCE(
                SUM(tc.total_conta) FILTER (
                  WHERE tc.status IN (
                    'ABERTA',
                    'FECHADA'
                  )
                ),
                0
              )::NUMERIC(12, 2)
                AS total_a_receber,

              COALESCE(
                SUM(p.valor_pago),
                0
              )::NUMERIC(12, 2)
                AS total_recebido

            FROM totais_contas tc

            LEFT JOIN pagamentos p
              ON p.conta_id = tc.id
          `,
          [competencia],
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Cards do dashboard carregados com sucesso.",

          dados: {
            competencia: {
              ano,
              mes,
              data:
                competencia,
            },

            cards:
              resultado.rows[0],
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// DASHBOARD — ÚLTIMAS CINCO MOVIMENTAÇÕES
//
// Mostra apenas contas que receberam compras.
// Não mostra pagamentos.
// ============================================================================

app.get(
  "/api/dashboard/ultimas-movimentacoes",
  autenticar,
  async (request, response, next) => {
    try {
      await fecharContasVencidas(
        pool,
        request.usuario.id,
      );

      const resultado =
        await pool.query(
          `
            SELECT
              c.id
                AS conta_id,

              c.cliente_id,

              cl.nome
                AS cliente_nome,

              cl.apelido,

              c.competencia,

              c.status,

              ultima_compra.id
                AS compra_id,

              ultima_compra.descricao,

              ultima_compra.valor,

              ultima_compra.observacao,

              ultima_compra.data_compra,

              resumo.quantidade_registros,

              resumo.total_conta

            FROM contas c

            JOIN clientes cl
              ON cl.id = c.cliente_id

            JOIN LATERAL (
              SELECT
                ic.id,
                ic.descricao,
                ic.valor,
                ic.observacao,
                ic.data_compra

              FROM itens_conta ic

              WHERE ic.conta_id = c.id

              ORDER BY
                ic.data_compra DESC,
                ic.id DESC

              LIMIT 1
            ) ultima_compra
              ON TRUE

            JOIN LATERAL (
              SELECT
                COUNT(*)::INTEGER
                  AS quantidade_registros,

                COALESCE(
                  SUM(valor),
                  0
                )::NUMERIC(12, 2)
                  AS total_conta

              FROM itens_conta

              WHERE conta_id = c.id
            ) resumo
              ON TRUE

            WHERE c.status IN (
              'ABERTA',
              'FECHADA'
            )

            ORDER BY
              ultima_compra.data_compra DESC,
              ultima_compra.id DESC

            LIMIT 5
          `,
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Últimas movimentações carregadas com sucesso.",

          dados:
            resultado.rows,
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// DASHBOARD — MESES DISPONÍVEIS
//
// Retorna os meses que possuem contas registradas.
// Pode ser usado no seletor da página inicial.
// ============================================================================

app.get(
  "/api/dashboard/competencias",
  autenticar,
  async (request, response, next) => {
    try {
      const resultado =
        await pool.query(
          `
            SELECT DISTINCT
              competencia,

              EXTRACT(
                YEAR FROM competencia
              )::INTEGER
                AS ano,

              EXTRACT(
                MONTH FROM competencia
              )::INTEGER
                AS mes

            FROM contas

            ORDER BY
              competencia DESC
          `,
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Competências carregadas com sucesso.",

          dados:
            resultado.rows,
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);



// ROTA NÃO ENCONTRADA


// ============================================================================
// PARTE 6
// RELATÓRIOS
// ============================================================================


// ============================================================================
// CONFIGURAÇÃO DOS FILTROS DE RELATÓRIO
// ============================================================================

const PERIODOS_RELATORIO = [
  "hoje",
  "ultimos_7_dias",
  "mes_atual",
  "personalizado",
];


// ============================================================================
// VALIDAR FILTRO DO RELATÓRIO
// ============================================================================

function obterFiltroRelatorio(query) {
  const periodo =
    query.periodo || "mes_atual";

  if (!PERIODOS_RELATORIO.includes(periodo)) {
    throw criarErro(
      "O período informado é inválido.",
      422,
      "PERIODO_INVALIDO",
      {
        opcoes: PERIODOS_RELATORIO,
      },
    );
  }

  const agora = new Date();

  const anoAtual =
    agora.getFullYear();

  const mesAtual =
    agora.getMonth() + 1;

  let ano = anoAtual;
  let mes = mesAtual;

  if (periodo === "personalizado") {
    ano = Number(query.ano);
    mes = Number(query.mes);

    if (
      !Number.isInteger(ano) ||
      ano < 2000 ||
      ano > 2100
    ) {
      throw criarErro(
        "Informe um ano válido.",
        422,
        "ANO_INVALIDO",
      );
    }

    if (
      !Number.isInteger(mes) ||
      mes < 1 ||
      mes > 12
    ) {
      throw criarErro(
        "Informe um mês válido.",
        422,
        "MES_INVALIDO",
      );
    }

    const competenciaSelecionada =
      new Date(
        ano,
        mes - 1,
        1,
      );

    const competenciaAtual =
      new Date(
        anoAtual,
        mesAtual - 1,
        1,
      );

    if (
      competenciaSelecionada >
      competenciaAtual
    ) {
      throw criarErro(
        "Não é possível consultar um mês futuro.",
        422,
        "COMPETENCIA_FUTURA",
      );
    }
  }

  const competencia =
    criarCompetencia(
      ano,
      mes,
    );

  const descricoes = {
    hoje: "Hoje",
    ultimos_7_dias:
      "Últimos 7 dias",
    mes_atual:
      "Mês atual",
    personalizado:
      `${String(mes).padStart(
        2,
        "0",
      )}/${ano}`,
  };

  return {
    periodo,
    ano,
    mes,
    competencia,
    descricao:
      descricoes[periodo],
  };
}


// ============================================================================
// MONTAR CONDIÇÃO SQL DO PERÍODO
//
// Para hoje e últimos sete dias:
// utiliza a data real da compra ou do pagamento.
//
// Para mês atual e personalizado:
// utiliza a competência original da conta.
//
// Assim, uma conta de julho paga em agosto continua aparecendo
// no relatório mensal de julho.
// ============================================================================

function montarCondicaoPeriodo({
  filtro,
  campoData,
  campoCompetencia,
  parametros,
}) {
  if (filtro.periodo === "hoje") {
    return `
      (
        ${campoData}
        AT TIME ZONE 'America/Manaus'
      )::DATE =
      (
        NOW()
        AT TIME ZONE 'America/Manaus'
      )::DATE
    `;
  }

  if (
    filtro.periodo ===
    "ultimos_7_dias"
  ) {
    return `
      (
        ${campoData}
        AT TIME ZONE 'America/Manaus'
      )::DATE
      BETWEEN
      (
        NOW()
        AT TIME ZONE 'America/Manaus'
      )::DATE - INTERVAL '6 days'
      AND
      (
        NOW()
        AT TIME ZONE 'America/Manaus'
      )::DATE
    `;
  }

  parametros.push(
    filtro.competencia,
  );

  return `
    ${campoCompetencia}
      = $${parametros.length}::DATE
  `;
}


// ============================================================================
// BUSCAR RESUMO FINANCEIRO DO RELATÓRIO
// ============================================================================

async function buscarResumoRelatorio(
  filtro,
) {
  const parametrosRecebidos = [];

  const condicaoRecebidos =
    montarCondicaoPeriodo({
      filtro,
      campoData:
        "p.data_pagamento",
      campoCompetencia:
        "c.competencia",
      parametros:
        parametrosRecebidos,
    });

  const recebidosResultado =
    await pool.query(
      `
        SELECT
          COUNT(
            DISTINCT p.id
          )::INTEGER
            AS pagamentos_concluidos,

          COALESCE(
            SUM(p.valor_pago),
            0
          )::NUMERIC(12, 2)
            AS total_recebido

        FROM pagamentos p

        JOIN contas c
          ON c.id =
            p.conta_id

        WHERE
          ${condicaoRecebidos}
      `,
      parametrosRecebidos,
    );

  const parametrosPendentes = [];

  const condicaoPendentes =
    montarCondicaoPeriodo({
      filtro,
      campoData:
        "ic.data_compra",
      campoCompetencia:
        "c.competencia",
      parametros:
        parametrosPendentes,
    });

  const pendentesResultado =
    await pool.query(
      `
        SELECT
          COUNT(
            DISTINCT c.id
          ) FILTER (
            WHERE c.status =
              'ABERTA'
          )::INTEGER
            AS contas_abertas,

          COUNT(
            DISTINCT c.id
          ) FILTER (
            WHERE c.status =
              'FECHADA'
          )::INTEGER
            AS contas_fechadas,

          COUNT(
            DISTINCT c.cliente_id
          )::INTEGER
            AS clientes_no_periodo,

          COALESCE(
            SUM(ic.valor) FILTER (
              WHERE c.status IN (
                'ABERTA',
                'FECHADA'
              )
            ),
            0
          )::NUMERIC(12, 2)
            AS total_a_receber

        FROM contas c

        JOIN itens_conta ic
          ON ic.conta_id =
            c.id

        WHERE
          ${condicaoPendentes}
      `,
      parametrosPendentes,
    );

  return {
    total_recebido:
      recebidosResultado
        .rows[0]
        .total_recebido,

    faturamento:
      recebidosResultado
        .rows[0]
        .total_recebido,

    total_a_receber:
      pendentesResultado
        .rows[0]
        .total_a_receber,

    pagamentos_concluidos:
      recebidosResultado
        .rows[0]
        .pagamentos_concluidos,

    contas_abertas:
      pendentesResultado
        .rows[0]
        .contas_abertas,

    contas_fechadas:
      pendentesResultado
        .rows[0]
        .contas_fechadas,

    clientes_no_periodo:
      pendentesResultado
        .rows[0]
        .clientes_no_periodo,
  };
}


// ============================================================================
// BUSCAR FORMAS DE PAGAMENTO
// ============================================================================

async function buscarFormasPagamentoRelatorio(
  filtro,
) {
  const parametros = [];

  const condicaoPeriodo =
    montarCondicaoPeriodo({
      filtro,
      campoData:
        "p.data_pagamento",
      campoCompetencia:
        "c.competencia",
      parametros,
    });

  const resultado =
    await pool.query(
      `
        WITH pagamentos_periodo AS (
          SELECT
            p.id,
            p.forma,
            p.valor_pago

          FROM pagamentos p

          JOIN contas c
            ON c.id =
              p.conta_id

          WHERE
            ${condicaoPeriodo}
        ),

        total_periodo AS (
          SELECT
            COALESCE(
              SUM(valor_pago),
              0
            ) AS total
          FROM pagamentos_periodo
        )

        SELECT
          pp.forma,

          COUNT(pp.id)::INTEGER
            AS quantidade_pagamentos,

          COALESCE(
            SUM(pp.valor_pago),
            0
          )::NUMERIC(12, 2)
            AS valor_total,

          CASE
            WHEN tp.total > 0
            THEN ROUND(
              (
                SUM(pp.valor_pago)
                / tp.total
              ) * 100,
              2
            )
            ELSE 0
          END
            AS percentual

        FROM pagamentos_periodo pp

        CROSS JOIN total_periodo tp

        GROUP BY
          pp.forma,
          tp.total

        ORDER BY
          valor_total DESC
      `,
      parametros,
    );

  const formasMapeadas = {
    DINHEIRO: {
      forma: "DINHEIRO",
      quantidade_pagamentos: 0,
      valor_total: "0.00",
      percentual: "0.00",
    },

    PIX: {
      forma: "PIX",
      quantidade_pagamentos: 0,
      valor_total: "0.00",
      percentual: "0.00",
    },

    CARTAO: {
      forma: "CARTAO",
      quantidade_pagamentos: 0,
      valor_total: "0.00",
      percentual: "0.00",
    },
  };

  for (
    const forma of resultado.rows
  ) {
    formasMapeadas[
      forma.forma
    ] = forma;
  }

  return [
    formasMapeadas.DINHEIRO,
    formasMapeadas.PIX,
    formasMapeadas.CARTAO,
  ];
}


// ============================================================================
// BUSCAR CLIENTES QUE MAIS COMPRARAM
// ============================================================================

async function buscarClientesMaisCompraram(
  filtro,
  limite = 5,
) {
  const parametros = [];

  const condicaoPeriodo =
    montarCondicaoPeriodo({
      filtro,
      campoData:
        "ic.data_compra",
      campoCompetencia:
        "c.competencia",
      parametros,
    });

  parametros.push(limite);

  const resultado =
    await pool.query(
      `
        SELECT
          cl.id
            AS cliente_id,

          cl.nome
            AS cliente_nome,

          cl.apelido,

          COUNT(
            ic.id
          )::INTEGER
            AS quantidade_compras,

          COUNT(
            DISTINCT c.id
          )::INTEGER
            AS quantidade_contas,

          COUNT(
            DISTINCT c.id
          ) FILTER (
            WHERE c.status =
              'PAGA'
          )::INTEGER
            AS contas_pagas,

          COALESCE(
            SUM(ic.valor),
            0
          )::NUMERIC(12, 2)
            AS total_comprado

        FROM itens_conta ic

        JOIN contas c
          ON c.id =
            ic.conta_id

        JOIN clientes cl
          ON cl.id =
            c.cliente_id

        WHERE
          ${condicaoPeriodo}

        GROUP BY
          cl.id,
          cl.nome,
          cl.apelido

        ORDER BY
          total_comprado DESC,
          quantidade_compras DESC,
          cl.nome ASC

        LIMIT $${parametros.length}
      `,
      parametros,
    );

  return resultado.rows.map(
    (cliente, indice) => ({
      posicao: indice + 1,
      ...cliente,
    }),
  );
}


// ============================================================================
// RELATÓRIOS — RELATÓRIO COMPLETO
//
// Esta é a principal rota da página de relatórios.
// ============================================================================

app.get(
  "/api/relatorios",
  autenticar,
  async (
    request,
    response,
    next,
  ) => {
    try {
      await fecharContasVencidas(
        pool,
        request.usuario.id,
      );

      const filtro =
        obterFiltroRelatorio(
          request.query,
        );

      const [
        resumo,
        formasPagamento,
        clientesMaisCompraram,
      ] = await Promise.all([
        buscarResumoRelatorio(
          filtro,
        ),

        buscarFormasPagamentoRelatorio(
          filtro,
        ),

        buscarClientesMaisCompraram(
          filtro,
          5,
        ),
      ]);

      return respostaSucesso(
        response,
        {
          mensagem:
            "Relatório carregado com sucesso.",

          dados: {
            filtro: {
              periodo:
                filtro.periodo,

              descricao:
                filtro.descricao,

              ano:
                filtro.ano,

              mes:
                filtro.mes,

              competencia:
                filtro.competencia,
            },

            resumo,

            formas_pagamento:
              formasPagamento,

            clientes_mais_compraram:
              clientesMaisCompraram,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// RELATÓRIOS — SOMENTE RESUMO FINANCEIRO
// ============================================================================

app.get(
  "/api/relatorios/resumo",
  autenticar,
  async (
    request,
    response,
    next,
  ) => {
    try {
      await fecharContasVencidas(
        pool,
        request.usuario.id,
      );

      const filtro =
        obterFiltroRelatorio(
          request.query,
        );

      const resumo =
        await buscarResumoRelatorio(
          filtro,
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Resumo financeiro carregado com sucesso.",

          dados: {
            filtro,
            resumo,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// RELATÓRIOS — FORMAS DE PAGAMENTO
// ============================================================================

app.get(
  "/api/relatorios/formas-pagamento",
  autenticar,
  async (
    request,
    response,
    next,
  ) => {
    try {
      const filtro =
        obterFiltroRelatorio(
          request.query,
        );

      const formas =
        await buscarFormasPagamentoRelatorio(
          filtro,
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Formas de pagamento carregadas com sucesso.",

          dados: {
            filtro,
            formas_pagamento:
              formas,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// RELATÓRIOS — CLIENTES QUE MAIS COMPRARAM
// ============================================================================

app.get(
  "/api/relatorios/clientes-mais-compraram",
  autenticar,
  async (
    request,
    response,
    next,
  ) => {
    try {
      const filtro =
        obterFiltroRelatorio(
          request.query,
        );

      const limiteSolicitado =
        Number.parseInt(
          request.query.limite,
          10,
        ) || 5;

      const limite = Math.min(
        Math.max(
          limiteSolicitado,
          1,
        ),
        50,
      );

      const clientes =
        await buscarClientesMaisCompraram(
          filtro,
          limite,
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Ranking de clientes carregado com sucesso.",

          dados: {
            filtro,

            quantidade:
              clientes.length,

            clientes,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// RELATÓRIOS — COMPETÊNCIAS DISPONÍVEIS
//
// Retorna anos e meses existentes no banco.
// Pode alimentar o seletor de relatório personalizado.
// ============================================================================

app.get(
  "/api/relatorios/competencias",
  autenticar,
  async (
    request,
    response,
    next,
  ) => {
    try {
      const resultado =
        await pool.query(
          `
            SELECT DISTINCT
              EXTRACT(
                YEAR FROM competencia
              )::INTEGER
                AS ano,

              EXTRACT(
                MONTH FROM competencia
              )::INTEGER
                AS mes,

              competencia

            FROM contas

            WHERE competencia <=
              DATE_TRUNC(
                'month',
                CURRENT_DATE
              )::DATE

            ORDER BY
              competencia DESC
          `,
        );

      const anos = {};

      for (
        const competencia of
        resultado.rows
      ) {
        if (
          !anos[
            competencia.ano
          ]
        ) {
          anos[
            competencia.ano
          ] = [];
        }

        anos[
          competencia.ano
        ].push({
          mes:
            competencia.mes,

          competencia:
            competencia.competencia,
        });
      }

      const competencias =
        Object.entries(anos).map(
          ([ano, meses]) => ({
            ano: Number(ano),
            meses,
          }),
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Competências dos relatórios carregadas com sucesso.",

          dados: {
            ano_atual:
              new Date().getFullYear(),

            mes_atual:
              new Date().getMonth() +
              1,

            competencias,
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);



// ROTA NÃO ENCONTRADA


// ============================================================================
// PARTE 7
// GERAÇÃO DE COMPROVANTE EM PDF
// ============================================================================


// ============================================================================
// FUNÇÕES AUXILIARES DO PDF
// ============================================================================

function formatarDataBrasil(data) {
  if (!data) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      timeZone: "America/Manaus",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  ).format(new Date(data));
}


function formatarHoraBrasil(data) {
  if (!data) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      timeZone: "America/Manaus",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  ).format(new Date(data));
}


function formatarDataHoraBrasil(data) {
  if (!data) {
    return "-";
  }

  return `${formatarDataBrasil(data)} às ${formatarHoraBrasil(data)}`;
}


function formatarCompetenciaBrasil(competencia) {
  if (!competencia) {
    return "-";
  }

  const data = new Date(
    `${String(competencia).slice(0, 10)}T12:00:00`,
  );

  const texto = new Intl.DateTimeFormat(
    "pt-BR",
    {
      timeZone: "America/Manaus",
      month: "long",
      year: "numeric",
    },
  ).format(data);

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}


function limparNomeArquivo(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase();
}


function desenharLinhaPdf(
  documento,
  y,
  margemEsquerda = 50,
  margemDireita = 545,
) {
  documento
    .moveTo(margemEsquerda, y)
    .lineTo(margemDireita, y)
    .strokeColor("#E5E7EB")
    .lineWidth(1)
    .stroke();
}


function verificarNovaPaginaPdf(
  documento,
  alturaNecessaria = 70,
) {
  const limiteInferior =
    documento.page.height -
    documento.page.margins.bottom;

  if (
    documento.y + alturaNecessaria >
    limiteInferior
  ) {
    documento.addPage();

    return true;
  }

  return false;
}


// ============================================================================
// BUSCAR DADOS COMPLETOS PARA O PDF
// ============================================================================

async function buscarDadosComprovantePdf(contaId) {
  const contaResultado = await pool.query(
    `
      SELECT
        c.id,
        c.cliente_id,
        c.competencia,
        c.status,
        c.data_abertura,
        c.data_fechamento,
        c.data_pagamento,
        c.observacao AS observacao_conta,

        cl.nome AS cliente_nome,
        cl.apelido,
        cl.telefone,

        p.id AS pagamento_id,
        p.valor_pago,
        p.forma,
        p.observacao AS observacao_pagamento,
        p.data_pagamento,

        recebedor.nome AS recebido_por_nome

      FROM contas c

      JOIN clientes cl
        ON cl.id = c.cliente_id

      LEFT JOIN pagamentos p
        ON p.conta_id = c.id

      LEFT JOIN usuarios recebedor
        ON recebedor.id = p.recebido_por

      WHERE c.id = $1

      LIMIT 1
    `,
    [contaId],
  );

  if (contaResultado.rowCount === 0) {
    throw criarErro(
      "Conta não encontrada.",
      404,
      "CONTA_NAO_ENCONTRADA",
    );
  }

  const conta =
    contaResultado.rows[0];

  if (conta.status !== "PAGA") {
    throw criarErro(
      "O PDF somente pode ser gerado para uma conta paga.",
      409,
      "CONTA_NAO_PAGA",
    );
  }

  if (!conta.pagamento_id) {
    throw criarErro(
      "O pagamento desta conta não foi encontrado.",
      404,
      "PAGAMENTO_NAO_ENCONTRADO",
    );
  }

  const comprasResultado = await pool.query(
    `
      SELECT
        ic.id,
        ic.descricao,
        ic.valor,
        ic.observacao,
        ic.data_compra,

        u.nome AS registrado_por_nome

      FROM itens_conta ic

      LEFT JOIN usuarios u
        ON u.id = ic.registrado_por

      WHERE ic.conta_id = $1

      ORDER BY
        ic.data_compra ASC,
        ic.id ASC
    `,
    [contaId],
  );

  const configuracaoResultado = await pool.query(
    `
      SELECT
        nome_loja,
        nome_fantasia,
        cnpj,
        telefone,
        endereco,
        logo_url,
        rodape_pdf

      FROM configuracoes_loja

      ORDER BY id ASC

      LIMIT 1
    `,
  );

  const configuracao =
    configuracaoResultado.rowCount > 0
      ? configuracaoResultado.rows[0]
      : {
          nome_loja: "Caderneta Digital",
          nome_fantasia: null,
          cnpj: null,
          telefone: null,
          endereco: null,
          logo_url: null,
          rodape_pdf: null,
        };

  const totalCalculado =
    comprasResultado.rows.reduce(
      (total, compra) =>
        total + Number(compra.valor),
      0,
    );

  return {
    conta,
    compras: comprasResultado.rows,
    configuracao,
    totalCalculado,
  };
}


// ============================================================================
// GERAR DOCUMENTO PDF
// ============================================================================

function gerarComprovantePdf({
  response,
  conta,
  compras,
  configuracao,
  totalCalculado,
  baixar = true,
}) {
  const documento = new PDFDocument({
    size: "A4",

    margins: {
      top: 45,
      bottom: 50,
      left: 50,
      right: 50,
    },

    info: {
      Title:
        `Comprovante da conta ${conta.id}`,

      Author:
        configuracao.nome_fantasia ||
        configuracao.nome_loja ||
        "Caderneta Digital",

      Subject:
        "Comprovante de pagamento",

      Creator:
        "Caderneta Digital",
    },
  });

  const nomeClienteArquivo =
    limparNomeArquivo(
      conta.cliente_nome,
    );

  const nomeArquivo =
    `comprovante_conta_${conta.id}_${nomeClienteArquivo}.pdf`;

  response.setHeader(
    "Content-Type",
    "application/pdf",
  );

  response.setHeader(
    "Content-Disposition",
    `${baixar ? "attachment" : "inline"}; filename="${nomeArquivo}"`,
  );

  documento.pipe(response);

  // --------------------------------------------------------------------------
  // CABEÇALHO
  // --------------------------------------------------------------------------

  documento
    .font("Helvetica-Bold")
    .fontSize(21)
    .fillColor("#111827")
    .text(
      configuracao.nome_fantasia ||
        configuracao.nome_loja ||
        "Caderneta Digital",
      {
        align: "center",
      },
    );

  if (
    configuracao.nome_fantasia &&
    configuracao.nome_loja &&
    configuracao.nome_fantasia !==
      configuracao.nome_loja
  ) {
    documento
      .moveDown(0.2)
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#6B7280")
      .text(
        configuracao.nome_loja,
        {
          align: "center",
        },
      );
  }

  const dadosLoja = [
    configuracao.cnpj
      ? `CNPJ: ${configuracao.cnpj}`
      : null,

    configuracao.telefone
      ? `Telefone: ${configuracao.telefone}`
      : null,

    configuracao.endereco
      ? configuracao.endereco
      : null,
  ].filter(Boolean);

  if (dadosLoja.length > 0) {
    documento
      .moveDown(0.4)
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#6B7280")
      .text(
        dadosLoja.join(" • "),
        {
          align: "center",
        },
      );
  }

  documento.moveDown(1);

  desenharLinhaPdf(
    documento,
    documento.y,
  );

  documento.moveDown(1);

  documento
    .font("Helvetica-Bold")
    .fontSize(17)
    .fillColor("#111827")
    .text(
      "Comprovante de Conta",
      {
        align: "center",
      },
    );

  documento
    .moveDown(0.35)
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#6B7280")
    .text(
      `Conta nº ${conta.id}`,
      {
        align: "center",
      },
    );

  documento.moveDown(1.4);

  // --------------------------------------------------------------------------
  // STATUS
  // --------------------------------------------------------------------------

  const statusY = documento.y;

  documento
    .roundedRect(
      50,
      statusY,
      495,
      42,
      10,
    )
    .fillColor("#ECFDF3")
    .fill();

  documento
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#15803D")
    .text(
      "PAGAMENTO CONCLUÍDO",
      65,
      statusY + 14,
      {
        width: 465,
        align: "center",
      },
    );

  documento.y =
    statusY + 60;

  // --------------------------------------------------------------------------
  // DADOS DO CLIENTE E DA CONTA
  // --------------------------------------------------------------------------

  documento
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111827")
    .text("Dados da conta");

  documento.moveDown(0.7);

  const colunaEsquerda = 50;
  const colunaDireita = 310;
  const larguraColuna = 235;

  const inicioInformacoes =
    documento.y;

  documento
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6B7280")
    .text(
      "Cliente",
      colunaEsquerda,
      inicioInformacoes,
    );

  documento
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#111827")
    .text(
      conta.cliente_nome,
      colunaEsquerda,
      inicioInformacoes + 13,
      {
        width: larguraColuna,
      },
    );

  documento
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6B7280")
    .text(
      "Competência",
      colunaDireita,
      inicioInformacoes,
    );

  documento
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#111827")
    .text(
      formatarCompetenciaBrasil(
        conta.competencia,
      ),
      colunaDireita,
      inicioInformacoes + 13,
      {
        width: larguraColuna,
      },
    );

  documento.y =
    inicioInformacoes + 52;

  const segundaLinha =
    documento.y;

  documento
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6B7280")
    .text(
      "Conta aberta em",
      colunaEsquerda,
      segundaLinha,
    );

  documento
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111827")
    .text(
      formatarDataHoraBrasil(
        conta.data_abertura,
      ),
      colunaEsquerda,
      segundaLinha + 13,
      {
        width: larguraColuna,
      },
    );

  documento
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6B7280")
    .text(
      "Pagamento realizado em",
      colunaDireita,
      segundaLinha,
    );

  documento
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111827")
    .text(
      formatarDataHoraBrasil(
        conta.data_pagamento,
      ),
      colunaDireita,
      segundaLinha + 13,
      {
        width: larguraColuna,
      },
    );

  documento.y =
    segundaLinha + 52;

  const terceiraLinha =
    documento.y;

  documento
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6B7280")
    .text(
      "Forma de pagamento",
      colunaEsquerda,
      terceiraLinha,
    );

  documento
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111827")
    .text(
      conta.forma,
      colunaEsquerda,
      terceiraLinha + 13,
      {
        width: larguraColuna,
      },
    );

  documento
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6B7280")
    .text(
      "Pagamento recebido por",
      colunaDireita,
      terceiraLinha,
    );

  documento
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#111827")
    .text(
      conta.recebido_por_nome ||
        "Não informado",
      colunaDireita,
      terceiraLinha + 13,
      {
        width: larguraColuna,
      },
    );

  documento.y =
    terceiraLinha + 55;

  desenharLinhaPdf(
    documento,
    documento.y,
  );

  documento.moveDown(1);

  // --------------------------------------------------------------------------
  // LISTA DE COMPRAS
  // --------------------------------------------------------------------------

  documento
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#111827")
    .text("Compras registradas");

  documento.moveDown(0.8);

  function desenharCabecalhoTabela() {
    const y = documento.y;

    documento
      .roundedRect(
        50,
        y,
        495,
        28,
        6,
      )
      .fillColor("#F3F4F6")
      .fill();

    documento
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor("#374151")
      .text(
        "Data",
        60,
        y + 9,
        {
          width: 72,
        },
      )
      .text(
        "Hora",
        135,
        y + 9,
        {
          width: 50,
        },
      )
      .text(
        "Descrição",
        190,
        y + 9,
        {
          width: 255,
        },
      )
      .text(
        "Valor",
        455,
        y + 9,
        {
          width: 78,
          align: "right",
        },
      );

    documento.y =
      y + 35;
  }

  desenharCabecalhoTabela();

  for (const compra of compras) {
    const descricao =
      compra.descricao || "-";

    const alturaDescricao =
      documento.heightOfString(
        descricao,
        {
          width: 250,
          font: "Helvetica",
          size: 9,
        },
      );

    const alturaLinha =
      Math.max(
        34,
        alturaDescricao + 18,
      );

    const criouNovaPagina =
      verificarNovaPaginaPdf(
        documento,
        alturaLinha + 35,
      );

    if (criouNovaPagina) {
      documento
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#111827")
        .text(
          `Conta nº ${conta.id} — continuação`,
        );

      documento.moveDown(0.7);

      desenharCabecalhoTabela();
    }

    const y = documento.y;

    documento
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#374151")
      .text(
        formatarDataBrasil(
          compra.data_compra,
        ),
        60,
        y + 7,
        {
          width: 72,
        },
      )
      .text(
        formatarHoraBrasil(
          compra.data_compra,
        ),
        135,
        y + 7,
        {
          width: 50,
        },
      )
      .text(
        descricao,
        190,
        y + 7,
        {
          width: 250,
        },
      )
      .font("Helvetica-Bold")
      .text(
        formatarMoeda(
          compra.valor,
        ),
        455,
        y + 7,
        {
          width: 78,
          align: "right",
        },
      );

    documento.y =
      y + alturaLinha;

    desenharLinhaPdf(
      documento,
      documento.y,
      50,
      545,
    );

    documento.moveDown(0.25);
  }

  if (compras.length === 0) {
    documento
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#6B7280")
      .text(
        "Nenhuma compra registrada.",
        {
          align: "center",
        },
      );

    documento.moveDown(1);
  }

  // --------------------------------------------------------------------------
  // TOTAL
  // --------------------------------------------------------------------------

  verificarNovaPaginaPdf(
    documento,
    120,
  );

  documento.moveDown(0.8);

  const totalY = documento.y;

  documento
    .roundedRect(
      330,
      totalY,
      215,
      62,
      10,
    )
    .fillColor("#F9FAFB")
    .fill();

  documento
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#6B7280")
    .text(
      "TOTAL PAGO",
      350,
      totalY + 12,
      {
        width: 175,
        align: "right",
      },
    );

  documento
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor("#111827")
    .text(
      formatarMoeda(
        totalCalculado,
      ),
      350,
      totalY + 30,
      {
        width: 175,
        align: "right",
      },
    );

  documento.y =
    totalY + 82;

  // --------------------------------------------------------------------------
  // OBSERVAÇÃO DO PAGAMENTO
  // --------------------------------------------------------------------------

  if (conta.observacao_pagamento) {
    verificarNovaPaginaPdf(
      documento,
      80,
    );

    documento
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#111827")
      .text(
        "Observação do pagamento",
      );

    documento.moveDown(0.3);

    documento
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#4B5563")
      .text(
        conta.observacao_pagamento,
      );

    documento.moveDown(1);
  }

  // --------------------------------------------------------------------------
  // RODAPÉ
  // --------------------------------------------------------------------------

  verificarNovaPaginaPdf(
    documento,
    80,
  );

  desenharLinhaPdf(
    documento,
    documento.y,
  );

  documento.moveDown(0.8);

  documento
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#6B7280")
    .text(
      configuracao.rodape_pdf ||
        "Este documento foi gerado pelo sistema Caderneta Digital.",
      {
        align: "center",
      },
    );

  documento
    .moveDown(0.35)
    .text(
      `Documento gerado em ${formatarDataHoraBrasil(new Date())}.`,
      {
        align: "center",
      },
    );

  documento.end();

  return nomeArquivo;
}


// ============================================================================
// PDF — BAIXAR COMPROVANTE
// ============================================================================

app.get(
  "/api/historico/:contaId/pdf",
  autenticar,
  async (request, response, next) => {
    try {
      const contaId = validarId(
        request.params.contaId,
        "id da conta",
      );

      const dados =
        await buscarDadosComprovantePdf(
          contaId,
        );

      await registrarHistorico({
        usuarioId:
          request.usuario.id,

        acao: "CRIACAO",

        entidade:
          "comprovante_pdf",

        entidadeId:
          contaId,

        descricao:
          `Comprovante PDF da conta ${contaId} gerado.`,

        dadosNovos: {
          conta_id: contaId,

          cliente_nome:
            dados.conta
              .cliente_nome,

          valor_pago:
            dados.conta
              .valor_pago,
        },

        enderecoIp:
          request.ip,
      });

      gerarComprovantePdf({
        response,

        conta:
          dados.conta,

        compras:
          dados.compras,

        configuracao:
          dados.configuracao,

        totalCalculado:
          dados.totalCalculado,

        baixar: true,
      });
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// PDF — VISUALIZAR NO NAVEGADOR
// ============================================================================

app.get(
  "/api/historico/:contaId/pdf/visualizar",
  autenticar,
  async (request, response, next) => {
    try {
      const contaId = validarId(
        request.params.contaId,
        "id da conta",
      );

      const dados =
        await buscarDadosComprovantePdf(
          contaId,
        );

      gerarComprovantePdf({
        response,

        conta:
          dados.conta,

        compras:
          dados.compras,

        configuracao:
          dados.configuracao,

        totalCalculado:
          dados.totalCalculado,

        baixar: false,
      });
    } catch (erro) {
      return next(erro);
    }
  },
);


// ROTA NÃO ENCONTRADA


// ============================================================================
// PARTE 8
// CONFIGURAÇÕES, AUDITORIA E DIAGNÓSTICO
// ============================================================================


// ============================================================================
// SCHEMA DAS CONFIGURAÇÕES DA LOJA
// ============================================================================

const schemaAtualizarConfiguracoesLoja = z
  .object({
    nome_loja: z
      .string()
      .trim()
      .min(
        2,
        "O nome da loja deve possuir pelo menos 2 caracteres.",
      )
      .max(
        150,
        "O nome da loja deve possuir no máximo 150 caracteres.",
      )
      .optional(),

    nome_fantasia: z
      .string()
      .trim()
      .max(
        150,
        "O nome fantasia deve possuir no máximo 150 caracteres.",
      )
      .nullable()
      .optional()
      .or(z.literal("")),

    cnpj: z
      .string()
      .trim()
      .max(
        18,
        "O CNPJ deve possuir no máximo 18 caracteres.",
      )
      .nullable()
      .optional()
      .or(z.literal("")),

    telefone: z
      .string()
      .trim()
      .max(
        20,
        "O telefone deve possuir no máximo 20 caracteres.",
      )
      .nullable()
      .optional()
      .or(z.literal("")),

    endereco: z
      .string()
      .trim()
      .max(
        1000,
        "O endereço deve possuir no máximo 1000 caracteres.",
      )
      .nullable()
      .optional()
      .or(z.literal("")),

    logo_url: z
      .string()
      .trim()
      .url(
        "Informe uma URL válida para a logo.",
      )
      .nullable()
      .optional()
      .or(z.literal("")),

    rodape_pdf: z
      .string()
      .trim()
      .max(
        1000,
        "O rodapé do PDF deve possuir no máximo 1000 caracteres.",
      )
      .nullable()
      .optional()
      .or(z.literal("")),

    moeda: z
      .string()
      .trim()
      .max(10)
      .optional(),

    fuso_horario: z
      .string()
      .trim()
      .max(60)
      .optional(),

    tema_padrao: z
      .enum([
        "CLARO",
        "ESCURO",
        "SISTEMA",
      ])
      .optional(),
  })
  .refine(
    (dados) =>
      Object.keys(dados).length > 0,
    {
      message:
        "Informe pelo menos uma configuração para atualizar.",
    },
  );


// ============================================================================
// FUNÇÃO PARA CONVERTER TEXTOS VAZIOS EM NULL
// ============================================================================

function textoOpcionalOuNull(valor) {
  if (
    valor === undefined
  ) {
    return undefined;
  }

  if (
    valor === null
  ) {
    return null;
  }

  const texto =
    String(valor).trim();

  return texto === ""
    ? null
    : texto;
}


// ============================================================================
// CONFIGURAÇÕES — CARREGAR
// ============================================================================

app.get(
  "/api/configuracoes",
  autenticar,
  async (
    request,
    response,
    next,
  ) => {
    try {
      const resultado =
        await pool.query(
          `
            SELECT
              id,
              nome_loja,
              nome_fantasia,
              cnpj,
              telefone,
              endereco,
              logo_url,
              rodape_pdf,
              moeda,
              fuso_horario,
              tema_padrao,
              criado_em,
              atualizado_em

            FROM configuracoes_loja

            ORDER BY id ASC

            LIMIT 1
          `,
        );

      if (
        resultado.rowCount === 0
      ) {
        throw criarErro(
          "As configurações da loja ainda não foram cadastradas.",
          404,
          "CONFIGURACOES_NAO_ENCONTRADAS",
        );
      }

      return respostaSucesso(
        response,
        {
          mensagem:
            "Configurações carregadas com sucesso.",

          dados: {
            configuracoes:
              resultado.rows[0],
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// CONFIGURAÇÕES — ATUALIZAR
// Somente administradores.
// ============================================================================

app.patch(
  "/api/configuracoes",
  autenticar,
  somenteAdministrador,
  async (
    request,
    response,
    next,
  ) => {
    const clienteBanco =
      await pool.connect();

    try {
      const dados =
        validarDados(
          schemaAtualizarConfiguracoesLoja,
          request.body,
        );

      await clienteBanco.query(
        "BEGIN",
      );

      const atualResultado =
        await clienteBanco.query(
          `
            SELECT
              id,
              nome_loja,
              nome_fantasia,
              cnpj,
              telefone,
              endereco,
              logo_url,
              rodape_pdf,
              moeda,
              fuso_horario,
              tema_padrao,
              criado_em,
              atualizado_em

            FROM configuracoes_loja

            ORDER BY id ASC

            LIMIT 1

            FOR UPDATE
          `,
        );

      if (
        atualResultado.rowCount ===
        0
      ) {
        throw criarErro(
          "As configurações da loja não foram encontradas.",
          404,
          "CONFIGURACOES_NAO_ENCONTRADAS",
        );
      }

      const anterior =
        atualResultado.rows[0];

      const nomeLoja =
        dados.nome_loja !== undefined
          ? normalizarTexto(
              dados.nome_loja,
            )
          : anterior.nome_loja;

      const nomeFantasia =
        dados.nome_fantasia !== undefined
          ? textoOpcionalOuNull(
              dados.nome_fantasia,
            )
          : anterior.nome_fantasia;

      const cnpj =
        dados.cnpj !== undefined
          ? textoOpcionalOuNull(
              dados.cnpj,
            )
          : anterior.cnpj;

      const telefone =
        dados.telefone !== undefined
          ? textoOpcionalOuNull(
              dados.telefone,
            )
          : anterior.telefone;

      const endereco =
        dados.endereco !== undefined
          ? textoOpcionalOuNull(
              dados.endereco,
            )
          : anterior.endereco;

      const logoUrl =
        dados.logo_url !== undefined
          ? textoOpcionalOuNull(
              dados.logo_url,
            )
          : anterior.logo_url;

      const rodapePdf =
        dados.rodape_pdf !== undefined
          ? textoOpcionalOuNull(
              dados.rodape_pdf,
            )
          : anterior.rodape_pdf;

      const moeda =
        dados.moeda !== undefined
          ? dados.moeda
              .trim()
              .toUpperCase()
          : anterior.moeda;

      const fusoHorario =
        dados.fuso_horario !== undefined
          ? dados.fuso_horario.trim()
          : anterior.fuso_horario;

      const temaPadrao =
        dados.tema_padrao !== undefined
          ? dados.tema_padrao
          : anterior.tema_padrao;

      const resultado =
        await clienteBanco.query(
          `
            UPDATE configuracoes_loja
            SET
              nome_loja = $1,
              nome_fantasia = $2,
              cnpj = $3,
              telefone = $4,
              endereco = $5,
              logo_url = $6,
              rodape_pdf = $7,
              moeda = $8,
              fuso_horario = $9,
              tema_padrao = $10,
              atualizado_em = NOW()

            WHERE id = $11

            RETURNING
              id,
              nome_loja,
              nome_fantasia,
              cnpj,
              telefone,
              endereco,
              logo_url,
              rodape_pdf,
              moeda,
              fuso_horario,
              tema_padrao,
              criado_em,
              atualizado_em
          `,
          [
            nomeLoja,
            nomeFantasia,
            cnpj,
            telefone,
            endereco,
            logoUrl,
            rodapePdf,
            moeda,
            fusoHorario,
            temaPadrao,
            anterior.id,
          ],
        );

      const atualizado =
        resultado.rows[0];

      await registrarHistorico({
        usuarioId:
          request.usuario.id,

        acao: "EDICAO",

        entidade:
          "configuracoes_loja",

        entidadeId:
          atualizado.id,

        descricao:
          "Configurações da loja atualizadas.",

        dadosAnteriores:
          anterior,

        dadosNovos:
          atualizado,

        enderecoIp:
          request.ip,

        clienteBanco,
      });

      await clienteBanco.query(
        "COMMIT",
      );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Configurações atualizadas com sucesso.",

          dados: {
            configuracoes:
              atualizado,
          },
        },
      );
    } catch (erro) {
      await clienteBanco.query(
        "ROLLBACK",
      );

      return next(erro);
    } finally {
      clienteBanco.release();
    }
  },
);


// ============================================================================
// AUDITORIA — LISTAR HISTÓRICO DE AÇÕES
// Somente administradores.
// ============================================================================

app.get(
  "/api/auditoria",
  autenticar,
  somenteAdministrador,
  async (
    request,
    response,
    next,
  ) => {
    try {
      const {
        pagina,
        limite,
        offset,
      } = obterPaginacao(
        request.query,
      );

      const pesquisa =
        normalizarTexto(
          request.query.pesquisa ||
            "",
        );

      const acao =
        request.query.acao;

      const entidade =
        normalizarTexto(
          request.query.entidade ||
            "",
        );

      const usuarioId =
        request.query.usuario_id
          ? validarId(
              request.query.usuario_id,
              "id do usuário",
            )
          : null;

      const dataInicio =
        request.query.data_inicio ||
        null;

      const dataFim =
        request.query.data_fim ||
        null;

      const parametros = [];
      const condicoes = [];

      if (pesquisa) {
        parametros.push(
          `%${pesquisa}%`,
        );

        condicoes.push(`
          (
            ha.descricao ILIKE
              $${parametros.length}
            OR ha.entidade ILIKE
              $${parametros.length}
            OR u.nome ILIKE
              $${parametros.length}
            OR u.usuario ILIKE
              $${parametros.length}
          )
        `);
      }

      if (acao) {
        const acoesPermitidas = [
          "CRIACAO",
          "EDICAO",
          "EXCLUSAO",
          "ABERTURA_CONTA",
          "FECHAMENTO_CONTA",
          "PAGAMENTO",
          "LOGIN",
          "LOGOUT",
        ];

        if (
          !acoesPermitidas.includes(
            acao,
          )
        ) {
          throw criarErro(
            "A ação informada é inválida.",
            422,
            "ACAO_INVALIDA",
            {
              opcoes:
                acoesPermitidas,
            },
          );
        }

        parametros.push(acao);

        condicoes.push(
          `ha.acao = $${parametros.length}`,
        );
      }

      if (entidade) {
        parametros.push(
          entidade,
        );

        condicoes.push(
          `ha.entidade = $${parametros.length}`,
        );
      }

      if (usuarioId) {
        parametros.push(
          usuarioId,
        );

        condicoes.push(
          `ha.usuario_id = $${parametros.length}`,
        );
      }

      if (dataInicio) {
        const data =
          new Date(
            `${dataInicio}T00:00:00-04:00`,
          );

        if (
          Number.isNaN(
            data.getTime(),
          )
        ) {
          throw criarErro(
            "A data inicial é inválida.",
            422,
            "DATA_INICIAL_INVALIDA",
          );
        }

        parametros.push(
          dataInicio,
        );

        condicoes.push(`
          (
            ha.criado_em
            AT TIME ZONE
              'America/Manaus'
          )::DATE >=
            $${parametros.length}::DATE
        `);
      }

      if (dataFim) {
        const data =
          new Date(
            `${dataFim}T23:59:59-04:00`,
          );

        if (
          Number.isNaN(
            data.getTime(),
          )
        ) {
          throw criarErro(
            "A data final é inválida.",
            422,
            "DATA_FINAL_INVALIDA",
          );
        }

        parametros.push(
          dataFim,
        );

        condicoes.push(`
          (
            ha.criado_em
            AT TIME ZONE
              'America/Manaus'
          )::DATE <=
            $${parametros.length}::DATE
        `);
      }

      const where =
        condicoes.length > 0
          ? `WHERE ${condicoes.join(
              " AND ",
            )}`
          : "";

      const totalResultado =
        await pool.query(
          `
            SELECT
              COUNT(*)::INTEGER
                AS total

            FROM historico_acoes ha

            LEFT JOIN usuarios u
              ON u.id =
                ha.usuario_id

            ${where}
          `,
          parametros,
        );

      const parametrosLista = [
        ...parametros,
        limite,
        offset,
      ];

      const resultado =
        await pool.query(
          `
            SELECT
              ha.id,
              ha.usuario_id,

              u.nome
                AS usuario_nome,

              u.usuario
                AS nome_de_usuario,

              ha.acao,
              ha.entidade,
              ha.entidade_id,
              ha.descricao,
              ha.dados_anteriores,
              ha.dados_novos,
              ha.endereco_ip,
              ha.criado_em

            FROM historico_acoes ha

            LEFT JOIN usuarios u
              ON u.id =
                ha.usuario_id

            ${where}

            ORDER BY
              ha.criado_em DESC,
              ha.id DESC

            LIMIT $${parametros.length + 1}

            OFFSET $${parametros.length + 2}
          `,
          parametrosLista,
        );

      const total =
        totalResultado.rows[0]
          .total;

      return respostaSucesso(
        response,
        {
          mensagem:
            "Histórico de auditoria carregado com sucesso.",

          dados:
            resultado.rows,

          meta: {
            pagina,
            limite,

            total_registros:
              total,

            total_paginas:
              calcularTotalPaginas(
                total,
                limite,
              ),
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// AUDITORIA — DETALHES DE UMA AÇÃO
// ============================================================================

app.get(
  "/api/auditoria/:id",
  autenticar,
  somenteAdministrador,
  async (
    request,
    response,
    next,
  ) => {
    try {
      const historicoId =
        validarId(
          request.params.id,
          "id do histórico",
        );

      const resultado =
        await pool.query(
          `
            SELECT
              ha.id,
              ha.usuario_id,

              u.nome
                AS usuario_nome,

              u.usuario
                AS nome_de_usuario,

              u.perfil
                AS usuario_perfil,

              ha.acao,
              ha.entidade,
              ha.entidade_id,
              ha.descricao,
              ha.dados_anteriores,
              ha.dados_novos,
              ha.endereco_ip,
              ha.criado_em

            FROM historico_acoes ha

            LEFT JOIN usuarios u
              ON u.id =
                ha.usuario_id

            WHERE ha.id = $1

            LIMIT 1
          `,
          [historicoId],
        );

      if (
        resultado.rowCount === 0
      ) {
        throw criarErro(
          "Registro de auditoria não encontrado.",
          404,
          "AUDITORIA_NAO_ENCONTRADA",
        );
      }

      return respostaSucesso(
        response,
        {
          mensagem:
            "Registro de auditoria carregado com sucesso.",

          dados: {
            registro:
              resultado.rows[0],
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// INFORMAÇÕES DO SISTEMA
// ============================================================================

app.get(
  "/api/sistema",
  autenticar,
  async (
    request,
    response,
    next,
  ) => {
    try {
      const bancoResultado =
        await pool.query(
          `
            SELECT
              CURRENT_DATABASE()
                AS banco,

              CURRENT_USER
                AS usuario_banco,

              VERSION()
                AS versao_postgresql,

              NOW()
                AS data_hora_banco
          `,
        );

      const tabelasResultado =
        await pool.query(
          `
            SELECT
              COUNT(*)::INTEGER
                AS quantidade_tabelas

            FROM information_schema.tables

            WHERE
              table_schema =
                'public'

              AND table_type =
                'BASE TABLE'
          `,
        );

      return respostaSucesso(
        response,
        {
          mensagem:
            "Informações do sistema carregadas com sucesso.",

          dados: {
            aplicacao: {
              nome:
                "Caderneta Digital",

              versao:
                "1.0.0",

              ambiente:
                NODE_ENV,

              node:
                process.version,

              tempo_atividade_segundos:
                Math.floor(
                  process.uptime(),
                ),

              memoria: {
                rss:
                  process.memoryUsage()
                    .rss,

                heap_usado:
                  process.memoryUsage()
                    .heapUsed,

                heap_total:
                  process.memoryUsage()
                    .heapTotal,
              },
            },

            banco: {
              ...bancoResultado
                .rows[0],

              quantidade_tabelas:
                tabelasResultado
                  .rows[0]
                  .quantidade_tabelas,
            },

            usuario:
              usuarioPublico(
                request.usuario,
              ),
          },
        },
      );
    } catch (erro) {
      return next(erro);
    }
  },
);


// ============================================================================
// VERIFICAÇÃO DE PRONTIDÃO
//
// Pode ser usada por hospedagens e serviços de monitoramento.
// ============================================================================

app.get(
  "/api/pronto",
  async (
    request,
    response,
  ) => {
    try {
      await pool.query(
        "SELECT 1",
      );

      return response
        .status(200)
        .json({
          sucesso: true,
          status: "pronto",
          banco: "conectado",
          data_hora:
            new Date().toISOString(),
        });
    } catch (erro) {
      return response
        .status(503)
        .json({
          sucesso: false,
          status:
            "indisponivel",
          banco:
            "desconectado",
          data_hora:
            new Date().toISOString(),
        });
    }
  },
);


// ============================================================================
// FUNÇÃO PARA LIMPAR TOKENS EXPIRADOS
//
// A tabela existe mesmo que a versão inicial ainda use apenas access token.
// Essa limpeza evita acumular tokens quando refresh token for ativado.
// ============================================================================

async function limparTokensExpirados() {
  try {
    const resultado =
      await pool.query(
        `
          DELETE FROM refresh_tokens

          WHERE
            expira_em < NOW()

            OR (
              revogado_em
                IS NOT NULL

              AND revogado_em <
                NOW() -
                INTERVAL '30 days'
            )
        `,
      );

    if (
      resultado.rowCount > 0
    ) {
      console.log(
        `🧹 ${resultado.rowCount} token(s) expirado(s) removido(s).`,
      );
    }
  } catch (erro) {
    console.error(
      "❌ Erro ao limpar tokens expirados:",
      erro.message,
    );
  }
}


// ============================================================================
// EXECUTAR TAREFAS AUTOMÁTICAS
// ============================================================================

async function executarTarefasAutomaticas() {
  try {
    const contasFechadas =
      await fecharContasVencidas(
        pool,
        null,
      );

    if (
      contasFechadas.length >
      0
    ) {
      console.log(
        `📒 ${contasFechadas.length} conta(s) antiga(s) fechada(s) automaticamente.`,
      );

      for (
        const conta of
        contasFechadas
      ) {
        await registrarHistorico({
          usuarioId: null,

          acao:
            "FECHAMENTO_CONTA",

          entidade:
            "contas",

          entidadeId:
            conta.id,

          descricao:
            "Conta fechada automaticamente pelo sistema devido ao encerramento do mês.",

          dadosNovos:
            conta,
        });
      }
    }

    await limparTokensExpirados();
  } catch (erro) {
    console.error(
      "❌ Erro nas tarefas automáticas:",
      erro.message,
    );
  }
}







// ============================================================================
// PRIMEIRO ADMINISTRADOR
// ============================================================================

app.post("/api/setup/admin", async (req, res) => {
  try {
    const existe = await pool.query(`
      SELECT id
      FROM usuarios
      LIMIT 1
    `);

    if (existe.rows.length > 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Já existe um usuário cadastrado."
      });
    }

    const senhaHash = await bcrypt.hash(
      "Luciano@123",
      10
    );

    const resultado = await pool.query(
      `
      INSERT INTO usuarios
      (
        nome,
        usuario,
        email,
        senha_hash,
        perfil,
        ativo
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        'ADMINISTRADOR',
        TRUE
      )

      RETURNING
      id,
      nome,
      usuario,
      email,
      perfil
      `,
      [
        "Luciano da Silva Nogueira",
        "luciano",
        "luciano@gmail.com",
        senhaHash
      ]
    );

    return res.status(201).json({
      sucesso: true,
      mensagem: "Administrador criado com sucesso.",
      dados: resultado.rows[0]
    });

  } catch (erro) {

    console.error(erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro interno."
    });

  }
});


iniciarServidor();

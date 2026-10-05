// ================== REGRAS DE VALIDAÇÃO ==================
const SENHA_MINIMA = 6;

function validarNome(nome) {
  return nome.trim().length >= 3;
}

function validarEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validarSenha(senha) {
  return senha.length >= SENHA_MINIMA && /\d/.test(senha);
}

function senhasIguais(senha, confirmar) {
  return senha === confirmar;
}

// ================== "BANCO DE DADOS" (localStorage) ==================
function lerUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function salvarUsuario(usuario) {
  const usuarios = lerUsuarios();
  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function buscarUsuario(email) {
  return lerUsuarios().find(function (u) {
    return u.email === email;
  });
}

// ================== FUNÇÕES DE TELA ==================
function mostrarMensagem(id, texto, tipo) {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.className = "mensagem " + tipo;
}

function marcar(campo, valido) {
  campo.classList.remove("erro", "sucesso");
  campo.classList.add(valido ? "sucesso" : "erro");
}

// ================== CADASTRO ==================
document.getElementById("formCadastro").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome");
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");
  const confirmar = document.getElementById("confirmar");

  const emailDigitado = email.value.trim().toLowerCase();
  const erros = [];

  const nomeOk = validarNome(nome.value);
  marcar(nome, nomeOk);
  if (nome.value.trim() === "") erros.push("O nome é obrigatório.");
  else if (!nomeOk) erros.push("O nome deve ter no mínimo 3 caracteres.");

  const emailOk = validarEmail(emailDigitado);
  marcar(email, emailOk);
  if (emailDigitado === "") erros.push("O e-mail é obrigatório.");
  else if (!emailOk) erros.push("E-mail em formato inválido.");

  const senhaOk = validarSenha(senha.value);
  marcar(senha, senhaOk);
  if (!senhaOk) erros.push("A senha precisa de no mínimo " + SENHA_MINIMA + " caracteres e 1 número.");

  const confirmarOk = senha.value !== "" && senhasIguais(senha.value, confirmar.value);
  marcar(confirmar, confirmarOk);
  if (!confirmarOk) erros.push("As senhas não conferem.");

  if (erros.length > 0) {
    mostrarMensagem("msgCadastro", "❌ " + erros[0], "falha");
    return;
  }

  if (buscarUsuario(emailDigitado)) {
    marcar(email, false);
    mostrarMensagem("msgCadastro", "❌ Este e-mail já está cadastrado.", "falha");
    return;
  }

  salvarUsuario({ nome: nome.value.trim(), email: emailDigitado, senha: senha.value });
  mostrarMensagem("msgCadastro", "✅ Cadastro realizado com sucesso!", "ok");
  this.reset();
  [nome, email, senha, confirmar].forEach(function (c) {
    c.classList.remove("erro", "sucesso");
  });
});

// ================== LOGIN ==================
document.getElementById("formLogin").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail");
  const senha = document.getElementById("loginSenha");
  const emailDigitado = email.value.trim().toLowerCase();

  email.classList.remove("erro", "sucesso");
  senha.classList.remove("erro", "sucesso");

  if (emailDigitado === "" || senha.value === "") {
    if (emailDigitado === "") marcar(email, false);
    if (senha.value === "") marcar(senha, false);
    mostrarMensagem("msgLogin", "❌ Preencha e-mail e senha.", "falha");
    return;
  }

  if (!validarEmail(emailDigitado)) {
    marcar(email, false);
    mostrarMensagem("msgLogin", "❌ E-mail em formato inválido.", "falha");
    return;
  }

  const usuario = buscarUsuario(emailDigitado);

  if (!usuario) {
    marcar(email, false);
    mostrarMensagem("msgLogin", "❌ Usuário não encontrado.", "falha");
    return;
  }

  if (usuario.senha !== senha.value) {
    marcar(senha, false);
    mostrarMensagem("msgLogin", "❌ Senha incorreta.", "falha");
    return;
  }

  marcar(email, true);
  marcar(senha, true);
  mostrarMensagem("msgLogin", "✅ Login realizado! Bem-vindo(a), " + usuario.nome + ".", "ok");
});

// ================== TESTES DE UNIDADE (console.assert) ==================
function rodarTestes() {
  const testes = [
    [validarNome("Maria") === true, "Nome válido falhou"],
    [validarNome("Jo") === false, "Nome curto passou"],
    [validarNome("") === false, "Nome vazio passou"],
    [validarEmail("teste@gmail.com") === true, "E-mail válido falhou"],
    [validarEmail("teste@") === false, "E-mail inválido passou"],
    [validarEmail("testegmail.com") === false, "E-mail sem @ passou"],
    [validarSenha("abc123") === true, "Senha válida falhou"],
    [validarSenha("abc") === false, "Senha curta passou"],
    [validarSenha("abcdefgh") === false, "Senha sem número passou"],
    [senhasIguais("abc123", "abc123") === true, "Senhas iguais falhou"],
    [senhasIguais("abc123", "abc124") === false, "Senhas diferentes passou"]
  ];

  let falhas = 0;
  testes.forEach(function (t) {
    console.assert(t[0], t[1]);
    if (!t[0]) falhas++;
  });

  if (falhas === 0) {
    console.log("✅ Todos os " + testes.length + " testes de unidade passaram!");
  } else {
    console.log("❌ " + falhas + " de " + testes.length + " testes falharam.");
  }
}

rodarTestes();

const numeroWhatsApp = "5562982118207";

const presentesPadrao = [
  "Máquina de lavar",
  "Fogão",
  "Geladeira",
  "Sofá",
  "Guarda roupa",
  "Tapetes",
  "Microondas",
  "Kit churrasco",
  "Forno",
  "Edredom (jogo)",
  "Marinex",
  "Xícaras (jogo)",
  "Mesa",
  "Panela (jogo)",
  "Batedeira",
  "Ventilador",
  "Formas de bolo",
  "Copos e taças",
  "Toalha de banho",
  "Toalha de rosto",
  "Espelho"
];

const chaveItens = "itensListaKerenMatheus";
const chaveEscolhidos = "presentesEscolhidosKerenMatheus";
const chaveNomes = "nomesPresentesKerenMatheus";

const listaPresentes = document.getElementById("listaPresentes");
const listaEscolhidos = document.getElementById("listaEscolhidos");
const listaItensPainel = document.getElementById("listaItensPainel");
const btnPainel = document.getElementById("btnPainel");
const painelAdmin = document.getElementById("painelAdmin");
const nomePessoa = document.getElementById("nomePessoa");
const novoItem = document.getElementById("novoItem");
const btnAdicionarItem = document.getElementById("btnAdicionarItem");

function carregarItens() {
  const itens = JSON.parse(localStorage.getItem(chaveItens));
  if (!itens || itens.length === 0) {
    localStorage.setItem(chaveItens, JSON.stringify(presentesPadrao));
    return presentesPadrao;
  }
  return itens;
}

function salvarItens(itens) {
  localStorage.setItem(chaveItens, JSON.stringify(itens));
}

function carregarEscolhidos() {
  return JSON.parse(localStorage.getItem(chaveEscolhidos)) || [];
}

function salvarEscolhidos(lista) {
  localStorage.setItem(chaveEscolhidos, JSON.stringify(lista));
}

function carregarNomes() {
  return JSON.parse(localStorage.getItem(chaveNomes)) || {};
}

function salvarNomes(objeto) {
  localStorage.setItem(chaveNomes, JSON.stringify(objeto));
}

function renderizarPresentes() {
  const itens = carregarItens();
  const escolhidos = carregarEscolhidos();
  const disponiveis = itens.filter(item => !escolhidos.includes(item));

  listaPresentes.innerHTML = "";

  if (disponiveis.length === 0) {
    listaPresentes.innerHTML = `
      <div class="mensagem-vazia">
        Todos os presentes já foram escolhidos. Muito obrigado!
      </div>
    `;
    return;
  }

  disponiveis.forEach(presente => {
    const card = document.createElement("div");
    card.className = "presente-card";

    card.innerHTML = `
      <div class="nome-presente">${presente}</div>
      <button class="btn-escolher" type="button">Escolher</button>
    `;

    card.querySelector("button").addEventListener("click", () => escolherPresente(presente));
    listaPresentes.appendChild(card);
  });
}

function renderizarItensPainel() {
  const itens = carregarItens();

  if (!listaItensPainel) return;

  listaItensPainel.innerHTML = "";

  if (itens.length === 0) {
    listaItensPainel.innerHTML = `
      <div class="mensagem-vazia">
        Nenhum item cadastrado.
      </div>
    `;
    return;
  }

  itens.forEach(presente => {
    const item = document.createElement("div");
    item.className = "item-painel";

    item.innerHTML = `
      <span>${presente}</span>
      <div class="acoes-painel">
        <button class="btn-alterar" type="button">Alterar</button>
        <button class="btn-retirar" type="button">Retirar</button>
      </div>
    `;

    item.querySelector(".btn-alterar").addEventListener("click", () => alterarItem(presente));
    item.querySelector(".btn-retirar").addEventListener("click", () => retirarItem(presente));

    listaItensPainel.appendChild(item);
  });
}

function renderizarEscolhidos() {
  const escolhidos = carregarEscolhidos();
  const nomes = carregarNomes();

  listaEscolhidos.innerHTML = "";

  if (escolhidos.length === 0) {
    listaEscolhidos.innerHTML = `
      <div class="mensagem-vazia">
        Nenhum presente foi escolhido ainda.
      </div>
    `;
    return;
  }

  escolhidos.forEach(presente => {
    const pessoa = nomes[presente] || "Nome não informado";

    const item = document.createElement("div");
    item.className = "item-escolhido";

    item.innerHTML = `
      <span>${presente}<br><small>Escolhido por: ${pessoa}</small></span>
      <button class="btn-liberar" type="button">Disponibilizar novamente</button>
    `;

    item.querySelector("button").addEventListener("click", () => liberarPresente(presente));
    listaEscolhidos.appendChild(item);
  });
}

function escolherPresente(presente) {
  const nome = nomePessoa.value.trim();

  if (nome.length < 2) {
    alert("Digite seu nome antes de escolher o presente.");
    nomePessoa.focus();
    return;
  }

  const confirmar = confirm(`Você confirma a escolha deste presente?\n\nPresente: ${presente}`);

  if (!confirmar) {
    return;
  }

  const escolhidos = carregarEscolhidos();
  const nomes = carregarNomes();

  if (!escolhidos.includes(presente)) {
    escolhidos.push(presente);
    nomes[presente] = nome;

    salvarEscolhidos(escolhidos);
    salvarNomes(nomes);
  }

  renderizarTudo();

  const mensagem =
`Olá, Keren e Matheus!

Meu nome é ${nome}.
Gostaria de confirmar minha escolha na lista de presentes.

Presente escolhido: ${presente}

Com carinho, confirmo esse presente para o chá de casa nova.`;

  const link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(link, "_blank");
}

function liberarPresente(presente) {
  const confirmar = confirm(`Deseja disponibilizar novamente o presente: ${presente}?`);

  if (!confirmar) return;

  const escolhidos = carregarEscolhidos().filter(item => item !== presente);
  const nomes = carregarNomes();

  delete nomes[presente];

  salvarEscolhidos(escolhidos);
  salvarNomes(nomes);

  renderizarTudo();
}

function adicionarItem() {
  const item = novoItem.value.trim();

  if (item.length < 2) {
    alert("Digite o nome do item que deseja adicionar.");
    novoItem.focus();
    return;
  }

  const itens = carregarItens();

  const jaExiste = itens.some(presente => presente.toLowerCase() === item.toLowerCase());

  if (jaExiste) {
    alert("Esse item já existe na lista.");
    return;
  }

  itens.push(item);
  salvarItens(itens);

  novoItem.value = "";
  renderizarTudo();

  alert("Item adicionado com sucesso.");
}

function alterarItem(itemAntigo) {
  const novoNome = prompt("Digite o novo nome do item:", itemAntigo);

  if (novoNome === null) return;

  const itemNovo = novoNome.trim();

  if (itemNovo.length < 2) {
    alert("Digite um nome válido.");
    return;
  }

  const itens = carregarItens();

  const jaExiste = itens.some(item =>
    item.toLowerCase() === itemNovo.toLowerCase() &&
    item.toLowerCase() !== itemAntigo.toLowerCase()
  );

  if (jaExiste) {
    alert("Já existe um item com esse nome.");
    return;
  }

  const novosItens = itens.map(item => item === itemAntigo ? itemNovo : item);
  salvarItens(novosItens);

  const escolhidos = carregarEscolhidos();
  const novosEscolhidos = escolhidos.map(item => item === itemAntigo ? itemNovo : item);
  salvarEscolhidos(novosEscolhidos);

  const nomes = carregarNomes();
  if (nomes[itemAntigo]) {
    nomes[itemNovo] = nomes[itemAntigo];
    delete nomes[itemAntigo];
    salvarNomes(nomes);
  }

  renderizarTudo();
  alert("Item alterado com sucesso.");
}

function retirarItem(presente) {
  const confirmar = confirm(`Deseja retirar o item "${presente}" da lista?`);

  if (!confirmar) return;

  const itens = carregarItens().filter(item => item !== presente);
  const escolhidos = carregarEscolhidos().filter(item => item !== presente);
  const nomes = carregarNomes();

  delete nomes[presente];

  salvarItens(itens);
  salvarEscolhidos(escolhidos);
  salvarNomes(nomes);

  renderizarTudo();
}

function renderizarTudo() {
  renderizarPresentes();
  renderizarEscolhidos();
  renderizarItensPainel();
}

btnAdicionarItem.addEventListener("click", adicionarItem);

novoItem.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    adicionarItem();
  }
});

btnPainel.addEventListener("click", () => {
  const senha = prompt("Digite a senha do painel:");

  if (senha === "0107") {
    painelAdmin.classList.toggle("oculto");
    renderizarTudo();
  } else if (senha !== null) {
    alert("Senha incorreta.");
  }
});

renderizarTudo();

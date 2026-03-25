let cardapio = JSON.parse(localStorage.getItem("cardapio")) || [
  { nome: "Cheese Burger", preco: 25 },
  { nome: "Cheese Bacon", preco: 30 },
  { nome: "Pulled Pork", preco: 30 },
  { nome: "Chopirán", preco: 25 },
  { nome: "Especial", preco: 30 },
  { nome: "Refrigerante", preco: 6 },
  { nome: "Água com Gás", preco: 5 },
  { nome: "Monster", preco: 12 }
];

let pedido = [];

// =========================
// CARDÁPIO / PEDIDOS
// =========================
function carregar() {
  const select = document.getElementById("produto");
  if (!select) return;

  select.innerHTML = "";

  cardapio.forEach((p, i) => {
    select.innerHTML += `<option value="${i}">${p.nome} - R$ ${p.preco.toFixed(2)}</option>`;
  });
}

function addItem() {
  const produtoSelect = document.getElementById("produto");
  const qtdInput = document.getElementById("qtd");
  const opcaoInput = document.getElementById("opcao");

  if (!produtoSelect || !qtdInput || !opcaoInput) return;

  const i = produtoSelect.value;
  const qtd = parseInt(qtdInput.value);
  const opcao = opcaoInput.value.trim();

  if (isNaN(qtd) || qtd <= 0) {
    alert("Digite uma quantidade válida.");
    return;
  }

  const produto = cardapio[i];

  pedido.push({
    ...produto,
    qtd,
    opcao
  });

  opcaoInput.value = "";
  qtdInput.value = 1;

  render();
}

function calcularTotal() {
  let total = 0;
  pedido.forEach((p) => {
    total += p.preco * p.qtd;
  });
  return total;
}

function render() {
  const lista = document.getElementById("lista");
  const totalDiv = document.getElementById("total");

  if (!lista) return;

  lista.innerHTML = "";

  pedido.forEach((p) => {
    const subtotal = p.preco * p.qtd;

    lista.innerHTML += `
      <div class="item">
        ${p.qtd}x ${p.nome}<br>
        ${p.opcao ? `<small>↳ ${p.opcao}</small><br>` : ""}
        R$ ${subtotal.toFixed(2)}
      </div>
    `;
  });

  if (totalDiv) {
    totalDiv.innerText = "Total: R$ " + calcularTotal().toFixed(2);
  }
}

// =========================
// NUMERAÇÃO
// =========================
function gerarNumeroPedido() {
  const hoje = new Date().toLocaleDateString();
  const dataSalva = localStorage.getItem("dataPedido");
  let numero = localStorage.getItem("numeroPedido");

  if (dataSalva !== hoje) {
    numero = 1;
    localStorage.setItem("dataPedido", hoje);
  } else {
    numero = numero ? parseInt(numero) + 1 : 1;
  }

  localStorage.setItem("numeroPedido", numero);
  return numero;
}

// =========================
// IMPRESSÃO
// =========================
function abrirImpressao(conteudo) {
  const win = window.open("", "", "width=380,height=700");

  if (!win) {
    alert("O navegador bloqueou a janela de impressão.");
    return;
  }

  win.document.write(`
    <html>
      <head>
        <title>Impressão</title>
        <style>
          body {
            margin: 0;
            padding: 8px;
            font-family: monospace;
            font-size: 12px;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${conteudo}
      </body>
    </html>
  `);

  win.document.close();
}

function montarCupomCliente(dadosPedido) {
  const logoPath = `${window.location.origin}/logoschetini.jpeg`;

  const itensCliente = `
    <div style="text-align:left; font-size:12px;">
      ${dadosPedido.itens.map((i) => `
        <div style="margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; gap:8px;">
            <span>${i.qtd}x ${i.nome}</span>
            <span>R$ ${(i.qtd * i.preco).toFixed(2)}</span>
          </div>
          ${i.opcao ? `<div style="font-size:10px;">↳ ${i.opcao}</div>` : ""}
        </div>
      `).join("")}
    </div>
  `;

  return `
    <div style="font-family: monospace; width: 58mm; text-align:center; margin:0 auto;">
      <img src="${logoPath}" style="width:90px;" alt="Logo Schetini">
      <br>
      -------------------------
      <div style="font-size:20px; font-weight:bold;">
        Pedido Nº ${dadosPedido.numeroPedido}
      </div>
      -------------------------
      <div style="font-size:12px;">
        Cliente: ${dadosPedido.cliente || "Não informado"}<br>
        ${dadosPedido.data}
      </div>
      <br>
      ${itensCliente}
      <br>
      -------------------------
      <div style="font-size:14px; font-weight:bold;">
        Total: R$ ${Number(dadosPedido.total).toFixed(2)}
      </div>
      <br>
      <div style="font-size:12px;">
        "Tudo posso naquele que me fortalece."<br>
        - Filipenses 4:13
      </div>
      <br>
      -------------------------
      <div style="font-size:12px;">
        Obrigado pela preferência!
      </div>
      <br><br><br>
    </div>
  `;
}

function montarCupomCozinha(dadosPedido) {
  const logoPath = `${window.location.origin}/logoschetini.jpeg`;

  const itensCliente = `
    <div style="text-align:left; font-size:12px;">
      ${dadosPedido.itens.map((i) => `
        <div style="margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; gap:8px;">
            <span>${i.qtd}x ${i.nome}</span>
            <span>R$ ${(i.qtd * i.preco).toFixed(2)}</span>
          </div>
          ${i.opcao ? `<div style="font-size:10px;">↳ ${i.opcao}</div>` : ""}
        </div>
      `).join("")}
    </div>
  `;

  return `
    <div style="font-family: monospace; width: 58mm; text-align:center; margin:0 auto;">
      <img src="${logoPath}" style="width:90px;" alt="Logo Schetini">
      <br>
      -------------------------
      <div style="font-size:20px; font-weight:bold;">
        Pedido Nº ${dadosPedido.numeroPedido}
      </div>
      -------------------------
      <div style="font-size:12px;">
        Cliente: ${dadosPedido.cliente || "Não informado"}<br>
        ${dadosPedido.data}
      </div>
      <br>
      ${itensCliente}
      <br>
      -------------------------
      <div style="font-size:14px; font-weight:bold;">
        Total: R$ ${Number(dadosPedido.total).toFixed(2)}
      </div>
      <br>
      <div style="font-size:12px;">
        "Tudo posso naquele que me fortalece."<br>
        - Filipenses 4:13
      </div>
      <br>
      -------------------------
      <div style="font-size:12px;">
        Obrigado pela preferência!
      </div>
      <br><br><br>
    </div>
  `;
}

function imprimir() {
  const clienteInput = document.getElementById("cliente");
  const cliente = clienteInput ? clienteInput.value.trim() || "Não informado" : "Não informado";

  if (pedido.length === 0) {
    alert("Adicione pelo menos um item antes de imprimir.");
    return;
  }

  const dadosPedido = {
    numeroPedido: gerarNumeroPedido(),
    cliente,
    data: new Date().toLocaleString(),
    itens: pedido.map((item) => ({ ...item })),
    total: calcularTotal()
  };

  abrirImpressao(montarCupomCliente(dadosPedido));

  setTimeout(() => {
    abrirImpressao(montarCupomCozinha(dadosPedido));
  }, 800);

  salvarPedido(dadosPedido);

  pedido = [];
  render();

  if (clienteInput) clienteInput.value = "";
}

// =========================
// HISTÓRICO
// =========================
function salvarPedido(dadosPedido) {
  let historico = JSON.parse(localStorage.getItem("historico")) || [];
  historico.push(dadosPedido);
  localStorage.setItem("historico", JSON.stringify(historico));
}

function renderizarHistorico(listaHistorico) {
  const div = document.getElementById("historico");
  if (!div) return;

  div.innerHTML = "";

  const historicoOrdenado = [...listaHistorico].reverse();

  if (historicoOrdenado.length === 0) {
    div.innerHTML = `<div class="historico-vazio">Nenhum pedido encontrado.</div>`;
    return;
  }

  historicoOrdenado.forEach((p, index) => {
    div.innerHTML += `
      <div class="historico-card">
        <div class="historico-topo">
          <div>
            <strong>Pedido Nº ${p.numeroPedido || "-"}</strong><br>
            <span>${p.data}</span>
            <div class="historico-cliente">Cliente: ${p.cliente || "Não informado"}</div>
          </div>
          <div class="historico-total">R$ ${Number(p.total).toFixed(2)}</div>
        </div>

        <div class="historico-itens">
          ${p.itens.map(i => `
            <div class="historico-item-linha">
              <span>${i.qtd}x ${i.nome}</span>
              <span>R$ ${(i.qtd * i.preco).toFixed(2)}</span>
            </div>
            ${i.opcao ? `<div class="historico-obs">↳ ${i.opcao}</div>` : ""}
          `).join("")}
        </div>

        <div class="historico-acoes">
          <button onclick="reimprimirPedido(${historicoOrdenado.length - 1 - index})">
            🖨️ Reimprimir Cliente
          </button>
          <button onclick="reimprimirCozinha(${historicoOrdenado.length - 1 - index})">
            🍔 Reimprimir Cozinha
          </button>
          <button class="btn-danger" onclick="excluirPedidoHistorico(${historicoOrdenado.length - 1 - index})">
            🗑️ Excluir Pedido
          </button>
        </div>
      </div>
    `;
  });
}

function carregarHistorico() {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  renderizarHistorico(historico);
}

function buscarHistorico() {
  const termo = document.getElementById("buscaHistorico")?.value.toLowerCase().trim() || "";
  const historico = JSON.parse(localStorage.getItem("historico")) || [];

  if (!termo) {
    renderizarHistorico(historico);
    return;
  }

  const filtrado = historico.filter((p) => {
    const numero = String(p.numeroPedido || "").toLowerCase();
    const cliente = String(p.cliente || "").toLowerCase();
    const itens = (p.itens || []).map(i => `${i.nome} ${i.opcao || ""}`).join(" ").toLowerCase();

    return numero.includes(termo) || cliente.includes(termo) || itens.includes(termo);
  });

  renderizarHistorico(filtrado);
}

function reimprimirPedido(indiceOriginal) {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  const pedidoSalvo = historico[indiceOriginal];
  if (!pedidoSalvo) return;

  abrirImpressao(montarCupomCliente(pedidoSalvo));
}

function reimprimirCozinha(indiceOriginal) {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  const pedidoSalvo = historico[indiceOriginal];
  if (!pedidoSalvo) return;

  abrirImpressao(montarCupomCozinha(pedidoSalvo));
}

function excluirPedidoHistorico(indiceOriginal) {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado.");
    return;
  }

  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  const pedidoSalvo = historico[indiceOriginal];
  if (!pedidoSalvo) return;

  const confirmar = confirm(`Deseja excluir o pedido Nº ${pedidoSalvo.numeroPedido}?`);
  if (!confirmar) return;

  historico.splice(indiceOriginal, 1);
  localStorage.setItem("historico", JSON.stringify(historico));
  carregarHistorico();
}

// =========================
// LOGIN ADMIN
// =========================
function login() {
  const userInput = document.getElementById("user");
  const passInput = document.getElementById("pass");

  if (!userInput || !passInput) return;

  const user = userInput.value.trim();
  const pass = passInput.value.trim();

  if (user === "Hamburgada" && pass === "Schetini1245") {
    localStorage.setItem("adminLogado", "true");

    const loginDiv = document.getElementById("login");
    const painelDiv = document.getElementById("painel");

    if (loginDiv) loginDiv.classList.add("hidden");
    if (painelDiv) painelDiv.classList.remove("hidden");

    carregarAdmin();
    mostrarDashboardAdmin();
    verificarAcessoHistorico();
  } else {
    alert("Login inválido");
  }
}

function logout() {
  localStorage.removeItem("adminLogado");
  location.reload();
}

function verificarLogin() {
  const loginDiv = document.getElementById("login");
  const painelDiv = document.getElementById("painel");

  if (!loginDiv || !painelDiv) return;

  const logado = localStorage.getItem("adminLogado");

  if (logado === "true") {
    loginDiv.classList.add("hidden");
    painelDiv.classList.remove("hidden");
    carregarAdmin();
    mostrarDashboardAdmin();
  } else {
    loginDiv.classList.remove("hidden");
    painelDiv.classList.add("hidden");
  }
}

// =========================
// ADMIN
// =========================
function carregarAdmin() {
  const div = document.getElementById("cardapioAdmin");
  if (!div) return;

  div.innerHTML = "";

  cardapio.forEach((item, i) => {
    div.innerHTML += `
      <div class="admin-produto">
        <input value="${item.nome}" onchange="editarNome(${i}, this.value)">
        <input type="number" step="0.01" value="${item.preco}" onchange="editarPreco(${i}, this.value)">
        <button class="btn-danger" onclick="excluirProduto(${i})">Excluir</button>
      </div>
    `;
  });
}

function editarNome(i, valor) {
  cardapio[i].nome = valor.trim();
}

function editarPreco(i, valor) {
  const preco = parseFloat(valor);
  if (!isNaN(preco)) {
    cardapio[i].preco = preco;
  }
}

function salvarCardapio() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado! Faça login como administrador.");
    return;
  }

  localStorage.setItem("cardapio", JSON.stringify(cardapio));
  alert("Cardápio salvo com sucesso!");
  carregar();
}

function adicionarProduto() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado! Faça login como administrador.");
    return;
  }

  const nomeInput = document.getElementById("novoProdutoNome");
  const precoInput = document.getElementById("novoProdutoPreco");

  if (!nomeInput || !precoInput) return;

  const nome = nomeInput.value.trim();
  const preco = parseFloat(precoInput.value);

  if (!nome) {
    alert("Digite o nome do produto.");
    return;
  }

  if (isNaN(preco) || preco <= 0) {
    alert("Digite um preço válido.");
    return;
  }

  cardapio.push({ nome, preco });
  localStorage.setItem("cardapio", JSON.stringify(cardapio));

  nomeInput.value = "";
  precoInput.value = "";

  carregarAdmin();
  carregar();

  alert("Produto adicionado com sucesso!");
}

function excluirProduto(i) {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado! Faça login como administrador.");
    return;
  }

  const confirmar = confirm(`Deseja excluir o produto "${cardapio[i].nome}"?`);
  if (!confirmar) return;

  cardapio.splice(i, 1);
  localStorage.setItem("cardapio", JSON.stringify(cardapio));

  carregarAdmin();
  carregar();

  alert("Produto excluído com sucesso!");
}

function zerarHistorico() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado! Faça login como administrador.");
    return;
  }

  const confirmar = confirm("Tem certeza que deseja apagar todo o histórico de pedidos?");
  if (!confirmar) return;

  localStorage.removeItem("historico");
  alert("Histórico apagado com sucesso!");
}

function zerarNumeracaoPedido() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado! Faça login como administrador.");
    return;
  }

  const confirmar = confirm("Deseja zerar a numeração dos pedidos?");
  if (!confirmar) return;

  localStorage.removeItem("numeroPedido");
  localStorage.removeItem("dataPedido");

  alert("Numeração de pedidos zerada com sucesso!");
}

function calcularTotalVendidoHoje() {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  const hoje = new Date().toLocaleDateString();

  return historico
    .filter(p => p.data.includes(hoje))
    .reduce((soma, p) => soma + Number(p.total || 0), 0);
}

function mostrarDashboardAdmin() {
  const dashboard = document.getElementById("dashboardAdmin");
  if (!dashboard) return;

  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    dashboard.classList.add("hidden");
    return;
  }

  dashboard.classList.remove("hidden");
  const totalHoje = calcularTotalVendidoHoje();

  dashboard.innerHTML = `
    <div class="dashboard-card">
      <h3>Total vendido hoje</h3>
      <p>R$ ${totalHoje.toFixed(2)}</p>
    </div>
  `;
}

function exportarBackup() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado.");
    return;
  }

  const dados = {
    historico: JSON.parse(localStorage.getItem("historico")) || [],
    cardapio: JSON.parse(localStorage.getItem("cardapio")) || [],
    numeroPedido: localStorage.getItem("numeroPedido") || "0",
    dataPedido: localStorage.getItem("dataPedido") || ""
  };

  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "backup-hamburgada.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importarBackup(event) {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado.");
    return;
  }

  const arquivo = event.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = function(e) {
    try {
      const dados = JSON.parse(e.target.result);

      if (dados.historico) localStorage.setItem("historico", JSON.stringify(dados.historico));
      if (dados.cardapio) localStorage.setItem("cardapio", JSON.stringify(dados.cardapio));
      if (dados.numeroPedido) localStorage.setItem("numeroPedido", dados.numeroPedido);
      if (dados.dataPedido) localStorage.setItem("dataPedido", dados.dataPedido);

      alert("Backup importado com sucesso.");
      location.reload();
    } catch {
      alert("Arquivo de backup inválido.");
    }
  };

  leitor.readAsText(arquivo);
}

// =========================
// FILTRO HISTÓRICO
// =========================
function verificarAcessoHistorico() {
  const filtro = document.getElementById("filtroHistorico");
  if (!filtro) return;

  const logado = localStorage.getItem("adminLogado");
  if (logado === "true") {
    filtro.classList.remove("hidden");
  } else {
    filtro.classList.add("hidden");
  }
}

function converterDataBRParaISO(dataTexto) {
  if (!dataTexto) return null;

  const partes = dataTexto.split(",")[0].split("/");
  if (partes.length !== 3) return null;

  const [dia, mes, ano] = partes;
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

function filtrarHistoricoPorData() {
  const logado = localStorage.getItem("adminLogado");
  if (logado !== "true") {
    alert("Acesso negado.");
    return;
  }

  const inicio = document.getElementById("dataInicio")?.value;
  const fim = document.getElementById("dataFim")?.value;

  const historico = JSON.parse(localStorage.getItem("historico")) || [];

  const filtrado = historico.filter(p => {
    const dataISO = converterDataBRParaISO(p.data);
    if (!dataISO) return false;
    if (inicio && dataISO < inicio) return false;
    if (fim && dataISO > fim) return false;
    return true;
  });

  renderizarHistorico(filtrado);
}

// =========================
// INICIAR
// =========================
carregar();
render();
carregarHistorico();
verificarLogin();
verificarAcessoHistorico();
mostrarDashboardAdmin();
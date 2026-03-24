// =========================
// 📋 CARDÁPIO
// =========================
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
// 🧾 CARREGAR CARDÁPIO
// =========================
function carregar() {
  let select = document.getElementById("produto");
  if (!select) return;

  select.innerHTML = "";

  cardapio.forEach((p, i) => {
    select.innerHTML += `<option value="${i}">${p.nome} - R$${p.preco}</option>`;
  });
}

// =========================
// ➕ ADICIONAR ITEM
// =========================
function addItem() {
  let i = document.getElementById("produto").value;
  let qtd = parseInt(document.getElementById("qtd").value);
  let opcao = document.getElementById("opcao").value;

  let produto = cardapio[i];

  pedido.push({
    ...produto,
    qtd,
    opcao
  });

  render();
}

// =========================
// 💰 CALCULAR TOTAL
// =========================
function calcularTotal() {
  let total = 0;

  pedido.forEach(p => {
    total += p.preco * p.qtd;
  });

  return total;
}

// =========================
// 🖥️ RENDERIZAR LISTA
// =========================
function render() {
  let lista = document.getElementById("lista");
  if (!lista) return;

  lista.innerHTML = "";

  let total = 0;

  pedido.forEach(p => {
    let subtotal = p.preco * p.qtd;
    total += subtotal;

    lista.innerHTML += `
      <div class="item">
        ${p.qtd}x ${p.nome}<br>
        <small>${p.opcao || ""}</small><br>
        R$${subtotal.toFixed(2)}
      </div>
    `;
  });

  let totalDiv = document.getElementById("total");
  if (totalDiv) {
    totalDiv.innerText = "Total: R$ " + total.toFixed(2);
  }
}

// =========================
// 🖨️ IMPRESSÃO
// =========================
function imprimir() {
  const cliente = document.getElementById("cliente").value || "Não informado";
  const agora = new Date().toLocaleString();
  const total = calcularTotal();
  const numeroPedido = gerarNumeroPedido();
  let itensHTML = "";
  pedido.forEach(i => {
    itensHTML += `
      <div>${i.qtd}x ${i.nome}</div>
      ${i.opcao ? `<div style="font-size:10px">Obs: ${i.opcao}</div>` : ""}
    `;
  });

  // 🧾 CLIENTE
  const clientePrint = `
      <div style="font-family: monospace; width: 58mm; text-align:center;">
      <img src="${window.location.origin}/logoschetini.jpeg" style="width:70px;">
      Pedido Nº: ${numeroPedido}
      <br>-------------------------

      <div style="text-align:left;">
        Cliente: ${cliente}<br>
        ${agora}
      </div>

      <br>

      <div style="text-align:left;">
        ${itensHTML}
      </div>

      <br>
      -------------------------
      <strong>Total: R$ ${total.toFixed(2)}</strong>

      <br><br>
      "Tudo posso naquele que me fortalece".
      - Filipenses 4:13
      <br>-------------------------

      Obrigado pela preferência!
      <br><br><br>
    </div>
  `;

  // 🍔 COZINHA
  const cozinhaPrint = `
    <div style="font-family: monospace; width: 58mm;">
      
      <div style="text-align:center;">
        <strong>*** COZINHA ***</strong><br>
        Pedido Nº: ${numeroPedido}
        <br>-------------------------
      </div>

      <div>
        Cliente: ${cliente}<br>
        ${agora}
      </div>

      <br>

      ${pedido.map(i => `
        <div style="margin-bottom:10px">
          <strong>${i.qtd}x ${i.nome}</strong><br>
          ${i.opcao ? `<span>Obs: ${i.opcao}</span>` : ""}
        </div>
      `).join("")}

      <br>
      -------------------------
      <br><br><br>
    </div>
  `;

  abrirImpressao(clientePrint);

  setTimeout(() => {
    abrirImpressao(cozinhaPrint);
  }, 800);

  salvarPedido(pedido);

  pedido = [];
  render();
}

// =========================
// 🧾 ABRIR IMPRESSÃO
// =========================
function abrirImpressao(conteudo) {
  const win = window.open('', '', 'width=300,height=600');

  win.document.write(`
    <html>
    <head>
      <style>
        body {
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

// =========================
// 🔐 LOGIN ADMIN
// =========================
function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (user === "Hamburgada" && pass === "Schetini1245") {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("painel").classList.remove("hidden");
    carregarAdmin();
  } else {
    alert("Login inválido");
  }
}

// =========================
// ⚙️ ADMIN
// =========================
function carregarAdmin() {
  const div = document.getElementById("cardapioAdmin");
  if (!div) return;

  div.innerHTML = "";

  cardapio.forEach((item, i) => {
    div.innerHTML += `
      <input value="${item.nome}" onchange="editarNome(${i}, this.value)">
      <input type="number" value="${item.preco}" onchange="editarPreco(${i}, this.value)">
    `;
  });
}

function editarNome(i, valor) {
  cardapio[i].nome = valor;
}

function editarPreco(i, valor) {
  cardapio[i].preco = parseFloat(valor);
}

function salvarCardapio() {
  localStorage.setItem("cardapio", JSON.stringify(cardapio));
  alert("Cardápio salvo!");
}

// =========================
// 📊 HISTÓRICO
// =========================
function salvarPedido(pedidoAtual) {
  let historico = JSON.parse(localStorage.getItem("historico")) || [];

  historico.push({
    data: new Date().toLocaleString(),
    itens: pedidoAtual,
    total: calcularTotal()
  });

  localStorage.setItem("historico", JSON.stringify(historico));
}

function carregarHistorico() {
  const div = document.getElementById("historico");
  if (!div) return;

  let historico = JSON.parse(localStorage.getItem("historico")) || [];

  div.innerHTML = "";

  historico.reverse().forEach(p => {
    div.innerHTML += `
      <div class="item">
        <strong>${p.data}</strong><br>
        Total: R$ ${p.total.toFixed(2)}<br>
        ${p.itens.map(i => i.nome).join(", ")}
      </div>
    `;
  });
}

// =========================
// 🚀 INICIAR
// =========================
carregar();
carregarHistorico();

function gerarNumeroPedido() {
  let hoje = new Date().toLocaleDateString();
  let dataSalva = localStorage.getItem("dataPedido");

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
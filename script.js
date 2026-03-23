let cardapio = [
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

/* carregar cardápio */
function carregar() {
  let select = document.getElementById("produto");
  select.innerHTML = "";

  cardapio.forEach((p, i) => {
    select.innerHTML += `<option value="${i}">${p.nome} - R$${p.preco}</option>`;
  });
}

/* adicionar item */
function addItem() {
  let i = document.getElementById("produto").value;
  let qtd = document.getElementById("qtd").value;
  let opcao = document.getElementById("opcao").value;

  let produto = cardapio[i];

  pedido.push({
    ...produto,
    qtd,
    opcao
  });

  render();
}

/* renderizar lista */
function render() {
  let lista = document.getElementById("lista");
  lista.innerHTML = "";

  let total = 0;

  pedido.forEach(p => {
    let subtotal = p.preco * p.qtd;
    total += subtotal;

    lista.innerHTML += `
      <div class="item">
        ${p.qtd}x ${p.nome}<br>
        <small>${p.opcao || ""}</small><br>
        R$${subtotal}
      </div>
    `;
  });

  document.getElementById("total").innerText = "Total: R$" + total.toFixed(2);
}

/* impressão */
function imprimir() {
  const cliente = document.getElementById("cliente").value;
  const agora = new Date().toLocaleString();

  let itensHTML = "";
  pedido.forEach(i => {
    itensHTML += `
      <div>${i.qtd}x ${i.nome}</div>
      ${i.opcao ? `<div style="font-size:10px">Obs: ${i.opcao}</div>` : ""}
    `;
  });

  // =========================
  // 🧾 VIA CLIENTE
  // =========================
  const clientePrint = `
    <div style="font-family: monospace; width: 58mm;">
      <div style="text-align:center;">
        <img src="logo.png" style="width:80px"><br>
        <strong>SCHEETINI CHARCUTARIA</strong><br>
        -------------------------
      </div>

      Cliente: ${cliente}<br>
      ${agora}
      <br><br>

      ${itensHTML}

      <br>
      -------------------------
      <strong>Total: R$ ${total.toFixed(2)}</strong>

      <br><br>
      Obrigado pela preferência!
    </div>
  `;

  // =========================
  // 🍔 VIA COZINHA
  // =========================
  const cozinhaPrint = `
    <div style="font-family: monospace; width: 58mm;">
      <div style="text-align:center;">
        <strong>*** COZINHA ***</strong><br>
        -------------------------
      </div>

      Cliente: ${cliente}<br><br>

      ${pedido.map(i => `
        <div style="margin-bottom:8px">
          <strong>${i.qtd}x ${i.nome}</strong><br>
          ${i.opcao ? `<span>Obs: ${i.opcao}</span>` : ""}
        </div>
      `).join("")}

      <br>
      -------------------------
    </div>
  `;

  // imprime cliente
  abrirImpressao(clientePrint);

  // imprime cozinha (delay pequeno)
  setTimeout(() => {
    abrirImpressao(cozinhaPrint);
  }, 1000);
}

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

/* navegação */
function mostrar(tela) {
  document.querySelectorAll("main section").forEach(sec => {
    sec.classList.add("hidden");
  });

  document.getElementById(tela).classList.remove("hidden");
}

function irHome() {
  mostrar("home");
}

/* iniciar */
carregar();

// LOGIN SIMPLES
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

function carregarAdmin() {
  const div = document.getElementById("cardapioAdmin");
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

function salvarPedido(pedido) {
  let historico = JSON.parse(localStorage.getItem("historico")) || [];

  historico.push({
    data: new Date().toLocaleString(),
    itens: pedido,
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
        Total: R$ ${p.total}<br>
        ${p.itens.map(i => i.nome).join(", ")}
      </div>
    `;
  });
}

carregarHistorico();
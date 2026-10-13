let items = JSON.parse(localStorage.getItem("expenses")) || [];

function save() { localStorage.setItem("expenses", JSON.stringify(items)); }

function addItem() {
  const title = document.getElementById("title").value.trim();
  const amount = Number(document.getElementById("amount").value);
  if (title === "" || amount <= 0) {
    alert("Title aur sahi amount daalo");
    return;
  }
  items.push({
    id: Date.now(),
    title: title,
    amount: amount,
    type: document.getElementById("type").value,
    category: document.getElementById("category").value
  });
  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
  save(); render();
}

function deleteItem(id) {
  items = items.filter(function (i) { return i.id !== id; });
  save(); render();
}

function render() {
  let income = 0, expense = 0;
  const history = document.getElementById("history");
  history.innerHTML = "";

  items.slice().reverse().forEach(function (i) {
    if (i.type === "income") income += i.amount; else expense += i.amount;
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center " + i.type + "-item";
    li.innerHTML = `<div><b></b><br><small class="text-secondary">${i.category}</small></div>
      <div><span>${i.type === "income" ? "+" : "-"}₹${i.amount}</span>
      <button class="btn btn-sm btn-outline-danger ms-2">X</button></div>`;
    li.querySelector("b").textContent = i.title;
    li.querySelector("button").addEventListener("click", function () { deleteItem(i.id); });
    history.appendChild(li);
  });

  if (items.length === 0) history.innerHTML = '<li class="list-group-item text-secondary">Abhi koi entry nahi.</li>';

  document.getElementById("income").textContent = "₹" + income;
  document.getElementById("expense").textContent = "₹" + expense;
  document.getElementById("balance").textContent = "₹" + (income - expense);
  drawChart();
}

// simple bar chart canvas par (bina library ke)
function drawChart() {
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const totals = {};
  items.filter(function (i) { return i.type === "expense"; }).forEach(function (i) {
    totals[i.category] = (totals[i.category] || 0) + i.amount;
  });
  const names = Object.keys(totals);
  if (names.length === 0) {
    ctx.fillStyle = "#888";
    ctx.fillText("Chart ke liye kharcha add karo", 10, 30);
    return;
  }
  const max = Math.max.apply(null, Object.values(totals));
  const barW = canvas.width / names.length;
  const colors = ["#0d6efd", "#dc3545", "#ffc107", "#198754", "#6f42c1", "#fd7e14"];

  names.forEach(function (n, idx) {
    const h = (totals[n] / max) * 150;
    ctx.fillStyle = colors[idx % colors.length];
    ctx.fillRect(idx * barW + 10, 180 - h, barW - 20, h);
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.fillText(n, idx * barW + 10, 200);
    ctx.fillText("₹" + totals[n], idx * barW + 10, 175 - h);
  });
}

document.getElementById("addBtn").addEventListener("click", addItem);
render();

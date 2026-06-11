// State
let roommates = [];
let expenses = [];

// ── Roommates ──────────────────────────────────────────────

function addRoommate() {
  const input = document.getElementById('roommate-name');
  const name = input.value.trim();
  if (!name) return alert('Please enter a name.');
  if (roommates.includes(name)) return alert(`"${name}" is already added.`);
  roommates.push(name);
  input.value = '';
  renderRoommates();
  renderPayerSelect();
  renderSplitCheckboxes();
  recalculate();
}

function removeRoommate(name) {
  if (expenses.some(e => e.payer === name || e.splitBetween.includes(name))) {
    return alert(`Cannot remove "${name}" — they appear in existing expenses.`);
  }
  roommates = roommates.filter(r => r !== name);
  renderRoommates();
  renderPayerSelect();
  renderSplitCheckboxes();
  recalculate();
}

function renderRoommates() {
  const list = document.getElementById('roommate-list');
  if (roommates.length === 0) {
    list.innerHTML = '<li class="empty">No roommates added yet.</li>';
    return;
  }
  list.innerHTML = roommates.map(name =>
    `<li>${name} <button onclick="removeRoommate('${name}')" title="Remove">✕</button></li>`
  ).join('');
}

function renderPayerSelect() {
  const select = document.getElementById('expense-payer');
  select.innerHTML = roommates.length
    ? roommates.map(n => `<option value="${n}">${n}</option>`).join('')
    : '<option value="">-- Add roommates first --</option>';
}

function renderSplitCheckboxes() {
  const container = document.getElementById('split-checkboxes');
  container.innerHTML = roommates.map(name =>
    `<label>
      <input type="checkbox" value="${name}" checked />
      ${name}
    </label>`
  ).join('');
}

// ── Expenses ───────────────────────────────────────────────

function addExpense() {
  if (roommates.length < 2) return alert('Add at least 2 roommates first.');

  const desc = document.getElementById('expense-desc').value.trim();
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const payer = document.getElementById('expense-payer').value;
  const checked = [...document.querySelectorAll('#split-checkboxes input:checked')];
  const splitBetween = checked.map(cb => cb.value);

  if (!desc) return alert('Please enter a description.');
  if (isNaN(amount) || amount <= 0) return alert('Please enter a valid amount.');
  if (!payer) return alert('Please select who paid.');
  if (splitBetween.length === 0) return alert('Select at least one person to split between.');

  const expense = {
    id: Date.now(),
    desc,
    amount,
    payer,
    splitBetween,
    date: new Date().toLocaleDateString()
  };

  expenses.push(expense);

  // Reset form
  document.getElementById('expense-desc').value = '';
  document.getElementById('expense-amount').value = '';
  renderSplitCheckboxes(); // re-check all

  renderExpenses();
  recalculate();
}

function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;
  expenses = expenses.filter(e => e.id !== id);
  renderExpenses();
  recalculate();
}

function renderExpenses() {
  const list = document.getElementById('expense-list');
  if (expenses.length === 0) {
    list.innerHTML = '<li class="empty">No expenses yet.</li>';
    return;
  }
  list.innerHTML = expenses.map(e => {
    const perPerson = (e.amount / e.splitBetween.length).toFixed(2);
    return `
      <li>
        <div class="expense-header">
          <span>${e.desc}</span>
          <span>$${e.amount.toFixed(2)} <button class="delete-btn" onclick="deleteExpense(${e.id})">Delete</button></span>
        </div>
        <div class="expense-detail">
          Paid by <strong>${e.payer}</strong> · Split between: ${e.splitBetween.join(', ')} · $${perPerson}/person · ${e.date}
        </div>
      </li>`;
  }).join('');
}

// ── Balances & Settlements ─────────────────────────────────

function recalculate() {
  // net[person] = amount they are owed (positive) or owe (negative)
  const net = {};
  roommates.forEach(r => net[r] = 0);

  expenses.forEach(e => {
    const share = e.amount / e.splitBetween.length;
    // payer gets credited the full amount
    if (net[e.payer] !== undefined) net[e.payer] += e.amount;
    // each person in split owes their share
    e.splitBetween.forEach(person => {
      if (net[person] !== undefined) net[person] -= share;
    });
  });

  renderBalances(net);
  renderSettlements(net);
}

function renderBalances(net) {
  const container = document.getElementById('balances-display');
  if (roommates.length === 0) {
    container.innerHTML = '<p class="empty">Add roommates and expenses to see balances.</p>';
    return;
  }
  container.innerHTML = roommates.map(r => {
    const val = net[r] || 0;
    const cls = val > 0.005 ? 'balance-positive' : val < -0.005 ? 'balance-negative' : 'balance-zero';
    const label = val > 0.005 ? `gets back $${val.toFixed(2)}` :
                  val < -0.005 ? `owes $${Math.abs(val).toFixed(2)}` : 'settled up ✓';
    return `<div class="balance-item"><span>${r}</span><span class="${cls}">${label}</span></div>`;
  }).join('');
}

function renderSettlements(net) {
  const container = document.getElementById('settlements-display');
  const settlements = computeSettlements(net);

  if (settlements.length === 0) {
    container.innerHTML = '<p class="empty">Everyone is settled up! 🎉</p>';
    return;
  }

  container.innerHTML = settlements.map((s, i) =>
    `<div class="settlement-item">
      <span><strong>${s.from}</strong> <span class="arrow">→</span> <strong>${s.to}</strong></span>
      <span class="amount">$${s.amount.toFixed(2)}</span>
      <button class="settle-btn" onclick="markSettled(${i})">Mark Paid</button>
    </div>`
  ).join('');

  // Store for settle action
  window._settlements = settlements;
}

function computeSettlements(net) {
  // Greedy algorithm: match biggest debtor with biggest creditor
  const debtors = [];
  const creditors = [];

  Object.entries(net).forEach(([person, val]) => {
    if (val < -0.005) debtors.push({ person, amount: -val });
    else if (val > 0.005) creditors.push({ person, amount: val });
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements = [];

  while (debtors.length && creditors.length) {
    const debtor = debtors[0];
    const creditor = creditors[0];
    const amount = Math.min(debtor.amount, creditor.amount);

    settlements.push({ from: debtor.person, to: creditor.person, amount });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount < 0.005) debtors.shift();
    if (creditor.amount < 0.005) creditors.shift();
  }

  return settlements;
}

function markSettled(index) {
  const s = window._settlements[index];
  if (!confirm(`Mark $${s.amount.toFixed(2)} payment from ${s.from} to ${s.to} as settled?`)) return;

  // Add a settlement expense: from pays to, split only between them
  expenses.push({
    id: Date.now(),
    desc: `💸 Settlement: ${s.from} → ${s.to}`,
    amount: s.amount,
    payer: s.from,
    splitBetween: [s.to],
    date: new Date().toLocaleDateString()
  });

  renderExpenses();
  recalculate();
}

// ── Init ───────────────────────────────────────────────────
renderRoommates();
renderPayerSelect();
renderSplitCheckboxes();
recalculate();

let state = {
    income: 0,
    limit: 0,
    expenses: []
};

document.getElementById('expense-date').valueAsDate = new Date();
const dateOptions = { day: 'numeric', month: 'short' };
document.getElementById('current-date').innerText = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

function setBudget() {
    state.income = parseFloat(document.getElementById('monthly-income').value) || 0;
    state.limit = parseFloat(document.getElementById('monthly-limit').value) || 0;
    updateUI();
}

function addExpense() {
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;

    if (!name || !amount) return;

    state.expenses.unshift({ name, amount, date }); // Adiciona no topo
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
    updateUI();
}

function updateUI() {
    const totalExpenses = state.expenses.reduce((acc, ex) => acc + ex.amount, 0);
    const balance = state.income - totalExpenses;
    
    // Atualiza Textos
    document.getElementById('balance').innerText = `R$ ${balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById('display-income').innerText = `R$ ${state.income}`;
    document.getElementById('display-expenses').innerText = `R$ ${totalExpenses}`;

    // Lógica da Barra e Status
    const limitPercent = state.limit > 0 ? (totalExpenses / state.limit) * 100 : 0;
    const fill = document.getElementById('progress-fill');
    const badge = document.getElementById('status-badge');
    
    fill.style.width = `${Math.min(limitPercent, 100)}%`;
    document.getElementById('limit-percent').innerText = `${Math.round(limitPercent)}%`;

    if (limitPercent > 90) {
        fill.style.background = 'var(--danger)';
        badge.innerText = "Crítico";
        badge.style.background = 'var(--danger)';
    } else if (limitPercent > 60) {
        fill.style.background = 'var(--warning)';
        badge.innerText = "Atenção";
        badge.style.background = 'var(--warning)';
    } else {
        fill.style.background = 'var(--primary)';
        badge.innerText = "Estável";
        badge.style.background = 'var(--success)';
    }

    // Renderiza Lista
    const list = document.getElementById('transaction-list');
    list.innerHTML = state.expenses.map(ex => `
        <li style="animation: slideIn 0.3s ease-out forwards">
            <div>
                <strong style="display: block; color: #1e293b">${ex.name}</strong>
                <small style="color: #64748b">${new Date(ex.date).toLocaleDateString('pt-BR', dateOptions)}</small>
            </div>
            <span style="font-weight: 700; color: var(--danger)">- R$ ${ex.amount.toFixed(2)}</span>
        </li>
    `).join('');
}

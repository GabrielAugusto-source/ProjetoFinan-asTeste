
let state = {
    income: 0,
    limit: 0,
    expenses: []
};


let itemToDeleteIndex = null;
let modalMode = ''; 

const dateOptions = { day: 'numeric', month: 'short' };


window.onload = function() {
    const dataSaved = localStorage.getItem('financeData');
    if (dataSaved) {
        state = JSON.parse(dataSaved);
    }
    
    updateUI();
    
    const dateInput = document.getElementById('expense-date');
    if(dateInput) dateInput.valueAsDate = new Date();
};

function setBudget() {
    state.income = parseFloat(document.getElementById('monthly-income').value) || 0;
    state.limit = parseFloat(document.getElementById('monthly-limit').value) || 0;
    updateUI();
}

function addExpense() {
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const date = document.getElementById('expense-date').value;

    if (!name || isNaN(amount) || amount <= 0) { 
        openAlertModal("⚠️", "Valor Inválido!", "Por favor, insira uma descrição válida e um valor maior que R$ 0,00.");
        return;
    }

    state.expenses.unshift({ name, amount, date });
    document.getElementById('expense-name').value = '';
    document.getElementById('expense-amount').value = '';
    updateUI();
}


function deleteExpense(index) {
    itemToDeleteIndex = index;
    modalMode = 'deleteItem';
    
    
    document.querySelector('.modal-content h3').innerText = "Excluir Movimentação?";
    document.querySelector('.modal-content p').innerText = "Esta ação não pode ser desfeita.";
    
    document.getElementById('custom-modal').style.display = 'flex';
}

function resetAllRequest() {
    itemToDeleteIndex = null;
    modalMode = 'resetAll';
    
    document.querySelector('.modal-content h3').innerText = "Redefinir tudo?";
    document.querySelector('.modal-content p').innerText = "Isso apagará todos os seus dados, Tem certeza?";
    document.getElementById('custom-modal').style.display = 'flex';
}

function closeModal() {
    itemToDeleteIndex = null;
    modalMode = '';
    document.getElementById('custom-modal').style.display = 'none';
}

function confirmDeletion() {
    if (modalMode === 'deleteItem' && itemToDeleteIndex !== null) {
       
        state.expenses.splice(itemToDeleteIndex, 1);
        showToast("✅ Movimentação excluída com sucesso!"); 
    }
    else if (modalMode === 'resetAll') {
      
        state = { income: 0, limit: 0, expenses: [] };
        localStorage.removeItem('financeData');
        showToast("⚠️ Todos os dados foram resetados!"); 
    }
    updateUI();
    closeModal();
}



function updateUI() {
    const totalExpenses = state.expenses.reduce((acc, ex) => acc + ex.amount, 0);
    const balance = state.income - totalExpenses;
    
    const balanceEl = document.getElementById('balance');
    const incomeEl = document.getElementById('display-income');
    const expensesEl = document.getElementById('display-expenses');
    const fill = document.getElementById('progress-fill');
    const badge = document.getElementById('status-badge');
    const limitPercentEl = document.getElementById('limit-percent');
    const transactionList = document.getElementById('transaction-list');

    if (!balanceEl) return;

    balanceEl.innerText = `R$ ${balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    incomeEl.innerText = `R$ ${state.income.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    expensesEl.innerText = `R$ ${totalExpenses.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    const limitEl = document.getElementById('display-limit');
    if(limitEl) limitEl.innerText = `R$ ${state.limit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    const limitPercent = state.limit > 0 ? (totalExpenses / state.limit) * 100 : 0;
    
    fill.style.width = `${Math.min(limitPercent, 100)}%`;
    limitPercentEl.innerText = `${Math.round(limitPercent)}%`;

    if (limitPercent > 90) {
        fill.style.background = 'var(--danger)';
        badge.innerText = "Crítico";
        badge.style.background = 'var(--danger)';
    } else if (limitPercent > 60) {
        fill.style.background = 'var(--warning)';
        badge.innerText = "Atenção";
        badge.style.background = 'var(--warning)';
    } else {
        fill.style.background = 'var(--success)';
        badge.innerText = "Estável";
        badge.style.background = 'var(--success)';
    }

    transactionList.innerHTML = state.expenses.map((ex, index) => `
        <li>
            <div>
                <strong style="display: block; color: #1e293b">${ex.name}</strong>
                <small style="color: #64748b">${new Date(ex.date).toLocaleDateString('pt-BR', dateOptions)}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-weight: 700; color: var(--danger)">- R$ ${ex.amount.toFixed(2)}</span>
                <button onclick="deleteExpense(${index})" class="btn-delete" title="Excluir">
                    ✖️
                </button>
            </div>
        </li>
    `).join('');

    localStorage.setItem('financeData', JSON.stringify(state));
}


function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message; 
    toast.classList.add('show'); 
    
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


function openAlertModal(icon, title, message) {
    document.getElementById('alert-icon').innerText = icon;
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-message').innerText = message;
    document.getElementById('alert-modal').style.display = 'flex';
}

function closeAlertModal() {
    document.getElementById('alert-modal').style.display = 'none';
}
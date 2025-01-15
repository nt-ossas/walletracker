document.getElementById('addSaleForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const saleName = document.getElementById('saleName').value;
    const saleDateInput = document.getElementById('saleDate').value;
    const saleDate = saleDateInput ? saleDateInput : new Date().toISOString().split('T')[0];
    addSale(saleName, 'proposta_accettata', saleDate);
    document.getElementById('saleName').value = ''; 
});

function addSale(name, status, date) {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const saleExists = sales.some(sale => sale.name === name);

    if (saleExists) {
        alert('Una vendita con questo nome esiste già. Per favore, scegli un altro nome.');
        return;
    }

    const sale = {
        name: name,
        status: status,
        date: date,
        statusDates: {
            'proposta_accettata': date,
            'preparato': '',
            'spedito': '',
            'in_consegna': '',
            'completato': ''
        }
    };
    saveSale(sale);
    renderSale(sale);
}

function saveSale(sale) {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    sales.push(sale);
    localStorage.setItem('sales', JSON.stringify(sales));
}

function loadSales() {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    sales.forEach(sale => {
        renderSale(sale);
    });
}

function renderSale(sale) {
    const salesContainer = document.getElementById('salesContainer');
    const saleElement = document.createElement('div');
    saleElement.classList.add('sale');
    saleElement.innerHTML = `
        <h4>${sale.name}</h4>
        <div class="status-bar">
            <div class="status ${sale.statusDates['proposta_accettata'] ? 'active' : ''}">
                ${sale.statusDates['proposta_accettata'] ? `<p class="date-shipping">${sale.statusDates['proposta_accettata']}</p>` : ''}
            </div>
            <div class="status ${sale.statusDates['preparato'] ? 'active' : ''}">
                ${sale.statusDates['preparato'] ? `<p class="date-shipping">${sale.statusDates['preparato']}</p>` : ''}
            </div>
            <div class="status ${sale.statusDates['spedito'] ? 'active' : ''}">
                ${sale.statusDates['spedito'] ? `<p class="date-shipping">${sale.statusDates['spedito']}</p>` : ''}
            </div>
            <div class="status ${sale.statusDates['in_consegna'] ? 'active' : ''}">
                ${sale.statusDates['in_consegna'] ? `<p class="date-shipping">${sale.statusDates['in_consegna']}</p>` : ''}
            </div>
            <div class="status ${sale.statusDates['completato'] ? 'active' : ''}">
                ${sale.statusDates['completato'] ? `<p class="date-shipping">${sale.statusDates['completato']}</p>` : ''}
            </div>
        </div>
        <select onchange="updateSaleStatus('${sale.name}', this.value)">
            <option value="proposta_accettata" ${sale.status === 'proposta_accettata' ? 'selected' : ''}>Proposta Accettata</option>
            <option value="preparato" ${sale.status === 'preparato' ? 'selected' : ''}>Preparato</option>
            <option value="spedito" ${sale.status === 'spedito' ? 'selected' : ''}>Spedito</option>
            <option value="in_consegna" ${sale.status === 'in_consegna' ? 'selected' : ''}>In Consegna</option>
            <option value="completato" ${sale.status === 'completato' ? 'selected' : ''}>Completato</option>
        </select>
        <input type="date" onchange="updateSaleDate('${sale.name}', this.value)" value="${sale.date}">
        <button onclick="deleteSale('${sale.name}')">Elimina</button>
    `;
    if (sale.status === 'completato') {
        saleElement.querySelectorAll('.status').forEach(statusElement => {
            statusElement.style.backgroundColor = 'var(--contrast-color)';
        });
    }
    salesContainer.appendChild(saleElement);
}

function deleteSale(name) {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    sales = sales.filter(sale => sale.name !== name);
    localStorage.setItem('sales', JSON.stringify(sales));
    reloadSales();
}

function updateSaleStatus(name, status) {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const sale = sales.find(s => s.name === name);
    if (sale) {
        sale.status = status;
        const currentDate = new Date().toISOString().split('T')[0];
        const statuses = ['proposta_accettata', 'preparato', 'spedito', 'in_consegna', 'completato'];
        let statusReached = false;

        statuses.forEach(st => {
            if (st === status) {
                statusReached = true;
                sale.statusDates[st] = currentDate;
            } else if (statusReached) {
                sale.statusDates[st] = '';
            } else {
                sale.statusDates[st] = sale.statusDates[st] || currentDate;
            }
        });

        localStorage.setItem('sales', JSON.stringify(sales));
        reloadSales();
    }
}

function updateSaleDate(name, date) {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const sale = sales.find(s => s.name === name);
    if (sale) {
        sale.date = date;
        sale.statusDates[sale.status] = date;
        localStorage.setItem('sales', JSON.stringify(sales));
        reloadSales();
    }
}

function reloadSales() {
    const salesContainer = document.getElementById('salesContainer');
    salesContainer.innerHTML = '';
    loadSales();
}

document.addEventListener('DOMContentLoaded', loadSales);

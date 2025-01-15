function openPopup() {
    document.getElementById('popup-overlay').style.display = 'flex';
    document.querySelector('#popup-overlay #amount').value = '';
    document.querySelector('#popup-overlay #description').value = '';
    document.body.classList.add('no-scroll');
}

function openPopupSaldo() {
    document.getElementById('popup-saldo').style.display = 'flex';
    document.querySelector('#popup-saldo #input-saldo').value = '';
    document.body.classList.add('no-scroll');
}

function closePopup() {
    var popup = document.querySelectorAll('.popup-overlay');
    popup.forEach(function(popup) {
        popup.style.display = 'none';
    });
    document.body.classList.remove('no-scroll');
}

function updateSaldo() {
    var saldoElement = document.getElementById('saldo');
    var saldo = parseFloat(saldoElement.textContent);
    var trans = parseFloat(document.getElementById('amount').value);
    if (isNaN(trans) || trans == 0)
        return;
    if (!isNaN(saldo) && !isNaN(trans)) {
        saldo += trans;
        saldoElement.textContent = saldo.toFixed(2);
        saveSaldo(saldo);
        transition();
        closePopup();
    }
}

function saveSaldo(saldo) {
    localStorage.setItem('saldo', saldo.toFixed(2));
}

function loadSaldo() {
    var saldo = localStorage.getItem('saldo');
    if (saldo !== null) {
        document.getElementById('saldo').textContent = saldo;
    }
}

function transition() {
    var trans = document.createElement('div');
    trans.classList.add('trans');
    var valore = parseFloat(document.getElementById('amount').value);
    var nome = document.getElementById('description').value;
    var data = new Date().toLocaleDateString();
    var orario = new Date().toLocaleTimeString();

    if (valore > 0) {
        let addGroup = document.querySelector('#group-1 .box');
        addGroup.appendChild(trans);
    } else {
        let removeGroup = document.querySelector('#group-2 .box');
        removeGroup.appendChild(trans);
    }

    if (nome === "") {
        nome = "Transazione";
    }

    trans.innerHTML = `
        <h1>${valore.toFixed(2)}</h1>
        <h4>${nome}</h4>
        <p class="trans-date">${data} ${orario}</p>
        <i class="fa-solid fa-x"></i>`;

    trans.querySelector('i').addEventListener('click', function() {
        deleteTrans(trans, valore);
    });

    saveTransazione(valore, nome, data, orario);
}

function saveTransazione(valore, nome, data, orario) {
    var transazioni = JSON.parse(localStorage.getItem('transazioni')) || [];
    transazioni.push({ valore, nome, data, orario });
    localStorage.setItem('transazioni', JSON.stringify(transazioni));
}

function loadTransazioni() {
    var transazioni = JSON.parse(localStorage.getItem('transazioni')) || [];
    transazioni.forEach(function(transazione) {
        var trans = document.createElement('div');
        trans.classList.add('trans');
        trans.innerHTML = `
            <h1>${transazione.valore.toFixed(2)}</h1>
            <h4>${transazione.nome}</h4>
            <p class="trans-date">${transazione.data} ${transazione.orario}</p>
            <i class="fa-solid fa-x"></i>`;
        
        trans.querySelector('i').addEventListener('click', function() {
            deleteTrans(trans, transazione.valore);
        });

        if (transazione.valore > 0) {
            let addGroup = document.querySelector('#group-1 .box');
            addGroup.appendChild(trans);
        } else {
            let removeGroup = document.querySelector('#group-2 .box');
            removeGroup.appendChild(trans);
        }
    });
}

function deleteTrans(trans, valore) {
    var saldoElement = document.getElementById('saldo');
    var saldo = parseFloat(saldoElement.textContent);
    saldo -= valore;
    saldoElement.textContent = saldo.toFixed(2);
    trans.remove();
    saveSaldo(saldo);

    var transazioni = JSON.parse(localStorage.getItem('transazioni')) || [];
    transazioni = transazioni.filter(function(t) {
        return t.valore !== valore || t.nome !== trans.querySelector('h4').textContent;
    });
    localStorage.setItem('transazioni', JSON.stringify(transazioni));
    var group1 = document.querySelector('#group-1 .box');
    var group2 = document.querySelector('#group-2 .box');
    if (group1.children.length === 0) {
        document.getElementById('group-1').classList.add('hidden');
        document.getElementById('head-group-1').classList.remove('active');
    }
    if (group2.children.length === 0) {
        document.getElementById('group-2').classList.add('hidden');
        document.getElementById('head-group-2').classList.remove('active');
    }
}

function setSaldo(){
    var saldo = document.getElementById('saldo');
    var inputSaldo = parseFloat(document.getElementById('input-saldo').value);
    if (isNaN(inputSaldo))
        return;
    saldo.textContent = inputSaldo.toFixed(2);
    saveSaldo(inputSaldo);
    closePopup();
}

function openHistory(n) {
    var group = document.getElementById(`group-${n}`);
    var headGroup = document.getElementById(`head-group-${n}`);
    var groups = document.querySelectorAll('.group');
    var headGroups = document.querySelectorAll(`.head-group`);
    if (group.querySelector('.box').children.length == 0) {
        return;
    }
    groups.forEach(function(element) {
        element.classList.add('hidden');
    });
    headGroups.forEach(function(element) {
        element.classList.remove('active');
    });
    group.classList.remove('hidden');
    headGroup.classList.add('active');
}
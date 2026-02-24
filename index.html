// 1. CONFIGURAÇÃO DO FIREBASE (Suas chaves do projeto acompanhamento-pedagogico2026)
const firebaseConfig = {
  apiKey: "AIzaSyDliIAcOCvgChv68cog27jenACkpF8MCyg",
  authDomain: "acompanhamento-pedagogico2026.firebaseapp.com",
  projectId: "acompanhamento-pedagogico2026",
  storageBucket: "acompanhamento-pedagogico2026.firebasestorage.app",
  messagingSenderId: "358848317719",
  appId: "1:358848317719:web:42feccdc979a1776cc8f52",
  measurementId: "G-N0Z5CZHEXK",
  // ESSA LINHA É A CHAVE PARA FUNCIONAR:
  databaseURL: "https://acompanhamento-pedagogico2026-default-rtdb.firebaseio.com"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. MONITOR DE CONEXÃO EM TEMPO REAL
const ponto = document.getElementById('pontoStatus');
const texto = document.getElementById('textoStatus');

// Verifica se o navegador conseguiu "falar" com o Google
db.ref(".info/connected").on("value", (snap) => {
    if (snap.val() === true) {
        ponto.style.backgroundColor = "#16a34a"; // Verde (Sincronizado)
        texto.innerText = "Sincronizado com Firebase Cloud";
        texto.style.color = "#16a34a";
    } else {
        ponto.style.backgroundColor = "#b91c1c"; // Vermelho (Offline)
        texto.innerText = "Offline - Tentando reconectar...";
        texto.style.color = "#b91c1c";
    }
});

// 3. ESTRUTURA PEDAGÓGICA (6º ao 9º ano)
const turmasBase = {
    "6º": ["A","B","C","D","E"],
    "7º": ["A","B","C","D","E","F"],
    "8º": ["A","B","C"],
    "9º": ["A","B"]
};

const disciplinasBase = [
    "Língua Portuguesa", "Arte", "Educação Física", "Inglês", 
    "Matemática", "Ciências", "História", "Geografia"
];

// 4. INICIALIZAÇÃO DA INTERFACE
window.onload = () => {
    const anoSel = document.getElementById("ano");
    if(anoSel) {
        Object.keys(turmasBase).forEach(a => {
            const op = document.createElement("option");
            op.textContent = a;
            anoSel.appendChild(op);
        });
        carregarTurmas();
    }
};

function carregarTurmas() {
    const ano = document.getElementById("ano").value;
    const turmaSel = document.getElementById("turma");
    if(!turmaSel) return;
    turmaSel.innerHTML = "";
    turmasBase[ano].forEach(t => {
        const op = document.createElement("option");
        op.textContent = t;
        turmaSel.appendChild(op);
    });
}

// 5. FUNÇÕES DE BANCO DE DADOS (FIREBASE)
function abrirTurma() {
    const ano = document.getElementById("ano").value;
    const turma = document.getElementById("turma").value;
    const chave = `${ano}${turma}`;

    db.ref('pedagogico/' + chave).on('value', (snapshot) => {
        let dados = snapshot.val();
        if (!dados) {
            dados = disciplinasBase.map(d => ({
                disciplina: d, professor: "", planejamento: false, pei: false, obs: ""
            }));
            db.ref('pedagogico/' + chave).set(dados);
        }
        renderTabela(dados, chave);
    });
}

function renderTabela(dados, chave) {
    const tb = document.getElementById("tabelaBody");
    if(!tb) return;
    tb.innerHTML = "";

    dados.forEach((d, i) => {
        const tr = document.createElement("tr");
        if(d.planejamento && d.pei) tr.style.background = "#f0fdf4";

        tr.innerHTML = `
            <td><b>${d.disciplina}</b>${d.obs ? `<br><small>📝 ${d.obs}</small>` : ''}</td>
            <td>${d.professor || "—"}</td>
            <td><button class="badge ${d.planejamento ? 'ok' : 'pend'}" onclick="toggleStatus('${chave}',${i},'planejamento')">${d.planejamento ? 'OK' : 'PEND'}</button></td>
            <td><button class="badge ${d.pei ? 'ok' : 'pend'}" onclick="toggleStatus('${chave}',${i},'pei')">${d.pei ? 'OK' : 'PEND'}</button></td>
            <td><button class="editBtn" onclick="editarLinha('${chave}',${i})">✏️</button></td>
        `;
        tb.appendChild(tr);
    });
}

function toggleStatus(chave, i, campo) {
    const ref = db.ref(`pedagogico/${chave}/${i}`);
    ref.once('value', (snap) => {
        const val = snap.val()[campo];
        ref.update({ [campo]: !val });
    });
}

function editarLinha(chave, i) {
    const ref = db.ref(`pedagogico/${chave}/${i}`);
    ref.once('value', (snap) => {
        const d = snap.val();
        const prof = prompt("Nome do Professor:", d.professor);
        const observacao = prompt("Observações (Ex: Faltam 2 PEIs):", d.obs);
        if (prof !== null) {
            ref.update({
                professor: prof.trim(),
                obs: observacao ? observacao.trim() : ""
            });
        }
    });
}

// 6. UTILITÁRIOS
function baixarImagem() {
    html2canvas(document.getElementById("areaTurma")).then(canvas => {
        const link = document.createElement("a");
        link.download = `relatorio_pedagogico.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

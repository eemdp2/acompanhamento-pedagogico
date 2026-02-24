// CONFIGURAÇÃO DO FIREBASE (Substitua pelos seus dados!)
const firebaseConfig = {
  apiKey: "AIzaSyDliIAcOCvgChv68cog27jenACkpF8MCyg",
  authDomain: "acompanhamento-pedagogico2026.firebaseapp.com",
  projectId: "acompanhamento-pedagogico2026",
  storageBucket: "acompanhamento-pedagogico2026.firebasestorage.app",
  messagingSenderId: "358848317719",
  appId: "1:358848317719:web:42feccdc979a1776cc8f52",
  measurementId: "G-N0Z5CZHEXK"
};



// Inicialização
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const turmasBase = {"6º": ["A","B","C","D","E"], "7º": ["A","B","C","D","E","F"]};
const disciplinasBase = ["Língua Portuguesa", "Arte", "Educação Física", "Inglês", "Matemática", "Ciências", "História", "Geografia"];

// Carregar seletores ao iniciar
window.onload = () => {
    const anoSel = document.getElementById("ano");
    Object.keys(turmasBase).forEach(a => {
        let op = document.createElement("option");
        op.textContent = a; anoSel.appendChild(op);
    });
    carregarTurmas();
};

document.getElementById("ano").onchange = carregarTurmas;

function carregarTurmas() {
    const ano = document.getElementById("ano").value;
    const tSel = document.getElementById("turma");
    tSel.innerHTML = "";
    turmasBase[ano].forEach(t => {
        let op = document.createElement("option");
        op.textContent = t; tSel.appendChild(op);
    });
}

// BUSCA NO BANCO ONLINE
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
    tb.innerHTML = "";
    dados.forEach((d, i) => {
        const tr = document.createElement("tr");
        if(d.planejamento && d.pei) tr.style.background = "#f0fdf4";

        tr.innerHTML = `
            <td><b>${d.disciplina}</b><br><small>${d.obs || ""}</small></td>
            <td>${d.professor || "—"}</td>
            <td><button class="badge ${d.planejamento ? 'ok' : 'pend'}" onclick="toggleStatus('${chave}',${i},'planejamento')">${d.planejamento ? 'OK' : 'PEND'}</button></td>
            <td><button class="badge ${d.pei ? 'ok' : 'pend'}" onclick="toggleStatus('${chave}',${i},'pei')">${d.pei ? 'OK' : 'PEND'}</button></td>
            <td><button class="editBtn" onclick="editar('${chave}',${i})">✏️</button></td>
        `;
        tb.appendChild(tr);
    });
}

function toggleStatus(chave, i, campo) {
    const ref = db.ref(`pedagogico/${chave}/${i}`);
    ref.once('value', snap => {
        let val = snap.val()[campo];
        ref.update({ [campo]: !val });
    });
}

function editar(chave, i) {
    const ref = db.ref(`pedagogico/${chave}/${i}`);
    ref.once('value', snap => {
        const d = snap.val();
        const p = prompt("Professor:", d.professor);
        const o = prompt("Obs:", d.obs);
        if(p !== null) ref.update({ professor: p, obs: o || "" });
    });
}

// 1. CONFIGURAÇÃO DO FIREBASE (Suas credenciais oficiais)
const firebaseConfig = {
  apiKey: "AIzaSyDliIAcOCvgChv68cog27jenACkpF8MCyg",
  authDomain: "acompanhamento-pedagogico2026.firebaseapp.com",
  projectId: "acompanhamento-pedagogico2026",
  storageBucket: "acompanhamento-pedagogico2026.firebasestorage.app",
  messagingSenderId: "358848317719",
  appId: "1:358848317719:web:42feccdc979a1776cc8f52",
  measurementId: "G-N0Z5CZHEXK",
  // A linha abaixo é fundamental para o status sair de "Verificando..."
  databaseURL: "https://acompanhamento-pedagogico2026-default-rtdb.firebaseio.com"
};

// Inicialização
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. CONFIGURAÇÕES DA ESCOLA
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

// 3. MONITOR DE CONEXÃO (O ponto no cabeçalho)
const ponto = document.getElementById('pontoStatus');
const texto = document.getElementById('textoStatus');

db.ref(".info/connected").on("value", (snap) => {
    if (snap.val() === true) {
        ponto.style.backgroundColor = "#16a34a"; // Verde
        texto.innerText = "Sincronizado com Firebase Cloud";
        texto.style.color = "#16a34a";
    } else {
        ponto.style.backgroundColor = "#b91c1c"; // Vermelho
        texto.innerText = "Offline - Verifique sua conexão";
        texto.style.color = "#b91c1c";
    }
});

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

// 5. GESTÃO DE DADOS ONLINE (CRUD)
function abrirTurma() {
    const ano = document.getElementById("ano").value;
    const turma = document.getElementById("turma").value;
    const chave = `${ano}${turma}`;

    // Escuta mudanças em tempo real no banco
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
        const observacao = prompt("Observações:", d.obs);
        if (prof !== null) {
            ref.update({ professor: prof.trim(), obs: observacao ? observacao.trim() : "" });
        }
    });
}

// 6. RELATÓRIOS (WhatsApp e Imagem)
function copiarPendenciasProfessor() {
    const busca = document.getElementById("profPendencias").value.trim().toLowerCase();
    if (!busca) return alert("Digite o nome do professor");
    
    db.ref('pedagogico/').once('value', (snap) => {
        const todas = snap.val();
        let txt = `*RELATÓRIO DE PENDÊNCIAS - PROF. ${busca.toUpperCase()}*\n\n`;
        let achou = false;

        for (let t in todas) {
            todas[t].forEach(d => {
                if (d.professor.toLowerCase().includes(busca) && (!d.planejamento || !d.pei)) {
                    txt += `📍 *${t}* - ${d.disciplina}\n`;
                    if(!d.planejamento) txt += ` • Planejamento ❌\n`;
                    if(!d.pei) txt += ` • PEI ❌\n`;
                    txt += `\n`; achou = true;
                }
            });
        }
        achou ? navigator.clipboard.writeText(txt).then(() => alert("Relatório copiado!")) : alert("Tudo OK para este professor.");
    });
}

function baixarImagem() {
    const area = document.getElementById("areaTurma");
    html2canvas(area).then(canvas => {
        const link = document.createElement("a");
        link.download = `relatorio_${new Date().toLocaleDateString()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

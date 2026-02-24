// 1. CONFIGURAÇÃO DO FIREBASE (Suas chaves reais)
const firebaseConfig = {
  apiKey: "AIzaSyDliIAcOCvgChv68cog27jenACkpF8MCyg",
  authDomain: "acompanhamento-pedagogico2026.firebaseapp.com",
  projectId: "acompanhamento-pedagogico2026",
  storageBucket: "acompanhamento-pedagogico2026.firebasestorage.app",
  messagingSenderId: "358848317719",
  appId: "1:358848317719:web:42feccdc979a1776cc8f52",
  measurementId: "G-N0Z5CZHEXK",
  databaseURL: "https://acompanhamento-pedagogico2026-default-rtdb.firebaseio.com"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. ESTRUTURA PEDAGÓGICA
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

// 3. INICIALIZAÇÃO DA INTERFACE
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

document.getElementById("ano").addEventListener("change", carregarTurmas);

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

// 4. LÓGICA DE BANCO DE DADOS ONLINE (REALTIME DATABASE)
function abrirTurma() {
    const ano = document.getElementById("ano").value;
    const turma = document.getElementById("turma").value;
    const chave = `${ano}${turma}`;

    // Escuta mudanças em tempo real
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
            <td>
                <b>${d.disciplina}</b>
                ${d.obs ? `<br><small style="color:gray">📝 ${d.obs}</small>` : ''}
            </td>
            <td>${d.professor || "—"}</td>
            <td>
                <button class="badge ${d.planejamento ? 'ok' : 'pend'}" 
                    onclick="toggleStatus('${chave}',${i},'planejamento')">
                    ${d.planejamento ? 'PLAN. OK' : 'PENDENTE'}
                </button>
            </td>
            <td>
                <button class="badge ${d.pei ? 'ok' : 'pend'}" 
                    onclick="toggleStatus('${chave}',${i},'pei')">
                    ${d.pei ? 'PEI OK' : 'PENDENTE'}
                </button>
            </td>
            <td><button class="editBtn" onclick="editarLinha('${chave}',${i})">✏️</button></td>
        `;
        tb.appendChild(tr);
    });
}

function toggleStatus(chave, i, campo) {
    const ref = db.ref(`pedagogico/${chave}/${i}`);
    ref.once('value', (snap) => {
        const dados = snap.val();
        ref.update({ [campo]: !dados[campo] });
    });
}

function editarLinha(chave, i) {
    const ref = db.ref(`pedagogico/${chave}/${i}`);
    ref.once('value', (snap) => {
        const d = snap.val();
        const prof = prompt("Nome do Professor:", d.professor);
        if (prof !== null) {
            const observacao = prompt("Observações:", d.obs);
            ref.update({
                professor: prof.trim(),
                obs: observacao ? observacao.trim() : ""
            });
        }
    });
}

// 5. RELATÓRIOS
function copiarPendenciasProfessor() {
    const profBusca = document.getElementById("profPendencias").value.trim();
    if (!profBusca) return alert("Digite o nome do professor");
    
    db.ref('pedagogico/').once('value', (snapshot) => {
        const todasTurmas = snapshot.val();
        let txt = `*RELATÓRIO DE PENDÊNCIAS - PROF. ${profBusca.toUpperCase()}*\n\n`;
        let achou = false;

        for (let idTurma in todasTurmas) {
            todasTurmas[idTurma].forEach(d => {
                if (d.professor && d.professor.toLowerCase().includes(profBusca.toLowerCase())) {
                    if (!d.planejamento || !d.pei) {
                        txt += `📍 *Turma ${idTurma}* - ${d.disciplina}\n`;
                        if (!d.planejamento) txt += `  • Planejamento pendente\n`;
                        if (!d.pei) txt += `  • PEI pendente\n`;
                        txt += `\n`;
                        achou = true;
                    }
                }
            });
        }
        achou ? navigator.clipboard.writeText(txt).then(() => alert("Copiado!")) : alert("Nada pendente.");
    });
}

function baixarImagem() {
    html2canvas(document.getElementById("areaTurma")).then(canvas => {
        const link = document.createElement("a");
        link.download = `relatorio_pedagogico_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}


// CONFIGURAÇÕES DE BASE
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

// INICIALIZAÇÃO
window.onload = () => {
    const anoSel = document.getElementById("ano");
    if(!anoSel) return;
    
    Object.keys(turmasBase).forEach(a => {
        const op = document.createElement("option");
        op.textContent = a;
        anoSel.appendChild(op);
    });
    carregarTurmas();
};

function carregarTurmas() {
    const ano = document.getElementById("ano").value;
    const turmaSel = document.getElementById("turma");
    turmaSel.innerHTML = "";
    turmasBase[ano].forEach(t => {
        const op = document.createElement("option");
        op.textContent = t;
        turmaSel.appendChild(op);
    });
}

// GESTÃO DA TABELA
function abrirTurma() {
    const ano = document.getElementById("ano").value;
    const turma = document.getElementById("turma").value;
    const chave = `status_${ano}${turma}`;
    let dados = JSON.parse(localStorage.getItem(chave) || "null");

    if (!dados) {
        dados = disciplinasBase.map(d => ({
            ano, turma, disciplina: d, professor: "", planejamento: false, pei: false, obs: ""
        }));
        localStorage.setItem(chave, JSON.stringify(dados));
    }
    renderTabela(dados, chave);
}

function renderTabela(dados, chave) {
    const tb = document.getElementById("tabela");
    tb.innerHTML = "";

    dados.forEach((d, i) => {
        const tr = document.createElement("tr");
        if(d.planejamento && d.pei) tr.className = "completo";

        tr.innerHTML = `
            <td>
                <b>${d.disciplina}</b>
                ${d.obs ? `<span class="obs-text">📝 ${d.obs}</span>` : ''}
            </td>
            <td>${d.professor || "—"}</td>
            <td>
                <span class="status-badge ${d.planejamento ? 'feito' : 'pendente'}" onclick="toggleStatus('${chave}',${i},'planejamento')">
                    ${d.planejamento ? "PLAN. OK" : "PLAN. PENDENTE"}
                </span>
            </td>
            <td>
                <span class="status-badge ${d.pei ? 'feito' : 'pendente'}" onclick="toggleStatus('${chave}',${i},'pei')">
                    ${d.pei ? "PEI OK" : "PEI PENDENTE"}
                </span>
            </td>
            <td><button class="editBtn" onclick="editarLinha('${chave}',${i})">✏️</button></td>
        `;
        tb.appendChild(tr);
    });
}

function toggleStatus(chave, i, campo) {
    const dados = JSON.parse(localStorage.getItem(chave));
    dados[i][campo] = !dados[i][campo];
    localStorage.setItem(chave, JSON.stringify(dados));
    renderTabela(dados, chave);
}

function editarLinha(chave, i) {
    const dados = JSON.parse(localStorage.getItem(chave));
    const prof = prompt("Nome do Professor:", dados[i].professor);
    if (prof !== null) {
        const observacao = prompt("Observações (ex: faltam 2 PEIs):", dados[i].obs);
        dados[i].professor = prof.trim();
        dados[i].obs = observacao ? observacao.trim() : "";
        localStorage.setItem(chave, JSON.stringify(dados));
        renderTabela(dados, chave);
    }
}

// EXPORTAÇÃO E WHATSAPP
function copiarTexto(txt) {
    navigator.clipboard.writeText(txt).then(() => alert("Copiado! Pronto para colar no WhatsApp."));
}

function copiarPendenciasProfessor() {
    const prof = document.getElementById("profPendencias").value.trim();
    if (!prof) return alert("Digite o nome do professor");
    
    let txt = `*RELATÓRIO DE PENDÊNCIAS - PROF. ${prof.toUpperCase()}*\n\n`;
    let achou = false;

    Object.keys(localStorage).forEach(k => {
        if (k.startsWith("status_")) {
            const dados = JSON.parse(localStorage.getItem(k));
            dados.forEach(d => {
                if (d.professor.toLowerCase().includes(prof.toLowerCase()) && (!d.planejamento || !d.pei)) {
                    txt += `📍 *${d.ano}${d.turma}* - ${d.disciplina}\n`;
                    if (!d.planejamento) txt += `  • Planejamento pendente\n`;
                    if (!d.pei) txt += `  • Lançamento PEI pendente\n`;
                    txt += `\n`;
                    achou = true;
                }
            });
        }
    });

    achou ? copiarTexto(txt) : alert("Tudo em dia para este professor!");
}

function exportarDados() {
    const todos = {};
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith("status_")) todos[k] = JSON.parse(localStorage.getItem(k));
    }
    const blob = new Blob([JSON.stringify(todos, null, 2)], {type: "application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `backup_pedagogico_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}

function importarDados(input) {
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const dados = JSON.parse(e.target.result);
            Object.keys(dados).forEach(k => localStorage.setItem(k, JSON.stringify(dados[k])));
            alert("Backup restaurado com sucesso!");
            location.reload();
        } catch(err) { alert("Arquivo inválido."); }
    };
    reader.readAsText(input.files[0]);
}

function baixarImagem() {
    html2canvas(document.getElementById("areaTurma")).then(canvas => {
        const link = document.createElement("a");
        link.download = `relatorio_turma.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// ===============================
// CONFIGURAÇÃO E STATUS
// ===============================
const firebaseConfig = {
    apiKey: "AIzaSyDliIAcOCvgChv68cog27jenACkpF8MCyg",
    authDomain: "acompanhamento-pedagogico2026.firebaseapp.com",
    databaseURL: "https://acompanhamento-pedagogico2026-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "acompanhamento-pedagogico2026",
    storageBucket: "acompanhamento-pedagogico2026.appspot.com",
    messagingSenderId: "G-N0Z5CZHEXK",
    appId: "1:358848317719:web:42feccdc979a1776cc8f52"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Monitor de Conexão Realtime
db.ref(".info/connected").on("value", snap => {
    const statusDiv = document.getElementById("statusConexao");
    if (snap.val() === true) {
        statusDiv.innerHTML = "🟢 Conectado ao Firebase Cloud";
        statusDiv.style.color = "#16a34a";
    } else {
        statusDiv.innerHTML = "🔴 Offline - Verifique a conexão";
        statusDiv.style.color = "#dc2626";
    }
});

// ===============================
// GESTÃO DE DADOS (ABRIR E RENDERIZAR)
// ===============================
function abrirTurma() {
    const ano = document.getElementById("ano").value;
    const turma = document.getElementById("turma").value;
    const chave = "status_" + ano + turma;

    // Escuta mudanças em tempo real para essa turma específica
    db.ref("turmas/" + chave).on("value", snap => {
        let dados = snap.val();

        // Se a turma nunca foi aberta, cria a estrutura inicial no banco
        if (!dados) {
            dados = disciplinasBase.map(d => ({
                ano, turma, disciplina: d, professor: "", ok: false, pei: false
            }));
            db.ref("turmas/" + chave).set(dados);
        }
        renderTabela(dados, chave);
    });
}

function renderTabela(dados, chave) {
    const tb = document.getElementById("tabela");
    tb.innerHTML = "";

    dados.forEach((d, i) => {
        const tr = document.createElement("tr");
        
        // Se ambos estiverem prontos, a linha ganha destaque visual
        if (d.ok && d.pei) tr.style.backgroundColor = "#dcfce7"; 

        tr.innerHTML = `
            <td><b>${d.disciplina}</b></td>
            <td>${d.professor || "—"}</td>
            <td class="status" onclick="toggleStatus('${chave}', ${i}, 'ok')">
                ${d.ok ? "✅ OK" : "❌ PEND"}
            </td>
            <td class="status" onclick="toggleStatus('${chave}', ${i}, 'pei')">
                ${d.pei ? "✅ LANÇADO" : "❌ PEND"}
            </td>
            <td><button class="editBtn" onclick="editarProf('${chave}', ${i})">✏️ Editar</button></td>
        `;
        tb.appendChild(tr);
    });
}

// ===============================
// FUNÇÕES DE ATUALIZAÇÃO (ESCRIBA)
// ===============================

// Altera o status de OK ou PEI conforme o clique
function toggleStatus(chave, i, campo) {
    const ref = db.ref(`turmas/${chave}/${i}/${campo}`);
    ref.once("value").then(snap => {
        ref.set(!snap.val()); // Inverte o valor (true para false e vice-versa)
    });
}

function editarProf(chave, i) {
    const ref = db.ref(`turmas/${chave}/${i}`);
    ref.once("value").then(snap => {
        const d = snap.val();
        const nome = prompt("Nome do professor:", d.professor || "");
        if (nome !== null) {
            ref.update({ professor: nome.trim() });
        }
    });
}

// ===============================
// RELATÓRIOS E VARREDURA (WHATSAPP)
// ===============================

function varreduraGeral() {
    db.ref("turmas").once("value").then(snap => {
        const todas = snap.val();
        if (!todas) return alert("Nenhuma turma encontrada no banco.");

        let relatorio = "📊 *QUADRO GERAL - EEM DOM PEDRO II*\n\n";

        Object.keys(todas).sort().forEach(chave => {
            const nomeTurma = chave.replace("status_", "").replace(/([0-9]º)([A-Z])/, "$1 $2");
            relatorio += `🔹 *TURMA: ${nomeTurma}*\n`;

            todas[chave].forEach(d => {
                // Formatação: ✅ se estiver tudo certo, ❌ se houver pendência
                const statusPlan = d.ok ? "✅" : "❌";
                const statusPei = d.pei ? "✅" : "❌";
                relatorio += `• ${d.disciplina}: ${statusPlan} Plan. / ${statusPei} PEI\n`;
            });
            relatorio += "\n";
        });

        copiarTexto(relatorio);
    });
}

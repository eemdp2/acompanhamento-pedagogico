// FIREBASE
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

// ===============================
// STATUS CONEXÃO FIREBASE
// ===============================
const statusDiv = document.createElement("div");
statusDiv.style.textAlign = "center";
statusDiv.style.margin = "10px";
statusDiv.style.fontWeight = "bold";
statusDiv.innerHTML = "🔄 Verificando conexão Firebase...";
document.body.insertBefore(statusDiv, document.body.firstChild);

db.ref(".info/connected").on("value", snap => {
  if (snap.val() === true) {
    statusDiv.innerHTML = "🟢 Firebase conectado";
    statusDiv.style.color = "#16a34a";
  } else {
    statusDiv.innerHTML = "🔴 Firebase desconectado";
    statusDiv.style.color = "#dc2626";
  }
});

// ===============================
// BASE
// ===============================
const turmasBase={"6º":["A","B","C","D","E"],"7º":["A","B","C","D","E","F"]};
const disciplinasBase=["Língua Portuguesa","Arte","Educação Física","Inglês","Matemática","Ciências","História","Geografia"];

// ===============================
// INIT
// ===============================
window.onload=function(){
  const anoSel=document.getElementById("ano");
  Object.keys(turmasBase).forEach(a=>{
    const op=document.createElement("option");
    op.textContent=a;
    anoSel.appendChild(op);
  });
  carregarTurmas();
};

document.getElementById("ano").addEventListener("change",carregarTurmas);

function carregarTurmas(){
  const ano=document.getElementById("ano").value;
  const turmaSel=document.getElementById("turma");
  turmaSel.innerHTML="";
  turmasBase[ano].forEach(t=>{
    const op=document.createElement("option");
    op.textContent=t;
    turmaSel.appendChild(op);
  });
}

// ===============================
// ABRIR TURMA (FIREBASE)
// ===============================
function abrirTurma(){
  const ano=document.getElementById("ano").value;
  const turma=document.getElementById("turma").value;
  const chave="status_"+ano+turma;

  db.ref("turmas/"+chave).once("value").then(snap=>{
    let dados=snap.val();

    if(!dados){
      dados=disciplinasBase.map(d=>({
        ano,turma,disciplina:d,professor:"",ok:false
      }));
      db.ref("turmas/"+chave).set(dados);
    }

    renderTabela(dados,chave);
  });
}

function renderTabela(dados,chave){
  const tb=document.getElementById("tabela");
  tb.innerHTML="";

  dados.forEach((d,i)=>{
    const tr=document.createElement("tr");
    tr.className=d.ok?"ok":"pend";

    tr.innerHTML=`
      <td>${d.disciplina}</td>
      <td>${d.professor||"—"}</td>
      <td class="status" onclick="toggleStatus('${chave}',${i})">${d.ok?"OK":"PENDENTE"}</td>
      <td><button class="editBtn" onclick="editarProf('${chave}',${i})">Editar</button></td>
    `;
    tb.appendChild(tr);
  });
}

function toggleStatus(chave,i){
  const ref=db.ref("turmas/"+chave+"/"+i+"/ok");
  ref.once("value").then(snap=>{
    ref.set(!snap.val());
    abrirTurma();
  });
}

function editarProf(chave,i){
  const ref=db.ref("turmas/"+chave+"/"+i);
  ref.once("value").then(snap=>{
    const d=snap.val();
    const nome=prompt("Nome do professor:",d.professor||"");
    if(nome!==null){
      ref.update({professor:nome.trim()});
      abrirTurma();
    }
  });
}

// ===============================
// COPIAR
// ===============================
function copiarTexto(txt){
  navigator.clipboard.writeText(txt).then(()=>alert("Copiado 👍"));
}

function copiarResumoTurma(){
  const ano=document.getElementById("ano").value;
  const turma=document.getElementById("turma").value;
  const chave="status_"+ano+turma;

  db.ref("turmas/"+chave).once("value").then(snap=>{
    const dados=snap.val()||[];
    let txt=`Escola Estadual Militar Dom Pedro II\nTurma ${ano} ${turma}\n\n`;

    dados.forEach(d=>{
      txt+=`${d.disciplina} — ${d.professor||"(sem prof)"} — ${d.ok?"OK":"PENDENTE"}\n`;
    });

    copiarTexto(txt);
  });
}

function copiarPendenciasProfessor(){
  const prof=document.getElementById("profPendencias").value.trim();
  if(!prof){alert("Digite o nome");return}

  db.ref("turmas").once("value").then(snap=>{
    const turmas=snap.val()||{};
    let txt=`Pendências do professor ${prof}\n\n`;
    let achou=false;

    Object.values(turmas).forEach(lista=>{
      lista.forEach(d=>{
        if(d.professor===prof && !d.ok){
          txt+=`${d.ano} ${d.turma} — ${d.disciplina}\n`;
          achou=true;
        }
      });
    });

    if(!achou){alert("Nenhuma pendência");return}
    copiarTexto(txt);
  });
}

// ===============================
// IMAGEM
// ===============================
function baixarImagem(){
  html2canvas(document.getElementById("areaTurma")).then(canvas=>{
    const link=document.createElement("a");
    link.download="turma.png";
    link.href=canvas.toDataURL();
    link.click();
  });
}
function varreduraGeral() {
    db.ref("turmas").once("value").then(snap => {
        const todasTurmas = snap.val() || {};
        if (Object.keys(todasTurmas).length === 0) {
            alert("Nenhum dado encontrado no banco de dados.");
            return;
        }

        let relatorio = "📊 *QUADRO GERAL DE PROFESSORES 2026*\n";
        relatorio += "*Escola Estadual Militar Dom Pedro II*\n\n";

        // Ordenar as turmas para o relatório ficar bonito
        const chavesOrdenadas = Object.keys(todasTurmas).sort();

        chavesOrdenadas.forEach(chave => {
            // Limpa o nome da chave (ex: status_6ºA -> 6º A)
            const nomeExibicao = chave.replace("status_", "").replace(/(\d+º)([A-Z])/, "$1 $2");
            relatorio += `🔹 *TURMA: ${nomeExibicao}*\n`;

            todasTurmas[chave].forEach(d => {
                const prof = d.professor ? d.professor.trim() : "❌ NÃO LANÇADO";
                relatorio += `• ${d.disciplina}: ${prof}\n`;
            });
            relatorio += "\n";
        });

        relatorio += "⚠️ _Favor conferir se seu nome está correto na disciplina correspondente._";

        // Copia para a área de transferência
        navigator.clipboard.writeText(relatorio).then(() => {
            alert("Varredura concluída! Lista copiada para o WhatsApp.");
        }).catch(err => {
            console.error("Erro ao copiar: ", err);
            alert("Erro ao copiar. Verifique o console.");
        });
    });
}

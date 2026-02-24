// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDliIAcOCvgChv68cog27jenACkpF8MCyg",
  authDomain: "acompanhamento-pedagogico2026.firebaseapp.com",
  projectId: "acompanhamento-pedagogico2026",
  storageBucket: "acompanhamento-pedagogico2026.firebasestorage.app",
  messagingSenderId: "358848317719",
  appId: "1:358848317719:web:42feccdc979a1776cc8f52",
  measurementId: "G-N0Z5CZHEXK"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// TURMAS
const turmas = [
"6A","6B","6C","6D","6E",
"7A","7B","7C","7D","7E","7F"
];

const disciplinas = [
"Língua Portuguesa","Arte","Educação Física","Inglês",
"Matemática","Ciências","História","Geografia"
];

// POPULAR SELECT
const select = document.getElementById("turmaSelect");
turmas.forEach(t=>{
let op=document.createElement("option");
op.value=t;
op.text=t;
select.appendChild(op);
});

// ABRIR TURMA
function carregarTurma(){
const turma = select.value;

db.ref("pedagogico/"+turma).once("value",snap=>{
let dados = snap.val();

if(!dados){
dados = disciplinas.map(d=>({
disciplina:d,
professor:"",
planejamento:false,
pei:false
}));
db.ref("pedagogico/"+turma).set(dados);
}

renderTabela(turma,dados);
});
}

// RENDER
function renderTabela(turma,dados){

let html=`
<h2>Turma ${turma}</h2>
<p>Data: ${dataBR()} — Hora: ${horaAmazonas()}</p>

<table>
<tr>
<th>Disciplina</th>
<th>Professor</th>
<th>Planejamento</th>
<th>PEI</th>
</tr>
`;

dados.forEach((d,i)=>{

html+=`
<tr>
<td>${d.disciplina}</td>

<td class="professor" onclick="editarProfessor('${turma}',${i})">
${d.professor||"—"}
</td>

<td class="${d.planejamento?'ok':'pendente'}"
onclick="toggle('${turma}',${i},'planejamento')">
${d.planejamento?'OK':'Pendente'}
</td>

<td class="${d.pei?'ok':'pendente'}"
onclick="toggle('${turma}',${i},'pei')">
${d.pei?'OK':'Pendente'}
</td>

</tr>
`;
});

html+=`</table>`;

document.getElementById("areaTurma").innerHTML=html;
}

// EDITAR PROFESSOR
function editarProfessor(turma,i){
const nome=prompt("Nome do professor:");
if(nome==null) return;

db.ref("pedagogico/"+turma).once("value",snap=>{
let dados=snap.val();
dados[i].professor=nome;
db.ref("pedagogico/"+turma).set(dados);
renderTabela(turma,dados);
});
}

// TOGGLE STATUS
function toggle(turma,i,campo){
db.ref("pedagogico/"+turma).once("value",snap=>{
let dados=snap.val();
dados[i][campo]=!dados[i][campo];
db.ref("pedagogico/"+turma).set(dados);
renderTabela(turma,dados);
});
}

// DATA BR
function dataBR(){
const d=new Date();
return d.toLocaleDateString("pt-BR");
}

// HORA AMAZONAS
function horaAmazonas(){
return new Date().toLocaleTimeString("pt-BR",{timeZone:"America/Manaus"});
}

// COPIAR RESUMO TURMA
function copiarResumoTurma(){
const turma=select.value;

db.ref("pedagogico/"+turma).once("value",snap=>{
const dados=snap.val();
let txt=`📋 Acompanhamento Pedagógico\nTurma ${turma}\n\n`;

dados.forEach(d=>{
txt+=`${d.disciplina} — ${d.professor||"—"}\n`;
txt+=`Planejamento: ${d.planejamento?'OK':'PEND'} | PEI: ${d.pei?'OK':'PEND'}\n\n`;
});

navigator.clipboard.writeText(txt);
alert("Resumo copiado ✔");
});
}

// COPIAR PENDÊNCIAS PROFESSOR
function copiarPendenciasProfessor(){
const nome=document.getElementById("profPendencias").value.toLowerCase();
if(!nome) return alert("Digite o professor");

db.ref("pedagogico").once("value",snap=>{
const turmas=snap.val();

let txt=`📋 Pendências do Professor\n${nome.toUpperCase()}\n\n`;
let tem=false;

for(const t in turmas){
turmas[t].forEach(d=>{
if(d.professor && d.professor.toLowerCase().includes(nome)){
if(!d.planejamento || !d.pei){
txt+=`Turma ${t} — ${d.disciplina}\n`;
txt+=`Planejamento: ${d.planejamento?'OK':'PEND'} | PEI: ${d.pei?'OK':'PEND'}\n\n`;
tem=true;
}
}
});
}

if(!tem) txt+="Sem pendências ✔";

navigator.clipboard.writeText(txt);
alert("Pendências copiadas ✔");
});
}

// BAIXAR IMAGEM
function baixarImagem(){
html2canvas(document.getElementById("areaTurma")).then(canvas=>{
const img=canvas.toDataURL("image/png");
const w=window.open("");
w.document.write(`<img src="${img}">`);
});
}

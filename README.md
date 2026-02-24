# 🏫 Sistema de Acompanhamento Pedagógico - EEM Dom Pedro II

Este é um painel administrativo desenvolvido para facilitar o controle rotineiro de **Planejamentos Quinzenais** e **Lançamentos de PEI** (Plano de Ensino Individualizado). O sistema permite que a coordenação visualize rapidamente o status de cada disciplina e gere relatórios de pendências prontos para envio via WhatsApp.

---

## 🚀 Funcionalidades Principais

- **Gestão por Turma:** Abertura e visualização de turmas do 6º ao 9º ano.
- **Status Duplo:** Acompanhamento independente para Planejamento e PEI.
- **Relatório de Professor:** Filtro inteligente que lista todas as pendências de um professor específico em todas as turmas onde ele leciona.
- **Sistema de Backup:** Função para exportar e importar dados via arquivo JSON (garantindo que os dados não sejam perdidos ao limpar o navegador).
- **Exportação Visual:** Geração de imagem da tabela para compartilhamento rápido.

## 🛠️ Tecnologias Utilizadas

* **HTML5 / CSS3:** Estrutura e estilização com design responsivo.
* **JavaScript (Vanilla):** Lógica do sistema e persistência de dados.
* **LocalStorage:** Armazenamento de dados diretamente no navegador.
* **html2canvas:** Biblioteca para conversão da tabela em imagem.

## 📂 Organização do Repositório

O projeto está dividido para facilitar a manutenção:
- `index.html`: Estrutura principal do painel.
- `style.css`: Estilização e identidade visual da escola.
- `script.js`: Toda a inteligência e manipulação de dados.
- `brasao-escola.jpeg`: Logotipo oficial utilizado no cabeçalho.

## 📋 Como Usar

1. **Abrir Turma:** Selecione o ano e a letra da turma e clique em "Abrir".
2. **Editar Informações:** Clique no ícone de lápis (✏️) para definir o nome do professor e adicionar observações (ex: quantidade de alunos PEI).
3. **Marcar Status:** Clique nos botões de status (Plan. ou PEI) para alternar entre ✅ OK e ❌ Pendente.
4. **Relatório Individual:** Digite o nome do professor no campo superior e clique em "Copiar Pendências" para gerar um texto formatado para o WhatsApp.
5. **Segurança de Dados:** Ao final de cada período de lançamentos, utilize o botão **💾 Backup Geral** para salvar uma cópia de segurança no seu computador.

---
*Desenvolvido para uso administrativo na Escola Estadual Militar Dom Pedro II.*

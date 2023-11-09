// //CADASTRAR ALUNO========================================================================================
const btCadastrarAluno = document.querySelector("[data-cadastrar-aluno]");
btCadastrarAluno.addEventListener("click", cadastrarAluno);

function cadastrarAluno() {
  const nome_input = document.querySelector("[data-nome]");

  const nome = nome_input.value.trim();
  // Obtém o valor do input de nome usando .value e em seguida usa o método .trim() para remover
  // os espaços em branco no início e no final do valor, armazenando o resultado na variável nome.

  if (nome === "") {
    alert("Digite um nome válido para o aluno.");
    return;
  }
  // Verifica se o valor do nome está vazio (após a remoção dos espaços em branco).
  // Se estiver vazio, exibe um alerta ao usuário e interrompe a execução da função com return.

  const alunos = JSON.parse(localStorage.getItem("alunos")) || [];
  // Obtém os alunos do armazenamento local (localStorage). Se não houver alunos, cria um array vazio

  // Verifica se o nome do aluno já existe
  const nome_existente = alunos.some((aluno) => aluno.nome === nome);
  if (nome_existente) {
    alert("Esse nome de aluno já existe.");
    return;
  }
  // Se o nome do aluno já existir, exibe um alerta ao usuário e interrompe a execução da função.

  alunos.push({ nome, notas: { 1: "", 2: "", 3: "", 4: "" } });
  // Adiciona um novo objeto representando um aluno à lista de alunos.
  // O objeto inclui o nome do aluno e um objeto vazio para as notas dos quatro bimestres.

  localStorage.setItem("alunos", JSON.stringify(alunos));
  // Armazena a lista de alunos atualizada no armazenamento local (localStorage),
  // convertendo-a para uma string JSON usando JSON.stringify().

  nome_input.value = "";
  // Limpa o campo de entrada de nome, para que o usuário possa inserir um novo nome facilmente.

  atualizarListaAlunos();
  // Chama a função que atualiza a lista de alunos no elemento select do HTML.
}

//ATUALIZAR LISTA DE ALUNOS NO SELECT ==================================================================
function atualizarListaAlunos() {
  // Seleciona o elemento HTML do select de alunos usando o atributo data
  const alunos_select = document.querySelector("[data-aluno-select]");
  alunos_select.innerHTML = "";

  const opcao_inicial = document.createElement("option");
  opcao_inicial.value = "";
  opcao_inicial.textContent = "Selecione um aluno";
  alunos_select.append(opcao_inicial);

  // Obtém a lista de alunos do armazenamento local ou cria um array vazio se não houver
  const alunos_localStorage = JSON.parse(localStorage.getItem("alunos")) || [];

  // Adiciona as opções dos alunos ao select
  alunos_localStorage.forEach((aluno, index) => {
    const option = document.createElement("option");
    option.value = index; // Define o valor da opção como o índice do aluno no array
    option.textContent = aluno.nome; // Define o texto da opção como o nome do aluno
    alunos_select.appendChild(option); // Adiciona a opção ao select de alunos
  });
}

//REGISTRAR NOTA DO BIMESTRE DAQUELE ALUNO
const btRegistrarNota = document.querySelector("[data-registrar-nota]");
btRegistrarNota.addEventListener("click", registrarNota);

function registrarNota() {
  // Obtém o índice do aluno selecionado no select
  const alunoIndex = document.querySelector("[data-aluno-select]").value;

  // Obtém o elemento select do bimestre
  const bimestre_select = document.querySelector("[data-bimestre-select]");

  // Obtém o valor do bimestre selecionado
  const bimestre = bimestre_select.value;

  // Obtém o input da nota
  const nota_input = document.querySelector("[data-nota]");

  // Obtém o valor da nota como um número de ponto flutuante
  const nota = parseFloat(nota_input.value);

  // Verifica se a nota é válida (entre 0 e 10)
  if (isNaN(nota) || nota < 0 || nota > 10) {
    alert("Digite uma nota válida (entre 0 e 10).");
    return;
  }

  // Obtém a lista de alunos do armazenamento local ou inicializa como um array vazio
  const alunos = JSON.parse(localStorage.getItem("alunos")) || [];

  // Define a nota do bimestre selecionado para o aluno
  alunos[alunoIndex].notas[bimestre] = nota;

  // Salva as alterações de notas de volta no armazenamento local
  localStorage.setItem("alunos", JSON.stringify(alunos));

  // Chama as funções para atualizar a lista de notas e a lista de bimestres na interface
  atualizarListaNotas(alunoIndex);
  atualizarListaBimestres(alunoIndex);

  // Encontra o próximo bimestre não desabilitado no select
  const options = bimestre_select.options;
  console.log(options.length);
  let proximo_index = options.selectedIndex + 1;

  while (proximo_index < options.length && options[proximo_index].disabled) {
    proximo_index++;
  }

  // Define o próximo bimestre não desabilitado ou "Selecione um bimestre" no select
  if (proximo_index < options.length) {
    bimestre_select.selectedIndex = proximo_index;
  } else {
    bimestre_select.selectedIndex = 0; // "Selecione um bimestre"
  }

  // Esvazia o input de nota após cadastrar
  nota_input.value = "";
}

// ATUALIZAR LISTA DE NOTAS DO ALUNO
function atualizarListaNotas(alunoIndex) {
  // Seleciona o elemento <ul> que conterá a lista de notas
  const notas_lista = document.querySelector("[data-notas-lista]");
  notas_lista.innerHTML = ""; // Limpa o conteúdo atual da lista (do aluno anterior)

  // Obtém a lista de alunos do armazenamento local ou inicializa como um array vazio
  const alunos = JSON.parse(localStorage.getItem("alunos")) || [];

  const notas = alunos[alunoIndex].notas; // Seleciona as notas do aluno específico

  // Percorre cada bimestre nas notas do aluno
  for (let bimestre in notas) {
    const nota_bimestral = notas[bimestre]; // Seleciona nota por nota

    const li = document.createElement("li"); // Cria um elemento <li> para cada nota
    li.textContent = `Bimestre ${bimestre}: Nota ${nota_bimestral}`;

    const editarButton = document.createElement("img"); // Cria um botão de edição
    editarButton.src = "./pen-solid.svg";
    editarButton.addEventListener("click", () => {
      editarNota(alunoIndex, bimestre, nota_bimestral);
      // Adiciona um evento de clique que chama a função editarNota
    });

    li.appendChild(editarButton); // Adiciona o botão à <li>
    notas_lista.appendChild(li); // Adiciona a <li> à lista de notas
  }
}

//ATUALIZAR LISTA DE BIMESTRES HABILITADOS NO SELECT ==============================================
function atualizarListaBimestres(alunoIndex) {
  // Obtém a lista de alunos do armazenamento local ou cria um array vazio se não houver
  const alunos = JSON.parse(localStorage.getItem("alunos")) || [];

  // Obtém as notas do aluno específico com base no índice passado como argumento
  const notas = alunos[alunoIndex].notas;

  // Seleciona o elemento HTML do select de bimestres usando o atributo data
  const bimestre_select = document.querySelector("[data-bimestre-select]");

  // Habilita todas as opções do select de bimestres (remove o atributo 'disabled')

  //Busca as opções do select e a transforma de um objeto html em um array
  const opcoes = Array.from(bimestre_select.options);

  //Itera sobre a lista de opções
  opcoes.forEach((opcao) => {
    opcao.disabled = false;
  });

  // Itera sobre as notas do aluno para desabilitar as opções correspondentes no select
  for (let bimestre in notas) {
    if (notas[bimestre]) {
      // se o aluno já tem nota daquele bimestre registrada
      const opcao = bimestre_select.querySelector(
        `option[value="${bimestre}"]`
      );
      // Encontra a opção do select de bimestres que já foi preenchida

      if (opcao) {
        // desabilita todas as encontradas
        opcao.disabled = true; // Desabilita a opção que já tem notas
      }
    }
  }
}

function calcularMedia() {
  // Obtém o índice do aluno selecionado no select usando um atributo de data
  const alunoIndex = document.querySelector("[data-aluno-select]").value;

  // Obtém a lista de alunos do armazenamento local ou inicializa como um array vazio
  const alunos = JSON.parse(localStorage.getItem("alunos")) || [];
  const notas = alunos[alunoIndex].notas; // Seleciona as notas do aluno específico

  let totalNotas = 0;

  // Percorre cada bimestre nas notas do aluno
  for (let bimestre in notas) {
    const nota_bimestre = notas[bimestre]; // Seleciona a nota do bimestre atual
    console.log(nota_bimestre);
    // Verifica se há notas registradas para o bimestre atual
    if (nota_bimestre.length === 0) {
      // Se alguma nota estiver faltando, exibe uma mensagem e sai da função
      document.querySelector("[data-media-span]").textContent =
        "Notas incompletas";
      return;
    }

    // Calcula a soma total das notas e o número total de bimestres com notas
    totalNotas += nota_bimestre;
  }

  // Calcula a média das notas
  const media = totalNotas / 4;

  // Seleciona o elemento <span> onde a média será exibida
  const mediaSpan = document.querySelector("[data-media-span]");
  mediaSpan.textContent = media.toFixed(2); // Exibe a média com 2 casas decimais

  // Exibe se o aluno foi "Aprovado" ou "Reprovado" com base na média
  if (media >= 6) {
    mediaSpan.textContent += " - Aprovado";
  } else {
    mediaSpan.textContent += " - Reprovado";
  }
}

//EDITAR NOTA DE BIMESTRE JÁ CADASTRADA
function editarNota(alunoIndex, bimestre, notaAtual) {
  // Abre um diálogo de prompt para o usuário inserir a nova nota
  const novaNota = prompt(
    `Editar nota para o bimestre ${bimestre}:`,
    notaAtual
  );

  // Verifica se o usuário não cancelou o prompt
  if (novaNota !== null) {
    // Obtém a lista de alunos do armazenamento local ou inicializa como um array vazio
    const alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    // Atualiza a nota no índice especificado com a nova nota fornecida pelo usuário
    alunos[alunoIndex].notas[bimestre] = parseFloat(novaNota);

    // Salva as alterações de notas de volta no armazenamento local
    localStorage.setItem("alunos", JSON.stringify(alunos));

    // Chama a função para atualizar a lista de notas na interface
    atualizarListaNotas(alunoIndex);
  }
}

//SELECIONAR ALUNO NO SELECT
const alunos_select = document.querySelector("[data-aluno-select]");
alunos_select.addEventListener("change", selecionarAluno);

function selecionarAluno() {
  // Obtém o índice do aluno selecionado no select
  const aluno_index = document.querySelector("[data-aluno-select]").value;

  // Obtém o input de nota
  const nota_input = document.querySelector("[data-nota]");

  // Desabilita o input de nota quando nenhum bimestre estiver selecionado
  nota_input.disabled = true;

  const bimestre_select = document.querySelector("[data-bimestre-select]");
  bimestre_select.selectedIndex = 0;

  // Chama as funções para atualizar a lista de notas e a lista de bimestres na interface
  atualizarListaNotas(aluno_index);
  atualizarListaBimestres(aluno_index);
}

//SELECIONAR BIMESTRE NO SELECT
const bimestre_select = document.querySelector("[data-bimestre-select]");
bimestre_select.addEventListener("change", selecionarBimestre);

function selecionarBimestre() {
  // Obtém o elemento select de bimestres
  const bimestre_select = document.querySelector("[data-bimestre-select]");

  // Obtém o input de nota
  const nota_input = document.querySelector("[data-nota]");

  // Habilita o input de nota se um bimestre válido for selecionado
  if (bimestre_select.value !== "") {
    nota_input.disabled = false;
  } else {
    // Desabilita o input de nota se a opção "Selecione um bimestre" estiver selecionada
    nota_input.disabled = true;
  }
}

// Inicialização
atualizarListaAlunos();

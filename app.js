document.addEventListener('DOMContentLoaded', async () => {

    // Registra o Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            console.log('Service Worker registrado.');
        }).catch(err => {
            console.error('Falha no registro do Service Worker:', err);
        });
    }

    // Nomes dos arquivos dos 66 livros da Bíblia (em ordem)
    const nomesLivros = [
        "genesis.json", "exodo.json", "levitico.json", "numeros.json", "deuteronomio.json",
        "josue.json", "juizes.json", "rute.json", "1samuel.json", "2samuel.json",
        "1reis.json", "2reis.json", "1cronicas.json", "2cronicas.json", "esdras.json",
        "neemias.json", "ester.json", "jo.json", "salmos.json", "proverbios.json",
        "eclesiastes.json", "canticos.json", "isaias.json", "jeremias.json", "lamentacoes.json",
        "ezequiel.json", "daniel.json", "oseias.json", "joel.json", "amos.json",
        "obadias.json", "jonas.json", "miqueias.json", "naum.json", "habacuque.json",
        "sofonias.json", "ageu.json", "zacarias.json", "malaquias.json",
        "mateus.json", "marcos.json", "lucas.json", "joao.json", "atos.json",
        "romanos.json", "1corintios.json", "2corintios.json", "galatas.json",
        "efesios.json", "filipenses.json", "colossenses.json", "1tessalonicenses.json",
        "2tessalonicenses.json", "1timoteo.json", "2timoteo.json", "tito.json",
        "filemon.json", "hebreus.json", "tiago.json", "1pedro.json", "2pedro.json",
        "1joao.json", "2joao.json", "3joao.json", "judas.json", "apocalipse.json"
    ];

    // Elementos da interface
    const menuLivros = document.getElementById('menu-livros');
    const menuCapitulos = document.getElementById('menu-capitulos');
    const conteudoBiblia = document.getElementById('conteudo-biblia');
    const tituloLivro = document.getElementById('titulo-livro');
    const listaCapitulos = document.getElementById('lista-capitulos');
    const tituloLivroCapitulo = document.getElementById('titulo-livro-capitulo');
    const textoVersiculos = document.getElementById('texto-versiculos');
    const voltarLivrosBtn = document.getElementById('voltar-livros');
    const voltarCapitulosBtn = document.getElementById('voltar-capitulos');
    const seletorVersao = document.getElementById('seletor-versao');

    let dadosBiblia = [];

    // Função para carregar os dados da Bíblia
    async function carregarDadosBiblia(versao) {
        menuLivros.innerHTML = '<p>Carregando livros...</p>';
        try {
            const promises = nomesLivros.map(nome => {
                return fetch(`js/dados/${versao}/${nome}`).then(response => response.json());
            });

            dadosBiblia = await Promise.all(promises);
            exibirLivros();
        } catch (error) {
            console.error('Erro ao carregar os dados da Bíblia:', error);
            menuLivros.innerHTML = '<p>Erro ao carregar a Bíblia. Verifique se os arquivos estão na pasta correta.</p>';
        }
    }

    // Exibir os livros
    function exibirLivros() {
        menuCapitulos.classList.add('oculto');
        conteudoBiblia.classList.add('oculto');
        menuLivros.classList.remove('oculto');

        menuLivros.innerHTML = '';
        dadosBiblia.forEach(livro => {
            const button = document.createElement('button');
            button.textContent = livro.nome;
            button.addEventListener('click', () => exibirCapitulos(livro));
            menuLivros.appendChild(button);
        });
    }

    // Exibir os capítulos de um livro
    function exibirCapitulos(livro) {
        menuLivros.classList.add('oculto');
        conteudoBiblia.classList.add('oculto');
        menuCapitulos.classList.remove('oculto');

        tituloLivro.textContent = livro.nome;
        listaCapitulos.innerHTML = '';
        for (let i = 1; i <= livro.capitulos.length; i++) {
            const button = document.createElement('button');
            button.textContent = `Capítulo ${i}`;
            button.addEventListener('click', () => exibirConteudo(livro.nome, i, livro.capitulos[i - 1]));
            listaCapitulos.appendChild(button);
        }
    }

    // Exibir o conteúdo de um capítulo
    function exibirConteudo(nomeLivro, numCapitulo, versiculos) {
        menuCapitulos.classList.add('oculto');
        conteudoBiblia.classList.remove('oculto');

        tituloLivroCapitulo.textContent = `${nomeLivro}, Capítulo ${numCapitulo}`;
        textoVersiculos.innerHTML = '';
        versiculos.forEach((texto, index) => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${index + 1}</strong> ${texto}`;
            textoVersiculos.appendChild(p);
        });
    }

    // Eventos de voltar
    voltarLivrosBtn.addEventListener('click', exibirLivros);
    voltarCapitulosBtn.addEventListener('click', () => {
        const nomeLivroAtual = tituloLivro.textContent;
        const livroAtual = dadosBiblia.find(l => l.nome === nomeLivroAtual);
        if (livroAtual) {
            exibirCapitulos(livroAtual);
        } else {
            exibirLivros();
        }
    });

    // Evento de mudança do seletor de versão
    seletorVersao.addEventListener('change', (e) => {
        carregarDadosBiblia(e.target.value);
    });

    // Inicia o aplicativo com a versão padrão
    carregarDadosBiblia(seletorVersao.value);
});
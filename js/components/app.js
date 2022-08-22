const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    mensagemAlerta: 'Item Adicionado',
    alertaAtivo: false,
    carrinhoAtivo: false,
  },
  filters: {
    // atraves do | numeroPreco, aplica o retorno na varial
    numeroPreco(valor) {
      // transforma em moeda corrente
      return valor.toLocaleString("EU", { style: "currency", currency: "EUR" });
    }
  },
  computed: {
    //fica observando se tem algum produto no carrinho
    //se tiver, faz o loop pelos itens somando os precos
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach(item => {
          total += item.preco;
        })
      }
      return total;
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then(r => r.json())
        .then(r => {
          this.produtos = r;
        })
    },
    // faz o fecth dos produtos, selecionando através do ID
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then(r => r.json())
        .then(r => {
          this.produto = r;
        })
    },
    // abre o modal, com o ID selecionado através de @click="abrirModal(item.id)" e :key="item.id"
    abrirModal(id){
      this.fetchProduto(id)
      window.scrollTo({
        top:0,
        behavior: "smooth",
      })
    },
    // fecha o modal comparando o target do click
    fecharModal(event){
      console.log(event.target);
      console.log(event.currentTarget);
      if(event.target === event.currentTarget){
        this.produto = false;
      }
    },
    // fecha o modal do carrinho comparando o target do click (MODO DESCONSTRUIDO)
    clickForaCarrinho({target, currentTarget}){
      if(target === currentTarget){
        this.carrinhoAtivo = false;
      }
    },
    // Adiciona as informações do item selecionado ao carrinho
    adicionarItem(){
      this.produto.estoque--;
      //Descontroi as informações do produto para ocupar apenas uma variavel 
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
      //Executa a função alerta( mensagem ) ao adicionar item ao carrinho
      this.alerta(`${nome} foi adicionado ao carrinho`)
    },
    //Remove o item do carrinho com o metro splicae()
    //O método SPLICE(de que quantidade até que quantidade quer remover)
    removerItem(){
      this.carrinho.splice(0, 1)
    },
    // Verifica o localStorage se tem algo salvo, se tiver, trasnforma novamente em uma lista
    // com o JSON.parse(window.localStorage.carrinho);, e popula o carrinho
    checarLocalStorage(){
      if(window.localStorage.carrinho){
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    //Faz o filter por cada item e IF o item.id ja existir 
    compararEstoque(){
      //O .FILTER retorna UM LISTA com penas o que for TRUE
        //Verifica o ID de cada item
      const items = this.carrinho.filter(item => {
        console.log(item.id)
        //IF se o item do produto selecionado for igual ao id do produto dentro do carrinho, returna true;
        if(item.id === this.produto.id){
          return true;
        }
      })
      //Remove do estoque, fazendo produto.estoque - produtos dentro do carrinho(retornados com true)
      this.produto.estoque = this.produto.estoque - items.length;
    },
    //Exibe a msg de alerta por 1.5seg e retorna para false
    alerta(mensagem){
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() =>{
        this.alertaAtivo = false;
      }, 1500)
    },
    //Verifica o link do produto ex: http://localhost:3000/#smartwatch
    //Se existir faz o fetchProduto com o item passado na const HASH e remove o #
    router() {
      const hash = document.location.hash;
      if (hash)
        this.fetchProduto(hash.replace("#", ""));
    }
  },
  watch:{
    // Salva os dados dentro de carrinho no localStorage como STRING através do JSON.stringify(this.carrinho)
    carrinho(){
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    },
    //Fica assistindo o link ex: http://localhost:3000/#smartwatch
    //E guarda o ID do produto na const HASH
    produto() {
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`);
      //Se existir algum produto, execura o methods compararEstoque();
      if(this.produto){
        this.compararEstoque();
      }
    },
  },
  // faz o fetch do JSON produtos ao ser criado, antes do MOUNT
  created() {
    this.fetchProdutos();
    //Verifica se dados em cache no LocalStorage
    this.checarLocalStorage();
    //faz o fetchProduto antes do MOUNT
    this.router();
  }
})
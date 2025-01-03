export interface Alternativas {
    map(arg0: (alternativa: any, index: any) => import("react").JSX.Element): any;
    _id: string;
    alternativa: string;
    resultadoAlternativa: boolean;
  }
  
  export interface Exercicios {
    exercicioId: string;
    midia: {
      tipoDeMidia: string;
      url: string;
    };
    enunciado: string;
    exercicio: string;
    alternativas: Alternativas[];
    pontuacao: number;
  }
  
  export interface Atividades {
    [x: string]: any;
  
    nomdeDaAtividade: string;
    fotoDaAtividade: string;
    tipoDeAtividade: string;
    exercicios: Exercicios[];
    pontuacaoTotalAtividade: number;
  
  }
  
  export interface GrupoAtividades {
    [x: string]: any;
    grupoAtividades:
    {filter(arg0: (grupo: any) => boolean): unknown; 
    nomeGrupo: string;
    nivelDaAtividade: number;
    imagem: string,
    descricao: string,
    criador: {
      id: string;
      nome: string;
    };
    dominio: string[];
    atividades: Atividades[];
    pontuacaoTotalDoGrupo: number;}}
  
  export interface GruposDeAtividadesEmAndamento {
    _id: string;
    grupoAtividadesId: string;
    dataInicio: Date;
    pontuacaoPossivel: number;
    respostas: {
      exercicioId: string;
      atividade_id: string,
      isCorreta: boolean;
      pontuacao: number;
    }[];
  }
  
  export interface GruposDeAtividadesFinalizadas {
    grupoAtividadesId: string;
    dataInicio: Date;
    dataFinalizada: Date;
    respostasFinais: [];
    pontuacaoPossivel: number;
    pontuacaoFinal: number;
    porcentagem: number;
  }
  
  export interface Diagnostico {
    titulo: string;
    conteudo: string;
  }
  
  export interface Descricao {
    autor: string;
    nomeAutor: string;
    comentario: string;
  }
  
  export interface Profissional {
    idDoProfissional: string;
    nome: string;
  }
  
  export interface Pacientes {
    idDoPaciente: string;
    nome: string;
  }

  export interface ConquistaUsuario {
    _id: string,
    nome: string,
    imagem: string,
    descricao: string,
    condicao: number
  }
  
  export interface UsuarioGeral {
    user:{
      _id: string;
        tipoDeConta: string;
        conquistas: ConquistaUsuario[];
        validade: string;
        moeda: {
          valor: number,
          dataDeCriacao: Date
         };
         informacoes: {
          formacao: string,
          descricao: string,
      };
        nivel: number;
        nome: string;
        email: string;
        telefone: string;
        dataDeNascimento: string;
        senha: string;
        recuperarSenha: string;
        foto: string;
        profissional: Profissional[];
        diagnostico: Diagnostico[];
        grupo: string[];
        gruposDeAtividadesEmAndamento: GruposDeAtividadesEmAndamento[];
        gruposDeAtividadesFinalizadas: GruposDeAtividadesFinalizadas[];
        descricao: {
          autor: string;
          nomeAutor: string;
          comentario: string;
          dataCriacao: Date;
        };
        pacientes: Pacientes[];
        gruposDeAtividadesCriadas: GrupoAtividades[];
        pontuacoesPorGrupo: {
        grupoId: string;
        pontuacao: number;
        }[];
        recupararSenha: boolean;
        codigoRecuperarSenha: string;
        ativo: boolean;
        erros: {
          socializacao: [],
          cognicao: [],
          linguagem: [],
          autoCuidado: [],
          motor: [],
      },
    }
  }

  export interface UsuarioGeral2 {
    _id: string;
    tipoDeConta: string;
    conquistas: ConquistaUsuario[];
    validade: string;
    moeda: {
        valor: number;
        dataDeCriacao: Date;
    };
    nivel: number;
    nome: string;
    email: string;
    telefone: string;
    dataDeNascimento: string;
    senha: string;
    recuperarSenha: string;
    foto: string;
    profissional: Profissional[];
    diagnostico: Diagnostico[];
    grupo: string[];
    gruposDeAtividadesEmAndamento: GruposDeAtividadesEmAndamento[];
    gruposDeAtividadesFinalizadas: GruposDeAtividadesFinalizadas[];
    descricao: Descricao[];
    pacientes: Pacientes[];
    gruposDeAtividadesCriadas: GrupoAtividades[];
    pontuacoesPorGrupo: {
        grupoId: string;
        pontuacao: number;
    }[];
    recupararSenha: boolean;
    codigoRecuperarSenha: string;
}

export interface Alternativas {
    alternativa: string;
    resultadoAlternativa: boolean;
  }
  
  export interface Exercicios {
    exercicioId: string;
    midia: string;
    enunciado: string;
    exercicio: string;
    alternativas: Alternativas[];
    pontuacao: number;
  }
  
  export interface Atividades {
    fotoDaAtividade: string;
    tipoDeAtividade: string;
    exercicios: Exercicios[];
    pontuacaoTotalAtividade: number;
  }
  
  export interface GrupoAtividades {
    numeroAtividade: number;
    criador: {
      id: string;
      nome: string;
    };
    dominio: string[];
    atividades: Atividades[];
    pontuacaoTotalDoGrupo: number;
  }
  
  export interface GruposDeAtividadesEmAndamento {
    grupoAtividadesId: string;
    dataInicio: Date;
    respostas: {
      exercicioId: string;
      isCorreta: boolean;
    }[];
  }
  
  export interface GruposDeAtividadesFinalizadas {
    grupoAtividadesId: string;
    dataInicio: Date;
    dataFinalizada: Date;
    respostasFinais: number;
    pontuacaoFinal: number;
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
  
  export interface UsuarioGeral {
    user:{
        tipoDeConta: string;
        conquistas: any[];
        validade: string;
        moeda: number;
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
  }
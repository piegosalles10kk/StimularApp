

export interface UsuarioCadastro {
        email: string;
        nome: string;
        telefone: string;
        dataDeNascimento: string;
        senha: string;
        confirmarSenha: string;
        tipoDeConta: string;
         foto: string;
         profissional: profissional[];
         validade: string;
         moeda: {
          valor: number,
          dataDeCriacao: Date
         };
         nivel: number;
         conquistas?: ConquistaUsuario[];
         ativo: boolean; 
    
           
}

export interface ConquistaUsuario {
    nome: string,
    imagem: string,
    descricao: string,
    condicao: number
  }

export interface profissional{
    idDoProfissional: string;
    nome: string
}
const secoes = [
    {
      id: 1,
      titulo: 'Informe seu email:',
      entradaTexto:[
        {
          id: 1,
          label: 'Email',
          placeholder: 'Digite seu email'
        },
      ]
    },
    {
      id: 2,
      titulo: 'Informe seu nome e telefone:',
      entradaTexto:[
        {
            id: 1,
            label: 'Nome',
            placeholder: 'Digite seu nome'          
          },
          {
            id: 2,
            label: 'Telefone',
            placeholder: 'Informe seu telefone'
          },
                       
      ]
    },
    {
      id: 3,
      titulo: 'Informe sua data de nascimento',
      entradaTexto:[
        {
          id: 1,
          label: 'Data de nascimento',
          placeholder: 'Data de nascimento'
        }, 
                
      ],
    },

    {
      id: 4,
      titulo: 'Crie uma senha',
      entradaTexto:[
        {
            id: 1,
            label: 'Senha',
            placeholder: 'Digite sua senha'          
          },
          {
            id: 2,
            label: 'Confirmar senha',
            placeholder: 'Confirme sua senha'
          },
                
      ],
    },
    {
      id: 5,
      titulo: 'Agora vamos fazer um pequeno teste para te avaliar!'
    },
  ]

  export { secoes };
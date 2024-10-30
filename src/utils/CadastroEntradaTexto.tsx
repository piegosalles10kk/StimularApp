import { KeyboardTypeOptions } from 'react-native';

const secoes = [
    {
      id: 1,
      titulo: 'Informe seu email:',
      entradaTexto:[
        {
          id: 1,
          label: 'Email',
          placeholder: 'Digite seu email',
          name: 'email' 
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
            placeholder: 'Digite seu nome' ,
            name: 'nome'          
          },
          {
            id: 2,
            label: 'Telefone',
            placeholder: 'Informe seu telefone',
            keyboardType: 'phone-pad',
            name: 'telefone' 
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
          placeholder: 'Data de nascimento',
          keyboardType: 'numeric',
          name: 'dataDeNascimento', 
          type: 'data' 
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
            placeholder: 'Digite sua senha',
            secureTextEntry : true,
            name: 'senha'
                      
          },
          {
            id: 2,
            label: 'Confirmar senha',
            placeholder: 'Confirme sua senha',
            secureTextEntry : true,
            name: 'confirmarSenha'
          },
                
      ],
    },
    
  ]

  export { secoes };
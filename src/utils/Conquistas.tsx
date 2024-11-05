import { avatarPerfil1, avatarPerfil2, avatarPerfil3 } from "./Avatares";

const [ conquistas ] = [
    {
        id: 1,
        titulo: 'Primeira Atividade Concluída',
        descricao: 'Concluiu a primeira atividade!',
        imagem: {avatarPerfil1},
        condicao: 1
    },
    {
        id: 2,
        titulo: '10 Atividades Concluídas',
        descricao: 'Concluiu as primeiras 10 atividade!',
        imagem: {avatarPerfil2},
        condicao: 10
    },
    {
        id: 3,
        titulo: 'Acertou tudo!',
        descricao: 'Conseguiu 100% na atividade!',
        imagem: {avatarPerfil3},
        condicao: 100
    },

]

export { conquistas };
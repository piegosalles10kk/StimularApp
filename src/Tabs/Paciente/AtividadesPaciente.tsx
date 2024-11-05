import { ImagemLogo } from "../../componentes/ImagemLogo";
import { VStack, ScrollView, HStack, Box } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Titulo } from "../../componentes/Titulo";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Api
import { pegarDadosUsuario } from "../../servicos/PacienteServico";
import { pegarGruposAtividadesNivel } from "../../servicos/GrupoAtividadesServicos";
import { ConquistaUsuario, GrupoAtividades, UsuarioGeral, Atividades, Exercicios } from "../../interfaces/UsuarioGeral";


export default function AtividadesPaciente() {
    const listaCategorias = [
        { id: 1, nome: 'Física', icone: 'body' },
        { id: 2, nome: 'Linguística', icone: 'chatbubbles' },
        { id: 3, nome: 'Cognitiva', icone: 'extension-puzzle' },
        { id: 4, nome: 'Socioafetiva', icone: 'happy' }
    ];

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [dadosAtividades, setDadosAtividades ] = useState({} as GrupoAtividades);
    const [ listaAtividades, setListaAtividades ] = useState({} as Atividades);
        
    const [conquistasUsuario, setConquistasUsuarios] = useState({} as ConquistaUsuario) 
    const [carregado, setCarregando ] = useState(false);
    
    

    
    useEffect(() => {
        async function dadosUsuario(){            
        const usuarioID = await AsyncStorage.getItem('id');
        if(!usuarioID) {
            console.error('erro ao pegar o id do usario');
        };
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('erro ao pegar o token');
        }

        const resultado = await pegarDadosUsuario(usuarioID, token);
         

        if(resultado){
            setDadosUsuario(resultado);
            const resultadoAtividade = await pegarGruposAtividadesNivel(token, resultado.user.nivel);            
            //console.log(resultado.user.nivel);
            
            setDadosAtividades(resultadoAtividade);
            setConquistasUsuarios(resultado.user.conquistas);
            //console.log(resultadoAtividade.atividades[0]);

            setListaAtividades(resultadoAtividade.atividades[0]);
            //console.log(listaAtividades);
            
                                   
        }else{
            console.error("erro ao pegar os dados do usuario");           
        }
        setCarregando(true);
    }
    dadosUsuario();    
}, [])

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <VStack
                paddingTop={5}
                paddingBottom={5}
                width='100%' // Garante que o VStack ocupe toda a largura
                alignItems='center' // Centraliza na horizontal
                justifyContent='center'
            >
                <ImagemLogo
                    style={{
                        width: 200,
                        height: 150,
                    }}
                />

                <VStack 
                    backgroundColor='roxoClaro' 
                    borderWidth='2' 
                    borderRadius={10} 
                    width='90%' // Ajuste a largura para evitar corte
                    padding={3}
                >
                    <HStack
                        alignItems='center'
                        justifyContent='space-between' // Mantém os itens na mesma linha
                        space={2} // Pode ser ajustado
                        backgroundColor='roxoClaro'
                        borderRadius={20}
                        
                    >
                        <VStack flexDirection='row' alignItems='center' space={2} flexWrap='nowrap'>
                            {listaCategorias.map((categoria) => (
                                <Box
                                    key={categoria.id}
                                    borderWidth='1'
                                    borderColor='black'
                                    borderRadius={10}
                                    padding={2}
                                    backgroundColor='white'
                                    flexShrink={1} // Reduz o tamanho se necessário
                                    flexGrow={1} // Permite que cresça para ocupar espaço
                                    marginRight={2} // Adiciona espaço entre os itens
                                    maxWidth='120px' // Define uma largura máxima para cada item
                                >
                                    <HStack alignItems='center' flexDirection='column'>
                                        <Titulo fontSize='2xs' bold textAlign='center' >
                                            {categoria.nome}
                                        </Titulo>
                                        <Ionicons name={categoria.icone} size={24} />
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    </HStack>
                </VStack>

                <VStack>
                    

                </VStack>

            </VStack>
        </ScrollView>
    );
}

import { VStack, Avatar, ScrollView, Image, HStack } from "native-base";

import { useRoute } from '@react-navigation/native';

import { Titulo } from "../../../componentes/Titulo";
import { diagnosticos } from "../../../utils/Diagnosticos";

import { useEffect, useState } from "react";

import { GrupoAtividades, UsuarioGeral, Atividades, GruposDeAtividadesFinalizadas } from "../../../interfaces/UsuarioGeral";

// Api

import { pegarDadosUsuario } from "../../../servicos/PacienteServico";

import { pegarGruposAtividadesPorId } from "../../../servicos/GrupoAtividadesServicos";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CardAtividade from "../../../componentes/CardAtividade";

export default function GrupoAtividadesTela({ navigation }) {

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);

    const [dadosAtividades, setDadosAtividades] = useState({} as GrupoAtividades);

    const [ listaAtividades, setListaAtividades ] = useState({} as Atividades);

    const [carregado, setCarregando] = useState(false);

    interface RouteParams {

        id: string;

    }

    const route = useRoute();
    const renderizados = new Set();

    const id = (route.params as RouteParams).id;

    

    useEffect(() => {

        async function dadosUsuario() {

            const usuarioID = await AsyncStorage.getItem('id');

            if (!usuarioID) {

                console.error('erro ao pegar o id do usuario');

                return;

            }

            const token = await AsyncStorage.getItem('token');

            if (!token) {

                console.error('erro ao pegar o token');

                return;

            }    

            const resultado = await pegarDadosUsuario(usuarioID, token);

            if (resultado) {

                setDadosUsuario(resultado);

               

                const resultadoAtividade = await pegarGruposAtividadesPorId(id, token);

                //console.log('Atividades recebidas:', resultadoAtividade);

                setDadosAtividades(resultadoAtividade);

                setListaAtividades(resultadoAtividade.grupoAtividades.atividades);
                
                //console.log(listaAtividades[0].nomdeDaAtividade);
                

                setCarregando(true);

            } else {

                console.error("erro ao pegar os dados do usuario");

            }

        }

   

        dadosUsuario(); // Carrega os dados no início da montagem do componente

    }, []

    );

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <VStack alignItems='center' mb='15%' mt='-3%'>

            {carregado && (
                
                <VStack alignItems='center'>

                <VStack
                    maxHeight='30%' 
                    maxWidth='100%' 
                >

                <HStack
                    mb='5%'
                    alignItems='center'
                    justifyContent='space-between'
                    width='100%'
                    position='relative'
                    maxHeight='90%' 
                    maxWidth='100%' 
                    zIndex={1}>
                        {dadosAtividades.grupoAtividades.dominio.map((grupo, index) => {
                            const diagnostico = diagnosticos.find(d => d.nome?.trim() === grupo.trim());

                            if (diagnostico && !renderizados.has(diagnostico?.imagem)) {
                                renderizados.add(diagnostico?.imagem); 
                            return (
                                <Image
                                maxHeight='100%'
                                maxWidth='100%' 
                                marginBottom='-5%'
                                    key={index}
                                    style={{
                                        flex: 1,
                                        minWidth: 100, 
                                        aspectRatio: 1,
                                        resizeMode: 'cover',
                                        
                                    }}
                                    source={diagnostico?.imagem}
                                    alt={diagnostico?.nome}
                                />
                                );
                                }
                                return null;
                                })}
    
                    <Image
                        source={{ uri: dadosAtividades.grupoAtividades.imagem }}
                        style={{ width: 180, height: 180 }}
                        position='absolute'
                        top='50%'
                        left='26%'
                        alignSelf='center'
                        borderWidth='2'
                        borderColor='roxoClaro'
                    />
                </HStack>
                </VStack>
                    
                    
                    <VStack mt='17%'> 
                        <Titulo color='black'bold >{dadosAtividades.grupoAtividades.nomeGrupo}</Titulo>
                        <Titulo fontSize='md' color='black' mb='4%'>{`Recomendado para: (${dadosAtividades.grupoAtividades.dominio})`}</Titulo>
                        <Titulo fontSize='md' textAlign='start' padding='2%'>{dadosAtividades.grupoAtividades.descricao}</Titulo>  
                    </VStack>   
                    <Titulo mt='15%' bold color='black'>Exercicios</Titulo>

                {listaAtividades.map((atividade, index) => (
                <CardAtividade
                key={index}
                titulo={atividade.nomdeDaAtividade}
                descricao={atividade.tipoDeAtividade}
                avatarUri={atividade.fotoDaAtividade}
                onPress={() => { 
                    console.log('Atividade ID:', atividade._id);
                    navigation.navigate('ExercicioTela', { id: atividade._id });
                }}
                id={atividade._id}
            />
                ))}

                </VStack>
                
                

            )}
            
        </VStack>
        </ScrollView>

    );

}
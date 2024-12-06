import { VStack, Avatar, ScrollView, Image, HStack } from "native-base";

import { useRoute } from '@react-navigation/native';

import { Titulo } from "../../../componentes/Titulo";
import { diagnosticos } from "../../../utils/Diagnosticos";

import { useEffect, useState } from "react";

import { GrupoAtividades, UsuarioGeral, Atividades, GruposDeAtividadesFinalizadas } from "../../../interfaces/UsuarioGeral";

// Api

import { pegarDadosUsuario, updateMoeda } from "../../../servicos/UserServico";

import { pegarGruposAtividadesPorId, postarAtividadeEmAndamento } from "../../../servicos/GrupoAtividadesServicos";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CardAtividade from "../../../componentes/CardAtividade";
import { tokenMidia } from "../../../utils/token";
import { Botao } from "../../../componentes/Botao";
import ModalTemplate from "../../../componentes/Modal";

export default function GrupoAtividadesTela({ navigation }) {

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);

    const [dadosAtividades, setDadosAtividades] = useState({} as GrupoAtividades);

    const [ listaAtividades, setListaAtividades ] = useState({} as Atividades);

    const [carregado, setCarregando] = useState(false);

    const [botaoVisivel, setBotaoVisivel] = useState(false);

    const [modalVisible1, setModalVisible1] = useState(false);

    const [modalVisible2, setModalVisible2] = useState(false);

    interface RouteParams {

        id: string;

    }

    const route = useRoute();
    const renderizados = new Set();

    const id = (route.params as RouteParams).id;

    const handleOpenModal = () => {
        setModalVisible1(true);
    };

    const tornarBotaoVisivel = async () => {
        
        if (dadosUsuario.user.moeda.valor > 0) {
            await atualizarMoeda();


            setBotaoVisivel(true);
        } else {
            setModalVisible2(true)
        }
    };

    

    const atualizarMoeda = async () => {
        try {
            const usuarioID = await AsyncStorage.getItem('id');
            const token = await AsyncStorage.getItem('token');

            console.log(`UsuarioID: ${usuarioID}, Token: ${token}`);

            if (dadosUsuario.user.moeda.valor >= 1) {
                const resultado = await updateMoeda(usuarioID, token, { moeda: { valor: dadosUsuario.user.moeda.valor - 1 } });
                console.log('Moeda atualizada para:', dadosUsuario.user.moeda.valor - 1);
                const enviarAtividadeEmAndamento = await postarAtividadeEmAndamento(id, token);
                console.log('Atividade enviada:', enviarAtividadeEmAndamento);
                
            } else {
                setModalVisible2(true)
                
            }
        } catch (error) {
            console.error('Erro ao acessar AsyncStorage:', error);
        }
    };
        


    useEffect(() => {
        async function fetchDadosUsuario() {
            try {
                const usuarioID = await AsyncStorage.getItem('id');
                if (!usuarioID) {
                    console.error('Erro ao pegar o ID do usuário');
                    return;
                }
    
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    console.error('Erro ao pegar o token');
                    return;
                }
    
                const resultado = await pegarDadosUsuario(usuarioID, token);
                if (resultado) {
                    setDadosUsuario(resultado);
                   // console.log('Dados do usuário:', resultado);

                    const grupoAtividadeEmAndamento = resultado.user.gruposDeAtividadesEmAndamento[0];
                    if (grupoAtividadeEmAndamento && grupoAtividadeEmAndamento.grupoAtividadesId === id) {
                        setBotaoVisivel(true);
                    }
    
                    const resultadoAtividade = await pegarGruposAtividadesPorId(id, token);
                    if (resultadoAtividade) {
                        setDadosAtividades(resultadoAtividade);
                        setListaAtividades(resultadoAtividade.grupoAtividades.atividades || []);
                    }

                    setCarregando(true);
                }
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
            }
        }
    
        fetchDadosUsuario();
    }, []);
    
    function verificarSeJaFezAtividade(idGrupoDoUsuario) {
        const tempAtividadesUsuario = [];
    
        if (dadosUsuario.user.gruposDeAtividadesEmAndamento.length > 0) {
            const tempGrupo = dadosUsuario.user.gruposDeAtividadesEmAndamento[0];
    
            // Verifique se respostas existem e são um array
            if (tempGrupo.respostas && Array.isArray(tempGrupo.respostas)) {
                for (let i = 0; i < tempGrupo.respostas.length; i++) {
                    tempAtividadesUsuario.push(tempGrupo.respostas[i].atividade_id);
                }
            }
        }
    
        const verificacao = !tempAtividadesUsuario.includes(idGrupoDoUsuario);
        return verificacao;
    }
    
    
    

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
                        source={{ uri: `${dadosAtividades.grupoAtividades.imagem}${tokenMidia}` }}
                        alt="Tela"
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

                        
                        {!botaoVisivel &&(
                            <VStack alignItems='center'>
                                <Botao onPress={handleOpenModal} >Iniciar atividade</Botao>
                            <ModalTemplate
                            bodyText="Ao clicar em continuar voce irá iniciar a atividade. Tem certeza que deseja continuar?" 
                            confirmButtonText="Continuar"
                            onConfirm={tornarBotaoVisivel}
                            isVisible = {modalVisible1}
                            onClose={() => setModalVisible1(false)}
                                                 
                            />

                            <ModalTemplate
                            bodyText="Você já realizou suas atividades do dia, volte amanha para mais!"
                            confirmButtonText="Voltar"
                            isVisible = {modalVisible2}
                            onClose={() => setModalVisible2(false)}
                            />
                            </VStack>
                        )}

                        
                    </VStack>   
                    <Titulo mt='15%' bold color='black'>Exercicios</Titulo>

                    {listaAtividades.map((atividade, index) => (
                        <VStack>                

                <CardAtividade
                    key={atividade._id}
                    titulo={atividade.nomdeDaAtividade}
                    descricao={atividade.tipoDeAtividade}
                    avatarUri={atividade.fotoDaAtividade}
                    onPress={() => {
                        console.log('Atividade ID:', atividade._id);
                        navigation.navigate('ExercicioTela', { atividadeId: atividade._id, idGrupoAtividades: id });
                    }}
                    id={atividade._id}
                    buttonVisible={ botaoVisivel && verificarSeJaFezAtividade(atividade._id) ? true : false}
                />
                </VStack>
            ))}

                </VStack>
                
                

            )}
            
        </VStack>
        </ScrollView>

    );

}
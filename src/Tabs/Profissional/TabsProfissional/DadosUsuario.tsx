import React, { useEffect, useState } from 'react';
import { VStack, Image, HStack, ScrollView, Avatar, Button } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { UsuarioGeral } from '../../../interfaces/UsuarioGeral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atualizarPaciente, pegarDadosUsuario } from '../../../servicos/UserServico';
import { Titulo } from '../../../componentes/Titulo';
import { tokenMidia } from '../../../utils/token';
import Graficos from '../../../componentes/Graficos';
import { Botao } from '../../../componentes/Botao';
import { Linking } from 'react-native';
import { ImagemLogo } from '../../../componentes/ImagemLogo';
import EditableModal from '../../../componentes/BotaoModal';

export default function DadosUsuario( {navigation}) {
    const route = useRoute();  
    const { id } = route.params; 

    const [ dadosUsuario, setDadosUsuario ] = useState({} as UsuarioGeral);
    const [ carregado, setCarregando ] = useState(false);
    const [ carregadoGrafico, setCarregandoGrafico ] = useState(false);
    const [dataFinalizadas, setDataFinalizadas] = useState([] as any);
    const [pontuacoesFinais, setPontuacoesFinais] = useState([] as any);
    const [qtdGraficos, setQtdGraficos] = useState(7);
    const [showModal, setShowModal] = useState(false);

    function valorGrafico(qtd: number) {
        setQtdGraficos(qtd);
    }
        
    const mudarGrupo = async () => {
        console.log("apagou o grupo");
    
        try {
            const token = await AsyncStorage.getItem('token'); // Espera pelo token de forma correta
    
            if (!token) {
                throw new Error('Token não encontrado');
            }
    
            const dadosEnviados = {
                grupo: [],
                erros: {
                    socializacao: [],
                    cognicao: [],
                    linguagem: [],
                    autoCuidado: [],
                    motor: [],
                },
                nivel: ''
            };
    
            console.log("Dados Enviados: ", dadosEnviados);
            console.log("Token: ", token);
            console.log("ID: ", id);
            
    
            const atualizar = await atualizarPaciente(dadosEnviados, id, token);
    
            if (atualizar) {
                console.log("Atualização bem-sucedida: ", atualizar);
                navigation.navigate('Login');
            } else {
                alert("Erro ao atualizar");
                console.log("Erro na atualização: ", atualizar);
            }
        } catch (error) {
            console.error("Erro ao mudar grupo: ", error);
            alert("Ocorreu um erro ao mudar o grupo.");
        }
    };
    

    function handleCancel() {
        setShowModal(false);
    }


    useEffect(() => {
        async function dadosUsuario() {
            const token = await AsyncStorage.getItem('token');
    
            if (!token) {
                console.error('Erro ao pegar o token');
                return;
            }
    
            const resultado = await pegarDadosUsuario(id, token);
            setDadosUsuario(resultado);            
        }
    
        dadosUsuario(); // Apenas chama dadosUsuario
        setCarregando(true);
    }, []);
    
    useEffect(() => {
        const dadosGraficos = async () => {
            if (!dadosUsuario) {
                console.warn("dadosUsuario ainda não está carregado");
                return; // Não prossegue se dadosUsuario não foi definido
            }
    
            let gruposDeAtividadesFinalizadas = dadosUsuario.user.gruposDeAtividadesFinalizadas || [];
            
            //console.log(gruposDeAtividadesFinalizadas); // Verifica os dados carregados
    
            const processarAtividades = (grupos) => {
                const dataFinalizadasTemp = grupos.map(atividade => atividade.dataFinalizada); // Obtemos as datas das atividades
                const pontuacoesPorTipo = {
                    socializacao: [],
                    cognicao: [],
                    linguagem: [],
                    autoCuidado: [],
                    motor: []
                };
    
                grupos.forEach(atividade => {
                    atividade.respostasFinais.forEach(resposta => {
                        if(resposta.tipoAtividade && pontuacoesPorTipo[resposta.tipoAtividade] !== undefined) {
                            pontuacoesPorTipo[resposta.tipoAtividade].push(resposta.porcentagem);
                        }
                    });
                });
    
                const pontuacoesFinaisTemp = [
                    pontuacoesPorTipo.socializacao,
                    pontuacoesPorTipo.cognicao,
                    pontuacoesPorTipo.linguagem,
                    pontuacoesPorTipo.autoCuidado,
                    pontuacoesPorTipo.motor
                ];
                console.log(pontuacoesPorTipo); // Adicione essa linha para o debug
    
                setDataFinalizadas(dataFinalizadasTemp);
                setPontuacoesFinais(pontuacoesFinaisTemp);
                setCarregandoGrafico(dataFinalizadasTemp.length > 0 && pontuacoesFinaisTemp.some(arr => arr.length > 0)); // Usa some para garantir que haja dados
            }
    
            // Apenas processa se gruposDeAtividadesFinalizadas não estiver vazio
            if (gruposDeAtividadesFinalizadas.length > 0) {
                processarAtividades(gruposDeAtividadesFinalizadas);
            } else {
                console.warn("Nenhuma atividade finalizada encontrada.");
            }
        };
    
        dadosGraficos(); // Chama a função gráficos, após dadosUusario estar definido.
    }, [dadosUsuario]); // Dependência para executar gráficos após dadosUsuario ter sido definido
    

    return (

        <ScrollView w={'100%'}>
        <VStack flex={1}>
            <ImagemLogo
                            style={{
                                marginTop: '5%',
                                width: 200,
                                height: 150,
                            }}
                        />


        {carregado && (
        <VStack>
                <VStack alignItems='center'>

                    {carregadoGrafico === false && (
                                        <VStack borderWidth={2} borderRadius={10} w='93%' alignItems='center'>
                                            <ImagemLogo 
                                            
                                            />
                                            <VStack flex={1}>
                                                <Titulo fontSize='xl' mt='5%' mb='5%' bold color='black'>{dadosUsuario?.user?.nome?.split(' ')[0]} ainda não fez uma atividade!</Titulo>
                                                <Titulo fontSize='md' color='black'>O gráfico será exibido após a conclusão da primeira atividade!</Titulo>
                                                <VStack flexDirection='row' padding='4%' alignSelf='center' w='90%'>
                                                </VStack>
                                            </VStack>
                                        </VStack>
                                    )}
                {carregadoGrafico && (
                    <VStack width='90%' mt='5%' alignItems='center'>
                        <VStack paddingTop={2} paddingBottom={2} backgroundColor='roxoClaro' width='100%' alignItems='center' justifyContent='center' borderWidth='2'>
                            <Titulo fontSize='xl' bold color='black'>Como {dadosUsuario?.user?.nome?.split(' ')[0]} está indo</Titulo>
                        </VStack>
                        <VStack width='100%' alignItems='center' justifyContent='center' borderWidth='2' mt='3%' padding={4} bg='roxoClaro'>
                            <Titulo fontSize='sm' bold color='white' alignSelf='flex-start'>Últimas {qtdGraficos} atividades</Titulo>
                        <Graficos labels={dataFinalizadas} dataSets={pontuacoesFinais} quantidade={qtdGraficos} />
                        </VStack>
                            <HStack space={4} w='100%'>
                                <Botao w='31%' mt='5%'  onPress={() => valorGrafico(7)}>+7</Botao>
                                <Botao w='31%' mt='5%' onPress={() => valorGrafico(15)}>+15</Botao>
                                <Botao w='31%' mt='5%' onPress={() => valorGrafico(30)}>+30</Botao>
                            </HStack>
                            <Titulo textAlign='left' fontSize='sm' color='black' mt='3%' >No gráfico acima, vemos como {dadosUsuario?.user?.nome?.split(' ')[0]} se comportou nas últimas {qtdGraficos} atividades.</Titulo>


                    </VStack>   
                )}
    <EditableModal
                    botao="Solicitar nova avaliação"
                    bodyText="Ao clicar em 'SIM', será realizada uma nova avaliação inicial para o paciente. Deseja continuar?"
                    confirmButtonText="Sim"
                    cancelButtonText="Não"
                    onConfirm={mudarGrupo}
                    onCancel={handleCancel}
                /> 
                
                <VStack mb='10%' borderWidth={2} mt={'5%'} w='90%' bg={'yellow.100'} shadow={3}>
                <Titulo mt='10%' textAlign='left'  alignSelf='flex-start' ml='5%' bold color='black'>Detalhes do caso</Titulo>
                
                <Titulo mt='4%' textAlign='left' alignSelf='flex-start' fontSize='md' ml='5%' color='black'>Nome: {dadosUsuario?.user?.nome}</Titulo>
                <Titulo mt='2%' textAlign='left' alignSelf='flex-start' fontSize='md' ml='5%' color='black'>Data de nascimento: {dadosUsuario?.user?.dataDeNascimento}</Titulo>
                <Titulo mt='2%' textAlign='left' alignSelf='flex-start' fontSize='md' ml='5%' color='black'>Diagnóstico gerado: {dadosUsuario?.user?.grupo} com atraso de {dadosUsuario?.user?.nivel} ano(s)</Titulo>
                
                <VStack borderTopWidth={1} mt={'5%'} w={'90%'}>
                <Titulo mt='5%' textAlign='left' alignSelf='flex-start' fontSize='lg' ml='5%' color='black' bold>Marcos de referencia:</Titulo>
                
                <Titulo mt='4%' textAlign='left' alignSelf='flex-start'  fontSize='md' ml='5%' color='black'>Socialização:</Titulo>
                <Titulo mt='2%' textAlign='left' alignSelf='flex-start' bold fontSize='md' ml='5%' color='black'>{dadosUsuario?.user?.erros?.socializacao.join(' | ')}</Titulo>

                <Titulo mt='4%' textAlign='left' alignSelf='flex-start'  fontSize='md' ml='5%' color='black'>Cognição:</Titulo>
                <Titulo mt='2%' textAlign='left' alignSelf='flex-start' bold fontSize='md' ml='5%' color='black'>{dadosUsuario?.user?.erros?.cognicao.join(' | ')}</Titulo>

                <Titulo mt='4%' textAlign='left' alignSelf='flex-start'  fontSize='md' ml='5%' color='black'>Linguagem:</Titulo>
                <Titulo mt='2%' textAlign='left' alignSelf='flex-start' bold fontSize='md' ml='5%' color='black'>{dadosUsuario?.user?.erros?.linguagem.join(' | ')}</Titulo>

                <Titulo mt='4%' textAlign='left' alignSelf='flex-start'  fontSize='md' ml='5%' color='black'>Auto-Cuidado:</Titulo>
                <Titulo mt='2%' textAlign='left' alignSelf='flex-start' bold fontSize='md' ml='5%' color='black'>{dadosUsuario?.user?.erros?.autoCuidado.join(' | ')}</Titulo>

                <Titulo mt='4%' textAlign='left' alignSelf='flex-start' fontSize='md' ml='5%' color='black'>Motor:</Titulo>
                <Titulo mt='2%' textAlign='left' alignSelf='flex-start' fontSize='md' ml='5%' color='black'  bold>{dadosUsuario?.user?.erros?.motor.join(' | ')}</Titulo>

                <VStack alignItems='center' ml={'10%'}>
                <EditableModal
                    botao="Solicitar nova avaliação"
                    bodyText="Ao clicar em 'SIM', será realizada uma nova avaliação inicial para o paciente. Deseja continuar?"
                    confirmButtonText="Sim"
                    cancelButtonText="Não"
                    onConfirm={mudarGrupo}
                    onCancel={handleCancel}
                /> 
                </VStack>               
                
                </VStack>

                </VStack>
                <VStack flexDir={'row'} alignItems={'center'} alignSelf={'center'} borderWidth={2} borderRadius={10} padding={4} mb={'10%'}>
                    <Titulo bold color='black' mr='25%'>Contato</Titulo>
                    
                    <Button
                    alignSelf="center"
                    leftIcon={<Icon name="whatsapp" size={24} color="white" />}
                    style={{ width: 50, height: 50, marginLeft: '20%'  }}
                    mr={3}
                    bg="roxoClaro"
                    borderRadius={15}
                    _pressed={{ bg: 'rosaEscuro' }}
                    onPress={() => Linking.openURL(`https://wa.me/+55${dadosUsuario?.user?.telefone}`)}
                    
                />
                
                </VStack>
                
                </VStack>

                
                   
                    
     

        </VStack>

        
        )}
        </VStack>
        </ScrollView>
    );
}

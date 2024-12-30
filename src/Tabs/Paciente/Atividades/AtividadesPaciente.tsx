import { VStack, ScrollView, HStack } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Titulo } from "../../../componentes/Titulo";
import { useEffect, useState } from "react";
import { Alert, Linking, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UsuarioGeral } from "../../../interfaces/UsuarioGeral";
import AtividadeCard from "../../../componentes/GrupoAtividadeCard";
import Graficos from "../../../componentes/Graficos";

// Api
import { pegarDadosUsuario, updateMoeda } from "../../../servicos/UserServico";
import { pegarGruposAtividadesAuto, postarAtividadeEmAndamento } from "../../../servicos/GrupoAtividadesServicos";
import ModalTemplate from "../../../componentes/Modal";
import { Botao } from "../../../componentes/Botao";
import { tokenMidia } from "../../../utils/token";

export default function AtividadesPaciente({ navigation }) {
    const listaCategorias = [
        { id: 1, nome: 'Física', icone: 'body', busca: 'Fisica' },
        { id: 2, nome: 'Linguística', icone: 'chatbubbles', busca: 'Linguistica' },
        { id: 3, nome: 'Cognitiva', icone: 'extension-puzzle', busca: 'Cognitiva' },
        { id: 4, nome: 'Socioafetiva', icone: 'happy', busca: 'Socioafetiva' },
    ];

    const [dataFinalizadas, setDataFinalizadas] = useState([] as any);
    const [pontuacoesFinais, setPontuacoesFinais] = useState([] as any);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [dadosAtividades, setDadosAtividades] = useState<any>(null); // Inicia como null
    const [listaAtividades, setListaAtividades] = useState<any>(null); // Inicia como null
    const [carregadoGrafico, setCarregandoGrafico] = useState(false);
    const [carregado, setCarregando] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [atividadeId, setAtividadeId] = useState('');

    const tornarBotaoVisivel = async () => {
        const grupoAtividadesId = dadosAtividades?.atividades[0]?._id; // Usar o operador de encadeamento opcional

        if (dadosUsuario.user.moeda.valor > 0) {
            await atualizarMoeda();
            navigation.navigate('ExercicioTela', { atividadeId: atividadeId, idGrupoAtividades: grupoAtividadesId });
        } else {
            setModalVisible2(true);
        }
    };

    const atualizarMoeda = async () => {
        try {
            const usuarioID = await AsyncStorage.getItem('id');
            const token = await AsyncStorage.getItem('token');

            if (dadosUsuario.user.moeda.valor >= 1) {
                await updateMoeda(usuarioID, token, { moeda: { valor: dadosUsuario.user.moeda.valor - 1 } });
                await postarAtividadeEmAndamento(dadosAtividades?.atividades[0]._id, token);
            } else {
                setModalVisible2(true);
            }
        } catch (error) {
            console.error('Erro ao acessar AsyncStorage:', error);
        }
    };

const atualizarDadosAtividades = async () => {
    const [usuarioID, token] = await Promise.all([AsyncStorage.getItem('id'),AsyncStorage.getItem('token')]);
    if (!usuarioID || !token) {
        console.error('Erro ao obter dados do usuário ou token');
        return;
    }

    try {
        const resultadoAtividade = await pegarGruposAtividadesAuto(token);
        setDadosAtividades(resultadoAtividade.gruposAtividades[0]);
        setListaAtividades(resultadoAtividade.gruposAtividades[0].atividades || []);

        if (!dadosUsuario.user) {
            console.error('Erro ao obter dados do usuário');
            return;
        }

        let gruposDeAtividadesFinalizadas = dadosUsuario.user.gruposDeAtividadesFinalizadas || [];

        while (gruposDeAtividadesFinalizadas === undefined) {
            gruposDeAtividadesFinalizadas = dadosUsuario.user.gruposDeAtividadesFinalizadas || [];
            console.log(gruposDeAtividadesFinalizadas);
        }



        const processarAtividades = (gruposDeAtividadesFinalizadas) => {
            const dataFinalizadasTemp = gruposDeAtividadesFinalizadas.map(atividade => atividade.dataFinalizada);
        
            const pontuacoesPorTipo = {
                socializacao: [],
                cognicao: [],
                linguagem: [],
                autoCuidado: [],
                motor: []
            };
        
            gruposDeAtividadesFinalizadas.forEach(atividade => {
                atividade.respostasFinais.forEach(resposta => {
                    // Adiciona a pontuação ao array correspondente ao tipo de atividade
                    pontuacoesPorTipo[resposta.tipoAtividade].push(resposta.porcentagem);
                });
            });
        
            const pontuacoesFinaisTemp = [
                pontuacoesPorTipo.socializacao,
                pontuacoesPorTipo.cognicao,
                pontuacoesPorTipo.linguagem,
                pontuacoesPorTipo.autoCuidado,
                pontuacoesPorTipo.motor
            ];
        
            //console.log(pontuacoesPorTipo); // Adicione essa linha para o debug
        
            setDataFinalizadas(dataFinalizadasTemp);
            setPontuacoesFinais(pontuacoesFinaisTemp);
            setCarregandoGrafico(dataFinalizadasTemp.length > 0 && pontuacoesFinaisTemp.length > 0);
        };
        
        
        // Exemplo de como chamar a função
        processarAtividades(gruposDeAtividadesFinalizadas);
        
        
    } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        if (error.response && error.response.status === 404) {
            Alert.alert("Erro ao buscar atividades", "Atividades não encontradas. Por favor, tente novamente mais tarde.");
        }
    } finally {
        setCarregando(true);
    }
};

for (let i = 0; i < 2; i++) {
    atualizarDadosAtividades()
}

    useEffect(() => {
        async function fetchDadosUsuario() {
            const usuarioID = await AsyncStorage.getItem('id');
            const token = await AsyncStorage.getItem('token');

            if (!usuarioID || !token) {
                console.error('Erro ao obter ID ou token do usuário');
                return;
            }

            const resultado = await pegarDadosUsuario(usuarioID, token);
            setDadosUsuario(resultado);
            atualizarDadosAtividades();
        }
        fetchDadosUsuario();
    }, []);

    const handleOpenModal = (atividadeIdParam: string) => {
        setAtividadeId(atividadeIdParam);
        const grupoAtividadesId = dadosAtividades?._id;

        if (dadosUsuario.user.gruposDeAtividadesEmAndamento.length > 0) {
            const atividadeEmAndamento = dadosUsuario.user.gruposDeAtividadesEmAndamento[0];

            if (atividadeEmAndamento.grupoAtividadesId === grupoAtividadesId) {
                navigation.navigate('ExercicioTela', { atividadeId: atividadeIdParam, idGrupoAtividades: grupoAtividadesId });
            } else {
                setModalVisible1(true);
            }
        } else {
            console.warn('Nenhuma atividade em andamento encontrada.');
            setModalVisible1(true);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
            <VStack paddingTop={5} paddingBottom={5} width='100%' alignItems='center' justifyContent='center'>

            <Titulo bold color='black' mt='8%' mb='5%'>Atividades de {dadosUsuario?.user?.nome?.split(' ')[0]}</Titulo>

            {carregadoGrafico === false && (
                    <VStack borderWidth={2} borderRadius={10} w='93%' alignItems='center'>
                        <VStack flex={1}>
                            <Titulo fontSize='xl' mt='5%' mb='5%' bold color='black'>Estamos te esperando!</Titulo>
                            <Titulo fontSize='md' color='black'>Seu gráfico será exibido após a conclusão de sua primeira atividade!</Titulo>
                            <Titulo mt='4%' mb='5%' fontSize='lg' bold color='black'>Enquanto isso, que tal nos acompanhar em nosso Instagram!</Titulo>
                            <VStack flexDirection='row' padding='4%' alignSelf='center' w='90%'>
                                <Ionicons
                                    name={'logo-instagram'}
                                    size={50}
                                    color={'black'}
                                    onPress={() => Linking.openURL('https://www.instagram.com/stimular.multidisciplinar')}
                                />
                            </VStack>
                        </VStack>
                    </VStack>
                )}
                
                {carregadoGrafico && (
                    <VStack width='90%' mt='5%' alignItems='center'>
                        <VStack paddingTop={2} paddingBottom={2} backgroundColor='roxoClaro' width='100%' alignItems='center' justifyContent='center' borderWidth='2'>
                            <Titulo fontSize='xl' bold color='black'>Como estou indo</Titulo>
                        </VStack>
                        <VStack width='100%' alignItems='center' justifyContent='center' borderWidth='2' mt='3%' padding={4} bg='roxoClaro'>
                        <Graficos labels={dataFinalizadas} dataSets={pontuacoesFinais} quantidade={7} />
                        </VStack>
                    </VStack>
                )}
                    <Titulo alignSelf='flex-start' fontSize='md' ml='5%' mt='2%'textAlign='left' color='black'>O grafico acima demonstra a evolução do usuário com relação aos seus resultados recentes.</Titulo>
                    
                    <Titulo textAlign='left' mt='5%' bold color='black'>Precisa de ajuda?</Titulo>

                    <Botao mt='5%'>Consulte nossa lista de profissionais</Botao>
                    
                <VStack width='100%' mt='5%'>
                    {carregado && (
                        <VStack>
                            <ModalTemplate
                                bodyText="Ao clicar em continuar você irá iniciar a atividade. Tem certeza que deseja continuar?"
                                confirmButtonText="Continuar"
                                onConfirm={tornarBotaoVisivel}
                                isVisible={modalVisible1}
                                onClose={() => setModalVisible1(false)}
                            />
                            <ModalTemplate
                                bodyText="Você já realizou suas atividades do dia, volte amanhã para mais!"
                                confirmButtonText="Voltar"
                                isVisible={modalVisible2}
                                onClose={() => setModalVisible2(false)}
                            />
                            <AtividadeCard
                                dadosAtividades={dadosAtividades}
                                listaAtividades={listaAtividades}
                                titulo='Próxima atividade'
                                onPressAtividade={() => {
                                    const grupoAtividadesId = dadosAtividades?._id;
                                    navigation.navigate('GrupoAtividadesTela', { id: grupoAtividadesId });
                                }}
                                onPressExercicio={(atividadeId) => handleOpenModal(atividadeId)}
                            />
                        </VStack>
                    )}
                </VStack>

                {carregado === false && (
                    <VStack borderWidth={0} borderRadius={10} w='93%' alignItems='center'>
                        <VStack flex={1}>
                            <Titulo fontSize='xl' mt='5%' mb='5%' bold color='black'>Aguenta ai</Titulo>
                            <Titulo fontSize='md' color='black'>Em breve teremos novas atividades! Até lá, que tal ficar de olho em nossas redes sociais?</Titulo>
                            <Titulo mt='4%' mb='5%' fontSize='lg' bold color='black'>Nos acompanhe em nosso Instagram!</Titulo>
                            <VStack flexDirection='row' padding='4%' alignSelf='center' w='90%'>
                                <Ionicons
                                    name={'logo-instagram'}
                                    size={50}
                                    color={'black'}
                                    onPress={() => Linking.openURL('https://www.instagram.com/stimular.multidisciplinar')}
                                />
                            </VStack>
                        </VStack>
                    </VStack>
                )}

<Titulo textAlign='left' mt='5%' bold color='black' mb='5%'>Como funciona?</Titulo>
<Titulo textAlign='left'  color='black'  fontSize='md' padding='3%'>A Terapia ABA é um método individualizado que se adapta às necessidades do paciente. Seguindo:</Titulo>

                    

                    <VStack borderWidth={2} borderRadius={10} w='80%' mb='5' bg='white'>
                            <Titulo fontSize='md' padding='2%' bold color='black'>Plano personalizado:</Titulo>
                            <Titulo alignSelf='flex-start' fontSize='sm' ml='5%'textAlign='left' color='black' mb='3%' >É realizada uma avaliação dos marcos do desenvolvimento para elaboração de um plano de ensino individualizado com base em seus pontos fortes, desafios e objetivos.</Titulo>
                    </VStack>
                    <VStack borderWidth={2} borderRadius={10} w='80%' mb='5' bg='white'>
                            <Titulo fontSize='md' padding='2%' bold color='black'>Aprendizagem:</Titulo>
                            <Titulo alignSelf='flex-start' fontSize='sm' ml='5%'textAlign='left' color='black' mb='3%' >Habilidades importantes como comunicação, habilidades de autoregulação, interação social e comportamento adequado são ensinadas e treinadas.</Titulo>
                    </VStack>
                    <VStack borderWidth={2} borderRadius={10} w='80%' mb='5'bg='white'>
                            <Titulo fontSize='md' padding='2%' bold color='black'>Acompanhamento:</Titulo>
                            <Titulo alignSelf='flex-start' fontSize='sm' ml='5%'textAlign='left' color='black' mb='3%'>A equipe acompanha de perto o progresso realizando graficos e ajustando o plano de ensino sempre que necessário.</Titulo>
                    </VStack>

                    <Botao style={{ flex: 1 }} onPress={() => Linking.openURL("https://stimular.com.br")}>Quer saber mais?</Botao>

                

                    
            </VStack>
        </ScrollView>
    );
}

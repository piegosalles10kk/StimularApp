import AsyncStorage from "@react-native-async-storage/async-storage";
import { HStack, ScrollView, View, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Titulo } from "../../componentes/Titulo";
import { ImagemLogo } from "../../componentes/ImagemLogo";
import Conquista from "../../componentes/Conquista";
import AtividadeCard from "../../componentes/GrupoAtividadeCard";
import { Botao } from "../../componentes/Botao";
import { pegarDadosUsuario, updateMoeda } from "../../servicos/UserServico";
import { pegarGruposAtividadesAuto, postarAtividadeEmAndamento } from "../../servicos/GrupoAtividadesServicos";
import { ConquistaUsuario, GrupoAtividades, UsuarioGeral, Atividades } from "../../interfaces/UsuarioGeral";
import { tokenMidia } from "../../utils/token";
import ModalTemplate from "../../componentes/Modal";

export default function PrincipalPaciente({ navigation }) {

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [dadosAtividades, setDadosAtividades] = useState<GrupoAtividades | null>(null);
    const [listaAtividades, setListaAtividades] = useState<Atividades[]>([]);
    const [conquistasUsuario, setConquistasUsuarios] = useState<ConquistaUsuario>({} as ConquistaUsuario);
    const [carregado, setCarregando] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [atividadeId, setAtividadeId] = useState('');

    const handleOpenModal = (atividadeIdParam: string) => {
        setAtividadeId(atividadeIdParam);
        const grupoAtividadesId = dadosAtividades._id;

        console.log('grupoAtividadesId', grupoAtividadesId);
        console.log('atividadeIdParam', atividadeIdParam);
        
        

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

    const tornarBotaoVisivel = async () => {
        const grupoAtividadesId = dadosAtividades?.atividades[0]._id;

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

    useEffect(() => {
        async function fetchDadosUsuario() {
            const usuarioID = await AsyncStorage.getItem('id');
            const token = await AsyncStorage.getItem('token');

            if (!token || !usuarioID) {
                console.error('Erro ao pegar o token ou ID do usuário');
                return;
            }

            try {
                const resultado = await pegarDadosUsuario(usuarioID, token);
                if (resultado) {
                    setDadosUsuario(resultado);
                    const resultadoAtividade = await pegarGruposAtividadesAuto(token);
                    //console.log(resultadoAtividade.gruposAtividades[0]._id);

                    // Verificando se a resposta contém atividades
                    if (resultadoAtividade.gruposAtividades && Array.isArray(resultadoAtividade.gruposAtividades) && resultadoAtividade.gruposAtividades.length > 0) {
                        setDadosAtividades(resultadoAtividade.gruposAtividades[0]); // Define somente o primeiro grupo
                        
                        console.log(resultadoAtividade.gruposAtividades[0].atividades[0]._id);
                        
                        
                        setListaAtividades(resultadoAtividade.gruposAtividades[0].atividades || []); // Certifique-se de que é um array
                    } else {
                        console.error("Nenhum grupo de atividades encontrado");
                    }

                    setConquistasUsuarios(resultado.user.conquistas || {}); // Garantir que conquistas esteja definido
                    setCarregando(true);
                } else {
                    console.error("Erro ao pegar os dados do usuário");
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        }

        fetchDadosUsuario();
    }, []);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View>
                <ImagemLogo
                    style={{
                        marginTop: '5%',
                        width: 200,
                        height: 150,
                    }}
                />
                <VStack>
                    <View
                        style={{
                            width: '90%',
                            marginTop: '5%',
                            alignSelf: 'center',
                            paddingTop: '2%',
                            padding: '5%',
                            borderWidth: 0,
                            borderRadius: 20,
                            marginBottom: '5%',
                        }}
                    >
                        <Titulo textAlign='center' fontSize='xl' color='black' bold>Suas conquistas</Titulo>
                        <HStack
                            padding="2%"
                            backgroundColor='roxoClaro'
                            mt='1%'
                            alignSelf={"center"}
                            flex={1}
                            borderWidth={1}
                            borderRadius={10}
                            width='100%'
                            flexWrap='wrap'
                            style={{ marginBottom: 0 }}
                        >
                            {Object.values(conquistasUsuario).slice(Math.max(0, Object.values(conquistasUsuario)?.length - 3)).map((conquista) => (
                                <VStack alignSelf={"center"} ml='2%' key={conquista?._id}>
                                    <Conquista
                                        uri={`${conquista?.imagem}${tokenMidia}`}
                                        titulo={conquista?.nome}
                                        avatarStyle={{ borderWidth: 1, borderColor: 'black' }}
                                    />
                                </VStack>
                            ))}
                        </HStack>
                    </View>

                    {carregado && dadosAtividades && listaAtividades.length > 0 && (
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
                                titulo='Objetivo do dia'
                                onPressAtividade={() => {
                                    const grupoAtividadesId = dadosAtividades._id;
                                    console.log(grupoAtividadesId);
                                    
                                    navigation.navigate('GrupoAtividadesTela', { id: grupoAtividadesId });
                                }}
                                onPressExercicio={(atividadeId) => {
                                    handleOpenModal(atividadeId);
                                }}
                            />
                        </VStack>
                    )}

                    {!carregado && (
                        <VStack borderWidth={0} borderRadius={10} w='93%' alignItems='center' ml='3.5%'>
                            <VStack flex={1}>
                                <Titulo fontSize='xl' mt='5%' mb='5%' bold color='black'>Aguenta aí</Titulo>
                                <Titulo fontSize='md' color='black'>Em breve teremos novas atividades! Até lá, que tal ficar de olho em nossas redes sociais?</Titulo>
                                <Titulo mt='4%' mb='5%' fontSize='lg' bold color='black'>Nos acompanhe em nosso Instagram!</Titulo>
                                <HStack padding='4%' alignSelf='center' w='90%'>
                                    <Ionicons
                                        name={'logo-instagram'}
                                        size={50}
                                        color={'black'}
                                        onPress={() => Linking.openURL('https://www.instagram.com/stimular.multidisciplinar')}
                                    />
                                </HStack>
                            </VStack>
                        </VStack>
                    )}

                    {carregado && (
                        <HStack
                            alignItems='center'
                            justifyContent='space-between'
                            paddingX={4}
                            space={4}
                            style={{ marginBottom: '10%' }}
                        >
                            <Botao style={{ flex: 1 }} onPress={() => Linking.openURL("https://stimular.com.br/contato")}>Quem somos</Botao>
                            <Botao style={{ flex: 1 }} onPress={() => Linking.openURL("https://api.whatsapp.com/send?phone=5511992353394&text=Ol%C3%A1,%20quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20Stimular")}>Agende conosco</Botao>
                        </HStack>
                    )}

                </VStack>
            </View>
        </ScrollView>
    );
}

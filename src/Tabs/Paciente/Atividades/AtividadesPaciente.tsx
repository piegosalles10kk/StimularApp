import { ImagemLogo } from "../../../componentes/ImagemLogo";
import { VStack, ScrollView, HStack, Box, Pressable } from "native-base";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Titulo } from "../../../componentes/Titulo";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import {  GrupoAtividades, UsuarioGeral, Atividades, GruposDeAtividadesFinalizadas } from "../../../interfaces/UsuarioGeral";
import AtividadeCard from "../../../componentes/GrupoAtividadeCard";
import Graficos from "../../../componentes/Graficos";

// Api
import { pegarDadosUsuario } from "../../../servicos/PacienteServico";
import { pegarGruposAtividadesNivel } from "../../../servicos/GrupoAtividadesServicos";


export default function AtividadesPaciente( { navigation } ) {
    const listaCategorias = [
        { id: 1, nome: 'Física', icone: 'body', busca: 'Física' },
        { id: 2, nome: 'Linguística', icone: 'chatbubbles', busca: 'Linguistica' },
        { id: 3, nome: 'Cognitiva', icone: 'extension-puzzle', busca: 'Cognitiva' },
        { id: 4, nome: 'Socioafetiva', icone: 'happy', busca: 'socioafetiva' },
    ];

    const [dataFinalizadas, setDataFinalizadas] = useState({} as any);
    const [pontuacoesFinais, setPontuacoesFinais] = useState({} as any);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [dadosAtividades, setDadosAtividades] = useState({} as GrupoAtividades);
    const [listaAtividades, setListaAtividades] = useState({} as Atividades);
    const [carregadoGrafico, setCarregandoGrafico] = useState(false);
    const [carregado, setCarregando] = useState(false);

    const handleCategoriaClick = async (busca: string) => {
        console.log(`Categoria clicada: ${busca}`); // Log de validação
        setCarregando(false); // A partir de agora, marcaremos como carregando
    
        // Atualiza as categorias selecionadas
        setCategoriasSelecionadas(prev => {
            const isSelected = prev.includes(busca);
            const newCategorias = isSelected
                ? prev.filter(item => item !== busca) // Remove se já estiver selecionado
                : [...prev, busca]; // Adiciona se não estiver selecionado
    
            //console.log('Categorias selecionadas:', newCategorias);
    
            // Chama a função para atualizar dadosAtividades com as novas categorias
            atualizarDadosAtividades(newCategorias); // Passa o novo array de categorias
            return newCategorias;
        });
    };
    
    const atualizarDadosAtividades = async (novasCategoriasSelecionadas) => {
        const [usuarioID, token] = await Promise.all([
            AsyncStorage.getItem('id'),
            AsyncStorage.getItem('token')
        ]);
    
        // Verificar se o usuário e o token estão disponíveis
        if (!usuarioID || !token) {
            console.error('Erro ao obter dados do usuário ou token');
            return;
        }
    
        const nivel = dadosUsuario.user.nivel;
        const grupo = dadosUsuario.user.grupo;
        //console.log(nivel, grupo, novasCategoriasSelecionadas); // Usar as novas categorias
    
        // Log dos dados que serão enviados para a API
        console.log('Enviando dados para a rota:', {
            usuarioID,
            token,
            categoriasSelecionadas: novasCategoriasSelecionadas // Usar novas categorias
        });
    
        try {
            // Chamar a função que busca os grupos de atividades
            const resultadoAtividade = await pegarGruposAtividadesNivel(token, nivel, grupo, novasCategoriasSelecionadas);
    
            // Log do resultado da atividade recebida
            //console.log('Atividades recebidas:', resultadoAtividade);
    
            // Atualiza os estados relacionados a atividades
            setDadosAtividades(resultadoAtividade);
            setListaAtividades(resultadoAtividade.atividades[0]);
    
            const gruposDeAtividadesFinalizadas = dadosUsuario.user.gruposDeAtividadesFinalizadas || [];
            const dataFinalizadasTemp = gruposDeAtividadesFinalizadas.map(atividade => atividade.dataFinalizada);
            const pontuacoesFinaisTemp = gruposDeAtividadesFinalizadas.map(atividade => atividade.porcentagem);
    
            setDataFinalizadas(dataFinalizadasTemp);
            setPontuacoesFinais(pontuacoesFinaisTemp);
        } catch (error) {
            console.error('Erro ao buscar atividades:', error);
        } finally {
            setCarregando(true); // Marcar como não carregando após atualização
            console.log(`A pagina está carregando? ${carregado}`);
            
        }
    };
    
    
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
    
                // Log dos dados do usuário e atividades antes de fazer a requisição
                //console.log('Dados do usuário recebidos:', resultado);
    
                const resultadoAtividade = await pegarGruposAtividadesNivel(token, resultado.user.nivel, resultado.user.grupo, categoriasSelecionadas);
    
                // Log do resultado da atividade antes de armazená-la
                //console.log('Atividades recebidas:', resultadoAtividade);
        
                // Extraindo os dados desejados
                const dataFinalizadasTemp = (Object.values(resultado.user.gruposDeAtividadesFinalizadas).map((atividade: GruposDeAtividadesFinalizadas) => atividade.dataFinalizada));
                const pontuacoesFinaisTemp = (Object.values(resultado.user.gruposDeAtividadesFinalizadas).map((atividade: GruposDeAtividadesFinalizadas) => atividade.porcentagem));
    
                setDataFinalizadas(dataFinalizadasTemp);
                setPontuacoesFinais(pontuacoesFinaisTemp);
                setDadosAtividades(resultadoAtividade);
                setListaAtividades(resultadoAtividade.atividades[0]);
                setCarregando(true);
            } else {
                console.error("erro ao pegar os dados do usuario");
            }
        }
    
        dadosUsuario(); // Carrega os dados no início da montagem do componente
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (dataFinalizadas.length && pontuacoesFinais.length) {
                setCarregandoGrafico(true);
                clearInterval(intervalId);
            }
        }, 1000); // Verifica a cada 1 segundo

        return () => clearInterval(intervalId); // Limpa o intervalo quando o componente desmontar
    }, [dataFinalizadas, pontuacoesFinais]);

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
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

                        <VStack flexDirection='row' alignItems='center' space={2} flexWrap='nowrap' justifyContent='center'>
                            {listaCategorias.map((categoria) => (
                                <Pressable 
                                    key={categoria.id} 
                                    onPress={() => handleCategoriaClick(categoria.busca)} // Adiciona evento de clique
                                >
                                    <Box
                                        borderWidth='1'
                                        borderColor='black'
                                        borderRadius={10}
                                        padding={3}
                                        paddingLeft={Platform.OS === 'ios' ? '4%' : '6%'} // Aumentado para melhorar a centralização
                                        backgroundColor={categoriasSelecionadas.includes(categoria.busca) ? 'lightgrey' : 'white'} // Muda a cor do box se selecionado
                                        flexShrink={1}
                                        flexGrow={1}
                                        marginRight={2}
                                        maxWidth='120px'
                                        alignItems="center" // Centraliza o conteúdo horizontalmente
                                        justifyContent="center" // Centraliza o conteúdo verticalmente
                                    >
                                        <HStack alignItems='center' flexDirection='column' justifyContent='center'>
                                            <Titulo
                                                fontSize='2xs'
                                                bold
                                                textAlign='center'
                                                color={'black'} 
                                            >
                                                {categoria.nome}
                                            </Titulo>
                                            <Ionicons
                                                name={categoria.icone}
                                                size={24}
                                                color={'black'}
                                            />
                                        </HStack>
                                    </Box>
                                </Pressable>
                            ))}
                        </VStack>
                    </HStack>
                </VStack>

                <VStack width='90%' mt='5%'>
                    {carregado && (
                        <AtividadeCard
                            dadosAtividades={dadosAtividades}
                            listaAtividades={listaAtividades}
                            titulo='Atividade recomendada'
                            onPressAtividade={() => {
                                const grupoAtividadesId = dadosAtividades.atividades[0]._id; 
                                console.log(grupoAtividadesId);
                                navigation.navigate('GrupoAtividadesTela', { id: grupoAtividadesId });       
                            }}
                            onPressExercicio={(atividadeId) => {
                                console.log('Atividade ID:', atividadeId);
                                navigation.navigate('ExercicioTela', { id: atividadeId });       
                            }}
                        />
                    )}
                </VStack>

                {carregadoGrafico && (
                    <VStack width='90%' mt='5%' alignItems='center'>
                        <VStack
                            paddingTop={2}
                            paddingBottom={2}
                            backgroundColor='roxoClaro'
                            width='100%'
                            alignItems='center'
                            justifyContent='center'
                            borderWidth='2'
                        >
                            <Titulo fontSize='xl' bold color='black'>Desempenho em atividades</Titulo>
                        </VStack>

                        <VStack width='100%' alignItems='center' justifyContent='center' borderWidth='2' mt='3%' padding={4} bg='roxoClaro'>
                            <Graficos
                                labels={dataFinalizadas}
                                data={pontuacoesFinais}
                                quantidade={7}
                            />
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </ScrollView>
    );
}

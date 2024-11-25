import { VStack, Image, HStack, Checkbox } from "native-base";
import { useRoute } from '@react-navigation/native';
import { Titulo } from "../../../componentes/Titulo";
import { Alternativas, Atividades, Exercicios, UsuarioGeral } from "../../../interfaces/UsuarioGeral";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pegarDadosUsuario } from "../../../servicos/PacienteServico";
import { pegarAtividadesPorId, pegarGruposAtividadesPorId, postarAtividadeEmAndamento, postarAtividadeFinalizada, atualizarAtividadeEmAndamento } from "../../../servicos/GrupoAtividadesServicos";
import { tokenMidia } from "../../../utils/token";
import { Video, ResizeMode } from 'expo-av';
import { Botao } from "../../../componentes/Botao";

export default function ExercicioTela({ navigation }) {

    const token = AsyncStorage.getItem('token');
    

    interface RouteParams {

        id: any;

        atividadeId: string;

        idGrupoAtividades: string;

    }

    const [atividadeTela, setAtividadeTela] = useState({} as Atividades);

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);

    const [carregado, setCarregando] = useState(false);

    const [exercicios, setExercicios] = useState([] as Exercicios[]);

    const [alternativas, setAlternativas] = useState([] as Alternativas[]);

    const [selectedAlternative, setSelectedAlternative] = useState<{

        alternativaResultado: string;

        id: string;

    } | null>(null);

    const [exerciciosDoUsuario, setExerciciosDoUsuario] = useState([] as any);

    const [exerciciosDoGrupo, setExerciciosDoGrupo] = useState([] as any);

    const route = useRoute(); // Obtendo a rota

    const idAtividade = (route.params as RouteParams).atividadeId;

    const idGrupoAtividades = (route.params as RouteParams).idGrupoAtividades;

    useEffect(() => {

        async function dadosAtividade() {

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

   

            try {

                const grupoAtividades = await pegarGruposAtividadesPorId(idGrupoAtividades, token);

                //console.log("Grupo de Atividades:", grupoAtividades);

   

                const resultado = await pegarDadosUsuario(usuarioID, token);

                //console.log("Dados do Usuário:", resultado);

   

                if (resultado) {

                    setDadosUsuario(resultado);

                    const resultadoAtividade = await pegarAtividadesPorId(idGrupoAtividades, idAtividade, token);

   

                    setAtividadeTela(resultadoAtividade.atividade);

                    setExercicios(resultadoAtividade.atividade.exercicios);

                    setAlternativas(resultadoAtividade.atividade.exercicios[0].alternativas);

                                       

   

                    const exerciciosTempUsuario = [];

                    // Verifique se o resultado e a estrutura do usuário são válidos
                    if (resultado && resultado.user) {
                        const gruposAtividades = resultado.user.gruposDeAtividadesEmAndamento;
                    
                        // Verifique se gruposDeAtividadesEmAndamento existe e se não é vazio
                        if (Array.isArray(gruposAtividades) && gruposAtividades.length > 0) {
                            const respostas = gruposAtividades[0].respostas;
                    
                            // Verifique se respostas estão definidas e são um array
                            if (Array.isArray(respostas)) {
                                for (let resposta of respostas) {
                                    const atividadeId = resposta.atividade_id;
                    
                                    // Adicione a lógica de verificação do ID da atividade
                                    if (!exerciciosTempUsuario.includes(atividadeId)) {
                                        exerciciosTempUsuario.push(atividadeId);
                                    }
                                }
                            } else {
                                console.error('Nenhuma resposta encontrada no grupo de atividades em andamento.');
                            }
                        } else {
                            //console.error('Nenhum grupo de atividades em andamento encontrado.');
                        }
                    } else {
                        console.error('Resultados do usuário não encontrados ou formato inválido.');
                    }
                    
                    // Atualizar o estado com os IDs de exercícios do usuário
                    setExerciciosDoUsuario(exerciciosTempUsuario);

                    const exerciciosTempGrupo = [];

                    for (let atividade of grupoAtividades.grupoAtividades.atividades) {

                        const atividadeId = atividade._id;

                        if (!exerciciosTempGrupo.includes(atividadeId)) {

                            exerciciosTempGrupo.push(atividadeId);

                        }

                    }

                    setExerciciosDoGrupo(exerciciosTempGrupo);

                    console.log(exerciciosTempUsuario);

                    setCarregando(true);

                } else {

                    console.error("erro ao pegar os dados do usuario");

                }

            } catch (error) {

                console.error("Erro na obtenção de dados:", error);

            }

        }

        dadosAtividade();

    }, []);

    async function salvarAtividade() {
        const hasAllItems = exerciciosDoGrupo.every((item) => {
            return exerciciosDoUsuario.includes(item.trim());
        });
    
        const allConditionsMet = hasAllItems && exerciciosDoUsuario.includes(idAtividade);
        const resolvedToken = await token;
    
        // Estrutura base das respostas
        const resposta = {
            atividade_id: idAtividade,
            exercicioId: exercicios[0].exercicioId,
            alternativaId: selectedAlternative?.id || null,
            isCorreta: selectedAlternative?.alternativaResultado === 'true',
            pontuacao: exercicios[0]?.pontuacao || 0,
        };
    
        console.log("Resposta preparada:", resposta);
    
        // Verificação se tudo está funcionando
        if (!resposta.alternativaId || resposta.isCorreta === undefined || resposta.pontuacao === undefined) {
            console.error("Os dados da resposta estão incompletos:", resposta);
            return; // Saída da função para evitar chamada ao servidor
        }
    
        const atividadesEmAndamento = dadosUsuario.user.gruposDeAtividadesEmAndamento;
    
        // Estrutura para a requisição de postagem
        const postarAtividadeData = {
            respostas: [
                {
                    atividade_id: resposta.atividade_id,
                    exercicioId: resposta.exercicioId,
                    alternativaId: resposta.alternativaId,
                    isCorreta: resposta.isCorreta,
                    pontuacao: resposta.pontuacao,
                },
            ],
        };
    
        // Estrutura para a requisição de atualização
        const atualizarAtividadeData = {
            alternativaId: resposta.alternativaId,
            atividade_id: resposta.atividade_id,
            exercicioId: resposta.exercicioId,
            isCorreta: resposta.isCorreta,
            pontuacao: resposta.pontuacao,
        };
    
        if (!atividadesEmAndamento || atividadesEmAndamento.length === 0) {
            // Caso não haja atividades em andamento, enviar nova atividade
            try {
                const enviarAtividadeEmAndamento = await postarAtividadeEmAndamento(idGrupoAtividades, resolvedToken, postarAtividadeData.respostas);
                if (enviarAtividadeEmAndamento) {
                    console.log("Atividade em andamento enviada com sucesso:", enviarAtividadeEmAndamento);
                } else {
                    console.error("Erro ao enviar a atividade em andamento");
                }
            } catch (error) {
                console.error("Erro ao postar atividade em andamento:", error.response ? error.response.data : error.message);
            }
        } else {
            // Atualizar atividade em andamento
            const idAtividadeEmAndamento = atividadesEmAndamento[0]._id;
    
            try {
                const enviarAtividadeEmAndamento = await atualizarAtividadeEmAndamento(idAtividadeEmAndamento, resolvedToken, atualizarAtividadeData);
                if (enviarAtividadeEmAndamento) {
                    console.log("Atividade em andamento atualizada com sucesso:", enviarAtividadeEmAndamento);
    
                    // Se todas as condições foram atendidas, envia a atividade finalizada
                    if (allConditionsMet) {
                        const enviarAtividadeFinalizada = await postarAtividadeFinalizada(idGrupoAtividades, resolvedToken);
                        if (enviarAtividadeFinalizada) {
                            console.log("Atividade finalizada enviada com sucesso:", enviarAtividadeFinalizada);
                        } else {
                            console.error("Erro ao enviar a atividade finalizada");
                        }
                    }
                } else {
                    console.error("Erro ao atualizar a atividade em andamento: resposta indefinida.");
                }
            } catch (error) {
                console.error("Erro ao atualizar a atividade em andamento:", error.response ? error.response.data : error.message);
            }
        }
    
        console.log("Processo de envio de atividades concluído.");
    
        // Navegação de volta
        navigation.replace('GrupoAtividadesTela', { id: idGrupoAtividades });
    }
    
    
       

    // Função para selecionar ou desmarcar a alternativa

    const handleSelectAlternative = (alternativa) => {

        // Verifica se a alternativa já está selecionada

        if (selectedAlternative && selectedAlternative.id === alternativa._id) {

            // Desmarca essa alternativa

            console.log("Alternativa desmarcada:", selectedAlternative);

            setSelectedAlternative(null);

        } else {

            // Marca a nova alternativa

            const newAlternative = {

                alternativaResultado: alternativa.resultadoAlternativa,

                id: alternativa._id,

            };

            setSelectedAlternative(newAlternative);

            console.log("Alternativa selecionada:", newAlternative);

        }

    };

    return (
        <VStack>
            {carregado && (
                <VStack>
                    
                    <Titulo mt='10%' bold color='black' fontSize='2xl'>{`${atividadeTela.nomdeDaAtividade}`}</Titulo>
                    {exercicios.map((exercicio, index) => (
                        <VStack key={index} mt={4}>
                            {exercicio.midia && (
                                <>
                                    {exercicio.midia.tipoDeMidia.includes('image') ? (
                                        <Image
                                            source={{ uri: `${exercicio.midia.url}${tokenMidia}` }}
                                            alt={exercicio.midia.url}
                                            size="2xl"
                                            alignSelf='center'
                                            mt='5%'
                                        />
                                    ) : (
                                        <VStack alignItems='center' justifyContent='center' mt='5%'>
                                            <Video
                                                source={{ uri: `${exercicio.midia.url}${tokenMidia}` }}
                                                useNativeControls={false}
                                                style={{ width: '100%', height: 180 }}
                                                resizeMode={ResizeMode.CONTAIN}
                                                shouldPlay
                                                isLooping
                                                isMuted
                                            />
                                        </VStack>
                                    )}
                                </>
                            )}
                            <Titulo fontSize='lg' padding='3%' mt='5%'>{exercicio.enunciado}</Titulo>
                            {alternativas.map((alternativa, index) => (
                                <HStack key={index} alignItems="center" padding='5%'>
                                    <Checkbox
                                        value={alternativa._id}
                                        isChecked={selectedAlternative?.id === alternativa._id}
                                        onChange={() => handleSelectAlternative(alternativa)}
                                        accessibilityLabel={`Alternativa: ${alternativa?.alternativa}`} // Adicionando rótulo de acessibilidade
                                    />
                                    <Titulo ml={2}>{alternativa?.alternativa}</Titulo>
                                </HStack>
                                
                            ))}                           
                        </VStack>
                    ))}
                    <Botao alignSelf='center' onPress={salvarAtividade}>Salvar</Botao>
                </VStack>
            )}   
        </VStack>
    );
}

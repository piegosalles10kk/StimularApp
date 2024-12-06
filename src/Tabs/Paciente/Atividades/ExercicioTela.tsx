import { VStack, Image, HStack, Checkbox } from "native-base";
import { useRoute } from '@react-navigation/native';
import { Titulo } from "../../../componentes/Titulo";
import { Alternativas, Atividades, Exercicios, UsuarioGeral } from "../../../interfaces/UsuarioGeral";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pegarDadosUsuario } from "../../../servicos/UserServico";
import { pegarAtividadesPorId, pegarGruposAtividadesPorId, postarAtividadeEmAndamento, postarAtividadeFinalizada, atualizarAtividadeEmAndamento } from "../../../servicos/GrupoAtividadesServicos";
import { tokenMidia } from "../../../utils/token";
import { Video, ResizeMode } from 'expo-av';
import { Botao } from "../../../componentes/Botao";
import ModalAtividade from "../../../componentes/modalAtividades";

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

    const [modalVisible1, setModalAtividadeEmAndamento] = useState(false);

    const [modalAtividadeFinalizada, setModalAtividadeFinalizada] = useState(false);

    const [notaAtividadeFinalizada, setNotaAtividadeFinalizada] = useState(0);

    const [selectedAlternative, setSelectedAlternative] = useState<{

        alternativaResultado: boolean;

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
        const resolvedToken = await token;
    
        // Estrutura base das respostas
        const resposta = {
            atividade_id: idAtividade,
            exercicioId: exercicios[0].exercicioId,
            alternativaId: selectedAlternative?.id || null,
            isCorreta: selectedAlternative?.alternativaResultado === true,
            pontuacao: exercicios[0]?.pontuacao || 0,
        };
    
        console.log("Resposta preparada:", resposta);
    
        // Verificação de dados incompletos
        if (!(resposta.alternativaId && resposta.isCorreta !== undefined && resposta.pontuacao !== undefined)) {
            console.error("Os dados da resposta estão incompletos:", resposta);
            return; // Saída da função para evitar chamada ao servidor
        }
    
        const atividadesEmAndamento = dadosUsuario.user.gruposDeAtividadesEmAndamento;
    
        // Criação de arrays temporários
        const exerciciosTempGrupo = exerciciosDoGrupo.map(item => item.trim());
        console.log(`exercicios do grupo: [${exerciciosTempGrupo}]`);
        
        const exerciciosTempUsuario = exerciciosDoUsuario;
    
        // Criação do array de verificação
        const verificacao = [...exerciciosTempUsuario, idAtividade];
        console.log(`essa é a verificação [${verificacao}]`);
        

        // Verifica se todos os exercícios do grupo estão presentes na verificação
        const todosExerciciosCobertos = exerciciosTempGrupo.every(item => verificacao.includes(item));
    
        const temAtividadeAtual = verificacao.includes(idAtividade);
        console.log(`tem a atividade atual? ${temAtividadeAtual}`);
        console.log(`tem todos os exercicos? ${todosExerciciosCobertos}`);


        // Dados para a requisição
        const atividadeData = {
            atividade_id: resposta.atividade_id,
            exercicioId: resposta.exercicioId,
            alternativaId: resposta.alternativaId,
            isCorreta: resposta.isCorreta,
            pontuacao: resposta.pontuacao,
        };
    
        try {
            const idAtividadeEmAndamento = atividadesEmAndamento.length > 0 ? atividadesEmAndamento[0]._id : null;
            if (todosExerciciosCobertos === true && temAtividadeAtual === true) {
                    
                    console.log(`id atividade em andamento sendo passado: ${idAtividadeEmAndamento}`);
                    
                    const enviarAtividadeEmAndamento = await atualizarAtividadeEmAndamento(idAtividadeEmAndamento, resolvedToken, atividadeData);
                    console.log(JSON.stringify({
                      sucesso: enviarAtividadeEmAndamento,
                      mensagem: enviarAtividadeEmAndamento ? "Atividade em andamento atualizada com sucesso" : "Erro ao atualizar a atividade em andamento",
                      dados: enviarAtividadeEmAndamento
                    }, null, 2));
                    
                    const enviarAtividadeFinalizada = await postarAtividadeFinalizada(idGrupoAtividades, resolvedToken);
                    console.log(enviarAtividadeFinalizada ? "Atividade finalizada enviada com sucesso:" : "Erro ao enviar a atividade finalizada", enviarAtividadeFinalizada);
                    
                    const novaConvertida = parseInt(enviarAtividadeFinalizada.atividadeFinalizada.porcentagem)
                    setNotaAtividadeFinalizada(novaConvertida)
                    
                    setModalAtividadeFinalizada(true);
                    
                    
            }else{
                
                const enviarAtividadeEmAndamento = await atualizarAtividadeEmAndamento(idAtividadeEmAndamento, resolvedToken, atividadeData);
                console.log(enviarAtividadeEmAndamento ? "Atividade em andamento atualizada com sucesso:" : "Erro ao atualizar a atividade em andamento", enviarAtividadeEmAndamento);


                setModalAtividadeEmAndamento(true);
            }   


        } catch (error) {
            console.error("Erro durante a operação:", error.response ? error.response.data : error.message);
        }
    
        console.log("Processo de envio de atividades concluído.");    
        
    }
    

    const voltarlAtividadeEmAndamento = () => {
        navigation.replace('GrupoAtividadesTela', { id: idGrupoAtividades });
    }

    const voltarAtividadeFinalizada = () =>{
        navigation.replace('Login');
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
        <VStack flex={1} background='white'>
            {carregado && (
                    <VStack>
                    <ModalAtividade
                            bodyText= "Parabéns, grupo finalizado!"
                            minimalText={`Seu total do foi ${notaAtividadeFinalizada}%.`}
                            confirmButtonText="Concluir"
                            isVisible = {modalAtividadeFinalizada}
                            onConfirm={voltarAtividadeFinalizada}
                            onClose={() => setModalAtividadeFinalizada(false)}
                            showCancelButton={false}
                            width="100%"
                            videoUrl={`https://stimularmidias.blob.core.windows.net/midias/6b130f17-3ef9-402d-b88b-95065076fb48.mp4${tokenMidia}`}
                            audioUrl={`https://stimularmidias.blob.core.windows.net/midias/som-em-andamento.mp3${tokenMidia}`}
                            
                            />
                
                    <ModalAtividade
                            bodyText="Você arrasou!"
                            confirmButtonText="Concluir"
                            isVisible = {modalVisible1}
                            onConfirm={voltarlAtividadeEmAndamento}
                            onClose={() => setModalAtividadeEmAndamento(false)}
                            showCancelButton={false}
                            width="100%"
                            tamanhoDaTela={1}
                            videoUrl={`https://stimularmidias.blob.core.windows.net/midias/ebb74e92-3ee5-4379-a829-28ed8c7fdfcf.mp4${tokenMidia}`}
                            audioUrl={`https://stimularmidias.blob.core.windows.net/midias/som-finalizado.mp3${tokenMidia}`}
                            />

                    
                    <Titulo mt='15%' bold color='black' fontSize='2xl'>{`${atividadeTela.nomdeDaAtividade}`}</Titulo>
                    {exercicios.map((exercicio, index) => (
                        <VStack key={index} mt={4}>
                            {exercicio.midia && (
                                <>
                                    {exercicio.midia.tipoDeMidia.includes('image') || exercicio.midia.url.endsWith('.gif') ? (
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
                                        accessibilityLabel={`Alternativa: ${alternativa?.alternativa}`}
                                        colorScheme='purple'
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

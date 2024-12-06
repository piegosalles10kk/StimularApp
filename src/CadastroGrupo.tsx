import { VStack } from "native-base";
import { Titulo } from "./componentes/Titulo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import ModalAtividade from "./componentes/modalAtividades";
import { tokenMidia } from "./utils/token";
import { perguntasDiagnosticos } from "./utils/perguntasDiagnosticos";
import { Botao } from "./componentes/Botao";
import { atualizarPaciente } from "./servicos/UserServico";
import { Video, ResizeMode } from "expo-av";

export default function CadastroGrupo({ navigation }) {

    const [numIdade, setNumIdade] = useState(0);
    const [numTipoDeExercicio, setNumTipoDeExercicio] = useState(0);
    const [numExercicio, setNumExercicio] = useState(0);

    const [carregando, setCarregando] = useState(false);

    const [erros, setErros] = useState([]); 
        
    const [grupoQuestionario, setGrupoQuestionario] = useState({
        idade: Number,
        tipoDeExercicio: String,
        exercicio: String,  

    } as any);
    const [modalVisivel, setModalVisivel] = useState(true);

    const [modalVisivel2, setModalVisivel2] = useState(false);

    const questionario = perguntasDiagnosticos;
    

    useEffect(() => {

        const grupoAtual = pegarQuestao(numIdade, numTipoDeExercicio, numExercicio);
        setGrupoQuestionario(grupoAtual);

        setCarregando(true);
    }, [numIdade, numTipoDeExercicio, numExercicio]);

    function pegarQuestao(idade, tipo, exercicio) {
        const grupoSecao = questionario[idade];
        const tipoDeExercicio = grupoSecao.grupoDeExercicios[tipo].habilidade;
        const numeroExercicio = grupoSecao.grupoDeExercicios[tipo].exercicios[exercicio].questao;
        const qtdQuestao = grupoSecao.grupoDeExercicios[tipo].exercicios.length;

        return {
            idade: grupoSecao.idade,
            tipoDeExercicio: tipoDeExercicio,
            exercicio: numeroExercicio,
            qtdQuestao: qtdQuestao,
        };
    }

    const proximoExercicio = async () => {
        const exercicios = pegarQuestao(numIdade, numTipoDeExercicio, numExercicio);
        const totalQuestoes = exercicios.qtdQuestao;
    
        if (numTipoDeExercicio <= 4) {
            if (numExercicio < totalQuestoes - 1) {
                setNumExercicio(prevNumExercicio => prevNumExercicio + 1);
                setErros([]);
                console.log(`${exercicios.tipoDeExercicio} ${numExercicio + 1}) ${exercicios.exercicio}`);
            } else {
                setNumTipoDeExercicio(prevNumTipoDeExercicio => prevNumTipoDeExercicio + 1);
                setNumExercicio(0);
                console.log(`${exercicios.tipoDeExercicio} ${numExercicio + 1}) ${exercicios.exercicio}`);
            }
        } else {


            const usuarioID = await AsyncStorage.getItem('id');
            const token = await AsyncStorage.getItem('token');
            console.log("Acabou");

            const atualizarGrupo = {
                nivel: numIdade + 1,
                grupo: ["TEA"],
                conquistas: [
                    {
                        nome: "Beta",
                        imagem: "https://stimularmidias.blob.core.windows.net/midias/robo",
                        descricao: "Concluiu o teste",
                        condicao: 0
                    },
                    {nome: "Bem vindo!",
                        imagem: "https://stimularmidias.blob.core.windows.net/midias/6c0ab0a4-110f-4ce5-88c3-9c39ee10dba6.jpg",
                        descricao: "Concluiu o cadastro",
                        condicao: 0
                    },
                    {
                    nome: "Então é isso",
                    imagem: "https://stimularmidias.blob.core.windows.net/midias/54bb0ad7-70a9-405c-85b4-626033aaea81.png",
                    descricao: "Concluiu o teste",
                    condicao: 0
                },

            ]
              }

            const enviarDados = await atualizarPaciente(atualizarGrupo, usuarioID, token);

            setModalVisivel2(true)
            

            
        }
    };

    function proximaTela(){
        navigation.replace('Tabs');
    }
    

    const somarIdade = async () => {
        const exercicios = pegarQuestao(numIdade, numTipoDeExercicio, numExercicio);
        const totalQuestoes = exercicios.qtdQuestao;
    
        setErros(prevErros => {
            const novosErros = [...prevErros, numExercicio];
            console.log(`Array de erros após push: ${novosErros}`);
            return novosErros;
        });
    
        if (erros.length < 2) {
            if (numIdade <= 5) {
                if (numTipoDeExercicio <= 4) {
                    if (numExercicio < totalQuestoes - 1) {
                        setNumExercicio(prevNumExercicio => prevNumExercicio + 1);
                        console.log(`${exercicios.tipoDeExercicio} ${numExercicio + 1}) ${exercicios.exercicio}`);
                    } else {
                        setNumTipoDeExercicio(prevNumTipoDeExercicio => prevNumTipoDeExercicio + 1);
                        setNumExercicio(0);
                        console.log(`${exercicios.tipoDeExercicio} ${numExercicio + 1}) ${exercicios.exercicio}`);
                    }
                } else {
                    console.log("Acabou");

                    const usuarioID = await AsyncStorage.getItem('id');
                    const token = await AsyncStorage.getItem('token');

                    const atualizarGrupo = {
                        nivel: numIdade + 1,
                        grupo: ["TEA"],
                        conquistas: [{
                            nome: "TEA",
                            imagem: "https://stimularmidias.blob.core.windows.net/midias/54bb0ad7-70a9-405c-85b4-626033aaea81.png",
                            descricao: "Concluiu o teste",
                            condicao: 0
                        }]
                      }
        
                    const enviarDados = await atualizarPaciente(atualizarGrupo, usuarioID, token);
        
                    setModalVisivel2(true)
                }
            } else {
                setNumIdade(5);
                console.log("Agora nois vai com 6 anos até o fim");
            }
        } else {
            console.log("Número máximo de erros atingido.");
            if (numIdade <= 4) {
                setErros([]);
                setNumIdade(prevNumIdade => prevNumIdade + 1);
                setNumTipoDeExercicio(0);
                setNumExercicio(0);
            } else {
                await proximoExercicio();
            }
        }
    };
    

    function deslogar() {
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('tipoDeConta');
        navigation.replace('Login');
    }

    return (
        <VStack flex={1} alignItems='center' bg='white'>
            <ModalAtividade
                bodyText="Quase lá!"
                minimalText="A seguir, responda esse formulário para nos ajudar a entender melhor o seu perfil."
                detailsText="(Duração aproximada: 30min)"
                isVisible={modalVisivel}
                confirmButtonText="Sair"
                onConfirm={() => deslogar()}
                onClose={() => setModalVisivel(false)}
                cancelButtonText="Continuar"
                width="100%"
                videoUrl={`https://stimularmidias.blob.core.windows.net/midias/08a45c5a-3f72-41e9-8975-9626047015a1.mp4${tokenMidia}`}
            />

            <ModalAtividade
                bodyText="Agora sim, bem vindo ao Stimular!"
                minimalText={`Resultado: TEA ${numIdade + 1} ano(s)`} 
                detailsText="Não se preocupe, deixamos um breve resumo em seu perfil. Para mais detalhes, agende uma consulta com um dos nossos psicólogos."
                isVisible={modalVisivel2}
                confirmButtonText="Concluir"
                onConfirm={() => proximaTela()}
                onClose={() => setModalVisivel2(false)}
                showCancelButton={false}
                width="100%"
                margemDoVideo={30}
                audioUrl={`https://stimularmidias.blob.core.windows.net/midias/som-finalizado.mp3${tokenMidia}`}
                videoUrl={`https://stimularmidias.blob.core.windows.net/midias/4e5f30dc-d7d1-4931-a849-c2dd810c7967.mp4${tokenMidia}`}
            />


                <Titulo bold color='black' fontSize='3xl' mt='40%' mb='10%'>Responda sim ou são</Titulo>

                <Video
                    source={{ uri: `https://stimularmidias.blob.core.windows.net/midias/5616f6e2-ca60-41c2-a7b3-15c0907b39b5.mp4${tokenMidia}` }}
                    useNativeControls={false}
                    style={{ width: '100%', height: 180 }}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay
                    isLooping
                    isMuted
                />

        
                <VStack >
                    
                                            
                    <Titulo padding='5%' color='black' textAlign='left'  fontSize='lg' >Pergunta:</Titulo>
                    <Titulo fontSize='md' mt='-10%' textAlign='left' bold padding='5%'>{grupoQuestionario.exercicio}</Titulo>
                </VStack>
    
                
                                        

            <Botao onPress={proximoExercicio}>Sim</Botao>
            <Botao onPress={somarIdade} mt='5%'>Não</Botao>

            <VStack alignSelf='center'></VStack>
        </VStack>
    );
}

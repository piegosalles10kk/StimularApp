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

const CadastroGrupo = ({ navigation }) => {
    const [numIdade, setNumIdade] = useState(0);
    const [numTipoDeExercicio, setNumTipoDeExercicio] = useState(0);
    const [numExercicio, setNumExercicio] = useState(0);

    const [socializacao, setSocializacao] = useState([]);
    const [cognicao, setCognicao] = useState([]);
    const [linguagem, setLinguagem] = useState([]);
    const [autoCuidado, setAutoCuidado] = useState([]);
    const [motor, setMotor] = useState([]);

    const [carregando, setCarregando] = useState(false);
    const [erros, setErros] = useState([]);
    const [modalVisivel, setModalVisivel] = useState(true);
    const [modalVisivel2, setModalVisivel2] = useState(false);

    const questionario = perguntasDiagnosticos;

    const [grupoQuestionario, setGrupoQuestionario] = useState({
        idade: 0,
        tipoDeExercicio: '',
        exercicio: '',
        marco: ''
    });

    useEffect(() => {
        const grupoAtual = pegarQuestao(numIdade, numTipoDeExercicio, numExercicio);
        setGrupoQuestionario(grupoAtual);
        setCarregando(true);
    }, [numIdade, numTipoDeExercicio, numExercicio]);

    function pegarQuestao(idade, tipo, exercicio) {
        const grupoSecao = questionario[idade];
        const tipoDeExercicio = grupoSecao.grupoDeExercicios[tipo].habilidade;
        const numeroExercicio = grupoSecao.grupoDeExercicios[tipo].exercicios[exercicio].questao;
        const marco = grupoSecao.grupoDeExercicios[tipo].exercicios[exercicio].marco;
        const qtdQuestao = grupoSecao.grupoDeExercicios[tipo].exercicios.length;

        return {
            idade: grupoSecao.idade,
            tipoDeExercicio,
            exercicio: numeroExercicio,
            marco,
            qtdQuestao
        };
    };

    const proximoExercicio = async () => {
        const exercicios = pegarQuestao(numIdade, numTipoDeExercicio, numExercicio);
        const totalQuestoes = exercicios.qtdQuestao;

        if (numTipoDeExercicio <= 4) {
            if (numExercicio < totalQuestoes - 1) {
                setNumExercicio(prev => prev + 1);
                setErros([]);
                console.log(`${exercicios.tipoDeExercicio} ${numExercicio + 1}) ${exercicios.exercicio}`);
            } else {
                setNumTipoDeExercicio(prev => prev + 1);
                setNumExercicio(0);
                console.log(`${exercicios.tipoDeExercicio} ${numExercicio + 1}) ${exercicios.exercicio}`);
            }
        } else {
            const usuarioID = await AsyncStorage.getItem('id');
            const token = await AsyncStorage.getItem('token');
            AsyncStorage.setItem('grupoDoUser', JSON.stringify(["TEA"]));
            console.log("Acabou");

            const atualizarGrupo = criarGrupoDeAtualizacao();

            await atualizarPaciente(atualizarGrupo, usuarioID, token);
            setModalVisivel2(true);
        }
    };

    const criarGrupoDeAtualizacao = () => ({
        nivel: numIdade + 1,
        grupo: ["TEA"],
        erros: {
            socializacao,
            cognicao,
            linguagem,
            autoCuidado,
            motor,
        },
        profissional: obterProfissionais(),
        conquistas: obterConquistas(),
    });

    const obterProfissionais = () => [
        { idDoProfissional: '672243e4effa46003373d4f4', nome: 'Stimular' },
        { idDoProfissional: '6769bece33989546e360a712', nome: 'Crislaine Freires de Brito' },
        { idDoProfissional: '6769beb733989546e360a6dc', nome: 'Daniela Aparecida Marques Alamino' },
        { idDoProfissional: '6769be8d33989546e360a6a7', nome: 'Thally Caponi' },
        { idDoProfissional: '6769be6633989546e360a673', nome: 'Kátea Paula de Lima' },
        { idDoProfissional: '6769be0333989546e360a640', nome: 'Isabel Aguiar' },
        { idDoProfissional: '671a857002bddbf20cba4ae0', nome: 'Diego Salles' },
    ];

    const obterConquistas = () => [
        {
            nome: "Beta",
            imagem: "https://stimularmidias.blob.core.windows.net/midias/robo",
            descricao: "Concluiu o teste",
            condicao: 0
        },
        {
            nome: "Bem-vindo!",
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
    ];

    const handleNoPress = () => {
        const marco = grupoQuestionario.marco; // Captura o marco do estado

        console.log(`Resposta negativa para: ${marco}`); // Log da resposta negativa

        // Adiciona o marco ao array correspondente com base na primeira letra
        if (marco) {
            const primeiroCaracter = marco.charAt(0).toUpperCase(); // Pega a primeira letra e transforma em maiúscula

            switch (primeiroCaracter) {
                case 'S':
                    setSocializacao(prev => {
                        console.log(`Adicionado ao array de socialização: ${marco}`);
                        console.log(socializacao);
                        return [...prev, marco];
                    });
                    break;
                case 'C':
                    setCognicao(prev => {
                        console.log(`Adicionado ao array de cognição: ${marco}`);
                        console.log(cognicao);
                        return [...prev, marco];
                    });
                    break;
                case 'L':
                    setLinguagem(prev => {
                        console.log(`Adicionado ao array de linguagem: ${marco}`);
                        console.log(linguagem);
                        return [...prev, marco];
                    });
                    break;
                case 'A':
                    setAutoCuidado(prev => {
                        console.log(`Adicionado ao array de autocuidado: ${marco}`);
                        console.log(autoCuidado);                        
                        return [...prev, marco];
                    });
                    break;
                case 'M':
                    setMotor(prev => {
                        console.log(`Adicionado ao array de motor: ${marco}`);
                        console.log(motor);                        
                        return [...prev, marco];
                    });
                    break;
                default:
                    console.log("Marco não reconhecido para categoria.");
                    break;
            }
        }

        somarIdade();
    };

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
                        setNumExercicio(prev => prev + 1);
                        console.log(`${exercicios.tipoDeExercicio} ${numExercicio + 1}) ${exercicios.exercicio}`);
                    } else {
                        setNumTipoDeExercicio(prev => prev + 1);
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
                    };

                    await atualizarPaciente(atualizarGrupo, usuarioID, token);
                    setModalVisivel2(true);
                }
            } else {
                setNumIdade(5);
            }
        } else {
            console.log("Número máximo de erros atingido.");
            if (numIdade <= 4) {
                setErros([]);
                setNumIdade(prev => prev + 1);
                setNumTipoDeExercicio(0);
                setNumExercicio(0);
            } else {
                await proximoExercicio();
            }
        }
    };

    const deslogar = () => {
        AsyncStorage.multiRemove(['id', 'token', 'tipoDeConta']);
        navigation.replace('Login');
    };

    return (
        <VStack flex={1} alignItems='center' bg='white'>
            <ModalAtividade
                bodyText="Quase lá!"
                minimalText="A seguir, responda esse formulário para nos ajudar a entender melhor o seu perfil."
                detailsText="(Duração aproximada: 30min)"
                isVisible={modalVisivel}
                confirmButtonText="Sair"
                onConfirm={deslogar}
                onClose={() => setModalVisivel(false)}
                cancelButtonText="Continuar"
                width="100%"
                videoUrl={`https://stimularmidias.blob.core.windows.net/midias/08a45c5a-3f72-41e9-8975-9626047015a1.mp4${tokenMidia}`}
            />
            <ModalAtividade
                bodyText="Agora sim, bem-vindo ao StimularApp!"
                minimalText={`Resultado: ${numIdade + 1} ano(s)`}
                detailsText="Prontinho! Precisamos que você refaça o login para ter acesso aos seus planos de treinamento personalizados."
                isVisible={modalVisivel2}
                confirmButtonText="Concluir"
                onConfirm={deslogar}
                onClose={() => setModalVisivel2(false)}
                showCancelButton={false}
                width="100%"
                margemDoVideo={30}
                audioUrl={`https://stimularmidias.blob.core.windows.net/midias/som-finalizado.mp3${tokenMidia}`}
                videoUrl={`https://stimularmidias.blob.core.windows.net/midias/4e5f30dc-d7d1-4931-a849-c2dd810c7967.mp4${tokenMidia}`}
            />
            <Titulo bold color='black' fontSize='3xl' mt='40%' mb='10%'>Responda sim ou não</Titulo>
            <Video
                source={{ uri: `https://stimularmidias.blob.core.windows.net/midias/5616f6e2-ca60-41c2-a7b3-15c0907b39b5.mp4${tokenMidia}` }}
                useNativeControls={false}
                style={{ width: '100%', height: 180 }}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping
                isMuted
            />
            <VStack>
                <Titulo padding='5%' color='black' textAlign='left' fontSize='lg'>Pergunta:</Titulo>
                <Titulo fontSize='md' mt='-10%' textAlign='left' bold color='black' padding='5%'>{grupoQuestionario.exercicio}</Titulo>
            </VStack>
            <VStack alignItems='center' position='absolute' bottom='15%' w='70%'>
                <Botao onPress={proximoExercicio}>Sim</Botao>
                <Botao onPress={handleNoPress} mt='5%'>Não</Botao>
            </VStack>
        </VStack>
    );
};

export default CadastroGrupo;

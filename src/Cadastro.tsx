import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Box, ScrollView, useToast } from 'native-base';
import { Titulo } from './componentes/Titulo';
import { EntradaTexto } from './componentes/EntradaTexto';
import { Botao } from './componentes/Botao';
import { secoes } from './utils/CadastroEntradaTexto';
import { ImagemLogo } from './componentes/ImagemLogo';
import { cadastrarPaciente } from './servicos/UserServico';
import { useNavigation } from '@react-navigation/native';
import { fazerLogin } from './servicos/AutenticacaoServico';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

export default function Cadastro({ navigation }) {
    const [numSecao, setNumSecao] = useState(0);
    const [dados, setDados] = useState<{ [key: string]: any }>({});

    const toast = useToast();

    const avancarSecao = () => {
        if (numSecao < secoes.length - 1) {
            setNumSecao(numSecao + 1);
        } else {
            cadastrar();
        }
    };

    const voltarSecao = () => {
        if (numSecao > 0) {
            setNumSecao(numSecao - 1);
        }
    };

    const atualizarDados = (id: string, valor: string) => {
        setDados((prevDados) => ({
            ...prevDados,
            [id]: valor,
        }));
    };

    const cadastrar = async () => {
       const hoje = new Date();
       const dia = hoje.getDate();
       const mes = hoje.getMonth();
       const ano = hoje.getFullYear();
       
       // Adicionar 7 dias
       hoje.setDate(dia + 7);
       
       // Criar uma nova data com o resultado
       const novaData = new Date(ano, mes, dia + 7);
       
       // Formatá-la como antes
       const diaNovo = String(novaData.getDate()).padStart(2, '0');
       const mesNovo = String(novaData.getMonth() + 1).padStart(2, '0');
       const anoNovo = novaData.getFullYear();
       
       const validade = `${diaNovo}/${mesNovo}/${anoNovo}`;

        const resultado = await cadastrarPaciente({
            email: dados.email,
            nome: dados.nome,
            telefone: dados.telefone,
            dataDeNascimento: dados.dataDeNascimento,
            senha: dados.senha,
            confirmarSenha: dados.confirmarSenha,
            tipoDeConta: 'Paciente',
            foto: 'https://stimularmidias.blob.core.windows.net/midias/6c0ab0a4-110f-4ce5-88c3-9c39ee10dba6.jpg',
            profissional: [
                {
                    idDoProfissional: "672243e4effa46003373d4f4",
                    nome: "Stimular"
                }
            ],
            validade: validade,
            moeda: {
                valor: 1,
                dataDeCriacao: new Date()
            },
            nivel: 1,
            ativo: true
        });

        if (resultado) {
            
            const resultado = await fazerLogin(dados.email, dados.senha);

            
  if (resultado) {
    const { token } = resultado;
    AsyncStorage.setItem('token', token);

    const tokenDecodificado = jwtDecode(token) as any;
    const id = tokenDecodificado.id;
    const tipoDeConta = tokenDecodificado.tipoDeConta;
    const grupoDoUser = tokenDecodificado.grupo; 

    console.log('Token Decodificado:', tokenDecodificado);
    console.log('ID:', id);
    console.log('Tipo de Conta:', tipoDeConta);
    console.log('Grupo do User:', grupoDoUser);

    AsyncStorage.setItem('id', id);
    AsyncStorage.setItem('tipoDeConta', tipoDeConta);
    AsyncStorage.setItem('grupoDoUser', JSON.stringify(grupoDoUser));

    if (Array.isArray(grupoDoUser) && grupoDoUser.length > 0) {
        console.log('Navegando para Tabs');
        navigation.replace('Tabs');
    } else {
        console.log('Navegando para Outra Tela');
        navigation.replace('CadastroGrupo');
    }
} else {
    Alert.alert('Alerta', 'Email ou senha inválidos');
    toast.show({
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos",
        backgroundColor: "roxoClaro",
    });
}
            
        } else {
            Alert.alert('Erro', 'Erro ao cadastrar o paciente. Tente novamente.');
        }
    };

    return (
        <DismissKeyboard>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    flex={1}
                    p={5}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                >
                    <ImagemLogo />
                    <Titulo mb={3}>{secoes[numSecao].titulo}</Titulo>
                    <Box>
                        {numSecao >= 0 && secoes[numSecao].entradaTexto.map(entrada => (
                            <EntradaTexto
                                label={entrada.label}
                                placeholder={entrada.placeholder}
                                key={entrada.id}
                                keyboardType={entrada.keyboardType}
                                secureTextEntry={entrada.secureTextEntry}
                                value={dados[entrada.name] || ''} // Usar '' se não houver valor
                                onChangeText={(text) => atualizarDados(entrada.name, text)}
                                type={entrada.type}
                            />
                        ))}
                    </Box>
                    {numSecao > 0 && <Botao onPress={voltarSecao}>Voltar</Botao>}
                    {numSecao >= 0 && (
                        <Botao mt={4} onPress={avancarSecao}>
                            {numSecao >= 3 ? 'Concluir' : 'Avançar'}
                        </Botao>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
}

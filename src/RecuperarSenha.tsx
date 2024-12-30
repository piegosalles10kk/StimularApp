import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { VStack } from 'native-base';
import { Titulo } from './componentes/Titulo';
import { EntradaTexto } from './componentes/EntradaTexto';
import { Botao } from './componentes/Botao';
import { tokenMidia } from './utils/token';
import { alterarSenhaRecuperacao, enviarCodigo, enviarEmail } from './servicos/UserServico';
import { ImagemLogo } from './componentes/ImagemLogo';
import ModalAtividade from './componentes/modalAtividades';



const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        {children}
    </TouchableWithoutFeedback>
);

export default function RecuperarSenha( {navigation}) {
    const [numSecao, setNumSecao] = useState(0);
    const [dados, setDados] = useState<{ [key: string]: any }>({} as any);
    const [modalVisivel, setModalVisivel] = useState(false);

    const recuperarSenhaPerguntas = [
        {
            id: 1,
            titulo: 'Informe o email cadastrado:',
            entradaTexto: [
                {
                    id: 1,
                    label: 'Email',
                    placeholder: 'Digite seu email',
                    name: 'email',
                    keyboardType: 'email-address'
                }
            ]
        },
        {
            id: 2,
            titulo: 'Insira o código de acesso enviado via email:',
            entradaTexto: [
                {
                    id: 1,
                    label: 'Código',
                    placeholder: 'Digite o Código',
                    name: 'token',
                    keyboardType: 'default'
                }
            ]
        },
        {
            id: 3,
            titulo: 'Crie uma nova senha:',
            entradaTexto: [
                {
                    id: 2,
                    label: 'Nova Senha',
                    placeholder: 'Digite sua nova senha',
                    name: 'senha',
                    secureTextEntry: true
                },
                {
                    id: 3,
                    label: 'Confirmar Senha',
                    placeholder: 'Confirme sua nova senha',
                    name: 'confirmarSenha',
                    secureTextEntry: true
                }
            ]
        }
    ];

    const avancarSecao1 = async () => {
        setModalVisivel(true);
        const email = dados.email;
        const emailResponse = await enviarEmail(email);
        if (emailResponse) {
            setNumSecao(numSecao + 1);
            setModalVisivel(false);
        } else {
            Alert.alert('Email não encontrado!');
        }
    };

    const avancarSecao2 = async () => {
        const email = dados.email;
        const codigo = dados.token;
        
        const codigoVerifyResponse = await enviarCodigo(email, codigo);
        if (codigoVerifyResponse) {
            setNumSecao(numSecao + 1);
        } else {
            Alert.alert('Código incorreto!');
        }
    };

    const avancarSecao3 = async () => {
        const email = dados.email;
        const codigo = dados.token;
        const senha = dados.senha;
        const confirmarSenha = dados.confirmarSenha;
        

        if (senha !== confirmarSenha) {
            Alert.alert('Senhas diferentes!');
        } else {
            const mudarSenha = await alterarSenhaRecuperacao({
                email: email,
                codigoRecuperarSenha: codigo,
                senha: senha,
                confirmarSenha: confirmarSenha
                
            })

            console.log(mudarSenha);
            
            if (mudarSenha) {
                Alert.alert('Senha alterada com sucesso!');
                navigation.replace('Login');
            }
            else {
                Alert.alert('Erro ao alterar senha!');
            }
        }
    };

    const atualizarDados = (id: string, valor: string) => {
        setDados((prevDados) => ({
            ...prevDados,
            [id]: valor,
        }));
    };

    return (
        <DismissKeyboard>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ModalAtividade
                bodyText="Aguarde um momento!"
                minimalText="Estamos enviando seu email de recuperação de senha!"
                detailsText="Jamais passe o codigo para outra pessoa!"
                isVisible={modalVisivel}
                onClose={() => setModalVisivel(false)}
                showCancelButton={false}
                width="100%"
                videoUrl={`https://stimularmidias.blob.core.windows.net/midias/aguardando${tokenMidia}`}
            />
                <VStack flex={1} bg="white" alignContent="center" alignItems="center" padding="10">
                    <ImagemLogo />
                    <VStack mt="10%">
                        {numSecao >= 0 && recuperarSenhaPerguntas[numSecao].entradaTexto.map(entrada => (
                            <VStack mr="10%" key={entrada.id}>
                                <Titulo fontSize="lg" mb="10%" textAlign="left" ml="6%" bold>
                                    {recuperarSenhaPerguntas[numSecao].titulo}
                                </Titulo>
                                <EntradaTexto
                                    label={entrada.label}
                                    placeholder={entrada.placeholder}
                                    keyboardType={entrada.keyboardType}
                                    secureTextEntry={entrada.secureTextEntry}
                                    value={dados[entrada.name] || ''} // Usar '' se não houver valor
                                    onChangeText={(text) => atualizarDados(entrada.name, text)}
                                />
                            </VStack>
                        ))}
                    </VStack>

                    {numSecao === 0 && (
                        <Botao alignSelf="center" onPress={avancarSecao1}>
                            Enviar
                        </Botao>
                    )}
                    {numSecao === 1 && (
                        <Botao alignSelf="center" onPress={avancarSecao2}>
                            Confirmar
                        </Botao>
                    )}
                    {numSecao === 2 && (
                        <Botao alignSelf="center" onPress={avancarSecao3}>
                            Alterar senha
                        </Botao>
                    )}
                </VStack>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
}

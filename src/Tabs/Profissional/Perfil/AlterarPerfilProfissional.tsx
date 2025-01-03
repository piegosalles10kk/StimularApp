import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, Modal, StyleSheet, Text } from 'react-native';
import { ScrollView, VStack, Avatar, HStack } from 'native-base';
import { avatares } from '../../../utils/Avatares';
import { UsuarioGeral } from '../../../interfaces/UsuarioGeral';
import { EntradaTexto } from '../../../componentes/EntradaTexto';
import { Botao } from '../../../componentes/Botao';
import { pegarDadosUsuario, atualizarPaciente } from '../../../servicos/UserServico';
import { tokenMidia } from '../../../utils/token';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const AlterarPerfilProfissional = ({ navigation }) => {
    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [dados, setDados] = useState({
        foto: '',
        nome: '',
        email: '',
        dataDeNascimento: '',
        telefone: '',
        informacoes: {
            formacao: '',
            descricao: '',
        }
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const Avatares = avatares;
    const [carregado, setCarregando] = useState(false);

    const fetchUserData = async () => {
        try {
            const usuarioID = await AsyncStorage.getItem('id');
            const token = await AsyncStorage.getItem('token');
            if (!usuarioID || !token) {
                console.error('Erro ao pegar ID ou token do usuário');
                return;
            }
            const resultado = await pegarDadosUsuario(usuarioID, token);
            if (resultado) {
                setDadosUsuario(resultado);
                setDados({
                    foto: resultado.user.foto,
                    nome: resultado.user.nome,
                    email: resultado.user.email,
                    dataDeNascimento: resultado.user.dataDeNascimento || '',
                    telefone: resultado.user.telefone,
                    informacoes: {
                        formacao: resultado.user.informacoes.formacao || '',
                        descricao: resultado.user.informacoes.descricao || '',
                    }
                });
                setCarregando(true);
            } else {
                console.error("Erro ao pegar os dados do usuário");
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const atualizarDados = (id: string, valor: string) => {
        if (id.startsWith('informacoes.')) {
            const field = id.split('.')[1];
            setDados(prevDados => ({
                ...prevDados,
                informacoes: {
                    ...prevDados.informacoes,
                    [field]: valor
                }
            }));
        } else {
            setDados(prevDados => ({ ...prevDados, [id]: valor }));
        }
    };

    const handleSalvar = async () => {
        try {
            const usuarioID = await AsyncStorage.getItem('id');
            const token = await AsyncStorage.getItem('token');
            const paciente: any = {
                foto: selectedAvatar || dados.foto,
                nome: dados.nome,
                email: dados.email,
                dataDeNascimento: dados.dataDeNascimento,
                telefone: dados.telefone,
                informacoes:{
                formacao: dados.informacoes.formacao,
                descricao: dados.informacoes.descricao
            }
            };

            console.log("Dados a serem enviados:", paciente);  // Log dos dados

            const resultado = await atualizarPaciente(paciente, usuarioID, token);
            if (resultado) {
                navigation.replace('Login');
            } else {
                Alert.alert("Erro ao atualizar os dados do usuário");
            }
        } catch (error) {
            console.error("Erro ao atualizar os dados do paciente:", error);
        }
    };

    return (
        <DismissKeyboard>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView flex={1} p={5} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <VStack alignItems='center' mt='10%'>
                        {carregado && (
                            <TouchableWithoutFeedback onPress={() => setShowModal(true)}>
                                <Avatar size='200' borderWidth='2' shadow='5' mb='5%' source={{ uri: selectedAvatar ? `${selectedAvatar}${tokenMidia}` : `${dados.foto}${tokenMidia}` }} />
                            </TouchableWithoutFeedback>
                        )}

                        {['nome', 'email', 'dataDeNascimento', 'telefone', 'formacao', 'descricao'].map((campo, index) => (
                            <EntradaTexto
                                key={index}
                                label={campo.charAt(0).toUpperCase() + campo.slice(1)}
                                placeholder={campo === 'formacao' ? dados.informacoes.formacao : (campo === 'descricao' ? dados.informacoes.descricao : dados[campo])}
                                value={campo === 'formacao' ? dados.informacoes.formacao : (campo === 'descricao' ? dados.informacoes.descricao : dados[campo])}
                                keyboardType={campo === 'email' ? 'email-address' : campo === 'telefone' ? 'phone-pad' : campo === 'dataDeNascimento' ? 'numeric' : 'default'}
                                type={campo === 'dataDeNascimento' ? 'data' : 'default'}
                                onChangeText={(text) => atualizarDados(campo === 'formacao' ? 'informacoes.formacao' : (campo === 'descricao' ? 'informacoes.descricao' : campo), text)}
                                multiline={campo === 'descricao' || campo === 'formacao' ? true : false}
                                tamanhoDoInput={campo === 'descricao' || campo === 'formacao' ?  200 : undefined}
                            />
                        ))}

                    </VStack>

                    <Botao mb='30%' onPress={handleSalvar}>Salvar</Botao>

                    <Modal visible={showModal} transparent animationType="slide">
                        <VStack style={styles.modalContainer}>
                            <VStack bg='white' p={5} borderRadius={10} style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Escolha seu novo Avatar</Text>
                                <ScrollView>
                                    {Array.from({ length: Math.ceil(Avatares.length / 3) }).map((_, rowIndex) => (
                                        <HStack key={rowIndex} justifyContent='center' mb={4}>
                                            {Avatares.slice(rowIndex * 3, rowIndex * 3 + 3).map((avatar, index) => (
                                                <TouchableWithoutFeedback key={index} onPress={() => {
                                                    console.log("Avatar selecionado:", avatar.imagemAvatar);
                                                    setSelectedAvatar(avatar.imagemAvatar);
                                                    setShowModal(false);
                                                }}>
                                                    <Avatar size='71' source={{ uri: `${avatar.imagemAvatar}${tokenMidia}` }} style={styles.avatar} />
                                                </TouchableWithoutFeedback>
                                            ))}
                                        </HStack>
                                    ))}
                                </ScrollView>
                                <Botao alignSelf='center' onPress={() => setShowModal(false)}>Fechar</Botao>
                            </VStack>
                        </VStack>
                    </Modal>

                </ScrollView>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
    },
    avatar: {
        margin: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default AlterarPerfilProfissional;

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, Modal, StyleSheet, Text } from 'react-native';
import { ScrollView, VStack, Avatar, HStack } from 'native-base';
import { avatares } from '../../../utils/Avatares';
import { UsuarioGeral } from '../../../interfaces/UsuarioGeral';
import { EntradaTexto } from '../../../componentes/EntradaTexto';
import { Botao } from '../../../componentes/Botao';
import { pegarDadosUsuario, atualizarPaciente } from '../../../servicos/PacienteServico';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);


const AlterarPerfil = ({ navigation }) => {
    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [dados, setDados] = useState({
        foto: '',
        nome: '',
        email: '',
        dataDeNascimento: '',
        telefone: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const Avatares = avatares;
    const [carregado, setCarregando ] = useState(false);

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
                //console.log("Dados do usuário recebidos:", resultado); // Log para verificar os dados recebidos
                setDadosUsuario(resultado);
                setDados({
                    foto: resultado.user.foto,
                    nome: resultado.user.nome,
                    email: resultado.user.email,
                    dataDeNascimento: resultado.user.dataDeNascimento || '',
                    telefone: resultado.user.telefone,
                }
            ); setCarregando(true);
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
        setDados(prevDados => ({ ...prevDados, [id]: valor }));
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
            };
            //console.log("Dados a serem salvos:", paciente); // Log para verificar os dados que estão sendo salvos
            const resultado = await atualizarPaciente(paciente, usuarioID, token);
            if (resultado) {
                Alert.alert('Sucesso', 'Dados do usuário atualizados com sucesso');
                navigation.replace('Tabs');
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
                            <Avatar size='200' borderWidth='2' shadow='5' source={{ uri: selectedAvatar || dados.foto }} />                        
                        </TouchableWithoutFeedback>
                    )}

                        {['nome', 'email', 'dataDeNascimento', 'telefone'].map((campo, index) => (
                            <EntradaTexto
                                key={index}
                                label={campo.charAt(0).toUpperCase() + campo.slice(1)}
                                placeholder={dados[campo]}
                                value={dados[campo]}
                                keyboardType={campo === 'email' ? 'email-address' : campo === 'telefone' ? 'phone-pad' : campo === 'dataDeNascimento' ? 'number-pad' : 'default'}
                                type={campo === 'dataDeNascimento' ? 'data' : 'default'}
                                onChangeText={(text) => atualizarDados(campo, text)}
                            />
                        ))}
                    </VStack>
                    <Botao onPress={handleSalvar}>Salvar</Botao>

                    {/* Modal para selecionar avatares */}
                    <Modal visible={showModal} transparent animationType="slide">
                        <VStack style={styles.modalContainer}>
                            <VStack bg='white' p={5} borderRadius={10} style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Escolha seu novo Avatar</Text>
                                <ScrollView>
                                    {Array.from({ length: Math.ceil(Avatares.length / 3) }).map((_, rowIndex) => (
                                        <HStack key={rowIndex} justifyContent='center' mb={4}>
                                            {Avatares.slice(rowIndex * 3, rowIndex * 3 + 3).map((avatar, index) => (
                                                <TouchableWithoutFeedback key={index} onPress={() => {
                                                    console.log("Avatar selecionado:", avatar.imagemAvatar); // Log para confirmar qual avatar foi selecionado
                                                    setSelectedAvatar(avatar.imagemAvatar);
                                                    setShowModal(false);
                                                }}>
                                                    <Avatar size='71' source={{ uri: avatar.imagemAvatar }} style={styles.avatar} />
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

export default AlterarPerfil;

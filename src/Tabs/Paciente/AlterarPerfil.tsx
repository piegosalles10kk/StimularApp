import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Box, ScrollView, VStack, Avatar } from 'native-base';
import { UsuarioGeral } from '../../interfaces/UsuarioGeral';
import { EntradaTexto } from '../../componentes/EntradaTexto';
import { Botao } from '../../componentes/Botao';
import { pegarDadosUsuario, atualizarPaciente } from '../../servicos/PacienteServico';

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
                });
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

            const paciente = {
                foto: dados.foto,
                nome: dados.nome,
                email: dados.email,
                dataDeNascimento: dados.dataDeNascimento,
                telefone: dados.telefone,
            };

            // Logs
            console.log('Dados do paciente a serem enviados:', JSON.stringify(paciente, null, 2));

            const resultado = await atualizarPaciente(paciente, usuarioID, token);
            if (resultado) {
                Alert.alert('Sucesso', 'Dados atualizados com sucesso');
                navigation.replace('Tabs');
            } else {
                Alert.alert("Erro ao atualizar os dados do paciente");
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
                        {/* Exibir o Avatar */}
                        <Avatar size='200' source={{ uri: dados.foto }} />
                        {/* Mapear os campos para exibição */}
                        {['nome', 'email', 'dataDeNascimento', 'telefone'].map((campo, index) => (
                            <EntradaTexto
                                key={index}
                                label={campo.charAt(0).toUpperCase() + campo.slice(1)} // Capitaliza a primeira letra
                                placeholder={dados[campo]} // Usa o valor atual como placeholder
                                value={dados[campo]} // Mantém valor do estado
                                keyboardType={campo === 'email' ? 'email-address' : campo === 'telefone' ? 'phone-pad' : 'default'}
                                onChangeText={(text) => atualizarDados(campo, text)} // Atualiza o estado
                            />
                        ))}
                    </VStack>
                    <Botao onPress={handleSalvar}>Salvar</Botao>
                </ScrollView>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
};

export default AlterarPerfil;

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, Modal, StyleSheet, Text } from 'react-native';
import { FlatList, VStack, Avatar, HStack, Select, CheckIcon, ScrollView, Checkbox } from 'native-base';
import { avatares } from '../../../utils/Avatares';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UsuarioGeral } from '../../../interfaces/UsuarioGeral';
import { EntradaTexto } from '../../../componentes/EntradaTexto';
import { Botao } from '../../../componentes/Botao';
import { pegarDadosUsuario, atualizarPaciente, desativarConta } from '../../../servicos/UserServico';
import { tokenMidia } from '../../../utils/token';
import { useRoute } from '@react-navigation/native';
import { Titulo } from '../../../componentes/Titulo';
import * as ImagePicker from 'expo-image-picker';
import { enviarFotoDePerfil } from '../../../servicos/UploadServicos';
import ModalTemplate from '../../../componentes/Modal';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const AlterarPerfilAdmin = ({ navigation }) => {
    const route = useRoute();
    const { id } = route.params as { id: string };

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [dados, setDados] = useState({
        foto: '',
        tipoDeConta: '',
        nome: '',
        email: '',
        dataDeNascimento: '',
        telefone: '',
        nivel: '',
        grupo: [],
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [modal2, setModal2] = useState(false);
    const Avatares = avatares;
    const [carregado, setCarregando] = useState(false);
    const tiposDeConta = ['Admin', 'Paciente', 'Profissional'];
    const niveis = [1, 2, 3, 4, 5, 6];
    const grupoOpcoes = ['TEA', 'TOD', 'TDAH'];

    const fetchUserData = async () => {
        try {
            const usuarioID = id;
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
                    tipoDeConta: resultado.user.tipoDeConta,
                    nome: resultado.user.nome,
                    email: resultado.user.email,
                    dataDeNascimento: resultado.user.dataDeNascimento || '',
                    telefone: resultado.user.telefone,
                    nivel: resultado.user.nivel,
                    grupo: resultado.user.grupo || [],
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
        setDados(prevDados => ({ ...prevDados, [id]: valor }));
    };

    const handleCheckboxChange = (value: string) => {
        setDados(prevDados => {
            const grupoAtualizado = prevDados.grupo.includes(value)
                ? prevDados.grupo.filter(grupo => grupo !== value)
                : [...prevDados.grupo, value];

            return { ...prevDados, grupo: grupoAtualizado };
        });
    };

    const handleImageSelection = async () => {
        Alert.alert(
            'Selecione uma Opção',
            'Escolha de onde você quer pegar a imagem',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Câmera',
                    onPress: () => handleCameraOpen(),
                },
                {
                    text: 'Galeria',
                    onPress: () => handleGalleryOpen(),
                },
            ],
            { cancelable: true }
        );
    };
    
    const handleCameraOpen = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão para acessar a câmera é necessária!');
            return;
        }
    
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) {
            await processImage(result);
        }
    };
    
    const handleGalleryOpen = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão para acessar a galeria é necessária!');
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) {
            await processImage(result);
        }
    };
    
    const processImage = async (result) => {
        const source = {
            uri: result.assets[0].uri,
            type: result.assets[0].type || 'image/jpeg',
            fileName: result.assets[0].fileName || 'photo.jpg'
        };
    
        const userId = dados.email
        console.log('ID do usuário:', userId);
    
        const response = await enviarFotoDePerfil(userId, source);
    
        if (response) {
            setSelectedAvatar(response.url);
            Alert.alert('Imagem enviada com sucesso!');
        } else {
            Alert.alert('Erro ao enviar a imagem');
        }
    
        setShowModal(false);
    };
    
    
    
    const abrirModal2 =  () => {
        setModal2(true);
    };

    const apagarUsuario =  async () => {
        try {
            const usuarioId = id;
            const token = await AsyncStorage.getItem('token');
            const resultado = await desativarConta(usuarioId, token);
            if (resultado) {
                alert("Usuário apagado com sucesso!");
                navigation.replace('Login');
            } else {
                Alert.alert("Erro ao apagar o usuário");
            }
    }catch (error) {
            console.error("Erro ao apagar o usuário:", error);
        }
}


    

    const handleSalvar = async () => {
        try {
            const usuarioID = id;
            const token = await AsyncStorage.getItem('token');
            const paciente: any = {
                foto: selectedAvatar || dados.foto,
                tipoDeConta: dados.tipoDeConta,
                nome: dados.nome,
                email: dados.email,
                dataDeNascimento: dados.dataDeNascimento,
                telefone: dados.telefone,
                nivel: dados.nivel,
                grupo: dados.grupo,
            };

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

    const renderItem = ({ item }) => {
        if (item === "selectTipoDeConta") {
            return (
                <Select
                    selectedValue={dados.tipoDeConta}
                    minWidth="80%"
                    mb='10%'
                    placeholder="Selecione o Tipo de Conta"
                    onValueChange={(itemValue) => atualizarDados('tipoDeConta', itemValue)}
                    _selectedItem={{
                        bg: "roxoClaro",
                        endIcon: <CheckIcon size="5" />
                    }}>
                    {tiposDeConta.map((tipo, index) => (
                        <Select.Item label={tipo} value={tipo} key={index} />
                    ))}
                </Select>
            );
        } else if (item === "selectNivel") {
            return (
                <VStack>
                    <Titulo>Ano(s) de atraso</Titulo>
                    <Select
                        selectedValue={dados.nivel.toString()}
                        minWidth="80%"
                        placeholder="Selecione a idade de atraso"
                        onValueChange={(itemValue) => atualizarDados('nivel', itemValue)}
                        _selectedItem={{
                            bg: "roxoClaro",
                            endIcon: <CheckIcon size="5" />
                        }}>
                        {niveis.map((nivel, index) => (
                            <Select.Item label={nivel.toString()} value={nivel.toString()} key={index} />
                        ))}
                    </Select>
                </VStack>
            );
        } else if (item === "grupo") {
            return (
                <VStack mt='5%'>
                    <Titulo textAlign='start'>Selecione os Grupos</Titulo>
                    <VStack space={2} mt={4} flexDir='row'>
                        {grupoOpcoes.map((grupo, index) => (
                            <Checkbox
                                padding='2%'
                                key={index}
                                isChecked={dados.grupo.includes(grupo)}
                                onChange={() => handleCheckboxChange(grupo)}
                                value='pronto'
                                colorScheme='purple'>
                                {grupo}
                            </Checkbox>
                        ))}
                    </VStack>
                </VStack>
            );
        } else {
            return (
                <EntradaTexto
                    label={item.charAt(0).toUpperCase() + item.slice(1)}
                    placeholder={dados[item]}
                    value={dados[item]}
                    keyboardType={item === 'email' ? 'email-address' : item === 'telefone' ? 'phone-pad' : item === 'dataDeNascimento' ? 'numeric' : 'default'}
                    type={item === 'dataDeNascimento' ? 'data' : 'default'}
                    onChangeText={(text) => atualizarDados(item, text)}
                />
            );
        }
    };

    return (
        <DismissKeyboard>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <FlatList
            data={['nome', 'email', 'dataDeNascimento', 'telefone', 'selectTipoDeConta', 'selectNivel', 'grupo']}
            keyExtractor={(item) => item}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center' }}
            renderItem={renderItem}
            ListHeaderComponent={(
                <VStack alignItems='center' mt='10%'>
                    {carregado && (
                        <TouchableWithoutFeedback onPress={() => setShowModal(true)}>
                            <Avatar size='200' borderWidth='2' shadow='5' mb='5%' source={{ uri: selectedAvatar ? `${selectedAvatar}${tokenMidia}` : `${dados.foto}${tokenMidia}` }} />
                        </TouchableWithoutFeedback>
                    )}
                </VStack>
            )}
        />
        <ModalTemplate
            bodyText="Você deseja apagar esse usuario permanentemente?" 
            confirmButtonText="Apagar"
            onConfirm={apagarUsuario}
            isVisible={modal2}
            onClose={() => setModal2(false)}
        /> 
        <Botao alignSelf='center' onPress={handleSalvar}>Salvar</Botao>
        <Botao alignSelf='center' mb='30%' onPress={abrirModal2}>Apagar conta</Botao>
        <Modal visible={showModal} transparent animationType="slide">
            <VStack style={styles.modalContainer}>
                <VStack bg='white' p={5} borderRadius={10} style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Escolha seu novo Avatar</Text>
                    <ScrollView>
                        <HStack justifyContent='center' mb={4}>
                            <TouchableWithoutFeedback onPress={handleImageSelection}>
                                <VStack alignItems='center'>
                                    <Icon name="camera" size={50} color="gray" />
                                    <Text style={{ fontSize: 16 }}>Selecionar outra foto</Text> {/* Corrigido aqui */}
                                </VStack>
                            </TouchableWithoutFeedback>
                        </HStack>
                        {Array.from({ length: Math.ceil(Avatares.length / 3) }).map((_, rowIndex) => (
                            <HStack key={rowIndex} justifyContent='center' mb={4}>
                                {Avatares.slice(rowIndex * 3, rowIndex * 3 + 3).map((avatar, index) => (
                                    <TouchableWithoutFeedback key={index} onPress={() => {
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

export default AlterarPerfilAdmin;

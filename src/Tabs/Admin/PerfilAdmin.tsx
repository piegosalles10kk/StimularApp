import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VStack, Spinner, Text } from "native-base";
import { Botao } from "../../componentes/Botao";
import { ImagemLogo } from "../../componentes/ImagemLogo";
import { pegarDadosUsuarioGeral } from "../../servicos/UserServico";
import EditableModal from "../../componentes/BotaoModal";
import { WebView } from 'react-native-webview';

export default function PerfilAdmin({ navigation }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    console.error('Erro ao pegar o token');
                    return;
                }

                const result = await pegarDadosUsuarioGeral(token);
                if (result && result.users) {
                    setIsLoaded(true);
                } else {
                    console.error('Erro ao pegar os grupos de atividades');
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const logout = async () => {
        await AsyncStorage.removeItem('id');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('tipoDeConta');
        navigation.replace('Login');
    };

    const editProfile = async () => {
        const userId = await AsyncStorage.getItem('id');
        navigation.navigate('AlterarPerfilAdmin', { id: userId });
    };

    const handleCancel = () => setModalVisible(false);

    return (
        <VStack flex={1} alignItems='center' bg='white'>
            <ImagemLogo
                style={{
                    marginTop: '5%',
                    width: 200,
                    height: 150,
                }}
            />
            <Botao mb='-5%' onPress={editProfile}>Editar minha conta</Botao>
            <EditableModal
                botao="Sair da conta"
                bodyText="Ao clicar em sim você irá sair da sua conta. Tem certeza que deseja continuar?"
                confirmButtonText="Sim"
                cancelButtonText="Não"
                onConfirm={logout}
                onCancel={handleCancel}
            />
            
            {isLoaded && (
                <VStack flex={1} width="100%">
                    {loading && <Spinner size="lg" />}
                    <WebView
                        source={{ uri: 'http://167.88.33.130:3000/usuarios' }}
                        style={{ width: 'auto', height: '100%', marginTop: '-30%' }}
                        onLoad={() => setLoading(false)}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.warn('WebView error: ', nativeEvent);
                            setError('Ocorreu um erro ao carregar a página.');
                            setLoading(false);
                        }}
                    />
                    {error && <Text color="red.500">{error}</Text>}
                </VStack>
            )}
        </VStack>
    );
}

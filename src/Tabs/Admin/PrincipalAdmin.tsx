import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VStack, Spinner, Text } from "native-base";
import { Titulo } from "../../componentes/Titulo";
import { apagarGrupoDeAtividades, pegarGruposAtividadesGeralAdmin } from "../../servicos/GrupoAtividadesServicos";
import { ImagemLogo } from "../../componentes/ImagemLogo";
import WebView from "react-native-webview";

export default function PrincipalAdmin({ navigation }) {
    const [grupoAtividades, setGrupoAtividades] = useState([]);
    const [carregado, setCarregando] = useState(false);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    const apagarAtividade = async (idDaAtividade) => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.error('erro ao pegar o token');
            return;
        }

        const resultado = await apagarGrupoDeAtividades(idDaAtividade, token);
        if (resultado) {
            alert('Atividade apagada com sucesso!');
            navigation.replace('Login');
        } else {
            console.log('erro ao apagar atividade');
        }
    };

    useEffect(() => {
        async function dadosAtividades() {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('erro ao pegar o token');
                return;
            }

            const resultado = await pegarGruposAtividadesGeralAdmin(token);
            if (resultado) {
                setGrupoAtividades(resultado.grupos);
                setCarregando(true);
            } else {
                console.log('erro ao pegar os grupos de atividades');
            }
        }

        dadosAtividades();
    }, []);

    return (
        <VStack flex={1} alignItems='center' bg='white'>
            <ImagemLogo style={{ marginTop: '5%', width: 200, height: 150 }} />
            {carregado ? (
                <VStack flex={1} width="100%">
                    {loading && <Spinner size="lg" />}
                    <WebView
                        source={{ uri: 'http://167.88.33.130:3000/atividades' }}
                        style={{ width: 'auto', height: '100%', marginTop: '-25%' }}
                        onLoad={() => setLoading(false)}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.warn('WebView error: ', nativeEvent);
                            setErro('Ocorreu um erro ao carregar a página.');
                            setLoading(false);
                        }}
                    />
                    {erro ? <Text color="red.500">{erro}</Text> : null}
                </VStack>
            ) : (
                <VStack alignItems='center'>
                    <Titulo>Teste</Titulo>
                </VStack>
            )}
        </VStack>
    );
}

import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VStack, ScrollView } from "native-base";
import { Botao } from "../../componentes/Botao";
import CardAtividadeAdmin from "../../componentes/CardAtividadeAdmin";
import { tokenMidia } from "../../utils/token";
import { Titulo } from "../../componentes/Titulo";
import { ImagemLogo } from "../../componentes/ImagemLogo";
import { pegarDadosUsuarioProfissional } from "../../servicos/UserServico";
import { UsuarioGeral2 } from "../../interfaces/UsuarioGeral";
import EditableModal from "../../componentes/BotaoModal";
import { EntradaTexto } from "../../componentes/EntradaTexto";

export default function PrincipalProfissional({ navigation }) {
    const [grupoUsuario, setGrupoUsuarios] = useState([] as UsuarioGeral2[]);
    const [carregado, setCarregando] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState(""); // Estado para texto de pesquisa

    useEffect(() => {
        async function dadosUsuario() {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                console.error('erro ao pegar o token');
                return;
            }

            const resultado = await pegarDadosUsuarioProfissional(token);

            if (resultado && resultado.users) {
                setGrupoUsuarios(resultado.users);
                setCarregando(true);
            } else {
                console.log('erro ao pegar os grupos de atividades');
            }
        }

        dadosUsuario();
    }, []);

    function deslogar() {
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('tipoDeConta');
        navigation.replace('Login');
    }

    const editarMeuPerfil = async () => {
        const usuarioId = await AsyncStorage.getItem('id');
        navigation.navigate('AlterarPerfilAdmin', { id: usuarioId });
    }

    const handleCancel = () => {
        setModalVisible(false);
    }

    // Função para filtrar e ordenar usuários
    const filteredUsuarios = grupoUsuario
        .filter(usuario =>
            usuario.nome.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a, b) => b.nome.localeCompare(a.nome)); // Ordena em ordem decrescente

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <ImagemLogo
                style={{
                    marginTop: '5%',
                    width: 200,
                    height: 150,
                }}
            />

            <VStack alignItems='center'>
                <Titulo bold color='black' padding='2%'>Seus pacientes</Titulo>

                <VStack alignItems='center' mt='5%'>
                <EntradaTexto 
                    placeholder="Buscar por nome"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                </VStack>

                {carregado && (
                    <VStack alignItems='center'>
                        {filteredUsuarios.map((usuario) => (
                            <CardAtividadeAdmin
                                key={usuario._id}
                                titulo={usuario.nome}
                                icon="table"
                                descricao={`Grupo: ${usuario.grupo} ${usuario.nivel} ano(s)`}
                                avatarUri={usuario.foto || `https://stimularmidias.blob.core.windows.net/midias/6c0ab0a4-110f-4ce5-88c3-9c39ee10dba6.jpg${tokenMidia}`}
                                onPress={() => navigation.navigate('DadosUsuario', { id: usuario._id })}
                                id={usuario._id}
                                buttonVisible={true}
                            />
                        ))}
                    </VStack>
                )}
            </VStack>
        </ScrollView>
    );
}

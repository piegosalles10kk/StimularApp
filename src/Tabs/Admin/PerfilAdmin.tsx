import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VStack, ScrollView } from "native-base";
import { Botao } from "../../componentes/Botao";
import CardAtividadeAdmin from "../../componentes/CardAtividadeAdmin";
import { tokenMidia } from "../../utils/token";
import { Titulo } from "../../componentes/Titulo";
import { ImagemLogo } from "../../componentes/ImagemLogo";
import { pegarDadosUsuarioGeral } from "../../servicos/UserServico";
import { UsuarioGeral2 } from "../../interfaces/UsuarioGeral";
import EditableModal from "../../componentes/BotaoModal";

export default function PerfilAdmin({ navigation }) {
    const [grupoUsuario, setGrupoUsuarios] = useState([] as UsuarioGeral2[]);
    const [carregado, setCarregando] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        async function dadosUsuario() {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('erro ao pegar o token');
                return;
            }

            const resultado = await pegarDadosUsuarioGeral(token);

            if (resultado && resultado.users) {
                setGrupoUsuarios(resultado.users);
                setCarregando(true);
                //console.log(resultado.users);
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
      };
      

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
                <Titulo bold color='black' padding='2%'>Contas cadastradas</Titulo>

                

                {carregado && (
                    <VStack alignItems='center'>
                        {grupoUsuario.map((usuario) => (
                            <CardAtividadeAdmin
                                key={usuario._id}
                                titulo={usuario.nome}
                                descricao={`Tipo de conta: (${usuario.tipoDeConta}) \nGrupo: ${usuario.grupo} ${usuario.nivel} ano(s)`}
                                avatarUri={usuario.foto || `https://stimularmidias.blob.core.windows.net/midias/6c0ab0a4-110f-4ce5-88c3-9c39ee10dba6.jpg${tokenMidia}`}
                                onPress={() => navigation.navigate('AlterarPerfilAdmin', { id: usuario._id })}
                                id={usuario._id}
                                buttonVisible={true}
                            />
                        ))}
                    </VStack>
                )}

                <Botao mb='-5%' onPress={editarMeuPerfil}>Editar conta</Botao>
                <EditableModal
                    botao="Sair da conta"
                    bodyText="Ao clicar em sim voce irá sair da sua conta. Tem certeza que deseja continuar?"
                    confirmButtonText="Sim"
                    cancelButtonText="Não"
                    onConfirm={deslogar}
                    onCancel={handleCancel}
                    />
            </VStack>
        </ScrollView>
    );
}

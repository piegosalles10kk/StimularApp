import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VStack, ScrollView } from "native-base";
import { Titulo } from "../../componentes/Titulo";
import CardAtividadeAdmin from "../../componentes/CardAtividadeAdmin";
import { GrupoAtividades } from "../../interfaces/UsuarioGeral";
import { apagarGrupoDeAtividades, pegarGruposAtividadesGeralAdmin } from "../../servicos/GrupoAtividadesServicos";
import { tokenMidia } from "../../utils/token";
import { ImagemLogo } from "../../componentes/ImagemLogo";
import ModalTemplate from "../../componentes/Modal";

export default function PrincipalAdmin({ navigation }) {
    const [grupoAtividades, setGrupoAtividades] = useState({} as GrupoAtividades[]);
    const [carregado, setCarregando] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [idDaAtividade, setIdDaAtividade] = useState('');

    const apagarAtividade = async () => {
        console.log("ta apagando calma!");
        const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('erro ao pegar o token');
                return;
            }

            const resultado = await apagarGrupoDeAtividades(idDaAtividade, token);

            if (resultado) {
                setModalVisible(false);
                alert('Atividade apagada com sucesso!');
                navigation.replace('Login');
                //console.log('Atividade apagada com sucesso!');
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
                //console.log(resultado.grupos);
            } else {
                console.log('erro ao pegar os grupos de atividades');
            }
        } 
        dadosAtividades();
    }, []);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            
                
            <VStack flex={1}>
                    <ImagemLogo
                    style={{
                        marginTop: '5%',
                        width: 200,
                        height: 150,
                      }}
                    />
                
                <VStack >
                    <Titulo bold color='black' padding='2%'>Grupos de atividades cadastradas</Titulo>
                </VStack>

                <ModalTemplate
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    confirmButtonText="Sim"
                    onConfirm={apagarAtividade}
                    cancelButtonText="Nao"
                    bodyText="Ao clicar em sim, essa atividade será apagada permanetemente, deseja continuar?"
                />

                {carregado && (
                    <VStack alignItems='center'>
                        {grupoAtividades.map((atividade, index) => (
                            <CardAtividadeAdmin
                                key={atividade._id}
                                titulo={atividade.nomeGrupo}
                                descricao={`${atividade.dominio} ${atividade.nivelDaAtividade} ano(s)`}
                                avatarUri={`${atividade.imagem}`}
                                onPress={() => {
                                    setModalVisible(true);
                                    setIdDaAtividade(atividade._id);
                                  }}
                                  
                                id={atividade.id}
                                buttonVisible={true}
                                icon='trash'
                            />
                        ))}
                    </VStack>
                )}
            </VStack>
        </ScrollView>
    );
}

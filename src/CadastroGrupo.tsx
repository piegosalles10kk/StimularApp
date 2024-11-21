import { VStack, Text } from "native-base";
import { useRoute } from '@react-navigation/native';
import { Titulo } from "./componentes/Titulo";
import EditableModal from "./componentes/BotaoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export default function CadastroGrupo({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    

    function deslogar(){
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('tipoDeConta');
        alert('Deslogado com sucesso');
        
        navigation.replace('Login');
    }

    const handleCancel = () => {
        setModalVisible(false);
      };

    return (
        <VStack>
            <Titulo mt='10%'>Vamo começar paizão</Titulo>
             
            <VStack alignSelf='center'>
            <EditableModal
                botao="Sair da conta                      "
                bodyText="Ao clicar em sim voce irá sair da sua conta. Tem certeza que deseja continuar?"
                confirmButtonText="Sim"
                cancelButtonText="Não"
                onConfirm={deslogar}
                onCancel={handleCancel}
                />
            </VStack>
        </VStack>

        
    );
}

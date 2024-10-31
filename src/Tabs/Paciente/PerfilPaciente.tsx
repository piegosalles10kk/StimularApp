import AsyncStorage from "@react-native-async-storage/async-storage";
import { VStack, Text } from "native-base";
import { Botao } from "../../componentes/Botao";

export default function PerfilPaciente({ navigation }) {

    function deslogar(){
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('tipoDeConta');
        alert('Deslogado com sucesso');
        
        navigation.replace('Login');
    }
    return (
        <VStack>
            <Botao onPress={deslogar}>Deslogar</Botao>
        </VStack>
    );
}
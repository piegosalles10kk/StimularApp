import { VStack, Text } from "native-base";
import { useRoute } from '@react-navigation/native';
import { Titulo } from "../../../componentes/Titulo";

export default function ExercicioTela({ navigation }) {

    interface RouteParams {
        id: any;
        atividadeId: string;
      }

    const route = useRoute(); // Obtendo a rota
    const  id  = (route.params as RouteParams).id;
    console.log(id);
    

    return (
        <VStack>
            <Titulo mt='10%'>{`Exercicio tela id: ${id}`}</Titulo>
        </VStack>
    );
}

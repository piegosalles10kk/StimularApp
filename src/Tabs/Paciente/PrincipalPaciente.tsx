import AsyncStorage from "@react-native-async-storage/async-storage";
import {  HStack, ScrollView, VStack} from "native-base";
import { useEffect, useState } from "react";
import { pegarDadosUsuario } from "../../servicos/PacienteServico";
import { UsuarioGeral } from "../../interfaces/UsuarioGeral";
import { Botao } from "../../componentes/Botao";
import { Titulo } from "../../componentes/Titulo";
import { ImagemLogo } from "../../componentes/ImagemLogo";
import Conquista from "../../componentes/Conquista";

export default function PrincipalPaciente({ navigation }) {

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [carregado, setCarregando ] = useState(false);

    useEffect(() => {
        async function dadosUsuario(){            
        const usuarioID = await AsyncStorage.getItem('id');
        if(!usuarioID) {
            console.error('erro ao pegar o id do usario');
        };
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('erro ao pegar o token');
        }
        const resultado = await pegarDadosUsuario(usuarioID, token);
        if(resultado){
            setDadosUsuario(resultado);                        
        }else{
            console.error("erro ao pegar os dados do usuario");           
        }
        setCarregando(true);
    }
    dadosUsuario();    
}, [])


    return (
        <ScrollView>
        <VStack>
            <ImagemLogo
                style={{
                    marginTop: '10%',
                    width: 200,
                    height: 150,
                  }}
            />
            {carregado && 
                <Titulo
                    fontSize='2xl'
                    marginLeft='10%'
                    textAlign="left"
                    fontWeight="bold"
                    color="black"
                    >{`Olá, ${dadosUsuario?.user?.nome.split(' ')[0]}`}
                    </Titulo>                                       
                    }

                   <VStack
                     mt='5%'
                     alignSelf={"center"}
                     padding='5'
                     flexDirection='column' 
                     flex={1}
                     borderWidth={3}
                     borderRadius={20}>
                     <Titulo textAlign='center' fontSize='xl'>Suas conquistas</Titulo>
                     <HStack
                       padding="2%"
                       backgroundColor='roxoClaro'
                       mt='1%'
                       alignSelf={"center"} 
                       flex={1}
                       borderWidth={1}
                       borderRadius={10}>
                    <Conquista
                        uri="https://i.postimg.cc/7L8d3Nrs/Avatar23.png"
                        titulo="Conquista 2"
                        avatarStyle={{ borderWidth: 1, borderColor: 'black' }}
                        
                    />
                    <Conquista
                        uri="https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_avatar_child_kid-512.png"
                        titulo="Conquista 1"
                        avatarStyle={{ borderWidth: 1, borderColor: 'black' }}
                        
                    /> 

                     <Conquista
                        uri="https://cdn.icon-icons.com/icons2/1736/PNG/512/4043238-avatar-boy-kid-person_113284.png"
                        titulo="Conquista 3"
                        avatarStyle={{ borderWidth: 1, borderColor: 'black' }}
                        
                    />              
                     </HStack>
                   </VStack>
        </VStack>
        </ScrollView>
    );
}
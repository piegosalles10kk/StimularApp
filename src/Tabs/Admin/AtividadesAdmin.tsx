import { VStack, Text, HStack } from "native-base";
import { Botao } from "../../componentes/Botao";
import { Titulo } from "../../componentes/Titulo";
import { useEffect, useState } from "react";
import { UsuarioGeral } from "../../interfaces/UsuarioGeral";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pegarDadosUsuarioGeral } from "../../servicos/UserServico";
import { pegarGruposAtividadesGeralAdmin } from "../../servicos/GrupoAtividadesServicos";
import { ImagemLogo } from "../../componentes/ImagemLogo";

export default function AtividadesAdmin({ navigation }) {

const [quantidadeUsuarios, setQuantidadeUsuarios] = useState(0);
const [quantidadeAtividades, setQuantidadeAtividades] = useState(0);


    useEffect(() => {
        async function dadosUsuario() {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('erro ao pegar o token');
                return;
            }

            const resultado = await pegarDadosUsuarioGeral(token);
                setQuantidadeUsuarios(resultado? resultado.users.length : '0');


            const resultado2 = await pegarGruposAtividadesGeralAdmin(token);
                setQuantidadeAtividades(resultado2 ? resultado2.grupos.length : '0');
        }

        
        dadosUsuario();
    }, []);


    return (
        <VStack flex={1} alignItems='center'>
            <VStack mt='20%'>
            <ImagemLogo
                style={{
                    marginTop: '5%',
                    width: 200,
                    height: 150,
                }}
            />
            </VStack>

            <VStack flexDirection='row' mt='20%'>

            <VStack borderWidth='2' w='40%' h='80%' mr='5%' borderRadius='5%' borderColor='black'>

                <VStack >
                    <Titulo textAlign='center' fontSize='xl' bold color='black'>Contas cadastrados</Titulo>
                    <Titulo highlight bold color='red.500'>{quantidadeUsuarios}</Titulo>
                    
                </VStack>

                <Botao w='90%' h='40%' alignSelf='center'  onPress={() => navigation.navigate('CriarUsuarioAdmin')}>Criar usuário</Botao>
            </VStack> 

            <VStack borderWidth='2' w='40%' h='80%' borderRadius='5%'>  

                <VStack >
                    <Titulo textAlign='center' fontSize='xl' bold color='black'>Atividades cadastradas</Titulo>
                    <Titulo highlight bold color='red.500'>{quantidadeAtividades}</Titulo>
                    
                </VStack> 
                <Botao w='90%' h='40%' mr ='5%' alignSelf='center' onPress={() => navigation.navigate('CriarAtividade')}ml='5%' >Criar atividade</Botao>
            </VStack> 
            </VStack>

        </VStack>
    );
}
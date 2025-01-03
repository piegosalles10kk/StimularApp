import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from 'react-native';
import { VStack, View, ScrollView, Avatar, HStack, Modal, Image } from "native-base";
import { useEffect, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';

//Api
import { pegarDadosUsuario, pegarDadosUsuarioProfissional } from "../../../servicos/UserServico";
import {  UsuarioGeral } from "../../../interfaces/UsuarioGeral";
import { Titulo } from "../../../componentes/Titulo";
import { diagnosticos } from "../../../utils/Diagnosticos";
import EditableModal from "../../../componentes/BotaoModal";
import { tokenMidia } from "../../../utils/token";


export default function PerfilProfissional({ navigation }) {

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);

    const [carregado, setCarregando ] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [totalPacientes, setTotalPacientes] = useState(0);
    
    const renderizados = new Set();

    const handleCancel = () => {
        setModalVisible(false);
      };

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
        const resultadoPacientes = await pegarDadosUsuarioProfissional(token);

        setTotalPacientes(resultadoPacientes.users.length);
        
         

        if(resultado){
            setDadosUsuario(resultado);
            //console.log(resultado);                                           
        }else{
            console.error("erro ao pegar os dados do usuario");           
        }
        setCarregando(true);
    }
    dadosUsuario(); 
       
}, [])


    function deslogar(){
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('tipoDeConta');

        navigation.replace('Login');
    }
    
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {carregado &&           
            <VStack alignItems='center' mt='-3%'>
            
            <VStack
                maxHeight='30%' 
                maxWidth='100%' 
            >
                <HStack
                    mb='5%'
                    alignItems='center'
                    justifyContent='space-between'
                    width='100%'
                    position='relative'
                    maxHeight='90%' 
                    maxWidth='100%' 
                    zIndex={1}>
                        

                            <Image
                                maxHeight='100%'
                                maxWidth='100%' 
                                marginBottom='-5%'
                                    
                                    style={{
                                        flex: 1,
                                        minWidth: 100, 
                                        aspectRatio: 1,
                                        resizeMode: 'cover',
                                        
                                    }}
                                    source={{ uri: `https://stimularmidias.blob.core.windows.net/midias/bgprofissional${tokenMidia}` }}
                                    alt={'diagnostico?.nome'}
                                />
    
                    <Avatar
                        source={{ uri: `${dadosUsuario?.user?.foto}${tokenMidia}` }}
                        style={{ width: 180, height: 180 }}
                        position='absolute'
                        top='50%'
                        left='26%'
                        alignSelf='center'
                        borderWidth='2'
                        borderColor='roxoClaro'
                    />
                </HStack>


                </VStack>

            <VStack flexDirection='row' mt='15%'>
            <Titulo
            mt='2%'
            bold
            color='black'
            >{dadosUsuario?.user?.nome}</Titulo>

            <TouchableOpacity onPress={() => navigation.navigate('AlterarPerfilProfissional')} activeOpacity={0.7}>
                <Ionicons name='create-outline' size={24} alignSelf='center' marginLeft='3%'/>
            </TouchableOpacity>
            
            </VStack>
            
            <Titulo bold color='black' fontSize='md'>{`${dadosUsuario?.user?.grupo?.join(' | ')} Stimular`}</Titulo>

            

            <HStack
            alignItems='center'
            justifyContent='space-between'
            paddingX={4}
            space={4}
            style={{ marginBottom: '10%', marginTop: '10%' }}
          >
            <VStack flex={1} backgroundColor='roxoClaro'
            borderRadius='20' borderWidth='2'
            >
                <Titulo fontSize='sm' 
                padding={3} 
                color='black' 
                >Pacientes</Titulo>
                <Titulo fontSize='md' 
                color='black' 
                mb='8%'
                bold
                >{totalPacientes}</Titulo>
            </VStack>

            <VStack flex={1} backgroundColor='roxoClaro'
            borderRadius='20' borderWidth='2'
            >
                <Titulo fontSize='xs'
                padding={3} 
                color='black' 
                >Atividades Criadas</Titulo>
                <Titulo fontSize='md' 
                color='black' 
                mb='8%'
                bold
                >0</Titulo>
            </VStack>
            
          </HStack>

          <VStack w='90%'>

            <Titulo bold color='black' fontSize='xl' borderBottomWidth={1}>Informações do profissional</Titulo>

            <Titulo bold color='black' fontSize='xl' mt='5%'>Formação</Titulo>                       
            <Titulo fontSize='md' textAlign={'left'} mt='2%'>{dadosUsuario?.user?.informacoes?.formacao}</Titulo>

            <Titulo bold color='black' fontSize='xl' mt='10%'>Descrição</Titulo>                       
            <Titulo fontSize='md' textAlign={'left'} mt='2%'>{dadosUsuario?.user?.informacoes?.descricao}</Titulo>

          </VStack>

                
  <VStack mt='15%'>        
    <EditableModal
      botao="Sair da conta                     "
      bodyText="Ao clicar em sim voce irá sair da sua conta. Tem certeza que deseja continuar?"
      confirmButtonText="Sim"
      cancelButtonText="Não"
      onConfirm={deslogar}
      onCancel={handleCancel}
    />
    </VStack>
               
            </VStack>}
        </ScrollView>
        
    );
}
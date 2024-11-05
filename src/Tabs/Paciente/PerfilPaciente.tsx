import AsyncStorage from "@react-native-async-storage/async-storage";
import { VStack, View, ScrollView, Avatar, HStack, Modal, Icon } from "native-base";
import { Botao } from "../../componentes/Botao";
import { useEffect, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';

//Api
import { pegarDadosUsuario } from "../../servicos/PacienteServico";
import { pegarGruposAtividadesNivel } from "../../servicos/GrupoAtividadesServicos";
import { ConquistaUsuario, GrupoAtividades, UsuarioGeral, Atividades, Exercicios } from "../../interfaces/UsuarioGeral";
import { Titulo } from "../../componentes/Titulo";
import { diagnosticos } from "../../utils/Diagnosticos";


export default function PerfilPaciente({ navigation }) {

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [idade, setIdade] = useState(0);
        
    const [carregado, setCarregando ] = useState(false);
    const [idadeCalculada, setIdadeCalculada] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    
    const handleDeslogar = () => {
        setModalVisible(true);
      };
      
      const handleSim = () => {
        deslogar();
        setModalVisible(false);
      };
      
      const handleNao = () => {
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
         

        if(resultado){
            setDadosUsuario(resultado);
            const resultadoAtividade = await pegarGruposAtividadesNivel(token, resultado.user.nivel);            
            //console.log(resultado);           

            calculateUserIdade().then((idade) => setIdade(idade));
            
                                   
        }else{
            console.error("erro ao pegar os dados do usuario");           
        }
        setCarregando(true);
    }
    dadosUsuario(); 
       
}, [])

useEffect(() => {
    if (dadosUsuario.user && !idadeCalculada) {
      calculateUserIdade().then((idade) => {
        setIdade(idade);
        //console.log(idade); // Verifique se o valor está sendo impresso corretamente
      });
      setIdadeCalculada(true);
    }
  }, [dadosUsuario.user, idadeCalculada]);

    function deslogar(){
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('tipoDeConta');
        alert('Deslogado com sucesso');
        
        navigation.replace('Login');
    }

    async function calculateUserIdade() {
        const dataDeNascimento = dadosUsuario.user.dataDeNascimento;
        const partes = dataDeNascimento.split('/');
        const dia = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1;
        const ano = parseInt(partes[2]);
        const dataDeNascimentoValida = new Date(ano, mes, dia);
        const idadeUsuario = Math.floor((new Date().getTime() - dataDeNascimentoValida.getTime()) / (1000 * 60 * 60 * 24 * 365));
        const idadeUsuarioMeses = idadeUsuario * 12;
        //console.log(idadeUsuarioMeses); // Verifique se o valor está sendo calculado corretamente
        return idadeUsuarioMeses;
      }
    

    return (
        <ScrollView>
            {carregado &&
            
            <VStack alignItems='center' mt='15%'>

            <Avatar
                source={{ uri: dadosUsuario?.user?.foto}}
                style={{ width: 180, height: 180 }}
                alignSelf='center'
                borderWidth='2'
                borderColor='roxoClaro'
            />

            <VStack flexDirection='row'>
            <Titulo
            mt='2%'
            bold
            color='black'
            >{dadosUsuario?.user?.nome}</Titulo>
            <Ionicons name='create-outline' size={24} alignSelf='center' marginLeft='3%'/>
            </VStack>
            
            <Titulo bold color='black' fontSize='md'>{`${dadosUsuario?.user?.grupo?.join(' | ')}`}</Titulo>
            <Titulo fontSize='md'>{`${idade}(meses)`}</Titulo>

            

            <HStack
            alignItems='center'
            justifyContent='space-between'
            paddingX={4}
            space={4}
            style={{ marginBottom: '10%', marginTop: '10%' }}
          >
            <VStack flex={1} backgroundColor='roxoClaro'
            borderRadius='20'
            >
                <Titulo fontSize='sm' 
                padding={3} 
                color='black' 
                >Atividades Finalizadas</Titulo>
                <Titulo fontSize='md' 
                color='black' 
                mb='8%'
                bold
                >{dadosUsuario?.user?.gruposDeAtividadesFinalizadas?.length}</Titulo>
            </VStack>

            <VStack flex={1} backgroundColor='roxoClaro'
            borderRadius='20'
            >
                <Titulo fontSize='sm' 
                padding={3} 
                color='black' 
                >Validade da assinatura</Titulo>
                <Titulo fontSize='md' 
                color='black' 
                mb='8%'
                bold
                >{dadosUsuario?.user?.validade}</Titulo>
            </VStack>
            
          </HStack>

                
          {dadosUsuario?.user?.grupo?.map((grupo, index) => {

    // Encontre o diagnóstico correspondente ao grupo.
    const diagnostico = diagnosticos.find(d => {
        return d.nome?.trim() === grupo.trim();
    });

    // Verifique se o diagnóstico foi encontrado antes de renderizar.
    if (diagnostico) {
        return (
            // Renderização do grupo e do diagnóstico.              
            <View key={index}>
                <Titulo mt='5%' bold color='black'>{diagnostico.nome}</Titulo>
                <Titulo fontSize='sm' padding={1}>{diagnostico.descricao}</Titulo>
            </View>          
        );
    } else {
        // Renderização alternativa se o diagnóstico não for encontrado.
        return (
            <View key={index}>
                <Titulo>{grupo}</Titulo>
                <Titulo>Diagnóstico não encontrado.</Titulo>
            </View>
        );
    }
})}

        
            <Botao onPress={handleDeslogar} mb='10%'>Sair</Botao>
            <Modal
                isOpen={modalVisible}
                onClose={() => setModalVisible(false)}
                >
                <Modal.Content >
                    
                    <Modal.Body >
                    <Modal.Header alignSelf='center' >Deseja realmente sair?</Modal.Header>
                    <Botao onPress={handleSim} alignSelf='center' >Sim</Botao>
                    <Botao onPress={handleNao} alignSelf='center' mb='2%'>Não</Botao>
                    </Modal.Body>
                </Modal.Content>
                </Modal>        
            </VStack>}
        </ScrollView>
        
    );
}
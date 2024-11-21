import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from 'react-native';
import { VStack, View, ScrollView, Avatar, HStack, Modal, Image } from "native-base";
import { Botao } from "../../../componentes/Botao";
import { useEffect, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';

//Api
import { pegarDadosUsuario } from "../../../servicos/PacienteServico";
import {  UsuarioGeral } from "../../../interfaces/UsuarioGeral";
import { Titulo } from "../../../componentes/Titulo";
import { diagnosticos } from "../../../utils/Diagnosticos";
import EditableModal from "../../../componentes/BotaoModal";
import { tokenMidia } from "../../../utils/token";


export default function PerfilPaciente({ navigation }) {

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [idade, setIdade] = useState({
        anos: 0,
        meses: 0,
        idadeEmMeses: 0,
      });
        
    const [carregado, setCarregando ] = useState(false);
    const [idadeCalculada, setIdadeCalculada] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    
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
         

        if(resultado){
            setDadosUsuario(resultado);
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
    
        // Extrai os componentes da data
        const partes = dataDeNascimento.split('/');
        const dia = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1; // Meses em JavaScript são 0-indexados
        const ano = parseInt(partes[2]);
    
        //console.log(`Data de Nascimento: ${dataDeNascimento}`);
        //console.log(`Dia: ${dia}, Mês: ${mes + 1}, Ano: ${ano}`); // Mês corrigido para 1-index
    
        const dataDeNascimentoValida = new Date(ano, mes, dia);
        const hoje = new Date();
    
       //console.log(`Data de Nascimento Validada: ${dataDeNascimentoValida}`);
        //console.log(`Data de Hoje: ${hoje}`);
    
        // Calcula a idade em anos
        let idadeAnos = hoje.getFullYear() - dataDeNascimentoValida.getFullYear();
        //console.log(`Idade em Anos Inicial: ${idadeAnos}`);
    
        // Verifica se o aniversário já ocorreu este ano
        if (hoje.getMonth() < mes || (hoje.getMonth() === mes && hoje.getDate() < dia)) {
            idadeAnos--; // Se o aniversário ainda não ocorreu, subtrai um ano
        }
    
        //console.log(`Idade em Anos Ajustada: ${idadeAnos}`);
    
        // Calcula os meses desde o último aniversário
        let meses = hoje.getMonth() - mes;
    
        // Ajusta os meses se o aniversário ainda não ocorreu neste ano
        if (meses < 0) {
            meses += 12; // Adiciona 12 se no mês atual antes do mês do aniversário
        }
    
        // Se o dia atual é anterior ao dia do aniversário e o resultado de meses não é 0, subtraímos um mês
        if (hoje.getDate() < dia && meses > 0) {
            meses--; // Subtrai um mês se o dia atual é antes do aniversário
        }
    
        //console.log(`Meses Calculados (após ajustes): ${meses}`);
    
        // Cálculo total de meses
        const idadeEmMeses = idadeAnos * 12 + meses; // Totaliza a idade em meses
        //console.log(`Idade Total em Meses: ${idadeEmMeses}`);
    
        return {
            anos: idadeAnos,
            meses: meses,
            idadeEmMeses: idadeEmMeses as number 
        };
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
                        {dadosUsuario?.user?.grupo?.map((grupo, index) => {
                            const diagnostico = diagnosticos.find(d => d.nome?.trim() === grupo.trim());

                            if (diagnostico && !renderizados.has(diagnostico?.imagem)) {
                                renderizados.add(diagnostico?.imagem); // Adicione o nome à lista de renderizados
                                //console.log(renderizados);
                            return (
                                <Image
                                maxHeight='100%'
                                maxWidth='100%' 
                                marginBottom='-5%'
                                    key={index}
                                    style={{
                                        flex: 1,
                                        minWidth: 100, 
                                        aspectRatio: 1,
                                        resizeMode: 'cover',
                                        
                                    }}
                                    source={diagnostico?.imagem}
                                    alt={diagnostico?.nome}
                                />
                                );
                                }
                                return null;
                                })}
    
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

            <TouchableOpacity onPress={() => navigation.navigate('AlterarPerfil')} activeOpacity={0.7}>
                <Ionicons name='create-outline' size={24} alignSelf='center' marginLeft='3%'/>
            </TouchableOpacity>
            
            </VStack>
            
            <Titulo bold color='black' fontSize='md'>{`${dadosUsuario?.user?.grupo?.join(' | ')}`}</Titulo>
            <Titulo fontSize='md'>{`${idade.idadeEmMeses}(meses)`}</Titulo>

            

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
                >Atividades Finalizadas</Titulo>
                <Titulo fontSize='md' 
                color='black' 
                mb='8%'
                bold
                >{dadosUsuario?.user?.gruposDeAtividadesFinalizadas?.length}</Titulo>
            </VStack>

            <VStack flex={1} backgroundColor='roxoClaro'
            borderRadius='20' borderWidth='2'
            >
                <Titulo fontSize='xs' 
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
    <EditableModal
      botao="Sair da conta"
      bodyText="Ao clicar em sim voce irá sair da sua conta. Tem certeza que deseja continuar?"
      confirmButtonText="Sim"
      cancelButtonText="Não"
      onConfirm={deslogar}
      onCancel={handleCancel}
    />
               
            </VStack>}
        </ScrollView>
        
    );
}
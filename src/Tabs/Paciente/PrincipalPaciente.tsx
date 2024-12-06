import AsyncStorage from "@react-native-async-storage/async-storage";
import {  HStack, ScrollView, View, VStack} from "native-base";
import { useEffect, useState } from "react";
import { Linking } from 'react-native';
import { Titulo } from "../../componentes/Titulo";
import { ImagemLogo } from "../../componentes/ImagemLogo";
import Conquista from "../../componentes/Conquista";
import AtividadeCard from "../../componentes/GrupoAtividadeCard";
import { Botao } from "../../componentes/Botao";

//Api
import { pegarDadosUsuario, updateMoeda } from "../../servicos/UserServico";
import { pegarGruposAtividadesNivel, postarAtividadeEmAndamento } from "../../servicos/GrupoAtividadesServicos";
import { ConquistaUsuario, GrupoAtividades, UsuarioGeral, Atividades, Exercicios } from "../../interfaces/UsuarioGeral";
import { tokenMidia } from "../../utils/token";
import ModalTemplate from "../../componentes/Modal";


export default function PrincipalPaciente({ navigation }) {

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [dadosAtividades, setDadosAtividades ] = useState({} as GrupoAtividades );
    const [ listaAtividades, setListaAtividades ] = useState({} as Atividades);
        
    const [conquistasUsuario, setConquistasUsuarios] = useState({} as ConquistaUsuario) 
    const [carregado, setCarregando ] = useState(false);
    

    const [modalVisible1, setModalVisible1] = useState(false);

    const [modalVisible2, setModalVisible2] = useState(false);

    const [ atividadeId, setAtividadeId ] = useState('');
    

    const handleOpenModal = (atividadeIdParam) => {
      setAtividadeId(atividadeIdParam);
      const grupoAtividadesId = dadosAtividades.atividades[0]._id;
  
      console.log(dadosAtividades.atividades[0]._id);
  
      // Verifica se o array de grupos de atividades em andamento não está vazio
      if (dadosUsuario.user.gruposDeAtividadesEmAndamento.length > 0) {
          // Agora verificamos o grupoAtividadesId do primeiro elemento do array
          const atividadeEmAndamento = dadosUsuario.user.gruposDeAtividadesEmAndamento[0];
          
          if (atividadeEmAndamento.grupoAtividadesId === grupoAtividadesId) {
              navigation.navigate('ExercicioTela', { atividadeId: atividadeId, idGrupoAtividades: grupoAtividadesId });
          } else {
              setModalVisible1(true);
          }
      } else {
          console.warn('Nenhuma atividade em andamento encontrada.');
          setModalVisible1(true);  // Mostramos o modal se não houver atividades em andamento
      }
  };
  
  const tornarBotaoVisivel = async () => {
    const grupoAtividadesId = dadosAtividades.atividades[0]._id;

    if (dadosUsuario.user.moeda.valor > 0) {
        await atualizarMoeda();
        console.log('Atividade ID:', atividadeId);
        navigation.navigate('ExercicioTela', { atividadeId: atividadeId, idGrupoAtividades: grupoAtividadesId });
    } else {
        setModalVisible2(true);
    }
};

  const atualizarMoeda = async () => {
      try {
          const usuarioID = await AsyncStorage.getItem('id');
          const token = await AsyncStorage.getItem('token');

          console.log(`UsuarioID: ${usuarioID}, Token: ${token}`);

          if (dadosUsuario.user.moeda.valor >= 1) {
              const resultado = await updateMoeda(usuarioID, token, { moeda: { valor: dadosUsuario.user.moeda.valor - 1 } });
              console.log('Moeda atualizada para:', dadosUsuario.user.moeda.valor - 1);
               
              const enviarAtividadeEmAndamento = await postarAtividadeEmAndamento(dadosAtividades.atividades[0]._id, token);
              console.log('Atividade enviada:', enviarAtividadeEmAndamento);
              

          } else {
              setModalVisible2(true)
              
          }
      } catch (error) {
          console.error('Erro ao acessar AsyncStorage:', error);
      }
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


        for(let i=0; i<=2; i++){
          const resultado = await pegarDadosUsuario(usuarioID, token);           

        if(resultado){
            setDadosUsuario(resultado);
            const resultadoAtividade = await pegarGruposAtividadesNivel(token, resultado.user.nivel, resultado.user.grupo);            
            //console.log(resultado.user.grupo);

            
            
            setDadosAtividades(resultadoAtividade);
            setConquistasUsuarios(resultado.user.conquistas);
            //console.log(resultadoAtividade.atividades[0]._id);

            setListaAtividades(resultadoAtividade.atividades[0]);
            //console.log(listaAtividades);
            
                                   
        }else{
            console.error("erro ao pegar os dados do usuario");           
        }
        }
        
        setCarregando(true);
    }
    dadosUsuario();    
}, [])

return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <ImagemLogo
          style={{
            marginTop: '5%',
            width: 200,
            height: 150,
          }}
        />
          <Titulo
            fontSize='2xl'
            marginLeft='10%'
            textAlign="left"
            color="black"
          >
            {`Olá, ${dadosUsuario?.user?.nome?.split(' ')[0]}`}
          </Titulo>
          <View
            style={{
              width: '90%',
              marginTop: '5%',
              alignSelf: 'center',
              paddingTop: '2%',
              padding: '5%',
              flexDirection: 'column',
              flex: 1,
              borderWidth: 3,
              borderRadius: 20,
              marginBottom: '5%',
            }}
          >
            <Titulo textAlign='center' fontSize='xl' color='black' bold>Suas conquistas</Titulo>
            <HStack
              padding="2%"
              backgroundColor='roxoClaro'
              mt='1%'
              alignSelf={"center"}
              flex={1}
              borderWidth={1}
              borderRadius={10}
              width='100%' // Adicione essa propriedade
              flexWrap='wrap'             
              style={{ marginBottom: 0 }}
            >
              {Object.values(conquistasUsuario).slice(Math.max(0, Object.values(conquistasUsuario)?.length - 3)).map((conquista?) => (
                <Conquista
                  key={conquista?._id}
                  uri={`${conquista?.imagem}${tokenMidia}`}
                  titulo={conquista?.nome}
                  avatarStyle={{ borderWidth: 1, borderColor: 'black' }}
                />
              ))}
            </HStack>
          </View>

        {carregado && (
          <VStack>

          <ModalTemplate
            bodyText="Ao clicar em continuar voce irá iniciar a atividade. Tem certeza que deseja continuar?" 
            confirmButtonText="Continuar"
            onConfirm={tornarBotaoVisivel}
            isVisible = {modalVisible1}
            onClose={() => setModalVisible1(false)}
                                                 
                            />

          <ModalTemplate
            bodyText="Você já realizou suas atividades do dia, volte amanha para mais!"
            confirmButtonText="Voltar"
            isVisible = {modalVisible2}
            onClose={() => setModalVisible2(false)}
                            />
          <AtividadeCard 
          dadosAtividades={dadosAtividades} 
          listaAtividades={listaAtividades} 
          titulo='Objetivo do dia'
          onPressAtividade={() => {
            const grupoAtividadesId = dadosAtividades.atividades[0]._id; 
            console.log(grupoAtividadesId);
            navigation.navigate('GrupoAtividadesTela', { id: grupoAtividadesId });       
        }}
          onPressExercicio={(atividadeId) => {
            handleOpenModal(atividadeId)       
        }}
          />
          </VStack>
        )}
        
        {carregado && (
          <HStack
            alignItems='center'
            justifyContent='space-between'
            paddingX={4}
            space={4}
            style={{ marginBottom: '10%' }}
          >
            <Botao style={{ flex: 1 }} onPress={() => Linking.openURL("https://stimular.com.br/bio/?fbclid=IwZXh0bgNhZW0CMTEAAR38j1DtBQABtNYoKkTcd7jGowNKGqAXuPGVBOGRC9ADunQ_MqITdND9Uwc_aem_wPGznCdmAXN7OkO0iaU7Eg")} >Quem somos</Botao>            
            <Botao style={{ flex: 1 }} onPress={() => Linking.openURL("https://api.whatsapp.com/send?phone=5511992353394&text=Ol%C3%A1,%20quero%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20Stimular")} >Agende conosco</Botao>            
          </HStack>
        )}
      </View>
    </ScrollView>
  );
}
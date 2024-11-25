import AsyncStorage from "@react-native-async-storage/async-storage";
import {  HStack, ScrollView, View} from "native-base";
import { useEffect, useState } from "react";
import { Titulo } from "../../componentes/Titulo";
import { ImagemLogo } from "../../componentes/ImagemLogo";
import Conquista from "../../componentes/Conquista";
import AtividadeCard from "../../componentes/GrupoAtividadeCard";
import { Botao } from "../../componentes/Botao";

//Api
import { pegarDadosUsuario } from "../../servicos/PacienteServico";
import { pegarGruposAtividadesNivel } from "../../servicos/GrupoAtividadesServicos";
import { ConquistaUsuario, GrupoAtividades, UsuarioGeral, Atividades, Exercicios } from "../../interfaces/UsuarioGeral";
import { tokenMidia } from "../../utils/token";


export default function PrincipalPaciente({ navigation }) {

    const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);
    const [dadosAtividades, setDadosAtividades ] = useState({} as GrupoAtividades );
    const [ listaAtividades, setListaAtividades ] = useState({} as Atividades);
        
    const [conquistasUsuario, setConquistasUsuarios] = useState({} as ConquistaUsuario) 
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
        //console.log(resultado);
        
         

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
        {carregado && (
          <Titulo
            fontSize='2xl'
            marginLeft='10%'
            textAlign="left"
            color="black"
          >
            {`Olá, ${dadosUsuario?.user?.nome?.split(' ')[0]}`}
          </Titulo>
        )}
        {carregado && (
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

        )}
        {carregado && (
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
            const grupoAtividadesId = dadosAtividades.atividades[0]._id; 
            console.log('Atividade ID:', atividadeId);
            navigation.navigate('ExercicioTela', { atividadeId: atividadeId, idGrupoAtividades: grupoAtividadesId });       
        }}
          />
        )}
        
        {carregado && (
          <HStack
            alignItems='center'
            justifyContent='space-between'
            paddingX={4}
            space={4}
            style={{ marginBottom: '10%' }}
          >
            <Botao style={{ flex: 1 }}>Tire suas dúvidas</Botao>
            <Botao style={{ flex: 1 }}>Agende conosco</Botao>
          </HStack>
        )}
      </View>
    </ScrollView>
  );
}
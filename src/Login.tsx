import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { VStack, Text, Box, Link, ScrollView, useToast, Toast } from 'native-base';
import { Titulo } from './componentes/Titulo';
import { EntradaTexto } from './componentes/EntradaTexto';
import { Botao } from './componentes/Botao';
import { ImagemLogo } from './componentes/ImagemLogo';
import { fazerLogin } from './servicos/AutenticacaoServico';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { pegarDadosUsuario, updateMoeda } from './servicos/UserServico';
import { apagarAtividadeEmAndamento } from './servicos/GrupoAtividadesServicos';
import { UsuarioGeral } from './interfaces/UsuarioGeral';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function Login({ navigation } : any) {

const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');
const [carregando, setCarregando] = useState(true);

const [dadosUsuario, setDadosUsuario] = useState({} as UsuarioGeral);

const toast = useToast();


function converterDataEmDiaMesAno(data) {
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

useEffect(() => {
  async function verificarLogin() {
    const token = await AsyncStorage.getItem('token');
    console.log('Token encontrado:', token); // Log do token

    if (token) {
        const tokenDecodificado = jwtDecode(token);
        const grupoDoUser =  tokenDecodificado.grupo;

        const idUsuario = await AsyncStorage.getItem('id');
        const tokenDecoded = await AsyncStorage.getItem('token');


        const resultado = await pegarDadosUsuario(idUsuario, tokenDecoded);
        //console.log('Resultado do usuário:', resultado); 
        

        //console.log('Grupo do usuário:', grupoDoUser);

     if(resultado.user.ativo === false){
          AsyncStorage.removeItem('id');
          AsyncStorage.removeItem('token');
          AsyncStorage.removeItem('tipoDeConta');

          Alert.alert('Conta desativada');
          toast.show({
              title: "Erro ao fazer login",
              description: "Conta desativada",
              backgroundColor: "roxoClaro",
          });
          navigation.replace('Login');
    }
    else{  

      console.log("Usuário ativo");
      

        if (Array.isArray(grupoDoUser) && grupoDoUser.length > 0) {
            console.log('Navegando para Tabs');
            navigation.replace('Tabs');

            const gruposDeAtividades = resultado.user.gruposDeAtividadesEmAndamento || []; // Default para array vazio
            const dataDaMoeda = resultado.user.moeda.dataDeCriacao || null; // Se a data não existir, define como null
            const valorQtdMoeda = resultado.user.moeda.valor || 0; // Se o valor não existir, considera 0

            // Verificação se há atividades em andamento
            if (gruposDeAtividades.length > 0) {
                console.log('Data da atividade em andamento:', gruposDeAtividades[0]?.dataInicio);

                const dataInicio = new Date(gruposDeAtividades[0].dataInicio);
                if (!isNaN(dataInicio.getTime())) { // Verifica se é uma data válida
                    const dataInicioDecoded = converterDataEmDiaMesAno(dataInicio);
                    const dataAtualDecoded = converterDataEmDiaMesAno(new Date());
                    const dataMoedaDecoded = dataDaMoeda ? converterDataEmDiaMesAno(new Date(dataDaMoeda)) : null;

                    console.log('Data Inicial Decodificada:', dataInicioDecoded);
                    console.log('Data Atual Decodificada:', dataAtualDecoded);
                    if (dataMoedaDecoded) {
                        console.log('Data Moeda Decodificada:', dataMoedaDecoded);
                    }

                    const verificacao1 = dataInicioDecoded < dataAtualDecoded; // Se a data da atividade é anterior à data atual

                    console.log(`Data da atividade em andamento é menor que data atual: ${verificacao1}`);

                    const idAtividadeDeOntem = gruposDeAtividades[0]._id;

                    if (verificacao1) {
                        const deletarAtividadeDeOntem = await apagarAtividadeEmAndamento(idAtividadeDeOntem, tokenDecoded);
                        console.log('Atividade de ontem deletada:', deletarAtividadeDeOntem);
                    }
                } else {
                    console.log('Data de início inválida:', gruposDeAtividades[0]?.dataInicio);
                }
            } else {
                // Caso não haja atividades em andamento
                console.log('Nenhuma atividade em andamento encontrada para o usuário.');
            }

            // Verificar se o usuário deve receber uma nova moeda
            if (valorQtdMoeda < 1 && dataDaMoeda) {
                const dataMoeda = new Date(dataDaMoeda);
                const dataAtual = new Date(); // Data atual
                const dataMoedaDecoded = converterDataEmDiaMesAno(dataMoeda);
                const dataAtualDecoded = converterDataEmDiaMesAno(dataAtual);
                
                // Converte para comparação
                const verificarMoeda = dataMoedaDecoded < dataAtualDecoded;

                if (verificarMoeda) {
                    const atualizarMoeda = await updateMoeda(idUsuario, token, {
                        moeda: { valor: valorQtdMoeda + 1, dataDeCriacao: new Date() }
                    });
                    console.log('Moeda atualizada ao atender condições:', atualizarMoeda);
                } else {
                    console.log('Não é necessário atualizar a moeda, a data da moeda ainda é válida.');
                }
            }
        } else {
            console.log('Navegando para Outra Tela');
            navigation.replace('CadastroGrupo');
        }
      }
    } else {
        console.log('Token não encontrado');
    }

    setCarregando(false);
}


    
  verificarLogin();
}, []);

async function login(){
  const resultado = await fazerLogin(email, senha);

  if (resultado) {
    const { token } = resultado;
    AsyncStorage.setItem('token', token);

    const tokenDecodificado = jwtDecode(token) as any;
    const id = tokenDecodificado.id;
    const tipoDeConta = tokenDecodificado.tipoDeConta;
    const grupoDoUser = tokenDecodificado.grupo; 
    const ativo = tokenDecodificado.ativo;
    

    //console.log('Token Decodificado:', tokenDecodificado);
    //console.log('ID:', id);
    //console.log('Tipo de Conta:', tipoDeConta);
    //console.log('Grupo do User:', grupoDoUser);

    AsyncStorage.setItem('id', id);
    AsyncStorage.setItem('tipoDeConta', tipoDeConta);
    AsyncStorage.setItem('grupoDoUser', JSON.stringify(grupoDoUser));
    AsyncStorage.setItem('ativo', ativo);

    if (ativo === true) {
      console.log('Conta ativa');
      
        if (Array.isArray(grupoDoUser) && grupoDoUser.length > 0) {
            console.log('Navegando para Tabs');
            navigation.replace('Tabs');
        } else {
            console.log('Navegando para Outra Tela');
            navigation.replace('CadastroGrupo');
        }
    } else {
        AsyncStorage.removeItem('id');
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('tipoDeConta');

        Alert.alert('Conta desativada');
        toast.show({
            title: "Erro ao fazer login",
            description: "Conta desativada",
            backgroundColor: "roxoClaro",
        });
    }

    } else {
        Alert.alert('Alerta', 'Email ou senha inválidos');
        toast.show({
            title: "Erro ao fazer login",
            description: "Email ou senha incorretos",
            backgroundColor: "roxoClaro",
        });
}


}
if (carregando){
  return null
}

  return (
    <DismissKeyboard>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1, flexDirection: 'column' }}
  >
    <ScrollView flex={1} mt='10%' flexDirection='column' size='100%' contentContainerStyle={{ flexGrow: 1 }}>
      <VStack flex={1} flexGrow={1} mt='20%' alignItems='center' justifyContent='center'>
        <ImagemLogo />

        <Titulo mb={3}>Faça Login em sua conta</Titulo>

        <Box>
          <EntradaTexto
            label='Email'
            placeholder='Insira seu email'
            keyboardType= 'email-address'
            value={email}
            onChangeText={setEmail}
          />

          <EntradaTexto
            label='Senha'
            placeholder='Insira sua senha'
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </Box>

        <Botao onPress={login}>Entrar</Botao>

        <Link onPress={() => navigation.navigate('RecuperarSenha')} mt={2}>
          Esqueceu sua senha?
        </Link>
        
        <Box flex= '1' w='100%' flexDirection='row' justifyContent='center' mt={5}>
          <Text>Ainda não tem cadastro? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text color='rosaEscuro'>
              Faça seu cadastro
            </Text>
          </TouchableOpacity>
        </Box>
      </VStack>
    </ScrollView>
  </KeyboardAvoidingView>
</DismissKeyboard>
  );
}

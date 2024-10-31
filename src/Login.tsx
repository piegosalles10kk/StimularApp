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

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function Login({ navigation } : any) {

const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');
const [carregando, setCarregando] = useState(true);
const toast = useToast();

useEffect(() => {
  async function verificarLogin(){
    const token = await AsyncStorage.getItem('token');
    if (token){
      navigation.replace('Tabs');
      }
      setCarregando(false);
    }
  verificarLogin();
}, [])

async function login(){
  const resultado = await fazerLogin(email, senha);

  if (resultado){
    const { token } = resultado
    AsyncStorage.setItem('token', token);

    const tokenDecodificado = jwtDecode(token) as any
    const id = tokenDecodificado.id;
    const tipoDeConta = tokenDecodificado.tipoDeConta;    

    AsyncStorage.setItem('id', id);
    AsyncStorage.setItem('tipoDeConta', tipoDeConta);

    navigation.replace('Tabs');
  }else{
     Alert.alert('Alerta', 'Email ou senha inválidos');
     toast.show({
      title: "Erro ao fazer login",
      description: "Email ou senha incorretos",
      backgroundColor: "roxoClaro",
      
    })
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

        <Link href='https://www.google.com.br' mt={2}>
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

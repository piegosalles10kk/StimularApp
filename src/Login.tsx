import React from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { VStack, Text, Box, Link } from 'native-base';
import { Titulo } from './componentes/Titulo';
import { EntradaTexto } from './componentes/EntradaTexto';
import { Botao } from './componentes/Botao';
import { ImagemLogo } from './componentes/ImagemLogo';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function Login({ navigation }) {
  return (
    <DismissKeyboard>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, flexDirection:'column' }}
      >
        <VStack flex={1} alignItems="center" p={5} justifyContent='center' flexDirection='column'>
        
        <ImagemLogo/>

          <Titulo mb={3}>Faça Login em sua conta</Titulo>

          <Box>
            <EntradaTexto
              label='Email'
              placeholder='Insira seu email'
            />

            <EntradaTexto
              label='Senha'
              placeholder='Insira sua senha'
              secureTextEntry
            />        
          </Box>

          <Botao onPress={()=> navigation.navigate('Tabs')}>Entrar</Botao>

          <Link href='https://www.google.com.br' mt={2}>
            Esqueceu sua senha?
          </Link>

          <Box w='100%' flexDirection='row' justifyContent='center' mt={8}>
            <Text>Ainda não tem cadastro? </Text>

            <TouchableOpacity onPress={()=> navigation.navigate('Cadastro')}>
              
              <Text color='rosaEscuro'>
                Faça seu cadastro
              </Text>
            </TouchableOpacity>
          </Box>
        </VStack>
      </KeyboardAvoidingView>
    </DismissKeyboard>
  );
}

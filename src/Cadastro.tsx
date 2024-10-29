import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {  Box, ScrollView } from 'native-base';
import { Titulo } from './componentes/Titulo';
import { EntradaTexto } from './componentes/EntradaTexto';
import { Botao } from './componentes/Botao';
import { secoes } from './utils/CadastroEntradaTexto';
import EntradaData from './componentes/EntradaData';
import { ImagemLogo } from './componentes/ImagemLogo';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default function Cadastro() {
  const [numSecao, setNumSecao] = useState(0);

  function avancarSecao() {
    if (numSecao < secoes.length - 1) {
      setNumSecao(numSecao + 1);
    }
  }

  function voltarSecao() {
    if (numSecao > 0) {
      setNumSecao(numSecao - 1);
    }
  }

  return (
    <DismissKeyboard>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          flex={1} 
          p={5} 
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'flex-start', 
            alignItems: 'center' 
          }}
        >
          <ImagemLogo/>

          <Titulo mb={3}>{secoes[numSecao].titulo}</Titulo>

          <Box>
            {numSecao < 2 &&
              secoes[numSecao].entradaTexto.map(entrada => {
                return <EntradaTexto 
                  label={entrada.label} 
                  placeholder={entrada.placeholder} 
                  key={entrada.id}
                />;
              })
            }

            {numSecao == 2 &&
              secoes[numSecao].entradaTexto.map(entada => {
                return (
                  <EntradaData 
                    label={entada.label} 
                    placeholder={entada.placeholder} 
                    key={entada.id}
                    onChange={(formattedDate) => (formattedDate)}
                    secureTextEntry={false}
                  />
                );
              })
            }

            {numSecao == 3 &&
              secoes[numSecao].entradaTexto.map(entada => {
                return <EntradaTexto 
                  label={entada.label} 
                  placeholder={entada.placeholder} 
                  key={entada.id}
                  secureTextEntry
                />;
              })
            } 
          </Box>

          {numSecao > 0 && <Botao onPress={() => voltarSecao()}>Voltar</Botao>}
          
          {numSecao < 3 && <Botao mt={4} bg="rosaEscuro" onPress={() => avancarSecao()}>Avançar</Botao>}

          {numSecao == 3 && <Botao mt={4} bg="rosaEscuro" onPress={() => avancarSecao()}>Concluir</Botao>}

          {numSecao == 4 && <Botao mt={4} bg="rosaEscuro" onPress={() => 'https://www.google.com.br'}>Iniciar</Botao>}
        </ScrollView>
      </KeyboardAvoidingView>
    </DismissKeyboard>
  );
}

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Box, ScrollView } from 'native-base';
import { Titulo } from './componentes/Titulo';
import { EntradaTexto } from './componentes/EntradaTexto';
import { Botao } from './componentes/Botao';
import { secoes } from './utils/CadastroEntradaTexto';
import { ImagemLogo } from './componentes/ImagemLogo';
import { cadastrarPaciente } from './servicos/PacienteServico';
import { useNavigation } from '@react-navigation/native';
import { ConquistaUsuario } from './interfaces/UsuarioCadastro';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

export default function Cadastro( navigation) {
    const [numSecao, setNumSecao] = useState(0);
    const [dados, setDados] = useState({} as any);

    function avancarSecao() {
        if (numSecao < secoes.length - 1) {
            setNumSecao(numSecao + 1);
        } else {
            cadastrar();
        }
    }

    function voltarSecao() {
        if (numSecao > 0) {
            setNumSecao(numSecao - 1);
        }
    }

    function atualizarDados(id: string, valor: string) {
        setDados({ ...dados, [id]: valor });
    }

 

    async function cadastrar() {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();

        const dataHoje = `${dia}/${mes}/${ano}`;

        hoje.setDate(hoje.getDate() + 7);

        const validade = `${dia}/${mes}/${ano}`;
  
      const resultado = await cadastrarPaciente({
          email: dados.email,
          nome: dados.nome,
          telefone: dados.telefone,
          dataDeNascimento: dados.dataDeNascimento,
          senha: dados.senha,
          confirmarSenha: dados.confirmarSenha,
          tipoDeConta: 'Paciente',
          foto: 'https://stimularmidias.blob.core.windows.net/midias/6c0ab0a4-110f-4ce5-88c3-9c39ee10dba6.jpg',
          profissional: [
              {
                  idDoProfissional: "672243e4effa46003373d4f4",
                  nome: "Stimular"
              }
          ],
          validade: validade,
          moeda: {
              valor: 1,
              dataDeCriacao: new Date()
          },
          nivel: 1,
          conquistas: [{
              nome: "Bem vindo!",
              imagem: "https://stimularmidias.blob.core.windows.net/midias/6c0ab0a4-110f-4ce5-88c3-9c39ee10dba6.jpg",
              descricao: "Concluiu o cadastro",
              condicao: 0
          }]
      });
  
      if (resultado) {
          // Alerta de sucesso e navegação
          Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!', [
              { text: 'OK', onPress: () => navigation.replace('Login') } 
          ]);
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
                    <ImagemLogo />
                    <Titulo mb={3}>{secoes[numSecao].titulo}</Titulo>
                    <Box>
                        {numSecao >= 0 &&
                            secoes[numSecao].entradaTexto.map(entrada => {
                                return (
                                    <EntradaTexto
                                        label={entrada.label}
                                        placeholder={entrada.placeholder}
                                        key={entrada.id}
                                        keyboardType={entrada.keyboardType}
                                        secureTextEntry={entrada.secureTextEntry}
                                        value={dados[entrada.name]}
                                        onChangeText={(text) => atualizarDados(entrada.name, text)}
                                        type={entrada.type}
                                    />
                                );
                            })
                        }
                    </Box>
                    {numSecao > 0 && <Botao onPress={() => voltarSecao()}>Voltar</Botao>}
                    {numSecao >= 0 && <Botao mt={4} onPress={() => avancarSecao()}>
                        {numSecao >= 3 ? 'Concluir' : 'Avançar'}
                    </Botao>}
                </ScrollView>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
}

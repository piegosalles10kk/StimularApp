import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox, CheckIcon, KeyboardAvoidingView, Select, VStack, Text, Image, ScrollView, HStack } from 'native-base';
import { Titulo } from '../../../componentes/Titulo';
import { EntradaTexto } from '../../../componentes/EntradaTexto';
import { Botao } from '../../../componentes/Botao';
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import { ImagemLogo } from '../../../componentes/ImagemLogo';
import * as ImagePicker from 'expo-image-picker';
import { enviarFotoDePerfil } from '../../../servicos/UploadServicos';
import { tokenMidia } from '../../../utils/token';
import { cadastrarAtividade, pegarGruposAtividadesGeralAdmin } from '../../../servicos/GrupoAtividadesServicos';
import CardAtividadeAdmin from '../../../componentes/CardAtividadeAdmin';

export default function CriarAtividade({ navigation }) {
    const niveis = [1, 2, 3, 4, 5, 6];
    const grupoOpcoes = ['TEA', 'TOD', 'TDAH'];
    const tipoDeAtividade = ["Fisica", "Linguistica", "Cognitiva", "Socioafetiva"];

    const [numEditarAtividade, setNumEditarAtividade] = useState(0);

    const [numSecao, setNumSecao] = useState(0);
    const [grupoAtividade, setGrupoAtividade] = useState({
        nomeGrupo: '',    // Alterado
        nivelDaAtividade: 0,
        identificador: '', // Alterado
        imagem: '',
        descricao: '',
        dominio: [],
        atividades: []
    });

    // Estado da nova atividade
    const [novaAtividade, setNovaAtividade] = useState({
        nomdeDaAtividade: '', // Mantém
        fotoDaAtividade: '',
        tipoDeAtividade: '',
        exercicios: []
    });

    // Estado do novo exercício
    const [novoExercicio, setNovoExercicio] = useState({
        midia: {},
        enunciado: '',
        alternativas: [{ texto: '', checked: false }], // Inicializando uma alternativa
        pontuacao: 1
    });

    useEffect(() => {
        const pegarAtividade = async () => {
            const userId = await AsyncStorage.getItem('id');
            const token = await AsyncStorage.getItem('token');
            let totalAtividadesNoBanco
            const todasAsAtividades = await pegarGruposAtividadesGeralAdmin(token);
            if (todasAsAtividades){
                totalAtividadesNoBanco = todasAsAtividades.grupos.length;
            }else{
                totalAtividadesNoBanco = 0;
            }
            
            console.log(totalAtividadesNoBanco);
            
            const nomeIdGrupo = `${userId}Atividade${totalAtividadesNoBanco}`;
            console.log('nomeIdGrupo', nomeIdGrupo); 
            
    
            setGrupoAtividade(prev => ({ ...prev, identificador: nomeIdGrupo })); // Alterado
        };

        pegarAtividade();
    }, []);

    // Atualiza os dados do grupo
    const atualizarDados = (id, valor) => {
        setGrupoAtividade(prevDados => ({ ...prevDados, [id]: valor }));
    };

    const handleCheckboxChange = (value) => {
        setGrupoAtividade(prevDados => {
            const novoDominio = prevDados.dominio.includes(value)
                ? prevDados.dominio.filter(grupo => grupo !== value)
                : [...prevDados.dominio, value];
            return { ...prevDados, dominio: novoDominio };
        });
    };

    const avancarSecao = () => setNumSecao(numSecao + 1);
    const voltarSecao = () => {
        if (numSecao > 0) setNumSecao(numSecao - 1);
    };

    const adicionarAtividade = () => {
      // Adiciona o novo exercício à nova atividade
      setNovaAtividade(prev => ({
          ...prev,
          exercicios: [...prev.exercicios, novoExercicio]
      }));
  
      // Prepara a nova atividade formatada
      const novaAtividadeFormatada = {
          nomdeDaAtividade: novaAtividade.nomdeDaAtividade,
          fotoDaAtividade: novaAtividade.fotoDaAtividade,
          tipoDeAtividade: novaAtividade.tipoDeAtividade,
          pontuacaoTotalAtividade: 1,
          exercicios: novaAtividade.exercicios.map(exercicio => ({
              midia: {
                  tipoDeMidia: exercicio.midia.tipoDeMidia, // Captura o tipo de mídia
                  url: exercicio.midia.url
              },
              enunciado: exercicio.enunciado,
              alternativas: exercicio.alternativas.map(alt => ({
                  alternativa: alt.texto,
                  resultadoAlternativa: alt.checked // Usa o estado do checkbox
              })),
              pontuacao: exercicio.pontuacao
          }))
      };
  
      // Verifica se há alternativas
      if (novaAtividadeFormatada.exercicios.some(exercicio => exercicio.alternativas.length > 0)) {
          // Adiciona a nova atividade ao grupo de atividades
          setGrupoAtividade(prev => ({
              ...prev,
              atividades: [...prev.atividades, novaAtividadeFormatada] // Formato correto aqui
          }));
  
          voltarSecao(); // Volta para a seção anterior
  
          // Limpa todos os campos
          setNovaAtividade({
              nomdeDaAtividade: '',
              fotoDaAtividade: '',
              tipoDeAtividade: '',
              exercicios: [] // Reseta os exercícios
          });
          setNovoExercicio({
              midia: {},
              enunciado: '',
              alternativas: [{ texto: '', checked: false }], // Reseta alternativas para uma em branco
              pontuacao: 1
          });
  
          console.log('Grupo Atividade:', JSON.stringify(grupoAtividade, null, 2));
      } else {
          console.log('Adicione pelo menos uma alternativa');
          
      }
  };
  
  

    const adicionarAlternativa = () => {
        const novaAlternativa = { texto: '', checked: false };

        // Adiciona uma nova alternativa em branco ao exercício atual
        setNovoExercicio(prev => ({
            ...prev,
            alternativas: [...prev.alternativas, novaAlternativa]
        }));
    };

    const escolherImagemExercicio = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('É necessário permitir o acesso à galeria!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            await processImageExercicio(result.assets[0]);
        }
    };

    const processImageExercicio = async (media) => {
        const source = {
            uri: media.uri,
            type: media.mimeType || media.type || 'image/jpeg', // Usar mimeType se disponível
            fileName: media.fileName || 'photo.jpg',
        };
    
        const userId = `${grupoAtividade.identificador}Exercicio${grupoAtividade.atividades.length}midia`;
    
        try {
            // Defina o tempo limite para 10 segundos (10.000 ms)
            const timeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Tempo de espera excedido')), 10000)
            );
    
            // Execute a requisição e aguarde a resposta
            const response = await Promise.race([enviarFotoDePerfil(userId, source), timeout]);
    
            if (response) {
                setNovoExercicio(prev => ({
                    ...prev,
                    midia: { url: response.url, tipoDeMidia: media.type },
                }));
                alert('Mídia enviada com sucesso!');
            } else {
                alert('Erro ao enviar a mídia');
            }
        } catch (error) {
            console.error('Erro ao enviar a mídia:', error.message);
            alert('Ocorreu um erro ao enviar a mídia. Tente novamente.');
        }
    };
    

    const escolherImagemAtividade = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('É necessário permitir o acesso à galeria!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            await processImageAtividade(result.assets[0]);
        }
    };

    const processImageAtividade = async (media) => {
        const source = {
            uri: media.uri,
            type: media.mimeType || media.type || 'image/jpeg', // Usar mimeType se disponível
            fileName: media.fileName || 'photo.jpg',
        };
    
        const userId = `${grupoAtividade.identificador}Exercicio${grupoAtividade.atividades.length}`;
    
        try {
            // Defina o tempo limite para 10 segundos (10.000 ms)
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Tempo de espera excedido')), 10000)
            );
    
            // Execute a requisição e aguarde a resposta
            const response = await Promise.race([enviarFotoDePerfil(userId, source), timeout]);
    
            if (response) {
                setNovaAtividade(prev => ({ ...prev, fotoDaAtividade: response.url }));
                alert('Mídia enviada com sucesso!');
            } else {
                alert('Erro ao enviar a mídia');
            }
        } catch (error) {
            console.error('Erro ao enviar a mídia:', error.message);
            alert('Ocorreu um erro ao enviar a mídia. Tente novamente.');
        }
    };
    

    const escolherImagem = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (!permissionResult.granted) {
            alert('É necessário permitir o acesso à galeria!');
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
            await processImage(result.assets[0]); // Acessa diretamente o primeiro item
        } else {
            alert('Nenhuma imagem selecionada.');
        }
    };
    
    const processImage = async (media) => {
        if (!media) {
            alert('Nenhuma mídia foi fornecida.');
            console.error('Nenhuma mídia foi fornecida.');
            return;
        }
    
        const source = {
            uri: media.uri,
            type: media.mimeType || media.type || 'image/jpeg', // Usar mimeType se disponível
            fileName: media.fileName || media.uri.split('/').pop() || 'photo.jpg', // Usa o nome do arquivo da URI
        };
    
        const userId = grupoAtividade.identificador;
    
        try {
            // Defina o tempo limite para 10 segundos (10.000 ms)
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Tempo de espera excedido')), 10000)
            );
    
            // Execute a requisição e aguarde a resposta
            const response = await Promise.race([enviarFotoDePerfil(userId, source), timeout]);
    
            if (response) {
                setGrupoAtividade(prev => ({ ...prev, imagem: response.url }));
                alert('Imagem enviada com sucesso!');
            } else {
                alert('Erro ao enviar a imagem');
            }
        } catch (error) {
            console.error('Erro ao enviar a imagem:', error.message);
            alert('Ocorreu um erro ao enviar a imagem. Tente novamente.');
        }
    };
    
    

    const criarAtividade = async () => {
        console.log('Grupo Atividade sendo enviado:', JSON.stringify(grupoAtividade, null, 2));

        const token = await AsyncStorage.getItem('token');

        const resposta = await cadastrarAtividade(token, grupoAtividade);

        if (resposta) {
            alert('Atividade criada com sucesso!');
            navigation.replace('Login');
        }else {
            alert('Erro ao criar a atividade');
        }
    };

    const removerAtividade = (index) => {
        setGrupoAtividade((prev) => {
            const novasAtividades = [...prev.atividades];
            novasAtividades.splice(index, 1); // Remove um elemento a partir do índice
            return { ...prev, atividades: novasAtividades };
        });
    };
    

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                    <VStack mt='20%' alignItems='center'>
                        {numSecao <= 3 && (
                            <ImagemLogo style={{ marginTop: '5%', width: 200, height: 150 }} />
                        )}

                        {numSecao === 0 && (
                            <VStack>
                                <Titulo bold fontSize='md' mb='6%'>Defina um nome para o grupo</Titulo>
                                <EntradaTexto
                                    label='Nome do Grupo'
                                    placeholder='Digite o nome do Grupo'
                                    value={grupoAtividade.nomeGrupo} // Alterado
                                    onChangeText={value => atualizarDados('nomeGrupo', value)} // Alterado
                                />
                            </VStack>
                        )}

                        {numSecao === 1 && (
                            <VStack>
                                <Titulo bold fontSize='md' mb='6%'>Defina uma descrição para o grupo</Titulo>
                                <EntradaTexto
                                    label='Descrição do Grupo'
                                    placeholder='Digite a descrição'
                                    tamanhoDoInput={200}
                                    value={grupoAtividade.descricao}
                                    onChangeText={value => atualizarDados('descricao', value)}
                                    multiline
                                />
                            </VStack>
                        )}

                        {numSecao === 2 && (
                            <VStack alignItems='center'>
                                <VStack mt='5%' mb='10%'>
                                    <Titulo bold>Selecione o publico alvo</Titulo>
                                    <VStack space={2} mt={4} flexDir='row'>
                                        {grupoOpcoes.map((grupo, index) => (
                                            <Checkbox
                                                value={grupo}
                                                padding='2%'
                                                key={index}
                                                isChecked={grupoAtividade.dominio.includes(grupo)}
                                                onChange={() => handleCheckboxChange(grupo)}
                                                colorScheme='purple'
                                            >
                                                {grupo}
                                            </Checkbox>
                                        ))}
                                    </VStack>
                                </VStack>

                                <Titulo fontSize='md' bold>Idade de atraso</Titulo>
                                <Select
                                    selectedValue={grupoAtividade.nivelDaAtividade.toString()}
                                    minWidth="80%"
                                    placeholder="Selecione a idade de atraso (em anos)"
                                    onValueChange={(itemValue) => atualizarDados('nivelDaAtividade', parseInt(itemValue))}
                                    _selectedItem={{
                                        bg: "roxoClaro",
                                        endIcon: <CheckIcon size="5" />
                                    }}
                                >
                                    {niveis.map((nivelDaAtividade, index) => (
                                        <Select.Item label={nivelDaAtividade.toString()} value={nivelDaAtividade.toString()} key={index} />
                                    ))}
                                </Select>
                            </VStack>
                        )}

                        {numSecao === 3 && (
                            <VStack alignItems='center'>
                                <Titulo bold fontSize='md' mb='6%'>Vamos definir uma imagem para o grupo:</Titulo>
                                <Botao onPress={escolherImagem}>Escolher imagem                </Botao>
                                {grupoAtividade.imagem ? (
                                    <Image source={{ uri: `${grupoAtividade.imagem}${tokenMidia}` }} style={{ width: 200, height: 200, marginTop: 10 }} />
                                ) : (
                                    <Text style={{ marginTop: 10 }}>Nenhuma imagem selecionada.</Text>
                                )}
                            </VStack>
                        )}

                        {numSecao === 4 && (
                            <VStack>
                                <Titulo bold mb='6%'>Como seu grupo está ficando:</Titulo>
                                <VStack alignItems='center'>
                                    <Image
                                        alt='Nenhuma imagem selecionada.'
                                        borderWidth='2'
                                        borderColor='roxoClaro'
                                        mb='2%'
                                        source={{ uri: `${grupoAtividade.imagem}${tokenMidia}` }}
                                        style={{ width: 200, height: 200, marginTop: 10 }}
                                    />
                                    <Titulo bold color='black'>{grupoAtividade.nomeGrupo}</Titulo> // Alterado
                                    <Titulo fontSize='md' mb='3%' color='black'>{`Recomendado para: (${grupoAtividade.dominio} ${grupoAtividade.nivelDaAtividade} ano(s))`}</Titulo>
                                    <Titulo fontSize='md' textAlign='start' padding='5%'>{grupoAtividade.descricao}</Titulo>
                                    <Titulo bold color='black' mt='15%'>Exercicios</Titulo>
                                    {grupoAtividade.atividades.map((atividade, index) => (
                                        <CardAtividadeAdmin
                                            titulo={atividade.nomdeDaAtividade}
                                            descricao={atividade.tipoDeAtividade}
                                            avatarUri={`${atividade.fotoDaAtividade}`}
                                            onPress={() => {removerAtividade(index)}}
                                            id={index}
                                            buttonVisible={true}
                                            icon='trash'
                                        />
                                    ))}
                                    <Botao w='50%' mb='15%' onPress={avancarSecao}>+</Botao>
                                </VStack>
                            </VStack>
                        )}

                        {/* Criar Atividade */}
                        {numSecao === 5 && (
                            <VStack alignItems='center' mb='8%'>
                                <Titulo bold mb='6%'>Criar Atividade</Titulo>
                                <Botao onPress={escolherImagemAtividade}>Adicionar foto da atividade          </Botao>
                                <Image
                                    alt={novaAtividade.fotoDaAtividade}
                                    source={{ uri: `${novaAtividade.fotoDaAtividade}` }}
                                    style={{ width: 200, height: 200, marginTop: 10 }}
                                />
                                <EntradaTexto
                                    label='Nome da Atividade'
                                    placeholder='Nome da Atividade'
                                    value={novaAtividade.nomdeDaAtividade} // Mantém
                                    onChangeText={value => setNovaAtividade(prev => ({ ...prev, nomdeDaAtividade: value }))} // Mantém
                                />
                                <Select
                                    selectedValue={novaAtividade.tipoDeAtividade}
                                    minWidth="80%"
                                    placeholder="Tipo de Atividade"
                                    onValueChange={(itemValue) => setNovaAtividade(prev => ({ ...prev, tipoDeAtividade: itemValue }))}
                                    _selectedItem={{
                                        bg: "roxoClaro",
                                        endIcon: <CheckIcon size="5" />
                                    }}
                                >
                                    {tipoDeAtividade.map((tipo, index) => (
                                        <Select.Item label={tipo.toString()} value={tipo.toString()} key={index} />
                                    ))}
                                </Select>

                                <VStack alignItems='center'>
                                    <Botao onPress={escolherImagemExercicio}>Adicionar mídia da atividade         </Botao>
                                    <Image
                                        alt={`Formato de midia: ${novoExercicio.midia.tipoDeMidia}` }
                                        source={{ uri: `${novoExercicio.midia.url}` }}
                                        style={{ width: 200, height: 200, marginTop: 10 }}
                                    />
                                    <Titulo mt='10%' mb='5%' bold color='black'>Exercício</Titulo>
                                    <EntradaTexto
                                        label='Enunciado do Exercício'
                                        placeholder='Enunciado do Exercício'
                                        value={novoExercicio.enunciado}
                                        tamanhoDoInput={100}
                                        multiline
                                        onChangeText={value => setNovoExercicio(prev => ({ ...prev, enunciado: value }))}
                                    />

                                    {novoExercicio.alternativas.map((alt, index) => (
                                        <HStack key={index} alignItems="center" ml='3%'space={2}>
                                            <Checkbox
                                                isChecked={alt.checked}
                                                onChange={() => {
                                                    const novasAlternativas = novoExercicio.alternativas.map((a, i) => ({
                                                        ...a,
                                                        checked: i === index // Marcar apenas a alternativa clicada
                                                    }));
                                                    setNovoExercicio(prev => ({ ...prev, alternativas: novasAlternativas }));
                                                }}
                                            />
                                            <EntradaTexto
                                                placeholder='Alternativa'
                                                value={alt.texto}
                                                onChangeText={text => {
                                                    const novasAlternativas = novoExercicio.alternativas.map((a, i) => (
                                                        i === index ? { texto: text, checked: a.checked } : a
                                                    ));
                                                    setNovoExercicio(prev => ({ ...prev, alternativas: novasAlternativas }));
                                                }}
                                            />
                                        </HStack>
                                    ))}

                                    <Botao onPress={adicionarAlternativa} w='50%'>+              </Botao>
                                    <Botao onPress={adicionarAtividade}>Adicionar Atividade                </Botao>
                                </VStack>
                            </VStack>
                        )}

                        {/* Editar Atividade */}
                        
                        {numSecao === 6 && (
                            
                        <VStack alignItems='center' mb='8%'>
                            {grupoAtividade.atividades.map((atividade, index) => {
                            if (index === numEditarAtividade) {
                                return (
                            <VStack key={index} alignItems='center' mb='8%' mt='10%'>
                                <Titulo bold mb='6%'>Editar Atividade</Titulo>
                                <Botao onPress={escolherImagemAtividade}>Editar foto da atividade</Botao>
                                <Image
                                    alt={atividade.fotoDaAtividade}
                                    source={{ uri: `${atividade.fotoDaAtividade}` }}
                                    style={{ width: 200, height: 200, marginTop: 10 }}
                                />
                                <EntradaTexto
                                    label='Nome da Atividade'
                                    placeholder='Nome da Atividade'
                                    value={atividade.nomdeDaAtividade}
                                    onChangeText={value => setNovaAtividade(prev => ({ ...prev, nomdeDaAtividade: value }))}
                                />
                                <Select
                                    selectedValue={atividade.tipoDeAtividade}
                                    minWidth="80%"
                                    placeholder="Tipo de Atividade"
                                    onValueChange={(itemValue) => setNovaAtividade(prev => ({ ...prev, tipoDeAtividade: itemValue }))}
                                    _selectedItem={{
                                        bg: "roxoClaro",
                                        endIcon: <CheckIcon size="5" />
                                    }}
                                >
                                    {tipoDeAtividade.map((tipo, index) => (
                                        <Select.Item label={tipo.toString()} value={tipo.toString()} key={index} />
                                    ))}
                                </Select>

                                <VStack alignItems='center'>
                                    <Botao onPress={escolherImagemExercicio}>Adicionar mídia da atividade</Botao>
                                    <Image
                                        alt={`Formato de midia: ${novoExercicio.midia.tipoDeMidia}`}
                                        source={{ uri: `${novoExercicio.midia.url}` }}
                                        style={{ width: 200, height: 200, marginTop: 10 }}
                                    />
                                    <Titulo mt='10%' mb='5%' bold color='black'>Exercício</Titulo>
                                    <EntradaTexto
                                        label='Enunciado do Exercício'
                                        placeholder='Enunciado do Exercício'
                                        value={atividade.enunciado}
                                        tamanhoDoInput={100}
                                        multiline
                                        onChangeText={value => setNovoExercicio(prev => ({ ...prev, enunciado: value }))}
                                    />

                                    {novoExercicio.alternativas.map((alt, index) => (
                                        <HStack key={index} alignItems="center" ml='3%' space={2}>
                                            <Checkbox
                                                isChecked={alt.checked}
                                                onChange={() => {
                                                    const novasAlternativas = novoExercicio.alternativas.map((a, i) => ({
                                                        ...a,
                                                        checked: i === index // Marcar apenas a alternativa clicada
                                                    }));
                                                    setNovoExercicio(prev => ({ ...prev, alternativas: novasAlternativas }));
                                                }}
                                            />
                                            <EntradaTexto
                                                placeholder='Alternativa'
                                                value={alt.texto}
                                                onChangeText={text => {
                                                    const novasAlternativas = novoExercicio.alternativas.map((a, i) => (
                                                        i === index ? { texto: text, checked: a.checked } : a
                                                    ));
                                                    setNovoExercicio(prev => ({ ...prev, alternativas: novasAlternativas }));
                                                }}
                                            />
                                        </HStack>
                                    ))}

                                    <Botao onPress={adicionarAlternativa} w='50%'>+</Botao>
                                    <Botao onPress={adicionarAtividade}>Adicionar Atividade</Botao>
                                </VStack>
                            </VStack>
                        );
    }
    return null;
})}

                            </VStack>
                            
                        )}

                        {/* Navegação entre seções */}
                        {numSecao <= 3 && <Botao onPress={avancarSecao}>Próximo</Botao>}
                        {numSecao === 4 && <Botao mt='5%' onPress={criarAtividade}>Criar Atividade</Botao>}
                        {numSecao > 0 && <Botao onPress={voltarSecao} mt='5%' mb='10%'>Voltar</Botao>}
                    </VStack>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

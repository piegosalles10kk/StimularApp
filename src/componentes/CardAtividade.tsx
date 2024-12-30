import React from 'react';
import { VStack, Text, Button, Avatar } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Titulo } from './Titulo';
import { tokenMidia } from '../utils/token';

const nomesCorretos = {
    'socializacao': 'Socialização',
    'motorizacao': 'Motorização',
    'linguagem': 'Linguagem',
    'autoCuidado': 'Auto-Cuidado',
    'motor': 'Motor',
    'cognicao': 'Cognição',
};

const CardAtividade = ({
    titulo,
    descricao,
    avatarUri,
    containerStyle = {},
    avatarStyle = {},
    buttonStyle = {},
    textStyle = {},
    onPress,
    id,
    buttonVisible = false, // Prop para controlar a visibilidade do botão
}) => {
    // Suponha que a altura original seja calculada ou conhecida
    const originalHeight = 100; // Exemplo de altura original
    const newHeight = originalHeight + 2;

    // Função para substituir termos na descrição
    const substituirDescricao = (descricao) => {
        return descricao.split(' ').map((palavra) => {
            return nomesCorretos[palavra] || palavra; // Substitui ou mantém a palavra original
        }).join(' '); // Junta as palavras novamente
    };

    return (
        <VStack
            display="flex"
            flexDirection="row"
            mt={5}
            borderWidth={3}
            borderRadius={20}
            bg="white"
            shadow={2}
            style={{ width: '90%', height: newHeight, ...containerStyle }}
        >
            <Avatar
                source={{ uri: `${avatarUri}${tokenMidia}` }}
                style={{ width: 80, height: 80, ...avatarStyle }}
                borderColor="black"
                borderWidth="2"
                mr={3}
                alignSelf="center"
                ml={2}
            />

            <VStack display="flex" flexDirection="column" flex={1} alignSelf="center">
                <Titulo style={textStyle} fontWeight="bold" fontSize='md' color="black">
                    {titulo.length > 34
                        ? titulo.substring(0, 34) + "..."
                        : titulo}
                </Titulo>

                <Text style={textStyle} fontSize="xs" alignSelf='center'>
                    ({substituirDescricao(descricao)}) 
                </Text>
            </VStack>

            {buttonVisible && (
                <Button
                    alignSelf="center"
                    leftIcon={<Icon name="play" size={24} color="white" />}
                    style={{ width: 50, height: 50, ...buttonStyle }}
                    mr={3}
                    bg="roxoClaro"
                    borderRadius={15}
                    _pressed={{ bg: 'rosaEscuro' }}
                    onPress={() => onPress(id)}
                />
            )}
        </VStack>
    );
};

export default CardAtividade;

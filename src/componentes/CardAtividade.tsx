import React from 'react';
import { VStack, Text, Button, Avatar } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Titulo } from './Titulo';

const CardAtividade = ({
  titulo,
  descricao,
  avatarUri,
  containerStyle = {},
  avatarStyle = {},
  buttonStyle = {},
  textStyle = {},
  onPress, // Adicione a prop onPress
  id  // Adicione a prop id
}) => {
  // Suponha que a altura original seja calculada ou conhecida
  const originalHeight = 100; // Exemplo de altura original
  const newHeight = originalHeight + 2;

  return (
    <VStack
      display="flex"
      flexDirection="row"
      mt={5}
      borderWidth={3}
      borderRadius={20}
      bg="white"
      shadow={2}
      style={{ width: '100%', height: newHeight, ...containerStyle }} // Aplicando a nova altura e estilos personalizados
    >
      <Avatar
        source={{ uri: avatarUri }}
        style={{ width: 80, height: 80, ...avatarStyle }}
        borderColor="black"
        borderWidth="2"
        mr={3}
        alignSelf="center"
        ml={2}
      />
      <VStack display="flex" flexDirection="column" flex={1} alignSelf="center">
        <Titulo style={textStyle} fontWeight="bold" fontSize="lg" color="gray.600">
          {titulo}
        </Titulo>
        <Text style={textStyle} fontSize="xs">
          {descricao}
        </Text>
      </VStack>
      <Button
        alignSelf="center"
        leftIcon={<Icon name="play" size={24} color="white" />}
        style={{ width: 50, height: 50, ...buttonStyle }}
        mr={3}
        bg="rosaEscuro"
        borderRadius={15}
        _pressed={{ bg: 'roxoClaro' }}
        onPress={() => onPress(id)} // Use a função onPress passada como prop
      />
    </VStack>
  );
};

export default CardAtividade
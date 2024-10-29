// Conquista.js
import React from 'react';
import { VStack, Avatar, Text } from 'native-base';
import { Titulo } from './Titulo';

const Conquista = ({ uri, titulo, containerStyle = {}, avatarStyle = {}, textStyle = {} }) => {
  return (
    <VStack style={containerStyle} padding='2%'>
      <Avatar
        source={{ uri }}
        style={{ width: 75, height: 75, ...avatarStyle }}
        borderColor='black'
        borderWidth='2'
        alignSelf='center'
      />
      <Titulo style={textStyle} fontWeight='bold' fontSize='sm' color='black'>{titulo}</Titulo>
    </VStack>
  );
};

export default Conquista;

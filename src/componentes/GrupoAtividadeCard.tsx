import React from 'react';
import { VStack, HStack, Avatar, ScrollView, Image } from 'native-base'; 
import { TouchableOpacity } from 'react-native';
import { Titulo } from './Titulo';
import { useNavigation } from '@react-navigation/native';

const AtividadeCard = ({ dadosAtividades, listaAtividades, titulo, }) => {

    const navigation = useNavigation();

    const handlePressAtividade = () => {
        const grupoAtividadesId = dadosAtividades?.atividades[0]?._id; // Obtenha o ID do grupoAtividades
        if (grupoAtividadesId) {
            //navigation.navigate('GrupoAtividadesTela', { id: grupoAtividadesId as string }); // Navegue para NovaTela e passe o ID
        }
    };

    const handlePressExercicio = () => {
        const grupoAtividadesId = dadosAtividades?.atividades[0]?._id; // Obtenha o ID do grupoAtividades
        if (grupoAtividadesId) {
            //navigation.navigate('GrupoAtividadesTela', { id: grupoAtividadesId as string }); // Navegue para NovaTela e passe o ID
        }
    };

    return (
        <VStack
            alignSelf={"center"}
            padding='5'
            paddingTop='2%'
            flexDirection='column'
            flex={1}
            borderWidth={3}
            borderRadius={20}
            w='95%'
        >
            <Titulo textAlign='start' fontSize='xl' bold color='black'>{titulo}</Titulo>
            
            <TouchableOpacity onPress={handlePressAtividade} activeOpacity={0.5}>
            <HStack
                padding="2%"
                mt='1%'
                alignSelf={"center"}
                flex={1}
                borderWidth={1}
                borderRadius={10}
            >
                <VStack flexDirection='row' flex={1} maxWidth='90%'>
                    <Avatar
                        size='xl'
                        borderWidth='1'
                        source={{ uri: dadosAtividades?.atividades[0]?.imagem }}
                    />
                    <VStack flexDirection='column' flexShrink={1}>
                        <Titulo
                            color='black'
                            bold
                            fontSize='md'
                        >
                            {dadosAtividades?.atividades[0]?.nomeGrupo}
                        </Titulo>
                        <Titulo fontSize='sm' bold color='black'>
                            {`(${dadosAtividades?.atividades[0]?.dominio})`}
                        </Titulo>
                        <Titulo fontSize='sm'>
                            {dadosAtividades?.atividades[0]?.descricao}   
                        </Titulo>
                    </VStack>
                </VStack> 
            </HStack>
            </TouchableOpacity>

            <VStack flexDirection='row' flex={1} maxWidth='90%'>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} mt='4%'>
                
                    <VStack flexDirection='row' alignContent='center'>
                        {listaAtividades?.atividades.map((atividade, index) => (

                            <TouchableOpacity onPress={handlePressExercicio} activeOpacity={0.5}>
                            <VStack key={index} flexDirection='row' padding='2'  flex={1} maxWidth='100%'>
                                <Image
                                    alt="imagem da atividade"
                                    size='md'
                                    mr='2%'
                                    borderWidth='1'
                                    source={{ uri: atividade.fotoDaAtividade }}
                                />
                                <VStack flexDirection='column' alignItems='center'>
                                    <Titulo fontSize='sm' bold color='black'>
                                        {atividade.nomdeDaAtividade}
                                    </Titulo>
                                    <Titulo fontSize='xs' alignSelf='flex-start'>
                                        {`(${atividade.tipoDeAtividade})`}
                                    </Titulo>
                                    
                                </VStack>
                            </VStack>
                            </TouchableOpacity>
                        ))}
                    </VStack>
                </ScrollView>
            </VStack>
        </VStack>

    );
};

export default AtividadeCard;

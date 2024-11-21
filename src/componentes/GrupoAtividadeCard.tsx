import React from 'react';
import { VStack, HStack, Avatar, ScrollView, Image } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Titulo } from './Titulo';
import { tokenMidia } from '../utils/token';

// Definindo a interface das Props
interface Props {
    dadosAtividades: any; // Defina um tipo mais específico conforme seus dados
    listaAtividades: any; // Defina um tipo mais específico conforme seus dados
    titulo: string;
    onPressAtividade: () => void; // Função passada como prop
    onPressExercicio: (atividadeId: string) => void; // Função passada como prop
}

const AtividadeCard: React.FC<Props> = ({ dadosAtividades, listaAtividades, titulo, onPressAtividade, onPressExercicio }) => {
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

            <TouchableOpacity onPress={onPressAtividade} activeOpacity={0.5}>
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
                            source={{ uri: `${dadosAtividades?.atividades[0]?.imagem}${tokenMidia}` }}
                        />
                        <VStack flexDirection='column' flexShrink={1}>
                            <Titulo color='black' bold fontSize='md'>
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
                        {listaAtividades?.atividades.map((atividade: any, index: number) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => onPressExercicio(atividade._id)} // Passando o ID da atividade
                                activeOpacity={0.5}
                            >
                                <VStack flexDirection='row' padding='2' flex={1} maxWidth='100%'>
                                    <Image
                                        alt="imagem da atividade"
                                        size='md'
                                        mr='2%'
                                        borderWidth='1'
                                        source={{ uri: `${atividade.fotoDaAtividade}${tokenMidia}` }}
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

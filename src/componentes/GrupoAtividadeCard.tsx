import React from 'react';
import { VStack, HStack, Avatar, ScrollView, Image } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Titulo } from './Titulo';
import { tokenMidia } from '../utils/token';

interface Props {
    dadosAtividades: any; // Os dados do grupo de atividades
    listaAtividades: any; // Atividades pertencentes ao grupo
    titulo: string;
    onPressAtividade: () => void; // Função passada como prop
    onPressExercicio: (atividadeId: string) => void; // Função passada como prop
}

const nomesCorretos = {
    'socializacao': 'Socialização',
    'motorizacao': 'Motorização',
    'linguagem': 'Linguagem',
    'autoCuidado': 'Auto-Cuidado',
    'motor': 'Motor',
    'cognicao': 'Cognição',
}

const AtividadeCard: React.FC<Props> = ({ dadosAtividades, listaAtividades, titulo, onPressAtividade, onPressExercicio }) => {
    if (!dadosAtividades) {
        return null; // Não renderiza nada se não houver dados
    }

    return (
        <VStack
            alignSelf={"center"}
            padding='5'
            flexDirection='column'
            borderWidth={0}
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
                    <Avatar
                        size='xl'
                        borderWidth='1'
                        source={{ uri: `${dadosAtividades.imagem}${tokenMidia}` }}
                    />
                    <VStack flexDirection='column' flexShrink={1}>
                        <Titulo color='black' bold fontSize='md'>
                            {dadosAtividades.nomeGrupo}
                        </Titulo>
                        
                        <Titulo fontSize='sm' mt='3%'>
                            {dadosAtividades.descricao}
                        </Titulo>
                    </VStack>
                </HStack>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} mt='4%'>
                <HStack space={3}>
                    {listaAtividades.map((atividade, index) => (
                        <TouchableOpacity key={index} onPress={() => onPressExercicio(atividade._id)} activeOpacity={0.5}>
                            <VStack
                                flexDirection='column'
                                padding='2'
                                alignItems='center'
                                width={150}
                            >
                                <Image
                                    alt="imagem da atividade"
                                    size='md'
                                    borderWidth='1'
                                    source={{ uri: `${atividade.fotoDaAtividade}${tokenMidia}` }}
                                />
                                <Titulo fontSize='sm' bold color='black' textAlign='center'>
                                    {atividade.nomdeDaAtividade.length > 20
                                        ? atividade.nomdeDaAtividade.substring(0, 20) + "..."
                                        : atividade.nomdeDaAtividade}
                                </Titulo>
                                
                                <Titulo fontSize='xs' textAlign='center'>
                                    ({nomesCorretos[atividade.tipoDeAtividade] || atividade.tipoDeAtividade})
                                </Titulo>
                            </VStack>
                        </TouchableOpacity>
                    ))}
                </HStack>
            </ScrollView>
        </VStack>
    );
};

export default AtividadeCard;

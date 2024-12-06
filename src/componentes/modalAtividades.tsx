import React, { useEffect } from 'react';
import { Modal, Text, VStack } from 'native-base';
import { Video, ResizeMode, Audio } from 'expo-av';
import { Botao } from './Botao'; // Importar seu botão customizado se necessário
import { Titulo } from './Titulo';

interface Props {
    botao?: string; // Botão para abrir o modal, opcional
    bodyText: string; // Texto do corpo do modal
    minimalText?: string; // Texto menor
    detailsText?: string; // Texto detalhado
    videoUrl?: string; // URL do vídeo a ser exibido
    audioUrl?: string; // URL do áudio a ser reproduzido
    confirmButtonText?: string; // Texto opcional para o botão de confirmação
    onConfirm?: () => void; // Função a ser chamada na confirmação
    cancelButtonText?: string; // Texto opcional para o botão de cancelamento
    isVisible: boolean; // Controle de visibilidade do modal
    onClose: () => void; // Função a ser chamada para fechar o modal
    showCancelButton?: boolean; // Controla a visibilidade do botão de cancelamento
    width?: string; // Largura do modal
    height?: string; // Altura do modal
    tamanhoDaTela?: number; // Tamanho opcional do modal
    margemDoVideo?: number;
}

const ModalAtividade: React.FC<Props> = ({
    botao,
    bodyText,
    minimalText,
    detailsText,
    videoUrl,
    audioUrl,
    confirmButtonText,
    onConfirm,
    cancelButtonText,
    isVisible,
    onClose,
    showCancelButton = true, // Padrão para true, mas pode ser sobrescrito
    width = '100%', // Padrão de largura
    height = 'auto', // Padrão de altura
    tamanhoDaTela = 1,
    margemDoVideo = 60
}) => {
    useEffect(() => {
        if (isVisible) {
            handleOpenModal();
        } else {
            handleCloseModal();
        }
    }, [isVisible]);

    useEffect(() => {
        // Função para reproduzir áudio quando o modal é aberto
        const playAudio = async () => {
            if (audioUrl) {
                const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
                await sound.playAsync(); // Tocar o som
            }
        };

        if (isVisible) {
            playAudio();
        }
    }, [isVisible, audioUrl]);

    const handleOpenModal = () => {
        // Não faz nada aqui, pois o controle é feito pela prop isVisible
    };

    const handleCloseModal = () => {
        onClose(); // Chama a função de fechamento passada como prop
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        handleCloseModal();
    };

    return (
        <>
            {botao && (
                <Botao onPress={handleOpenModal} mb='10%'>
                    {botao}
                </Botao>
            )}

            <Modal isOpen={isVisible} onClose={handleCloseModal} size="full" alignContent='center' flexDir='row'>
                <Modal.Content maxWidth={width} maxHeight={height} alignSelf="center" flex={tamanhoDaTela} bg='white'>
                    <Modal.Body bg='white'>
                        {videoUrl && (
                            <VStack mt={`${margemDoVideo}%`} mb='10%'>
                                <Video
                                    source={{ uri: videoUrl }} // URL do vídeo
                                    style={{ width: '100%', height: 200 }} // Ajuste a altura conforme necessário
                                    resizeMode={ResizeMode.CONTAIN}
                                    shouldPlay
                                    isLooping
                                    isMuted
                                />
                            </VStack>
                        )}
                        <Titulo alignSelf="center" mt="4%" bold fontSize='xl' color='black'>{bodyText}</Titulo>
                        {minimalText && <Titulo alignSelf="center" mt="2%" fontSize='md' color='black'>{minimalText}</Titulo>}
                        {detailsText && <Titulo alignSelf="center" mt="2%" fontSize='md' color='black' marginTop='5%' bold>{detailsText}</Titulo>}
                        
                        
                        <VStack space={2} mt={4} alignItems="center">
                            {onConfirm && confirmButtonText && (
                                <Botao onPress={handleConfirm} alignSelf="center">
                                    {confirmButtonText}
                                </Botao>
                            )}
                            {showCancelButton && (
                                <Botao mt='3%' onPress={handleCloseModal} alignSelf="center">
                                    {cancelButtonText || 'Sair'}
                                </Botao>
                            )}
                        </VStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    );
};

export default ModalAtividade;

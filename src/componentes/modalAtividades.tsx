import React, { useEffect } from 'react';
import { Modal, Text, VStack } from 'native-base';
import { Video, ResizeMode } from 'expo-av';
import { Botao } from './Botao'; // Importar seu botão customizado se necessário

interface Props {
    botao?: string; // Botão para abrir o modal, opcional
    bodyText: string; // Texto do corpo do modal
    videoUrl?: string; // URL do vídeo a ser exibido
    confirmButtonText?: string; // Texto opcional para o botão de confirmação
    onConfirm?: () => void; // Função a ser chamada na confirmação
    cancelButtonText?: string; // Texto opcional para o botão de cancelamento
    isVisible: boolean; // Controle de visibilidade do modal
    onClose: () => void; // Função a ser chamada para fechar o modal
    showCancelButton?: boolean; // Controla a visibilidade do botão de cancelamento
    width?: string; // Largura do modal
    height?: string; // Altura do modal
    tamanhoDaTela?: number;
}

const ModalAtividade: React.FC<Props> = ({
    botao,
    bodyText,
    videoUrl,
    confirmButtonText,
    onConfirm,
    cancelButtonText,
    isVisible,
    onClose,
    showCancelButton = true, // Padrão para true, mas pode ser sobrescrito
    width = '90%', // Padrão de largura
    height = 'auto', // Padrão de altura
    tamanhoDaTela = 1
}) => {

    useEffect(() => {
        if (isVisible) {
            handleOpenModal();
        } else {
            handleCloseModal();
        }
    }, [isVisible]);

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
                           <VStack mt='60%' mb='10%'>
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

                        <Text alignSelf="center" mt="4%" bold fontSize='xl'>{bodyText}</Text>
                        
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
import { Text, ITextProps } from 'native-base';
import { ReactNode } from 'react';

interface TituloProps extends ITextProps {
  children?: ReactNode; // Tornando children opcional
}

export function Titulo({ children, ...rest }: TituloProps) {
  const isValidChildren = children && (typeof children === 'string' ? children.trim() !== '' : true);

  return (
    <Text
      fontSize="2xl"
      fontWeight='light'
      color='gray.500'
      textAlign='center'
      {...rest}
    >
      {isValidChildren ? children : 'Carregando...'}
    </Text>
  );
}

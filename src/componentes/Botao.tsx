import { Button, IButtonProps } from 'native-base';
import { ReactNode } from "react";

interface ButtonProps extends IButtonProps {
  children: ReactNode;
  autoSize?: boolean;
  color?: string;
}

export function Botao({ children, autoSize = false, color, ...rest }: ButtonProps){

  return (
    <Button
      w={autoSize ? 'auto' : '90%'}
      bg={color || 'rosaEscuro'}
      borderRadius='lg'
      _text={{ color: "white", fontWeight:'bold'  }}
      mt={10}
      _pressed={{ bg: 'roxoClaro' }}
      {...rest}
    >
      {children}
    </Button>
  );
};
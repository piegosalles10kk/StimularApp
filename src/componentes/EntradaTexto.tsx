import { Input, FormControl } from "native-base";

interface InputProps {
  label?: string;
  placeholder: string;
  secureTextEntry?: boolean;
  leftIcon?: React.ReactNode;
}

export function EntradaTexto ({ 
  label, 
  placeholder, 
  secureTextEntry = false
} : InputProps) : JSX.Element {
  return (
    <FormControl mt={3}>
      {label && <FormControl.Label>{label}</FormControl.Label>}
      <Input
        placeholder={placeholder}
        size="lg"
        w="90%"
        borderRadius="lg"
        bgColor="gray.100"
        secureTextEntry={secureTextEntry}
        shadow={3}
        _focus={{
            borderColor: 'roxoClaro', // Cor da borda quando o input está focado
            borderWidth: 2, // Largura da borda quando o input está focado
          }}
          
      />
    </FormControl>
  );
};
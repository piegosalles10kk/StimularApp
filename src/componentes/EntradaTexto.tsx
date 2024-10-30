import { KeyboardTypeOptions } from 'react-native';
import { Input, FormControl } from "native-base";

interface InputProps {
  label?: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  type?: string; // Adicionando type
}

export function EntradaTexto ({
  label,
  placeholder,
  keyboardType,
  secureTextEntry = false,
  value,
  onChangeText,
  type,
}: InputProps): JSX.Element {

  // Função para formatar a entrada da data
  const handleTextChange = (text: string) => {
    let formattedText = text.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    if (formattedText.length > 2) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2)}`;
    }
    if (formattedText.length > 5) {
      formattedText = `${formattedText.slice(0, 5)}/${formattedText.slice(5, 9)}`;
    }

    onChangeText && onChangeText(formattedText); // Chama a função de alteração com o texto formatado
  };

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
          borderColor: 'roxoClaro',
          borderWidth: 2,
        }}
        value={value}
        onChangeText={type === 'data' ? handleTextChange : onChangeText} // Usando a formatação apenas para campos do tipo 'data'
        keyboardType={keyboardType}
      />
    </FormControl>
  );
}

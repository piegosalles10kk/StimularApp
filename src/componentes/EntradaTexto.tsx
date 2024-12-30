import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

interface InputProps {
  label?: string;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  type?: string;
  errorMessage?: string;
  tamanhoDoInput?: number;
  multiline?: boolean; // Nova propriedade para permitir a quebra de linha
}

const formatText = (text: string): string => {
  let formattedText = text.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

  if (formattedText.length > 2) {
    formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2)}`;
  }
  if (formattedText.length > 5) {
    formattedText = `${formattedText.slice(0, 5)}/${formattedText.slice(5, 9)}`;
  }

  return formattedText;
};

export const EntradaTexto: React.FC<InputProps> = ({
  label,
  placeholder,
  keyboardType,
  secureTextEntry = false,
  value,
  onChangeText,
  type,
  errorMessage,
  tamanhoDoInput = 40,
  multiline = false, // Valor padrão para a propriedade multiline
}) => (
  <View style={styles.container}>
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={type === 'data' ? (text) => onChangeText && onChangeText(formatText(text)) : onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={[styles.input, { height: tamanhoDoInput }]} // Aplicando dinamicamente o tamanho do input
      mode="outlined"
      error={!!errorMessage}
      multiline={multiline} // Aplicando a propriedade multiline
    />
    {errorMessage && <HelperText type="error">{errorMessage}</HelperText>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginBottom: 16,
    alignSelf: 'center', // Centraliza o input
  },
  input: {
    width: 300,
  },
});

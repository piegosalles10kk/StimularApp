import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { Box } from 'native-base';

const EntradaData = ({ label, placeholder, onChange, secureTextEntry = false, style = {}, textStyle = {} }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (input) => {
    // Remove any non-digit characters
    const cleaned = input.replace(/\D/g, '');
    // Format the string as DD/MM/YYYY
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length >= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    }
    setText(formatted);
    onChange(formatted);
  };

  return (
    <Box
      mt={2}
      size="auto"
      w="90%"
      borderRadius="lg"
      bgColor="gray.100"
      shadow={3}
      style={isFocused ? [styles.focused, style] : [styles.unfocused, style]}
    >
      <TextInput
        style={[styles.input, textStyle]}
        placeholder={placeholder}
        value={text}
        onChangeText={handleChange}
        keyboardType="numeric"
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderRadius: 10,
    width: 380,
  },
  focused: {
    borderColor: 'roxoClaro',
    borderWidth: 2,
  },
  unfocused: {
    borderColor: 'transparent',
    borderWidth: 2,
  },
});

export default EntradaData;

import { Image } from 'native-base';
import Logo from '../assets/logo.png';

export function ImagemLogo({ style = {}, ...props }) {
  return (
    <Image 
      source={Logo}
      style={[{ width: '100%', height: '20%' }, style]}
      resizeMode="contain"
      alt='Logo Stimular'
      mb={2}
      alignSelf='center'
      mt={15}
      {...props}
    />
  );
};

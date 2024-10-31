import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, Platform, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import PrincipalPaciente from './Paciente/PrincipalPaciente';
import PrincipalProfissional from './Profissional/PrincipalProfissional';
import PrincipalAdmin from './Admin/PrincipalAdmin';

import AtividadesPaciente from './Paciente/AtividadesPaciente';
import AtividadesProfissional from './Profissional/AtividadesProfissional';
import AtividadesAdmin from './Admin/AtividadesAdmin';

import PerfilPaciente from './Paciente/PerfilPaciente';
import PerfilProfissional from './Profissional/PerfilProfissional';
import PerfilAdmin from './Admin/PerfilAdmin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const Tab = createBottomTabNavigator();

async function tipoConta() {
    const tipoUsuario = await AsyncStorage.getItem('tipoDeConta');
    return tipoUsuario;
  }



const { height } = Dimensions.get('window');
const tabBarHeight = Platform.OS === 'ios' ? 80 : 55

const screenOptions = {
    tabBarStyle: {        
        height: tabBarHeight,
    },
    tabBarActiveTintColor: '#FDA0AD',
    tabBarInactiveTintColor: '#000',
    tabBarLabelStyle: {
        fontSize: 13,
        marginBottom: Platform.OS === 'ios' ? 1 : 1, 
    },
    tabBarIconStyle: {
        marginTop: Platform.OS === 'ios' ? 3 : 1,
    },
};

const tabsPaciente = [
    {
        name: 'Principal',
        component: PrincipalPaciente,
        icon: 'home'
    },
    {
        name: 'Atividades',
        component: AtividadesPaciente,
        icon: 'book'
    },
    {
        name: 'Perfil',
        component: PerfilPaciente,
        icon: 'person'
    }
];

const tabsProfissional = [
    {
        name: 'Principal',
        component: PrincipalProfissional,
        icon: 'home'
    },
    {
        name: 'Atividades',
        component: AtividadesProfissional,
        icon: 'book'
    },
    {
        name: 'Perfil',
        component: PerfilProfissional,
        icon: 'person'
    },
];

const tabsAdmin = [
    {
        name: 'Principal',
        component: PrincipalAdmin,
        icon: 'home'
    },
    {
        name: 'Atividades',
        component: AtividadesAdmin,
        icon: 'book'
    },
    {
        name: 'Perfil',
        component: PerfilAdmin,
        icon: 'person'
    },
];

 async function getTabs() {
    const tipoUsuario = await tipoConta();
    if (tipoUsuario === "Paciente") {
        return tabsPaciente;
    } else if (tipoUsuario === "Profissional") {
        return tabsProfissional;
    } else if (tipoUsuario === "Admin") {
        return tabsAdmin;
    }
    return [];
}


export default function Tabs() {
    const [ tabs, setTabs ] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTabs().then((tabs) => {
            setTabs(tabs);
            setLoading(false);
    });
      }, []);

      

      if (loading) {
        return <Text>Carregando...</Text>;
      }
    
      if (tabs.length === 0) {
        return <Text>Nenhuma tela encontrada</Text>;
      }
    
      return (
        <Tab.Navigator screenOptions={screenOptions}>
          {tabs.map((tab) => (
            <Tab.Screen
              key={tab.name}
              name={tab.name}
              component={tab.component}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name={tab.icon}
                    color={color}
                    size={size}
                  />
                )
              }}
            />
          ))}
        </Tab.Navigator>
      );
    }
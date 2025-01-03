import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Cadastro from "./Cadastro";
import Login from "./Login";
import Tabs from "./Tabs";
import AlterarPerfil from "./Tabs/Paciente/Perfil/AlterarPerfil";
import GrupoAtividadesTela from "./Tabs/Paciente/Atividades/GrupoAtividadesTela";
import ExercicioTela from "./Tabs/Paciente/Atividades/ExercicioTela";
import CadastroGrupo from "./CadastroGrupo";
import RecuerarSenha from "./RecuperarSenha";
import AlterarPerfilAdmin from "./Tabs/Admin/EditarUsuario/AlterarPerfilAdmin";
import CriarUsuarioAdmin from "./Tabs/Admin/EditarUsuario/CriarUsuarioAdmin";
import CriarAtividade from "./Tabs/Admin/Atividades/CriarAtividadeAdmin";
import DadosUsuario from "./Tabs/Profissional/TabsProfissional/DadosUsuario";
import AlterarPerfilProfissional from "./Tabs/Profissional/Perfil/AlterarPerfilProfissional";

const Tab = createNativeStackNavigator();


export default function Rotas() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen 
                    name="Login" 
                    component={Login} 
                    options={{ headerShown: false }}
                />
                <Tab.Screen 
                    name="Cadastro" 
                    component={Cadastro} 
                    options={{ headerShown: false }}
                />
                 <Tab.Screen 
                    name="Tabs" 
                    component={Tabs} 
                    options={{ headerShown: false }}
                />


                <Tab.Screen 
                    name="AlterarPerfil" 
                    component={AlterarPerfil} 
                    options={{ headerShown: false }}
                    />

                <Tab.Screen 
                    name="GrupoAtividadesTela" 
                    component={GrupoAtividadesTela} 
                    options={{ headerShown: false }}
                    />
                

                <Tab.Screen 
                    name="ExercicioTela" 
                    component={ExercicioTela} 
                    options={{ headerShown: false }}
                    />

                <Tab.Screen 
                    name="CadastroGrupo" 
                    component={CadastroGrupo} 
                    options={{ headerShown: false }}
                    />

                <Tab.Screen 
                    name="RecuperarSenha" 
                    component={RecuerarSenha} 
                    options={{ headerShown: false }}
                />

                <Tab.Screen 
                    name="AlterarPerfilAdmin" 
                    component={AlterarPerfilAdmin} 
                    options={{ headerShown: false }}
                />

                <Tab.Screen 
                    name="CriarUsuarioAdmin" 
                    component={CriarUsuarioAdmin} 
                    options={{ headerShown: false }}
                />

                <Tab.Screen 
                    name="CriarAtividade" 
                    component={CriarAtividade} 
                    options={{ headerShown: false }}
                />

                <Tab.Screen 
                    name="DadosUsuario" 
                    component={DadosUsuario} 
                    options={{ headerShown: false }}
                />
                <Tab.Screen 
                    name="AlterarPerfilProfissional" 
                    component={AlterarPerfilProfissional} 
                    options={{ headerShown: false }}
                />


                
            </Tab.Navigator>
        </NavigationContainer>
    );
}
import api from "./api";
import { UsuarioCadastro } from "../interfaces/UsuarioCadastro";

export async function cadastrarPaciente(paciente: UsuarioCadastro) {
    if(!paciente) return null;

    try{
        const resultado = await api.post('/auth/register', paciente);
        console.log(resultado.data);
        return resultado.data
    }
    catch(error){
        console.log(error);
        return null;
    };
}

export async function pegarDadosUsuario(id: string, token: string){
    try {
        const resultado = await api.get(`/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return resultado.data;
    }catch(error){
        console.log(error);
        return null
    }
}

export async function atualizarPaciente(paciente: UsuarioCadastro, idDoPaciente: string, token: string) {
  if (!paciente) return null;

  try {
    const resultado = await api.put(`/user/${idDoPaciente}`, paciente, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(resultado.data);
    return resultado.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateMoeda(userId: string, token: string, moeda: { moeda: { valor: number; dataDeCriacao?: Date } }) {
  try {
      console.log('Atualizando moeda para o usuário:', userId, 'com dados:', moeda); 

      const resultado = await api.patch(`/users/${userId}/moeda`, moeda, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      console.log('Resposta da atualização:', resultado.data);
      return resultado.data;

  } catch (error) {
      console.log('Erro ao atualizar moeda do usuário:', error.response ? error.response.data : error.message); // Mais detalhes sobre o erro
      return null;
  }
}

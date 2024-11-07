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
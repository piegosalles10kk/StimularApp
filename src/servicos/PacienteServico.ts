import api from "./api";
import { Paciente } from "../interfaces/Paciente";

export async function cadastrarPaciente(paciente: Paciente) {
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
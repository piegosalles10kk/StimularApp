import api from "./api";

export async function pegarGruposAtividadesNivel(token: string, nivel: number) {
    try {
      const resultado = await api.get(`/grupos-atividades/nivel?nivel=${nivel}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return resultado.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

export async function pegarGruposAtividadesPorId(id: string ,token: string){
    try {
        const resultado = await api.get(`/grupoatividades/${id}`, {
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
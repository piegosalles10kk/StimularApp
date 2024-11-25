import api from "./api";

export async function pegarGruposAtividadesNivel(token: string, nivel: number, grupo: Array<string> = [], tipoAtividade: Array<string> = []) {
    try {
      const resultado = await api.get(`/grupos-atividades/nivel?nivel=${nivel}&grupo=${grupo}&tipoDeAtividades=${tipoAtividade}`, {
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

export async function pegarAtividadesPorId(idGrupoAtividades: string ,idAtividade ,token: string){
  try {
      const resultado = await api.get(`/atividades/${idGrupoAtividades}/${idAtividade}`, {
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

export async function postarAtividadeFinalizada(grupoAtividadeId: string ,token: string){
  try {
      const resultado = await api.post(`/grupoatividades/${grupoAtividadeId}/atividadesfinalizadas`, {
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

export async function postarAtividadeEmAndamento(grupoAtividadeId: string, token: string, 
  respostas: Array<{ atividade_id: string; exercicioId: string; alternativaId: string; isCorreta: boolean; pontuacao: number; }>) {
  try {
      const resultado = await api.post(`/grupoatividades/${grupoAtividadeId}/atividadesemandamento`, {
          respostas: respostas // Adicionando o array de respostas ao corpo da requisição
      }, {
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

export async function atualizarAtividadeEmAndamento(grupoAtividadeEmAndamentoId: string, token: string,
  dados: { atividade_id: string; exercicioId: string; alternativaId: string; isCorreta: boolean; pontuacao: number; }) {

  try {
      const resultado = await api.patch(`/grupos/${grupoAtividadeEmAndamentoId}/respostas`, dados, { // Agora mandamos o objeto diretamente
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      return resultado.data;
  } catch (error) {
      console.log('Erro na requisição para atualizar atividade em andamento:', error.response ? error.response.data : error.message);
      return null;
  }
}





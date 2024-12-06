import api from "./api";

export async function enviarFotoDePerfil(id: string, foto: any) {
  const formData = new FormData();
  formData.append('file', {
    uri: foto.uri,
    type: foto.type,
    name: foto.fileName || 'photo.jpg'
  } as any);

  try {
    const resultado = await api.post(`/midia/post/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return resultado.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

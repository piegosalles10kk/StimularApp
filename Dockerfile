# Use uma imagem base oficial do Node.js
FROM node:14

# Instale o Expo CLI globalmente
RUN npm install -g expo-cli

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código para o diretório de trabalho
COPY . .

# Exponha a porta em que o aplicativo será executado
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Defina o comando para rodar a aplicação
CMD ["npx", "expo", "start", "--tunnel"]

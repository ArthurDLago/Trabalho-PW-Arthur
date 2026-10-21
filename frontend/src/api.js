import axios from 'axios';

export const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// Mensagem de erro devolvida pela API
export const getMensagemErro = (err) =>
    err.response?.data?.message || 'Erro ao comunicar com a API';

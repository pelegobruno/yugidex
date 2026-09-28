import axios from 'axios';

const BASE_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

/**
 * Procura TODAS as cartas liberadas na base de dados (+12.000 cartas).
 * Retorna o catálogo completo sem qualquer restrição ou filtro de exclusão.
 */
export const fetchAllCards = async () => {
  try {
    const response = await axios.get(BASE_URL);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error("Erro ao carregar todas as cartas da API:", error);
    return [];
  }
};

/**
 * Procura cartas por nome ou ID diretamente no servidor da API.
 * @param {string|number} query 
 */
export const searchCardsQuery = async (query) => {
  if (!query) return [];
  try {
    const isId = !isNaN(query);
    const endpoint = isId 
      ? `${BASE_URL}?id=${query}` 
      : `${BASE_URL}?fname=${encodeURIComponent(query)}`;
    
    const response = await axios.get(endpoint);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error(`Erro ao procurar carta "${query}":`, error);
    return [];
  }
};
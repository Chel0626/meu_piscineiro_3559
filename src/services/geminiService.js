import genAI from '../utils/gemini';

/**
 * Generates text response based on user input
 * @param {string} prompt - User's input prompt
 * @param {Object} options - Optional configuration
 * @returns {Promise<string>} Generated text response
 */
export const generateText = async (prompt, options = {}) => {
  try {
    if (!import.meta.env?.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key não configurada. Adicione VITE_GEMINI_API_KEY ao arquivo .env');
    }

    const model = genAI?.getGenerativeModel({ 
      model: options?.model || 'gemini-1.5-flash',
      generationConfig: {
        temperature: options?.temperature || 0.7,
        maxOutputTokens: options?.maxTokens || 1000,
        ...options?.generationConfig
      }
    });

    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error('Erro na geração de texto:', error);
    throw new Error(`Falha ao gerar resposta: ${error.message}`);
  }
};

/**
 * Streams text response in real-time
 * @param {string} prompt - User's input prompt
 * @param {Function} onChunk - Callback for each text chunk
 * @param {Object} options - Optional configuration
 */
export const streamText = async (prompt, onChunk, options = {}) => {
  try {
    if (!import.meta.env?.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key não configurada');
    }

    const model = genAI?.getGenerativeModel({ 
      model: options?.model || 'gemini-1.5-flash',
      generationConfig: {
        temperature: options?.temperature || 0.7,
        maxOutputTokens: options?.maxTokens || 1000,
        ...options?.generationConfig
      }
    });

    const result = await model?.generateContentStream(prompt);
    
    for await (const chunk of result?.stream) {
      const text = chunk?.text();
      if (text && onChunk) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error('Erro no streaming de texto:', error);
    throw new Error(`Falha no streaming: ${error.message}`);
  }
};

/**
 * Generates text based on text prompt and image
 * @param {string} prompt - Text prompt
 * @param {File} imageFile - Image file
 * @param {Object} options - Optional configuration
 * @returns {Promise<string>} Generated text response
 */
export const generateTextFromImage = async (prompt, imageFile, options = {}) => {
  try {
    if (!import.meta.env?.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key não configurada');
    }

    const model = genAI?.getGenerativeModel({ 
      model: options?.model || 'gemini-1.5-pro' 
    });

    // Convert image to base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
      });

    const imageBase64 = await toBase64(imageFile);
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: imageFile?.type || 'image/jpeg',
      },
    };

    const result = await model?.generateContent([prompt, imagePart]);
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error('Erro na geração multimodal:', error);
    throw new Error(`Falha na análise da imagem: ${error.message}`);
  }
};

/**
 * Manages chat session with history
 * @param {string} prompt - User's input prompt
 * @param {Array} history - Chat history
 * @param {Object} options - Optional configuration
 * @returns {Promise<{response: string, updatedHistory: Array}>} Response and updated history
 */
export const chatWithHistory = async (prompt, history = [], options = {}) => {
  try {
    if (!import.meta.env?.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key não configurada');
    }

    const model = genAI?.getGenerativeModel({ 
      model: options?.model || 'gemini-1.5-flash',
      generationConfig: {
        temperature: options?.temperature || 0.7,
        maxOutputTokens: options?.maxTokens || 1000,
        ...options?.generationConfig
      }
    });

    const chat = model?.startChat({ history });
    const result = await chat?.sendMessage(prompt);
    const response = await result?.response;
    const text = response?.text();

    const updatedHistory = [
      ...history,
      { role: 'user', parts: [{ text: prompt }] },
      { role: 'model', parts: [{ text }] }
    ];

    return { response: text, updatedHistory };
  } catch (error) {
    console.error('Erro no chat:', error);
    throw new Error(`Falha no chat: ${error.message}`);
  }
};

/**
 * Generate pool maintenance suggestions based on context
 * @param {Object} poolData - Pool maintenance data
 * @returns {Promise<string>} AI-generated suggestions
 */
export const generatePoolMaintenanceSuggestions = async (poolData) => {
  const prompt = `
Como especialista em manutenção de piscinas, analise os dados fornecidos e sugira as melhores práticas de manutenção:

Dados da Piscina:
- Tipo: ${poolData?.type || 'Não informado'}
- Tamanho: ${poolData?.size || 'Não informado'}
- pH: ${poolData?.ph || 'Não medido'}
- Cloro: ${poolData?.chlorine || 'Não medido'}
- Temperatura: ${poolData?.temperature || 'Não medida'}
- Data última limpeza: ${poolData?.lastCleaning || 'Não informado'}
- Problemas relatados: ${poolData?.issues || 'Nenhum'}

Por favor, forneça:
1. Avaliação do estado atual
2. Sugestões específicas de manutenção
3. Produtos recomendados
4. Cronograma de manutenção
5. Dicas de prevenção

Resposta em português brasileiro, formato profissional e prático.
  `;

  try {
    return await generateText(prompt, { 
      temperature: 0.3,
      maxTokens: 800
    });
  } catch (error) {
    console.error('Erro ao gerar sugestões de manutenção:', error);
    throw error;
  }
};

/**
 * Generate service report summary using AI
 * @param {Object} serviceData - Service visit data
 * @returns {Promise<string>} AI-generated report summary
 */
export const generateServiceReport = async (serviceData) => {
  const prompt = `
Como piscineiro profissional, crie um relatório resumido do serviço realizado:

Dados do Serviço:
- Cliente: ${serviceData?.clientName || 'Não informado'}
- Data: ${serviceData?.date || 'Não informada'}
- Duração: ${serviceData?.duration || 'Não informada'}
- Serviços realizados: ${serviceData?.services?.join(', ') || 'Não informado'}
- Produtos utilizados: ${serviceData?.products?.join(', ') || 'Nenhum'}
- Observações: ${serviceData?.notes || 'Nenhuma'}
- pH antes/depois: ${serviceData?.phBefore}/${serviceData?.phAfter}
- Cloro antes/depois: ${serviceData?.chlorineBefore}/${serviceData?.chlorineAfter}

Crie um relatório profissional incluindo:
1. Resumo dos serviços realizados
2. Estado da piscina antes e depois
3. Produtos utilizados e quantidades
4. Recomendações para próxima visita
5. Observações importantes

Mantenha tom profissional e objetivo.
  `;

  try {
    return await generateText(prompt, { 
      temperature: 0.2,
      maxTokens: 600
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de serviço:', error);
    throw error;
  }
};

/**
 * Analyze pool image and provide insights
 * @param {File} imageFile - Pool image
 * @param {string} additionalContext - Additional context about the pool
 * @returns {Promise<string>} AI analysis of the pool image
 */
export const analyzePoolImage = async (imageFile, additionalContext = '') => {
  const prompt = `
Analise esta imagem de piscina como um especialista em manutenção. 

${additionalContext ? `Contexto adicional: ${additionalContext}` : ''}

Por favor, forneça:
1. Avaliação visual do estado da água
2. Identificação de possíveis problemas
3. Sugestões de limpeza ou manutenção
4. Estimativa de tempo necessário para limpeza
5. Produtos que podem ser necessários

Seja específico e prático nas recomendações. Resposta em português brasileiro.
  `;

  try {
    return await generateTextFromImage(prompt, imageFile, {
      model: 'gemini-1.5-pro'
    });
  } catch (error) {
    console.error('Erro ao analisar imagem da piscina:', error);
    throw error;
  }
};
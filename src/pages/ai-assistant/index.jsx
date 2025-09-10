import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { streamText, chatWithHistory, generatePoolMaintenanceSuggestions, analyzePoolImage } from '../../services/geminiService';

const AIAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Olá! Sou seu assistente de IA especializado em manutenção de piscinas. Como posso ajudá-lo hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeFeature, setActiveFeature] = useState('chat');
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const addMessage = (type, content, additionalData = {}) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
      ...additionalData
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleSendMessage = async () => {
    if (!inputText?.trim() && !selectedFile) return;
    
    setIsLoading(true);
    
    try {
      // Add user message
      const userMessageContent = inputText?.trim() || 'Imagem anexada';
      addMessage('user', userMessageContent, { 
        file: selectedFile ? {
          name: selectedFile?.name,
          type: selectedFile?.type,
          size: selectedFile?.size
        } : null 
      });

      let aiResponse;
      
      if (selectedFile && selectedFile?.type?.startsWith('image/')) {
        // Handle image analysis
        aiResponse = await analyzePoolImage(selectedFile, inputText?.trim());
      } else if (activeFeature === 'streaming') {
        // Handle streaming response
        setIsStreaming(true);
        setStreamingMessage('');
        
        const { response, updatedHistory } = await chatWithHistory(
          inputText?.trim(), 
          chatHistory
        );
        
        setChatHistory(updatedHistory);
        aiResponse = response;
      } else {
        // Handle regular chat
        const { response, updatedHistory } = await chatWithHistory(
          inputText?.trim(), 
          chatHistory
        );
        
        setChatHistory(updatedHistory);
        aiResponse = response;
      }

      // Add AI response
      addMessage('assistant', aiResponse);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      addMessage('assistant', 
        `Desculpe, ocorreu um erro: ${error?.message || 'Erro desconhecido'}. 
        Verifique se a chave da API do Gemini está configurada corretamente.`
      );
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setInputText('');
      setSelectedFile(null);
      if (fileInputRef?.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStreamSend = async () => {
    if (!inputText?.trim()) return;
    
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage('');
    
    try {
      // Add user message
      addMessage('user', inputText?.trim());
      
      let fullResponse = '';
      
      // Create a temporary message for streaming
      const tempMessageId = Date.now();
      setMessages(prev => [...prev, {
        id: tempMessageId,
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }]);
      
      await streamText(inputText?.trim(), (chunk) => {
        fullResponse += chunk;
        // Update the streaming message in real-time
        setMessages(prev => prev?.map(msg => 
          msg?.id === tempMessageId 
            ? { ...msg, content: fullResponse }
            : msg
        ));
      });
      
      // Finalize the streaming message
      setMessages(prev => prev?.map(msg => 
        msg?.id === tempMessageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));
      
    } catch (error) {
      console.error('Erro no streaming:', error);
      addMessage('assistant', `Erro no streaming: ${error?.message}`);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setInputText('');
    }
  };

  const handleGenerateMaintenanceSuggestions = async () => {
    setIsLoading(true);
    
    try {
      // Mock pool data - in real app, this would come from user input or database
      const mockPoolData = {
        type: 'Fibra de vidro',
        size: '8m x 4m',
        ph: '7.8',
        chlorine: '1.2 ppm',
        temperature: '28°C',
        lastCleaning: '3 dias atrás',
        issues: 'Água ligeiramente turva'
      };
      
      addMessage('user', 'Gerar sugestões de manutenção para a piscina');
      
      const suggestions = await generatePoolMaintenanceSuggestions(mockPoolData);
      addMessage('assistant', suggestions);
      
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      addMessage('assistant', `Erro ao gerar sugestões: ${error?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      if (file?.type?.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        alert('Por favor, selecione apenas arquivos de imagem.');
      }
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'assistant',
      content: 'Chat limpo! Como posso ajudá-lo?',
      timestamp: new Date()
    }]);
    setChatHistory([]);
  };

  const features = [
    {
      id: 'chat',
      name: 'Chat Normal',
      icon: 'MessageCircle',
      description: 'Conversa normal com IA'
    },
    {
      id: 'streaming',
      name: 'Chat Streaming',
      icon: 'Zap',
      description: 'Resposta em tempo real'
    },
    {
      id: 'image',
      name: 'Análise de Imagem',
      icon: 'Camera',
      description: 'Analise fotos de piscinas'
    },
    {
      id: 'maintenance',
      name: 'Sugestões',
      icon: 'Wrench',
      description: 'Dicas de manutenção'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate(-1)}
                className="mr-4"
              >
                Voltar
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Icon name="Brain" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Assistente IA - Gemini
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Powered by Google Gemini
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Trash2"
                onClick={clearChat}
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Features Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recursos Disponíveis
              </h3>
              
              <div className="space-y-2">
                {features?.map((feature) => (
                  <button
                    key={feature?.id}
                    onClick={() => setActiveFeature(feature?.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      activeFeature === feature?.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700' :'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={feature?.icon} 
                        size={18} 
                        color={activeFeature === feature?.id ? '#1d4ed8' : '#6b7280'} 
                      />
                      <div>
                        <p className="font-medium text-sm">{feature?.name}</p>
                        <p className="text-xs opacity-75">{feature?.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Ações Rápidas
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Wrench"
                    className="w-full justify-start"
                    onClick={handleGenerateMaintenanceSuggestions}
                    disabled={isLoading}
                  >
                    Sugestões de Manutenção
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message?.id}
                    className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                      message?.type === 'user' ?'bg-blue-600 text-white' :'bg-gray-100 text-gray-900'
                    }`}>
                      {/* File attachment indicator */}
                      {message?.file && (
                        <div className="mb-2 p-2 bg-white bg-opacity-20 rounded text-xs">
                          <Icon name="Paperclip" size={12} className="inline mr-1" />
                          {message?.file?.name} ({(message?.file?.size / 1024)?.toFixed(1)} KB)
                        </div>
                      )}
                      
                      <div className="whitespace-pre-wrap">{message?.content}</div>
                      
                      {message?.isStreaming && (
                        <div className="flex items-center mt-2">
                          <div className="animate-pulse flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="ml-2 text-xs opacity-75">Digitando...</span>
                        </div>
                      )}
                      
                      <div className="text-xs opacity-75 mt-1">
                        {message?.timestamp?.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                {/* File Upload */}
                {(activeFeature === 'image' || selectedFile) && (
                  <div className="mb-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {selectedFile ? (
                      <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Icon name="Image" size={16} className="text-blue-600" />
                          <span className="text-sm text-blue-700">
                            {selectedFile?.name} ({(selectedFile?.size / 1024)?.toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="X"
                          onClick={() => {
                            setSelectedFile(null);
                            fileInputRef.current.value = '';
                          }}
                        />
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Upload"
                        onClick={() => fileInputRef?.current?.click()}
                      >
                        Anexar Imagem
                      </Button>
                    )}
                  </div>
                )}

                {/* Text Input */}
                <div className="flex space-x-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e?.target?.value)}
                    placeholder={
                      activeFeature === 'image' ?'Descreva o que você quer analisar na imagem...' :'Digite sua pergunta sobre manutenção de piscinas...'
                    }
                    onKeyPress={(e) => {
                      if (e?.key === 'Enter' && !e?.shiftKey) {
                        e?.preventDefault();
                        if (activeFeature === 'streaming') {
                          handleStreamSend();
                        } else {
                          handleSendMessage();
                        }
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  
                  <Button
                    onClick={activeFeature === 'streaming' ? handleStreamSend : handleSendMessage}
                    disabled={isLoading || (!inputText?.trim() && !selectedFile)}
                    iconName={isLoading ? 'Loader2' : 'Send'}
                    iconSize={16}
                    className={isLoading ? 'animate-spin' : ''}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar'}
                  </Button>
                </div>

                {/* Feature-specific hints */}
                <div className="mt-2 text-xs text-gray-500">
                  {activeFeature === 'streaming' && 'Modo streaming: respostas em tempo real'}
                  {activeFeature === 'image' && 'Anexe uma foto da piscina para análise detalhada'}
                  {activeFeature === 'maintenance' && 'Peça sugestões específicas sobre manutenção'}
                  {activeFeature === 'chat' && 'Faça qualquer pergunta sobre piscinas'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
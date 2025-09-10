import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ClientModal = ({ isOpen, onClose, onSave, client, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    visitDay: '',
    status: 'Ativo',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const weekDayOptions = [
    { value: 'Segunda-feira', label: 'Segunda-feira' },
    { value: 'Terça-feira', label: 'Terça-feira' },
    { value: 'Quarta-feira', label: 'Quarta-feira' },
    { value: 'Quinta-feira', label: 'Quinta-feira' },
    { value: 'Sexta-feira', label: 'Sexta-feira' },
    { value: 'Sábado', label: 'Sábado' }
  ];

  const statusOptions = [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
    { value: 'Pendente', label: 'Pendente' }
  ];

  const stateOptions = [
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'PR', label: 'Paraná' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'BA', label: 'Bahia' },
    { value: 'GO', label: 'Goiás' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'CE', label: 'Ceará' }
  ];

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        name: client?.name || '',
        address: client?.address || '',
        city: client?.city || '',
        state: client?.state || '',
        zipCode: client?.zipCode || '',
        phone: client?.phone || '',
        email: client?.email || '',
        visitDay: client?.visitDay || '',
        status: client?.status || 'Ativo',
        notes: client?.notes || ''
      });
    } else {
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        visitDay: '',
        status: 'Ativo',
        notes: ''
      });
    }
    setErrors({});
  }, [client, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData?.address?.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (!formData?.city?.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData?.state) {
      newErrors.state = 'Estado é obrigatório';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/?.test(formData?.phone)) {
      newErrors.phone = 'Formato inválido. Use: (11) 99999-9999';
    }

    if (formData?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData?.visitDay) {
      newErrors.visitDay = 'Dia da visita é obrigatório';
    }

    if (!formData?.zipCode?.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    } else if (!/^\d{5}-\d{3}$/?.test(formData?.zipCode)) {
      newErrors.zipCode = 'Formato inválido. Use: 12345-678';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPhone = (value) => {
    const numbers = value?.replace(/\D/g, '');
    if (numbers?.length <= 10) {
      return numbers?.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers?.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatZipCode = (value) => {
    const numbers = value?.replace(/\D/g, '');
    return numbers?.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e?.target?.value);
    handleInputChange('phone', formatted);
  };

  const handleZipCodeChange = (e) => {
    const formatted = formatZipCode(e?.target?.value);
    handleInputChange('zipCode', formatted);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Editar Cliente' : 'Adicionar Cliente'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Nome Completo"
                type="text"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                placeholder="Digite o nome completo"
                error={errors?.name}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Endereço"
                type="text"
                value={formData?.address}
                onChange={(e) => handleInputChange('address', e?.target?.value)}
                placeholder="Rua, número, bairro"
                error={errors?.address}
                required
              />
            </div>

            <Input
              label="Cidade"
              type="text"
              value={formData?.city}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              placeholder="Nome da cidade"
              error={errors?.city}
              required
            />

            <Select
              label="Estado"
              options={stateOptions}
              value={formData?.state}
              onChange={(value) => handleInputChange('state', value)}
              placeholder="Selecione o estado"
              error={errors?.state}
              required
            />

            <Input
              label="CEP"
              type="text"
              value={formData?.zipCode}
              onChange={handleZipCodeChange}
              placeholder="12345-678"
              error={errors?.zipCode}
              maxLength={9}
              required
            />

            <Input
              label="Telefone"
              type="tel"
              value={formData?.phone}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              error={errors?.phone}
              maxLength={15}
              required
            />

            <Input
              label="Email (Opcional)"
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              placeholder="cliente@email.com"
              error={errors?.email}
            />

            <Select
              label="Dia da Visita"
              options={weekDayOptions}
              value={formData?.visitDay}
              onChange={(value) => handleInputChange('visitDay', value)}
              placeholder="Selecione o dia"
              error={errors?.visitDay}
              required
            />

            <Select
              label="Status"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => handleInputChange('status', value)}
              error={errors?.status}
            />

            <div className="md:col-span-2">
              <Input
                label="Observações (Opcional)"
                type="text"
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
                placeholder="Informações adicionais sobre o cliente"
                description="Instruções especiais, preferências, etc."
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName={mode === 'edit' ? 'Save' : 'Plus'}
              iconPosition="left"
            >
              {mode === 'edit' ? 'Salvar Alterações' : 'Adicionar Cliente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { apiService, apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';

const CodigosPostais = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCodigo, setEditingCodigo] = useState(null);
  const [formData, setFormData] = useState({
    cod_postal: '',
    cod_localidade: ''
  });

  const queryClient = useQueryClient();

  const { data: codigosPostais, isLoading } = useQuery(
    'codigos-postais',
    () => apiService.get(apiEndpoints.codigosPostais.list)
  );

  const mutation = useMutation(
    (data) => {
      if (editingCodigo) {
        return apiService.put(apiEndpoints.codigosPostais.update(editingCodigo.cod_postal), data);
      } else {
        return apiService.post(apiEndpoints.codigosPostais.create, data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('codigos-postais');
        toast.success(editingCodigo ? 'Código postal atualizado com sucesso' : 'Código postal criado com sucesso');
        handleCancel();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  const deleteMutation = useMutation(
    (codigo) => apiService.delete(apiEndpoints.codigosPostais.delete(codigo)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('codigos-postais');
        toast.success('Código postal eliminado com sucesso');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCodigo(null);
    setFormData({ cod_postal: '', cod_localidade: '' });
  };

  const handleEdit = (codigo) => {
    setEditingCodigo(codigo);
    setFormData({
      cod_postal: codigo.cod_postal || '',
      cod_localidade: codigo.cod_localidade || ''
    });
    setShowForm(true);
  };

  const handleDelete = (codigo, localidade) => {
    if (window.confirm(`Tem a certeza que quer eliminar o código postal "${codigo} - ${localidade}"?`)) {
      deleteMutation.mutate(codigo);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">A carregar códigos postais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <MapPin className="h-8 w-8 mr-3" />
          Códigos Postais
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Código Postal
        </button>
      </div>

      {showForm && (
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingCodigo ? 'Editar Código Postal' : 'Novo Código Postal'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal *
              </label>
              <input
                type="text"
                required
                value={formData.cod_postal}
                onChange={(e) => setFormData({...formData, cod_postal: e.target.value})}
                className="form-control w-full"
                placeholder="Ex: 2000-123"
                maxLength="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localidade *
              </label>
              <input
                type="text"
                required
                value={formData.cod_localidade}
                onChange={(e) => setFormData({...formData, cod_localidade: e.target.value})}
                className="form-control w-full"
                placeholder="Nome da localidade"
                maxLength="80"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="btn btn-primary"
              >
                {mutation.isLoading ? 'A guardar...' : (editingCodigo ? 'Atualizar' : 'Adicionar')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-striped w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código Postal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localidade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {codigosPostais?.data?.length > 0 ? (
                codigosPostais.data.map((codigo) => (
                  <tr key={codigo.cod_postal}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {codigo.cod_postal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {codigo.cod_localidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(codigo)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(codigo.cod_postal, codigo.cod_localidade)}
                          className="btn btn-outline-danger btn-sm"
                          disabled={deleteMutation.isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    Sem registos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CodigosPostais;



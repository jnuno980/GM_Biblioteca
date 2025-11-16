
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Trash2, Tag } from 'lucide-react';
import { apiService, apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';

const Generos = () => {
  const [showForm, setShowForm] = useState(false);
  const [genero, setGenero] = useState('');

  const queryClient = useQueryClient();

  const { data: generos, isLoading } = useQuery(
    'generos',
    () => apiService.get(apiEndpoints.generos.list)
  );

  const createMutation = useMutation(
    (data) => apiService.post(apiEndpoints.generos.create, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('generos');
        toast.success('Género criado com sucesso');
        handleCancel();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  const deleteMutation = useMutation(
    (genero) => apiService.delete(apiEndpoints.generos.delete(genero)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('generos');
        toast.success('Género eliminado com sucesso');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ ge_genero: genero });
  };

  const handleCancel = () => {
    setShowForm(false);
    setGenero('');
  };

  const handleDelete = (genero) => {
    if (window.confirm(`Tem a certeza que quer eliminar o género "${genero}"?`)) {
      deleteMutation.mutate(genero);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">A carregar géneros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Tag className="h-8 w-8 mr-3" />
          Géneros
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Género
        </button>
      </div>

      {showForm && (
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Novo Género</h2>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                required
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className="form-control w-full"
                placeholder="Nome do género"
                maxLength="20"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="btn btn-primary"
            >
              {createMutation.isLoading ? 'A adicionar...' : 'Adicionar'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline-secondary"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-striped w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Género
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {generos?.data?.length > 0 ? (
                generos.data.map((genero) => (
                  <tr key={genero.ge_genero}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {genero.ge_genero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(genero.ge_genero)}
                        className="btn btn-outline-danger btn-sm"
                        disabled={deleteMutation.isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
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

export default Generos;


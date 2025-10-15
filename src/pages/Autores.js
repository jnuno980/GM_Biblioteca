import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { apiService, apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';

const Autores = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAutor, setEditingAutor] = useState(null);
  const [formData, setFormData] = useState({
    au_nome: '',
    au_pais: ''
  });

  const queryClient = useQueryClient();

  const { data: autores, isLoading } = useQuery(
    'autores',
    () => apiService.get(apiEndpoints.autores.list)
  );

  const mutation = useMutation(
    (data) => {
      if (editingAutor) {
        return apiService.put(apiEndpoints.autores.update(editingAutor.au_cod), data);
      } else {
        return apiService.post(apiEndpoints.autores.create, data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('autores');
        toast.success(editingAutor ? 'Autor atualizado com sucesso' : 'Autor criado com sucesso');
        handleCancel();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => apiService.delete(apiEndpoints.autores.delete(id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('autores');
        toast.success('Autor eliminado com sucesso');
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
    setEditingAutor(null);
    setFormData({ au_nome: '', au_pais: '' });
  };

  const handleEdit = (autor) => {
    setEditingAutor(autor);
    setFormData({
      au_nome: autor.au_nome || '',
      au_pais: autor.au_pais || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id, nome) => {
    if (window.confirm(`Tem a certeza que quer eliminar o autor "${nome}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">A carregar autores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <User className="h-8 w-8 mr-3" />
          Autores
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Autor
        </button>
      </div>

      {showForm && (
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingAutor ? 'Editar Autor' : 'Novo Autor'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                required
                value={formData.au_nome}
                onChange={(e) => setFormData({...formData, au_nome: e.target.value})}
                className="form-control w-full"
                placeholder="Nome do autor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <input
                type="text"
                value={formData.au_pais}
                onChange={(e) => setFormData({...formData, au_pais: e.target.value})}
                className="form-control w-full"
                placeholder="País"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="btn btn-primary"
              >
                {mutation.isLoading ? 'A guardar...' : (editingAutor ? 'Atualizar' : 'Adicionar')}
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
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  País
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {autores?.data?.length > 0 ? (
                autores.data.map((autor) => (
                  <tr key={autor.au_cod}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {autor.au_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {autor.au_pais || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(autor)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(autor.au_cod, autor.au_nome)}
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

export default Autores;



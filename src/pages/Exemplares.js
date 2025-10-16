import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Trash2, Library, ToggleLeft, ToggleRight } from 'lucide-react';
import { exemplaresService, livrosService } from '../services/api';
import toast from 'react-hot-toast';

const Exemplares = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    lex_li_cod: '',
    lex_estado: 'Bom'
  });

  const queryClient = useQueryClient();

  // Fetch exemplares
  const { data: exemplares, isLoading } = useQuery(
    'exemplares',
    () => exemplaresService.getAll()
  );

  // Fetch livros
  const { data: livros } = useQuery(
    'livros',
    () => livrosService.getAll()
  );

  // Create mutation
  const createMutation = useMutation(
    (data) => apiService.post(apiEndpoints.exemplares.create, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exemplares');
        toast.success('Exemplar criado com sucesso');
        handleCancel();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  // Toggle mutation
  const toggleMutation = useMutation(
    (id) => apiService.put(apiEndpoints.exemplares.toggle(id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exemplares');
        toast.success('Disponibilidade alterada com sucesso');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  // Delete mutation
  const deleteMutation = useMutation(
    (id) => apiService.delete(apiEndpoints.exemplares.delete(id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exemplares');
        toast.success('Exemplar eliminado com sucesso');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      lex_li_cod: '',
      lex_estado: 'Bom'
    });
  };

  const handleToggle = (id) => {
    toggleMutation.mutate(id);
  };

  const handleDelete = (id, titulo) => {
    if (window.confirm(`Tem a certeza que quer eliminar o exemplar de "${titulo}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">A carregar exemplares...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Library className="h-8 w-8 mr-3" />
          Exemplares
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Exemplar
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Novo Exemplar</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Livro *
              </label>
              <select
                required
                value={formData.lex_li_cod}
                onChange={(e) => setFormData({...formData, lex_li_cod: e.target.value})}
                className="form-select w-full"
              >
                <option value="">—</option>
                {livros?.data?.map(livro => (
                  <option key={livro.li_cod} value={livro.li_cod}>
                    {livro.li_titulo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.lex_estado}
                onChange={(e) => setFormData({...formData, lex_estado: e.target.value})}
                className="form-select w-full"
              >
                <option value="Novo">Novo</option>
                <option value="Bom">Bom</option>
                <option value="Usado">Usado</option>
                <option value="Danificado">Danificado</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3">
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
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-striped w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disponível
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exemplares && exemplares.length > 0 ? (
                exemplares.map((exemplar) => (
                  <tr key={exemplar.lex_cod}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {exemplar.livro?.li_titulo || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exemplar.lex_estado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        exemplar.lex_disponivel 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exemplar.lex_disponivel ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggle(exemplar.lex_cod)}
                          className="btn btn-outline-secondary btn-sm"
                          disabled={toggleMutation.isLoading}
                          title="Alternar disponibilidade"
                        >
                          {exemplar.lex_disponivel ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(exemplar.lex_cod, exemplar.li_titulo)}
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
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
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

export default Exemplares;



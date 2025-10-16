
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, FileText, ArrowLeft } from 'lucide-react';
import { apiService, apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';

const Requisicoes = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    re_ut_cod: '',
    re_lex_cod: '',
    re_data_requisicao: new Date().toISOString().split('T')[0],
    re_data_devolucao: ''
  });

  const queryClient = useQueryClient();

  // Fetch requisicoes
  const { data: requisicoes, isLoading } = useQuery(
    'requisicoes',
    () => apiService.get(apiEndpoints.requisicoes.list)
  );

  // Fetch dropdown options
  const { data: utentes } = useQuery(
    'utentes',
    () => apiService.get(apiEndpoints.utentes.list)
  );

  const { data: exemplares } = useQuery(
    'exemplares-disponiveis',
    () => apiService.get(apiEndpoints.exemplares.list)
  );

  // Create mutation
  const createMutation = useMutation(
    (data) => apiService.post(apiEndpoints.requisicoes.create, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('requisicoes');
        toast.success('Requisição criada com sucesso');
        handleCancel();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  // Return mutation
  const returnMutation = useMutation(
    (id) => apiService.put(apiEndpoints.requisicoes.return(id), {
      re_data_devolucao: new Date().toISOString().split('T')[0]
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('requisicoes');
        toast.success('Devolução registrada com sucesso');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  // Delete mutation
  const deleteMutation = useMutation(
    (id) => apiService.delete(apiEndpoints.requisicoes.delete(id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('requisicoes');
        toast.success('Requisição eliminada com sucesso');
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
      re_ut_cod: '',
      re_lex_cod: '',
      re_data_requisicao: new Date().toISOString().split('T')[0],
      re_data_devolucao: ''
    });
  };

  const handleReturn = (id) => {
    if (window.confirm('Tem a certeza que quer registar a devolução?')) {
      returnMutation.mutate(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem a certeza que quer eliminar esta requisição?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter available exemplares
  const availableExemplares = exemplares?.data?.filter(ex => ex.lex_disponivel) || [];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">A carregar requisições...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FileText className="h-8 w-8 mr-3" />
          Requisições
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Requisição
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Nova Requisição</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utente *
              </label>
              <select
                required
                value={formData.re_ut_cod}
                onChange={(e) => setFormData({...formData, re_ut_cod: e.target.value})}
                className="form-select w-full"
              >
                <option value="">—</option>
                {utentes?.data?.map(utente => (
                  <option key={utente.ut_cod} value={utente.ut_cod}>
                    {utente.ut_nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exemplar *
              </label>
              <select
                required
                value={formData.re_lex_cod}
                onChange={(e) => setFormData({...formData, re_lex_cod: e.target.value})}
                className="form-select w-full"
              >
                <option value="">—</option>
                {availableExemplares.map(exemplar => (
                  <option key={exemplar.lex_cod} value={exemplar.lex_cod}>
                    {exemplar.li_titulo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Requisição *
              </label>
              <input
                type="date"
                required
                value={formData.re_data_requisicao}
                onChange={(e) => setFormData({...formData, re_data_requisicao: e.target.value})}
                className="form-control w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Devolução (opcional)
              </label>
              <input
                type="date"
                value={formData.re_data_devolucao}
                onChange={(e) => setFormData({...formData, re_data_devolucao: e.target.value})}
                className="form-control w-full"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="btn btn-primary"
              >
                {createMutation.isLoading ? 'A criar...' : 'Criar Requisição'}
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
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Requisição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Devolução
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requisicoes?.data?.length > 0 ? (
                requisicoes.data.map((req) => (
                  <tr key={req.re_cod}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {req.re_cod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {req.utente_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {req.livro_titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(req.re_data_requisicao).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {req.re_data_devolucao 
                        ? new Date(req.re_data_devolucao).toLocaleDateString('pt-PT')
                        : '—'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === 'emprestado' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {req.status === 'emprestado' ? 'Emprestado' : 'Devolvido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {req.status === 'emprestado' && (
                          <button
                            onClick={() => handleReturn(req.re_cod)}
                            className="btn btn-outline-success btn-sm"
                            disabled={returnMutation.isLoading}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(req.re_cod)}
                          className="btn btn-outline-danger btn-sm"
                          disabled={deleteMutation.isLoading}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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

export default Requisicoes;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, FileText, ArrowLeft } from 'lucide-react';
import { apiService, apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';

const Requisicoes = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    re_ut_cod: '',
    re_lex_cod: '',
    re_data_requisicao: new Date().toISOString().split('T')[0],
    re_data_devolucao: ''
  });

  const queryClient = useQueryClient();

  // Fetch requisicoes
  const { data: requisicoes, isLoading } = useQuery(
    'requisicoes',
    () => apiService.get(apiEndpoints.requisicoes.list)
  );

  // Fetch dropdown options
  const { data: utentes } = useQuery(
    'utentes',
    () => apiService.get(apiEndpoints.utentes.list)
  );

  const { data: exemplares } = useQuery(
    'exemplares-disponiveis',
    () => apiService.get(apiEndpoints.exemplares.list)
  );

  // Create mutation
  const createMutation = useMutation(
    (data) => apiService.post(apiEndpoints.requisicoes.create, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('requisicoes');
        toast.success('Requisição criada com sucesso');
        handleCancel();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  // Return mutation
  const returnMutation = useMutation(
    (id) => apiService.put(apiEndpoints.requisicoes.return(id), {
      re_data_devolucao: new Date().toISOString().split('T')[0]
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('requisicoes');
        toast.success('Devolução registrada com sucesso');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  // Delete mutation
  const deleteMutation = useMutation(
    (id) => apiService.delete(apiEndpoints.requisicoes.delete(id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('requisicoes');
        toast.success('Requisição eliminada com sucesso');
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
      re_ut_cod: '',
      re_lex_cod: '',
      re_data_requisicao: new Date().toISOString().split('T')[0],
      re_data_devolucao: ''
    });
  };

  const handleReturn = (id) => {
    if (window.confirm('Tem a certeza que quer registar a devolução?')) {
      returnMutation.mutate(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem a certeza que quer eliminar esta requisição?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter available exemplares
  const availableExemplares = exemplares?.data?.filter(ex => ex.lex_disponivel) || [];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">A carregar requisições...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FileText className="h-8 w-8 mr-3" />
          Requisições
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Requisição
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Nova Requisição</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utente *
              </label>
              <select
                required
                value={formData.re_ut_cod}
                onChange={(e) => setFormData({...formData, re_ut_cod: e.target.value})}
                className="form-select w-full"
              >
                <option value="">—</option>
                {utentes?.data?.map(utente => (
                  <option key={utente.ut_cod} value={utente.ut_cod}>
                    {utente.ut_nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exemplar *
              </label>
              <select
                required
                value={formData.re_lex_cod}
                onChange={(e) => setFormData({...formData, re_lex_cod: e.target.value})}
                className="form-select w-full"
              >
                <option value="">—</option>
                {availableExemplares.map(exemplar => (
                  <option key={exemplar.lex_cod} value={exemplar.lex_cod}>
                    {exemplar.li_titulo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Requisição *
              </label>
              <input
                type="date"
                required
                value={formData.re_data_requisicao}
                onChange={(e) => setFormData({...formData, re_data_requisicao: e.target.value})}
                className="form-control w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Devolução (opcional)
              </label>
              <input
                type="date"
                value={formData.re_data_devolucao}
                onChange={(e) => setFormData({...formData, re_data_devolucao: e.target.value})}
                className="form-control w-full"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="btn btn-primary"
              >
                {createMutation.isLoading ? 'A criar...' : 'Criar Requisição'}
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
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Requisição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Devolução
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requisicoes?.data?.length > 0 ? (
                requisicoes.data.map((req) => (
                  <tr key={req.re_cod}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {req.re_cod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {req.utente_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {req.livro_titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(req.re_data_requisicao).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {req.re_data_devolucao 
                        ? new Date(req.re_data_devolucao).toLocaleDateString('pt-PT')
                        : '—'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === 'emprestado' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {req.status === 'emprestado' ? 'Emprestado' : 'Devolvido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {req.status === 'emprestado' && (
                          <button
                            onClick={() => handleReturn(req.re_cod)}
                            className="btn btn-outline-success btn-sm"
                            disabled={returnMutation.isLoading}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(req.re_cod)}
                          className="btn btn-outline-danger btn-sm"
                          disabled={deleteMutation.isLoading}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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

export default Requisicoes;


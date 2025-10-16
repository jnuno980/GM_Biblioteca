
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { utentesService, codigosPostaisService } from '../services/api';
import toast from 'react-hot-toast';

const Utentes = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUtente, setEditingUtente] = useState(null);
  const [formData, setFormData] = useState({
    ut_nome: '',
    ut_nif: '',
    ut_email: '',
    ut_tlm: '',
    ut_morada: '',
    ut_cod_postal: ''
  });

  const queryClient = useQueryClient();

  // Fetch utentes
  const { data: utentes, isLoading } = useQuery(
    'utentes',
    () => utentesService.getAll()
  );

  // Fetch codigos postais
  const { data: codigosPostais } = useQuery(
    'codigos-postais',
    () => codigosPostaisService.getAll()
  );

  // Create/Update mutation
  const mutation = useMutation(
    (data) => {
      if (editingUtente) {
        return utentesService.update(editingUtente.ut_cod, data);
      } else {
        return utentesService.create(data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('utentes');
        toast.success(editingUtente ? 'Utente atualizado com sucesso' : 'Utente criado com sucesso');
        handleCancel();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  // Delete mutation
  const deleteMutation = useMutation(
    (id) => utentesService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('utentes');
        toast.success('Utente eliminado com sucesso');
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
    setEditingUtente(null);
    setFormData({
      ut_nome: '',
      ut_nif: '',
      ut_email: '',
      ut_tlm: '',
      ut_morada: '',
      ut_cod_postal: ''
    });
  };

  const handleEdit = (utente) => {
    setEditingUtente(utente);
    setFormData({
      ut_nome: utente.ut_nome || '',
      ut_nif: utente.ut_nif || '',
      ut_email: utente.ut_email || '',
      ut_tlm: utente.ut_tlm || '',
      ut_morada: utente.ut_morada || '',
      ut_cod_postal: utente.ut_cod_postal || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id, nome) => {
    if (window.confirm(`Tem a certeza que quer eliminar o utente "${nome}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">A carregar utentes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="h-8 w-8 mr-3" />
          Utentes
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Utente
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingUtente ? 'Editar Utente' : 'Novo Utente'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                required
                value={formData.ut_nome}
                onChange={(e) => setFormData({...formData, ut_nome: e.target.value})}
                className="form-control w-full"
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIF
              </label>
              <input
                type="text"
                value={formData.ut_nif}
                onChange={(e) => setFormData({...formData, ut_nif: e.target.value})}
                className="form-control w-full"
                placeholder="Número de identificação fiscal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.ut_email}
                onChange={(e) => setFormData({...formData, ut_email: e.target.value})}
                className="form-control w-full"
                placeholder="endereco@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telemóvel
              </label>
              <input
                type="text"
                value={formData.ut_tlm}
                onChange={(e) => setFormData({...formData, ut_tlm: e.target.value})}
                className="form-control w-full"
                placeholder="Número de telemóvel"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Morada
              </label>
              <input
                type="text"
                value={formData.ut_morada}
                onChange={(e) => setFormData({...formData, ut_morada: e.target.value})}
                className="form-control w-full"
                placeholder="Endereço completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal
              </label>
              <select
                value={formData.ut_cod_postal}
                onChange={(e) => setFormData({...formData, ut_cod_postal: e.target.value})}
                className="form-select w-full"
              >
                <option value="">— Selecionar —</option>
                {codigosPostais?.data?.map(cp => (
                  <option key={cp.cod_postal} value={cp.cod_postal}>
                    {cp.cod_postal} — {cp.cod_localidade}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex gap-3">
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="btn btn-primary"
              >
                {mutation.isLoading ? 'A guardar...' : (editingUtente ? 'Atualizar' : 'Adicionar')}
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
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telemóvel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIF
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {utentes && utentes.length > 0 ? (
                utentes.map((utente) => (
                  <tr key={utente.ut_cod}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {utente.ut_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {utente.ut_email || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {utente.ut_tlm || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {utente.ut_nif || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(utente)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(utente.ut_cod, utente.ut_nome)}
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
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
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

export default Utentes;


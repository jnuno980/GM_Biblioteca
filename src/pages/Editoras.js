
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2, Building } from 'lucide-react';
import { apiService, apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';

const Editoras = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEditora, setEditingEditora] = useState(null);
  const [formData, setFormData] = useState({
    ed_nome: '',
    ed_pais: '',
    ed_morada: '',
    ed_cod_postal: '',
    ed_email: '',
    ed_tlm: ''
  });

  const queryClient = useQueryClient();

  // Fetch editoras
  const { data: editoras, isLoading } = useQuery(
    'editoras',
    () => apiService.get(apiEndpoints.editoras.list)
  );

  // Fetch codigos postais
  const { data: codigosPostais } = useQuery(
    'codigos-postais',
    () => apiService.get(apiEndpoints.codigosPostais.list)
  );

  // Create/Update mutation
  const mutation = useMutation(
    (data) => {
      if (editingEditora) {
        return apiService.put(apiEndpoints.editoras.update(editingEditora.ed_cod), data);
      } else {
        return apiService.post(apiEndpoints.editoras.create, data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('editoras');
        toast.success(editingEditora ? 'Editora atualizada com sucesso' : 'Editora criada com sucesso');
        handleCancel();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  // Delete mutation
  const deleteMutation = useMutation(
    (id) => apiService.delete(apiEndpoints.editoras.delete(id)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('editoras');
        toast.success('Editora eliminada com sucesso');
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
    setEditingEditora(null);
    setFormData({
      ed_nome: '',
      ed_pais: '',
      ed_morada: '',
      ed_cod_postal: '',
      ed_email: '',
      ed_tlm: ''
    });
  };

  const handleEdit = (editora) => {
    setEditingEditora(editora);
    setFormData({
      ed_nome: editora.ed_nome || '',
      ed_pais: editora.ed_pais || '',
      ed_morada: editora.ed_morada || '',
      ed_cod_postal: editora.ed_cod_postal || '',
      ed_email: editora.ed_email || '',
      ed_tlm: editora.ed_tlm || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id, nome) => {
    if (window.confirm(`Tem a certeza que quer eliminar a editora "${nome}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">A carregar editoras...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Building className="h-8 w-8 mr-3" />
          Editoras
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Editora
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingEditora ? 'Editar Editora' : 'Nova Editora'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                required
                value={formData.ed_nome}
                onChange={(e) => setFormData({...formData, ed_nome: e.target.value})}
                className="form-control w-full"
                placeholder="Nome da editora"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País *
              </label>
              <input
                type="text"
                required
                value={formData.ed_pais}
                onChange={(e) => setFormData({...formData, ed_pais: e.target.value})}
                className="form-control w-full"
                placeholder="País"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.ed_email}
                onChange={(e) => setFormData({...formData, ed_email: e.target.value})}
                className="form-control w-full"
                placeholder="email@editora.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telemóvel
              </label>
              <input
                type="text"
                value={formData.ed_tlm}
                onChange={(e) => setFormData({...formData, ed_tlm: e.target.value})}
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
                value={formData.ed_morada}
                onChange={(e) => setFormData({...formData, ed_morada: e.target.value})}
                className="form-control w-full"
                placeholder="Endereço completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal
              </label>
              <select
                value={formData.ed_cod_postal}
                onChange={(e) => setFormData({...formData, ed_cod_postal: e.target.value})}
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
                {mutation.isLoading ? 'A guardar...' : (editingEditora ? 'Atualizar' : 'Adicionar')}
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
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telemóvel
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {editoras?.data?.length > 0 ? (
                editoras.data.map((editora) => (
                  <tr key={editora.ed_cod}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {editora.ed_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editora.ed_pais}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editora.ed_email || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editora.ed_tlm || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(editora)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(editora.ed_cod, editora.ed_nome)}
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

export default Editoras;


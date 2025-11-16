
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { livrosService, editorasService, autoresService, generosService } from '../services/api';
import toast from 'react-hot-toast';

const Livros = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingLivro, setEditingLivro] = useState(null);
  const [formData, setFormData] = useState({
    li_titulo: '',
    li_ano: '',
    li_edicao: '',
    li_isbn: '',
    li_editora: '',
    li_autor: '',
    li_genero: ''
  });

  const queryClient = useQueryClient();

  // Fetch livros
  const { data: livros, isLoading } = useQuery(
    'livros',
    () => livrosService.getAll()
  );


  // Fetch dropdown options
  const { data: editoras } = useQuery(
    'editoras',
    () => editorasService.getAll()
  );

  const { data: autores } = useQuery(
    'autores',
    () => autoresService.getAll()
  );

  const { data: generos } = useQuery(
    'generos',
    () => generosService.getAll()
  );

  // Create/Update mutation
  const mutation = useMutation(
    (data) => {
      if (editingLivro) {
        return livrosService.update(editingLivro.li_cod, data);
      } else {
        return livrosService.create(data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('livros');
        toast.success(editingLivro ? 'Livro atualizado com sucesso' : 'Livro criado com sucesso');
        handleCancel();
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  // Delete mutation
  const deleteMutation = useMutation(
    (id) => livrosService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('livros');
        queryClient.invalidateQueries('exemplares'); // Also refresh exemplares
        queryClient.invalidateQueries('requisicoes'); // Also refresh requisicoes
        toast.success('✅ Livro, exemplares e requisições relacionadas eliminados com sucesso!');
      },
      onError: (error) => {
        console.error('Delete error:', error);
        if (error.message?.includes('foreign key constraint')) {
          toast.error('Não é possível eliminar este livro porque tem dados relacionados. Elimine primeiro os exemplares associados.');
        } else {
          toast.error(error.message || 'Erro ao eliminar livro');
        }
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLivro(null);
    setFormData({
      li_titulo: '',
      li_ano: '',
      li_edicao: '',
      li_isbn: '',
      li_editora: '',
      li_autor: '',
      li_genero: ''
    });
  };

  const handleEdit = (livro) => {
    setEditingLivro(livro);
    setFormData({
      li_titulo: livro.li_titulo || '',
      li_ano: livro.li_ano || '',
      li_edicao: livro.li_edicao || '',
      li_isbn: livro.li_isbn || '',
      li_editora: livro.li_editora || '',
      li_autor: livro.li_autor || '',
      li_genero: livro.li_genero || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id, titulo) => {
    if (window.confirm(`Tem a certeza que quer eliminar o livro "${titulo}"?\n\n⚠️ ATENÇÃO: Esta ação irá eliminar:\n• Todos os exemplares deste livro\n• Todas as requisições relacionadas aos exemplares\n• O próprio livro\n\nEsta ação não pode ser desfeita!`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">A carregar livros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BookOpen className="h-8 w-8 mr-3" />
          Livros
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Livro
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingLivro ? 'Editar Livro' : 'Novo Livro'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                required
                value={formData.li_titulo}
                onChange={(e) => setFormData({...formData, li_titulo: e.target.value})}
                className="form-control w-full"
                placeholder="Título do livro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano
              </label>
              <input
                type="number"
                min="1000"
                max="2100"
                value={formData.li_ano}
                onChange={(e) => setFormData({...formData, li_ano: e.target.value})}
                className="form-control w-full"
                placeholder="Ano de publicação"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edição
              </label>
              <input
                type="text"
                value={formData.li_edicao}
                onChange={(e) => setFormData({...formData, li_edicao: e.target.value})}
                className="form-control w-full"
                placeholder="Edição"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={formData.li_isbn}
                onChange={(e) => setFormData({...formData, li_isbn: e.target.value})}
                className="form-control w-full"
                placeholder="ISBN"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Editora
              </label>
              <select
                value={formData.li_editora}
                onChange={(e) => setFormData({...formData, li_editora: e.target.value})}
                className="form-select w-full"
              >
                <option value="">—</option>
                {editoras?.map(editora => (
                  <option key={editora.ed_cod} value={editora.ed_cod}>
                    {editora.ed_nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor
              </label>
              <select
                value={formData.li_autor}
                onChange={(e) => setFormData({...formData, li_autor: e.target.value})}
                className="form-select w-full"
              >
                <option value="">—</option>
                {autores?.map(autor => (
                  <option key={autor.au_cod} value={autor.au_cod}>
                    {autor.au_nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género
              </label>
              <select
                value={formData.li_genero}
                onChange={(e) => setFormData({...formData, li_genero: e.target.value})}
                className="form-select w-full"
              >
                <option value="">—</option>
                {generos?.map(genero => (
                  <option key={genero.ge_genero} value={genero.ge_genero}>
                    {genero.ge_genero}
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
                {mutation.isLoading ? 'A guardar...' : (editingLivro ? 'Atualizar' : 'Adicionar')}
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
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ISBN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Editora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Género
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {livros && livros.length > 0 ? (
                livros.map((livro) => (
                  <tr key={livro.li_cod}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {livro.li_titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {livro.li_ano || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {livro.li_isbn || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {livro.editora_nome || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {livro.autor_nome || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {livro.li_genero || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(livro)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(livro.li_cod, livro.li_titulo)}
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

export default Livros;


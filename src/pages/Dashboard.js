import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Library, 
  Users, 
  FileText, 
  ArrowRightLeft,
  Clock,
  CheckCircle
} from 'lucide-react';
import { dashboardService } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const queryClient = useQueryClient();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery(
    'dashboard-stats',
    () => dashboardService.getStats(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      onSuccess: () => {
        // Invalidate livros query to ensure consistency
        queryClient.invalidateQueries('livros');
      }
    }
  );


  // Fetch recent activity
  const { data: recentActivity, isLoading: activityLoading } = useQuery(
    'recent-activity',
    () => dashboardService.getRecentActivity()
  );

  // Handle quick return form
  const handleQuickReturn = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const re_cod = formData.get('re_cod');

    if (!re_cod) {
      toast.error('Por favor, introduza o ID da requisição');
      return;
    }

    try {
      // For now, just show success message - full implementation would need requisicoesService
      toast.success('Funcionalidade de devolução rápida em desenvolvimento');
      e.target.reset();
      // Refetch stats to update counters
      window.location.reload(); // Simple refresh for demo
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (statsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">
          Erro ao carregar estatísticas: {statsError.message}
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, link, color = 'blue', showNumber = false }) => {
    // Force showNumber to be boolean and handle the display logic correctly
    const shouldShowNumber = Boolean(showNumber);
    const displayValue = statsLoading ? '...' : (shouldShowNumber ? (value ? value.toLocaleString() : '0') : '—');
    
    return (
      <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="kpi-label">
              <Icon className="h-4 w-4 mr-2" />
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {displayValue}
            </p>
          </div>
        <Link
          to={link}
          className="btn btn-outline-primary btn-sm"
        >
          Abrir
        </Link>
      </div>
    </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 text-white rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-2">
          Biblioteca Escolar Ginestal Machado
        </h1>
        <p className="text-xl text-red-100">
          Gerir livros, utentes e empréstimos de forma simples e rápida.
        </p>
        <div className="flex gap-4 mt-6">
          <Link
            to="/requisicoes"
            className="bg-white text-red-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Registrar Requisição
          </Link>
          <Link
            to="/livros"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-900 transition-colors"
          >
            Procurar Livros
          </Link>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Livros"
          value={stats?.totalLivros}
          icon={BookOpen}
          link="/livros"
          showNumber={false}
        />
        <StatCard
          title="Exemplares"
          value={stats?.totalExemplares}
          icon={Library}
          link="/exemplares"
          showNumber={false}
        />
        <StatCard
          title="Utentes"
          value={stats?.totalUtentes}
          icon={Users}
          link="/utentes"
          showNumber={false}
        />
        <StatCard
          title="Requisições"
          value={stats?.totalRequisicoes}
          icon={FileText}
          link="/requisicoes"
          showNumber={false}
        />
        <StatCard
          title="Empréstimos Ativos"
          value={stats?.exemplaresEmprestados}
          icon={ArrowRightLeft}
          color="orange"
          link="/requisicoes"
          showNumber={true}
        />
        <StatCard
          title="Disponíveis"
          value={stats?.exemplaresDisponiveis}
          icon={CheckCircle}
          color="green"
          link="/exemplares"
          showNumber={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Return */}
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ArrowRightLeft className="h-5 w-5 mr-2" />
            Devolução Rápida
          </h3>
          <form onSubmit={handleQuickReturn} className="space-y-4">
            <div>
              <label htmlFor="re_cod" className="block text-sm font-medium text-gray-700 mb-1">
                ID da Requisição
              </label>
              <input
                type="number"
                id="re_cod"
                name="re_cod"
                required
                className="form-control w-full"
                placeholder="Introduza o ID da requisição"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Devolver
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-2">
            Introduza o ID de uma requisição ativa para registar a devolução.
          </p>
        </div>

        {/* Recent Activity */}
        <div className="kpi-card bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Atividade Recente
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activityLoading ? (
              <div className="text-center py-4">
                <div className="loading-spinner mx-auto"></div>
              </div>
            ) : recentActivity?.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.re_cod} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">
                      {activity.utente_nome}
                    </p>
                    <p className="text-xs text-gray-600">
                      {activity.livro_titulo}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'emprestado' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {activity.status === 'emprestado' ? 'Emprestado' : 'Devolvido'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.re_data_requisicao).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



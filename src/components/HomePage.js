import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Library, 
  Users, 
  FileText, 
  ArrowRightLeft,
  CheckCircle
} from 'lucide-react';
import { dashboardService } from '../services/api';

const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load dashboard stats
  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await dashboardService.getStats();
      setStats(response);
      setSuccess('Estatísticas carregadas com sucesso!');
    } catch (error) {
      setError('Erro de conexão: ' + error.message);
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDashboard();
    
    // Auto-refresh stats every 30 seconds
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, link, color = 'blue' }) => (
    <div className="stat-card bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-red-800 text-sm font-medium mb-2 flex items-center">
            <Icon className="h-4 w-4 mr-2" />
            {title}
          </h3>
          <div className="text-2xl font-bold text-gray-900">
            {loading ? '...' : (value || '0')}
          </div>
        </div>
        {link && (
          <Link
            to={link}
            className="btn bg-red-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-900 transition-colors"
          >
            Abrir
          </Link>
        )}
      </div>
    </div>
  );

  const FeatureCard = ({ icon, title, description }) => (
    <div className="feature-card bg-white rounded-lg p-8 shadow-sm text-center">
      <div className="feature-icon text-5xl mb-4">{icon}</div>
      <h3 className="text-red-800 text-lg font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="navbar bg-gradient-to-r from-red-800 to-red-600 text-white shadow-lg">
        <div className="nav-container max-w-6xl mx-auto px-4 flex justify-between items-center py-4">
          <div className="logo flex items-center gap-2 text-xl font-bold">
            📚 Biblioteca GM
          </div>
          <ul className="nav-menu flex gap-8 list-none">
            <li>
              <Link to="/" className="text-white no-underline px-4 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/livros" className="text-white no-underline px-4 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-colors">
                Livros
              </Link>
            </li>
            <li>
              <Link to="/utentes" className="text-white no-underline px-4 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-colors">
                Utentes
              </Link>
            </li>
            <li>
              <Link to="/requisicoes" className="text-white no-underline px-4 py-2 rounded hover:bg-white hover:bg-opacity-10 transition-colors">
                Requisições
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="hero bg-gradient-to-r from-red-800 to-red-600 text-white rounded-xl p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Biblioteca Escolar Ginestal Machado
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Gerir livros, utentes e empréstimos de forma simples e rápida.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/" className="btn bg-white text-red-800 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-all transform hover:-translate-y-0.5">
              Ver Dashboard
            </Link>
            <Link to="/livros" className="btn btn-outline bg-transparent text-white border-2 border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-red-800 transition-all transform hover:-translate-y-0.5">
              Gerir Livros
            </Link>
          </div>
        </div>

        {/* Dashboard Section */}
        <div id="dashboard" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            📊 Dashboard
          </h2>
          
          {loading && (
            <div className="loading text-center py-8">
              <div className="spinner border-4 border-gray-300 border-t-red-800 rounded-full w-10 h-10 mx-auto mb-4 animate-spin"></div>
              <p>A carregar estatísticas...</p>
            </div>
          )}

          {error && (
            <div className="error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>❌ Erro:</strong> {error}
            </div>
          )}

          {success && (
            <div className="success bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <strong>✅ Sucesso:</strong> {success}
            </div>
          )}

          {!loading && stats && (
            <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="📚 Livros"
                value={stats.livros}
                icon={BookOpen}
                link="/livros"
              />
              <StatCard
                title="📖 Exemplares"
                value={stats.exemplares}
                icon={Library}
                link="/exemplares"
              />
              <StatCard
                title="👥 Utentes"
                value={stats.utentes}
                icon={Users}
                link="/utentes"
              />
              <StatCard
                title="📋 Requisições"
                value={stats.requisicoes}
                icon={FileText}
                link="/requisicoes"
              />
              <StatCard
                title="🔄 Empréstimos Ativos"
                value={stats.emprestimosAtivos}
                icon={ArrowRightLeft}
                color="orange"
              />
              <StatCard
                title="✅ Disponíveis"
                value={stats.exemplaresDisponiveis}
                icon={CheckCircle}
                color="green"
              />
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="features grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon="📚"
            title="Gestão de Livros"
            description="Adicione, edite e organize o catálogo de livros da biblioteca com informações detalhadas sobre autores, editoras e géneros."
          />
          <FeatureCard
            icon="👥"
            title="Gestão de Utentes"
            description="Registe e mantenha informações dos utilizadores da biblioteca, incluindo dados de contacto e moradas."
          />
          <FeatureCard
            icon="📋"
            title="Requisições"
            description="Controle empréstimos e devoluções de livros com histórico completo e estatísticas em tempo real."
          />
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%);
        }
        
        .hero {
          background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%);
        }
        
        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          transition: all 0.3s;
        }
        
        .btn:hover {
          transform: translateY(-2px);
        }
        
        .stat-card {
          background: white;
          border-left: 4px solid #8B0000;
        }
        
        .feature-card {
          background: white;
          text-align: center;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }
          
          .hero h1 {
            font-size: 2rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;

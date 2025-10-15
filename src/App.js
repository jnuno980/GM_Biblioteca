import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './components/HomePage';
import Dashboard from './pages/Dashboard';
import Livros from './pages/Livros';
import Exemplares from './pages/Exemplares';
import Utentes from './pages/Utentes';
import Requisicoes from './pages/Requisicoes';
import Editoras from './pages/Editoras';
import Autores from './pages/Autores';
import Generos from './pages/Generos';
import CodigosPostais from './pages/CodigosPostais';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/livros" element={<Layout><Livros /></Layout>} />
      <Route path="/exemplares" element={<Layout><Exemplares /></Layout>} />
      <Route path="/utentes" element={<Layout><Utentes /></Layout>} />
      <Route path="/requisicoes" element={<Layout><Requisicoes /></Layout>} />
      <Route path="/editoras" element={<Layout><Editoras /></Layout>} />
      <Route path="/autores" element={<Layout><Autores /></Layout>} />
      <Route path="/generos" element={<Layout><Generos /></Layout>} />
      <Route path="/codigos-postais" element={<Layout><CodigosPostais /></Layout>} />
    </Routes>
  );
}

export default App;



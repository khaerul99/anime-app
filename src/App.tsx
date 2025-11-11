import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import DetailPage from './pages/DetailPages';
import Header from './components/Header'; 

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
         
          <Route path="/" element={<HomePage />} /> 

          <Route path="/anime/:id" element={<DetailPage />} />
        </Routes>
      </main>
    </div>

  );
}

export default App;
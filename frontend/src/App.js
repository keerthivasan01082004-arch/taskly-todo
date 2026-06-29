import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodoList from './pages/TodoList';
import TodoDetail from './pages/TodoDetail';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/todo" element={<TodoDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>404</div>
      <p>Page not found. <a href="/">Go home →</a></p>
    </div>
  );
}

import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/tailwind.css';

const originalWarn = console.warn;
console.error = (message, ...args) => {
  if (
    typeof message === 'string' &&
    message.includes('Support for defaultProps')
  ) {
    return;
  }
  originalWarn(message, ...args);
};
ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>
);

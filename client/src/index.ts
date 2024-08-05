import './components/login-form';
import handleLogin from './utils/handleLogin';

const app = document.getElementById('app');
if (app) {
  const loginForm = document.createElement('login-form');
  loginForm.addEventListener('login', handleLogin as EventListener);

  app.appendChild(loginForm);
}

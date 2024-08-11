import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import handleLogin from '../../utils/handleLogin.js';
import '../login-form/login-form.js';

import styles from './planner-app.css';

@customElement('planner-app')
export class PlannerApp extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(styles)}
    `,
  ];

  render() {
    return html` <login-form @login=${handleLogin}></login-form> `;
  }
}

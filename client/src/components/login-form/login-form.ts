import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import styles from './login-form.css';

@customElement('login-form')
export class LoginForm extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(styles)}
    `,
  ];

  @property({ type: String }) url = '';
  @property({ type: String }) username = '';
  @property({ type: String }) password = '';

  render() {
    return html`
      <form @submit="${this.handleSubmit}">
        <label for="url">URL</label>
        <input
          id="url"
          type="url"
          .value="${this.url}"
          @input="${this.handleInput}"
          name="url"
          required
        />

        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          .value="${this.username}"
          @input="${this.handleInput}"
          name="username"
          required
        />

        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          .value="${this.password}"
          @input="${this.handleInput}"
          name="password"
          required
        />

        <button type="submit">Login</button>
      </form>
    `;
  }

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this[target.name as 'url' | 'username' | 'password'] = target.value;
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const loginEvent = new CustomEvent('login', {
      detail: {
        url: this.url,
        username: this.username,
        password: this.password,
      },
    });
    this.dispatchEvent(loginEvent);
  }
}

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import spinner from '@patternfly/patternfly/components/Spinner/spinner.css';

import styles from './pf-progress-icon.css';

/**
 * @customElement
 * @class PfProgressIcon
 * 
 * `pf-progress-icon` is a custom web component that displays a progress spinner icon.
 * 
 * ## Properties:
 * 
 * - `size`: The size of the icon. Can be one of 'sm', 'md', 'lg', or 'xl'. The value is prefixed with 'pf-m-'.
 * 
 * ## Example Usage:
 * 
 * ```html
 * <pf-progress-icon size="lg"></pf-progress-icon>
 * ```
 */
@customElement('pf-progress-icon')
export class PfProgressIcon extends LitElement {
  static styles = [styles, spinner];

  private _size?: string;
  /**
   * Gets the size of the icon.
   */
  @property({ reflect: true })
  get size() {
    return this._size;
  }
  /**
   * Sets the size of the icon.
   * Accepted values: 'sm', 'md', 'lg', 'xl'.
   * Adds 'pf-m-' prefix to the value.
   */
  set size(value: string | undefined) {
    const allowedSizes = ['sm', 'md', 'lg', 'xl'];
    this._size = value && allowedSizes.includes(value) ? `pf-m-${value}` : undefined;
  }

  render() {
    return html`
      <span class="pf-v5-c-icon ${this.size ?? 'pf-m-md'} pf-m-in-progress">
        <span class="pf-v5-c-icon__content">
          <i class="fas fa-check-circle" aria-hidden="true"></i>
        </span>
        <span class="pf-v5-c-icon__progress">
          <svg
            class="pf-v5-c-spinner ${this.size ?? 'pf-m-md'}"
            role="progressbar"
            viewBox="0 0 100 100"
            aria-label="Loading..."
          >
            <circle class="pf-v5-c-spinner__path" cx="50" cy="50" r="45" fill="none" />
          </svg>
        </span>
      </span>
    `;
  }
}

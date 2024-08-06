import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import icon from '@patternfly/patternfly/components/Icon/icon.css';
import patternflyIcons from '@patternfly/patternfly/base/patternfly-icons.css';
import spinner from '@patternfly/patternfly/components/Spinner/spinner.css';
import patternFaflyIcons from '@patternfly/patternfly/base/patternfly-fa-icons.css';

import '../pf-progress-icon/pf-progress-icon';

import styles from './pf-icon.css';

type TypeOpetions = 'fas' | 'far' | 'fa' | 'pf-v5-pficon';
type StatusOpetions = 'danger' | 'warning' | 'success' | 'info';

/**
 * @customElement
 * @class PfIcon
 * 
 * `pf-icon` is a custom web component that displays an icon with various customization options.
 * The component uses PatternFly 5 icon styles and allows setting the icon type, size, status, and additional properties.
 * 
 * ## Properties:
 * 
 * - `name`: The name of the icon. Automatically determines and sets the `type` property based on the prefix of the name.
 *   - If the name starts with 'fas', 'far', 'fa', or 'pf-v5-pficon', it sets the corresponding type.
 *   - If the name starts with 'pficon', it replaces it with 'pf-v5-pficon'.
 * 
 * - `type`: The type of the icon, which can be one of 'fas', 'far', 'fa', or 'pf-v5-pficon'.
 * 
 * - `size`: The size of the icon. Can be one of 'sm', 'md', 'lg', or 'xl'. The value is prefixed with 'pf-m-'.
 * 
 * - `status`: The status of the icon. Can be one of 'danger', 'warning', 'success', or 'info'. The value is prefixed with 'pf-m-'.
 *   - If `name` is not set, it sets `name` according to the `status` value:
 *     - 'danger': `fa-exclamation-circle`
 *     - 'warning': `fa-exclamation-triangle`
 *     - 'success': `fa-check-circle`
 *     - 'info': `fa-info-circle`
 * 
 * - `inline`: Boolean property that determines if the icon should be displayed inline.
 * 
 * - `progress`: Boolean property that determines if the icon should display a progress spinner.
 * 
 * ## Example Usage:
 * 
 * ```html
 * <pf-icon size="lg" status="success"></pf-icon>
 * <pf-icon name="pficon-in-progress" inline></pf-icon>
 * <pf-icon progress></pf-icon>
 * ```
 */
@customElement('pf-icon')
export class PfIcon extends LitElement {
  static styles = [styles, icon, patternFaflyIcons, patternflyIcons, spinner];

  @property({ reflect: true }) type?: TypeOpetions;

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

  private _status?: string;
  /**
   * Gets the status of the icon.
   */
  @property({ reflect: true })
  get status() {
    return this._status;
  }
  /**
   * Sets the status of the icon.
   * Accepted values: 'danger', 'warning', 'success', 'info'.
   * Adds 'pf-m-' prefix to the value.
   * If `name` is not set, sets `name` according to the `status` value.
   */
  set status(value: string | undefined) {
    const allowedStatuses = ['danger', 'warning', 'success', 'info'];
    if (value && allowedStatuses.includes(value)) {
      this._status = `pf-m-${value}`;
      if (!this._name) {
        const statusIcons = {
          'danger': 'fa-exclamation-circle',
          'warning': 'fa-exclamation-triangle',
          'success': 'fa-check-circle',
          'info': 'fa-info-circle'
        };
        this.name = statusIcons[value as StatusOpetions];
      }
    } else {
      this._status = undefined;
    }
  }

  @property({ type: Boolean }) inline = false;
  @property({ type: Boolean }) progress = false;

  private _name = '';
  /**
   * Gets the name of the icon.
   */
  @property({ type: String })
  get name() {
    return this._name;
  }
  /**
   * Sets the name of the icon.
   * Automatically determines and sets the type based on the name prefix.
   * Replaces 'pficon' prefix with 'pf-v5-pficon'.
   */
  set name(value: string) {
    const typePrefixes = {
      'fas': 'fas',
      'far': 'far',
      'fa': 'fa',
      'pf-v5-pficon': 'pf-v5-pficon'
    };

    if (value.startsWith('pficon')) {
      value = value.replace('pficon', 'pf-v5-pficon');
    }

    this._name = value;
    for (const prefix in typePrefixes) {
      if (value.startsWith(prefix)) {
        this.type = typePrefixes[prefix as TypeOpetions] as TypeOpetions;
        break;
      }
    }
  }

  render() {
    // Check for progress
    if (this.progress) {
      return html`
        <pf-progress-icon size=${this.size?.replace('pf-m-', '') ?? 'md'}></pf-progress-icon>
      `;
    }

    // Regular icon
    return html`
      <span class="pf-v5-c-icon ${this.inline && `pf-m-inline`}">
        <span class="pf-v5-c-icon__content ${this.size ?? 'pf-m-md'} ${this.status ?? ''}">
          <i class="${this.type ?? 'fa'} ${this.name}" aria-hidden="true"></i>
        </span>
      </span>
    `;
  }
}

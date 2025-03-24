import { BrowserAction } from '../types/browser-actions';

export class BrowserAutomationService {
  async executeAction(action: BrowserAction): Promise<void> {
    switch (action.action) {
      case 'click':
        if (action.selector) {
          const element = document.querySelector(action.selector);
          if (element instanceof HTMLElement) {
            element.click();
          }
        } else if (action.position) {
          const event = new MouseEvent('click', {
            clientX: action.position.x,
            clientY: action.position.y,
          });
          document.elementFromPoint(action.position.x, action.position.y)?.dispatchEvent(event);
        }
        break;

      case 'type':
        if (action.selector && action.text) {
          const element = document.querySelector(action.selector);
          if (element instanceof HTMLInputElement) {
            element.value = action.text;
            element.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
        break;

      case 'scroll':
        if (action.position) {
          window.scrollTo({
            top: action.position.y,
            left: action.position.x,
            behavior: 'smooth'
          });
        }
        break;

      case 'wait':
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
    }
  }
}
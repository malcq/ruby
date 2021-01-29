import { getConnector, WindowMessage, Listener, inIframe } from '../utils/parent/connector';

class ParentService {
  private connector = getConnector();

  send(name: string, message: WindowMessage = {}): Promise<WindowMessage> {
    return this.connector.sendToParent(name, message);
  }

  addEventListener(name: string, listener: Listener) {
    this.connector.addChildrenListener(name, {
      onMessage: (message: WindowMessage): Promise<WindowMessage> => {
        return listener.onMessage(message);
      }
    });
  }

  inFrame(): boolean {
    return inIframe();
  }
}

export const parentService = new ParentService();

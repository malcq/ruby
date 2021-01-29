import { Type } from '@angular/core';

class MessageComponentResolver {
  public componentsHash: any = {};

  addComponent(name: string, component: Type<any>) {
    this.componentsHash[name] = component;
  }

  getComponentByname(name: string) {
    return this.componentsHash[name] || null;
  }
}

const messageComponentResolver = new MessageComponentResolver();
export {
  messageComponentResolver
};

class WindowRef {
  public nativeWindow: any;
}
const windowRefMock = new WindowRef();
windowRefMock.nativeWindow = {
  addEventListener: jasmine.createSpy('addEventListener')
};
export {
  windowRefMock,
};

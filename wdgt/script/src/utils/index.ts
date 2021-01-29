export const convertStringToHtml = (str: string): HTMLElement => {
  const parser = new DOMParser();
  const el = parser
    .parseFromString(str, 'text/html')
    .body
    .firstChild;
  return el as HTMLElement;
};

export enum BrowserType {
  IPHONE,
  DESKTOP
};

export const getBrowser = (): BrowserType => {
  let result: BrowserType;
  if (window.matchMedia("only screen and (max-width: 575px)").matches) {
    result = BrowserType.IPHONE;
  } else {
    result = BrowserType.DESKTOP;
  }
  return result;
};

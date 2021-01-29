export const ANIMATION_TYPES = {
  /* 
    You can take some animations from source code of animate.css
    (https://github.com/daneden/animate.css/tree/master/source),
    put pieces into animations.scss,
    and add here something like:
    fadeIn: 'fade-in'
  */

  zoomIn: 'zoom-in',
  fadeOut: 'fade-out',
  dualRing: 'lds-dual-ring',
};

export const processAnimatedClass = 
  (process: (element: HTMLElement, animationClass: string) => void) =>
    (element: HTMLElement, animationClass: string): Promise<void> => 
      new Promise((resolve, reject) => {
        function handleAnimationEnd() {
          element.removeEventListener('animationend', handleAnimationEnd);
          resolve();
        }
    
        element.addEventListener('animationend', handleAnimationEnd);
        process(element, animationClass);
      });

export const processTransitionClass = 
  (process: (element: HTMLElement, animationClass: string) => void) =>
    (element: HTMLElement, animationClass: string): Promise<void> => 
      new Promise((resolve, reject) => {
        function handleAnimationEnd() {
          element.removeEventListener('transitionend', handleAnimationEnd);
          resolve();
        }
    
        element.addEventListener('transitionend', handleAnimationEnd);
        process(element, animationClass);
      });

export const addAnimatedClass = processAnimatedClass((element: HTMLElement, animationClass: string) => element.classList.add(animationClass));
export const addTransitionClass = processTransitionClass((element: HTMLElement, animationClass: string) => element.classList.add(animationClass));
export const addTransitionClassToParent = processTransitionClass((element: HTMLElement, animationClass: string) => element.parentElement.classList.add(animationClass));
export const removeAnimatedClass = processAnimatedClass((element: HTMLElement, animationClass: string) => element.classList.remove(animationClass));
export const removeTransitionClass = processTransitionClass((element: HTMLElement, animationClass: string) => element.classList.remove(animationClass));
export const removeTransitionClassToParent = processTransitionClass((element: HTMLElement, animationClass: string) => element.parentElement.classList.remove(animationClass));

export const animateElement = (element: HTMLElement, animationClass: string) => 
  addAnimatedClass(element, animationClass)
    .then(() => element.classList.remove(animationClass));

export const animateElementAndHide = (element: HTMLElement, animationClass: string) => 
  animateElement(element, animationClass)
    .then(() => element.style.display = 'none');

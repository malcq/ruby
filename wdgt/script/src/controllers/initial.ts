import { initLocalStorage } from '../../../new_frontend/src/utils/parent/local-storage';
import { initAudioRecorder } from '../../../new_frontend/src/utils/parent/audio-recorder';
import { initFileStorage } from '../../../new_frontend/src/utils/parent/file-storage';
import { initWidget } from '../../../new_frontend/src/utils/parent/widget';
import { initDomUtils } from '../../../new_frontend/src/utils/parent/dom-utils';

// usual imports for application
import { createConfig } from '../config/index';
import Widget from './widget';

window['TBWidget'] = true; //this need for correct widget connector initialisation

createConfig()
  .then(config => {
    const widget = new Widget(config);
    widget.init();

    // Placing widget instance into window
    // to be able controll widget with js
    window['TBWidget'] = widget;

    initLocalStorage();
    initAudioRecorder();
    initFileStorage();

    const childWidget = initWidget()
      .addOnCloseListener(() => widget.closeWidget())
      .addOnLoadListener(() => widget.setLoadingState());
    
    const domUtils = initDomUtils()
      .addOnIframeHeightChangeListener((height: number) => widget.setIframeHeight(height));

    widget
      .setOnOpenWidget(() => childWidget.openWidget())
      .setOnCloseWidget(() => childWidget.closeWidget())
      .setOnChangeScrollMethod((method) => {
        domUtils.setScrollMethod(method);
      })
      .setOnChangeInputContainer((inputContainer) => {
        childWidget.setInputFrameContainer(inputContainer);
      });
  });


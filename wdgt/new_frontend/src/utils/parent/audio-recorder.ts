import { getConnector, WindowMessage } from './connector';

const RecordRTC = require('./RecordRTC');
//import * as RecordRTC from './RecordRTC.js';

function _window(): any {
   // return the global native browser window object
   return window;
}

export const audioRecorderMethod = {
  init: 'audioRecorderInit',
  stop: 'audioRecorderStop',
  startCapture: 'audioRecorderStartCapture',
  stopCapture: 'audioRecorderStopCapture',
  getBlob: 'audioRecorderGetBlob',
};

export const audioRecorderEvent = {
  onLevel: 'audioRecorderOnLevel'
};

class AudioRecorder {
  public streamRecorder: any;
  public webcamstream: any = null;
  public options: any = {
    video: false,
    audio: true,
  };
  private blob: Blob | null = null;

  constructor() {}

  private initStreamIfNeed(): Promise<void> {
    if (!this.webcamstream) {
      return _window().navigator.mediaDevices.getUserMedia(this.options)
        .then((stream: any) => {
          this.webcamstream = stream;
        });
    } else {
      return Promise.resolve();
    }
  }

  init(): Promise<void> {
    return this.initStreamIfNeed();
  }

  stop(): Promise<void> {
    if (this.webcamstream) {
      this.webcamstream.stop();
      this.webcamstream = null;
    }
    return Promise.resolve();
  }

  startCapture(): Promise<void> {
    return this.initStreamIfNeed()
      .then(() => {
        this.blob = null;
        const options = {
          type: 'audio',
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1,
          disableLogs: true,
          onLevel: (level: number) => {
            getConnector().sendToChildren(audioRecorderEvent.onLevel, {info: level});
          }
        };
        this.streamRecorder = RecordRTC(this.webcamstream, options);
        this.streamRecorder.startRecording();
      });
  }

  stopCapture(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.streamRecorder.stopRecording(() => {
        this.blob = this.streamRecorder.getBlob();
        this.streamRecorder = null;
        this.stop();
        resolve();
      });
    });
  }

  getBlob(): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        resolve(<ArrayBuffer>reader.result);
      });
      reader.addEventListener('error', reject);
      if(this.blob!=null) {
        reader.readAsArrayBuffer(this.blob);
      }
    });
  }
}

let audioRecorderInstance: AudioRecorder;

export function initAudioRecorder(): AudioRecorder {
  if(!audioRecorderInstance) {
    audioRecorderInstance = new AudioRecorder();
    const connector = getConnector();
    connector.addParentListener(audioRecorderMethod.init, {onMessage: (message: WindowMessage) => audioRecorderInstance.init().then(() => ({}))});
    connector.addParentListener(audioRecorderMethod.stop, {onMessage: (message: WindowMessage) => audioRecorderInstance.stop().then(() => ({}))});
    connector.addParentListener(audioRecorderMethod.startCapture, {onMessage: (message: WindowMessage) => audioRecorderInstance.startCapture().then(() => ({}))});
    connector.addParentListener(audioRecorderMethod.stopCapture, {onMessage: (message: WindowMessage) => audioRecorderInstance.stopCapture().then(() => ({}))});
    connector.addParentListener(audioRecorderMethod.getBlob, {onMessage: (message: WindowMessage) => audioRecorderInstance.getBlob().then(data => ({data}))});
  
    console.log('audio recorder started');
  }
  return audioRecorderInstance;
}

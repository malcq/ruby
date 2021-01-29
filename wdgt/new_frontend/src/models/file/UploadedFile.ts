import { BaseFile, MediaFileType } from './BaseFile';
import CancelableWithPromise from '../../utils/cancelable-with-promise';

export class UploadedFile extends BaseFile {
  serverId: number;
  link: string;
  name: string;
  path: string;
  thumb: string;
  type: string;
  duration?: number;
  jsonType = 'uploaded';

  constructor(serverFile: any) {
    super();

    this.serverId = serverFile.id;
    this.link = serverFile.link;
    this.name = serverFile.name;
    this.path = serverFile.path;
    this.thumb = serverFile.thumb;
    this.type = serverFile.type;
    this.duration = serverFile.duration;
    this.isNew = serverFile.isNew;
  }

  getThumbType(): MediaFileType {
    if (this.type === 'audio') {
      return MediaFileType.audio;
    } else if (['video', 'image'].includes(this.type)) {
      return MediaFileType.image;
    } else {
      return MediaFileType.unknown;
    }
  }

  getFileType(): MediaFileType {
    if (this.type === 'video') {
      return MediaFileType.video;
    } else if (this.type === 'image') {
      return MediaFileType.image;
    } else if (this.type === 'audio') {
      return MediaFileType.audio;
    } else {
      return MediaFileType.unknown;
    }
  }

  getThumbSrc(): string {
    return this.thumb;
  }

  getFileSrc(): string {
    return this.path;
  }

  cleanFileData(): Promise<void> {
    return Promise.resolve();
  }
  
  getSize(): number {
    return 0;
  }

  upload(onProgress: (currentLoadedPercent: number) => void): CancelableWithPromise<BaseFile> {
    return {
      promise: Promise.resolve(this),
      cancel: () => {}
    };
  }

  getServerId(): number {
    return this.serverId;
  }
}

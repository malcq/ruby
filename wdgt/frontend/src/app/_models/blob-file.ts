import { Observable ,  Subject ,  of } from 'rxjs';

import { BaseFile, MediaFileType } from './base-file';

export class BlobFile extends BaseFile {
  public readonly blob: File;
  dbId?: string;

  constructor(blob: File, dbId: string) {
    super();
    this.blob = blob;
    this.dbId = dbId;
  }

  getThumbType(): MediaFileType {
    return this.getType();
  }

  getFileType(): MediaFileType {
    return this.getType();
  }

  getThumbSrc(): string {
    return URL.createObjectURL(this.blob);
  }

  getFileSrc(): string {
    return URL.createObjectURL(this.blob);
  }

  getType(): MediaFileType {
    const videoRegex = /^video\/.+/;
    const imageRegex = /^image\/.+/;
    const audioRegex = /^audio\/.+/;
    if (videoRegex.test(this.blob.type)) {
      return MediaFileType.video;
    } else if (imageRegex.test(this.blob.type)) {
      return MediaFileType.image;
    } else if (audioRegex.test(this.blob.type)) {
      return MediaFileType.audio;
    } else {
      return MediaFileType.unknown;
    }
  }

  getNeedSendToServer(): boolean {
    return true;
  }

  getSize(): number {
    return this.blob.size;
  }

  getDataUrl(): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader  = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result);
      }, false);
      reader.readAsDataURL(this.blob);
    });
  }

  getBlob(): File {
    return this.blob;
  }

  toJSON() {
    return {
      jsonType: 'blob',
      dbId: this.dbId
    };
  }
}

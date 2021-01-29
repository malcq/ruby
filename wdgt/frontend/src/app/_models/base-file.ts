import { Observable } from 'rxjs';

export enum MediaFileType {
    unknown = 0,
    video = 1,
    image = 2,
    audio = 3
}

export abstract class BaseFile {
  public static currentId = 0;
  public readonly id: number;

  constructor() {
    this.id = BaseFile.currentId++;
  }

  get thumbType(): MediaFileType {
    return this.getThumbType();
  }

  get fileType(): MediaFileType {
    return this.getFileType();
  }

  get thumbSrc(): string {
    return this.getThumbSrc();
  }

  get fileSrc(): string {
    return this.getFileSrc();
  }

  get needSendToServer(): boolean {
    return this.getNeedSendToServer();
  }

  get size(): number {
    return this.getSize();
  }

  abstract getThumbType(): MediaFileType;
  abstract getFileType(): MediaFileType;
  abstract getThumbSrc(): string;
  abstract getFileSrc(): string;
  abstract getNeedSendToServer(): boolean;
  abstract getSize(): number;
  abstract getBlob(): File;
}

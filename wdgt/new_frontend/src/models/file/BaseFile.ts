import CancelableWithPromise from '../../utils/cancelable-with-promise';

export enum MediaFileType {
    unknown = 0,
    video = 1,
    image = 2,
    audio = 3
}

export interface IMediaFileOptions {
  title: string;
  acceptFileTypes: string;
}

export abstract class BaseFile {
  public static currentId = 0;
  public readonly id: number;
  public isNew?: boolean;

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

  abstract getThumbType(): MediaFileType;
  abstract getFileType(): MediaFileType;
  abstract getThumbSrc(): string;
  abstract getFileSrc(): string;
  abstract cleanFileData(): Promise<void>;
  abstract getSize(): number;
  abstract getServerId(): number;
  abstract upload(onProgress: (currentLoadedPercent: number) => void): CancelableWithPromise<BaseFile>;
}

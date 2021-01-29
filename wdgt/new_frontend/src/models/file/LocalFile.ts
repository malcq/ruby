import { BaseFile, MediaFileType } from './BaseFile';
import { fileStorageService } from '../../api/file-storage';
import { fileService } from '../../api/file';
import CancelableWithPromise from '../../utils/cancelable-with-promise';

export class LocalFile extends BaseFile {
  private readonly blob: File;
  private dbId: string;

  static load(dbId: string): Promise<LocalFile> {
    return fileStorageService.load(dbId)
        .then((file: File) => new LocalFile(file, dbId));
  }

  static create(file: File): Promise<LocalFile> {
    return fileStorageService.save(file)
      .then((dbId: string) => new LocalFile(file, dbId));
  }

  constructor(blob: File, dbId: string) {
    super();
    this.blob = blob;
    this.dbId = dbId;
  }

  private objectUrl: string | null = null;

  getThumbType(): MediaFileType {
    return this.getType();
  }

  getFileType(): MediaFileType {
    return this.getType();
  }

  getThumbSrc(): string {
    if (!this.objectUrl) {
      this.objectUrl = URL.createObjectURL(this.blob);
    }
    return this.objectUrl;
  }

  getFileSrc(): string {
    return this.getThumbSrc();
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

  toJSON() {
    return {
      jsonType: 'blob',
      dbId: this.dbId
    };
  }

  getSize(): number {
    return this.blob.size;
  }

  cleanFileData(): Promise<void> {
    return fileStorageService.delete(this.dbId);
  }

  upload(onProgress: (currentLoadedPercent: number) => void): CancelableWithPromise<BaseFile> {
    return fileService.uploadBlob(this.blob, onProgress);
  }

  getServerId(): number {
    throw(new Error('File not uploaded yet'));
  }
}

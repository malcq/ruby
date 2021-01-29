import { Observable ,  of } from 'rxjs';
import { BaseFile, MediaFileType } from './base-file';

export class UploadedFile extends BaseFile {
  serverId: number;
  link: string;
  name: string;
  path: string;
  thumb: string;
  type: string;
  duration?: number;
  blob?: any;
  isNew?: boolean;
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
    } else {
      return MediaFileType.image;
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

  getNeedSendToServer(): boolean {
    return false;
  }

  getSize(): number {
    return 0;
  }

  getBlob(): File {
    return null;
  }
}

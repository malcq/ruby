import { BaseFile } from './BaseFile';
import { LocalFile } from './LocalFile';
import { UploadedFile } from './UploadedFile';

export function getFileFromJson(data: any): Promise<BaseFile> {
  switch (data.jsonType) {
     case 'blob':
      return LocalFile.load(data.dbId);
     case 'uploaded':
      return getUploadedFile(data);
     default:
      return Promise.reject(new Error('Wrong file class type'));
  }
}

export function getLocalFile(file: File): Promise<LocalFile> {
  return LocalFile.create(file);
}

export function getUploadedFile(data: any): Promise<UploadedFile> {
  return Promise.resolve(new UploadedFile(data));
}

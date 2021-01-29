import { IOptionsMedia } from "../../../../../models/chat";
import { IMediaFileOptions } from "../../../../../models/file/BaseFile";

export const getFileTypesOptions = (options: IOptionsMedia): IMediaFileOptions => {
  const isVideoEnabled = options.video?.enabled ?? true;
  const isPhotoEnabled = options.photo?.enabled ?? true;
  const isDocumentsEnabled = options.documents?.enabled ?? true;

  if (isVideoEnabled && !isPhotoEnabled && !isDocumentsEnabled) {
    return {
      title: 'Video',
      acceptFileTypes: 'video/*',
    };
  }

  if (isPhotoEnabled && !isVideoEnabled && !isDocumentsEnabled) {
    return {
      title: 'Photo',
      acceptFileTypes: 'image/*',
    };
  }

  if (isPhotoEnabled && isVideoEnabled && !isDocumentsEnabled) {
    return {
      title: 'Photo & Video',
      acceptFileTypes: 'image/*, video/*',
    };
  }
  
  return {
    title: 'Documents',
    acceptFileTypes: '*/*',
  };
}

export const getCameraTypesOptions = (options: IOptionsMedia): IMediaFileOptions => {
  const isVideoEnabled = options.video?.enabled ?? true;
  const isPhotoEnabled = options.photo?.enabled ?? true;

  if (isVideoEnabled && !isPhotoEnabled) {
    return {
      title: 'Video',
      acceptFileTypes: 'video/*',
    };
  }

  if (isPhotoEnabled && !isVideoEnabled) {
    return {
      title: 'Photo',
      acceptFileTypes: 'image/*',
    };
  }
  
  return {
    title: 'Camera',
    acceptFileTypes: 'image/*, video/*',
  };
}
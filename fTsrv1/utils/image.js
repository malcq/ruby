const path = require('path');
const gm = require('gm');
const fs = require('fs');
const _union = require('lodash/union');
const config = require('../config/');


const updateImages = (changedImages, oldImages, files, { folder = '/public/uploads/', shrink = false } = {}) => {
  changedImages = parseStringToArray(changedImages);
  oldImages = parseStringToArray(oldImages);
  if (changedImages && changedImages.length) {
    changedImages.forEach((index) => {
      if (oldImages.length > index) {
        const oldImagePath = oldImages[index].substr(1);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        oldImages.splice(index, 1);
      }
    });
  }
  let images = files.length ? saveImages(files, { folder, shrink }) : [];

  if (oldImages.length) {
    images = _union(oldImages, images);
  }
  return images;
};

const saveImages = (files, { folder = '', shrink = false } = {}) => {
  const rootPath = path.dirname(require.main.filename);
  if (files.length) {
    const arrayImagesNames = files.map((el) => {
      let imagePath = `${folder}${el.filename}`;
      if (shrink && el.size >= config.maxSizeImage) {
        const promiseGm = new Promise((resolve, reject) => gm(`${rootPath}${imagePath}`)
          .quality(config.qualityImage)
          .resize(100, 100)
          .write(`${rootPath}${imagePath}`, err => (!err ? resolve() : reject(err))));
        imagePath = promiseGm.catch((err) => {
          console.log('error', err);
          return '';
        });
      }
      return imagePath;
    });
    return arrayImagesNames;
  }
  return [];
};


const parseStringToArray = (string) => {
  if (!string) {
    return [];
  }
  return string.split(',');
};


module.exports = {
  saveImages,
  updateImages,
  parseStringToArray,
};

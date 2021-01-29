export const changeCheck = (before, after) => {
  if (
    after.hidden !== after.hiddenInitial ||
    after.changedImages.length ||
    after.images.length !== after.oldImages.length
  ) {
    return true;
  }

  if (
    before.title === after.title &&
    before.href === after.href &&
    before.description === after.description
  ) {
    if (after.images) {
      if (
        !before.images ||
        (after.newImagesSrc &&
          before.images.length !== after.newImagesSrc.length) ||
        !after.newImagesSrc
      ) {
        return true;
      }

      for (let i = 0; i < before.images.length; i++) {
        if (before.images[i] !== after.newImagesSrc[i]) {
          return true;
        }
      }
    }
    if (before.technologies) {
      // eslint-disable-next-line
      before.technologies = getIdArray(before.technologies);

      if (before.technologies.length !== after.technologies.length) {
        return true;
      }
      for (let i = 0; i < before.technologies.length; i++) {
        if (before.technologies[i] !== after.technologies[i]) {
          return true;
        }
      }
    }
    if (before.users) {
      // eslint-disable-next-line
      before.users = getIdArray(before.users);
      if (before.users.length !== after.users.length) {
        return true;
      }
      for (let i = 0; i < before.users.length; i++) {
        if (before.users[i] !== after.users[i]) {
          return true;
        }
      }
    }
    return false;
  }
  return true;
};

export const getImagesChange = (oldSrc, newSrc) => {
  if (!oldSrc || !oldSrc.length) {
    return [];
  }
  const changedImages = [];

  for (let i = 0; i < oldSrc.length; i++) {
    let change = true;
    for (let n = 0; n < newSrc.length; n++) {
      if (oldSrc[i] === newSrc[n]) {
        change = false;
        break;
      }
    }
    if (change) {
      changedImages.push(i);
    }
  }

  return changedImages;
};

export const getIdArray = (array) => {
  if (array) {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
      newArray.push(array[i].id);
    }
    return newArray;
  }
  return [];
};

export default () => null;

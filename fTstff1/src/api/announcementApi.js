import axios from './axios';

export const createAnnouncement = async (announcement) => {
  const data = new FormData();
  for (let i = 0; i < announcement.images.length; i++) {
    data.append('adIMG', announcement.images[i]);
  }

  for (const key in announcement) {
    if (key === 'images') {
      continue;
    }
    if (key === 'hidden') {
      data.append('hidden', announcement[key] !== 'see');
      continue;
    }
    data.append(key, announcement[key]);
  }

  return axios({
    method: 'POST',
    url: '/api/announcement/',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  });
};

export const getAllAnnouncements = ({
  sort = ['title', 'ASC'],
  filter = { title: '' },
  page,
  perPage
} = {}) => {
  return axios({
    method: 'GET',
    url: '/api/announcement',
    params: { sort, filter, page, perPage }
  });
};

export const getAnnouncement = (id) => {
  return axios({
    method: 'GET',
    url: `/api/announcement/${id}`
  });
};

export const updateAnnouncement = (id, newDate) => {
  const data = new FormData();
  const otherDate = newDate;
  for (let i = 0; i < otherDate.images.length; i++) {
    data.append('adIMG', otherDate.images[i]);
  }
  delete otherDate.images;

  for (const key in otherDate) {
    data.append(key, otherDate[key]);
  }

  return axios({
    method: 'PUT',
    url: `/api/announcement/${id}`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  });
};

export const deleteAnnouncement = (id) => {
  return axios({
    method: 'DELETE',
    url: `/api/announcement/${id}`
  });
};

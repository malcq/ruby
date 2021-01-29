import PropTypes from 'prop-types';

export default {
  ROUTER: {
    MATCH: {
      isExact: PropTypes.bool.isRequired,
      params: PropTypes.object,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    },
  },
  COUNTRY: {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  },
  TERMS: {
    version: PropTypes.string,
    text: PropTypes.string,
    updatedAt: PropTypes.string,
  },
  FAQ: {
    question: PropTypes.string,
    answer: PropTypes.string,
  },
};

import { Company } from '../../_models/company';
import { COMPANY_NAMES } from './constants';

interface Companies {
  [companyName: string]: Company;
}

const bmw: Company = {
  id: 1,
  name: 'BMW',
  productId: null,
  logo: null,
  backgroundMain: '/assets/img/backgrounds/login.png',
  avatarImage: '/assets/img/chat-avatar-bmw.png',
  theme: 'BMW',
  texts: {
    library: {
      title: 'Record.',
      description: 'Select your channel...',
    }
  }
};

const threeback: Company = {
  id: 2,
  name: '3Back',
  companyLogo: '/assets/img/logo-3back.png',
  productId: 121,
  logo: null,
  backgroundMain: null,
  avatarImage: '/assets/img/chat-avatar-3back.png',
  theme: '3BACK',
  texts: {
    library: {
      title: 'Get in touch.',
      description: 'Send us your message',
    },
  }
};

export const companies: Companies = {
  [COMPANY_NAMES.threeBack]: threeback,
  [COMPANY_NAMES.bmw]: bmw,
};

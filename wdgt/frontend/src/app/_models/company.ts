export interface CompanyText {
  title: string;
  description: string;
}

export interface Company {
  id: number;
  name: string;
  logo: string;
  theme: string;
  texts: { [key: string]: CompanyText };

  productId?: number;
  backgroundMain?: string;
  avatarImage?: string;
  backgroundOverlay?: boolean;
  companyLogo?: string;
}

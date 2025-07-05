export interface ChefSpecialty {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  features: string[];
}

export interface CuisineType {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface DiningExperience {
  id: string;
  name: string;
  description: string;
  guests: string;
  duration: string;
  icon: React.ReactNode;
  features: string[];
}

export interface Testimonial {
  text: string;
  author: string;
  event: string;
  image: string;
  rating: number;
  cuisine: string;
}

export interface ChefServiceType {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  type: 'regular' | 'professional';
  isPopular?: boolean;
}

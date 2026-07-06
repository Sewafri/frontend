export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface Instructor {
  name: string;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  instructor: Instructor;
  rating: number;
  reviewCount: number;
  duration: string;
  price: number;
  currency: string;
  studentsCount: number;
  featured: boolean;
}

export interface Stat {
  value: string;
  label: string;
}

export interface TrustedBy {
  name: string;
  src: string;
}

export interface Category {
  label: string;
  value: string;
}

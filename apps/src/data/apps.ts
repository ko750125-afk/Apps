export const CATEGORIES: Category[] = [
  'All apps',
  'Business Website',
  'Reservation & Booking',
  'Admin Dashboard',
  'E-commerce',
  'Automation & Tools'
];

export type Category = 
  | 'All apps' 
  | 'Business Website' 
  | 'Reservation & Booking' 
  | 'Admin Dashboard' 
  | 'E-commerce' 
  | 'Automation & Tools';

export type AppStatus = 'Exhibit' | 'Repair';

export interface AppData {
  id: string;
  name: string;
  url: string;
  category: string;
  date: string;
  featured: boolean;
  description: string;
  image: string;
  status: 'Exhibit' | 'Repair';
  memo?: string;
}

export const apps: AppData[] = [];

// Face Cap
import ocap from '/merchandise/orange-cap.jpeg';
import Wcap from '/merchandise/white-cap.jpeg';
import bcap from '/merchandise/black-cap.jpeg';

// T-Shirt
import oshirt from '/merchandise/orange-shirt.jpeg';
import wshirt from '/merchandise/white-shirt.jpeg';
import bshirt from '/merchandise/black-shirt.jpeg';


type MerchandiseItem = {
    id: string;
    name: string;
    description: string;
    price: string;
    timeFrame: string;
    fullDescription: string;
    colors: { name: string; image: string }[];
    sizes: string[];
};



export const merchandiseItems: MerchandiseItem[] = [
  {
    id: 't-shirt',
    name: 'T-Shirt',
    description: 'High-quality cotton t-shirt with BISUM logo. Available in multiple colors and sizes. Comfortable and stylish for any occasion.',
    price: '₦ 6, 000',
    timeFrame: 'May 17, 2026',
    fullDescription: 'Show your support for the BISUM Conference with this exclusive t-shirt. Made from premium, soft cotton, it offers superior comfort and durability. Features the official BISUM logo prominently. Available in a range of sizes from S to XXL.',
    colors: [
      { name: 'Black', image: bshirt },
      { name: 'White', image: wshirt },
      { name: 'Orange', image: oshirt },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'face-cap',
    name: 'Face Cap',
    description: 'Stylish face cap, perfect for sunny conference days. Adjustable strap.',
    price: '₦ 2, 500',
    timeFrame: 'May 17, 2026',
    fullDescription: 'Complete your conference look with the official BISUM face cap. Designed for comfort and style, it features an adjustable strap for a perfect fit and embroidered BISUM logo. Great for outdoor events or just as a casual accessory.',
    colors: [
      { name: 'Black', image: bcap },
      { name: 'White', image: Wcap },
      { name: 'Orange', image: ocap },
    ],
    sizes: ['One Size'], 
  }
];

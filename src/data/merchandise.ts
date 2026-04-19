// Face Cap
import ocap from '/merch/orange-cap.png';
import Wcap from '/merch/white-cap.png';
import bcap from '/merch/black-cap.png';

// T-Shirt
// import oshirt from '/merch/orange-shirt.png';
// import wshirt from '/merch/white-shirt.png';
// import bshirt from '/merch/black-shirt.png';


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
    name: 'BISUM T-Shirt',
    description: 'High-quality cotton t-shirt with BISUM logo. Available in multiple colors and sizes. Comfortable and stylish for any occasion.',
    price: '₦ 6, 000',
    timeFrame: 'May 17, 2026',
    fullDescription: 'Show your support for the BISUM Conference with this exclusive t-shirt. Made from premium, soft cotton, it offers superior comfort and durability. Features the official BISUM logo prominently. Available in a range of sizes from S to XXL.',
    colors: [
      { name: 'Black', image: 'https://media.hgbcinfluencers.org/bisum/shirt-nb.jpg' },
      { name: 'White', image: 'https://media.hgbcinfluencers.org/bisum/shirt-w.jpg' },
      { name: 'Orange', image: 'https://media.hgbcinfluencers.org/bisum/shirt-p.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'face-cap',
    name: 'BISUM Face Cap',
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

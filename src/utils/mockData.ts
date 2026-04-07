// 1. Define Interfaces to match your Page components
interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  attendanceMode: 'Physical' | 'Virtual';
  referralSource: string;
  breakoutSessionChoice: string;
  paymentStatus: 'pending' | 'complete' | 'paid';
  createdAt: string;
}

interface MerchandiseOrder {
  id: string;
  merchandiseId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  color: string;
  size: string;
  quantity: number;
  totalAmount: number;
  createdAt: string;
}

// 2. Export typed mock data
export const mockRegistrations: Registration[] = Array.from({ length: 47 }, (_, i) => ({
  id: `reg-${String(i + 1).padStart(3, '0')}`,
  firstName: ['John','Mary','Chukwu','Amaka','David','Faith','Samuel','Grace','Emmanuel','Blessing'][i % 10],
  lastName: ['Doe','Johnson','Okafor','Nwosu','Williams','Adeyemi','Eze','Ibrahim','Peters','Osei'][i % 10],
  email: `user${i + 1}@example.com`,
  phoneNumber: `080${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
  attendanceMode: i % 3 === 0 ? 'Virtual' : 'Physical',
  referralSource: ['Social Media','Friend','Church','Flyer','Email','Website'][i % 6],
  breakoutSessionChoice: ['Leadership','Evangelism','Prayer','Worship','Youth'][i % 5],
  paymentStatus: i % 7 === 0 ? 'pending' : 'complete',
  createdAt: new Date(Date.now() - i * 86400000 * 0.5).toISOString(),
}));

export const mockMerchandise: MerchandiseOrder[] = Array.from({ length: 23 }, (_, i) => ({
  id: `ord-${String(i + 1).padStart(3, '0')}`,
  merchandiseId: ['hoodie-001','tshirt-001','cap-001','bag-001'][i % 4],
  fullName: ['Jane Smith','Emeka Jones','Sola Bright','Kemi Ade','Tunde B.'][i % 5],
  email: `buyer${i + 1}@example.com`,
  phoneNumber: `081${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
  color: ['Navy Blue','Black','White','Grey','Red'][i % 5],
  size: ['S','M','L','XL','XXL'][i % 5],
  quantity: (i % 3) + 1,
  totalAmount: [15000, 10000, 7000, 12000][i % 4] * ((i % 3) + 1),
  createdAt: new Date(Date.now() - i * 86400000 * 0.7).toISOString(),
}));


interface User {
  uid(uid: any, arg1: (data: any) => void): unknown;
  id: string;
  name: string;
  username: string;
  email: string;
  country: string;
  imageUrl: string;
  vacationsInDays: number;
  vacationUsedInDays: number;
  administrativeDays: number;
  timeReturnsInHours: number;
}


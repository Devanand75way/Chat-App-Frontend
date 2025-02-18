interface User {
    _id: number;
    name: string;
    email: string;
    phone?: string;
    password: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
  }
  
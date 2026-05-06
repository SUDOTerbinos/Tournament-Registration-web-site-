export interface Player {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  telegram: string;
  transactionId: string;
  screenshotName?: string;
  screenshotData?: string;
  registeredAt: string;
  paymentStatus: 'pending' | 'confirmed' | 'rejected';
}

export interface Winner {
  username: string;
  declaredAt: string;
  tournamentName: string;
}

export type Page = 'home' | 'register' | 'admin' | 'winner';

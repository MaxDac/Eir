export interface Characteristic {
  id: number;
  name: string;
  comments: string | null;
  type: string | null;
  value: number | null;
}

export const MartialAttribute = 'Marziale';
export const MentalAttribute = 'Mentale';

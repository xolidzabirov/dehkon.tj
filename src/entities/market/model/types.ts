export interface Market {
  id: number;
  name: string;
  slug: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  sellersCount?: number;
}

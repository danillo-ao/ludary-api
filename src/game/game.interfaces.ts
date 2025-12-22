export interface GameSearchInvolvedCompany {
  company: { id: number; name: string };
  developer: boolean;
  porting: boolean;
  publisher: boolean;
  supporting: boolean;
}

export interface GameSearchResponse {
  name: string;
  id: number;
  cover: { id: number; image_id: string };
  first_release_date: number;
  involved_companies: GameSearchInvolvedCompany[];
}

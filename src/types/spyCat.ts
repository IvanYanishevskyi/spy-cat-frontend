export interface SpyCat {
  id: number;
  name: string;
  years_of_experience: number;
  breed: string;
  salary: number;
}

export interface SpyCatCreate {
  name: string;
  years_of_experience: number;
  breed: string;
  salary: number;
}

export interface SpyCatUpdate {
  salary: number;
}

export interface ApiError {
  detail: string;
}
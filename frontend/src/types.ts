export interface MovieInput {
  title: string;
  budget: number;
  opening_theaters: number;
  release_days: number;
  mpaa_rating: string;
  genres: string[];
  distributor: string;
  release_month: number;
  release_dayofweek: number;
}

export interface PredictionResponse {
  success: boolean;
  predicted_revenue: number;
  predicted_revenue_formatted: string;
  roi: number;
  roi_percentage: string;
  revenue_per_theater: number;
  revenue_per_theater_formatted: string;
  confidence_range: {
    lower: number;
    upper: number;
    lower_formatted: string;
    upper_formatted: string;
  };
  key_factors: {
    release_season: string;
    weekend_release: boolean;
    genre_count: number;
    theater_count: number;
    budget_category: string;
  };
  input_summary: {
    title: string;
    budget: string;
    theaters: number;
    genres: string;
    rating: string;
    distributor: string;
  };
}

export interface Options {
  mpaa_ratings: string[];
  genres: string[];
  distributors: string[];
  months: { value: number; label: string }[];
  days_of_week: { value: number; label: string }[];
}


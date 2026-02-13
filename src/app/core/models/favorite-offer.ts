export interface FavoriteOffer {
    id?: string;
    userId: string;
    offerId: string;
    title: string;
    company: string;
    location: string;
    description: string;
    url: string;
    salary_min?: number;
    salary_max?: number;
    created: string;
    dateAdded: string;
}

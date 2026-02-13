export interface Application {
    id?: string;
    userId: string;
    offerId: string;
    apiSource: string;
    title: string;
    company: string;
    location: string;
    url: string;
    status: 'en_attente' | 'accepte' | 'refuse';
    notes?: string;
    dateAdded: string;
}


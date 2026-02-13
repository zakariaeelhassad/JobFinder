export interface Offer {
    id: string;
    title: string;
    company: {
        display_name: string;
    };
    location: {
        display_name: string;
        area?: string[];
    };
    description: string;
    created: string;
    redirect_url: string;
    salary_min?: number;
    salary_max?: number;
    salary_is_predicted?: number;
    contract_type?: string;
    contract_time?: string;
    category?: {
        label: string;
        tag: string;
    };
}

export interface AdzunaSearchResponse {
    results: Offer[];
    count: number;
    mean?: number;
}


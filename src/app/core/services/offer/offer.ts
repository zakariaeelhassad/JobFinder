import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { AdzunaSearchResponse, Offer } from '../../models/offer';
import { environment } from '../../../../environment/environment';

export interface SearchFilters {
  keyword: string;
  location: string;
  contractType?: string;
  salaryMin?: number;
  page?: number;
  resultsPerPage?: number;
}

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    path: string;
    per_page: number;
    to: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  constructor(private http: HttpClient) { }

  searchJobs(filters: SearchFilters): Observable<AdzunaSearchResponse> {
    const { keyword, location, page = 1 } = filters;

    const url = `${environment.arbeitnowApi.baseUrl}`;

    let params = new HttpParams()
      .set('page', page.toString());

    if (keyword) {
      params = params.set('search', keyword);
    }

    return this.http.get<ArbeitnowResponse>(url, { params }).pipe(
      map(response => {
        const filteredJobs = response.data.filter(job => {
          const matchesLocation = !location ||
            job.location.toLowerCase().includes(location.toLowerCase()) ||
            (location.toLowerCase() === 'remote' && job.remote);

          return matchesLocation;
        });

        const mappedResults: Offer[] = filteredJobs.map(job => ({
          id: job.slug,
          title: job.title,
          company: {
            display_name: job.company_name
          },
          location: {
            display_name: job.remote ? 'Remote' : job.location,
            area: job.remote ? ['Remote'] : [job.location]
          },
          description: job.description,
          created: new Date(job.created_at * 1000).toISOString(),
          redirect_url: job.url,
          contract_type: job.job_types && job.job_types.length > 0 ? job.job_types[0] : undefined,
          category: job.tags && job.tags.length > 0 ? {
            label: job.tags[0],
            tag: job.tags[0]
          } : undefined
        }));

        return {
          results: mappedResults,
          count: mappedResults.length
        };
      }),
      catchError(error => {
        console.error('Error fetching jobs:', error);
        return of({ results: [], count: 0 });
      })
    );
  }
}


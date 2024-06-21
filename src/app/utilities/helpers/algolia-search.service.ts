import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch';
import { environment } from '../../../environments/environment';

const client = algoliasearch(
  environment?.ALGOLIA_APP_ID,
  environment?.ALGOLIA_API_KEY
);

@Injectable({
  providedIn: 'root',
})
export class AlgoliaSearchService {
  constructor() {}

  async userSearch(query: string) {
    const index = client.initIndex('user_content');
    const { hits } = await index.search(query);
    return hits;
  }

  async auctionSearch(query: string, params?: any) {
    const index = client.initIndex('auction_content');
    const { hits } = await index.search(query, params);
    return hits;
  }

  async tractorSearch(query: string, params?: any) {
    const index = client.initIndex('tractor_content');
    const { hits } = await index.search(query, params);
    return hits;
  }
}

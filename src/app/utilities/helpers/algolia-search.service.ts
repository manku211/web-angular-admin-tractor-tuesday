import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch';

const client = algoliasearch('ZH4NQRV649', 'ce9f1890a32db5ad5dfc536cad219b76');

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

  async auctionSearch(query: string) {
    const index = client.initIndex('auction_content');
    const { hits } = await index.search(query);
    return hits;
  }

  async tractorSearch(query: string) {
    const index = client.initIndex('tractor_content');
    const { hits } = await index.search(query);
    return hits;
  }
}

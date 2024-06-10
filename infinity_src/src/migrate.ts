import { isDataQuery } from './app/utils';
import type { InfinityQuery } from './types';

/**
 * ************************************************
 * Handles all the query migrations including the following
 * * Migrate raw body type to detailed body type object in url options
 * ************************************************
 * NOTE: DON'T interpolate query here
 * ************************************************
 * @param  {InfinityQuery} query
 * @returns InfinityQuery
 */
export const migrateQuery = (query: InfinityQuery): InfinityQuery => {
  let newQuery: InfinityQuery = { ...query };
  if (isDataQuery(newQuery) && newQuery.source === 'url' && newQuery.url_options.method === 'POST') {
    if (!newQuery.url_options.body_type) {
      if (newQuery.type === 'graphql') {
        newQuery = {
          ...newQuery,
          url_options: {
            ...(newQuery.url_options || {}),
            body_type: 'graphql',
            body_graphql_query: newQuery.url_options.body_graphql_query || newQuery.url_options.data || '',
            body_content_type: 'application/json',
            data: '',
          },
        };
      } else {
        newQuery = {
          ...newQuery,
          url_options: { ...(newQuery.url_options || {}), body_type: 'raw' },
        };
      }
    }
    if (!newQuery.url_options.body_content_type) {
      newQuery.url_options.body_content_type = 'text/plain';
    }
  }
  return newQuery;
};

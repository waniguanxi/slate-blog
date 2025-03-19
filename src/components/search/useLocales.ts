import type { DocSearchProps } from '@docsearch/react';
import { useMemo } from 'react';
import { languages, type LangType } from '@/typings/config';

export const algoliaLocalesConfig: Record<
  LangType,
  Omit<DocSearchProps, 'appId' | 'apiKey' | 'indexName'>
> = {
  'en-US': {},
  'zh-CN': {
    placeholder: 'Search documentation',
    translations: {
      button: {
        buttonText: 'Search',
        buttonAriaLabel: 'Search',
      },
      modal: {
        searchBox: {
          resetButtonTitle: 'Clear query',
          resetButtonAriaLabel: 'Clear query',
          cancelButtonText: 'Cancel',
          cancelButtonAriaLabel: 'Cancel',
        },
        startScreen: {
          recentSearchesTitle: 'Search History',
          noRecentSearchesText: 'No search history',
          saveRecentSearchButtonTitle: 'Save to search history',
          removeRecentSearchButtonTitle: 'Remove from search history',
          favoriteSearchesTitle: 'Favorites',
          removeFavoriteSearchButtonTitle: 'Remove from favorites',
        },
        errorScreen: {
          titleText: 'Unable to fetch results',
          helpText: 'You might want to check your network connection',
        },
        footer: {
          selectText: 'Select',
          navigateText: 'Navigate',
          closeText: 'Close',
          searchByText: 'Search by',
        },
        noResultsScreen: {
          noResultsText: 'No results found',
          suggestedQueryText: 'Try searching for',
          reportMissingResultsText: 'Think this query should return results?',
          reportMissingResultsLinkText: 'Let us know',
        },
      },
    },
  },
};

export function useLocales(local: LangType = languages[0]) {
  const config = useMemo(() => {
    return algoliaLocalesConfig[local];
  }, [local]);

  return config;
}

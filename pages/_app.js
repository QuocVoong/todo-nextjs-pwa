import React from 'react'
import { ReactQueryCacheProvider, ReactQueryConfigProvider, QueryCache } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'

const queryCache = new QueryCache();
const queryConfig = {
  queries: {
    staleTime: 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  }
}
export default function App({ Component, pageProps }) {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ReactQueryConfigProvider config={queryConfig}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen />
      </ReactQueryConfigProvider>
    </ReactQueryCacheProvider>
  )
}

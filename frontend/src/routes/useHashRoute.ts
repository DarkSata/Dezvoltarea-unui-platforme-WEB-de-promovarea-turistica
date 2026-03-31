import { useEffect, useState } from 'react'
import { parseHash, type RouteState } from './hash'

export function useHashRoute() {
  const [routeState, setRouteState] = useState<RouteState>(() => parseHash())

  useEffect(() => {
    const onHashChange = () => setRouteState(parseHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return routeState
}

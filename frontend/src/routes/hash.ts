export type RouteState = {
  route: 'home' | 'destinatii'
  sectionId: string
}

export function parseHash(): RouteState {
  const raw = window.location.hash.replace(/^#\/?/, '')
  if (!raw) {
    return { route: 'home', sectionId: '' }
  }

  const parts = raw.split('/')
  if (parts[0] === 'destinatii') {
    return { route: 'destinatii', sectionId: parts[1] ?? '' }
  }

  return { route: 'home', sectionId: parts[0] }
}

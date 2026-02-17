import { useEffect } from 'react'
import { scrollToId } from '../utils/scroll'

export function useScrollToSection(sectionId: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      return
    }
    scrollToId(sectionId)
  }, [sectionId, enabled])
}

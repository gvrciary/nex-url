'use client'

import Settings from '@/components/settings/Settings'
import { LinksProvider } from '@/components/providers/LinksProvider'

export default function SettingsPage() {
  return (
    <LinksProvider>
      <Settings />
    </LinksProvider>
  )
} 
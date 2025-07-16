import { useState, useEffect, useCallback } from 'react'
import { getUserLinks, deleteLink as deleteUserLink, createLink } from '@/server/actions/user'
import { Link } from '@/types/link'

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const userLinks = await getUserLinks()
      setLinks(userLinks)
    } catch (error) {
      setError('Failed to load links')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteLink = useCallback(async (linkId: string) => {
    try {
      await deleteUserLink(linkId)
      setLinks(prev => prev.filter(link => link.id !== linkId))
    } catch (error) {
      console.error('Failed to delete link:', error)
      throw error
    }
  }, [])

  const addLink = useCallback(async (originalUrl: string, customAlias?: string) => {
    try {
      const newLink = await createLink(originalUrl, customAlias)
      setLinks(prev => [newLink, ...prev])
      return newLink
    } catch (error) {
      console.error('Failed to create link:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  return {
    links,
    loading,
    error,
    deleteLink,
    addLink,
    refetch: fetchLinks
  }
} 
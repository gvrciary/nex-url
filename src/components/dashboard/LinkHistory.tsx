'use client'

import { useState, useMemo } from 'react'
import { Calendar, Eye, ExternalLink, Search } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import CopyButton from '@/components/ui/CopyButton'
import DeleteButton from '@/components/ui/DeleteButton'
import { useLinksContext } from '@/components/providers/LinksProvider'

export default function LinkHistory() {
  const { links, loading, error, deleteLink } = useLinksContext()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [deletingLinks, setDeletingLinks] = useState<Set<string>>(new Set())

  const filteredLinks = useMemo(() => {
    if (!searchTerm) return links
    
    return links.filter(link => 
      link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.customAlias.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [links, searchTerm])

  const handleDeleteLink = async (linkId: string) => {
    setDeletingLinks(prev => new Set([...prev, linkId]))
    
    try {
      await deleteLink(linkId)
    } catch (error) {
      console.error('Failed to delete link:', error)
    } finally {
      setDeletingLinks(prev => {
        const newSet = new Set(prev)
        newSet.delete(linkId)
        return newSet
      })
    }
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extralight mb-4 text-black dark:text-white">
            My Links
          </h2>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-black/70 dark:text-white/70 font-light text-lg">
              Loading your links...
            </p>
          </Card>
        ) : error ? (
          <Card className="p-12 text-center">
            <p className="text-red-600 dark:text-red-400 font-light text-lg">
              {error}
            </p>
          </Card>
        ) : filteredLinks.length === 0 ? (
          <Card className="p-12 text-center">
            {searchTerm ? (
              <>
                <p className="text-black/70 dark:text-white/70 font-light text-lg">
                  No links found
                </p>
                <p className="text-black/50 dark:text-white/50 font-light text-sm mt-2">
                  Try different search terms
                </p>
              </>
            ) : (
              <>
                <p className="text-black/70 dark:text-white/70 font-light text-lg">
                  You haven&apos;t created any links yet
                </p>
                <p className="text-black/50 dark:text-white/50 font-light text-sm mt-2">
                  Create your first link using the form above
                </p>
              </>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLinks.map((link) => {
              const isDeleting = deletingLinks.has(link.id)
              
              return (
                <Card 
                  key={link.id} 
                  className={`p-6 group transition-opacity duration-200 ${
                    isDeleting ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-light text-black dark:text-white truncate">
                        {window.location.origin}/{link.customAlias}
                      </h3>
                    </div>
                    
                    <p className="text-black/70 dark:text-white/70 mb-3 font-light truncate">
                      {link.originalUrl}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-black/50 dark:text-white/50 font-light">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(link.createdAt).toLocaleDateString('en-US')}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        {link.clicks.toLocaleString()} clicks
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center space-x-2 ml-4 opacity-60 group-hover:opacity-100 transition-opacity duration-200 ${
                    isDeleting ? 'pointer-events-none opacity-30' : ''
                  }`}>
                    <CopyButton 
                      textToCopy={`${window.location.origin}/${link.customAlias}`}
                      disabled={isDeleting}
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(link.originalUrl, '_blank')}
                      disabled={isDeleting}
                      title={isDeleting ? "Deleting..." : "Open original link"}
                      className="hover:scale-105 transition-transform duration-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    <DeleteButton 
                      onDelete={() => handleDeleteLink(link.id)} 
                      disabled={isDeleting}
                    />
                  </div>
                </div>
              </Card>
              )
            })}
          </div>
        )}

        {searchTerm && filteredLinks.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-black/50 dark:text-white/50 font-light text-sm">
              Showing {filteredLinks.length} of {links.length} links
            </p>
          </div>
        )}
      </div>
    </section>
  )
} 
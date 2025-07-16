'use client'

import { useState, useMemo } from 'react'
import { Calendar, Eye, ExternalLink, Search } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'
import Input from './ui/Input'
import CopyButton from './ui/CopyButton'
import DeleteButton from './ui/DeleteButton'

interface LinkData {
  id: string
  originalUrl: string
  shortUrl: string
  alias: string
  clicks: number
  createdAt: string
  status: 'active' | 'inactive'
}

export default function LinkHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [links, setLinks] = useState<LinkData[]>([
    {
      id: '1',
      originalUrl: 'https://www.example.com/very-long-article-about-technology',
      shortUrl: 'https://nex.ly/abc123',
      alias: 'abc123',
      clicks: 1247,
      createdAt: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      originalUrl: 'https://www.github.com/username/important-repository',
      shortUrl: 'https://nex.ly/gh456',
      alias: 'gh456',
      clicks: 892,
      createdAt: '2024-01-10',
      status: 'active'
    },
    {
      id: '3',
      originalUrl: 'https://www.youtube.com/watch?v=educational-video',
      shortUrl: 'https://nex.ly/yt789',
      alias: 'yt789',
      clicks: 654,
      createdAt: '2024-01-08',
      status: 'active'
    }
  ])

  const filteredLinks = useMemo(() => {
    if (!searchTerm) return links
    
    return links.filter(link => 
      link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.shortUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.alias.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [links, searchTerm])

  const handleDeleteLink = (linkId: string) => {
    setLinks(prev => prev.filter(link => link.id !== linkId))
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extralight mb-4 text-black dark:text-white">
            My Links
          </h2>
          <p className="text-black/70 dark:text-white/70 font-light">
            Manage and analyze the performance of your shortened links
          </p>
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

        {filteredLinks.length === 0 ? (
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
            {filteredLinks.map((link) => (
              <Card key={link.id} className="p-6 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-light text-black dark:text-white truncate">
                        {link.shortUrl}
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

                  <div className="flex items-center space-x-2 ml-4 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                    <CopyButton textToCopy={link.shortUrl} />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(link.originalUrl, '_blank')}
                      title="Open original link"
                      className="hover:scale-105 transition-transform duration-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    <DeleteButton onDelete={() => handleDeleteLink(link.id)} />
                  </div>
                </div>
              </Card>
            ))}
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
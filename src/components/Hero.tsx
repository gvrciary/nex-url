'use client'

import { useState } from 'react'
import { Link, Copy, Check } from 'lucide-react'
import Button from './ui/Button'
import Input from './ui/Input'

export default function Hero() {
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const alias = customAlias || Math.random().toString(36).substring(2, 8)
    setShortenedUrl(`https://nex.ly/${alias}`)
    setIsLoading(false)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortenedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl sm:text-7xl font-extralight tracking-tight mb-8">
          Acorta
          <br />
          <span className="font-light">tus Enlaces</span>
        </h1>
        
        <p className="text-xl font-light text-white/70 mb-16 max-w-2xl mx-auto leading-relaxed">
          Transforma enlaces largos en URLs cortas y elegantes. Rastrea clicks, analiza audiencia y gestiona tus enlaces de manera profesional.
        </p>

        <div className="max-w-2xl mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="Pega tu enlace aquí..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  icon={<Link className="h-4 w-4" />}
                />
              </div>
              <Button 
                type="submit" 
                disabled={!url || isLoading}
                className="px-8"
              >
                {isLoading ? 'Acortando...' : 'Acortar'}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Alias personalizado (opcional)"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
              />
            </div>
          </form>

          {shortenedUrl && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 text-left">
                  <p className="text-sm text-white/70 mb-1">Tu enlace acortado:</p>
                  <p className="text-lg font-light text-white break-all">{shortenedUrl}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="ml-4"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center">
          <Button size="lg" className="px-12">
            Crear Cuenta Gratis
          </Button>
          <Button variant="outline" size="lg" className="px-12">
            Ver Características
          </Button>
        </div>
      </div>
    </section>
  )
} 
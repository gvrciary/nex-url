'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Button from './Button'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  textToCopy: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function CopyButton({ 
  textToCopy, 
  size = 'sm', 
  className 
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error copying:', err)
    }
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleCopy}
      title="Copy link"
      className={cn(
        'transition-all duration-300 relative overflow-hidden',
        copied && 'text-green-600 dark:text-green-400',
        className
      )}
    >
      <div className={cn(
        'transition-all duration-300 flex items-center',
        copied ? 'scale-110' : 'scale-100'
      )}>
        {copied ? (
          <Check className={cn(
            'h-4 w-4 animate-in zoom-in-50 duration-300',
            size === 'sm' && 'h-4 w-4',
            size === 'md' && 'h-5 w-5',
            size === 'lg' && 'h-6 w-6'
          )} />
        ) : (
          <Copy className={cn(
            'h-4 w-4 transition-transform duration-200 hover:scale-110',
            size === 'sm' && 'h-4 w-4',
            size === 'md' && 'h-5 w-5',
            size === 'lg' && 'h-6 w-6'
          )} />
        )}
      </div>
      
      {copied && (
        <div className="absolute inset-0 bg-green-600/10 dark:bg-green-400/10 rounded-md animate-in fade-in-0 duration-300" />
      )}
    </Button>
  )
} 
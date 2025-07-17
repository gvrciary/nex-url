'use client'

import { useState } from 'react'
import { Trash2, Check, X } from 'lucide-react'
import Button from './ButtonT'
import { cn } from '@/lib/utils'

interface DeleteButtonProps {
  onDelete: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export default function DeleteButton({ 
  onDelete, 
  size = 'sm', 
  className,
  disabled = false
}: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    if (disabled) return
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    onDelete()
    setShowConfirm(false)
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-1 animate-in slide-in-from-right-2 duration-300">
        <Button
          variant="ghost"
          size={size}
          onClick={handleConfirm}
          disabled={disabled}
          title="Confirm deletion"
          className={cn(
            'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-400/10 transition-all duration-200',
            className
          )}
        >
          <Check className={cn(
            'h-4 w-4 animate-in zoom-in-50 duration-200',
            size === 'sm' && 'h-4 w-4',
            size === 'md' && 'h-5 w-5',
            size === 'lg' && 'h-6 w-6'
          )} />
        </Button>
        
        <Button
          variant="ghost"
          size={size}
          onClick={handleCancel}
          disabled={disabled}
          title="Cancel"
          className={cn(
            'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-400/10 transition-all duration-200',
            className
          )}
        >
          <X className={cn(
            'h-4 w-4 animate-in zoom-in-50 duration-200',
            size === 'sm' && 'h-4 w-4',
            size === 'md' && 'h-5 w-5',
            size === 'lg' && 'h-6 w-6'
          )} />
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleDelete}
      disabled={disabled}
      title={disabled ? "Deleting..." : "Delete link"}
      className={cn(
        'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-400/10 transition-all duration-200 hover:scale-105',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <Trash2 className={cn(
        'h-4 w-4 transition-transform duration-200',
        size === 'sm' && 'h-4 w-4',
        size === 'md' && 'h-5 w-5',
        size === 'lg' && 'h-6 w-6'
      )} />
    </Button>
  )
} 
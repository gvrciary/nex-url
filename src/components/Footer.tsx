import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center text-sm text-black/50 dark:text-white/50 font-light">
        <p>Made with <Heart className="inline-block h-4 w-4" /> by <a href="https://github.com/leontercero" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white pl-1 hover:text-black/70 dark:hover:text-white/70 font-bold">Leon Tercero</a></p>
      </div>
    </footer>
  )
} 
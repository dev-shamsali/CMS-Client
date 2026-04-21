import Link from 'next/link';
import { PenSquare } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <span className="font-bold">C</span>
            </div>
            CMS<span className="text-zinc-400 font-medium">Panel</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            href="/posts/create"
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <PenSquare size={16} />
            <span>New Post</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

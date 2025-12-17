import { FileCode2 } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-medium">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
            <FileCode2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold tracking-tight truncate">Universal Markdown Converter</h1>
            <p className="text-xs sm:text-sm text-primary-foreground/80 truncate">
              Converta arquivos para Markdown
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

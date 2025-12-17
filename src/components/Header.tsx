import { FileCode2 } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-medium">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Universal Markdown Converter</h1>
            <p className="text-sm text-primary-foreground/80">
              Converta arquivos para Markdown de forma rápida e fácil
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

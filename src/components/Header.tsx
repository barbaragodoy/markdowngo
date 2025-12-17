import logo from '@/assets/logo.svg';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-medium">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />
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

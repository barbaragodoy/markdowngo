import logo from '@/assets/logo.svg';

export function Header() {
  return (
    <header className="shadow-medium">
      {/* Barra superior verde */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-3 sm:px-4 py-1.5 sm:py-2">
          <span className="text-xs sm:text-sm font-semibold tracking-wide">GOIAS.GOV.BR</span>
        </div>
      </div>
      
      {/* Seção principal com fundo branco */}
      <div className="bg-white">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <img src={logo} alt="Governo de Goiás" className="h-12 sm:h-14 w-auto" />
            <div className="h-10 w-px bg-primary/30 hidden sm:block" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-primary tracking-tight truncate">
                Goias Markdown
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Converta arquivos para Markdown
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

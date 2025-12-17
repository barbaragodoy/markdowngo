import React from 'react';
import { Copy, Download, Eye, Code, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  markdown: string;
  isLoading?: boolean;
}

export function MarkdownPreview({ markdown, isLoading }: MarkdownPreviewProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('preview');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast({
      title: 'Copiado!',
      description: 'Markdown copiado para a área de transferência.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Download iniciado!',
      description: 'O arquivo .md está sendo baixado.',
    });
  };

  if (!markdown && !isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-card border border-border rounded-xl">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Eye className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhum conteúdo para exibir
        </h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Faça upload de um arquivo ou cole dados binários para ver o Markdown convertido aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-xl overflow-hidden">
      {/* Header with actions */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="h-9">
            <TabsTrigger value="preview" className="gap-2 text-sm px-3">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2 text-sm px-3">
              <Code className="w-4 h-4" />
              Markdown
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!markdown || isLoading}
            className="gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-primary" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleDownload}
            disabled={!markdown || isLoading}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download .md
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Convertendo...</p>
            </div>
          </div>
        ) : (
          <>
            <div className={cn('h-full p-6', activeTab !== 'preview' && 'hidden')}>
              <div className="markdown-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
            
            <div className={cn('h-full', activeTab !== 'code' && 'hidden')}>
              <pre className="h-full p-6 overflow-auto text-sm font-mono bg-muted/50">
                <code className="text-foreground whitespace-pre-wrap break-words">
                  {markdown}
                </code>
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

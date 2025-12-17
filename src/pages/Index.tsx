import { useState, useCallback } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { BinaryInput } from '@/components/BinaryInput';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { ConversionLogs } from '@/components/ConversionLogs';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Upload, Binary, FileCheck, AlertCircle } from 'lucide-react';
import {
  convertToMarkdown,
  convertBase64ToMarkdown,
  convertRawTextToMarkdown,
  type ConversionLog,
} from '@/lib/markdownConverter';

const Index = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<ConversionLog[]>([]);
  const [inputTab, setInputTab] = useState('file');

  const addLog = useCallback((log: Omit<ConversionLog, 'id' | 'timestamp'>) => {
    setLogs((prev) => [
      ...prev,
      {
        ...log,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      },
    ]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setSelectedFile(file);
      setIsProcessing(true);
      clearLogs();

      addLog({ type: 'info', message: `Iniciando conversão: ${file.name}` });

      try {
        const result = await convertToMarkdown(file, addLog);

        if (result.success) {
          setMarkdown(result.markdown);
          toast({
            title: 'Conversão concluída!',
            description: 'Seu arquivo foi convertido para Markdown com sucesso.',
          });

          if (result.warnings && result.warnings.length > 0) {
            result.warnings.forEach((warning) => {
              addLog({ type: 'warning', message: warning });
            });
          }
        } else {
          setMarkdown('');
          toast({
            title: 'Erro na conversão',
            description: result.error || 'Não foi possível converter o arquivo.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        addLog({ type: 'error', message: errorMessage });
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [addLog, clearLogs, toast]
  );

  const handleBinaryConvert = useCallback(
    (data: string, type: 'base64' | 'raw', sourceType: string) => {
      setIsProcessing(true);
      clearLogs();

      addLog({ type: 'info', message: `Processando entrada ${type === 'base64' ? 'Base64' : 'texto bruto'}` });

      try {
        const result =
          type === 'base64'
            ? convertBase64ToMarkdown(data, sourceType, addLog)
            : convertRawTextToMarkdown(data, addLog);

        if (result.success) {
          setMarkdown(result.markdown);
          toast({
            title: 'Conversão concluída!',
            description: 'Os dados foram convertidos para Markdown.',
          });
        } else {
          setMarkdown('');
          toast({
            title: 'Erro na conversão',
            description: result.error || 'Não foi possível converter os dados.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        addLog({ type: 'error', message: errorMessage });
        toast({
          title: 'Erro',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [addLog, clearLogs, toast]
  );

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setMarkdown('');
    clearLogs();
  }, [clearLogs]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Stats/Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-card border border-border rounded-xl">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground">Formatos Suportados</p>
              <p className="font-semibold text-foreground text-sm sm:text-base truncate">Excel, Word, CSV, TXT</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-card border border-border rounded-xl">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground">Saída</p>
              <p className="font-semibold text-foreground text-sm sm:text-base">Markdown Padrão</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-card border border-border rounded-xl">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground">Limitação</p>
              <p className="font-semibold text-foreground text-sm sm:text-base">PDFs escaneados</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-4 sm:space-y-6">
            <Tabs value={inputTab} onValueChange={setInputTab}>
              <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12">
                <TabsTrigger value="file" className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="truncate">Upload</span>
                </TabsTrigger>
                <TabsTrigger value="binary" className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Binary className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="truncate">Manual</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="mt-3 sm:mt-4">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  isProcessing={isProcessing}
                  selectedFile={selectedFile}
                  onClear={handleClearFile}
                />
              </TabsContent>

              <TabsContent value="binary" className="mt-3 sm:mt-4">
                <BinaryInput onConvert={handleBinaryConvert} isProcessing={isProcessing} />
              </TabsContent>
            </Tabs>

            {/* Conversion Logs */}
            <ConversionLogs logs={logs} onClear={clearLogs} />
          </div>

          {/* Right Panel - Preview */}
          <div className="min-h-[400px] lg:min-h-[600px]">
            <MarkdownPreview markdown={markdown} isLoading={isProcessing} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            Compatível com GitHub, Notion, Obsidian e outros editores Markdown
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;

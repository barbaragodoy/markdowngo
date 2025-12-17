import React, { useState } from 'react';
import { Binary, FileCode, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface BinaryInputProps {
  onConvert: (data: string, type: 'base64' | 'raw', sourceType: string) => void;
  isProcessing: boolean;
}

const sourceTypes = [
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'Word (.docx)' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
  { value: 'csv', label: 'CSV' },
  { value: 'generic', label: 'Genérico' },
];

export function BinaryInput({ onConvert, isProcessing }: BinaryInputProps) {
  const [inputType, setInputType] = useState<'base64' | 'raw'>('base64');
  const [data, setData] = useState('');
  const [sourceType, setSourceType] = useState('generic');

  const handleSubmit = () => {
    if (data.trim()) {
      onConvert(data.trim(), inputType, sourceType);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Binary className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Entrada Manual</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">Cole dados Base64 ou texto bruto</p>
        </div>
      </div>

      <Tabs value={inputType} onValueChange={(v) => setInputType(v as 'base64' | 'raw')}>
        <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4 h-9 sm:h-10">
          <TabsTrigger value="base64" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <FileCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Base64
          </TabsTrigger>
          <TabsTrigger value="raw" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Binary className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Texto Bruto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="base64" className="space-y-3 sm:space-y-4">
          <Textarea
            placeholder="Cole aqui o conteúdo em Base64..."
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="min-h-[100px] sm:min-h-[120px] font-mono text-xs sm:text-sm resize-none"
            disabled={isProcessing}
          />
        </TabsContent>

        <TabsContent value="raw" className="space-y-3 sm:space-y-4">
          <Textarea
            placeholder="Cole aqui o texto bruto para converter..."
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="min-h-[100px] sm:min-h-[120px] text-sm resize-none"
            disabled={isProcessing}
          />
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
        <div className="flex-1">
          <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">
            Tipo de Origem
          </label>
          <Select value={sourceType} onValueChange={setSourceType} disabled={isProcessing}>
            <SelectTrigger className="h-9 sm:h-10 text-sm">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {sourceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!data.trim() || isProcessing}
          className={cn(
            'h-9 sm:h-10 gap-1.5 sm:gap-2 w-full sm:w-auto text-sm',
            isProcessing && 'animate-pulse'
          )}
        >
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Converter
        </Button>
      </div>
    </div>
  );
}

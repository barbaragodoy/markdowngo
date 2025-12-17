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
    <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Binary className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Entrada Manual</h3>
          <p className="text-sm text-muted-foreground">Cole dados Base64 ou texto bruto</p>
        </div>
      </div>

      <Tabs value={inputType} onValueChange={(v) => setInputType(v as 'base64' | 'raw')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="base64" className="gap-2">
            <FileCode className="w-4 h-4" />
            Base64
          </TabsTrigger>
          <TabsTrigger value="raw" className="gap-2">
            <Binary className="w-4 h-4" />
            Texto Bruto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="base64" className="space-y-4">
          <Textarea
            placeholder="Cole aqui o conteúdo em Base64...&#10;&#10;Exemplo: SGVsbG8gV29ybGQh"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="min-h-[120px] font-mono text-sm resize-none"
            disabled={isProcessing}
          />
        </TabsContent>

        <TabsContent value="raw" className="space-y-4">
          <Textarea
            placeholder="Cole aqui o texto bruto para converter em Markdown..."
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isProcessing}
          />
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Tipo de Origem
          </label>
          <Select value={sourceType} onValueChange={setSourceType} disabled={isProcessing}>
            <SelectTrigger>
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
            'self-end h-10 gap-2',
            isProcessing && 'animate-pulse'
          )}
        >
          <Send className="w-4 h-4" />
          Converter
        </Button>
      </div>
    </div>
  );
}

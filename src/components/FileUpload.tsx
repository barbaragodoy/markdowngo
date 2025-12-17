import React, { useCallback, useState } from 'react';
import { Upload, FileText, FileSpreadsheet, File, X } from 'lucide-react';
import { detectFileType, formatFileSize, type FileType } from '@/lib/markdownConverter';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  selectedFile: File | null;
  onClear: () => void;
}

const fileTypeIcons: Record<FileType, React.ReactNode> = {
  xlsx: <FileSpreadsheet className="w-8 h-8" />,
  xls: <FileSpreadsheet className="w-8 h-8" />,
  docx: <FileText className="w-8 h-8" />,
  pdf: <FileText className="w-8 h-8" />,
  csv: <FileSpreadsheet className="w-8 h-8" />,
  txt: <FileText className="w-8 h-8" />,
  binary: <File className="w-8 h-8" />,
  unknown: <File className="w-8 h-8" />,
};

const fileTypeLabels: Record<FileType, string> = {
  xlsx: 'Excel',
  xls: 'Excel (Legado)',
  docx: 'Word',
  pdf: 'PDF',
  csv: 'CSV',
  txt: 'Texto',
  binary: 'Binário',
  unknown: 'Desconhecido',
};

export function FileUpload({ onFileSelect, isProcessing, selectedFile, onClear }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  const fileType = selectedFile ? detectFileType(selectedFile) : null;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          'drop-zone relative p-8 text-center cursor-pointer transition-all duration-300',
          isDragActive && 'active scale-[1.02]',
          isProcessing && 'opacity-50 pointer-events-none'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".xlsx,.xls,.docx,.pdf,.csv,.txt"
          onChange={handleChange}
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            'w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300',
            isDragActive && 'scale-110 bg-primary/20'
          )}>
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-foreground">
              {isDragActive ? 'Solte o arquivo aqui' : 'Arraste um arquivo ou clique para selecionar'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Suportados: Excel, Word, PDF, CSV, TXT
            </p>
          </div>
        </div>
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="animate-slide-up bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              fileType === 'xlsx' || fileType === 'xls' || fileType === 'csv'
                ? 'bg-emerald-100 text-emerald-600'
                : fileType === 'docx'
                ? 'bg-blue-100 text-blue-600'
                : fileType === 'pdf'
                ? 'bg-red-100 text-red-600'
                : 'bg-muted text-muted-foreground'
            )}>
              {fileType && fileTypeIcons[fileType]}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {fileType && fileTypeLabels[fileType]} • {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}

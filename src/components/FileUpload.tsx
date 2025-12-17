import React, { useCallback, useState } from 'react';
import { Upload, FileText, FileSpreadsheet, File, X, AlertCircle } from 'lucide-react';
import { detectFileType, formatFileSize, type FileType } from '@/lib/markdownConverter';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  isProcessing: boolean;
  selectedFiles: File[];
  onClear: () => void;
  onRemoveFile: (index: number) => void;
  maxFiles?: number;
}

const MAX_FILES_DEFAULT = 5;

const fileTypeIcons: Record<FileType, React.ReactNode> = {
  xlsx: <FileSpreadsheet className="w-full h-full" />,
  xls: <FileSpreadsheet className="w-full h-full" />,
  docx: <FileText className="w-full h-full" />,
  pdf: <FileText className="w-full h-full" />,
  csv: <FileSpreadsheet className="w-full h-full" />,
  txt: <FileText className="w-full h-full" />,
  binary: <File className="w-full h-full" />,
  unknown: <File className="w-full h-full" />,
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

export function FileUpload({ 
  onFilesSelect, 
  isProcessing, 
  selectedFiles, 
  onClear, 
  onRemoveFile,
  maxFiles = MAX_FILES_DEFAULT 
}: FileUploadProps) {
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

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const totalFiles = selectedFiles.length + newFiles.length;
    
    if (totalFiles > maxFiles) {
      const availableSlots = maxFiles - selectedFiles.length;
      if (availableSlots > 0) {
        onFilesSelect(newFiles.slice(0, availableSlots));
      }
    } else {
      onFilesSelect(newFiles);
    }
  }, [selectedFiles.length, maxFiles, onFilesSelect]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        // Reset input to allow selecting the same file again
        e.target.value = '';
      }
    },
    [processFiles]
  );

  const remainingSlots = maxFiles - selectedFiles.length;
  const canAddMore = remainingSlots > 0;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          'drop-zone relative p-4 sm:p-8 text-center cursor-pointer transition-all duration-300',
          isDragActive && 'active scale-[1.02]',
          (isProcessing || !canAddMore) && 'opacity-50 pointer-events-none'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => canAddMore && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".xlsx,.xls,.docx,.pdf,.csv,.txt"
          onChange={handleChange}
          disabled={isProcessing || !canAddMore}
          multiple
        />

        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className={cn(
            'w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300',
            isDragActive && 'scale-110 bg-primary/20'
          )}>
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          
          <div className="px-2">
            <p className="text-sm sm:text-lg font-medium text-foreground">
              {isDragActive ? 'Solte os arquivos aqui' : 'Arraste ou clique para selecionar'}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Excel, Word, PDF, CSV, TXT
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Máximo {maxFiles} arquivos • {remainingSlots} {remainingSlots === 1 ? 'vaga restante' : 'vagas restantes'}
            </p>
          </div>
        </div>
      </div>

      {/* Limit Warning */}
      {!canAddMore && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-xs sm:text-sm">Limite de {maxFiles} arquivos atingido</p>
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              {selectedFiles.length} {selectedFiles.length === 1 ? 'arquivo selecionado' : 'arquivos selecionados'}
            </p>
            <button
              onClick={onClear}
              className="text-xs sm:text-sm text-destructive hover:underline"
              disabled={isProcessing}
            >
              Limpar todos
            </button>
          </div>
          
          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
            {selectedFiles.map((file, index) => {
              const fileType = detectFileType(file);
              return (
                <div 
                  key={`${file.name}-${index}`}
                  className="animate-slide-up bg-card border border-border rounded-xl p-3 flex items-center justify-between gap-2 sm:gap-4"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className={cn(
                      'w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0',
                      fileType === 'xlsx' || fileType === 'xls' || fileType === 'csv'
                        ? 'bg-emerald-100 text-emerald-600'
                        : fileType === 'docx'
                        ? 'bg-blue-100 text-blue-600'
                        : fileType === 'pdf'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      <div className="w-4 h-4 sm:w-5 sm:h-5">
                        {fileTypeIcons[fileType]}
                      </div>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-xs sm:text-sm truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {fileTypeLabels[fileType]} • {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(index);
                    }}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"
                    disabled={isProcessing}
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
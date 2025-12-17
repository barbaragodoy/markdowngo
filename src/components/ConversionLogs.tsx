import React from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ConversionLog } from '@/lib/markdownConverter';

interface ConversionLogsProps {
  logs: ConversionLog[];
  onClear: () => void;
}

const logIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const logStyles = {
  info: 'text-blue-600 bg-blue-50 border-blue-100',
  success: 'text-primary bg-primary/10 border-primary/20',
  warning: 'text-amber-600 bg-amber-50 border-amber-100',
  error: 'text-red-600 bg-red-50 border-red-100',
};

const logIconStyles = {
  info: 'text-blue-500',
  success: 'text-primary',
  warning: 'text-amber-500',
  error: 'text-red-500',
};

export function ConversionLogs({ logs, onClear }: ConversionLogsProps) {
  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border bg-muted/30">
        <h3 className="font-medium text-xs sm:text-sm text-foreground">Logs de Conversão</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 sm:h-8 px-1.5 sm:px-2 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>
      
      <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto p-1.5 sm:p-2 space-y-1">
        {logs.map((log) => {
          const Icon = logIcons[log.type];
          return (
            <div
              key={log.id}
              className={cn(
                'flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border animate-fade-in',
                logStyles[log.type]
              )}
            >
              <Icon className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0', logIconStyles[log.type])} />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium break-words">{log.message}</p>
                <p className="text-[10px] sm:text-xs opacity-70 mt-0.5">
                  {log.timestamp.toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

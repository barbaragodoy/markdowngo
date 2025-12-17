import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

export type FileType = 'xlsx' | 'xls' | 'docx' | 'pdf' | 'csv' | 'txt' | 'binary' | 'unknown';

export interface ConversionResult {
  success: boolean;
  markdown: string;
  error?: string;
  warnings?: string[];
}

export interface ConversionLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export function detectFileType(file: File): FileType {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'xlsx':
      return 'xlsx';
    case 'xls':
      return 'xls';
    case 'docx':
      return 'docx';
    case 'pdf':
      return 'pdf';
    case 'csv':
      return 'csv';
    case 'txt':
      return 'txt';
    default:
      return 'unknown';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function convertToMarkdown(
  file: File,
  onLog: (log: Omit<ConversionLog, 'id' | 'timestamp'>) => void
): Promise<ConversionResult> {
  const fileType = detectFileType(file);
  
  onLog({ type: 'info', message: `Detectado arquivo do tipo: ${fileType.toUpperCase()}` });
  
  try {
    switch (fileType) {
      case 'xlsx':
      case 'xls':
        return await convertExcelToMarkdown(file, onLog);
      case 'docx':
        return await convertWordToMarkdown(file, onLog);
      case 'csv':
        return await convertCsvToMarkdown(file, onLog);
      case 'txt':
        return await convertTxtToMarkdown(file, onLog);
      case 'pdf':
        onLog({ type: 'error', message: 'Conversão de PDF ainda não implementada no navegador' });
        return {
          success: false,
          markdown: '',
          error: 'Conversão de PDF requer processamento especial. Por favor, use a entrada de dados binários/Base64 para PDFs.',
          warnings: ['PDFs escaneados podem ter limitações na extração de texto.']
        };
      default:
        onLog({ type: 'error', message: `Formato não suportado: .${file.name.split('.').pop()}` });
        return {
          success: false,
          markdown: '',
          error: `Formato de arquivo não suportado: .${file.name.split('.').pop()}. Formatos aceitos: Excel (.xlsx, .xls), Word (.docx), CSV (.csv), TXT (.txt).`
        };
    }
  } catch (error) {
    const errorMessage = translateError(error);
    onLog({ type: 'error', message: errorMessage });
    return {
      success: false,
      markdown: '',
      error: errorMessage
    };
  }
}

function translateError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    
    // Erros comuns de leitura de arquivo
    if (msg.includes('failed to fetch') || msg.includes('network')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
    if (msg.includes('not found') || msg.includes('404')) {
      return 'Arquivo não encontrado.';
    }
    if (msg.includes('permission') || msg.includes('access denied')) {
      return 'Sem permissão para acessar o arquivo.';
    }
    if (msg.includes('corrupt') || msg.includes('invalid')) {
      return 'Arquivo corrompido ou em formato inválido.';
    }
    if (msg.includes('too large') || msg.includes('size')) {
      return 'Arquivo muito grande para processar.';
    }
    if (msg.includes('timeout')) {
      return 'Tempo limite excedido. Tente com um arquivo menor.';
    }
    if (msg.includes('memory') || msg.includes('heap')) {
      return 'Memória insuficiente para processar o arquivo.';
    }
    if (msg.includes('encoding') || msg.includes('charset')) {
      return 'Erro de codificação. O arquivo pode usar caracteres não suportados.';
    }
    
    // Retorna a mensagem original se não for reconhecida
    return `Erro ao processar: ${error.message}`;
  }
  
  return 'Ocorreu um erro desconhecido durante o processamento.';
}

async function convertExcelToMarkdown(
  file: File,
  onLog: (log: Omit<ConversionLog, 'id' | 'timestamp'>) => void
): Promise<ConversionResult> {
  onLog({ type: 'info', message: 'Lendo arquivo Excel...' });
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      onLog({ type: 'error', message: 'Arquivo Excel não contém planilhas' });
      return {
        success: false,
        markdown: '',
        error: 'O arquivo Excel não contém nenhuma planilha válida.'
      };
    }
    
    let markdown = `# ${file.name.replace(/\.(xlsx|xls)$/i, '')}\n\n`;
    markdown += `> Convertido em ${new Date().toLocaleString('pt-BR')}\n\n`;
    
    const warnings: string[] = [];
    
    workbook.SheetNames.forEach((sheetName, index) => {
      onLog({ type: 'info', message: `Processando aba: ${sheetName}` });
      
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
      
      if (jsonData.length === 0) {
        warnings.push(`Aba "${sheetName}" está vazia`);
        onLog({ type: 'warning', message: `Aba "${sheetName}" está vazia e foi ignorada` });
        return;
      }
      
      // Add section header for each sheet
      markdown += `## ${sheetName}\n\n`;
      
      // Convert to markdown table
      const headers = jsonData[0] as string[];
      if (headers && headers.length > 0) {
        // Header row
        markdown += '| ' + headers.map(h => String(h || '').trim() || '-').join(' | ') + ' |\n';
        // Separator row
        markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
        
        // Data rows
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row.length > 0) {
            const cells = headers.map((_, colIndex) => {
              const cell = row[colIndex];
              return String(cell ?? '').trim() || '-';
            });
            markdown += '| ' + cells.join(' | ') + ' |\n';
          }
        }
        markdown += '\n';
      }
      
      if (index < workbook.SheetNames.length - 1) {
        markdown += '---\n\n';
      }
    });
    
    onLog({ type: 'success', message: `Convertidas ${workbook.SheetNames.length} aba(s) com sucesso` });
    
    return {
      success: true,
      markdown,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    onLog({ type: 'error', message: `Falha ao ler arquivo Excel: ${errorMessage}` });
    return {
      success: false,
      markdown: '',
      error: 'Não foi possível ler o arquivo Excel. Verifique se o arquivo não está corrompido ou protegido por senha.'
    };
  }
}

async function convertWordToMarkdown(
  file: File,
  onLog: (log: Omit<ConversionLog, 'id' | 'timestamp'>) => void
): Promise<ConversionResult> {
  onLog({ type: 'info', message: 'Lendo documento Word...' });
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Convert to HTML first, then transform to markdown
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    if (!result.value || result.value.trim().length === 0) {
      onLog({ type: 'warning', message: 'Documento Word está vazio ou contém apenas imagens' });
      return {
        success: false,
        markdown: '',
        error: 'O documento Word está vazio ou contém apenas elementos não suportados (como imagens).'
      };
    }
    
    let markdown = `# ${file.name.replace(/\.docx$/i, '')}\n\n`;
    markdown += `> Convertido em ${new Date().toLocaleString('pt-BR')}\n\n`;
    
    // Convert HTML to Markdown
    markdown += htmlToMarkdown(result.value);
    
    const warnings = result.messages
      .filter(m => m.type === 'warning')
      .map(m => traduzirAvisoMammoth(m.message));
    
    if (warnings.length > 0) {
      onLog({ type: 'warning', message: `${warnings.length} aviso(s) durante a conversão` });
    }
    
    onLog({ type: 'success', message: 'Documento Word convertido com sucesso' });
    
    return {
      success: true,
      markdown,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    onLog({ type: 'error', message: `Falha ao ler documento Word: ${errorMessage}` });
    return {
      success: false,
      markdown: '',
      error: 'Não foi possível ler o documento Word. Verifique se o arquivo é um .docx válido e não está corrompido.'
    };
  }
}

function traduzirAvisoMammoth(message: string): string {
  if (message.includes('unrecognised element')) {
    return 'Elemento não reconhecido foi ignorado';
  }
  if (message.includes('image')) {
    return 'Imagens foram ignoradas na conversão';
  }
  if (message.includes('style')) {
    return 'Alguns estilos não foram preservados';
  }
  return message;
}

function htmlToMarkdown(html: string): string {
  let md = html;
  
  // Headers
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n\n');
  
  // Bold and italic
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '_$1_');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '_$1_');
  
  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Lists
  md = md.replace(/<ul[^>]*>/gi, '\n');
  md = md.replace(/<\/ul>/gi, '\n');
  md = md.replace(/<ol[^>]*>/gi, '\n');
  md = md.replace(/<\/ol>/gi, '\n');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  
  // Paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  
  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');
  
  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');
  
  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();
  
  // Decode HTML entities
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, ' ');
  
  return md;
}

async function convertCsvToMarkdown(
  file: File,
  onLog: (log: Omit<ConversionLog, 'id' | 'timestamp'>) => void
): Promise<ConversionResult> {
  onLog({ type: 'info', message: 'Lendo arquivo CSV...' });
  
  try {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      onLog({ type: 'error', message: 'Arquivo CSV está vazio' });
      return {
        success: false,
        markdown: '',
        error: 'O arquivo CSV está vazio ou não contém dados válidos.'
      };
    }
    
    if (lines.length === 1) {
      onLog({ type: 'warning', message: 'CSV contém apenas cabeçalho, sem dados' });
    }
    
    let markdown = `# ${file.name.replace(/\.csv$/i, '')}\n\n`;
    markdown += `> Convertido em ${new Date().toLocaleString('pt-BR')}\n\n`;
    
    // Parse CSV (simple parser, handles basic cases)
    const rows = lines.map(line => {
      const cells: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      cells.push(current.trim());
      return cells;
    });
    
    // Header
    const headers = rows[0];
    markdown += '| ' + headers.map(h => h || '-').join(' | ') + ' |\n';
    markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
    
    // Data rows
    for (let i = 1; i < rows.length; i++) {
      const cells = headers.map((_, colIndex) => rows[i][colIndex] || '-');
      markdown += '| ' + cells.join(' | ') + ' |\n';
    }
    
    onLog({ type: 'success', message: `Convertidas ${rows.length - 1} linha(s) com sucesso` });
    
    return {
      success: true,
      markdown
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    onLog({ type: 'error', message: `Falha ao processar CSV: ${errorMessage}` });
    return {
      success: false,
      markdown: '',
      error: 'Não foi possível processar o arquivo CSV. Verifique se o formato está correto.'
    };
  }
}

async function convertTxtToMarkdown(
  file: File,
  onLog: (log: Omit<ConversionLog, 'id' | 'timestamp'>) => void
): Promise<ConversionResult> {
  onLog({ type: 'info', message: 'Lendo arquivo de texto...' });
  
  try {
    const text = await file.text();
    
    if (!text || text.trim().length === 0) {
      onLog({ type: 'error', message: 'Arquivo de texto está vazio' });
      return {
        success: false,
        markdown: '',
        error: 'O arquivo de texto está vazio.'
      };
    }
    
    let markdown = `# ${file.name.replace(/\.txt$/i, '')}\n\n`;
    markdown += `> Convertido em ${new Date().toLocaleString('pt-BR')}\n\n`;
    
    // Process text - detect potential structure
    const lines = text.split('\n');
    let processedText = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Detect potential headers (ALL CAPS or numbered sections)
      if (trimmed && trimmed === trimmed.toUpperCase() && trimmed.length < 100 && !/^\d+\.\s/.test(trimmed)) {
        processedText += `\n## ${trimmed}\n\n`;
      } else if (/^\d+\.\s/.test(trimmed)) {
        // Numbered items become list items
        processedText += `${trimmed}\n`;
      } else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        // Already list items
        processedText += `- ${trimmed.slice(1).trim()}\n`;
      } else if (trimmed) {
        processedText += `${trimmed}\n\n`;
      }
    });
    
    markdown += processedText;
    
    onLog({ type: 'success', message: 'Arquivo de texto convertido com sucesso' });
    
    return {
      success: true,
      markdown
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    onLog({ type: 'error', message: `Falha ao ler arquivo de texto: ${errorMessage}` });
    return {
      success: false,
      markdown: '',
      error: 'Não foi possível ler o arquivo de texto. Verifique a codificação do arquivo.'
    };
  }
}

export function convertBase64ToMarkdown(
  base64: string,
  sourceType: string,
  onLog: (log: Omit<ConversionLog, 'id' | 'timestamp'>) => void
): ConversionResult {
  onLog({ type: 'info', message: `Processando dados Base64 como ${sourceType}...` });
  
  if (!base64 || base64.trim().length === 0) {
    onLog({ type: 'error', message: 'Nenhum dado Base64 fornecido' });
    return {
      success: false,
      markdown: '',
      error: 'Por favor, insira os dados em Base64 para converter.'
    };
  }
  
  try {
    // Clean the base64 string
    const cleanBase64 = base64.replace(/^data:[^;]+;base64,/, '').trim();
    
    // Validate base64 format
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
      onLog({ type: 'error', message: 'Formato Base64 inválido detectado' });
      return {
        success: false,
        markdown: '',
        error: 'O texto fornecido não é um Base64 válido. Verifique se os dados estão corretos.'
      };
    }
    
    // Decode base64 to text
    const decoded = atob(cleanBase64);
    
    let markdown = `# Dados Convertidos\n\n`;
    markdown += `> Origem: ${sourceType}\n`;
    markdown += `> Convertido em ${new Date().toLocaleString('pt-BR')}\n\n`;
    markdown += '---\n\n';
    
    // Try to detect and format the content
    if (sourceType === 'csv') {
      const lines = decoded.split('\n').filter(l => l.trim());
      if (lines.length > 0) {
        const rows = lines.map(l => l.split(',').map(c => c.trim()));
        const headers = rows[0];
        
        markdown += '| ' + headers.join(' | ') + ' |\n';
        markdown += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
        
        for (let i = 1; i < rows.length; i++) {
          markdown += '| ' + rows[i].join(' | ') + ' |\n';
        }
      }
    } else {
      // Generic text processing
      markdown += decoded;
    }
    
    onLog({ type: 'success', message: 'Dados Base64 convertidos com sucesso' });
    
    return {
      success: true,
      markdown
    };
  } catch (error) {
    let errorMessage = 'Erro ao decodificar Base64';
    
    if (error instanceof DOMException && error.name === 'InvalidCharacterError') {
      errorMessage = 'Caracteres inválidos no Base64. O texto pode estar corrompido.';
    } else if (error instanceof Error) {
      if (error.message.includes('atob')) {
        errorMessage = 'Falha na decodificação. Verifique se o Base64 está completo e correto.';
      } else {
        errorMessage = error.message;
      }
    }
    
    onLog({ type: 'error', message: errorMessage });
    
    return {
      success: false,
      markdown: '',
      error: errorMessage
    };
  }
}

export function convertRawTextToMarkdown(
  text: string,
  onLog: (log: Omit<ConversionLog, 'id' | 'timestamp'>) => void
): ConversionResult {
  onLog({ type: 'info', message: 'Processando texto bruto...' });
  
  if (!text || text.trim().length === 0) {
    onLog({ type: 'error', message: 'Nenhum texto fornecido' });
    return {
      success: false,
      markdown: '',
      error: 'Por favor, insira algum texto para converter.'
    };
  }
  
  try {
    let markdown = `# Texto Convertido\n\n`;
    markdown += `> Convertido em ${new Date().toLocaleString('pt-BR')}\n\n`;
    markdown += '---\n\n';
    
    // Process the text with basic formatting
    const lines = text.split('\n');
    let processed = '';
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        processed += '\n';
      } else {
        processed += trimmed + '\n';
      }
    });
    
    markdown += processed;
    
    onLog({ type: 'success', message: 'Texto convertido com sucesso' });
    
    return {
      success: true,
      markdown
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    onLog({ type: 'error', message: `Falha ao processar texto: ${errorMessage}` });
    return {
      success: false,
      markdown: '',
      error: 'Não foi possível processar o texto fornecido.'
    };
  }
}

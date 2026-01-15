<div align="center">

# 📝 Goias Markdown

### Conversor de Arquivos para Markdown

<p align="center">
  <img src="./public/favicon.png" alt="Goias Markdown Logo" width="120" height="120">
</p>

**Transforme seus documentos Excel, Word, PDF e CSV em Markdown de forma rápida e fácil**

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-formatos-suportados">Formatos</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-estrutura">Estrutura</a> •
  <a href="#-contribuindo">Contribuir</a>
</p>

</div>

---

## 📋 Sobre

**Goias Markdown** é uma aplicação web moderna e intuitiva que permite converter diversos tipos de arquivos para o formato Markdown. Desenvolvida com as tecnologias mais recentes, oferece processamento rápido no lado do cliente, mantendo a formatação e estrutura original dos seus documentos.

### ✨ Por que usar o Goias Markdown?

- 🚀 **Rápido**: Processamento no lado do cliente, sem necessidade de enviar arquivos para servidores
- 🔒 **Seguro**: Seus arquivos permanecem no seu navegador
- 💯 **Gratuito**: 100% gratuito e open source
- 🎨 **Moderno**: Interface limpa e intuitiva
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 🌐 **Compatível**: Markdown compatível com GitHub, Notion, Obsidian e outras plataformas

---

## 🎯 Funcionalidades

<table>
  <tr>
    <td>✅ Conversão de múltiplos formatos</td>
    <td>✅ Interface drag-and-drop</td>
  </tr>
  <tr>
    <td>✅ Preview em tempo real</td>
    <td>✅ Download instantâneo</td>
  </tr>
  <tr>
    <td>✅ Suporte para tabelas e listas</td>
    <td>✅ Preservação de formatação</td>
  </tr>
  <tr>
    <td>✅ Processamento offline</td>
    <td>✅ Design responsivo</td>
  </tr>
</table>

---

## 📦 Formatos Suportados

<table>
  <thead>
    <tr>
      <th>Formato</th>
      <th>Extensões</th>
      <th>Características</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>📊 <strong>Excel</strong></td>
      <td><code>.xlsx</code>, <code>.xls</code></td>
      <td>Tabelas convertidas para markdown tables</td>
    </tr>
    <tr>
      <td>📄 <strong>Word</strong></td>
      <td><code>.docx</code></td>
      <td>Formatação, listas, títulos e estilos preservados</td>
    </tr>
    <tr>
      <td>📕 <strong>PDF</strong></td>
      <td><code>.pdf</code></td>
      <td>Extração de texto e estrutura do documento</td>
    </tr>
    <tr>
      <td>📑 <strong>CSV</strong></td>
      <td><code>.csv</code></td>
      <td>Planilhas e dados tabulares</td>
    </tr>
    <tr>
      <td>📝 <strong>Texto</strong></td>
      <td><code>.txt</code></td>
      <td>Conversão direta para Markdown</td>
    </tr>
  </tbody>
</table>

---

## 🚀 Instalação

### Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Começando

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre no diretório do projeto
cd markdowngo-60d034c3

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:8080** 🎉

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (http://localhost:8080)

# Produção
npm run build            # Cria build otimizada para produção
npm run build:dev        # Cria build em modo desenvolvimento
npm run preview          # Visualiza a build de produção localmente

# Qualidade de Código
npm run lint             # Executa ESLint para verificar código
```

---

## 🛠️ Tecnologias

### Core

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
      <br>React
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://vitejs.dev/logo.svg" width="48" height="48" alt="Vite" />
      <br>Vite
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="48" height="48" alt="Tailwind" />
      <br>Tailwind
    </td>
  </tr>
</table>

### Bibliotecas Principais

- **[Vite](https://vitejs.dev/)** `v5.4.19` - Build tool ultrarrápido
- **[React](https://react.dev/)** `v18.3.1` - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** `v5.8.3` - JavaScript com tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** `v3.4.17` - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI reutilizáveis e acessíveis
- **[React Router](https://reactrouter.com/)** `v6.30.1` - Roteamento para aplicações React

### Processamento de Arquivos

- **[Mammoth.js](https://github.com/mwilliamson/mammoth.js)** `v1.11.0` - Conversão de arquivos `.docx`
- **[XLSX (SheetJS)](https://sheetjs.com/)** `v0.18.5` - Manipulação de planilhas Excel
- **[PDF.js](https://mozilla.github.io/pdf.js/)** `v4.4.168` - Renderização e extração de PDFs
- **[React Markdown](https://github.com/remarkjs/react-markdown)** `v10.1.0` - Renderização de Markdown

### UI Components

- **[Radix UI](https://www.radix-ui.com/)** - Primitivos de UI acessíveis
- **[Lucide React](https://lucide.dev/)** `v0.462.0` - Ícones modernos
- **[Sonner](https://sonner.emilkowal.ski/)** `v1.7.4` - Notificações toast elegantes

---

## 📁 Estrutura do Projeto

```
markdowngo-60d034c3/
│
├── 📁 public/              # Arquivos estáticos públicos
│   └── favicon.png         # Ícone do aplicativo
│
├── 📁 src/                 # Código fonte da aplicação
│   ├── 📁 components/      # Componentes React reutilizáveis
│   │   ├── ui/            # Componentes de UI (shadcn)
│   │   └── ...            # Outros componentes
│   │
│   ├── 📁 pages/           # Páginas da aplicação
│   │   └── Index.tsx      # Página principal
│   │
│   ├── 📁 hooks/           # Custom React Hooks
│   │   └── use-toast.ts   # Hook para notificações
│   │
│   ├── 📁 lib/             # Utilitários e funções auxiliares
│   │   ├── utils.ts       # Funções utilitárias
│   │   └── converters/    # Conversores de formato
│   │
│   ├── 📄 App.tsx          # Componente raiz
│   ├── 📄 main.tsx         # Ponto de entrada da aplicação
│   └── 📄 index.css        # Estilos globais
│
├── 📄 index.html           # HTML principal
├── 📄 vite.config.ts       # Configuração do Vite
├── 📄 tailwind.config.ts   # Configuração do Tailwind
├── 📄 tsconfig.json        # Configuração do TypeScript
├── 📄 package.json         # Dependências e scripts
└── 📄 README.md            # Documentação (você está aqui!)
```

---

## 💻 Como Editar o Código

### 🖥️ Usando seu IDE Preferido

1. Clone o repositório
2. Abra o projeto no seu IDE favorito (VS Code, WebStorm, etc.)
3. Faça as alterações desejadas
4. Commit e push para o repositório

### 🌐 Editando no GitHub

1. Navegue até o arquivo desejado no GitHub
2. Clique no botão **"Edit"** (ícone de lápis)
3. Faça suas alterações
4. Commit diretamente no navegador

### ☁️ Usando GitHub Codespaces

1. Vá para a página principal do repositório
2. Clique em **"Code"** > **"Codespaces"**
3. Clique em **"New codespace"**
4. Edite os arquivos no ambiente cloud
5. Commit e push quando terminar

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Este projeto segue o padrão de contribuição open source.

### Como Contribuir

1. **Fork** o projeto
2. Crie uma **branch** para sua feature
   ```bash
   git checkout -b feature/MinhaNovaFeature
   ```
3. **Commit** suas mudanças
   ```bash
   git commit -m 'feat: Adiciona MinhaNovaFeature'
   ```
4. **Push** para a branch
   ```bash
   git push origin feature/MinhaNovaFeature
   ```
5. Abra um **Pull Request**

### Padrões de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alterações na documentação
- `style:` Formatação de código
- `refactor:` Refatoração de código
- `test:` Adição ou modificação de testes
- `chore:` Tarefas de manutenção

---

## 🐛 Reportar Problemas

Encontrou um bug ou tem uma sugestão de melhoria?

1. Verifique se o problema já não foi reportado nas [Issues](../../issues)
2. Se não existir, [crie uma nova issue](../../issues/new)
3. Descreva o problema detalhadamente
4. Inclua prints ou exemplos, se possível

---

## 📄 Licença

Este projeto foi desenvolvido pelo **Estado de Goiás**.

---

## 👥 Equipe

Desenvolvido pela equipe de tecnologia do **Estado de Goiás**.


---

<div align="center">

### ⭐ Se este projeto foi útil, considere dar uma estrela!

**[⬆ Voltar ao topo](#-goias-markdown)**

</div>

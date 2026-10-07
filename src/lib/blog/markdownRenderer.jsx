import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ArticleImage from '@/components/blog/ArticleImage';

export function slugifyHeading(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, '') // remove HTML tags if any
    .replace(/[^\w\s-]/g, '') // remove special chars
    .replace(/[\s_-]+/g, '-') // swap spaces with -
    .replace(/^-+|-+$/g, ''); // trim -
}

/**
 * Extracts Table of Contents from Markdown content
 * Returns array of { id, title, level }
 */
export function extractTableOfContents(markdown = '') {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const toc = [];
  const idCounts = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      const rawTitle = trimmed.replace(/^##\s+/, '').replace(/\*\*/g, '');
      let baseId = slugifyHeading(rawTitle) || 'section';
      if (idCounts[baseId]) {
        idCounts[baseId] += 1;
        baseId = `${baseId}-${idCounts[baseId]}`;
      } else {
        idCounts[baseId] = 1;
      }
      toc.push({ id: baseId, title: rawTitle, level: 2 });
    } else if (trimmed.startsWith('### ')) {
      const rawTitle = trimmed.replace(/^###\s+/, '').replace(/\*\*/g, '');
      let baseId = slugifyHeading(rawTitle) || 'subsection';
      if (idCounts[baseId]) {
        idCounts[baseId] += 1;
        baseId = `${baseId}-${idCounts[baseId]}`;
      } else {
        idCounts[baseId] = 1;
      }
      toc.push({ id: baseId, title: rawTitle, level: 3 });
    }
  }

  return toc;
}

/**
 * Parses inline formatting: **bold**, *italic*, [link](url)
 */
function parseInline(text) {
  if (!text) return null;
  // Match links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseBoldItalic(text.substring(lastIndex, match.index)));
    }
    const linkText = match[1];
    const rawUrl = match[2]?.trim() || '';
    const isDangerous = /^(javascript:|data:|vbscript:)/i.test(rawUrl);

    if (isDangerous) {
      parts.push(<span key={`unsafe-${match.index}`}>{linkText}</span>);
    } else {
      const isExternal = rawUrl.startsWith('http') && !rawUrl.includes('saudagarproperties.com');
      parts.push(
        <Link
          key={`link-${match.index}`}
          href={rawUrl}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-[#D09A16] hover:text-[#B5986D] underline underline-offset-4 font-medium transition-colors"
        >
          {linkText}
        </Link>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(parseBoldItalic(text.substring(lastIndex)));
  }

  return parts.length > 0 ? parts : text;
}

function parseBoldItalic(text) {
  if (!text) return null;
  // Split on **bold**
  const boldParts = text.split(/\*\*(.*?)\*\*/g);
  if (boldParts.length === 1) {
    // Check *italic*
    const italicParts = text.split(/\*(.*?)\*/g);
    if (italicParts.length === 1) return text;
    return italicParts.map((chunk, i) => (i % 2 === 1 ? <em key={i} className="italic">{chunk}</em> : chunk));
  }

  return boldParts.map((chunk, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-semibold text-[#17213D]">{chunk}</strong>;
    }
    const subItalics = chunk.split(/\*(.*?)\*/g);
    return subItalics.map((sub, j) => (j % 2 === 1 ? <em key={`${i}-${j}`} className="italic">{sub}</em> : sub));
  });
}

/**
 * Server-side Semantic Markdown Renderer
 * Converts Markdown string into crawlable semantic React JSX elements
 */
export function MarkdownRenderer({ content = '' }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let currentParagraph = [];
  let currentList = null;
  let currentTable = null;
  let currentBlockquote = [];
  const idCounts = {};

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const fullText = currentParagraph.join(' ').trim();
      if (fullText) {
        elements.push(
          <p key={`p-${elements.length}`} className="text-[#334155] text-base md:text-lg leading-relaxed mb-6 font-sans">
            {parseInline(fullText)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${elements.length}`} className="space-y-3 mb-6 ml-6 list-disc text-[#334155] text-base md:text-lg leading-relaxed marker:text-[#D09A16]">
            {currentList.items.map((item, i) => (
              <li key={i}>{parseInline(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="space-y-3 mb-6 ml-6 list-decimal text-[#334155] text-base md:text-lg leading-relaxed marker:font-bold marker:text-[#D09A16]">
            {currentList.items.map((item, i) => (
              <li key={i}>{parseInline(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const flushBlockquote = () => {
    if (currentBlockquote.length > 0) {
      const text = currentBlockquote.join(' ').trim();
      const isAdvisory = text.toLowerCase().includes('tip:') || text.toLowerCase().includes('advisory:') || text.toLowerCase().includes('warning:');
      elements.push(
        <blockquote 
          key={`quote-${elements.length}`} 
          className={`border-l-4 p-6 my-8 rounded-r-2xl shadow-xs ${
            isAdvisory 
              ? 'border-[#D09A16] bg-[#FAF8F5]' 
              : 'border-[#17213D] bg-[#F7F5EF]'
          }`}
        >
          <p className="font-serif italic text-base md:text-lg text-[#17213D] leading-relaxed mb-0">
            {parseInline(text)}
          </p>
        </blockquote>
      );
      currentBlockquote = [];
    }
  };

  const flushTable = () => {
    if (currentTable) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-8 border border-[#17213D]/10 rounded-2xl shadow-xs bg-white">
          <table className="w-full text-left text-sm md:text-base border-collapse">
            {currentTable.headers.length > 0 && (
              <thead>
                <tr className="bg-[#17213D] text-[#F7F5EF] divide-x divide-white/10">
                  {currentTable.headers.map((h, i) => (
                    <th key={i} className="px-5 py-3.5 font-serif font-semibold text-xs md:text-sm tracking-wider uppercase">
                      {parseInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-[#17213D]/10">
              {currentTable.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white hover:bg-[#F7F5EF]/60 transition-colors' : 'bg-[#FAF8F5] hover:bg-[#F7F5EF] transition-colors'}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-5 py-3.5 text-[#334155] align-top">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Empty line
    if (!line) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      continue;
    }

    // Horizontal Rule
    if (line === '---' || line === '***') {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      elements.push(<hr key={`hr-${elements.length}`} className="my-10 border-t border-[#17213D]/15" />);
      continue;
    }

    // Heading 2
    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      const rawTitle = line.replace(/^##\s+/, '').replace(/\*\*/g, '');
      let id = slugifyHeading(rawTitle) || 'section';
      if (idCounts[id]) {
        idCounts[id] += 1;
        id = `${id}-${idCounts[id]}`;
      } else {
        idCounts[id] = 1;
      }
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          id={id}
          className="scroll-mt-28 text-2xl md:text-3xl font-serif font-bold text-[#17213D] mt-12 mb-5 tracking-tight group"
        >
          {parseInline(rawTitle)}
        </h2>
      );
      continue;
    }

    // Heading 3 (with Step-by-Step detection)
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      const rawTitle = line.replace(/^###\s+/, '').replace(/\*\*/g, '');
      let id = slugifyHeading(rawTitle) || 'subsection';
      if (idCounts[id]) {
        idCounts[id] += 1;
        id = `${id}-${idCounts[id]}`;
      } else {
        idCounts[id] = 1;
      }

      const stepMatch = rawTitle.match(/^Step\s+(\d+)[:\s]+(.*)/i);
      if (stepMatch) {
        const stepNum = stepMatch[1];
        const stepText = stepMatch[2];
        elements.push(
          <h3
            key={`h3-${elements.length}`}
            id={id}
            className="scroll-mt-28 flex items-center gap-3 text-xl md:text-2xl font-serif font-bold text-[#17213D] mt-8 mb-4 tracking-tight"
          >
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-[#17213D] text-[#D09A16] text-xs font-bold shrink-0">
              {stepNum}
            </span>
            <span className="flex-1">{parseInline(`Step ${stepNum}: ${stepText}`)}</span>
          </h3>
        );
      } else {
        elements.push(
          <h3
            key={`h3-${elements.length}`}
            id={id}
            className="scroll-mt-28 text-xl md:text-2xl font-serif font-semibold text-[#17213D] mt-8 mb-4 tracking-tight"
          >
            {parseInline(rawTitle)}
          </h3>
        );
      }
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      flushParagraph();
      flushList();
      flushTable();
      currentBlockquote.push(line.replace(/^>\s*/, ''));
      continue;
    }

    // Unordered List
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      flushBlockquote();
      flushTable();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(line.substring(2));
      continue;
    }

    // Ordered List
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      flushParagraph();
      flushBlockquote();
      flushTable();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numMatch[2]);
      continue;
    }

    // Table Row
    if (line.startsWith('|') && line.endsWith('|')) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      // Check if divider row like | :--- | :--- |
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        // Divider row, skip
        continue;
      }
      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    }

    // Image: ![alt](url) or ![alt | caption: ... | credit: ... | source: ...](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      const rawAltSection = imgMatch[1] || '';
      const src = imgMatch[2];

      let alt = rawAltSection;
      let caption = '';
      let credit = '';
      let source = '';

      if (rawAltSection.includes('|')) {
        const tokens = rawAltSection.split('|').map(t => t.trim());
        alt = tokens[0] || 'Saudagar luxury real estate Gurugram';
        tokens.slice(1).forEach(token => {
          const [key, ...valParts] = token.split(':');
          const val = valParts.join(':').trim();
          const cleanKey = key.trim().toLowerCase();
          if (cleanKey === 'caption') caption = val;
          else if (cleanKey === 'credit') credit = val;
          else if (cleanKey === 'source') source = val;
        });
      } else {
        alt = rawAltSection || 'Saudagar luxury real estate Gurugram';
        caption = alt;
      }

      elements.push(
        <ArticleImage
          key={`img-${elements.length}`}
          src={src}
          alt={alt}
          caption={caption}
          credit={credit}
          source={source}
          sizes="(max-width: 768px) 100vw, 850px"
        />
      );
      continue;
    }

    // Regular paragraph line
    flushBlockquote();
    flushTable();
    flushList();
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();
  flushBlockquote();
  flushTable();

  return <div className="article-prose leading-relaxed space-y-2">{elements}</div>;
}

import React from 'react';
import Link from 'next/link';
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
 * Parses inline formatting:
 * - [link text](url "optional title")
 * - `code`
 * - <u>underline</u>
 * - ~~strikethrough~~
 * - **bold**
 * - *italic* / _italic_
 */
export function parseInline(text) {
  if (!text) return null;
  // Match links: [text](url) or [text](url "title")
  const linkRegex = /\[([^\]]+)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseInlineFormatting(text.substring(lastIndex, match.index), `pre-${match.index}`));
    }
    const linkText = match[1];
    const rawUrl = match[2]?.trim() || '';
    const linkTitle = match[3] || '';
    const isDangerous = /^(javascript:|data:|vbscript:)/i.test(rawUrl);

    if (isDangerous) {
      parts.push(<span key={`unsafe-${match.index}`}>{linkText}</span>);
    } else {
      const isExternal = rawUrl.startsWith('http') && !rawUrl.includes('saudagarproperties.com');
      const isNofollow = linkTitle.toLowerCase().includes('nofollow') || /rel=["']nofollow["']/i.test(linkTitle);
      
      let rel = undefined;
      if (isExternal) {
        rel = isNofollow ? 'nofollow noopener noreferrer' : 'noopener noreferrer';
      } else if (isNofollow) {
        rel = 'nofollow';
      }

      parts.push(
        <Link
          key={`link-${match.index}`}
          href={rawUrl}
          target={isExternal ? '_blank' : undefined}
          rel={rel}
          title={linkTitle || undefined}
          className="text-brand-gold hover:text-brand-gold-deep underline underline-offset-4 font-medium transition-colors"
        >
          {parseInlineFormatting(linkText, `lt-${match.index}`)}
        </Link>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(parseInlineFormatting(text.substring(lastIndex), `post-${lastIndex}`));
  }

  return parts.length > 0 ? parts : text;
}

/**
 * Sub-parser for inline code, underline, strikethrough, bold, and italic
 */
function parseInlineFormatting(text, keyPrefix = 'fmt') {
  if (!text) return null;

  // 1. Inline code: `code`
  if (text.includes('`')) {
    const codeParts = text.split(/`([^`]+)`/g);
    if (codeParts.length > 1) {
      return codeParts.map((chunk, i) => {
        if (i % 2 === 1) {
          return (
            <code
              key={`${keyPrefix}-code-${i}`}
              className="px-1.5 py-0.5 rounded-md bg-brand-navy/5 text-brand-navy font-mono text-[0.88em] border border-brand-navy/10"
            >
              {chunk}
            </code>
          );
        }
        return parseUnderlineStrikethrough(chunk, `${keyPrefix}-csub-${i}`);
      });
    }
  }

  return parseUnderlineStrikethrough(text, keyPrefix);
}

function parseUnderlineStrikethrough(text, keyPrefix = 'us') {
  if (!text) return null;

  // 2. Underline: <u>text</u>
  if (text.includes('<u>') && text.includes('</u>')) {
    const uParts = text.split(/<u>([\s\S]*?)<\/u>/gi);
    if (uParts.length > 1) {
      return uParts.map((chunk, i) => {
        if (i % 2 === 1) {
          return (
            <span key={`${keyPrefix}-u-${i}`} className="underline underline-offset-4 decoration-brand-gold/70">
              {parseStrikethrough(chunk, `${keyPrefix}-usub-${i}`)}
            </span>
          );
        }
        return parseStrikethrough(chunk, `${keyPrefix}-usub-${i}`);
      });
    }
  }

  return parseStrikethrough(text, keyPrefix);
}

function parseStrikethrough(text, keyPrefix = 'del') {
  if (!text) return null;

  // 3. Strikethrough: ~~text~~
  if (text.includes('~~')) {
    const delParts = text.split(/~~(.*?)~~/g);
    if (delParts.length > 1) {
      return delParts.map((chunk, i) => {
        if (i % 2 === 1) {
          return (
            <del key={`${keyPrefix}-del-${i}`} className="line-through text-brand-muted">
              {parseBoldItalic(chunk, `${keyPrefix}-dsub-${i}`)}
            </del>
          );
        }
        return parseBoldItalic(chunk, `${keyPrefix}-dsub-${i}`);
      });
    }
  }

  return parseBoldItalic(text, keyPrefix);
}

function parseBoldItalic(text, keyPrefix = 'bi') {
  if (!text) return null;

  // Split on **bold**
  const boldParts = text.split(/\*\*(.*?)\*\*/g);
  if (boldParts.length === 1) {
    // Check *italic*
    const italicParts = text.split(/\*(.*?)\*/g);
    if (italicParts.length === 1) return text;
    return italicParts.map((chunk, i) => (
      i % 2 === 1 ? <em key={`${keyPrefix}-it-${i}`} className="italic">{chunk}</em> : chunk
    ));
  }

  return boldParts.map((chunk, i) => {
    if (i % 2 === 1) {
      return <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-brand-navy">{chunk}</strong>;
    }
    const subItalics = chunk.split(/\*(.*?)\*/g);
    return subItalics.map((sub, j) => (
      j % 2 === 1 ? <em key={`${keyPrefix}-b-it-${i}-${j}`} className="italic">{sub}</em> : sub
    ));
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
          <p key={`p-${elements.length}`} className="text-brand-slate text-base md:text-lg leading-relaxed mb-6 font-sans">
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
          <ul key={`ul-${elements.length}`} className="space-y-3 mb-6 ml-6 list-disc text-brand-slate text-base md:text-lg leading-relaxed marker:text-brand-gold">
            {currentList.items.map((item, i) => (
              <li key={i}>
                {parseInline(item.text)}
                {item.children && item.children.length > 0 && (
                  <ul className="space-y-2 mt-2 ml-6 list-circle marker:text-brand-gold/70">
                    {item.children.map((child, j) => (
                      <li key={j}>{parseInline(child)}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="space-y-3 mb-6 ml-6 list-decimal text-brand-slate text-base md:text-lg leading-relaxed marker:font-bold marker:text-brand-gold">
            {currentList.items.map((item, i) => (
              <li key={i}>
                {parseInline(item.text)}
                {item.children && item.children.length > 0 && (
                  <ol className="space-y-2 mt-2 ml-6 list-decimal marker:font-normal marker:text-brand-gold/70">
                    {item.children.map((child, j) => (
                      <li key={j}>{parseInline(child)}</li>
                    ))}
                  </ol>
                )}
              </li>
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
      const lower = text.toLowerCase();
      const isTip = lower.includes('tip:') || lower.includes('💡') || lower.includes('[!tip]') || lower.includes('\\[!tip\\]');
      const isWarning = lower.includes('warning:') || lower.includes('advisory:') || lower.includes('⚠️') || lower.includes('[!warning]') || lower.includes('\\[!warning\\]');
      const isNote = lower.includes('[!note]') || lower.includes('\\[!note\\]') || lower.includes('note:');
      const isAdvisory = isTip || isWarning || isNote;
      
      // Clean callout alert headers if present (tolerating escaped brackets)
      const cleanText = text
        .replace(/^\\?\[!(?:NOTE|TIP|WARNING|IMPORTANT|CAUTION)\\?\]\s*/i, '');

      elements.push(
        <blockquote 
          key={`quote-${elements.length}`} 
          className={`border-l-4 p-6 my-8 rounded-r-2xl shadow-xs ${
            isWarning
              ? 'border-amber-500 bg-amber-500/5'
              : isAdvisory 
                ? 'border-brand-gold bg-brand-ivory-warm' 
                : 'border-brand-navy bg-brand-ivory'
          }`}
        >
          <div className="font-serif italic text-base md:text-lg text-brand-navy leading-relaxed mb-0">
            {parseInline(cleanText)}
          </div>
        </blockquote>
      );
      currentBlockquote = [];
    }
  };

  const flushTable = () => {
    if (currentTable) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-8 border border-brand-navy/10 rounded-2xl shadow-xs bg-white">
          <table className="w-full text-left text-sm md:text-base border-collapse">
            {currentTable.headers.length > 0 && (
              <thead>
                <tr className="bg-brand-navy text-brand-ivory divide-x divide-white/10">
                  {currentTable.headers.map((h, i) => (
                    <th key={i} className="px-5 py-3.5 font-serif font-semibold text-xs md:text-sm tracking-wider uppercase">
                      {parseInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-brand-navy/10">
              {currentTable.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white hover:bg-brand-ivory/60 transition-colors' : 'bg-brand-ivory-warm hover:bg-brand-ivory transition-colors'}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-5 py-3.5 text-brand-slate align-top">
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
      elements.push(<hr key={`hr-${elements.length}`} className="my-10 border-t border-brand-navy/15" />);
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
          className="scroll-mt-28 text-2xl lg:text-[1.75rem] xl:text-3xl font-serif font-bold text-brand-navy mt-12 mb-5 tracking-tight group clear-both w-full [text-wrap:normal]"
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
            className="scroll-mt-28 flex items-center gap-3 text-xl lg:text-2xl font-serif font-bold text-brand-navy mt-8 mb-4 tracking-tight clear-both w-full [text-wrap:normal]"
          >
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-brand-navy text-brand-gold text-xs font-bold shrink-0">
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
            className="scroll-mt-28 text-xl lg:text-2xl font-serif font-semibold text-brand-navy mt-8 mb-4 tracking-tight clear-both w-full [text-wrap:normal]"
          >
            {parseInline(rawTitle)}
          </h3>
        );
      }
      continue;
    }

    // Heading 4
    if (line.startsWith('#### ')) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      const rawTitle = line.replace(/^####\s+/, '').replace(/\*\*/g, '');
      let id = slugifyHeading(rawTitle) || 'heading-4';
      if (idCounts[id]) {
        idCounts[id] += 1;
        id = `${id}-${idCounts[id]}`;
      } else {
        idCounts[id] = 1;
      }
      elements.push(
        <h4
          key={`h4-${elements.length}`}
          id={id}
          className="scroll-mt-28 text-lg lg:text-xl font-serif font-semibold text-brand-navy mt-6 mb-3 tracking-tight w-full [text-wrap:normal]"
        >
          {parseInline(rawTitle)}
        </h4>
      );
      continue;
    }

    // YouTube Embed (standalone line)
    const ytMatch = line.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?$/);
    if (ytMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      const videoId = ytMatch[1];
      elements.push(
        <div key={`yt-${elements.length}`} className="my-8 overflow-hidden rounded-2xl md:rounded-3xl border border-brand-navy/10 shadow-md aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title="Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      );
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

    // Unordered List (with nested item support)
    const isIndentedUl = /^(\s{2,}|\t)[-*]\s+(.*)/.exec(rawLine);
    if (isIndentedUl && currentList && currentList.type === 'ul' && currentList.items.length > 0) {
      const lastItem = currentList.items[currentList.items.length - 1];
      if (!lastItem.children) lastItem.children = [];
      lastItem.children.push(isIndentedUl[2]);
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      flushBlockquote();
      flushTable();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push({ text: line.substring(2), children: [] });
      continue;
    }

    // Ordered List (with nested item support)
    const isIndentedOl = /^(\s{2,}|\t)\d+\.\s+(.*)/.exec(rawLine);
    if (isIndentedOl && currentList && currentList.type === 'ol' && currentList.items.length > 0) {
      const lastItem = currentList.items[currentList.items.length - 1];
      if (!lastItem.children) lastItem.children = [];
      lastItem.children.push(isIndentedOl[2]);
      continue;
    }

    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      flushParagraph();
      flushBlockquote();
      flushTable();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push({ text: numMatch[2], children: [] });
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
        continue;
      }
      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    }

    // Robust Image Matcher:
    // Matches ![alt](url) or ![alt](url "title") or ![alt | tokens](url ...)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(\s*([^\s)"']+)(?:\s+["']([^"']*)["'])?\s*\)$/);
    if (imgMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      flushTable();
      const rawAltSection = imgMatch[1] || '';
      let src = imgMatch[2];
      let inlineTitle = imgMatch[3] || '';

      // Clean src if it contains URL-encoded or raw quotes like %20%22Caption%22 or %20"Caption"
      const spaceTitleMatch = src.match(/^([^\s"']+)\s+["']([^"']*)["']$/);
      if (spaceTitleMatch) {
        src = spaceTitleMatch[1];
        if (!inlineTitle) inlineTitle = spaceTitleMatch[2];
      }

      const encodedTitleMatch = src.match(/^(.*?)(?:%20|\s+)(?:%22|")?(.*?)(?:%22|")?$/i);
      if (encodedTitleMatch && encodedTitleMatch[2]) {
        src = encodedTitleMatch[1];
        if (!inlineTitle) {
          try {
            inlineTitle = decodeURIComponent(encodedTitleMatch[2]);
          } catch {
            inlineTitle = encodedTitleMatch[2];
          }
        }
      }

      src = src.replace(/%22/g, '').replace(/["']/g, '').trim();

      let alt = rawAltSection;
      let caption = inlineTitle;
      let credit = '';
      let source = '';
      let align = 'center';
      let size = 'normal';

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
          else if (cleanKey === 'align') align = val.toLowerCase();
          else if (cleanKey === 'size') size = val.toLowerCase();
        });
      } else {
        alt = rawAltSection || 'Saudagar luxury real estate Gurugram';
        if (!caption) caption = alt;
      }

      elements.push(
        <ArticleImage
          key={`img-${elements.length}`}
          src={src}
          alt={alt}
          caption={caption}
          credit={credit}
          source={source}
          align={align}
          size={size}
          sizes="(max-width: 768px) 100vw, 850px"
        />
      );
      continue;
    }

    // If a line contains an embedded image inside paragraph text, separate it into clean blocks
    if (line.includes('![') && line.includes('](')) {
      const inlineImgRegex = /!\[([^\]]*)\]\(\s*([^\s)"']+)(?:\s+["']([^"']*)["'])?\s*\)/g;
      let pLastIndex = 0;
      let pMatch;
      let hasEmbedded = false;

      while ((pMatch = inlineImgRegex.exec(line)) !== null) {
        hasEmbedded = true;
        const textBefore = line.substring(pLastIndex, pMatch.index).trim();
        if (textBefore) {
          currentParagraph.push(textBefore);
          flushParagraph();
        }

        const rawAltSection = pMatch[1] || '';
        let src = pMatch[2];
        let inlineTitle = pMatch[3] || '';

        const spaceTitleMatch = src.match(/^([^\s"']+)\s+["']([^"']*)["']$/);
        if (spaceTitleMatch) {
          src = spaceTitleMatch[1];
          if (!inlineTitle) inlineTitle = spaceTitleMatch[2];
        }

        const encodedTitleMatch = src.match(/^(.*?)(?:%20|\s+)(?:%22|")?(.*?)(?:%22|")?$/i);
        if (encodedTitleMatch && encodedTitleMatch[2]) {
          src = encodedTitleMatch[1];
          if (!inlineTitle) {
            try {
              inlineTitle = decodeURIComponent(encodedTitleMatch[2]);
            } catch {
              inlineTitle = encodedTitleMatch[2];
            }
          }
        }

        src = src.replace(/%22/g, '').replace(/["']/g, '').trim();

        elements.push(
          <ArticleImage
            key={`img-inline-${elements.length}`}
            src={src}
            alt={rawAltSection || 'Saudagar luxury real estate'}
            caption={inlineTitle || rawAltSection}
            sizes="(max-width: 768px) 100vw, 850px"
          />
        );

        pLastIndex = pMatch.index + pMatch[0].length;
      }

      if (hasEmbedded) {
        const textAfter = line.substring(pLastIndex).trim();
        if (textAfter) {
          currentParagraph.push(textAfter);
        }
        continue;
      }
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

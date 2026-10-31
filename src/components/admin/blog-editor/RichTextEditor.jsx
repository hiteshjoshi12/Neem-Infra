"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import { Table as TiptapTable } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link2,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Table,
  Minus,
  Image as ImageIcon,
  Video,
  Plus,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Upload,
  RefreshCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Maximize,
  SlidersHorizontal,
  Trash2,
  X
} from 'lucide-react';

import ImageInsertModal from './ImageInsertModal';
import InternalLinkPickerModal from './InternalLinkPickerModal';
// Custom Image Extension supporting full-width centered block presentation
const CustomImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: () => 'center',
        renderHTML: () => {
          return {
            'data-align': 'center',
            class: 'align-center block mx-auto my-8 w-full max-w-4xl rounded-2xl border border-white/10 shadow-lg cursor-pointer transition-all hover:ring-2 hover:ring-brand-gold'
          };
        }
      },
      size: {
        default: 'full',
        parseHTML: () => 'full',
        renderHTML: () => {
          return { 'data-size': 'full' };
        }
      }
    };
  }
});


export default function RichTextEditor({
  content = '',
  onChange,
  onImageUpload,
  publishedBlogs = [],
  properties = [],
  isRawMarkdown = false
}) {
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState('');
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });

  // Modals
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedLinkText, setSelectedLinkText] = useState('');
  const [isUploadingDrop, setIsUploadingDrop] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editImageModalData, setEditImageModalData] = useState(null);

  const editorContainerRef = useRef(null);

  // Initialize Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4]
        },
        codeBlock: false,
        link: false,
        underline: false
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-gold underline underline-offset-4 cursor-pointer',
        }
      }),
      CustomImage.configure({
        allowBase64: true,
        inline: false
      }),
      TiptapTable.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse w-full my-6 text-sm border border-white/15',
        }
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-white/20 p-2.5 bg-white/10 font-bold text-left',
        }
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-white/10 p-2.5 align-top',
        }
      }),
      Placeholder.configure({
        placeholder: 'Write your luxury real estate article here... Type "/" for blocks or drop images anywhere.',
        emptyEditorClass: 'is-editor-empty before:text-slate-500 before:content-[attr(data-placeholder)] before:float-left before:pointer-events-none before:h-0',
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      })
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] text-slate-200 text-base leading-relaxed',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            handleDirectImageUpload(file, coordinates ? coordinates.pos : null);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, slice) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files.length > 0) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleDirectImageUpload(file, null);
            return true;
          }
        }
        return false;
      },
      handleDOMEvents: {
        click: (view, event) => {
          const target = event.target;
          if (target && target.nodeName === 'IMG') {
            const src = target.getAttribute('src');
            const alt = target.getAttribute('alt');
            const title = target.getAttribute('title');
            const align = target.getAttribute('data-align') || 'center';
            const parsed = parseImageAttributes({ src, alt, title, 'data-align': align });
            setSelectedImage(parsed);
          }
        },
        dblclick: (view, event) => {
          const target = event.target;
          if (target && target.nodeName === 'IMG') {
            event.preventDefault();
            const src = target.getAttribute('src');
            const alt = target.getAttribute('alt');
            const title = target.getAttribute('title');
            const align = target.getAttribute('data-align') || 'center';
            const parsed = parseImageAttributes({ src, alt, title, 'data-align': align });
            setSelectedImage(parsed);
            setEditImageModalData(parsed);
            setImageModalOpen(true);
            return true;
          }
          return false;
        }
      }
    },
    onSelectionUpdate: ({ editor }) => {
      if (editor.isActive('image')) {
        const attrs = editor.getAttributes('image');
        setSelectedImage(parseImageAttributes(attrs));
      } else {
        setSelectedImage(null);
      }
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        const markdown = editor.storage.markdown ? editor.storage.markdown.getMarkdown() : editor.getText();
        onChange(markdown);
      }
    },
    onTransaction: ({ editor }) => {
      if (editor.isActive('image')) {
        const attrs = editor.getAttributes('image');
        setSelectedImage(parseImageAttributes(attrs));
      }
      if (onChange) {
        const markdown = editor.storage.markdown ? editor.storage.markdown.getMarkdown() : editor.getText();
        onChange(markdown);
      }
    }
  });

  const initializedRef = useRef(false);
  const prevRawRef = useRef(isRawMarkdown);

  // Attach editor to window for testing / direct access
  useEffect(() => {
    if (typeof window !== 'undefined' && editor) {
      window.__TIPTAP_EDITOR__ = editor;
    }
  }, [editor]);

  // Initialize editor content once when loaded
  useEffect(() => {
    if (editor && !initializedRef.current && content) {
      editor.commands.setContent(content, false);
      initializedRef.current = true;
    }
  }, [content, editor]);

  // When user toggles from raw markdown mode back to visual editor, sync content
  useEffect(() => {
    if (prevRawRef.current && !isRawMarkdown && editor) {
      editor.commands.setContent(content || '', false);
    }
    prevRawRef.current = isRawMarkdown;
  }, [isRawMarkdown, content, editor]);

  // Direct Image Upload for Drag-and-Drop and Clipboard Paste
  const handleDirectImageUpload = async (file, insertPos = null) => {
    if (!file) return;
    try {
      setIsUploadingDrop(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', '/saudagar-properties/blogs');
      formData.append('altText', file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));

      const token = typeof window !== 'undefined' ? localStorage.getItem('saudagar_admin_token') : null;
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      const data = await res.json();

      if (data.success && data.url) {
        const alt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        let cleanUrl = String(data.url).trim().replace(/(?:%20|\s+)(?:%22|")?[^"%'`]*(?:%22|")?$/i, '').replace(/%22/g, '').replace(/["']/g, '').trim();
        if (editor) {
          if (insertPos !== null) {
            editor.chain().focus().setTextSelection(insertPos).setImage({ src: cleanUrl, alt, align: 'center', size: 'full' }).createParagraphNear().focus('end').run();
          } else {
            editor.chain().focus().setImage({ src: cleanUrl, alt, align: 'center', size: 'full' }).createParagraphNear().focus('end').run();
          }
        }
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('Direct upload error:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploadingDrop(false);
    }
  };

  // Helper to parse image alt tokens
  const parseImageAttributes = useCallback((attrs) => {
    if (!attrs) return null;
    const rawAlt = attrs.alt || '';
    let parsedAlt = rawAlt;
    let parsedCaption = attrs.title || '';
    let parsedCredit = '';
    let parsedAlign = 'center';
    let parsedSize = 'full';

    if (rawAlt.includes('|')) {
      const tokens = rawAlt.split('|').map(t => t.trim());
      parsedAlt = tokens[0] || '';
      tokens.slice(1).forEach(token => {
        const [key, ...valParts] = token.split(':');
        const val = valParts.join(':').trim();
        const cleanKey = key.trim().toLowerCase();
        if (cleanKey === 'caption') parsedCaption = val;
        else if (cleanKey === 'credit') parsedCredit = val;
      });
    }

    let cleanSrc = attrs.src || '';
    const spaceTitleMatch = cleanSrc.match(/^([^\s"']+)\s+["']([^"']*)["']$/);
    if (spaceTitleMatch) {
      cleanSrc = spaceTitleMatch[1];
      if (!parsedCaption) parsedCaption = spaceTitleMatch[2];
    }
    const encodedTitleMatch = cleanSrc.match(/^(.*?)(?:%20|\s+)(?:%22|")?(.*?)(?:%22|")?$/i);
    if (encodedTitleMatch && encodedTitleMatch[2]) {
      cleanSrc = encodedTitleMatch[1];
      if (!parsedCaption) {
        try {
          parsedCaption = decodeURIComponent(encodedTitleMatch[2]);
        } catch {
          parsedCaption = encodedTitleMatch[2];
        }
      }
    }
    cleanSrc = cleanSrc.replace(/%22/g, '').replace(/["']/g, '').trim();

    return {
      src: cleanSrc,
      alt: parsedAlt,
      caption: parsedCaption,
      credit: parsedCredit,
      align: 'center',
      size: 'full'
    };
  }, []);

  // Insert or update image from structured modal
  const handleInsertOrUpdateImage = ({ src, alt, caption, credit, align, size }) => {
    if (!editor || !src) return;

    let cleanSrc = String(src).trim().replace(/(?:%20|\s+)(?:%22|")?[^"%'`]*(?:%22|")?$/i, '').replace(/%22/g, '').replace(/["']/g, '').trim();

    let altTokens = alt || 'Saudagar luxury real estate Gurugram';
    const metaParts = [];
    if (caption && caption !== alt) metaParts.push(`caption: ${caption}`);
    if (credit) metaParts.push(`credit: ${credit}`);

    if (metaParts.length > 0) {
      altTokens = `${altTokens} | ${metaParts.join(' | ')}`;
    }

    if (editImageModalData) {
      // Update existing image attributes in place without setting title in URL
      editor.chain().focus().updateAttributes('image', {
        src: cleanSrc,
        alt: altTokens,
        title: null,
        align: 'center',
        size: 'full'
      }).run();
      setSelectedImage({
        src: cleanSrc,
        alt: alt || 'Saudagar luxury real estate Gurugram',
        caption,
        credit,
        align: 'center',
        size: 'full'
      });
      setEditImageModalData(null);
    } else {
      editor.chain().focus().setImage({
        src: cleanSrc,
        alt: altTokens,
        title: null,
        align: 'center',
        size: 'full'
      }).createParagraphNear().focus('end').run();
    }
  };

  // Quick alignment updater from floating toolbar
  const handleQuickAlign = (newAlign) => {
    if (!editor || !selectedImage) return;
    const metaParts = [];
    if (selectedImage.caption && selectedImage.caption !== selectedImage.alt) metaParts.push(`caption: ${selectedImage.caption}`);
    if (selectedImage.credit) metaParts.push(`credit: ${selectedImage.credit}`);
    if (newAlign && newAlign !== 'center') metaParts.push(`align: ${newAlign}`);
    if (selectedImage.size && selectedImage.size !== 'normal') metaParts.push(`size: ${selectedImage.size}`);

    let altTokens = selectedImage.alt;
    if (metaParts.length > 0) {
      altTokens = `${selectedImage.alt} | ${metaParts.join(' | ')}`;
    }

    editor.chain().focus().updateAttributes('image', {
      align: newAlign,
      alt: altTokens
    }).run();

    setSelectedImage(prev => prev ? { ...prev, align: newAlign } : null);
  };

  // Delete currently selected image
  const handleDeleteImage = () => {
    if (!editor) return;
    editor.chain().focus().deleteSelection().run();
    setSelectedImage(null);
  };

  // Open Link Picker
  const handleOpenLinkModal = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    setSelectedLinkText(selectedText);
    setLinkModalOpen(true);
  };

  // Apply Link from Picker
  const handleApplyLink = ({ url, text, openInNewTab, isNofollow }) => {
    if (!editor || !url) return;

    if (text && (!editor.state.selection || editor.state.selection.empty)) {
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({
        href: url,
        target: openInNewTab ? '_blank' : undefined,
        rel: isNofollow ? 'nofollow noopener noreferrer' : (openInNewTab ? 'noopener noreferrer' : undefined)
      }).run();
    }
  };

  // Insert Callout block
  const handleInsertCallout = (type = 'tip') => {
    if (!editor) return;
    if (type === 'warning') {
      editor.chain().focus().setBlockquote().insertContent('⚠️ **Statutory Due Diligence Notice:** Ensure title verification before registry.').run();
    } else {
      editor.chain().focus().setBlockquote().insertContent('💡 **Market Intelligence Takeaway:** DLF builder floors show consistent high appreciation.').run();
    }
    setSlashMenuOpen(false);
  };

  // Insert Table
  const handleInsertTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setSlashMenuOpen(false);
  };

  // Insert YouTube Embed
  const handleInsertYoutube = () => {
    const url = prompt('Enter YouTube Video URL (e.g., https://www.youtube.com/watch?v=...):');
    if (!url) return;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (match && editor) {
      const videoId = match[1];
      const videoUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
      // In Markdown, insert standalone YouTube URL on its own line
      editor.chain().focus().insertContent(`\n\nhttps://www.youtube.com/watch?v=${videoId}\n\n`).run();
    } else {
      alert('Invalid YouTube URL');
    }
    setSlashMenuOpen(false);
  };

  if (isRawMarkdown) {
    return (
      <div className="w-full">
        <textarea
          value={content || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="Type raw Markdown here..."
          rows={24}
          className="w-full p-6 rounded-2xl bg-[#090D18] border border-white/10 text-slate-200 font-mono text-sm leading-relaxed focus:border-brand-gold outline-none resize-y"
        />
      </div>
    );
  }

  return (
    <div ref={editorContainerRef} className="relative w-full">
      {/* Floating Toolbar Header */}
      <div className="sticky top-20 z-20 mb-4 p-2 bg-[#10172A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg flex flex-wrap items-center gap-1">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${editor?.isActive('heading', { level: 2 }) ? 'bg-brand-gold text-brand-navy-deep' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Heading 2 (H2)"
        >
          <Heading2 size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${editor?.isActive('heading', { level: 3 }) ? 'bg-brand-gold text-brand-navy-deep' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Heading 3 (H3)"
        >
          <Heading3 size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${editor?.isActive('heading', { level: 4 }) ? 'bg-brand-gold text-brand-navy-deep' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Heading 4 (H4)"
        >
          <Heading4 size={16} />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Inline Formatting */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive('bold') ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive('italic') ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive('underline') ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive('strike') ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleCode().run()}
          className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive('code') ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Inline Code"
        >
          <Code size={16} />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={handleOpenLinkModal}
          className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive('link') ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Insert Link (Ctrl+K)"
        >
          <Link2 size={16} />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive('bulletList') ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Bullet List (- item)"
        >
          <List size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive('orderedList') ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Numbered List (1. item)"
        >
          <ListOrdered size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive('blockquote') ? 'bg-brand-gold text-brand-navy-deep font-bold' : 'text-slate-300 hover:bg-white/10'
            }`}
          title="Blockquote (> quote)"
        >
          <Quote size={16} />
        </button>

        <button
          type="button"
          onClick={handleInsertTable}
          className="p-2 rounded-lg text-xs text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
          title="Insert Table (3x3)"
        >
          <Table size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded-lg text-xs text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
          title="Divider Line (---)"
        >
          <Minus size={16} />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1" />

        {/* Exact-Cursor Image Insertion */}
        <button
          type="button"
          onClick={() => setImageModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/30 text-brand-gold text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Upload or Insert Image at Cursor"
        >
          <ImageIcon size={15} />
          <span>Insert Image</span>
        </button>

        {/* Video Embed */}
        <button
          type="button"
          onClick={handleInsertYoutube}
          className="p-2 rounded-lg text-xs text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
          title="Embed YouTube Video"
        >
          <Video size={16} />
        </button>

        {/* Drop uploading indicator */}
        {isUploadingDrop && (
          <div className="flex items-center gap-1.5 ml-auto text-xs text-brand-gold animate-pulse">
            <RefreshCw size={13} className="animate-spin" />
            <span>Uploading dropped image...</span>
          </div>
        )}
      </div>

      {/* Persistent Floating Image Action Dock (Visible at ANY scroll position when an image is clicked) */}
      {selectedImage && (
        <div className="fixed bottom-20 right-6 z-50 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0C1222]/98 border-2 border-brand-gold rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-serif font-bold text-brand-gold tracking-wide">Image Selected</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-brand-gold/15 text-brand-gold border border-brand-gold/30">Full Center</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono truncate max-w-[200px] sm:max-w-xs">
                {selectedImage.caption || selectedImage.alt || selectedImage.src.slice(-30)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Edit Image Details Button */}
            <button
              type="button"
              onClick={() => {
                setEditImageModalData(selectedImage);
                setImageModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-brand-gold text-brand-navy-deep font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md cursor-pointer"
              title="Edit Image Details, Caption, Alt Text or Source"
            >
              <SlidersHorizontal size={14} />
              <span>Edit Image Details</span>
            </button>

            {/* Delete Image */}
            <button
              type="button"
              onClick={handleDeleteImage}
              className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Remove Image from Article"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Delete</span>
            </button>

            {/* Deselect / Close */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Deselect Image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Editor Main Canvas */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0B101E] border border-white/10 shadow-xl min-h-[600px] focus-within:border-brand-gold/40 transition-colors">
        <EditorContent editor={editor} />
      </div>

      {/* Image Modal */}
      <ImageInsertModal
        isOpen={imageModalOpen}
        onClose={() => {
          setImageModalOpen(false);
          setEditImageModalData(null);
        }}
        onInsert={handleInsertOrUpdateImage}
        initialData={editImageModalData}
      />

      {/* Link Picker Modal */}
      <InternalLinkPickerModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onInsert={handleApplyLink}
        initialText={selectedLinkText}
        publishedBlogs={publishedBlogs}
        properties={properties}
      />
    </div>
  );
}


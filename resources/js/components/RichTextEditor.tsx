/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions, jsx-a11y/aria-role, jsx-a11y/interactive-supports-focus */
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Quote, Link as LinkIcon, Undo, Redo, Image, Upload, Move3D } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorButton { icon: any; cmd: string; title: string; value?: string }
interface RichTextEditorProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly label?: string;
  readonly id?: string;
  readonly minimal?: boolean;          // tampilkan toolbar minimal
  readonly showWordCount?: boolean;    // tampilkan jumlah kata
  readonly sanitize?: boolean;         // sanitasi HTML sebelum emit
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Tulis isi artikel di sini...',
  className = '',
  label = 'Konten Artikel',
  id = 'konten',
  minimal = false,
  showWordCount = true,
  sanitize = true
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUpdatingRef = useRef(false);
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);

  const updateActiveStates = useCallback(() => {
    if (!editorRef.current) return;
    /* eslint-disable deprecation/deprecation */
    const states = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState('justifyRight')
    };
    /* eslint-enable deprecation/deprecation */
    setActiveStates(states);
  }, []);

  // initial hydrate
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // image manipulation listeners
  useEffect(() => {
    function cycleWidth(img: HTMLImageElement) {
      const sizes = ['25%', '50%', '75%', '100%'];
      const current = img.style.width || '100%';
      const idx = sizes.indexOf(current);
      img.style.width = sizes[(idx + 1) % sizes.length];
    }
    const handleEditorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
        const img = target as HTMLImageElement;
        setSelectedImage(img);
        const now = Date.now();
        const last = img.dataset.lastClick ? parseInt(img.dataset.lastClick) : 0;
        const dbl = now - last < 300;
        if (dbl) emitChange();
        if (dbl) cycleWidth(img);
        img.dataset.lastClick = String(now);
      } else {
        setSelectedImage(null);
      }
    };
    const setupImages = () => {
      if (!editorRef.current) return;
      editorRef.current.querySelectorAll('img').forEach(node => {
        const el = node as HTMLImageElement;
        el.style.cursor = 'pointer';
        el.style.maxWidth = '100%';
        el.style.height = 'auto';
        el.setAttribute('contenteditable', 'false');
        if (!el.style.width) el.style.width = '100%';
        if (!el.style.marginLeft && !el.style.marginRight && !el.style.float) {
          el.style.display = 'block';
          el.style.margin = '0 auto';
        }
      });
    };
    const el = editorRef.current;
    el?.addEventListener('click', handleEditorClick, true);
    setupImages();
    const observer = new MutationObserver(setupImages);
    if (el) observer.observe(el, { childList: true, subtree: true });
    return () => {
      el?.removeEventListener('click', handleEditorClick, true);
      observer.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // sanitasi html sederhana
  const sanitizeHtml = useCallback((html: string) => {
    if (!sanitize) return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script').forEach(s => s.remove());
    doc.querySelectorAll('*').forEach(el => {
      [...el.attributes].forEach(attr => {
        if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
      });
    });
    return doc.body.innerHTML;
  }, [sanitize]);

  const emitChange = () => {
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    html = sanitizeHtml(html);
    onChange(html);
  };

  const executeCommand = useCallback((command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    /* eslint-disable deprecation/deprecation */
    document.execCommand(command, false, value);
    /* eslint-enable deprecation/deprecation */
    isUpdatingRef.current = true;
    emitChange();
    setTimeout(() => { updateActiveStates(); isUpdatingRef.current = false; }, 10);
  }, [updateActiveStates]);

  const handleInput = useCallback(() => {
    if (!editorRef.current || isUpdatingRef.current) return;
    isUpdatingRef.current = true;
    emitChange();
    setTimeout(() => { updateActiveStates(); isUpdatingRef.current = false; }, 10);
  }, [updateActiveStates]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    /* eslint-disable deprecation/deprecation */
    document.execCommand('insertText', false, text);
    /* eslint-enable deprecation/deprecation */
    emitChange();
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { alert('Pilih file gambar'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      if (!editorRef.current) return;
      editorRef.current.focus();
      const img = document.createElement('img');
      img.src = result;
      img.style.width = '100%';
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.cursor = 'pointer';
      img.style.display = 'block';
      img.style.margin = '0 auto 10px';
      img.setAttribute('contenteditable', 'false');
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const r = sel.getRangeAt(0);
        r.deleteContents();
        r.insertNode(img);
        r.setStartAfter(img);
        r.setEndAfter(img);
        sel.removeAllRanges();
        sel.addRange(r);
      } else {
        editorRef.current.appendChild(img);
      }
      setTimeout(emitChange, 10);
    };
    reader.readAsDataURL(file);
  }, []);
  const handleFileSelect = useCallback(() => fileInputRef.current?.click(), []);
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const imgFile = files.find(f => f.type.startsWith('image/'));
    if (imgFile) handleImageUpload(imgFile);
  }, [handleImageUpload]);

  const alignImage = useCallback((align: 'left' | 'center' | 'right') => {
    if (!selectedImage) return;
    selectedImage.style.float = '';
    selectedImage.style.margin = '';
    selectedImage.style.display = '';
    if (align === 'left') {
      selectedImage.style.float = 'left';
      selectedImage.style.margin = '0 15px 10px 0';
    } else if (align === 'center') {
      selectedImage.style.display = 'block';
      selectedImage.style.margin = '0 auto 10px';
    } else {
      selectedImage.style.float = 'right';
      selectedImage.style.margin = '0 0 10px 15px';
    }
    emitChange();
  }, []);

  const insertLink = useCallback(() => { const url = prompt('Masukkan URL:'); if (url) executeCommand('createLink', url); }, [executeCommand]);
  const handleHeadingChange = useCallback((v: string) => { executeCommand('formatBlock', v === 'p' ? 'div' : v); }, [executeCommand]);

  const fullButtons: EditorButton[] = [
    { icon: Bold, cmd: 'bold', title: 'Bold' },
    { icon: Italic, cmd: 'italic', title: 'Italic' },
    { icon: Underline, cmd: 'underline', title: 'Underline' },
    { icon: List, cmd: 'insertUnorderedList', title: 'Bullet' },
    { icon: ListOrdered, cmd: 'insertOrderedList', title: 'Numbered' },
    { icon: AlignLeft, cmd: 'justifyLeft', title: 'Left' },
    { icon: AlignCenter, cmd: 'justifyCenter', title: 'Center' },
    { icon: AlignRight, cmd: 'justifyRight', title: 'Right' },
    { icon: Quote, cmd: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: Undo, cmd: 'undo', title: 'Undo' },
    { icon: Redo, cmd: 'redo', title: 'Redo' }
  ];
  const minimalButtons: EditorButton[] = [
    { icon: Bold, cmd: 'bold', title: 'Bold' },
    { icon: Italic, cmd: 'italic', title: 'Italic' },
    { icon: Underline, cmd: 'underline', title: 'Underline' }
  ];
  const buttons = minimal ? minimalButtons : fullButtons;
  const wordCount = showWordCount ? value.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="border rounded-md overflow-hidden relative">
        <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1 items-center">
          {!minimal && (
            <Select onValueChange={handleHeadingChange}>
              <SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="Normal" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="div">Normal</SelectItem>
                <SelectItem value="h1">Heading 1</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
              </SelectContent>
            </Select>
          )}
          {!minimal && <div className="w-px bg-border mx-1" />}
          {buttons.map(({ icon: Icon, cmd, value, title }) => (
            <Button
              key={cmd + title}
              type="button"
              variant={activeStates[cmd] ? 'default' : 'ghost'}
              size="sm"
              className={cn('h-8 w-8 p-0', activeStates[cmd] ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-accent')}
              title={title}
              onClick={() => executeCommand(cmd, value)}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
          {!minimal && <div className="w-px bg-border mx-1" />}
          {!minimal && (
            <>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent" title="Upload Image" onClick={handleFileSelect}><Image className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent" title="Insert Link" onClick={insertLink}><LinkIcon className="h-4 w-4" /></Button>
            </>
          )}
        </div>
        {selectedImage && !minimal && (
          <div className="border-b bg-blue-50/50 p-2 flex gap-1 items-center text-xs">
            <span className="font-medium text-blue-700 flex items-center gap-1"><Move3D className="h-3 w-3" />Posisi:</span>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-blue-100" onClick={() => alignImage('left')}>Kiri</Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-blue-100" onClick={() => alignImage('center')}>Tengah</Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-blue-100" onClick={() => alignImage('right')}>Kanan</Button>
            <span className="ml-2 text-blue-600">Double-click gambar untuk ubah ukuran</span>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <div
          ref={editorRef}
          contentEditable
          aria-label={label}
          suppressContentEditableWarning
          className={cn(
            'min-h-[240px] w-full p-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 prose prose-sm max-w-none',
            '[&_p]:my-2 [&_div]:my-2',
            '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4',
            '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-3',
            '[&_h3]:text-lg [&_h3]:font-medium [&_h3]:my-2',
            '[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2',
            '[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2',
            '[&_li]:my-1',
            '[&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-muted-foreground',
            '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
            '[&_strong]:font-bold [&_em]:italic [&_u]:underline',
            '[&_img]:rounded-md [&_img]:shadow-sm [&_img]:border [&_img]:border-border',
            '[&_img:hover]:shadow-md [&_img:hover]:border-primary/50',
            'empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none',
            isDragOver && 'ring-2 ring-primary ring-offset-2 bg-primary/5'
          )}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyUp={updateActiveStates}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-placeholder={placeholder}
        />
        {isDragOver && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-md flex items-center justify-center pointer-events-none">
            <div className="bg-background/90 rounded-lg p-4 shadow-lg">
              <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium text-primary">Drop image here</p>
            </div>
          </div>
        )}
        {showWordCount && (
          <div className="absolute bottom-1 right-2 text-[10px] text-muted-foreground select-none">
            {wordCount} kata
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Gunakan toolbar untuk memformat. Ctrl+B/I/U untuk bold/italic/underline. Drag & drop gambar ke editor.</p>
    </div>
  );
}

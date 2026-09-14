import { useState, useRef, useEffect, useCallback } from 'react';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import FormatClearOutlinedIcon from '@mui/icons-material/FormatClearOutlined';

export const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Add role requirements, qualifications, or key responsibilities...',
  minHeight = '140px',
  className = '',
}) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  });
  const [isEmpty, setIsEmpty] = useState(true);

  const checkEmpty = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText?.trim() || '';
    setIsEmpty(text.length === 0 && !editorRef.current.querySelector('img, ul, ol, li'));
  }, []);

  // Sync incoming value to editor content if changed externally
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
        checkEmpty();
      }
    }
  }, [value, checkEmpty]);

  const updateActiveFormats = useCallback(() => {
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
      });
    } catch {
      // queryCommandState may fail if editor has no focus
    }
    checkEmpty();
  }, []);

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const cleanHtml = html === '<p><br></p>' || html === '<br>' ? '' : html;
    checkEmpty();
    if (onChange) {
      onChange(cleanHtml);
    }
    updateActiveFormats();
  };

  const executeCommand = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, null);
    handleInput();
  };

  const clearFormatting = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('removeFormat', false, null);
    handleInput();
  };

  const handlePaste = (e) => {
    const html = e.clipboardData?.getData('text/html');
    if (html) {
      e.preventDefault();
      // Clean up AI and web selection artifacts
      const cleanedHtml = html
        .replace(/<span[^>]*class="[^"]*selectionAnchor[^"]*"[^>]*><\/span>/gi, '')
        .replace(/<span[^>]*class="[^"]*selectionAnchorContainer[^"]*"[^>]*>/gi, '')
        .replace(/\s*data-(start|end|section-id)="[^"]*"/gi, '')
        .replace(/\s*class="PDq2pG_[^"]*"/gi, '');
      document.execCommand('insertHTML', false, cleanedHtml);
      handleInput();
    }
  };

  return (
    <div
      className={`border border-slate-300 rounded-xl overflow-hidden bg-white transition-all focus-within:border-[#10b981] focus-within:ring-2 focus-within:ring-[#10b981]/15 ${className}`}
    >
      {/* Formatting Toolbar */}
      <div className='flex items-center flex-wrap gap-1 px-3 py-1.5 bg-slate-50 border-b border-slate-200 select-none'>
        {/* Bold */}
        <button
          type='button'
          onClick={() => executeCommand('bold')}
          title='Bold (Ctrl+B)'
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            activeFormats.bold
              ? 'bg-emerald-100/80 text-[#059669] font-bold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
          }`}
        >
          <FormatBoldOutlinedIcon sx={{ fontSize: 16 }} />
        </button>

        {/* Italic */}
        <button
          type='button'
          onClick={() => executeCommand('italic')}
          title='Italic (Ctrl+I)'
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            activeFormats.italic
              ? 'bg-emerald-100/80 text-[#059669] font-bold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
          }`}
        >
          <FormatItalicOutlinedIcon sx={{ fontSize: 16 }} />
        </button>

        {/* Underline */}
        <button
          type='button'
          onClick={() => executeCommand('underline')}
          title='Underline (Ctrl+U)'
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            activeFormats.underline
              ? 'bg-emerald-100/80 text-[#059669] font-bold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
          }`}
        >
          <FormatUnderlinedOutlinedIcon sx={{ fontSize: 16 }} />
        </button>

        <span className='w-px h-4 bg-slate-300 mx-1' />

        {/* Bulleted List */}
        <button
          type='button'
          onClick={() => executeCommand('insertUnorderedList')}
          title='Bulleted List'
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            activeFormats.insertUnorderedList
              ? 'bg-emerald-100/80 text-[#059669] font-bold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
          }`}
        >
          <FormatListBulletedOutlinedIcon sx={{ fontSize: 16 }} />
        </button>

        {/* Numbered List */}
        <button
          type='button'
          onClick={() => executeCommand('insertOrderedList')}
          title='Numbered List'
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            activeFormats.insertOrderedList
              ? 'bg-emerald-100/80 text-[#059669] font-bold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
          }`}
        >
          <FormatListNumberedOutlinedIcon sx={{ fontSize: 16 }} />
        </button>

        <span className='w-px h-4 bg-slate-300 mx-1' />

        {/* Clear Format */}
        <button
          type='button'
          onClick={clearFormatting}
          title='Clear Formatting'
          className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200/60 hover:text-rose-600 transition-colors cursor-pointer'
        >
          <FormatClearOutlinedIcon sx={{ fontSize: 16 }} />
        </button>
      </div>

      {/* Editable Container */}
      <div className='relative'>
        {isEmpty && (
          <div
            onClick={() => editorRef.current?.focus()}
            className='absolute top-3 left-3.5 right-3.5 text-xs text-slate-400 font-normal pointer-events-none select-none'
          >
            {placeholder}
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onSelect={updateActiveFormats}
          style={{ minHeight }}
          className='w-full p-3.5 text-xs text-slate-800 font-normal outline-none overflow-y-auto max-h-64 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_strong]:font-bold [&_strong]:text-slate-900 [&_em]:italic [&_u]:underline'
        />
      </div>
    </div>
  );
};

export default RichTextEditor;

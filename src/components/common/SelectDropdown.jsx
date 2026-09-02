import { useState, useRef, useEffect, useMemo } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const SelectDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  icon = null,
  disabled = false,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  variant = 'default', // 'default' | 'form' | 'compact'
  align = 'left', // 'left' | 'right'
  title = '',
  isSearchable = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to [{ value, label, subLabel, name, icon, disabled }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt), subLabel: '' };
    }
    return {
      value: opt.value ?? opt.id ?? '',
      label: opt.label ?? opt.name ?? String(opt.value ?? ''),
      subLabel: opt.subLabel || opt.email || '',
      name: opt.name || opt.label || '',
      icon: opt.icon || null,
      disabled: Boolean(opt.disabled),
    };
  });

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value) || String(opt.label) === String(value) || String(opt.name) === String(value),
  );

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
    
    if (isOpen && isSearchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSearchable]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return normalizedOptions;
    const lowerQuery = searchQuery.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        (opt.label && opt.label.toLowerCase().includes(lowerQuery)) ||
        (opt.name && opt.name.toLowerCase().includes(lowerQuery)) ||
        (opt.subLabel && opt.subLabel.toLowerCase().includes(lowerQuery))
    );
  }, [normalizedOptions, searchQuery]);

  // Variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'form':
        return 'w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs hover:border-slate-300 focus:border-[#007cc2] focus:ring-2 focus:ring-[#007cc2]/10';
      case 'compact':
        return 'h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 focus:border-[#007cc2]';
      case 'default':
      default:
        return 'h-10 px-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs focus:border-[#007cc2] focus:ring-2 focus:ring-[#007cc2]/10';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${variant === 'form' ? 'w-full' : 'inline-block'} text-left ${className}`}
    >
      {/* Trigger Button */}
      <button
        type='button'
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        title={title}
        className={`w-full flex items-center justify-between gap-2 transition-all cursor-pointer select-none outline-none ${getVariantClasses()} ${
          disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''
        } ${isOpen ? 'border-[#007cc2] ring-2 ring-[#007cc2]/10 bg-white' : ''} ${
          error ? '!border-red-500 !bg-red-50 ring-2 !ring-red-500/10' : ''
        } ${buttonClassName}`}
      >
        <div className='flex items-center gap-2 truncate min-w-0 flex-1 text-left'>
          {icon && <span className='shrink-0 flex items-center'>{icon}</span>}
          {selectedOption ? (
            selectedOption.subLabel ? (
              <div className='flex items-center justify-between w-full min-w-0 gap-2 pr-1'>
                <span className='font-bold text-slate-800 truncate'>
                  {selectedOption.name || selectedOption.label}
                </span>
                <span className='text-slate-500 font-medium text-xs truncate shrink-0'>
                  {selectedOption.subLabel}
                </span>
              </div>
            ) : (
              <span className='truncate text-slate-800 font-bold'>
                {selectedOption.label}
              </span>
            )
          ) : (
            <span className='text-slate-400 font-normal truncate'>{placeholder}</span>
          )}
        </div>

        <KeyboardArrowDownIcon
          sx={{ fontSize: 18 }}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#007cc2]' : ''
          }`}
        />
      </button>

      {/* Flyout Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } top-[calc(100%+6px)] z-50 ${
            variant === 'form' ? 'w-full min-w-full' : 'min-w-[200px]'
          } max-h-64 overflow-y-auto bg-white border border-slate-200/90 rounded-xl shadow-xl p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100 custom-scrollbar ${menuClassName}`}
        >
          {isSearchable && (
            <div className="sticky top-0 z-10 bg-white pb-1.5 mb-1 border-b border-slate-100">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#007cc2] focus:ring-1 focus:ring-[#007cc2]/20"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className='px-3 py-2 text-xs text-slate-400 font-medium text-center'>
              No options
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);

              return (
                <button
                  key={String(opt.value)}
                  type='button'
                  disabled={opt.disabled}
                  onClick={() => {
                    onChange?.(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 text-[#007cc2] font-bold'
                      : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                  } ${opt.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className='flex items-center gap-2 truncate min-w-0 flex-1'>
                    {opt.icon && (
                      <span className='shrink-0 flex items-center'>
                        {opt.icon}
                      </span>
                    )}
                    {opt.subLabel ? (
                      <div className='flex items-center justify-between w-full min-w-0 gap-3'>
                        <span className='font-bold truncate'>
                          {opt.name || opt.label}
                        </span>
                        <span
                          className={`text-xs font-normal truncate shrink-0 ${
                            isSelected
                              ? 'text-[#007cc2]/80 font-medium'
                              : 'text-slate-400'
                          }`}
                        >
                          {opt.subLabel}
                        </span>
                      </div>
                    ) : (
                      <span className='truncate'>{opt.label}</span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;

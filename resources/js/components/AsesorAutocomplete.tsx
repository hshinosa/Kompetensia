import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Loader2 } from 'lucide-react';

export interface AsesorOption {
    id: number;
    name: string;
    label: string;
    jabatan: string;
    instansi: string;
    foto_asesor_url?: string | null;
}

interface AsesorAutocompleteProps {
    value?: AsesorOption | null;
    onChange: (asesor: AsesorOption | null) => void;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    allowCreate?: boolean;
}

const AsesorAutocomplete: React.FC<AsesorAutocompleteProps> = ({
    value,
    onChange,
    error,
    placeholder = "Pilih atau ketik nama asesor...",
    disabled = false,
    required = false,
    allowCreate = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value?.name || '');
    const [options, setOptions] = useState<AsesorOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Update searchTerm when value changes from parent
    useEffect(() => {
        if (value?.name && value.name !== searchTerm) {
            setSearchTerm(value.name);
        } else if (!value && searchTerm) {
            setSearchTerm('');
        }
    }, [value?.name]);

    // Debounce search
    useEffect(() => {
        if (!searchTerm.trim() && !isOpen) return;

        const timeoutId = setTimeout(async () => {
            if (searchTerm.length === 0) {
                // Show all active asesors when input is empty
                await fetchAsesors('');
            } else if (searchTerm.length >= 1) {
                await fetchAsesors(searchTerm);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, isOpen]);

    const fetchAsesors = async (query: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/admin/asesor-search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            
            if (response.ok) {
                const data: AsesorOption[] = await response.json();
                setOptions(data);
            } else {
                setOptions([]);
            }
        } catch (error) {
            console.error('Error fetching asesors:', error);
            setOptions([]);
        }
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setSearchTerm(inputValue);
        setIsOpen(true);
        setHighlightedIndex(-1);
        
        // Only clear selection if user manually changed the input
        // Don't clear if input was programmatically set to match value
        if (value && inputValue !== value.name && inputValue.length > 0) {
            onChange(null);
        }
    };

    const handleOptionSelect = (option: AsesorOption) => {
        setSearchTerm(option.name);
        setIsOpen(false);
        setHighlightedIndex(-1);
        onChange(option);
    };

    const handleInputFocus = () => {
        setIsOpen(true);
        if (options.length === 0) {
            fetchAsesors('');
        }
    };

    const handleInputBlur = (e: React.FocusEvent) => {
        // Delay closing to allow option clicks
        setTimeout(() => {
            if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
                
                // Reset input to selected value if exists
                if (value) {
                    setSearchTerm(value.name);
                } else {
                    setSearchTerm('');
                }
            }
        }, 200);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev < options.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev > 0 ? prev - 1 : options.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < options.length) {
                    handleOptionSelect(options[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setHighlightedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    // Scroll highlighted option into view
    useEffect(() => {
        if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
            optionRefs.current[highlightedIndex]?.scrollIntoView({
                block: 'nearest',
            });
        }
    }, [highlightedIndex]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
                        w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                    `}
                    autoComplete="off"
                />
                
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown 
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                        }`} 
                    />
                </div>

                {value && (
                    <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                        <Check className="h-4 w-4 text-green-500" />
                    </div>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {loading && (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                            <div className="inline-flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mencari asesor...
                            </div>
                        </div>
                    )}

                    {!loading && options.length === 0 && searchTerm && (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                            Tidak ada asesor yang ditemukan untuk "{searchTerm}"
                        </div>
                    )}

                    {!loading && options.length === 0 && !searchTerm && (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                            Tidak ada asesor aktif
                        </div>
                    )}

                    {!loading && options.map((option, index) => (
                        <div
                            key={option.id}
                            ref={el => {
                                optionRefs.current[index] = el;
                            }}
                            onClick={() => handleOptionSelect(option)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleOptionSelect(option);
                                }
                            }}
                            className={`
                                px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0
                                transition-colors duration-150
                                ${highlightedIndex === index 
                                    ? 'bg-blue-50 text-blue-900' 
                                    : 'hover:bg-gray-50'
                                }
                                ${value?.id === option.id ? 'bg-green-50 text-green-900' : ''}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {option.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {option.jabatan} • {option.instansi}
                                    </p>
                                </div>
                                {value?.id === option.id && (
                                    <Check className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                                )}
                            </div>
                        </div>
                    ))}

                    {!loading && allowCreate && searchTerm && options.length === 0 && (
                        <div
                            onClick={() => {
                                // Kirim searchTerm sebagai nama asesor baru
                                onChange({
                                    id: -1, // temporary ID
                                    name: searchTerm,
                                    label: searchTerm,
                                    jabatan: '',
                                    instansi: '',
                                    foto_asesor_url: null
                                });
                                setIsOpen(false);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onChange({
                                        id: -1, // temporary ID
                                        name: searchTerm,
                                        label: searchTerm,
                                        jabatan: '',
                                        instansi: '',
                                        foto_asesor_url: null
                                    });
                                    setIsOpen(false);
                                }
                            }}
                            className="px-3 py-2 cursor-pointer border-t border-gray-200 hover:bg-blue-50 transition-colors duration-150"
                        >
                            <div className="flex items-center gap-2 text-blue-600">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-sm font-medium">Buat asesor baru: "{searchTerm}"</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AsesorAutocomplete;

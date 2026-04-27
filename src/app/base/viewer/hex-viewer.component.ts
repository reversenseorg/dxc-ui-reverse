import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    SimpleChanges,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nullable } from '../Nullable';

export interface HexViewerSelection {
    type: 'offset' | 'hex' | 'ascii';
    offset: number;
    length: number;
    value: Uint8Array;
}

export interface HexViewerHighlight {
    offset: number;
    length: number;
    color?: string;
    backgroundColor?: string;
    label?: string;
}

interface HexRow {
    offset: number;
    bytes: number[];
    ascii: string[];
}

@Component({
    selector: 'dxc-hex-viewer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hex-viewer.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HexViewerComponent implements OnInit, OnChanges {
    
    /**
     * Data to display (Buffer, Uint8Array, or string)
     */
    @Input() data: Nullable<Uint8Array | Buffer | string> = null;
    
    /**
     * Base address for offset display
     */
    @Input() baseAddress: number = 0;
    
    /**
     * Number of bytes per row
     */
    @Input() bytesPerRow: number = 16;
    
    /**
     * Format for offset display: 'hex' | 'decimal'
     */
    @Input() offsetFormat: 'hex' | 'decimal' = 'hex';
    
    /**
     * Width of offset field (number of digits)
     */
    @Input() offsetWidth: number = 8;
    
    /**
     * Enable selection
     */
    @Input() selectable: boolean = true;
    
    /**
     * Show header row
     */
    @Input() showHeader: boolean = true;
    
    /**
     * Show footer row
     */
    @Input() showFooter: boolean = true;
    
    /**
     * Highlights to apply
     */
    @Input() highlights: HexViewerHighlight[] = [];
    
    /**
     * Current selection
     */
    @Input() selection: Nullable<HexViewerSelection> = null;
    
    @Output() selectionChange = new EventEmitter<HexViewerSelection>();
    @Output() offsetClick = new EventEmitter<{offset: number, event: MouseEvent}>();
    @Output() byteClick = new EventEmitter<{offset: number, value: number, event: MouseEvent}>();
    @Output() asciiClick = new EventEmitter<{offset: number, char: string, event: MouseEvent}>();
    @Output() offsetContextMenu = new EventEmitter<{offset: number, event: MouseEvent}>();
    @Output() byteContextMenu = new EventEmitter<{offset: number, value: number, event: MouseEvent}>();
    @Output() asciiContextMenu = new EventEmitter<{offset: number, char: string, event: MouseEvent}>();
    
    rows: HexRow[] = [];
    private buffer: Uint8Array = new Uint8Array(0);
    private selectedBytes: Set<number> = new Set();
    
    constructor(private changeDetector: ChangeDetectorRef) {}
    
    ngOnInit(): void {
        this.parseData();
        this.buildRows();
    }
    
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            this.parseData();
            this.buildRows();
        }
        
        if (changes['baseAddress'] || changes['bytesPerRow']) {
            this.buildRows();
        }
        
        if (changes['selection']) {
            this.updateSelection();
        }
    }
    
    /**
     * Parse input data to Uint8Array
     */
    private parseData(): void {
        if (!this.data) {
            this.buffer = new Uint8Array(0);
            return;
        }
        
        if (typeof this.data === 'string') {
            // Convert string to bytes
            const encoder = new TextEncoder();
            this.buffer = encoder.encode(this.data);
        } else if (this.data instanceof Uint8Array) {
            this.buffer = this.data;
        } else if (Buffer.isBuffer(this.data)) {
            this.buffer = new Uint8Array(this.data);
        } else {
            this.buffer = new Uint8Array(0);
        }
    }
    
    /**
     * Build rows for display
     */
    private buildRows(): void {
        this.rows = [];
        
        for (let i = 0; i < this.buffer.length; i += this.bytesPerRow) {
            const bytes: number[] = [];
            const ascii: string[] = [];
            
            for (let j = 0; j < this.bytesPerRow; j++) {
                const offset = i + j;
                if (offset < this.buffer.length) {
                    const byte = this.buffer[offset];
                    bytes.push(byte);
                    ascii.push(this.byteToAscii(byte));
                } else {
                    bytes.push(null as any);
                    ascii.push(' ');
                }
            }
            
            this.rows.push({
                offset: this.baseAddress + i,
                bytes: bytes,
                ascii: ascii
            });
        }
        
        this.changeDetector.markForCheck();
    }
    
    /**
     * Convert byte to ASCII character
     */
    private byteToAscii(byte: number): string {
        if (byte >= 32 && byte <= 126) {
            return String.fromCharCode(byte);
        }
        return '.';
    }
    
    /**
     * Format byte as hex string
     */
    formatByte(byte: number): string {
        return byte.toString(16).toUpperCase().padStart(2, '0');
    }
    
    /**
     * Format offset
     */
    formatOffset(offset: number): string {
        if (this.offsetFormat === 'hex') {
            return '0x' + offset.toString(16).toUpperCase().padStart(this.offsetWidth, '0');
        }
        return offset.toString().padStart(this.offsetWidth, '0');
    }
    
    /**
     * Update selection state
     */
    private updateSelection(): void {
        this.selectedBytes.clear();
        
        if (this.selection) {
            for (let i = 0; i < this.selection.length; i++) {
                this.selectedBytes.add(this.selection.offset + i);
            }
        }
        
        this.changeDetector.markForCheck();
    }
    
    /**
     * Check if offset is selected
     */
    isOffsetSelected(offset: number): boolean {
        return this.selection != null && this.selection.offset === offset;
    }
    
    /**
     * Check if byte is selected
     */
    isByteSelected(offset: number): boolean {
        return this.selectedBytes.has(offset);
    }
    
    /**
     * Check if byte is highlighted
     */
    isByteHighlighted(offset: number): boolean {
        return this.highlights.some(h => 
            offset >= h.offset && offset < h.offset + h.length
        );
    }
    
    /**
     * Get byte color from highlights
     */
    getByteColor(offset: number): Nullable<string> {
        const highlight = this.highlights.find(h => 
            offset >= h.offset && offset < h.offset + h.length
        );
        return highlight?.color || null;
    }
    
    /**
     * Get byte background color from highlights
     */
    getByteBackgroundColor(offset: number): Nullable<string> {
        const highlight = this.highlights.find(h => 
            offset >= h.offset && offset < h.offset + h.length
        );
        return highlight?.backgroundColor || null;
    }
    
    /**
     * Handle offset click
     */
    onOffsetClick(offset: number, event: MouseEvent): void {
        if (!this.selectable) return;
        
        this.offsetClick.emit({ offset, event });
        
        // Select entire row
        const selection: HexViewerSelection = {
            type: 'offset',
            offset: offset,
            length: Math.min(this.bytesPerRow, this.buffer.length - (offset - this.baseAddress)),
            value: this.buffer.slice(offset - this.baseAddress, offset - this.baseAddress + this.bytesPerRow)
        };
        
        this.selection = selection;
        this.updateSelection();
        this.selectionChange.emit(selection);
    }
    
    /**
     * Handle byte click
     */
    onByteClick(offset: number, event: MouseEvent): void {
        if (!this.selectable) return;
        
        const bufferOffset = offset - this.baseAddress;
        const byte = this.buffer[bufferOffset];
        
        this.byteClick.emit({ offset, value: byte, event });
        
        // Single byte selection
        const selection: HexViewerSelection = {
            type: 'hex',
            offset: offset,
            length: 1,
            value: new Uint8Array([byte])
        };
        
        this.selection = selection;
        this.updateSelection();
        this.selectionChange.emit(selection);
    }
    
    /**
     * Handle ASCII click
     */
    onAsciiClick(offset: number, event: MouseEvent): void {
        if (!this.selectable) return;
        
        const bufferOffset = offset - this.baseAddress;
        const byte = this.buffer[bufferOffset];
        const char = this.byteToAscii(byte);
        
        this.asciiClick.emit({ offset, char, event });
        
        // Single byte selection
        const selection: HexViewerSelection = {
            type: 'ascii',
            offset: offset,
            length: 1,
            value: new Uint8Array([byte])
        };
        
        this.selection = selection;
        this.updateSelection();
        this.selectionChange.emit(selection);
    }
    
    /**
     * Handle offset context menu
     */
    onOffsetContextMenu(offset: number, event: MouseEvent): void {
        event.preventDefault();
        this.offsetContextMenu.emit({ offset, event });
    }
    
    /**
     * Handle byte context menu
     */
    onByteContextMenu(offset: number, byte: number, event: MouseEvent): void {
        event.preventDefault();
        if (byte === null) return;
        this.byteContextMenu.emit({ offset, value: byte, event });
    }
    
    /**
     * Handle ASCII context menu
     */
    onAsciiContextMenu(offset: number, char: string, event: MouseEvent): void {
        event.preventDefault();
        this.asciiContextMenu.emit({ offset, char, event });
    }
    
    /**
     * Public method to set highlights
     */
    setHighlights(highlights: HexViewerHighlight[]): void {
        this.highlights = highlights;
        this.changeDetector.markForCheck();
    }
    
    /**
     * Public method to clear highlights
     */
    clearHighlights(): void {
        this.highlights = [];
        this.changeDetector.markForCheck();
    }
    
    /**
     * Public method to add highlight
     */
    addHighlight(highlight: HexViewerHighlight): void {
        this.highlights.push(highlight);
        this.changeDetector.markForCheck();
    }
    
    /**
     * Public method to clear selection
     */
    clearSelection(): void {
        this.selection = null;
        this.updateSelection();
        this.selectionChange.emit(null as any);
    }
}

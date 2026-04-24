import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

export interface CodeViewerTab {
  label: string;
  language: 'java' | 'python' | 'javascript';
  code: string;
}

type MonacoEditor = {
  setValue(value: string): void;
  getValue(): string;
  updateOptions(options: Record<string, unknown>): void;
  layout(): void;
  dispose(): void;
};

declare global {
  interface Window {
    require?: {
      config(options: Record<string, unknown>): void;
      (modules: string[], callback: (monaco: any) => void): void;
    };
    monaco?: any;
  }
}

@Component({
  selector: 'app-code-viewer',
  standalone: false,
  templateUrl: './code-viewer.component.html',
  styleUrls: ['./code-viewer.component.scss']
})
export class CodeViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() tabs: CodeViewerTab[] = [];
  @Input() readonly = true;
  @Input() height = 420;

  @Output() copied = new EventEmitter<CodeViewerTab>();
  @Output() tabChanged = new EventEmitter<CodeViewerTab>();

  @ViewChild('editorHost') private editorHost?: ElementRef<HTMLElement>;

  activeIndex = 0;
  copiedLabel = '';
  loading = true;

  private editor?: MonacoEditor;
  private monaco?: any;
  private scriptLoading?: Promise<void>;

  get activeTab(): CodeViewerTab | undefined {
    return this.tabs[this.activeIndex] ?? this.tabs[0];
  }

  get editorHeight(): string {
    return `${this.height}px`;
  }

  ngAfterViewInit(): void {
    void this.createEditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabs'] && this.activeIndex >= this.tabs.length) {
      this.activeIndex = 0;
    }

    if (this.editor && this.activeTab) {
      this.editor.setValue(this.activeTab.code);
      this.monaco?.editor?.setModelLanguage(this.editorModel, this.activeTab.language);
    }
  }

  ngOnDestroy(): void {
    this.editor?.dispose();
  }

  selectTab(index: number): void {
    this.activeIndex = index;
    const tab = this.activeTab;

    if (!tab) {
      return;
    }

    if (this.editor) {
      this.editor.setValue(tab.code);
      this.monaco?.editor?.setModelLanguage(this.editorModel, tab.language);
    }

    this.tabChanged.emit(tab);
  }

  async copyActive(): Promise<void> {
    const tab = this.activeTab;
    if (!tab) {
      return;
    }

    await navigator.clipboard.writeText(tab.code);
    this.copiedLabel = tab.label;
    this.copied.emit(tab);
    window.setTimeout(() => (this.copiedLabel = ''), 1600);
  }

  private get editorModel(): unknown {
    return this.monaco?.editor?.getModels?.()[0];
  }

  private async createEditor(): Promise<void> {
    if (!this.editorHost || !this.activeTab) {
      return;
    }

    this.loading = true;
    await this.loadMonaco();

    this.monaco = window.monaco;
    this.editor = this.monaco.editor.create(this.editorHost.nativeElement, {
      value: this.activeTab.code,
      language: this.activeTab.language,
      theme: 'vs-dark',
      readOnly: this.readonly,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 13,
      lineHeight: 22,
      scrollBeyondLastLine: false,
      padding: { top: 16, bottom: 16 },
      wordWrap: 'on'
    });
    this.loading = false;
  }

  private loadMonaco(): Promise<void> {
    if (window.monaco) {
      return Promise.resolve();
    }

    if (this.scriptLoading) {
      return this.scriptLoading;
    }

    this.scriptLoading = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-monaco-loader="true"]');
      const script = existing ?? document.createElement('script');

      script.dataset['monacoLoader'] = 'true';
      script.src = 'assets/monaco/vs/loader.js';
      script.onload = () => {
        window.require?.config({ paths: { vs: 'assets/monaco/vs' } });
        window.require?.(['vs/editor/editor.main'], () => resolve());
      };
      script.onerror = () => reject(new Error('Unable to load Monaco Editor.'));

      if (!existing) {
        document.body.appendChild(script);
      }
    });

    return this.scriptLoading;
  }
}

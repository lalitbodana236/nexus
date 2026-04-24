import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  width?: string;
}

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T extends Record<string, unknown>> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() rows: T[] = [];
  @Input() trackByKey = 'id';

  @Output() rowClick = new EventEmitter<T>();

  valueFor(row: T, key: keyof T | string): unknown {
    return row[key as keyof T];
  }

  trackByRow = (_: number, row: T): unknown => row[this.trackByKey as keyof T] ?? row;
}

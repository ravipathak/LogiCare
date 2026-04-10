import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

import type { LcActionsCellColParams, LcGridAction } from './lc-grid-types';

@Component({
  selector: 'app-lc-actions-cell',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './lc-actions-cell.component.html',
  styleUrl: './lc-actions-cell.component.scss',
})
export class LcActionsCellComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  get ariaLabel(): string {
    return this.cellParams.ariaLabel ?? 'Open row actions';
  }

  private get cellParams(): LcActionsCellColParams {
    return (this.params.colDef?.cellRendererParams ?? {}) as LcActionsCellColParams;
  }

  visibleActions(): LcGridAction[] {
    const data = this.params.data;
    const src = this.cellParams.actions;
    const list = typeof src === 'function' ? src(data) : src;
    return (list ?? []).filter(a => !a.visible || a.visible(data));
  }

  run(action: LcGridAction): void {
    action.run(this.params.data);
  }
}

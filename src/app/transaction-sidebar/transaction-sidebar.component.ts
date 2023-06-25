import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
  columnsAgGrid,
} from '@yenot/yenot-api.service';

@Component({
  selector: 'app-transaction-sidebar',
  templateUrl: './transaction-sidebar.component.html',
  styleUrls: ['./transaction-sidebar.component.css'],
})
export class TransactionSidebarComponent implements OnChanges {
  @Input() transactionId: string | null = null;

  defaultColDef: any = { resizable: true, filter: 'agSetColumnFilter' };

  transactionRow: any = [];
  splits: ClientTable<any> = ClientTable.emptyTable();
  splits_columnDefs: ColDef[] = [];
  splits_rowData: any[] = [];

  constructor(public apiService: YenotApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactionId']) {
      this.loadTransaction(changes['transactionId'].currentValue);
    }
  }
  async loadTransaction(transactionId: string) {
    if (!transactionId) {
      this.transactionRow = null;
      this.splits = ClientTable.emptyTable();
      this.splits_columnDefs = columnsAgGrid(this.splits.columns);
      this.splits_rowData = this.splits.rows;
      return;
    }

    let payload = await this.apiService.get(`api/transaction/${transactionId}`);

    this.transactionRow = payload.namedTable('trans').singleton();
    this.splits = payload.namedTable('splits');

    this.splits_columnDefs = columnsAgGrid(this.splits.columns);
    this.splits_rowData = this.splits.rows;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import {
  faPenToSquare,
  faTrashCan,
  faCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
  columnsAgGrid,
} from '../yenot-api.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-finances',
  templateUrl: './finances.component.html',
  styleUrls: ['./finances.component.css'],
})
export class FinancesComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;
  faCirclePlus = faCirclePlus;

  fragment: string = '';

  preview: any = null;
  previewTransactionId: string | null = null;

  transactions: ClientTable<any> | null = null;
  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  defaultColDef: any = { resizable: true, filter: 'agSetColumnFilter' };

  splits_columnDefs: ColDef[] = [];
  splits_rowData: any[] = [];

  constructor(
    route: ActivatedRoute,
    public dialog: MatDialog,
    public apiService: YenotApiService,
    private location: Location
  ) {
    const routeParams = route.snapshot.paramMap;
    this.previewTransactionId = routeParams.get('id');
  }

  ngOnInit(): void {
    if (this.previewTransactionId) {
      this.loadPreviewTransaction(this.previewTransactionId);
    }
  }

  async onSearch() {
    let payload = await this.apiService.get('api/transactions/list', {
      query: { frag: this.fragment },
    });

    this.transactions = payload.namedTable('trans');
    this.columnDefs = columnsAgGrid(this.transactions.columns);
    this.rowData = this.transactions.rows;
  }

  async onRowClick(event: any) {
    // console.log(event);
    // console.log(event.data.entity_name);

    await this.loadPreviewTransaction(event.data.tid);
  }

  async loadPreviewTransaction(transactionId: string) {
    let payload = await this.apiService.get(`api/transaction/${transactionId}`);

    this.previewTransactionId = transactionId;

    this.preview = {};
    this.preview.transaction = payload.namedTable('trans').singleton();
    this.preview.splits = payload.namedTable('splits');

    this.splits_columnDefs = columnsAgGrid(this.preview.splits.columns);
    this.splits_rowData = this.preview.splits.rows;

    this.location.replaceState(`/transaction/${this.preview.transaction.tid}`);
  }
}

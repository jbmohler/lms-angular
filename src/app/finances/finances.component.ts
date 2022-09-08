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

  previewTransactionId: string | null = null;

  transactions: ClientTable<any> | null = null;
  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  defaultColDef: any = { resizable: true, filter: 'agSetColumnFilter' };

  constructor(
    route: ActivatedRoute,
    public dialog: MatDialog,
    public apiService: YenotApiService,
    private location: Location
  ) {
    const routeParams = route.snapshot.paramMap;
    this.previewTransactionId = routeParams.get('id');
  }

  ngOnInit(): void {}

  async onSearch() {
    let payload = await this.apiService.get('api/transactions/list', {
      query: { fragment: this.fragment },
    });

    this.transactions = payload.namedTable('trans');
    this.columnDefs = columnsAgGrid(this.transactions.columns);
    this.rowData = this.transactions.rows;
  }

  async onRowClick(event: any) {
    // console.log(event);
    // console.log(event.data.entity_name);
    this.previewTransactionId = event.data.tid;

    this.location.replaceState(`/transaction/${this.previewTransactionId}`);
  }
}

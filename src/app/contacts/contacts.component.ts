import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
  columnsAgGrid,
} from '../yenot-api.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  fragment: string = '';

  personas: ClientTable<any> | null = null;
  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  defaultColDef: any = { resizable: true, filter: 'agSetColumnFilter' };

  constructor(public apiService: YenotApiService) {}

  ngOnInit(): void {}

  async onSearch() {
    let payload = await this.apiService.get('api/personas/list', {
      query: { frag: this.fragment },
    });

    this.personas = payload.namedTable('personas');
    this.columnDefs = columnsAgGrid(this.personas.columns);
    this.rowData = this.personas.rows;
  }
}

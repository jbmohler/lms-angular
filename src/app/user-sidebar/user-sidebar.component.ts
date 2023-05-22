import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
  columnsAgGrid,
} from '../yenot-api.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css'],
})
export class UserSidebarComponent implements OnChanges {
  @Input() userId: string | null = null;

  defaultColDef: any = { resizable: true, filter: 'agSetColumnFilter' };

  userRow: any = [];
  sessions: ClientTable<any> = ClientTable.emptyTable();
  sessions_columnDefs: ColDef[] = [];
  sessions_rowData: any[] = [];

  constructor(public apiService: YenotApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId']) {
      this.loadUser(changes['userId'].currentValue);
    }
  }

  async loadUser(userId: string) {
    if (!userId) {
      this.userRow = null;
      this.sessions = ClientTable.emptyTable();
      this.sessions_columnDefs = columnsAgGrid(this.sessions.columns);
      this.sessions_rowData = this.sessions.rows;
      return;
    }

    let payload = await this.apiService.get(`api/user/${userId}`);

    this.userRow = payload.namedTable('user').singleton();
    this.sessions = payload.namedTable('sessions');

    this.sessions_columnDefs = columnsAgGrid(this.sessions.columns);
    this.sessions_rowData = this.sessions.rows;
  }
}

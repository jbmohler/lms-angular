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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;
  faCirclePlus = faCirclePlus;

  fragment: string = '';

  previewUserId: string | null = null;

  users: ClientTable<any> | null = null;
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
    const queryParams = route.snapshot.queryParamMap;
    this.previewUserId = routeParams.get('id');
    this.fragment = queryParams.get('fragment')!;
  }

  ngOnInit(): void {
    if (true) {
      this.onSearch();
    }
  }

  async onBackToSearch(event: any) {
    event.preventDefault();
    this.previewUserId = null;

    this.resetLocationState();
  }

  async onSearch() {
    let payload = await this.apiService.get('api/users/list');

    this.users = payload.namedTable('users');
    this.columnDefs = columnsAgGrid(this.users.columns);
    this.rowData = this.users.rows;
  }

  async onRowClick(event: any) {
    // console.log(event);
    // console.log(event.data.entity_name);
    this.previewUserId = event.data.id;

    this.resetLocationState();
  }

  resetLocationState() {
    let tail = '';
    if (this.fragment) {
      tail = `?fragment=${this.fragment}`;
    }
    if (this.previewUserId) {
      this.location.replaceState(`/user/${this.previewUserId}${tail}`);
    } else {
      this.location.replaceState(`/admin/${tail}`);
    }
  }
}

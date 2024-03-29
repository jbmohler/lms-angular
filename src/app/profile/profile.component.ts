import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
  columnsAgGrid,
} from '@yenot/yenot-api.service';
import { AddressEditComponent } from './address-edit/address-edit.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  addresses: ClientTable<any> = ClientTable.emptyTable();
  roles: ClientTable<any> = ClientTable.emptyTable();
  devicetokens: ClientTable<any> = ClientTable.emptyTable();

  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  defaultColDef: any = { resizable: true, filter: 'agSetColumnFilter' };

  constructor(public dialog: MatDialog, public apiService: YenotApiService) {}

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }
  async loadProfile() {
    let payload = await this.apiService.get('api/user/me');

    this.user = payload.namedTable('user').singleton();
    this.addresses = payload.namedTable('addresses');
    this.devicetokens = payload.namedTable('devicetokens');
    this.roles = payload.namedTable('roles');

    this.columnDefs = columnsAgGrid(this.devicetokens.columns);
    this.rowData = this.devicetokens.rows;
  }

  _onNewAddress(type: string) {
    let dialogRef = this.dialog.open(AddressEditComponent, {
      panelClass: 'form-edit-dialog',
      width: '100vw',
      maxWidth: '300px',
      data: { new: true, type: type },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadProfile();
    });
  }

  onNewEmail() {
    this._onNewAddress('email');
  }

  onNewPhone() {
    this._onNewAddress('phone');
  }

  onChangePassword() {
    let dialogRef = this.dialog.open(ChangePasswordComponent, {
      panelClass: 'form-edit-dialog',
      width: '100vw',
      maxWidth: '300px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadProfile();
    });
  }
}

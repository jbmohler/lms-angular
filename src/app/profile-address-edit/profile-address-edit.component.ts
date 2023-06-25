import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup, FormControl } from '@angular/forms';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
} from '@yenot/yenot-api.service';

@Component({
  selector: 'app-profile-address-edit',
  templateUrl: './profile-address-edit.component.html',
  styleUrls: ['./profile-address-edit.component.css'],
})
export class ProfileAddressEditComponent implements OnInit {
  address_id: string | undefined = undefined;
  new: boolean = false;
  addr_type: string;

  addressData: any = null;

  addressForm = new UntypedFormGroup({
    addr_type: new FormControl(''),
    address: new FormControl(''),
    is_2fa: new FormControl(''),
    is_primary: new FormControl(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfileAddressEditComponent>,
    public apiService: YenotApiService
  ) {
    this.new = data.new ?? false;
    this.addr_type = data.type ?? '';
    this.address_id = data.address_id ?? undefined;
  }

  ngOnInit(): void {}

  async onClickSave() {}
}

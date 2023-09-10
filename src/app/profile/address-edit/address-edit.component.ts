import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  UntypedFormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToolsModule } from '@uitools/tools.module';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
} from '@yenot/yenot-api.service';

@Component({
  selector: 'app-address-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToolsModule],
  templateUrl: './address-edit.component.html',
  styleUrls: ['./address-edit.component.css'],
})
export class AddressEditComponent implements OnInit {
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
    public dialogRef: MatDialogRef<AddressEditComponent>,
    public apiService: YenotApiService
  ) {
    this.new = data.new ?? false;
    this.addr_type = data.type ?? '';
    this.address_id = data.address_id ?? undefined;
  }

  ngOnInit(): void {}

  async onClickSave() {}

  onCancel() {
    this.dialogRef.close();
  }
}

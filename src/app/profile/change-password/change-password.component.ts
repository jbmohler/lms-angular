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
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToolsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  chpasswordForm = new UntypedFormGroup({
    current_password: new FormControl(''),
    new_password: new FormControl(''),
    confirm_password: new FormControl(''),
  });

  chpasswordRow: any = {
    current_password: null,
    new_password: null,
    confirm_password: null,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    public apiService: YenotApiService
  ) {}

  ngOnInit(): void {
    this.chpasswordForm.valueChanges.subscribe((value) => {
      Object.keys(value).forEach((k) => {
        if (k in this.chpasswordRow) {
          this.chpasswordRow[k] = value[k];
        }
      });
    });
  }

  async onClickSave() {
    const pwRow = this.chpasswordRow;
    if (pwRow.new_password != pwRow.confirm_password) {
      alert('new & confirm password do not match');
      return;
    }

    try {
      await this.apiService.post('api/user/me/change-password', {
        body: { oldpass: pwRow.current_password, newpass: pwRow.new_password },
      });
      this.dialogRef.close();
    } catch (e) {
      alert(e);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

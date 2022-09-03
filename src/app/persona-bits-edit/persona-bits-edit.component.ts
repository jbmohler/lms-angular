import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup, FormControl } from '@angular/forms';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
} from '../yenot-api.service';

@Component({
  selector: 'app-persona-bits-edit',
  templateUrl: './persona-bits-edit.component.html',
  styleUrls: ['./persona-bits-edit.component.css'],
})
export class PersonaBitsEditComponent implements OnInit {
  persona_id: string;
  bit_id: string | undefined = undefined;
  new: boolean = false;
  bit_type: string;

  bitData: any = null;

  bitForm = new UntypedFormGroup({
    name: new FormControl(''),
    is_primary: new FormControl(''),
    memo: new FormControl(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PersonaBitsEditComponent>,
    public apiService: YenotApiService
  ) {
    this.persona_id = data.persona_id;
    this.bit_type = data.bit_type!;
    this.new = data.new ?? false;
    this.bit_id = data.bit_id ?? undefined;
  }

  async ngOnInit(): Promise<void> {
    let controls: { [attr: string]: FormControl } = {};

    // create type specific formcontrols
    if (this.bit_type === 'urls') {
      controls = {
        url: new FormControl(''),
        username: new FormControl(''),
        password: new FormControl(''),
        pw_reset_dt: new FormControl(''),
        pw_next_reset_dt: new FormControl(''),
      };
    } else if (this.bit_type === 'email_addresses') {
      controls = { email: new FormControl('') };
    } else if (this.bit_type === 'phone_numbers') {
      controls = { number: new FormControl('') };
    } else if (this.bit_type === 'street_addresses') {
      controls = {
        address1: new FormControl(''),
        address2: new FormControl(''),
        city: new FormControl(''),
        state: new FormControl(''),
        zip: new FormControl(''),
        country: new FormControl(''),
      };
    }
    for (let attr in controls) {
      this.bitForm.addControl(attr, controls[attr]);
    }

    let payload: YenotPayload | undefined = undefined;

    if (this.new) {
      payload = await this.apiService.get(
        `api/persona/${this.persona_id}/bit/new`,
        { query: { bit_type: this.bit_type } }
      );
    } else if (this.bit_id) {
      payload = await this.apiService.get(
        `api/persona/${this.persona_id}/bit/${this.bit_id}`,
        { query: { bit_type: this.bit_type } }
      );
    }

    this.bitData = payload!.namedTable('bit').singleton();

    this.bitForm.patchValue(this.bitData, { emitEvent: false });

    this.bitForm.valueChanges.subscribe((value) => {
      Object.keys(value).forEach((k) => {
        if (k in this.bitData) {
          this.bitData[k] = value[k];
        }
      });
    });
  }

  async onClickSave() {
    try {
      await this.apiService.put(
        `api/persona/${this.persona_id}/bit/${this.bitData.id}`,
        { tables: { bit: this.bitData.$table } }
      );

      this.dialogRef.close();
    } catch {}
  }
}

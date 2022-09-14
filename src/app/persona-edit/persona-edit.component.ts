import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup, FormControl } from '@angular/forms';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
} from '../yenot-api.service';

@Component({
  selector: 'app-persona-edit',
  templateUrl: './persona-edit.component.html',
  styleUrls: ['./persona-edit.component.css'],
})
export class PersonaEditComponent implements OnInit {
  new: boolean = false;
  personaId: string | null = null;

  personaRow: any = null;

  personaForm = new UntypedFormGroup({
    corporate_entity: new FormControl(''),
    l_name: new FormControl(''),
    f_name: new FormControl(''),
    organization: new FormControl(''),
    memo: new FormControl(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PersonaEditComponent>,
    public apiService: YenotApiService
  ) {
    this.new = data.personaNew ?? false;
    this.personaId = data.personaId ?? null;
  }

  async ngOnInit(): Promise<void> {
    let payload: YenotPayload | undefined = undefined;

    if (this.new) {
      payload = await this.apiService.get(`api/persona/new`);
    } else if (this.personaId) {
      payload = await this.apiService.get(`api/persona/${this.personaId}`);
    }

    this.personaRow = payload!.namedTable('persona').singleton();
    this.personaId = this.personaRow.id!;

    this.personaRow.corporate_entity = this.personaRow.corporate_entity
      ? 'true'
      : 'false';

    this.personaForm.patchValue(this.personaRow, { emitEvent: false });

    this.personaForm.valueChanges.subscribe((value) => {
      Object.keys(value).forEach((k) => {
        if (k in this.personaRow) {
          this.personaRow[k] = value[k];
        }
      });
    });
  }

  async onClickSave() {
    this.personaRow.corporate_entity =
      this.personaRow.corporate_entity == 'true';
    if (this.personaRow.corporate_entity) {
      this.personaRow.f_name = null;
      this.personaRow.title = null;
    }

    try {
      await this.apiService.put(`api/persona/${this.personaId}`, {
        tables: { persona: this.personaRow.$table },
      });

      this.dialogRef.close({ personaId: this.personaRow.id });
    } catch {
      // this corporate_entity handling is kind of a mess
      this.personaRow.corporate_entity = this.personaRow.corporate_entity
        ? 'true'
        : 'false';
    }
  }
}

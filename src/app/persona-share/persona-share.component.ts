import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
} from '../yenot-api.service';

@Component({
  selector: 'app-persona-share',
  templateUrl: './persona-share.component.html',
  styleUrls: ['./persona-share.component.css'],
})
export class PersonaShareComponent implements OnInit {
  reown: boolean = false;
  reshare: boolean = false;

  inputType: string = '';
  personaId: string = '';

  newOwnerId: string = '';
  originalShareSet: Set<string> = new Set<string>();
  shareSet: Set<string> = new Set<string>();

  owners: ClientTable<any> = ClientTable.emptyTable();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PersonaShareComponent>,
    public apiService: YenotApiService
  ) {
    this.reown = data.reown ?? false;
    this.reshare = data.reshare ?? false;
    this.personaId = data.personaId!;

    this.inputType = this.reshare ? 'checkbox' : 'radio';
  }

  async ngOnInit(): Promise<void> {
    let payload = await this.apiService.get('api/personas/owner-list');

    this.owners = payload.namedTable('owners');

    let meId = this.apiService.authdata['userid'];
    this.owners.rows = this.owners.rows.filter((r) => r.id !== meId);

    if (this.reshare) {
      let payload = await this.apiService.get(`api/persona/${this.personaId}`);
      let personaRow = payload.namedTable('persona').singleton();

      personaRow.share_refs.forEach((x: any) => {
        this.originalShareSet.add(x.id);
        this.shareSet.add(x.id);
      });
    }
  }

  onToggleOwner(event: any, owner: any) {
    if (this.reown && event.target.checked) {
      this.newOwnerId = owner.id;
    }
    if (this.reshare) {
      if (event.target.checked) {
        this.shareSet.add(owner.id);
      } else {
        this.shareSet.delete(owner.id);
      }
    }
  }

  async onClickSave() {
    if (this.reown) {
      await this.apiService.put(`api/persona/${this.personaId}/reown`, {
        body: { owner_id: this.newOwnerId },
      });
      this.dialogRef.close();
    }
    if (this.reshare) {
      let ss1 = [...this.originalShareSet];
      let ss2 = [...this.shareSet];
      let persona = new ClientTable(
        [
          {
            id: this.personaId,
            shares: {
              add: ss2.filter((elt) => !this.originalShareSet.has(elt)),
              remove: ss1.filter((elt) => !this.shareSet.has(elt)),
            },
          },
        ],
        [
          ['id', null],
          ['shares', null],
        ]
      );

      await this.apiService.put(`api/persona/${this.personaId}/reshare`, {
        tables: { persona },
      });
      this.dialogRef.close();
    }
  }
}

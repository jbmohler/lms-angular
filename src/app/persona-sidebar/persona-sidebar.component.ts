import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import {
  faPenToSquare,
  faTrashCan,
  faCirclePlus,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
} from '../yenot-api.service';
import { MatDialog } from '@angular/material/dialog';
import { PersonaEditComponent } from '../persona-edit/persona-edit.component';
import { PersonaBitsEditComponent } from '../persona-bits-edit/persona-bits-edit.component';

@Component({
  selector: 'app-persona-sidebar',
  templateUrl: './persona-sidebar.component.html',
  styleUrls: ['./persona-sidebar.component.css'],
})
export class PersonaSidebarComponent implements OnChanges {
  @Input() personaId: string | null = null;

  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;
  faCirclePlus = faCirclePlus;
  faStar = faStar;

  personaRow: any = null;
  bits: ClientTable<any> = ClientTable.emptyTable();

  constructor(public dialog: MatDialog, public apiService: YenotApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personaId']) {
      this.loadPersona(changes['personaId'].currentValue);
    }
  }

  async loadPersona(personaId: string) {
    let payload = await this.apiService.get(`api/persona/${personaId}`);

    this.personaRow = payload.namedTable('persona').singleton();
    this.bits = payload.namedTable('bits');
  }

  onEditPersona(persona: any) {
    let dialogRef = this.dialog.open(PersonaEditComponent, {
      panelClass: 'form-edit-dialog',
      data: { personaId: persona.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadPersona(this.personaId!);
    });
  }

  async onDeletePersona(persona: any) {
    if (
      window.confirm(
        `Are you sure you want to delete the persona ${this.personaRow.entity_name}?`
      )
    ) {
      await this.apiService.delete(`api/persona/${this.personaRow.id}`);

      this.loadPersona(this.personaRow.id);
    }
  }

  _onGenericBitEdit(dlgData: any) {
    let dialogRef = this.dialog.open(PersonaBitsEditComponent, {
      panelClass: 'form-edit-dialog',
      data: dlgData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadPersona(this.personaId!);
    });
  }

  onAddBit(bit_type: string) {
    this._onGenericBitEdit({
      persona_id: this.personaRow.id,
      bit_type: bit_type,
      new: true,
    });
  }

  async onEditBit(bit: any) {
    this._onGenericBitEdit({
      persona_id: bit.persona_id,
      bit_type: bit.bit_type,
      bit_id: bit.id,
    });
  }

  async onDeleteBit(bit: any) {
    if (
      window.confirm(`Are you sure you want to delete this ${bit.bit_type}?`)
    ) {
      await this.apiService.delete(
        `api/persona/${this.personaRow.id}/bit/${bit.id}`
      );

      this.loadPersona(this.personaRow.id);
    }
  }

  copyString(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  onPasswordCopy(bit: any) {
    this.copyString(bit.bit_data.password);
  }

  formattedAddress(bit: any) {
    let d = bit.bit_data;
    let lines: any[] = [];

    lines.push(d.address1);
    lines.push(d.address2);
    lines.push([d.city, d.state, d.zip].filter(Boolean).join(' '));
    lines.push(d.country);

    return lines.filter(Boolean).join('\n');
  }
}

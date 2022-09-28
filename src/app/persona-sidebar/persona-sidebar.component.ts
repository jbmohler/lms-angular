import {
  Component,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  faPenToSquare,
  faTrashCan,
  faCirclePlus,
  faStar,
  faArrowUp,
  faArrowDown,
  faUserPlus,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
} from '../yenot-api.service';
import { MatDialog } from '@angular/material/dialog';
import { PersonaEditComponent } from '../persona-edit/persona-edit.component';
import { PersonaShareComponent } from '../persona-share/persona-share.component';
import { PersonaBitsEditComponent } from '../persona-bits-edit/persona-bits-edit.component';

type PairFunc = (i1: any, i2: any) => void;

function pairwise(arr: any[], func: PairFunc) {
  for (var i = 0; i < arr.length - 1; i++) {
    func(arr[i], arr[i + 1]);
  }
}

@Component({
  selector: 'app-persona-sidebar',
  templateUrl: './persona-sidebar.component.html',
  styleUrls: ['./persona-sidebar.component.css'],
})
export class PersonaSidebarComponent implements OnChanges {
  @Input() personaId: string | null = null;

  @Output() personaChange: EventEmitter<any> = new EventEmitter<any>();

  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;
  faCirclePlus = faCirclePlus;
  faStar = faStar;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faUserPlus = faUserPlus;
  faUserCheck = faUserCheck;

  personaRow: any = null;
  bits: ClientTable<any> = ClientTable.emptyTable();
  shares: any[] = [];

  isEditable: boolean = false;

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

    let selfId = this.apiService.authdata['userid'];
    this.isEditable = this.personaRow.owner_id === selfId;

    this.shares = this.personaRow.share_refs.filter(
      (r: any) => r.id !== this.personaRow.owner_id
    );

    pairwise(this.bits.rows, function (current, next) {
      current.bit_below = next.id;
      next.bit_above = current.id;
    });
  }

  onEditPersona(persona: any) {
    let dialogRef = this.dialog.open(PersonaEditComponent, {
      panelClass: 'form-edit-dialog',
      width: '100vw',
      maxWidth: '650px',
      data: { personaId: persona.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadPersona(this.personaId!);

      this.personaChange.emit();
    });
  }

  async onDeletePersona(persona: any) {
    if (
      window.confirm(
        `Are you sure you want to delete the persona ${this.personaRow.entity_name}?`
      )
    ) {
      await this.apiService.delete(`api/persona/${this.personaRow.id}`);

      this.personaId = null;
      this.personaRow = null;
      this.bits = ClientTable.emptyTable();

      this.personaChange.emit();
    }
  }

  async onChangeOwner(persona: any) {
    let dialogRef = this.dialog.open(PersonaShareComponent, {
      panelClass: 'form-edit-dialog',
      width: '100vw',
      maxWidth: '650px',
      data: { reown: true, personaId: this.personaId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadPersona(this.personaId!);
    });
  }

  async onSelectShare(persona: any) {
    let dialogRef = this.dialog.open(PersonaShareComponent, {
      panelClass: 'form-edit-dialog',
      width: '100vw',
      maxWidth: '650px',
      data: { reshare: true, personaId: this.personaId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadPersona(this.personaId!);
    });
  }

  _onGenericBitEdit(dlgData: any) {
    let dialogRef = this.dialog.open(PersonaBitsEditComponent, {
      panelClass: 'form-edit-dialog',
      width: '100vw',
      maxWidth: '650px',
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

  async onReorderBit(bid1: string, bid2: string) {
    await this.apiService.put(
      `api/persona/${this.personaRow.id}/bits/reorder`,
      { body: { bit_id1: bid1, bit_id2: bid2 } }
    );

    await this.loadPersona(this.personaRow.id);
  }

  async onReorderBitDown(bit: any) {
    await this.onReorderBit(bit.bit_below, bit.id);
  }

  async onReorderBitUp(bit: any) {
    await this.onReorderBit(bit.id, bit.bit_above);
  }
}

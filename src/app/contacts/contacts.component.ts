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

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;
  faCirclePlus = faCirclePlus;

  fragment: string = '';

  preview: any = null;
  previewPersonaId: string | null = null;

  personas: ClientTable<any> | null = null;
  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  defaultColDef: any = { resizable: true, filter: 'agSetColumnFilter' };

  constructor(
    route: ActivatedRoute,
    public apiService: YenotApiService,
    private location: Location
  ) {
    const routeParams = route.snapshot.paramMap;
    this.previewPersonaId = routeParams.get('id');
  }

  ngOnInit(): void {
    if (this.previewPersonaId) {
      this.reloadPreload(this.previewPersonaId);
    }
  }

  async onSearch() {
    let payload = await this.apiService.get('api/personas/list', {
      query: { frag: this.fragment },
    });

    this.personas = payload.namedTable('personas');
    this.columnDefs = columnsAgGrid(this.personas.columns);
    this.rowData = this.personas.rows;
  }

  async onRowClick(event: any) {
    // console.log(event);
    // console.log(event.data.entity_name);

    await this.reloadPreload(event.data.id);
  }

  async reloadPreload(personaId: string) {
    let payload = await this.apiService.get(`api/persona/${personaId}`);

    this.previewPersonaId = personaId;

    this.preview = {};
    this.preview.persona = payload.namedTable('persona').singleton();
    this.preview.bits = payload.namedTable('bits');

    this.location.replaceState(`/contact/${this.preview.persona.id}`);
  }

  onEditPersona(persona: any) {}

  onAddBit(type: string) {
    console.log(`adding ${type}`);
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

  async onEditBit(bit: any) {}

  async onDeleteBit(bit: any) {
    if (
      window.confirm(`Are you sure you want to delete this ${bit.bit_type}?`)
    ) {
      let persona = this.preview.persona;
      await this.apiService.delete(`api/persona/${persona.id}/bit/${bit.id}`);

      this.reloadPreload(persona.id);
    }
  }
}

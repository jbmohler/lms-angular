import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { ColDef } from 'ag-grid-community';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
  columnsAgGrid,
} from '../yenot-api.service';
import { PersonaEditComponent } from '../persona-edit/persona-edit.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  faCirclePlus = faCirclePlus;

  fragment: string = '';

  previewPersonaId: string | null = null;

  personas: ClientTable<any> | null = null;
  columnDefs: ColDef[] = [];
  rowData: any[] = [];
  defaultColDef: any = { resizable: true, filter: 'agSetColumnFilter' };

  constructor(
    route: ActivatedRoute,
    public apiService: YenotApiService,
    public dialog: MatDialog,
    private location: Location
  ) {
    const routeParams = route.snapshot.paramMap;
    this.previewPersonaId = routeParams.get('id');
  }

  ngOnInit(): void {}

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

    this.previewPersonaId = event.data.id;

    this.location.replaceState(`/contact/${event.data.id}`);
  }

  onAddPersona() {
    let dialogRef = this.dialog.open(PersonaEditComponent, {
      panelClass: 'form-edit-dialog',
      width: '100vw',
      maxWidth: '650px',
      data: { personaNew: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.previewPersonaId = result.personaId!;

        this.location.replaceState(`/contact/${result.personaId!}`);
      }
    });
  }
}

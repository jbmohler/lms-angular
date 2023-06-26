import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ColDef } from 'ag-grid-community';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
  columnsAgGrid,
} from '@yenot/yenot-api.service';
import { PersonaEditComponent } from '../persona-edit/persona-edit.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
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
    const queryParams = route.snapshot.queryParamMap;
    this.previewPersonaId = routeParams.get('id');
    this.fragment = queryParams.get('fragment')!;
  }

  ngOnInit(): void {
    if (this.fragment) {
      this.onSearch();
    }
  }

  async onSearch() {
    let payload = await this.apiService.get('api/personas/list', {
      query: { frag: this.fragment },
    });

    this.personas = payload.namedTable('personas');
    this.columnDefs = columnsAgGrid(this.personas.columns);
    this.rowData = this.personas.rows;

    this.resetLocationState();
  }

  async onRowClick(event: any) {
    // console.log(event);
    // console.log(event.data.entity_name);

    this.previewPersonaId = event.data.id;

    this.resetLocationState();
  }

  async onBackToSearch(event: any) {
    event.preventDefault();
    this.previewPersonaId = null;

    this.resetLocationState();
  }

  async onChangePersona() {
    this.onSearch();
  }

  resetLocationState() {
    let tail = '';
    if (this.fragment) {
      tail = `?fragment=${this.fragment}`;
    }
    if (this.previewPersonaId) {
      this.location.replaceState(`/contact/${this.previewPersonaId}${tail}`);
    } else {
      this.location.replaceState(`/contacts${tail}`);
    }
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

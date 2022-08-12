import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { ColumnMeta } from '../openbooks/apiclient';
import { ControlInputDef, formControlInputs } from '../openbooks/uitypes';

export class FormBinding {
  definitions: ControlInputDef[] = [];
  loading: boolean = false;

  setup(group: FormGroup, record: any) {
    for (let defn of this.definitions) {
      let control: AbstractControl;
      if (defn.type === 'postal_address') {
        let kids = {
          address1: new FormControl(),
          address2: new FormControl(),
          city: new FormControl(),
          state: new FormControl(),
          zip: new FormControl(),
          country: new FormControl(),
        };
        control = new FormGroup(kids);
        group.addControl(defn.field, control);
      } else if (defn.type === 'entity-reference') {
        let kids = { id: new FormControl(), ent_name: new FormControl() };
        control = new FormGroup(kids);
        group.addControl(defn.field, control);
      } else {
        control = new FormControl(null);
        group.addControl(defn.field, control);
      }

      control.valueChanges.subscribe((value) => {
        if (!this.loading) {
          record[defn.field] = value;
          // console.log(JSON.stringify({ [defn.field]: value }));
        }
      });
    }

    this.loading = true;
    group.patchValue(record);
    this.loading = false;
  }
}

@Injectable({
  providedIn: 'root',
})
export class OpenbooksFormsService {
  constructor() {}

  constructFormBinding(columns: ColumnMeta[]): FormBinding {
    let fb = new FormBinding();
    fb.definitions = formControlInputs(columns);
    return fb;
  }
}

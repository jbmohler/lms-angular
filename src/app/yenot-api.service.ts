import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { YenotClient, YenotPayload, ClientTable } from '../yenot/apiclient';
import {
  columnsAgGrid,
  ControlInputDef,
  formControlInputs,
} from '../yenot/uitypes';

function browser_axios_instance(): AxiosInstance {
  let http = axios.create({
    headers: {
      Accept: 'application/json',
      'X-Yenot-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  return http;
}

// re-export as sibling of YenotApiService
export { columnsAgGrid, ControlInputDef, formControlInputs };
export { YenotPayload, ClientTable };

@Injectable({
  providedIn: 'root',
})
export class YenotApiService extends YenotClient {
  public authUpdate = new Subject();

  constructor() {
    super(browser_axios_instance());

    // TODO: I was hoping to deliver the correct api location from the server
    // in case of path rewriting but this seems the best I can do for the
    // moment.
    let url = new URL(window.location.href);
    let root = url.protocol + '//' + url.hostname;
    if (root.slice(-1) != '/') {
      root += '/';
    }
    this.root = root;
  }

  override addFormHeaders(headers: any, formData: FormData) {}

  override authChange() {
    // don't have a specific value to push out other than the notification
    this.authUpdate.next(null);
  }

  // TODO push out notifications about log in/out from
  // https://angular.io/guide/component-interaction#!#bidirectional-service
}

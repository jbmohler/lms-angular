import axios, { AxiosInstance } from 'axios';
import * as FormData from 'form-data';

// TODO:  this function expanded a row as tuples to an object with keys taken
// from cols.   Since the server payload rewrite it is not necessary but
// keeping it around for now.
function rtx_table_helper(cols: any, rows: any) {
  var colcount = cols.length;
  var colnames: string[] = [];
  for (var i = 0; i < colcount; ++i) {
    colnames.push(cols[i][0]);
  }
  var results = [];
  for (var j = 0; j < rows.length; ++j) {
    var obj: { [name: string]: any } = {};
    for (var i = 0; i < colcount; ++i) {
      obj[colnames[i]] = rows[j][i];
    }
    results.push(obj);
  }
  return results;
}

// https://1loc.dev/string/convert-an-uint8-array-to-a-base64-encoded-string/

// TODO:  In a prior (python) implementation it was nice to have a client-side
// data structure interpreting the 2-tuple (attr, param-dict).
export type ColumnMeta = [string, any];

export class ClientTable<RowType> {
  rows: RowType[];
  columns: ColumnMeta[];

  constructor(rows: RowType[], columns: ColumnMeta[]) {
    this.columns = columns;

    this.rows = rows.map((r) => {
      let copy = { ...r };
      (copy as any).$table = this;
      return copy;
    });
  }

  singleton(): RowType | null {
    if (this.rows.length > 1) {
      console.log(
        `Table ${name} was requested as singleton; had ${this.rows.length} rows`
      );
      throw `Singleton ${name} had multiple rows`;
    }

    // Each row has a table reference in $table
    return this.rows[0] ?? null;
  }

  add_row(obj: any): any {
    let newRow: any = { $table: this };
    this.rows.push(newRow as RowType);

    for (const [k, v] of Object.entries(obj)) {
      newRow[k] = v;
    }

    return newRow;
  }

  tab3_to_post(): string {
    let keys = {};

    let columns: string[] = [];

    function myFilter(col: any) {
      let meta: any = col[1] ?? {};
      return meta.skip_write === undefined ? true : !meta.skip_write;
    }

    function myAppend(col: any) {
      columns.push(col[0]);
    }

    this.columns.filter(myFilter).forEach(myAppend);

    let rows: any[] = [];

    for (let row of this.rows) {
      let r: any = {};
      for (let col of columns) {
        r[col] = (row as any)[col];
      }
      rows.push(r);
    }

    let results = { columns, data: rows };
    return JSON.stringify(results);
  }
}

export class YenotPayload {
  keys: { [name: string]: any };

  constructor(keys: { [name: string]: any }) {
    this.keys = keys;
  }

  namedTableColumns(name: string): any[] {
    let columns = this.keys[name].columns;
    // TODO: consider pre-parsing this similar to ytclient.reportcore in python
    return columns;
  }

  namedTable<Type = any>(name: string): ClientTable<Type> {
    if (!this.keys[name]) {
      console.log(`Table ${name} is not in this payload`);
      throw new Error(`Table ${name} is not in this payload`);
    }
    let table = this.keys[name];
    let columns = this.namedTableColumns(name);
    // let arr = rtx_table_helper(this.keys[name][0], this.keys[name][1]);
    let arr = [...table.data];
    return new ClientTable<Type>(arr as Type[], columns);
  }

  mainTable<Type = any>(): ClientTable<Type> {
    if (!this.keys['__main_table__']) {
      console.log('There is no mainTable in this payload');
      throw new Error('There is no mainTable in this payload');
    }
    return this.namedTable<Type>(this.keys['__main_table__']);
  }
}

export class YenotError extends Error {
  errorKey: string;

  constructor(message: string, errorKey: string) {
    super(message);
    this.errorKey = errorKey;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// as discussed at https://betterprogramming.pub/named-parameters-in-typescript-e32c763d2b2e
interface GetParams {
  query?: Object;
}

interface PostParams {
  query?: Object;
  body?: Object;
  tables?: Object;
}

interface PutParams {
  query?: Object;
  body?: Object;
  tables?: Object;
}

interface DeleteParams {
  query?: Object;
}

interface AuthenticateParams {
  username?: string;
  password?: string;
  save_device_token?: boolean;
  use_device_token?: boolean;
}

interface ManagedTimerParameters {
  minutes?: number;
  seconds?: number;
}

class ManagedTimer {
  intervalSeconds: number;
  callback: Function;
  timer: any | null = null;

  constructor(callback: Function, params: ManagedTimerParameters) {
    this.callback = callback;
    if (params.seconds) {
      this.intervalSeconds = params.seconds;
    } else {
      this.intervalSeconds = params.minutes! * 60;
    }
  }

  jiggle(value: number) {
    let one_eps = Math.random() * 0.1 + 0.95;
    return value * one_eps;
  }

  start() {
    if (this.timer !== null) {
      clearInterval(this.timer);
    }

    let millis = this.jiggle(this.intervalSeconds) * 1000;
    this.timer = setInterval(() => this.callback(), millis);
  }

  clear() {
    clearInterval(this.timer);
    this.timer = null;
  }
}

export class YenotClient {
  instance: AxiosInstance;
  root: string;
  authdata: any | null;
  authRefresh: ManagedTimer;
  sessionMarginMinutes: number = 20;
  activityMap: Map<string, number> | null = null;

  constructor(instance: AxiosInstance) {
    this.instance = instance;

    this.authRefresh = new ManagedTimer(
      () => {
        this.sessionRefresh();
      },
      { minutes: 10 }
    );

    this.root = '/';
    this.authdata = this.checkAuthCache();
    this.buildActivityMap();
  }

  url(tail: string) {
    return this.root + tail;
  }

  payloadFactory(data: any): YenotPayload {
    return new YenotPayload(data);
  }

  checkAuthCache(): any {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    let results = null;
    let stored = null;
    let nowEpoch = new Date().getTime() / 1000;
    stored = localStorage.getItem('auth-data-cache');
    if (stored !== undefined && stored !== null) {
      let newAuthCache: any = JSON.parse(stored);
      if (
        newAuthCache.access_expiration !== undefined &&
        newAuthCache.access_expiration >= nowEpoch
      ) {
        // set authdata to the cache for now and re-call check
        console.log(
          `Auth cache found for ${
            (newAuthCache.access_expiration - nowEpoch) / 60
          } minutes`
        );
        results = newAuthCache;
        this.authRefresh.start();
      }
    }
    return results;
  }

  buildActivityMap() {
    if (this.authdata === null || this.authdata === undefined) {
      this.activityMap = null;
      return;
    }
    let payload = this.payloadFactory(this.authdata);
    let table: Array<any> = payload.namedTable('capabilities').rows;

    this.activityMap = new Map<string, number>();
    let x = this.activityMap;
    table.forEach(function (row) {
      x.set(row.act_name, 1);
    });
  }

  hasPermission(activity: string): boolean {
    if (this.activityMap === null) {
      return false;
    }
    console.log(`Getting perms for ${activity}`);
    return this.activityMap.get(activity) !== undefined;
  }

  async isAuthenticated(verify?: boolean): Promise<boolean> {
    if (this.authdata === null || verify) {
      try {
        const { data } = await this.instance.get(this.url('api/session/check'));

        this.applyAuth(data);
      } catch (e: any) {
        if (e.response && e.response.status === 403) {
          if (
            typeof localStorage !== 'undefined' &&
            localStorage.getItem('device-token')
          ) {
            await this.authenticate({ use_device_token: true });
            return true;
          }
          // TODO fix race condition -- how do I know that another tab didn't
          // log in while I checked in this tab?!
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('auth-data-cache');
          }
          return false;
        } else {
          throw e;
        }
      }

      // no error
      return true;
    }
    return true;
  }

  addFormHeaders(headers: any, formData: FormData) {
    // TODO -- bare typescript in the CLI requires this due to bottle parsing
    // error/confusion (?)
    headers['Content-Length'] = formData.getLengthSync();
  }

  authChange() {}

  async authenticate(params: AuthenticateParams) {
    const formData = new FormData();

    let body: any = {};
    if (params.use_device_token ?? false) {
      if (typeof localStorage === 'undefined') {
        throw new Error('localStorage is undefined; cannot use_device_token');
      }

      body['device_token'] = localStorage.getItem('device-token');
      body['username'] = localStorage.getItem('device-user');
    } else {
      body['password'] = params.password!;
      body['username'] = params.username!;
    }

    for (const [k, v] of Object.entries(body)) {
      formData.append(k, v);
    }

    let headers: any = {};
    this.addFormHeaders(headers, formData);

    let authdata: any = null;
    try {
      const { data } = await this.instance.post(
        this.url('api/session'),
        formData,
        { headers: headers }
      );
      authdata = data;
    } catch (e: any) {
      throw this._convertedOBError(e);
    }

    if (params.save_device_token ?? false) {
      if (typeof localStorage === 'undefined') {
        throw new Error('localStorage is undefined; cannot save_device_token');
      }

			console.log('saving device token');
			let payload = await this.post('api/user/me/device-token/new', {
				query: { expdays: 45 },
			});

			let token = payload.namedTable('device_token').singleton()!.token;

      // The device-token is saved to localStorage to avoid it being sent to
      // every session refresh like a cookie would be.  Perhaps we should
      // consider a special /api/device-session end-point with an http-only
      // cookie keyed to that URL-path prefix.
      localStorage.setItem('device-token', token);
      localStorage.setItem('device-user', authdata['username']);
    }

    this.applyAuth(authdata);
  }

  applyAuth(data: any) {
    this.authdata = data;
    this.buildActivityMap();

    if (typeof localStorage !== 'undefined') {
      // Save this data to window.localStorage to have immediate access to
      // permissions on full page refresh.  See also sessionRefresh.
      localStorage.setItem('auth-data-cache', JSON.stringify(data));
    }

    this.authChange();
    this.authRefresh.start();
  }

  async sessionRefresh() {
    let nowEpoch = new Date().getTime() / 1000;
    console.log(
      `Auth data good for ${
        (this.authdata.access_expiration - nowEpoch) / 60
      } minutes`
    );
    if (
      this.authdata.access_expiration >
      nowEpoch + this.sessionMarginMinutes * 60
    ) {
      console.log(`skipping auth refresh ...`);
      return;
    }

    // TODO Consider grabbing a web lock to make sure that multiple tabs/"threads"
    // do not update at the same time. Install this
    // https://www.npmjs.com/package/@types/web-locks-api
    let newAuthCache = this.checkAuthCache();
    if (
      newAuthCache !== null &&
      newAuthCache.access_expiration > nowEpoch + this.sessionMarginMinutes * 60
    ) {
      console.log(`Updating with auth cache refreshed elsewhere ...`);
      this.authdata = newAuthCache;
      return;
    }

    console.log('refreshing ...');
    const { data } = await this.instance.get(this.url('api/session/refresh'));

    this.applyAuth(data);
  }

  async logout() {
    console.log(`Logging out ${this.authdata['username']}`);

    try {
      await this.instance.put(this.url('api/session/logout'));
    } catch (e: any) {
      if (e.response!.status === 403) {
        console.log(
          `Error logging out -- ${JSON.stringify(e.response!.data[0])}`
        );
        //return false;
      }
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth-data-cache');
      localStorage.removeItem('device-token');
      localStorage.removeItem('device-user');
    }

    this.authRefresh.clear();

    this.authdata = null;
    this.authChange();
  }

  _formdataParams(formData: FormData, body: any, tables: any) {
    if (body !== undefined) {
      for (const [k, v] of Object.entries(body)) {
        formData.append(k, v);
      }
    }

    if (tables !== undefined) {
      for (const [k, v] of Object.entries(tables)) {
        let vx = v as any;
        let content: any = null;
        if ('$table' in vx) {
          content = vx.$table.tab3_to_post();
        } else {
          content = vx.tab3_to_post();
        }
        if (typeof localStorage !== 'undefined') {
          // in the brower, we need to do this
          content = new Blob([content], { type: 'application/json' });
        }
        formData.append(k, content, k);
      }
    }
  }

  _convertedOBError(e: any): any {
    const status = e.response!.status;
    if (status >= 400 && status < 500) {
      const arr: any = e.response!.data;
      if (Array.isArray(arr)) {
        const errInfo: any = e.response!.data[0];
        return new YenotError(errInfo['error-msg'], errInfo['error-key']);
      }
    }
    return e;
  }

  async get(tail: string, params?: GetParams): Promise<YenotPayload> {
    try {
      const { data } = await this.instance.get(this.url(tail), {
        params: params?.query,
      });

      return this.payloadFactory(data);
    } catch (e: any) {
      throw this._convertedOBError(e);
    }
  }

  async post(tail: string, params?: PostParams): Promise<YenotPayload> {
    const formData = new FormData();

    this._formdataParams(formData, params?.body, params?.tables);

    let headers: any = { 'Content-Type': 'multipart/form-data' };
    this.addFormHeaders(headers, formData);

    try {
      const { data } = await this.instance.post(this.url(tail), formData, {
        params: params?.query,
        headers,
      });

      return this.payloadFactory(data);
    } catch (e: any) {
      throw this._convertedOBError(e);
    }
  }

  async put(tail: string, params?: PutParams): Promise<YenotPayload> {
    const formData = new FormData();

    this._formdataParams(formData, params?.body, params?.tables);

    let headers: any = { 'Content-Type': 'multipart/form-data' };
    this.addFormHeaders(headers, formData);

    try {
      const { data } = await this.instance.put(this.url(tail), formData, {
        params: params?.query,
        headers,
      });

      return this.payloadFactory(data);
    } catch (e: any) {
      throw this._convertedOBError(e);
    }
  }

  async delete(tail: string, params?: DeleteParams): Promise<YenotPayload> {
    try {
      const { data } = await this.instance.delete(this.url(tail), {
        params: params?.query,
      });

      return this.payloadFactory(data);
    } catch (e: any) {
      throw this._convertedOBError(e);
    }
  }
}

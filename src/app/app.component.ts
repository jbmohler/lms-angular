import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { YenotApiService } from './yenot-api.service';

type AuthStatus = 'unknown' | 'yes' | 'no' | 'accepting';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'lms';

  authenticated: boolean | undefined;
  authStatus: AuthStatus = 'unknown';
  loginError: string | null = null;

  constructor(public apiService: YenotApiService, private location: Location) {
    let p = this.location.path();
    // ugly hack
    if (p.includes('user/') && p.includes('/accept')) {
      this.authStatus = 'accepting';
    }

    this.apiService.authUpdate.subscribe((value) => {
      this.updateAuthStatus(value);
    });
  }

  ngOnInit(): void {
    this.checkAuthenticated();
  }

  async updateAuthStatus(value: any) {
    this.authenticated = await this.apiService.isAuthenticated(false);
    if (await this.apiService.accepting) {
      this.authStatus = 'accepting';
    } else if (this.authenticated) {
      this.authStatus = 'yes';
    } else {
      this.authStatus = 'no';
    }
  }

  async checkAuthenticated() {
    this.authenticated = await this.apiService.isAuthenticated(true);
  }

  async onClickSubmit(data: any) {
    try {
      await this.apiService.authenticate({
        username: data.username,
        password: data.password,
        save_device_token: data.stay_logged_in,
      });
    } catch (e: any) {
      this.loginError = e.message;

      return;
    }

    this.loginError = null;
    this.authenticated = true;
  }
}

import { Component, OnInit } from '@angular/core';
import { getCookie, setCookie } from 'typescript-cookie';
import { YenotApiService } from './yenot-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'lms';

  authenticated: boolean;
  loginError: string | null = null;

  constructor(public apiService: YenotApiService) {
    this.authenticated = false;

    this.apiService.authUpdate.subscribe((value) => {
      this.updateAuthStatus(value);
    });

    this.checkAuthenticated();
  }

  ngOnInit(): void {}

  async updateAuthStatus(value: any) {
    this.authenticated = await this.apiService.isAuthenticated(false);
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

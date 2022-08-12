import { Component, OnInit } from '@angular/core';
import { getCookie, setCookie } from 'typescript-cookie';
import { YenotApiService } from './yenot-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'lms';

  authenticated: boolean;
  displayName: string;
  displayTitle: string;

  constructor(public apiService: YenotApiService) {
    this.authenticated = false;
    this.displayName = 'Pending';
    this.displayTitle = '';

    this.checkAuthenticated();
  }

  ngOnInit(): void {
    this.display_username();
  }

  async checkAuthenticated(): Promise<boolean> {
    this.authenticated = await this.apiService.isAuthenticated(true);
    return this.loggedIn();
  }

  async display_username() {
    const auth = this.apiService.authdata;
    const selfStatus = await this.apiService.refreshStatusSummary();
    if (selfStatus !== null && selfStatus.keys['emp_name']) {
      this.displayName = selfStatus.keys['emp_name'];
      this.displayTitle = selfStatus.keys['job_title'];
    } else if (auth) {
      this.displayName = auth['username'];
      this.displayTitle = 'External/System user';
    }
  }

  loggedIn(): boolean {
    return this.authenticated;
  }

  logout() {
    this.apiService.logout();
    this.authenticated = false;
  }

  onClickSubmit(data: any) {
    this.apiService.authenticate(data.username, data.password).then((value) => {
      this.authenticated = true;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { YenotApiService } from '../yenot-api.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {
  displayName: string;

  constructor(public apiService: YenotApiService) {
    this.displayName = 'Pending';
  }

  ngOnInit(): void {
    this.display_username();
  }

  async display_username() {
    const auth = this.apiService.authdata;

    if (auth) {
      this.displayName = auth['username'];
    }
  }

  hasPermission(activity: string): boolean {
    return !activity || this.apiService.hasPermission(activity);
  }

  isAuthenticated(): boolean {
    return this.apiService.authdata !== null;
  }

  async onUserLogout() {
    await this.apiService.logout();
  }
}

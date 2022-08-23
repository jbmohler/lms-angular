import { Component, OnInit } from '@angular/core';
import { YenotApiService } from '../yenot-api.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {
  constructor(public apiService: YenotApiService) {}

  ngOnInit(): void {}

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

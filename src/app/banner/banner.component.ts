import { Component, OnInit } from '@angular/core';
import { YenotApiService } from '@yenot/yenot-api.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {
  displayName: string | null = null;
  hasPermTechnical: boolean = false;
  hasRoscoe: boolean = false;

  constructor(public apiService: YenotApiService) {
    this.apiService.authUpdate.subscribe((value) => {
      this.authUpdateStatus();
    });
  }

  ngOnInit(): void {
    this.authUpdateStatus();
  }

  authUpdateStatus() {
    const auth = this.apiService.authdata;

    if (auth) {
      this.displayName = auth['username'];
      this.hasPermTechnical = this.apiService.hasPermission(
        'put_api_role_record'
      );
      this.hasRoscoe = this.apiService.hasPermission(
        'post_api_roscoe_reminder'
      );
    } else {
      this.displayName = null;
      this.hasPermTechnical = false;
      this.hasRoscoe = false;
    }
  }

  isAuthenticated(): boolean {
    return this.apiService.authdata !== null;
  }

  async onUserLogout() {
    await this.apiService.logout();
  }

  async onRoscoeSubmit() {
    alert('not yet implemented');
  }
}

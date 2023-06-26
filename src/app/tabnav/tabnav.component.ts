import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { YenotApiService } from '@yenot/yenot-api.service';

@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.component.html',
  styleUrls: ['./tabnav.component.css'],
})
export class TabnavComponent implements OnInit {
  root_active: boolean = false;
  root_visible: boolean = false;
  contact_active: boolean = false;
  contact_visible: boolean = false;
  databit_active: boolean = false;
  databit_visible: boolean = false;
  finance_active: boolean = false;
  finance_visible: boolean = false;
  reports_active: boolean = false;
  reports_visible: boolean = false;
  admin_active: boolean = false;
  admin_visible: boolean = false;
  profile_active: boolean = false;
  technical_active: boolean = false;

  toggled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService: YenotApiService
  ) {
    this.router.events.subscribe((event: any) => {
      this.routeUpdateFlags(event);
    });
    this.apiService.authUpdate.subscribe((value) => {
      this.authUpdateStatus();
    });

    this.routeUpdateFlags(null);
    this.authUpdateStatus();
  }

  routeUpdateFlags(event: any) {
    this.contact_active = this.matchesPrefix(['/contact', '/contacts']);
    this.databit_active = this.matchesPrefix(['/databit', '/databits']);
    this.finance_active = this.matchesPrefix(['/finance', '/transaction']);
    this.reports_active = this.matchesPrefix(['/reports']);
    this.admin_active = this.matchesPrefix(['/admin']);
    this.profile_active = this.matchesPrefix(['/lms/user-profile']);
    this.technical_active = this.matchesPrefix(['/lms/technical']);
  }

  matchesPrefix(prefix: string[]): boolean {
    let path = window.location.pathname;
    for (let pref of prefix) {
      if (path.startsWith(pref)) {
        return true;
      }
    }
    return false;
  }

  hasPermission(activity: string): boolean {
    return !activity || this.apiService.hasPermission(activity);
  }

  authUpdateStatus() {
    this.root_visible = true; // TODO what is this?
    this.contact_visible = this.hasPermission('get_api_personas_list');
    this.databit_visible = this.hasPermission('get_api_databits_list');
    this.finance_visible = this.hasPermission('get_api_transactions_list');
    this.admin_visible = this.hasPermission('get_api_users_list');
    this.reports_visible = true; // TODO filter by something
  }

  ngOnInit(): void {}

  toggleShowAll() {
    this.toggled = !this.toggled;
  }
}

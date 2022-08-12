import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { YenotApiService } from '../yenot-api.service';

@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.component.html',
  styleUrls: ['./tabnav.component.css'],
})
export class TabnavComponent implements OnInit {
  root_active: boolean = false;
  contact_active: boolean = false;
  databit_active: boolean = false;
  finance_active: boolean = false;
  reports_active: boolean = false;
  profile_active: boolean = false;
  technical_active: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService: YenotApiService
  ) {
    this.contact_active = this.matchesPrefix(['/contact', '/contacts']);
    this.databit_active = this.matchesPrefix(['/databit', '/databits']);
    this.finance_active = this.matchesPrefix(['/finance', '/transaction']);
    this.reports_active = this.matchesPrefix(['/reports']);
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

  ngOnInit(): void {}
}

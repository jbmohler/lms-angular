import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  YenotApiService,
  YenotPayload,
  ClientTable,
} from '../yenot-api.service';

@Component({
  selector: 'app-accept-invite',
  templateUrl: './accept-invite.component.html',
  styleUrls: ['./accept-invite.component.css'],
})
export class AcceptInviteComponent implements OnInit {
  userid: string = '';
  token: string = '';

  loginError: string = '';

  password1: string = '';
  password2: string = '';

  constructor(
    route: ActivatedRoute,
    private location: Location,
    public apiService: YenotApiService
  ) {
    const routeParams = route.snapshot.paramMap;
    const queryParams = route.snapshot.queryParamMap;
    this.userid = routeParams.get('userid')!;
    this.token = queryParams.get('token')!;

    this.apiService.accepting = true;
    this.apiService.authChange();
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.password1 !== this.password2) {
      this.loginError = 'Passwords do not match.  Re-type and try again.';
      return;
    }
    if (this.password1.length <= 4) {
      this.loginError =
        'Passwords must be at least 4 characters.  Enter a longer password.';
      return;
    }

    try {
      this.apiService.put(`api/user/${this.userid}/accept-invite`, {
        body: { token: this.token, password: this.password1 },
      });
    } catch (e: any) {
      this.loginError = e.message;

      return;
    }

    // trigger a fresh login
    this.apiService.accepting = false;
    this.location.go('/');
    this.apiService.authChange();
  }
}

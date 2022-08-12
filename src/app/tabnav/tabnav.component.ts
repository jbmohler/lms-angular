import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.component.html',
  styleUrls: ['./tabnav.component.css']
})
export class TabnavComponent implements OnInit {
	root_active: boolean = false;
	contact_active: boolean = false;
	finance_active: boolean = false;
	reports_active: boolean = false;
	profile_active: boolean = false;
	technical_active: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) { 
	  this.contact_active = this.matchesPrefix(['/contact', '/contacts']);
	  this.finance_active = this.matchesPrefix(['/finance', '/transaction']);
	  this.profile_active = this.matchesPrefix(['/lms/user-profile']);
	  this.technical_active = this.matchesPrefix(['/lms/technical']);
  }

  matchesPrefix(prefix: string[]): boolean{
	  let path = window.location.pathname;
	  for ( let pref of prefix ) {
		  if (path.startsWith(pref) ) {
			  return true;
		  }

	  }
	  return false;
  }

  ngOnInit(): void {
  }

}

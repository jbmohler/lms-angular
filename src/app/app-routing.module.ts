import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { FinancesComponent } from './finances/finances.component';
import { ReportsComponent } from './reports/reports.component';
import { AdminComponent } from './admin/admin.component';
import { AcceptInviteComponent } from './accept-invite/accept-invite.component';
import { ProfileComponent } from './profile/profile.component';
import { TechnicalComponent } from './technical/technical.component';

const routes: Routes = [
  { path: 'user/:userid/accept', component: AcceptInviteComponent },
  { path: 'contact/:id', component: ContactsComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'transaction/:id', component: FinancesComponent },
  { path: 'finances', component: FinancesComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'user/:id', component: AdminComponent },
  { path: 'admin', component: AdminComponent },
  // {base}/user/{userid}/accept?token={token}
  { path: 'lms/user-profile', component: ProfileComponent },
  { path: 'lms/technical', component: TechnicalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

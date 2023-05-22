import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { TabnavComponent } from './tabnav/tabnav.component';
import { ContactsComponent } from './contacts/contacts.component';
import { FinancesComponent } from './finances/finances.component';
import { ReportsComponent } from './reports/reports.component';
import { ProfileComponent } from './profile/profile.component';
import { TechnicalComponent } from './technical/technical.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PersonaBitsEditComponent } from './persona-bits-edit/persona-bits-edit.component';
import { AdminComponent } from './admin/admin.component';
import { TransactionSidebarComponent } from './transaction-sidebar/transaction-sidebar.component';
import { PersonaSidebarComponent } from './persona-sidebar/persona-sidebar.component';
import { PersonaEditComponent } from './persona-edit/persona-edit.component';
import { PersonaShareComponent } from './persona-share/persona-share.component';
import { UserSidebarComponent } from './user-sidebar/user-sidebar.component';
import { AcceptInviteComponent } from './accept-invite/accept-invite.component';
import { ProfileAddressEditComponent } from './profile-address-edit/profile-address-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    TabnavComponent,
    ContactsComponent,
    FinancesComponent,
    ReportsComponent,
    ProfileComponent,
    AdminComponent,
    TechnicalComponent,
    PersonaBitsEditComponent,
    TransactionSidebarComponent,
    PersonaSidebarComponent,
    PersonaEditComponent,
    PersonaShareComponent,
    UserSidebarComponent,
    AcceptInviteComponent,
    ProfileAddressEditComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AgGridModule,
    MatDialogModule,
    AppRoutingModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

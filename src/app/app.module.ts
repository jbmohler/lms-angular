import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { TabnavComponent } from './tabnav/tabnav.component';
import { ContactsComponent } from './contacts/contacts.component';
import { FinancesComponent } from './finances/finances.component';
import { ReportsComponent } from './reports/reports.component';
import { ProfileComponent } from './profile/profile.component';
import { TechnicalComponent } from './technical/technical.component';

@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    TabnavComponent,
    ContactsComponent,
    FinancesComponent,
    ReportsComponent,
    ProfileComponent,
    TechnicalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AgGridModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

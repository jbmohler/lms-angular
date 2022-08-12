import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

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
    TechnicalComponent
  ],
  imports: [
    BrowserModule,
	FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

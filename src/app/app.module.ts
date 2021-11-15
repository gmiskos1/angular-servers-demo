import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NotifierModule } from 'angular-notifier';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    NotifierModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

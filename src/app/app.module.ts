import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { ErrorComponent } from './pages/error/error.component';
import {AppInterceptor} from './app.interceptor';
import {LoginService} from './pages/login/login.service';
import {AppGuard} from './app.guard';
import {MicroFunctionService} from './shared/services/micro-function.service';

import {LoaderModule} from './components/loader/loader.module';
import {LoaderAppComponent} from './pages/loader/loader.component';

const APP_PROVIDERS = [
  AppConfig,
  LoginService,
  AppGuard
];

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    ErrorComponent,
    LoaderAppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(ROUTES, {
      useHash: false,
      preloadingStrategy: PreloadAllModules
    }),
    LoaderModule
  ],
  providers: [
    MicroFunctionService,
    APP_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true
    }
  ]
})
export class AppModule {}

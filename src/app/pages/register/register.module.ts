import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {RegisterComponent} from './register.component';
import {NewWidgetModule} from '../../layout/new-widget/widget.module';
import {AlertModule} from 'ngx-bootstrap';
import {RegisterService} from './register.service';
import {Select2Module} from "ng2-select2";

export const routes = [
  {path: '', component: RegisterComponent, pathMatch: 'full'}
];

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NewWidgetModule,
    Select2Module,
    AlertModule.forRoot()
  ],
  exports:[RegisterComponent],
  providers: [
    RegisterService
  ]
})
export class RegisterModule {
  static routes = routes;
}

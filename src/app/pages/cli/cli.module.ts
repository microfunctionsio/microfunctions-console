import {NgModule} from '@angular/core';
import {CliComponent} from './cli.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  AccordionModule,
  AlertModule,
  BsDropdownModule,
  ButtonsModule,
  CollapseModule,
  ModalModule,
  PopoverModule, ProgressbarModule,
  TooltipModule
} from 'ngx-bootstrap';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NewWidgetModule} from '../../layout/new-widget/widget.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {LoaderModule} from '../../components/loader/loader.module';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {WidgetModule} from '../../layout/widget/widget.module';
import {Select2Module} from 'ng2-select2';
import {Ng5SliderModule} from 'ng5-slider';
import {ManagementComponent} from '../namespace/management/management';
import {NamespaceCreateComponent} from '../namespace/create/namespace.component';
import {NamespaceComponent} from '../namespace/edite/namespace.component';
import {FunctionCreateComponent} from '../namespace/functions/create/function.component';
import {FunctionEditeComponent} from '../namespace/functions/edite/function.component';
import {SharedModule} from '../shared.module';
import {CliService} from './cli.service';

export const routes = [

  {path: '', component: CliComponent, pathMatch: 'full'},


];

@NgModule({
  declarations: [CliComponent],
  imports: [
    SharedModule,
    AlertModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    MonacoEditorModule.forRoot(), // use forRoot() in main app module only.
    AccordionModule.forRoot(),
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [CliService]
})
export class CliModule {

}

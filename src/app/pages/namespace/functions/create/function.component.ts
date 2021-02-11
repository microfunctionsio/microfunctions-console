import {Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ComponentAction, ComponentBase} from '../../../../classes/component';
import {Functions} from '../../../../classes/functions';
import {FunctionService} from '../../function.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Select2OptionData} from 'ng2-select2';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {generateNameFunction} from '../../../../utils/shared.utils';
import {ChangeContext, Options} from 'ng5-slider';
import {Helper} from '../../../../shared/helper';
import {GitService} from '../git/git.service';


@Component({
  selector: 'functionCreate',
  templateUrl: './function.template.html',
  styleUrls: ['./function.style.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class FunctionCreateComponent extends ComponentBase implements OnInit, OnDestroy {
  namespace: string;
  functionForm: FormGroup;
  idNamespace;
  events: string[] = [];
  value: number = 5;
  regexNameFunction = /[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
  memoryOptions: Options = {
    showTicksValues: true,
    showSelectionBar: true,

    stepsArray: [
      {value: 32},
      {value: 64},
      {value: 128},
      {value: 256},
      {value: 512},
    ]
  };

  replicasOptions: Options = {
    showTicksValues: true,
    showSelectionBar: true,
    stepsArray: [
      {value: 1},
      {value: 2},
      {value: 3},
      {value: 4},
    ]
  };


  codeEditorisloaded: boolean = false;
  packageEditorisloaded: boolean = false;
  editorSelectd: string = 'INDEX';
  fullscreen: boolean = false;

  @ViewChild('fullScreen', {static: true}) divRef;

  codeOptions = {
    theme: 'chrome-devtools', language: 'javascript', contextmenu: true, automaticLayout: true, minimap: {
      enabled: false,
    }
  };
  packageOptions = {
    theme: 'chrome-devtools', language: 'json', contextmenu: true, automaticLayout: true, minimap: {
      enabled: false,
    }
  };

  constructor(protected functionService: FunctionService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected fb: FormBuilder,
              protected gitService: GitService) {
    super();
    this.title = 'Create Function';
    this.componentAction = ComponentAction.CREATE;

  }


  onUserChangeEnd(changeContext: ChangeContext): void {
    /*const typeClient: string = localStorage.getItem('typeClient');
    if (typeClient === 'FREE' || typeClient == null ) {
      this.functionForm.get('replicas').setValue(this.getReplicas());
      this.functionForm.get('memory').setValue(this.getMemory());
    }*/


  }

  onEditorSelectdChanged(value) {
    this.editorSelectd = value;

    this.events = this.events.filter((even) => even !== value);

  }

  onCodeloaded() {


    this.codeEditorisloaded = true;
  }

  onPackageloaded() {

    this.packageEditorisloaded = true;
  }


  getSelect2GroupedList(): Select2OptionData[] {
    return [{
      id: 'nodejs',
      text: 'Node.js',
      children: [
        {
          id: 'nodejs12',
          text: 'Node.js 12'
        }
      ]
    }];

  }


  submitFunction() {

    if (!this.functionForm.valid) {
      this.functionService.toastr.error('Function has not  been Created!');
      return;
    }
    this.submitted = true;
    const functions: Functions = this.functionForm.value;
    this.updating();
    this.functionService.createFunctions(this.idNamespace, functions).subscribe((responseKub: any) => {
      this.router.navigate(['/microfunction/namespace/', this.idNamespace]);

      this.isUpdating = false;
      this.submitted = false;
    }, error => {

      this.isUpdating = false;

    });
  }


  goBack() {
    this.router.navigate(['/microfunction/namespace/', this.idNamespace]);
  }

  ngOnInit(): void {
    this.idNamespace = this.route.params['value'].idNamespace;
    this.initFunctionForm();
    this.gitObservable();

  }

  gitObservable() {
    this.gitService.indexjs$.subscribe((indexjs) => {
      this.functionForm.get('sourceCode').setValue(indexjs);
      this.events.push('INDEX');
    });
    this.gitService.packagejson$.subscribe((packagejson) => {
      this.functionForm.get('packageJson').setValue(JSON.stringify(packagejson));
      this.events.push('PACKAGE');
    });
    this.gitService.env$.subscribe((envs: any[]) => {
      this.addsEnvironment(envs);
      this.events.push('ENV');
    });
  }

  initFunctionForm() {

    this.functionForm = this.fb.group({
        name: new FormControl(generateNameFunction(), [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
          Validators.pattern(this.regexNameFunction)
        ]),
        memory: new FormControl(32, Validators.required),
        replicas: new FormControl(1, Validators.required),
        runtime: new FormControl('nodejs12', Validators.required),
        executedName: new FormControl('helloworld', [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
          Validators.pattern(this.regexNameFunction),
        ]),
        sourceCode: [Helper.codeModelDefaultValue, Validators.required],
        packageJson: [Helper.packageModelDefaultValue, Validators.required],
        environments: this.fb.array([])
      }, {
        validators: this.checkExecutedNameValidator
      }
    );
  }

  checkExecutedNameValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const sourceCode = control.get('sourceCode');
    const executedName = control.get('executedName');
    return sourceCode && executedName && !sourceCode.value.toString().includes(executedName.value) ? {'executedNameIsValide': true} : null;
  };

  runtimeChanged(runtime) {
    this.functionForm.get('runtime').setValue(runtime.value);
  }

  createEnvironment(): FormGroup {
    return this.fb.group({
      name: new FormControl('', [Validators.required,
        Validators.pattern('^[a-zA-Z_][a-zA-Z0-9_]*$')
      ]),
      value: new FormControl('', [Validators.required]),
    });
  }


  addEnvironment(environment: {
    name: string,
    value: string,
  }): void {
    const items: FormArray = this.functionForm.get('environments') as FormArray;

    !environment ? items.push(this.createEnvironment()) : items.push(this.initEnvironment(environment));
  }

  addsEnvironment(environments: {
    name: string,
    value: string,
  }[]): void {
    const items: FormArray = this.functionForm.get('environments') as FormArray;
    items.clear();
    environments.forEach((env) => this.addEnvironment(env));
  }


  removeEnvironment(index) {
    const items: FormArray = this.functionForm.get('environments') as FormArray;
    items.removeAt(index);
  }

  initEnvironments(environments: {
    name: string,
    value: string,
  }[]): any {
    const envs: any[] = [];
    environments.forEach((environment: {
      name: string,
      value: string,
    }) => {
      envs.push(this.initEnvironment(environment));
    });
    return envs;
  }

  initEnvironment(environment: {
    name: string,
    value: string,
  }): FormGroup {
    return this.fb.group({
      name: new FormControl(environment.name, [Validators.required,
        Validators.pattern('^[a-zA-Z_][a-zA-Z0-9_]*$')
      ]),
      value: new FormControl(environment.value, [Validators.required]),
    });
  }

  get environmentErrors() {
    const items: FormArray = this.functionForm.get('environments') as FormArray;
    const err: any = [];
    items.controls.filter((control) => {
      return control.get('name').errors || control.get('value').errors;
    }).forEach((control) => {

      if (control.get('name').errors && err.toString().indexOf(control.get('name').errors) < 0) {
        err.push(control.get('name').errors);
      }

      if (control.get('value').errors && err.toString().indexOf(control.get('value').errors) < 0) {
        err.push(control.get('value').errors);
      }

    });

    return err;
  }

  replicasChanged() {

  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }


  private getMemory() {
    const memory = this.functionForm.get('memory').value;
    const replicas = this.functionForm.get('replicas').value;
    if (replicas === 1) {
      return memory <= 64 ? memory : 64;
    }
    if (replicas === 2) {
      return 32;
    }
    return 64;
  }

  private getReplicas() {
    const replicas = this.functionForm.get('replicas').value;
    if (replicas <= 2) {
      return replicas;
    }
    return 2;
  }
}

import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';

const routes: Routes = [
  {
      path: '', component: LayoutComponent, children: [
      {path: '', redirectTo: 'namespace', pathMatch: 'full'},
      {path: 'namespace', loadChildren: '../pages/namespace/namespace.module#NamespaceModule'},
      {path: 'cli', loadChildren: '../pages/cli/cli.module#CliModule'},
      {path: 'cluster', loadChildren: '../pages/cluster/cluster.module#ClusterModule'},


    ]
  }
];

export const ROUTES = RouterModule.forChild(routes);

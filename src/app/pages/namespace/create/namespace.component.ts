import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NamespaceService} from '../namespace.service';
import {Router} from '@angular/router';
import {ComponentBase} from '../../../classes/component';
import {Response} from '../../../classes/response';
import {ClusterService} from '../../cluster/cluster.service';
import {Cluster} from '../../../classes/cluster';
import {Select2OptionData} from 'ng2-select2';

@Component({
  selector: 'namespace',
  templateUrl: './namespace.template.html',
  styleUrls: ['./namespace.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NamespaceCreateComponent extends ComponentBase implements OnInit, OnDestroy {
  namespace: string;
  clusters: Select2OptionData[];

  idCluster: string;

  constructor(public namespaceService: NamespaceService,
              private clusterService: ClusterService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    this.receiving();
    const getClusters = this.clusterService.getClusters().subscribe((clusters$: Cluster[]) => {
      this.clusters = clusters$.map((c: Cluster) => {
        return {
          id: c.id,
          text: c.name,
        };
      });
      this.receives();
    });

    this.subscriptions.push(getClusters);
  }

  goBack() {
    this.router.navigate(['/microfunction/namespace/']);
  }


  createNamespaceRequest() {


    const pattern = new RegExp('^(?=.*[a-zA-Z])([a-zA-Z0-9]+)$');
    if (!this.namespace || this.namespace.length < 6 || this.namespace.length > 14 || !pattern.test(this.namespace)) {
      this.errorMessage = 'The name contains invalid characters. Enter letters, numbers.Min length is 5, Max length is 14';
      return true;
    }

    if (!this.idCluster) {
      this.errorMessage = 'select the cluster ';
      return true;
    }
    this.updating();
    this.namespaceService.createNamespaces(this.namespace, this.idCluster).subscribe((response: Response) => {
      this.isUpdating = false;
    }, error => {

      this.isUpdating = false;
    }, () => {
      this.router.navigate(['/microfunction/namespace']);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  clustersChanged($event: any) {
    this.idCluster = $event.value;
    console.log('clustersChanged', $event);
  }
}

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ComponentBase} from '../../../../classes/component';
import {FunctionService} from '../../function.service';
import {timer} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';

import {Functions} from '../../../../classes/functions';
import {IMetrics, MetricsService} from './metrics.service';


@Component({
  selector: 'metrics',
  templateUrl: './metrics.template.html'
})
export class MetricsComponent extends ComponentBase implements OnInit, OnDestroy {

  @Input('namespace') namespace: string;
  @Input('functions') functions: Functions;
  metrics: { memoryUsage?, memoryRequests?, memoryLimits?, networkTransit?, networkReceive?, cpuUsage?, fsUsage? } = {};
  private interval$ = timer(0, 1000 * 10);

  constructor(private functionService: FunctionService,
              private metricsService: MetricsService) {
    super();
  }

  get memoryRequests() {
    const value = this.metrics.memoryRequests;
    // tslint:disable-next-line:radix
    return this.metricsService.formateMemory(value);
  }

  get memoryUsage() {
    const value = this.metrics.memoryUsage;
    // tslint:disable-next-line:radix
    return this.metricsService.formateMemory(value);
  }

  get networkReceive() {
    const value = this.metrics.networkReceive;
    return this.metricsService.formateMemory(value);
  }

  get networkTransit() {
    const value = this.metrics.networkTransit;
    return this.metricsService.formateMemory(value);
  }

  get fsUsage() {
    const value = this.metrics.fsUsage;
    return this.metricsService.formateMemory(value);
  }

  get cpuUsage() {
    const value = this.metrics.cpuUsage;

    return this.metricsService.formateCpu(value);

  }

  get memoryProgressbar() {
    return ((this.metrics.memoryUsage * 100) / this.metrics.memoryRequests);
  }

  get networkProgressbar() {
    return ((this.metrics.networkReceive * 100) / 10000);
  }

  get cpuUsageProgressbar() {
    return ((this.metrics.cpuUsage * 100) / 10000);
  }

  get fsUsageProgressbar() {
    return ((this.metrics.fsUsage * 100) / 10000000000);
  }


  getProgressbarTye(progressbar: number) {
    if (progressbar < 60) {
      return 'primary';
    }
    if (progressbar >= 60 && progressbar < 90) {
      return 'warning';
    }
    if (progressbar >= 90) {
      return 'danger';
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.receivingMetrics());
  }

  private receivingMetrics() {
    return this.interval$.pipe(
      mergeMap((count: number) => {
        return this.functionService.getMetrics(this.namespace, this.functions.idFunctions);
      }),
      map((metrics$: IMetrics) => {
        const metrics: { memoryUsage?, memoryRequests?, memoryLimits?, networkTransit?, networkReceive?, cpuUsage?, fsUsage? } = {};
        Object.keys(metrics$).forEach((key: string) => {
          let values = 0;
          const results: IMetrics = this.metricsService.normalizeMetrics(metrics$[key]);
          const result: Partial<{ [metric: string]: number }> = metrics$[key].data.result;
          if (results.data.result.length > 0 && results.data.result[0].values[0] && results.data.result[0].values[0].length > 0) {
            results.data.result.forEach((r: any) => {
              values += parseInt(r.values[0][1], 10);
            });
          }
          this.metrics[key] = values;
          metrics[key] = result;
        });
        this.metricsService.next(metrics);
        this.receiving();

      })
    ).subscribe();
  }


  ngOnDestroy(): void {
    this.unsubscribe();
  }
}

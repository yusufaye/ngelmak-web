import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertService, Alert } from 'app/core/util/alert.service';

@Component({
  standalone: true,
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  imports: [CommonModule],
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts = signal<Alert[]>([]);

  private alertService = inject(AlertService);

  ngOnInit(): void {
    this.alerts.set(this.alertService.get());
  }

  setClasses(alert: Alert): { [key: string]: boolean } {
    const classes = { 'app-toast': Boolean(alert.toast) };
    if (alert.position) {
      return { ...classes, [alert.position]: true };
    }
    return classes;
  }

  ngOnDestroy(): void {
    this.alertService.clear();
  }

  close(alert: Alert): void {
    alert.close?.(this.alerts());
  }
}

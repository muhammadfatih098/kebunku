import { Component } from '@angular/core';
import { IonCard } from '@ionic/angular/standalone';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [IonCard],
  template: `
    <ion-card class="skeleton-card">
      <div class="skeleton-image skeleton-shimmer"></div>
      <div class="skeleton-body">
        <div class="skeleton-line skeleton-shimmer" style="width: 80%; height: 14px;"></div>
        <div class="skeleton-line skeleton-shimmer" style="width: 55%; height: 11px; margin-top: 6px;"></div>
        <div class="skeleton-line skeleton-shimmer" style="width: 40%; height: 10px; margin-top: 10px;"></div>
      </div>
    </ion-card>
  `,
  styles: [`
    .skeleton-card {
      border-radius: 20px;
      overflow: hidden;
      background: var(--kebunku-surface);
      margin: 0;
    }

    .skeleton-image {
      width: 100%;
      padding-top: 115%;
    }

    .skeleton-body {
      padding: 12px 12px 14px;
    }

    .skeleton-line {
      border-radius: 6px;
    }
  `]
})
export class SkeletonCardComponent {}

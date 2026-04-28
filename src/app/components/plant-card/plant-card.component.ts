import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonIcon, IonBadge, IonRippleEffect } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookmark, bookmarkOutline, leafOutline } from 'ionicons/icons';
import { Plant } from '../../services/plant.service';

@Component({
  selector: 'app-plant-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IonCard, IonIcon, IonBadge, IonRippleEffect],
  template: `
    <ion-card class="plant-card card-enter" (click)="onCardClick()">
      <div class="card-image-wrapper">
        <img
          [src]="imageLoaded ? plant.image : ''"
          [alt]="plant.name"
          loading="lazy"
          (load)="onImageLoad()"
          (error)="onImageError()"
          [class.visible]="imageLoaded"
        />
        <div class="skeleton-shimmer image-skeleton" *ngIf="!imageLoaded"></div>

        <button class="bookmark-btn" (click)="onBookmarkClick($event)" [attr.aria-label]="bookmarked ? 'Remove bookmark' : 'Add bookmark'">
          <ion-icon [name]="bookmarked ? 'bookmark' : 'bookmark-outline'" [class.bookmarked]="bookmarked"></ion-icon>
        </button>

        <div class="category-pill" [class.outdoor]="plant.category === 'outdoor'">
          {{ plant.category === 'indoor' ? 'Indoor' : 'Outdoor' }}
        </div>
      </div>

      <div class="card-body">
        <h3 class="plant-name">{{ plant.name }}</h3>
        <p class="plant-latin">{{ plant.latinName }}</p>

        <div class="difficulty-row">
          <div class="difficulty-dots">
            <span class="dot" [class.filled]="true"></span>
            <span class="dot" [class.filled]="plant.difficulty !== 'Mudah'"></span>
            <span class="dot" [class.filled]="plant.difficulty === 'Sulit'"></span>
          </div>
          <span class="difficulty-text">{{ plant.difficulty }}</span>
        </div>
      </div>

      <ion-ripple-effect></ion-ripple-effect>
    </ion-card>
  `,
  styles: [`
    .plant-card {
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      background: var(--kebunku-surface);
      margin: 0;
      border: 1px solid var(--kebunku-border);
      box-shadow: var(--shadow-card);
    }

    .card-image-wrapper {
      position: relative;
      width: 100%;
      padding-top: 115%;
      overflow: hidden;
      background: var(--kebunku-surface-2);

      img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.4s ease;
        &.visible { opacity: 1; }
      }

      .image-skeleton {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
    }

    .bookmark-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--kebunku-surface);
      backdrop-filter: blur(8px);
      border: 1px solid var(--kebunku-border);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 2;
      transition: all 0.2s ease;

      ion-icon {
        font-size: 1rem;
        color: var(--kebunku-text-muted);
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        &.bookmarked { color: var(--kebunku-green-dark); transform: scale(1.2); }
      }

      &:active { transform: scale(0.9); }
    }

    .category-pill {
      position: absolute;
      bottom: 8px;
      left: 8px;
      padding: 3px 10px;
      border-radius: 20px;
      background: rgba(28, 92, 46, 0.88);
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      backdrop-filter: blur(8px);
      z-index: 2;
      &.outdoor { background: rgba(141, 184, 74, 0.92); color: #0F2415; }
    }

    .card-body { padding: 12px 12px 14px; }

    .plant-name {
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--kebunku-text-primary);
      margin: 0 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: -0.01em;
    }

    .plant-latin {
      font-size: 0.68rem;
      color: var(--kebunku-text-muted);
      font-style: italic;
      margin: 0 0 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 400;
    }

    .difficulty-row { display: flex; align-items: center; gap: 6px; }
    .difficulty-dots { display: flex; gap: 3px; }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--kebunku-surface-3);
      &.filled { background: var(--kebunku-green-dark); }
    }

    .difficulty-text {
      font-size: 0.68rem;
      font-weight: 600;
      color: var(--kebunku-text-muted);
    }
  `]
})
export class PlantCardComponent implements OnInit {
  @Input() plant!: Plant;
  @Input() bookmarked = false;
  @Output() cardClicked = new EventEmitter<Plant>();
  @Output() bookmarkToggled = new EventEmitter<Plant>();

  imageLoaded = false;
  imageError = false;

  constructor() { addIcons({ bookmark, bookmarkOutline, leafOutline }); }

  ngOnInit() {}
  onImageLoad() { this.imageLoaded = true; }
  onImageError() { this.imageError = true; this.imageLoaded = true; }
  onCardClick() { this.cardClicked.emit(this.plant); }
  onBookmarkClick(event: Event) { event.stopPropagation(); this.bookmarkToggled.emit(this.plant); }
}

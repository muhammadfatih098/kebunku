import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonSearchbar, IonChip, IonLabel, IonIcon,
  IonButtons, IonButton, IonText, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  leafOutline, sunnyOutline, waterOutline,
  notificationsOutline, colorPaletteOutline
} from 'ionicons/icons';

import { PlantService, Plant } from '../../services/plant.service';
import { PlantCardComponent } from '../../components/plant-card/plant-card.component';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card.component';

type Category = 'all' | 'indoor' | 'outdoor';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonSearchbar, IonChip, IonLabel, IonIcon,
    IonButtons, IonButton, IonText,
    PlantCardComponent, SkeletonCardComponent
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="home-header">
          <div class="header-top">
            <div class="header-brand">
              <div class="logo-container">
                <img src="assets/icon/logo_kebunku.png" class="header-logo" alt="logo" />
              </div>
              <span class="header-title">kebunku</span>
            </div>
            <div class="header-greeting">
              <p class="greeting-line">Selamat datang! 👋</p>
              <h1 class="greeting-main">Rawat Tanamanmu</h1>
            </div>
          </div>

          <ion-searchbar
            [(ngModel)]="searchQuery"
            (ionInput)="onSearch()"
            placeholder="Cari tanaman..."
            debounce="0"
            animated="true"
            show-clear-button="focus"
          ></ion-searchbar>

          <div class="category-chips">
            <ion-chip
              *ngFor="let cat of categories"
              [class.chip-active]="activeCategory === cat.value"
              (click)="setCategory(cat.value)"
            >
              <ion-icon [name]="cat.icon" *ngIf="cat.icon"></ion-icon>
              <ion-label>{{ cat.label }}</ion-label>
            </ion-chip>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="results-bar" *ngIf="!isLoading">
        <span class="results-count">
          <strong>{{ filteredPlants.length }}</strong> tanaman
          <span *ngIf="searchQuery"> untuk "<em>{{ searchQuery }}</em>"</span>
        </span>
      </div>

      <div class="plant-grid" *ngIf="isLoading">
        <app-skeleton-card *ngFor="let i of skeletons"></app-skeleton-card>
      </div>

      <div class="plant-grid" *ngIf="!isLoading">
        <app-plant-card
          *ngFor="let plant of filteredPlants; trackBy: trackById"
          [plant]="plant"
          [bookmarked]="plantService.isBookmarked(plant.id)"
          (cardClicked)="navigateToDetail($event)"
          (bookmarkToggled)="toggleBookmark($event)"
        ></app-plant-card>
      </div>

      <div class="empty-state" *ngIf="!isLoading && filteredPlants.length === 0">
        <ion-icon name="leaf-outline" class="empty-icon"></ion-icon>
        <h3>Tanaman tidak ditemukan</h3>
        <p>Coba kata kunci lain atau ganti filter kategori</p>
      </div>
    </ion-content>
  `,
  styles: [`
    .home-header {
      padding: 0 16px 8px;
    }

    .header-top {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-top: 8px;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-right: auto;
    }

    .logo-container {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(28, 92, 46, 0.25);
      flex-shrink: 0;
    }

    .header-logo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .header-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.4rem;
      color: var(--kebunku-green-dark);
      font-weight: 800;
    }

    .header-greeting { text-align: right; }

    .greeting-line {
      font-size: 0.75rem;
      color: var(--kebunku-text-muted);
      margin: 0;
      font-weight: 500;
    }

    .greeting-main {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--kebunku-text-primary);
      margin: 0;
      letter-spacing: -0.02em;
    }

    ion-searchbar {
      padding: 0;
      margin-bottom: 12px;
    }

    .category-chips {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }
      ion-chip { flex-shrink: 0; ion-icon { font-size: 0.9rem; margin-right: 2px; } }
    }

    .results-bar {
      padding: 12px 20px 8px;
      .results-count {
        font-size: 0.8rem;
        color: var(--kebunku-text-muted);
        font-weight: 500;
        strong { color: var(--kebunku-green-dark); font-weight: 700; }
        em { font-style: italic; }
      }
    }

    .empty-state {
      padding-top: 60px;
      .empty-icon { font-size: 56px; color: var(--kebunku-green-pale); opacity: 0.6; }
    }
  `]
})
export class HomePage implements OnInit, OnDestroy {
  filteredPlants: Plant[] = [];
  isLoading = true;
  searchQuery = '';
  activeCategory: Category = 'all';
  skeletons = Array(8).fill(0);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  categories = [
    { label: 'Semua', value: 'all' as Category, icon: '' },
    { label: 'Indoor', value: 'indoor' as Category, icon: 'leaf-outline' },
    { label: 'Outdoor', value: 'outdoor' as Category, icon: 'sunny-outline' }
  ];

  constructor(
    public plantService: PlantService,
    private router: Router,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ leafOutline, sunnyOutline, waterOutline, notificationsOutline, colorPaletteOutline });
  }

  ngOnInit() {
    setTimeout(() => {
      this.filteredPlants = this.plantService.getPlantsByCategory(this.activeCategory);
      this.isLoading = false;
      this.cdr.markForCheck();
    }, 400);

    this.searchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => { this.applyFilter(); });
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  onSearch() { this.searchSubject.next(this.searchQuery); }
  setCategory(cat: Category) { this.activeCategory = cat; this.applyFilter(); }
  private applyFilter() {
    this.filteredPlants = this.plantService.searchPlants(this.searchQuery, this.activeCategory);
    this.cdr.markForCheck();
  }
  navigateToDetail(plant: Plant) { this.router.navigate(['/plant', plant.id]); }

  async toggleBookmark(plant: Plant) {
    const isNowBookmarked = await this.plantService.toggleBookmark(plant.id);
    const toast = await this.toastCtrl.create({
      message: isNowBookmarked ? `🌿 ${plant.name} ditambahkan ke Favorit` : `${plant.name} dihapus dari Favorit`,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    this.cdr.markForCheck();
    await toast.present();
  }

  trackById(_: number, plant: Plant) { return plant.id; }
}

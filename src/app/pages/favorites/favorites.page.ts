import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonIcon, IonButton, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookmarkOutline, heartOutline, leafOutline, trashOutline } from 'ionicons/icons';
import { Subject, takeUntil } from 'rxjs';
import { PlantService, Plant } from '../../services/plant.service';
import { PlantCardComponent } from '../../components/plant-card/plant-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonIcon, IonButton,
    PlantCardComponent
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="fav-header">
          <div class="header-text">
            <h1 class="page-title">Favorit</h1>
            <p class="page-subtitle" *ngIf="favorites.length > 0">{{ favorites.length }} tanaman tersimpan</p>
          </div>
          <button class="clear-btn" *ngIf="favorites.length > 0" (click)="clearAll()">
            <ion-icon name="trash-outline"></ion-icon>
            <span>Hapus Semua</span>
          </button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">

      <!-- Plants grid -->
      <div class="plant-grid" *ngIf="favorites.length > 0">
        <app-plant-card
          *ngFor="let plant of favorites; trackBy: trackById"
          [plant]="plant"
          [bookmarked]="true"
          (cardClicked)="navigateToDetail($event)"
          (bookmarkToggled)="removeBookmark($event)"
        ></app-plant-card>
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="favorites.length === 0">
        <div class="empty-illustration">
          <div class="empty-circle">
            <ion-icon name="bookmark-outline"></ion-icon>
          </div>
        </div>
        <h3>Belum ada tanaman favorit</h3>
        <p>Tap ikon bookmark pada tanaman yang kamu suka untuk menyimpannya di sini</p>
        <button class="explore-btn" (click)="goToHome()">
          <ion-icon name="leaf-outline"></ion-icon>
          Jelajahi Tanaman
        </button>
      </div>

    </ion-content>
  `,
  styles: [`
    .fav-header {
      padding: 12px 20px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-text { flex: 1; }

    .page-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--ion-text-color);
      margin: 0;
      letter-spacing: -0.03em;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .page-subtitle {
      font-size: 0.8rem;
      color: var(--ion-color-medium);
      margin: 2px 0 0;
      font-weight: 500;
    }

    .clear-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 14px;
      border-radius: 20px;
      background: #FFEBEE;
      color: #C62828;
      border: none;
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 700;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: all 0.2s ease;

      ion-icon { font-size: 0.9rem; }
      &:active { transform: scale(0.95); }
    }

    /* Empty state */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 40px;
      text-align: center;
      gap: 14px;
      min-height: 70vh;
    }

    .empty-illustration {
      margin-bottom: 8px;
    }

    .empty-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: var(--kebunku-green-ultra-pale);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: float 3s ease-in-out infinite;

      ion-icon {
        font-size: 2.5rem;
        color: var(--kebunku-green-dark);
        opacity: 0.6;
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    h3 {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--ion-text-color);
      margin: 0;
      letter-spacing: -0.02em;
    }

    p {
      font-size: 0.88rem;
      color: var(--ion-color-medium);
      line-height: 1.6;
      margin: 0;
      max-width: 260px;
    }

    .explore-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: 16px;
      background: var(--kebunku-green-dark);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 700;
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin-top: 8px;
      transition: all 0.25s ease;
      box-shadow: 0 6px 20px rgba(28, 92, 46, 0.3);

      ion-icon { font-size: 1.1rem; }

      &:active {
        transform: scale(0.96);
        box-shadow: 0 2px 10px rgba(28, 92, 46, 0.2);
      }
    }
  `]
})
export class FavoritesPage implements OnInit, OnDestroy {
  favorites: Plant[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private plantService: PlantService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ bookmarkOutline, heartOutline, leafOutline, trashOutline });
  }

  ngOnInit() {
    this.plantService.bookmarks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.favorites = this.plantService.getBookmarkedPlants();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToDetail(plant: Plant) {
    this.router.navigate(['/plant', plant.id]);
  }

  async removeBookmark(plant: Plant) {
    await this.plantService.toggleBookmark(plant.id);
    const toast = await this.toastCtrl.create({
      message: `${plant.name} dihapus dari Favorit`,
      duration: 1800,
      position: 'bottom'
    });
    await toast.present();
  }

  async clearAll() {
    for (const plant of this.favorites) {
      await this.plantService.toggleBookmark(plant.id);
    }
    const toast = await this.toastCtrl.create({
      message: '🗑️ Semua favorit telah dihapus',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  trackById(_: number, plant: Plant) {
    return plant.id;
  }
}

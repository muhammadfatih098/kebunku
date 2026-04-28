import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons,
  IonBackButton, IonIcon, IonButton, IonRippleEffect,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  waterOutline, sunnyOutline, leafOutline,
  bookmark, bookmarkOutline, arrowBackOutline,
  flowerOutline, thermometerOutline, nutritionOutline
} from 'ionicons/icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlantService, Plant } from '../../services/plant.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonButtons,
    IonBackButton, IonIcon, IonButton, IonRippleEffect
  ],
  template: `
    <ion-header class="ion-no-border detail-header" [class.scrolled]="isScrolled">
      <ion-toolbar>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" (ionScroll)="onScroll($event)" [scrollEvents]="true" *ngIf="plant">

      <!-- Hero Image -->
      <div class="detail-hero">
        <img
          [src]="plant.image"
          [alt]="plant.name"
          (load)="imageLoaded = true"
          [class.loaded]="imageLoaded"
        />
        <div class="hero-gradient"></div>

        <!-- Floating back + bookmark over image -->
        <div class="hero-actions">
          <button class="hero-btn" (click)="goBack()">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </button>
          <button class="hero-btn" (click)="toggleBookmark()">
            <ion-icon [name]="isBookmarked ? 'bookmark' : 'bookmark-outline'" [class.bookmarked]="isBookmarked"></ion-icon>
          </button>
        </div>

        <!-- Category badge -->
        <div class="hero-category" [class.outdoor]="plant.category === 'outdoor'">
          <ion-icon [name]="plant.category === 'indoor' ? 'leaf-outline' : 'sunny-outline'"></ion-icon>
          {{ plant.category === 'indoor' ? 'Tanaman Indoor' : 'Tanaman Outdoor' }}
        </div>
      </div>

      <!-- Content Sheet -->
      <div class="detail-content page-enter">

        <!-- Name & Latin -->
        <div class="plant-identity">
          <div class="identity-left">
            <h1 class="plant-name">{{ plant.name }}</h1>
            <p class="plant-latin">{{ plant.latinName }}</p>
          </div>
          <div class="difficulty-badge" [class]="'diff-' + plant.difficulty.toLowerCase()">
            <span class="diff-label">{{ plant.difficulty }}</span>
          </div>
        </div>

        <!-- Tags -->
        <div class="tags-row">
          <span class="tag-chip" *ngFor="let tag of plant.tags">{{ tag }}</span>
        </div>

        <!-- Description -->
        <div class="description-section">
          <h2 class="section-title">Tentang Tanaman</h2>
          <p class="description-text">{{ plant.description }}</p>
        </div>

        <!-- Care Grid -->
        <div class="care-section">
          <h2 class="section-title">Panduan Perawatan</h2>

          <div class="care-grid">

            <div class="care-card">
              <div class="care-icon water">
                <ion-icon name="water-outline"></ion-icon>
              </div>
              <span class="care-label">Penyiraman</span>
              <span class="care-value">{{ plant.watering }}</span>
            </div>

            <div class="care-card">
              <div class="care-icon sun">
                <ion-icon name="sunny-outline"></ion-icon>
              </div>
              <span class="care-label">Cahaya Matahari</span>
              <span class="care-value">{{ plant.sunlight }}</span>
            </div>

            <div class="care-card full-width-card">
              <div class="care-icon nutrition">
                <ion-icon name="nutrition-outline"></ion-icon>
              </div>
              <span class="care-label">Pupuk</span>
              <span class="care-value">{{ plant.fertilizer }}</span>
            </div>

          </div>
        </div>

        <!-- Pro Tips -->
        <div class="tips-section">
          <h2 class="section-title">💡 Tips Perawatan</h2>
          <div class="tip-item" *ngFor="let tip of getTips()">
            <div class="tip-dot"></div>
            <p>{{ tip }}</p>
          </div>
        </div>

        <div style="height: 40px;"></div>
      </div>

    </ion-content>

    <!-- Loading state -->
    <ion-content *ngIf="!plant">
      <div class="not-found">
        <ion-icon name="leaf-outline"></ion-icon>
        <p>Tanaman tidak ditemukan</p>
        <button (click)="goBack()">Kembali</button>
      </div>
    </ion-content>
  `,
  styles: [`
    /* Detail Header - transparent over image */
    .detail-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;

      ion-toolbar {
        --background: transparent;
        --border-color: transparent;
      }

      &.scrolled ion-toolbar {
        --background: var(--kebunku-bg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        transition: background 0.3s ease;
      }
    }

    .back-btn, .bookmark-fab-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(10px);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 4px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.15);
      transition: all 0.2s ease;

      ion-icon {
        font-size: 1.1rem;
        color: var(--kebunku-green-dark);

        &.bookmarked { color: var(--kebunku-green-dark); }
      }

      &:active { transform: scale(0.9); }
    }

    /* Hero */
    .detail-hero {
      position: relative;
      width: 100%;
      height: 340px;
      overflow: hidden;
      background: var(--kebunku-surface-2);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.5s ease;

        &.loaded { opacity: 1; }
      }

      .hero-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(0,0,0,0.15) 0%,
          transparent 35%,
          transparent 55%,
          rgba(0,0,0,0.35) 100%
        );
      }

      .hero-actions {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        padding: 52px 16px 16px;
        z-index: 10;

        button {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 16px rgba(0,0,0,0.18);
          transition: transform 0.2s ease;

          ion-icon {
            font-size: 1.15rem;
            color: var(--kebunku-green-dark);

            &.bookmarked {
              color: var(--kebunku-green-dark);
              animation: bookmarkPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
          }

          &:active { transform: scale(0.88); }
        }
      }

      .hero-category {
        position: absolute;
        bottom: 56px;
        left: 20px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 20px;
        background: rgba(28, 92, 46, 0.85);
        color: white;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        backdrop-filter: blur(8px);
        z-index: 5;

        ion-icon { font-size: 0.9rem; }

        &.outdoor {
          background: rgba(141, 184, 74, 0.9);
        }
      }
    }

    @keyframes bookmarkPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.4); }
      100% { transform: scale(1); }
    }

    /* Content */
    .detail-content {
      background: var(--kebunku-bg);
      border-radius: 28px 28px 0 0;
      margin-top: -28px;
      position: relative;
      z-index: 2;
      padding: 28px 20px 0;
      min-height: 70vh;
    }

    .plant-identity {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 14px;
    }

    .identity-left { flex: 1; }

    .plant-name {
      font-size: 1.7rem;
      font-weight: 800;
      color: var(--ion-text-color);
      margin: 0 0 4px;
      letter-spacing: -0.03em;
      line-height: 1.2;
    }

    .plant-latin {
      font-size: 0.85rem;
      color: var(--ion-color-medium);
      font-style: italic;
      margin: 0;
      font-weight: 400;
    }

    .difficulty-badge {
      flex-shrink: 0;
      padding: 6px 14px;
      border-radius: 20px;
      margin-top: 4px;

      .diff-label {
        font-size: 0.78rem;
        font-weight: 700;
      }

      &.diff-mudah {
        background: #E8F5E9;
        .diff-label { color: #2E7D32; }
      }
      &.diff-sedang {
        background: #FFF8E1;
        .diff-label { color: #F57F17; }
      }
      &.diff-sulit {
        background: #FFEBEE;
        .diff-label { color: #C62828; }
      }
    }

    .tags-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .tag-chip {
      padding: 5px 12px;
      border-radius: 20px;
      background: var(--kebunku-green-ultra-pale);
      color: var(--kebunku-green-dark);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 800;
      color: var(--ion-text-color);
      margin: 0 0 12px;
      letter-spacing: -0.02em;
    }

    .description-section { margin-bottom: 28px; }

    .description-text {
      font-size: 0.9rem;
      color: var(--ion-color-medium);
      line-height: 1.7;
      margin: 0;
      font-weight: 400;
    }

    .care-section { margin-bottom: 28px; }

    .care-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .care-card {
      background: var(--kebunku-surface);
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 2px 12px rgba(28,92,46,0.07);

      &.full-width-card {
        grid-column: 1 / -1;
        flex-direction: row;
        align-items: center;
        gap: 14px;

        .care-label, .care-value { display: block; }

        > div:last-child {
          flex: 1;
        }
      }
    }

    .care-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;

      &.water {
        background: #E3F2FD;
        ion-icon { color: #1565C0; }
      }
      &.sun {
        background: #FFF9C4;
        ion-icon { color: #F57F17; }
      }
      &.nutrition {
        background: var(--kebunku-green-ultra-pale);
        ion-icon { color: var(--kebunku-green-dark); }
      }
    }

    .care-label {
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--ion-color-medium);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .care-value {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--ion-text-color);
      line-height: 1.4;
    }

    .tips-section { margin-bottom: 20px; }

    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;

      .tip-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--kebunku-green-light);
        margin-top: 6px;
        flex-shrink: 0;
      }

      p {
        font-size: 0.87rem;
        color: var(--ion-color-medium);
        line-height: 1.6;
        margin: 0;
      }
    }

    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 16px;

      ion-icon { font-size: 48px; color: var(--kebunku-green-pale); }
      p { color: var(--ion-color-medium); }
    }
  `]
})
export class DetailPage implements OnInit, OnDestroy {
  plant: Plant | undefined;
  isBookmarked = false;
  imageLoaded = false;
  isScrolled = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plantService: PlantService,
    private toastCtrl: ToastController
  ) {
    addIcons({
      waterOutline, sunnyOutline, leafOutline,
      bookmark, bookmarkOutline, arrowBackOutline,
      flowerOutline, thermometerOutline, nutritionOutline
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.plant = this.plantService.getPlantById(id);
    if (this.plant) {
      this.isBookmarked = this.plantService.isBookmarked(id);
    }

    // Subscribe to bookmark changes
    this.plantService.bookmarks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.plant) {
          this.isBookmarked = this.plantService.isBookmarked(this.plant.id);
        }
      });
  }

  onScroll(event: any) {
    this.isScrolled = event.detail.scrollTop > 100;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async toggleBookmark() {
    if (!this.plant) return;
    const isNow = await this.plantService.toggleBookmark(this.plant.id);
    this.isBookmarked = isNow;

    const toast = await this.toastCtrl.create({
      message: isNow
        ? `🌿 ${this.plant.name} ditambahkan ke Favorit`
        : `${this.plant.name} dihapus dari Favorit`,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  getTips(): string[] {
    if (!this.plant) return [];
    const tips: Record<string, string[]> = {
      'Mudah': [
        'Periksa kelembapan tanah sebelum menyiram — lebih baik kekurangan dari kelebihan air.',
        'Bersihkan daun dari debu secara berkala agar fotosintesis optimal.',
        'Ganti pot setiap 1-2 tahun saat akar sudah penuh.'
      ],
      'Sedang': [
        'Gunakan air suhu ruangan, hindari air yang terlalu dingin atau terlalu panas.',
        'Perhatikan tanda daun menguning sebagai sinyal nutrisi kurang.',
        'Rotasi pot secara berkala agar pertumbuhan merata ke semua sisi.',
        'Semprot daun dengan air untuk menjaga kelembapan udara sekitar tanaman.'
      ],
      'Sulit': [
        'Monitor kelembapan udara dengan hygrometer, idealnya di atas 60%.',
        'Gunakan pupuk dengan dosis setengah dari anjuran untuk menghindari overfertilizing.',
        'Hindari memindahkan tanaman terlalu sering — butuh adaptasi lingkungan.',
        'Gunakan tanah khusus sesuai jenis tanaman untuk drainase optimal.',
        'Karantina tanaman baru sebelum meletakkan bersama koleksi lain.'
      ]
    };
    return tips[this.plant.difficulty] || tips['Mudah'];
  }
}

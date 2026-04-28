import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonItem, IonLabel, IonIcon,
  IonToggle, IonNote, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  moonOutline, sunnyOutline, phonePortraitOutline,
  notificationsOutline, informationCircleOutline,
  leafOutline, heartOutline, checkmarkCircleOutline,
  chevronForwardOutline, codeSlashOutline, mailOutline,
  logoInstagram, logoLinkedin, globeOutline,
  ribbonOutline, starOutline
} from 'ionicons/icons';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService, Theme } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';
import { PlantService } from '../../services/plant.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonItem, IonLabel, IonIcon,
    IonToggle, IonNote
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="settings-header">
          <h1 class="page-title">Pengaturan</h1>
          <p class="page-subtitle">Sesuaikan pengalaman kebununmu</p>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">

      <!-- App Card -->
      <div class="app-card">
        <div class="app-avatar">
          <img src="assets/icon/logo_kebunku.png" alt="Kebunku" />
        </div>
        <div class="app-info">
          <h2>kebunku</h2>
          <p>Teman hijau setiap hari 🌿</p>
        </div>
        <div class="app-stats">
          <div class="stat">
            <span class="stat-value">{{ totalPlants }}</span>
            <span class="stat-label">Tanaman</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">{{ favoritesCount }}</span>
            <span class="stat-label">Favorit</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">v1.0</span>
            <span class="stat-label">Versi</span>
          </div>
        </div>
      </div>

      <!-- Appearance -->
      <div class="settings-section">
        <p class="settings-section-title">🎨 Tampilan</p>
        <ion-list>
          <ion-item button (click)="setTheme('light')" [class.active-item]="currentTheme === 'light'">
            <div class="item-icon sun" slot="start"><ion-icon name="sunny-outline"></ion-icon></div>
            <ion-label>Mode Terang</ion-label>
            <ion-icon name="checkmark-circle-outline" slot="end" *ngIf="currentTheme === 'light'" class="check"></ion-icon>
            <ion-icon name="chevron-forward-outline" slot="end" *ngIf="currentTheme !== 'light'" class="chevron"></ion-icon>
          </ion-item>
          <ion-item button (click)="setTheme('dark')" [class.active-item]="currentTheme === 'dark'">
            <div class="item-icon moon" slot="start"><ion-icon name="moon-outline"></ion-icon></div>
            <ion-label>Mode Gelap</ion-label>
            <ion-icon name="checkmark-circle-outline" slot="end" *ngIf="currentTheme === 'dark'" class="check"></ion-icon>
            <ion-icon name="chevron-forward-outline" slot="end" *ngIf="currentTheme !== 'dark'" class="chevron"></ion-icon>
          </ion-item>
          <ion-item button (click)="setTheme('system')" [class.active-item]="currentTheme === 'system'" lines="none">
            <div class="item-icon device" slot="start"><ion-icon name="phone-portrait-outline"></ion-icon></div>
            <ion-label>
              Ikuti Sistem
              <ion-note>Otomatis sesuai perangkat</ion-note>
            </ion-label>
            <ion-icon name="checkmark-circle-outline" slot="end" *ngIf="currentTheme === 'system'" class="check"></ion-icon>
            <ion-icon name="chevron-forward-outline" slot="end" *ngIf="currentTheme !== 'system'" class="chevron"></ion-icon>
          </ion-item>
        </ion-list>
      </div>

      <!-- Notifications -->
      <div class="settings-section">
        <p class="settings-section-title">🔔 Notifikasi</p>
        <ion-list>
          <ion-item lines="none">
            <div class="item-icon notif" slot="start"><ion-icon name="notifications-outline"></ion-icon></div>
            <ion-label>
              Pengingat Siram Tanaman
              <ion-note>Setiap hari pukul 08:00 WIB</ion-note>
            </ion-label>
            <ion-toggle slot="end" [checked]="notifEnabled" (ionChange)="toggleNotification($event)" color="secondary"></ion-toggle>
          </ion-item>
        </ion-list>
      </div>

      <!-- ABOUT DEVELOPER -->
      <div class="settings-section">
        <p class="settings-section-title">👨‍💻 Tentang Developer</p>
        <div class="dev-card">

          <!-- Photo + spinning ring -->
          <div class="dev-photo-wrapper">
            <div class="dev-photo-ring"></div>
            <img
              src="assets/images/developer/developer_profile_400x400.png"
              alt="Muhammad Fatih Ikhsan Pradana"
              class="dev-photo"
            />
          </div>

          <!-- Name -->
          <div class="dev-identity">
            <h2 class="dev-name">Muhammad Fatih Ikhsan Pradana</h2>
            <div class="dev-title-badge">
              <ion-icon name="code-slash-outline"></ion-icon>
              <span>Mobile App Developer</span>
            </div>
          </div>

          <!-- Bio -->
          <p class="dev-bio">
            Passionate developer yang berfokus pada pembuatan aplikasi mobile modern
            dengan pengalaman pengguna yang luar biasa. Kebunku adalah wujud
            kecintaan pada alam dan teknologi. 🌿
          </p>

          <!-- Skills -->
          <div class="dev-skills">
            <span class="skill-chip">Ionic</span>
            <span class="skill-chip">Angular</span>
            <span class="skill-chip">Capacitor</span>
            <span class="skill-chip">TypeScript</span>
            <span class="skill-chip">Android</span>
            <span class="skill-chip">UI/UX</span>
          </div>

          <div class="dev-divider"></div>

          <!-- Contacts -->
          <div class="dev-contacts">
            <a class="contact-row" href="mailto:fatihikhsan098@gmail.com">
              <div class="c-icon email"><ion-icon name="mail-outline"></ion-icon></div>
              <div class="c-text">
                <span class="c-label">Email</span>
                <span class="c-value">fatihikhsan098&#64;gmail.com</span>
              </div>
              <ion-icon name="chevron-forward-outline" class="c-arrow"></ion-icon>
            </a>
            <a class="contact-row" href="https://instagram.com/upinipinikhsan" target="_blank">
              <div class="c-icon insta"><ion-icon name="logo-instagram"></ion-icon></div>
              <div class="c-text">
                <span class="c-label">Instagram</span>
                <span class="c-value">&#64;upinipinikhsan</span>
              </div>
              <ion-icon name="chevron-forward-outline" class="c-arrow"></ion-icon>
            </a>

          </div>

          <!-- Quote -->
          <div class="dev-quote">
            <span class="q-mark">"</span>
            <p>Kode yang baik adalah kode yang bisa membuat hidup orang lain lebih mudah dan menyenangkan.</p>
            <span class="q-author">— Muhammad Fatih Ikhsan Pradana</span>
          </div>

        </div>
      </div>

      <!-- App Info -->
      <div class="settings-section">
        <p class="settings-section-title">ℹ️ Info Aplikasi</p>
        <ion-list>
          <ion-item>
            <div class="item-icon leaf" slot="start"><ion-icon name="leaf-outline"></ion-icon></div>
            <ion-label>Nama Aplikasi</ion-label>
            <ion-note slot="end">Kebunku</ion-note>
          </ion-item>
          <ion-item>
            <div class="item-icon star" slot="start"><ion-icon name="star-outline"></ion-icon></div>
            <ion-label>Versi</ion-label>
            <ion-note slot="end">1.0.0</ion-note>
          </ion-item>
          <ion-item>
            <div class="item-icon ribbon" slot="start"><ion-icon name="ribbon-outline"></ion-icon></div>
            <ion-label>Framework</ion-label>
            <ion-note slot="end">Ionic + Angular</ion-note>
          </ion-item>
          <ion-item lines="none">
            <div class="item-icon heart" slot="start"><ion-icon name="heart-outline"></ion-icon></div>
            <ion-label>Dibuat dengan ❤️</ion-label>
            <ion-note slot="end">Indonesia 🇮🇩</ion-note>
          </ion-item>
        </ion-list>
      </div>

      <div style="height:50px;"></div>
    </ion-content>
  `,
  styles: [`
    .settings-header { padding: 12px 20px 8px; }
    .page-title { font-size:1.5rem; font-weight:800; color:var(--ion-text-color); margin:0; letter-spacing:-0.03em; font-family:'Plus Jakarta Sans',sans-serif; }
    .page-subtitle { font-size:0.8rem; color:var(--ion-color-medium); margin:2px 0 0; font-weight:500; }

    .app-card {
      margin:8px 16px 24px; padding:20px;
      background:linear-gradient(135deg,var(--kebunku-green-dark),#2D7A42);
      border-radius:24px; display:flex; flex-direction:column; align-items:center;
      text-align:center; gap:12px; box-shadow:0 8px 24px rgba(28,92,46,0.3);
      overflow:hidden; position:relative;
      &::before { content:''; position:absolute; top:-40px; right:-40px; width:120px; height:120px; border-radius:50%; background:rgba(255,255,255,0.06); }
    }
    .app-avatar { width:64px; height:64px; border-radius:18px; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; overflow:hidden; border:2px solid rgba(255,255,255,0.2);
      img { width:52px; height:52px; object-fit:contain; }
    }
    .app-info {
      h2 { font-size:1.4rem; font-weight:800; color:white; margin:0; font-family:'Plus Jakarta Sans',sans-serif; }
      p { font-size:0.8rem; color:rgba(255,255,255,0.7); margin:2px 0 0; }
    }
    .app-stats { display:flex; align-items:center; gap:20px; background:rgba(255,255,255,0.12); border-radius:14px; padding:12px 20px; }
    .stat { display:flex; flex-direction:column; align-items:center; gap:2px;
      .stat-value { font-size:1.2rem; font-weight:800; color:white; }
      .stat-label { font-size:0.68rem; color:rgba(255,255,255,0.7); font-weight:600; }
    }
    .stat-divider { width:1px; height:28px; background:rgba(255,255,255,0.2); }

    .settings-section { margin:0 16px 20px; }
    .settings-section-title { font-size:0.72rem; font-weight:700; color:var(--ion-color-medium); letter-spacing:0.08em; text-transform:uppercase; padding:0 4px; margin:0 0 8px; }

    ion-list { border-radius:18px; overflow:hidden; box-shadow:0 2px 12px rgba(28,92,46,0.07); background:var(--kebunku-surface) !important; padding:0 !important; }
    ion-item {
      --background:var(--kebunku-surface); --border-color:rgba(0,0,0,0.05);
      --padding-start:0; --inner-padding-start:16px; --inner-padding-end:16px;
      font-size:0.93rem; font-weight:600; color:var(--ion-text-color);
      ion-label { font-weight:600;
        ion-note { display:block; font-size:0.72rem; color:var(--ion-color-medium); margin-top:2px; font-weight:400; }
      }
      ion-note[slot="end"] { font-size:0.8rem; font-weight:600; color:var(--ion-color-medium); }
      &.active-item { --background:var(--kebunku-green-ultra-pale); }
    }

    .item-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin:10px 12px 10px 16px; flex-shrink:0; font-size:1.05rem;
      &.sun { background:#FFF9C4; ion-icon { color:#F57F17; } }
      &.moon { background:#EDE7F6; ion-icon { color:#5E35B1; } }
      &.device { background:#E3F2FD; ion-icon { color:#1565C0; } }
      &.notif { background:var(--kebunku-green-ultra-pale); ion-icon { color:var(--kebunku-green-dark); } }
      &.leaf { background:var(--kebunku-green-ultra-pale); ion-icon { color:var(--kebunku-green-dark); } }
      &.heart { background:#FFEBEE; ion-icon { color:#E53935; } }
      &.star { background:#FFF8E1; ion-icon { color:#F9A825; } }
      &.ribbon { background:#E8F5E9; ion-icon { color:#2E7D32; } }
    }
    .check { font-size:1.3rem; color:var(--kebunku-green-dark); }
    .chevron { font-size:0.9rem; color:var(--ion-color-medium); opacity:0.4; }

    /* DEVELOPER CARD */
    .dev-card {
      background:var(--kebunku-surface);
      border-radius:24px; padding:28px 20px;
      box-shadow:0 4px 20px rgba(28,92,46,0.10);
      display:flex; flex-direction:column; align-items:center; gap:18px;
    }

    .dev-photo-wrapper {
      position:relative; width:120px; height:120px;
    }
    .dev-photo {
      width:120px; height:120px; border-radius:50%; object-fit:cover;
      border:4px solid var(--kebunku-green-ultra-pale);
      display:block; position:relative; z-index:2;
    }
    .dev-photo-ring {
      position:absolute; inset:-8px; border-radius:50%;
      border:2.5px dashed var(--kebunku-green-light);
      animation:spin-slow 12s linear infinite;
      z-index:1;
    }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

    .dev-identity { text-align:center;
      .dev-name { font-size:1.15rem; font-weight:800; color:var(--ion-text-color); margin:0 0 8px; letter-spacing:-0.02em; line-height:1.3; }
      .dev-title-badge { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:20px; background:var(--kebunku-green-ultra-pale); color:var(--kebunku-green-dark); font-size:0.8rem; font-weight:700;
        ion-icon { font-size:0.95rem; }
      }
    }

    .dev-bio { font-size:0.87rem; color:var(--ion-color-medium); line-height:1.7; text-align:center; margin:0; }

    .dev-skills { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
    .skill-chip { padding:5px 14px; border-radius:20px; background:var(--kebunku-green-ultra-pale); color:var(--kebunku-green-dark); font-size:0.75rem; font-weight:700; }

    .dev-divider { width:100%; height:1px; background:rgba(0,0,0,0.06); }

    .dev-contacts { width:100%; display:flex; flex-direction:column; gap:10px; }
    .contact-row {
      display:flex; align-items:center; gap:14px; padding:12px 14px;
      border-radius:14px; background:var(--kebunku-surface-2);
      text-decoration:none; cursor:pointer; transition:all 0.2s ease;
      &:active { transform:scale(0.98); opacity:0.85; }
    }
    .c-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.15rem; flex-shrink:0;
      &.email { background:#FCE4EC; ion-icon { color:#E91E63; } }
      &.insta { background:linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); ion-icon { color:white; } }
    }
    .c-text { display:flex; flex-direction:column; gap:2px; flex:1;
      .c-label { font-size:0.68rem; font-weight:700; color:var(--ion-color-medium); text-transform:uppercase; letter-spacing:0.06em; }
      .c-value { font-size:0.87rem; font-weight:600; color:var(--ion-text-color); }
    }
    .c-arrow { font-size:0.85rem; color:var(--ion-color-medium); opacity:0.4; }

    .dev-quote {
      background:var(--kebunku-green-ultra-pale);
      border-left:3px solid var(--kebunku-green-dark);
      border-radius:0 14px 14px 0; padding:16px 16px 14px; width:100%; position:relative;
      .q-mark { font-size:2.5rem; font-family:'Plus Jakarta Sans',sans-serif; color:var(--kebunku-green-dark); opacity:0.25; line-height:0; position:absolute; top:22px; left:10px; }
      p { font-size:0.85rem; color:var(--ion-text-color); line-height:1.65; font-style:italic; margin:0 0 8px; padding-left:18px; font-weight:500; }
      .q-author { font-size:0.72rem; font-weight:700; color:var(--kebunku-green-dark); display:block; padding-left:18px; }
    }

  `]
})
export class SettingsPage implements OnInit, OnDestroy {
  currentTheme: Theme = 'system';
  notifEnabled = true;
  totalPlants = 0;
  favoritesCount = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private plantService: PlantService,
    private toastCtrl: ToastController
  ) {
    addIcons({
      moonOutline, sunnyOutline, phonePortraitOutline,
      notificationsOutline, informationCircleOutline,
      leafOutline, heartOutline, checkmarkCircleOutline,
      chevronForwardOutline, codeSlashOutline, mailOutline,
      logoInstagram, logoLinkedin, globeOutline,
      ribbonOutline, starOutline
    });
  }

  ngOnInit() {
    this.totalPlants = this.plantService.plants.length;
    this.themeService.theme$.pipe(takeUntil(this.destroy$)).subscribe(t => this.currentTheme = t);
    this.plantService.bookmarks$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.favoritesCount = this.plantService.getBookmarkedPlants().length;
    });
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  async setTheme(theme: Theme) {
    await this.themeService.setTheme(theme);
    const labels: Record<Theme, string> = { light:'☀️ Mode Terang aktif', dark:'🌙 Mode Gelap aktif', system:'📱 Mengikuti tema sistem' };
    const toast = await this.toastCtrl.create({ message: labels[theme], duration: 1800, position: 'bottom' });
    await toast.present();
  }

  async toggleNotification(event: any) {
    this.notifEnabled = event.detail.checked;
    if (this.notifEnabled) {
      await this.notificationService.scheduleDailyWateringNotification();
      const t = await this.toastCtrl.create({ message: '🔔 Pengingat diaktifkan — setiap hari 08:00', duration: 2000, position: 'bottom' });
      await t.present();
    } else {
      await this.notificationService.cancelAll();
      const t = await this.toastCtrl.create({ message: '🔕 Pengingat dinonaktifkan', duration: 2000, position: 'bottom' });
      await t.present();
    }
  }
}

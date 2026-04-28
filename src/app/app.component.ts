import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, CommonModule],
  template: `
    <div class="splash-overlay" [class.hidden]="splashHidden">
      <div class="splash-logo-wrapper">
        <img src="assets/icon/logo_kebunku.png" class="splash-logo" alt="Kebunku" />
      </div>
      <span class="splash-wordmark">kebunku</span>
      <span class="splash-tagline">Teman hijau setiap hari 🌿</span>
    </div>
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent implements OnInit {
  splashHidden = false;

  constructor(
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    setTimeout(() => { this.splashHidden = true; }, 2800);
    if (Capacitor.isNativePlatform()) {
      await SplashScreen.hide({ fadeOutDuration: 500 });
    }
    await this.notificationService.scheduleDailyWateringNotification();
  }
}

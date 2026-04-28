import { Component } from '@angular/core';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  leafOutline, leaf,
  bookmarkOutline, bookmark,
  settingsOutline, settings
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon name="leaf-outline" aria-hidden="true"></ion-icon>
          <ion-label>Tanaman</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="favorites" href="/favorites">
          <ion-icon name="bookmark-outline" aria-hidden="true"></ion-icon>
          <ion-label>Favorit</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="settings" href="/settings">
          <ion-icon name="settings-outline" aria-hidden="true"></ion-icon>
          <ion-label>Pengaturan</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `
})
export class TabsComponent {
  constructor() {
    addIcons({
      leafOutline, leaf,
      bookmarkOutline, bookmark,
      settingsOutline, settings
    });
  }
}

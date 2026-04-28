import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('system');
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  private async initTheme() {
    const { value } = await Preferences.get({ key: 'kebunku_theme' });
    const theme = (value as Theme) || 'system';
    this.applyTheme(theme);
  }

  async setTheme(theme: Theme) {
    await Preferences.set({ key: 'kebunku_theme', value: theme });
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme) {
    this.themeSubject.next(theme);
    const body = document.body;

    body.classList.remove('dark', 'light');

    if (theme === 'dark') {
      body.classList.add('dark');
    } else if (theme === 'light') {
      body.classList.add('light');
    } else {
      // system: respect prefers-color-scheme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) body.classList.add('dark');
    }
  }

  get currentTheme(): Theme {
    return this.themeSubject.getValue();
  }

  isDark(): boolean {
    return document.body.classList.contains('dark');
  }
}

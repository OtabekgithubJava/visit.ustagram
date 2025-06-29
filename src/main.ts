import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';
import { bootstrapApplication } from '@angular/platform-browser';


platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));


bootstrapApplication(AppModule);
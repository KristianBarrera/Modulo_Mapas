import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
 
Mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc3RpYW5ibSIsImEiOiJjbDJhMjRta2UwMTY3M2pxbjc3dXVyNGowIn0.wjifkUbT-OiOWrZdoATM3Q';

if ( !navigator.geolocation) { 
  alert ('Navegador no soportado');
  throw new Error ('Navegador no soportado');
}


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

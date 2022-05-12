import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userlocation?: [number,number];
  
  get isUserLocationReady(): boolean{
    return !!this.userlocation;
  }
  constructor() {
    this.getUserLocation();
   }

  public async getUserLocation(): Promise<[number,number]>{

    return new Promise( (resolve,reject) => {

      navigator.geolocation.getCurrentPosition(
      ({coords}) =>{
        this.userlocation = [coords.longitude,coords.latitude];
        resolve ( this.userlocation);
      },
       ( err ) => {
         alert('NO se pudo obtener la GeoLocalizacion')
         console.log(err);
         reject();
       }
        );
  });
}
}
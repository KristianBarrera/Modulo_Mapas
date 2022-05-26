import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userlocation?: [number,number];
  
  get isUserLocationReady(): boolean{
    return !!this.userlocation;
  }
  constructor(private http: HttpClient) {
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

getPlacesByQuery( query: string = ''){
// todo: evaluar cuando el query es nulo

this.http.get('https://api.mapbox.com/geocoding/v5/mapbox.places/${ query }.json?country=mx&limit=5&proximity=-99.08664723141652%2C19.54135850478943&types=place%2Cpostcode%2Caddress&language=es&access_token=pk.eyJ1IjoiY2FybG9zZ2FyY2lhOTgiLCJhIjoiY2wzbjBuZjVzMDRpbjNkcWcxdzJoZHNrayJ9.11PXHyB0xPLBmKSwY-i1bQ')


}

}
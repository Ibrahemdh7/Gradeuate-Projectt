import { Capacitor } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
// https://capacitorjs.com/docs/apis/geolocation Docs Docs   

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  async getCurrentLocation() {
    //vaildation 
    if(!Capacitor.isPluginAvailable('Geolocation')) {
      return;
    }
    const options: PositionOptions = {
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: false
    };
    return await Geolocation.getCurrentPosition(options);
  }
}

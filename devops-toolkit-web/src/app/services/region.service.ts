import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  @Output() regionEvent: EventEmitter<any> = new EventEmitter();

  public setRegion(region: string) {
    sessionStorage.setItem("region", region);
    this.regionEvent.emit(region);
  }

  public getRegion(): string {
    let region = sessionStorage.getItem("region") + "";
    if(!region || region == 'null') {
      region = "ap-southeast-2";
      this.setRegion(region);
    }
    return region;
  }
}

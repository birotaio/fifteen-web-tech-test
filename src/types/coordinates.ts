export class Coordinates {
  lng!: number;
  lat!: number;

  constructor(lgn: number, lat: number) {
    this.lng = lgn;
    this.lat = lat;
  }
  toArray() {
     return [this.lng, this.lat];
  }
}

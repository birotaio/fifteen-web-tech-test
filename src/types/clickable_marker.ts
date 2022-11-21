import { Marker } from 'mapbox-gl';

export default class ClickableMarker extends Marker {
  [x: string]: any;
  
  onClick(handleClick: any) {
    this._handleClick = handleClick;
    return this;
  }
  _onMapClick(e: { originalEvent: { target: any; }; }) {
    const targetElement = e.originalEvent.target;
    const element = this._element;

    if (this._handleClick && (targetElement === element || element.contains((targetElement)))) {
      this._handleClick();
    }
  }
};




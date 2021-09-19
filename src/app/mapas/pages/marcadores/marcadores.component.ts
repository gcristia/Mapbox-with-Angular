import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as mapboxgl from "mapbox-gl";

interface MarkerColor {
  color: string;
  marker?: mapboxgl.Marker,
  center?: [number, number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`

    .mapa-container {
      height: 100%;
      width: 100%;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 5;
    }

    li {
      cursor: pointer;
    }

  `]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  zoomLevelMin: number = 13;
  zoomLevelMax: number = 18;
  center: [number, number] = [-78.11277600198716, 21.848087538935413];

  //Arreglo de marcadores
  markers: MarkerColor[] = [];

  constructor() {
  }

  ngAfterViewInit(): void {

    this.map = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
      minZoom: this.zoomLevelMin,
      maxZoom: this.zoomLevelMax
    });

    this.readMakersLocalStorage();

    // Marcodor personalizado
    /*const markerHTML: HTMLElement = document.createElement('div');
    markerHTML.innerHTML = 'Hola mundo';

    const marker = new mapboxgl.Marker({
      element: markerHTML
    })
      .setLngLat(this.center)
      .addTo(this.mapa);*/

  }

  toMarker(marker: mapboxgl.Marker) {

    const {lng, lat} = marker.getLngLat();

    this.map.flyTo({
      center: [lng, lat]
    });
  }

  addMarker() {

    const color = "#xxxxxx".replace(/x/g, () => (Math.random() * 16 | 0).toString(16));

    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color
    }).setLngLat(this.center)
      .addTo(this.map);

    this.markers.push({
      color: color,
      marker: newMarker
    });

    this.saveMarkersLocalStorage();

    newMarker.on('dragend',()=>{
      this.saveMarkersLocalStorage();
    })
  }

  saveMarkersLocalStorage() {

    const lngLatArr: MarkerColor[] = [];

    this.markers.forEach(m => {
      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();

      lngLatArr.push({
        color,
        center: [lng, lat],
      });
    });

    localStorage.setItem('markers', JSON.stringify(lngLatArr));
  }

  readMakersLocalStorage() {
    if (localStorage.getItem('markers')) {
      return;
    }

    const lngLatArr: MarkerColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach(m=>{
      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color: m.color
      }).setLngLat(m.center!)
        .addTo(this.map);

      this.markers.push({
        marker: newMarker,
        color: m.color
      })

      newMarker.on('dragend',()=>{
        this.saveMarkersLocalStorage();
      })
    });

  }

  removeMaker(index: number){
     this.markers[index].marker?.remove();
     this.markers.splice(index,1);
     this.saveMarkersLocalStorage();
  }


}

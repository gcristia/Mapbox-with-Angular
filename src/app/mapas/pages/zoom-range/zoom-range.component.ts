import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as mapboxgl from "mapbox-gl";

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .row {
        background-color: white;
        border-radius: 5px;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        position: fixed;
        z-index: 5;
        width: 400px;
      }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit,OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  zoomLevelMin: number = 13;
  zoomLevelMax: number = 18;
  center: [number, number] = [-78.11277600198716, 21.848087538935413];

  constructor() {
  }

  ngOnDestroy(): void {
     this.mapa.off('zoom',()=>{});
     this.mapa.off('zoomend',()=>{});
     this.mapa.off('move',()=>{});
  }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
      minZoom: this.zoomLevelMin,
      maxZoom: this.zoomLevelMax
    });

    //Zoom
    this.mapa.on("zoom", () => {
      this.zoomLevel = this.mapa.getZoom();
    });

    //Movimiento del mapa
    this.mapa.on("move", (event) => {
      const target = event.target;
      const {lng, lat} = target.getCenter();
      this.center = [lng, lat];

    });

  }

  zoomOut() {
    this.mapa.zoomOut();
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomChange(valor: string) {
    this.mapa.zoomTo(Number(valor));
  }


}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {GeojsonService} from 'src/app/geojson.service';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {WFS, GeoJSON} from 'ol/format';
import {get as getProjection} from 'ol/proj';
import {getWidth} from 'ol/extent';
import TileGrid from 'ol/tilegrid/TileGrid';
import VectorSource from 'ol/source/Vector';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import TileWMS from 'ol/source/TileWMS';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
  respuestaValidador: any;
  map: Map;

  constructor(public dialogRef: MatDialogRef<ModalComponent>,
              private GeojsonService: GeojsonService) {
                this.respuestaValidador = [
                  {
                    isValid: null
                  }
                ];
               }

  ngOnInit() {
    var projExtent = getProjection('EPSG:3857').getExtent();
    var startResolution = getWidth(projExtent) / 256;
    var resolutions = new Array(22);
    for (var i = 0, ii = resolutions.length; i < ii; ++i) {
      resolutions[i] = startResolution / Math.pow(2, i);
    }
    var tileGrid = new TileGrid({
      extent: [-20026376.39, -20048966.10, 20026376.39, 20048966.10],
      resolutions: resolutions,
      tileSize: [512, 256]
    });

    var layers = [
      new TileLayer({
        source: new TileWMS({
          url: 'https://sat.proadmintierra.info/geoserver/LADM/wms',
          params: {'LAYERS': 'LMTEDPTM', 'TILED': true},
          serverType: 'geoserver',
          tileGrid: tileGrid
        })
      }),
      new TileLayer({
        source: new TileWMS({
          url: 'https://sat.proadmintierra.info/geoserver/LADM/wms',
          params: {'LAYERS': 'LMTEMPIO', 'TILED': true},
          serverType: 'geoserver',
          tileGrid: tileGrid
        })
      }),
      new TileLayer({
        source: new TileWMS({
          url: 'https://sat.proadmintierra.info/geoserver/LADM/wms',
          params: {'LAYERS': 'LMTEVERE', 'TILED': true},
          serverType: 'geoserver',
          tileGrid: tileGrid
        })
      }),
      new TileLayer({
        source: new TileWMS({
          url: 'https://sat.proadmintierra.info/geoserver/LADM/wms',
          params: {'LAYERS': 'LMTECURB', 'TILED': true},
          serverType: 'geoserver',
          tileGrid: tileGrid
        })
      })];

    var raster = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      })
    });

    this.map = new Map({
      target: 'map',
      layers: [raster, layers[0], layers[1], layers[2], layers[3]],
      view: new View({
        center: [-8244772.758, 536268.976],
        zoom: 8
      })
    });

    var params = layers[1].getSource().getParams();
    params.cql_filter = "DPTO_CCDGO IN ('25')";
    layers[1].getSource().updateParams(params);

    var params = layers[2].getSource().getParams();
    params.cql_filter = "DPTOMPIO IN ('25269')";
    layers[2].getSource().updateParams(params);

    var params = layers[3].getSource().getParams(); 
    params.cql_filter = "DPTO_CCDGO IN ('25') AND MPIO_CCDGO IN ('269')";
    layers[3].getSource().updateParams(params);

    console.log(layers[3].getExtent());
  }

  actionFunction() {
    alert("You have logged out.");
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

  cargandoJson(files: FileList) {

    this.GeojsonService.postGeoJson(files[0]).subscribe(
      response => {
        this.respuestaValidador = response;
        console.log(this.map);
        var styles = [  
        new Style({
          image: new CircleStyle({
            fill: new Fill({
              color: 'orange'
            }),
            radius: 5,
            rotation: Math.PI / 4,
            angle: 0
          })
        })]

        var vectorSource = new VectorSource({
          features: (new GeoJSON()).readFeatures(response)
        });

        var vectorLayer = new VectorLayer({
          source: vectorSource,
          style: styles
        });

        this.map.addLayer(vectorLayer);

      }
    )
  }
}
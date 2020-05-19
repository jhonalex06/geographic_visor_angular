import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeojsonService {

  url: string;
  constructor(private httpClient: HttpClient) {
    this.url = 'http://127.0.0.1:8000/convertidor/';
  }

  /**
   * postFileGeoJson
   */
  public postGeoJson(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(this.url, formData);
  }

}

import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileModel } from '../models/file.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private baseUrl = 'https://prod-15.brazilsouth.logic.azure.com:443/workflows/90492f8ec3f1424e8a504dee74802fa8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=05zXm4-m2Q8i2teK2cIPy8PeU-MMI_xR2lFZiBBe8NM';
  // private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  upload(files: FileModel[], datosiniciales:FormGroup,datosprincipales:FormGroup): Observable<any> {
    return this.http.post(`${this.baseUrl}`, {files, datosiniciales,datosprincipales})
  }
}

// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  get(apiRoute: string, query?: any): Observable<any> {
    return this.http.get(`${environment.url}/${apiRoute}`, {
      params: query,
      headers: this.getHeaders()
    });
  }

  getById(apiRoute: string, id: any): Observable<any> {
    return this.http.get(`${environment.url}/${apiRoute}/${id}`, {
      headers: this.getHeaders()
    });
  }

  post(apiRoute: string, data: any): Observable<any> {
    return this.http.post(`${environment.url}/${apiRoute}`, data, {
      headers: this.getHeaders()
    });
  }

  put(apiRoute: string, id: any, data: any): Observable<any> {
    return this.http.put(`${environment.url}/${apiRoute}/${id}`, data, {
      headers: this.getHeaders()
    });
  }

  delete(apiRoute: string, id: any): Observable<any> {
    return this.http.delete(`${environment.url}/${apiRoute}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
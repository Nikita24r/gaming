import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service'; 
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface ContactForm {
  _id: string;
  name: string;
  email: string;
  contact: number;
  city: string;
  age: number;
  schedule_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = `${environment.url}/contact`;

  constructor(private httpClient: HttpClient, private tokenService: TokenService) {}

  // Get all contact forms
  onContactGetAll(): Observable<ContactForm[]> {
    const token = this.tokenService.getToken(); // Retrieve token from TokenService
    console.log('Token used for request:', token); // Log the token for debugging
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<ContactForm[]>(this.apiUrl, { headers });
  }
  
  // Delete a specific contact form by ID
  onContactDelete(id: string): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token ? token : ''}`);
    return this.httpClient.delete(`${this.apiUrl}/${id}`, { headers });
  }
  
  // Find a specific contact form by ID
  onContactFindOne(id: string): Observable<ContactForm> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token ? token : ''}`);
    return this.httpClient.get<ContactForm>(`${this.apiUrl}/${id}`, { headers });
  }
  
  // Update a specific contact form by ID
  onContactUpdate(id: string, form: ContactForm): Observable<ContactForm> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token ? token : ''}`);
    return this.httpClient.put<ContactForm>(`${this.apiUrl}/${id}`, form, { headers });
  }
  
  // Delete all contact forms
  onContactDeleteAll(): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token ? token : ''}`);
    return this.httpClient.delete(this.apiUrl, { headers });
  }
}

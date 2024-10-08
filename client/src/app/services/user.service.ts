import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { constants } from "../constants";
import { Observable } from "rxjs";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUserId(): string {
    const user_token = localStorage.getItem('user_token');

    if (!user_token) {
      throw new Error('No user token found');
    }

    const decodedToken = jwtDecode(user_token);

    return decodedToken.sub as string;
  }

  getUserData(): Observable<any> {
    const userId = this.getUserId();

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.http.get(`${constants.API_URL}/user/${userId}`, { headers });
  }

  getUserDataById(userId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  
    return this.http.get(`${constants.API_URL}/user/${userId}`, { headers });
  }
}
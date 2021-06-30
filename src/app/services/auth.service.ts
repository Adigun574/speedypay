import { Injectable, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { map, tap, delay, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


interface LoginResult {
  userName: string;
  role: string;
  fullName: string;
  accessToken: string;
  refreshToken: string;
  userId: any;
  emailAddress: string;
  functions: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {


  private readonly apiUrl = `${environment.apiUrl}`;
  private timer: Subscription;
  private _user = new BehaviorSubject<any>(null);


  constructor(
    private router: Router, 
    private http: HttpClient, 
    ) {
  }


  ngOnDestroy(): void {
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResult>(`${this.apiUrl}AdminAuthentication/AdminAuthentication`, { username, password })
      .pipe(
        map((x) => {
          // console.log(x)
          this._user.next({
            username: x.userName,
            role: x.role,
            FullName: x.fullName,
            UserId: x.userId,
            Email: x.emailAddress,
            Functions: x.functions,
          });

          this.setLocalStorage(x);
          this.startTokenTimer();

          return x;
        }),
   
      );
  }


  logout() {
    this.clearLocalStorage();
    this._user.next(null);
    this.stopTokenTimer();
    this.router.navigate(['/']);
    // this.http
    //   .post<unknown>(`${this.apiUrl}/logout`, {})
    //   .pipe(
    //     finalize(() => {

    //       this.clearLocalStorage();
    //       this._user.next(null);
    //       this.stopTokenTimer();
    //       this.router.navigate(['/']);
    //     })
    //   )
    //   .subscribe();
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('nib_officer_refresh_token');
    // console.log(refreshToken)
    if (!refreshToken) {
      this.clearLocalStorage();
      return of(null);
    }

    let auth_token = localStorage.getItem('nib_officer_access_token')

    // console.log(auth_token)

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    })
    let opts = {headers:headers}

    // return this.http
    this.http
      .post<LoginResult>(`${this.apiUrl}Authentication/RefreshToken`, { refreshToken }, opts)
      .pipe(
        map((x) => {
          console.log(x)
          // console.log('refreshing token 2')
          localStorage.setItem('nib_officer_access_token', x.accessToken);
          localStorage.setItem('nib_officer_refresh_token', x.refreshToken);
          // this.setLocalStorage(x)
          this.startTokenTimer();
          return x;
        })
      )
      .subscribe(v => {}, (err: HttpErrorResponse) => {
        //hand error here
        console.log(err)
        this.router.navigateByUrl('/')
        }
      );
      ;
  }

  setLocalStorage(x: LoginResult) {
    localStorage.setItem('nib_officer_altHomeUser', JSON.stringify(x))
    localStorage.setItem('nib_officer_refresh_token', x.refreshToken)
    localStorage.setItem('nib_officer_access_token', x.accessToken)
  }

  clearLocalStorage() {
    localStorage.removeItem('nib_officer_altHomeUser')
    localStorage.removeItem('nib_officer_refresh_token')
    localStorage.removeItem('nib_officer_access_token')
    localStorage.setItem('logout-event', 'logout' + Math.random());
  
  }


  private getTokenRemainingTime() {
    const accessToken = JSON.parse(localStorage.getItem('nib_officer_altHomeUser')).accessToken;
    if (!accessToken) {
      return 0;
    }
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    // console.log(expires)
    // console.log(expires.getTime() - Date.now())
    return expires.getTime() - Date.now();
    // return 30000
  }

  startTokenTimer() {
    const timeout = this.getTokenRemainingTime();
    this.timer = of(true)
      .pipe(
        delay(timeout),
        // tap(() => this.refreshToken().subscribe())
        tap(() => this.refreshToken())
      )
      .subscribe();
  }

  private stopTokenTimer() {
    this.timer?.unsubscribe();
  }

  verifyToken(obj){
    return this.http.post(`${this.apiUrl}AdminAuthentication/TokenValidation`, obj)
  }


}
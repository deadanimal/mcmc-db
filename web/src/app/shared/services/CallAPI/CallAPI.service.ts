import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CallAPIService {

  // URL
  public urlMock: string = 'http://ecommdev.esource.my/restapi/api/GetSLP/';

  // Data
  public datas: any = []

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    let urlPath = this.urlMock 
    return this.http.get<any>(urlPath).pipe(
      tap((res) => {
        this.datas = res
        console.log('Data: ', this.datas)
      })
    )
  }

  post(): Observable<any> {
    let urltest = this.urlMock
    return this.http.post<any>(urltest, this.datas).pipe(
      tap((res) => {
        this.datas = res
        console.log("testCall: ", res);
      })
    );
  }

}
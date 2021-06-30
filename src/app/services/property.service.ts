import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  auth_token = localStorage.getItem('nib_officer_access_token')

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.auth_token}`
  })
  opts = {headers:this.headers}

  constructor(
    private httpClient:HttpClient
  ) { }

  getAllProperties(){
    return this.httpClient.get(`${environment.apiUrl}SellProperty/GetAllproperty`, this.opts)
  }

  getPendingApprovalProperties(){
    return this.httpClient.get(`${environment.apiUrl}Approval/ListPendingAprovalproperty`, this.opts)
  }

  getPropertyByID(id){
    return this.httpClient.get(`${environment.apiUrl}SellProperty/GetAllpropertyBYId?Id=${id}`, this.opts)
  }

  getPendingDueDilligenceProperties(){
    return this.httpClient.get(`${environment.apiUrl}Approval/ListPendingDueDeligenceproperty`, this.opts)
  }

  approvePropertyForDueDilligence(obj){
    return this.httpClient.post(`${environment.apiUrl}Approval/ApproveDueDeligence`, obj, this.opts)
  }

  rejectProperty(obj){
    return this.httpClient.post(`${environment.apiUrl}Approval/Rejectproperty`, obj, this.opts)
  }

  deleteProperty(obj){
    return this.httpClient.post(`${environment.apiUrl}SellProperty/deleteproperty`, obj, this.opts)
  }

}

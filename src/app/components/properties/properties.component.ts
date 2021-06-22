import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

  sortPropertiesValue = ''
  filterPropertiesValue = 'null'
  searchKey = ''

  currentPage = 1
  p = 1

  properties = []
  filteredProperties = []
  loading:boolean = false
  pendingApprovalProperties = []
  

  constructor(
    private propertyService:PropertyService,
    private router:Router,
    private excelService:ExcelService
  ) { }

  ngOnInit(): void {
    this.getProperties()
    this.getPendingApprovalProperties()
    this.getPendingDueDilligenceProperties()
  }

  getProperties(){
    this.loading = true
    this.propertyService.getAllProperties().subscribe((data:any)=>{
      console.log(data)
      this.properties = data
      this.filteredProperties = [...this.properties]
      this.loading = false
    },
      err=>{
        console.log(err)
        this.loading = false
      })
  }

  getPendingApprovalProperties(){
    this.propertyService.getPendingApprovalProperties().subscribe((data:any)=>{
      console.log(data)
      this.pendingApprovalProperties = data
    },
      err=>{
        console.log(err)
      })
  }

  getPendingDueDilligenceProperties(){
    this.propertyService.getPendingDueDilligenceProperties().subscribe(data=>{
      console.log(data)
    },
      err=>{
        console.log(err)
      })
  }

  approveForDueDilligence(id){
    let obj = {
      id,
      passedDueDeligence: true,
      passedDueDeligenceReason: "string",
      passedDueDeligenceBy: "string",
      passedDueDate: "2021-06-22T21:12:19.462Z"
    }
    console.log(obj)
    return
    this.loading = true
    this.propertyService.approvePropertyForDueDilligence(obj).subscribe(data=>{
      console.log(data)
      this.loading = false
    },
      err=>{
        console.log(err)
        this.loading = false
      })
  }

  rejectProperty(id){
    let obj = {
      id,
      rejectedDate: "2021-06-22T21:36:39.963Z",
      rejectedBy: "string",
      rejectedReason: "string",
      rejectedStatus: true
    }
    console.log(obj)
    return
    this.loading = true
    this.propertyService.rejectProperty(obj).subscribe(data=>{
      console.log(data)
      this.loading = false
    },
      err=>{
        console.log(err)
        this.loading = false
      })
  }



  goToPropertyDetails(id){
    this.router.navigateByUrl(`/main/properties/${id}`)
  }

  exportAsXLSX(){
    let newPropertiesArray = [...this.properties]
    console.log(newPropertiesArray)
    this.excelService.exportAsExcelFile(newPropertiesArray, 'NIBS_pending_properties');
  }

  sortUsers(){

  }

  selectFilterUsersParameter(){

  }

  filterBySearchKey(){
    if(!this.searchKey){
      this.filteredProperties = [...this.properties]
      return
    }
    if(this.filterPropertiesValue == 'property'){
      this.filteredProperties = this.properties.filter(x=>x.PropertyTitle.toLowerCase().includes(this.searchKey.toLowerCase()))
    }
    else if(this.filterPropertiesValue == 'status'){
      this.filteredProperties = this.properties.filter(x=>x.HouseStatus.toLowerCase().includes(this.searchKey.toLowerCase()))
    }
    else{
      this.filteredProperties = this.properties.filter(x=>x.PropertyTitle.toLowerCase().includes(this.searchKey.toLowerCase()))
    }
  }








}

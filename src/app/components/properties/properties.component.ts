import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { ExcelService } from '../../services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

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
  allProperties = []
  loading:boolean = false
  pendingApprovalProperties = []
  // pendingDueDilligenceProperties = []
  approveReturnMessage = ''
  rejectReturnMessage = ''
  deleteReturnMessage = ''

  

  constructor(
    private propertyService:PropertyService,
    private router:Router,
    private excelService:ExcelService,
    private modalService:NgbModal
  ) { }

  ngOnInit(): void {
    this.getProperties()
    this.getPendingApprovalProperties()
    this.getPendingDueDilligenceProperties()
  }

  open(content){
    this.modalService.open(content, {centered:true})
  }

  dismissModal(){
    this.modalService.dismissAll()
  }

  getProperties(){
    this.propertyService.getAllProperties().subscribe((data:any)=>{
      this.allProperties = data
    },
      err=>{
        console.log(err)
        this.loading = false
      })
  }

  getPendingApprovalProperties(){
    this.propertyService.getPendingApprovalProperties().subscribe((data:any)=>{
      this.pendingApprovalProperties = data
    },
      err=>{
        console.log(err)
      })
  }

  getPendingDueDilligenceProperties(){
    this.loading = true
    this.propertyService.getPendingDueDilligenceProperties().subscribe((data:any)=>{
      this.properties = data
      this.filteredProperties = [...this.properties]
      this.loading = false
    },
      err=>{
        console.log(err)
        this.loading = false
      })
  }

  approveForDueDilligence(id, modal){
    let obj = {
      id,
      passedDueDeligence: true,
      passedDueDeligenceReason: "string",
      passedDueDeligenceBy: "string",
      passedDueDate: "2021-06-22T21:12:19.462Z"
    }
    this.loading = true
    this.propertyService.approvePropertyForDueDilligence(obj).subscribe((data:any)=>{
      console.log(data)
      this.getPendingDueDilligenceProperties()
      this.approveReturnMessage = data?.message
      this.open(modal)
      this.loading = false
    },
      err=>{
        console.log(err)
        this.loading = false
        Swal.fire({
          title: 'Oops!',
          text: 'Something went wrong',
          icon: 'error',
          confirmButtonText: 'Okay'
        })
      })
  }

  rejectProperty(id, modal){
    let obj = {
      id,
      rejectedDate: "2021-06-22T21:36:39.963Z",
      rejectedBy: "string",
      rejectedReason: "string",
      rejectedStatus: true
    }
    this.loading = true
    this.propertyService.rejectProperty(obj).subscribe((data:any)=>{
      this.getPendingDueDilligenceProperties()
      this.rejectReturnMessage = data?.message
      this.open(modal)
      this.loading = false
    },
      err=>{
        console.log(err)
        this.loading = false
        Swal.fire({
          title: 'Oops!',
          text: 'Something went wrong',
          icon: 'error',
          confirmButtonText: 'Okay'
        })
      })
  }

  deleteProperty(id,modal){
    let obj = {
      id
    }
    this.loading = true
    this.propertyService.deleteProperty(obj).subscribe((data:any)=>{
      console.log(data)
      this.getPendingDueDilligenceProperties()
      this.deleteReturnMessage = data?.message
      this.open(modal)
      this.loading = false
    },
      err=>{
        console.log(err)
        this.loading = false
        Swal.fire({
          title: 'Oops!',
          text: 'Something went wrong',
          icon: 'error',
          confirmButtonText: 'Okay'
        })
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
      this.filteredProperties = this.properties.filter(x=>x.propertyTitle.toLowerCase().includes(this.searchKey.toLowerCase()))
    }
    else if(this.filterPropertiesValue == 'status'){
      this.filteredProperties = this.properties.filter(x=>x.houseStatus.toLowerCase().includes(this.searchKey.toLowerCase()))
    }
    else{
      this.filteredProperties = this.properties.filter(x=>x.propertyTitle.toLowerCase().includes(this.searchKey.toLowerCase()))
    }
  }
  
}

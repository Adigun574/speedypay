import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit {

  propertyID
  loading:boolean = false
  propertyDetails 
  propertyImages = []
  currentImageIndex = 0
  currentDocumentImgSrc = ''
  approveReturnMessage = ''
  rejectReturnMessage = ''
  deleteReturnMessage = ''
  showInfo:boolean = true



  constructor(
    private route:ActivatedRoute,
    private propertyService:PropertyService,
    private modalService:NgbModal,
    private router:Router
  ) { 
    this.route.paramMap.subscribe((param:any)=> this.propertyID = param.params.id)
  }

  ngOnInit(): void {
    this.getPropertyByID()
  }

  open(content){
    this.modalService.open(content, {centered:true})
  }

  dismissModal(){
    this.modalService.dismissAll()
    this.goBackToProperties()
  }

  openDocument(doc, modal){
    this.currentDocumentImgSrc = doc
    this.open(modal)
  }

  showInfoTab(){
    this.showInfo = true
  }

  showDocumentTab(){
    this.showInfo = false
  }

  getPropertyByID(){
    this.loading = true
    this.propertyService.getPropertyByID(this.propertyID).subscribe((data:any)=>{
      console.log(data)
      this.propertyDetails = data[0]
      if(data.length<1){
        this.router.navigateByUrl('/main/properties')
        return
      }
      this.propertyImages[0] = this.propertyDetails.FrontViewHousePicture
      this.propertyImages[1] = this.propertyDetails.RearViewHousePicture
      this.propertyImages[2] = this.propertyDetails.SideViewHousePicture
      this.loading = false
    },
      err=>{
        console.log(err)
        this.loading = false
      })
  }

  approveForDueDilligence(modal){
    let obj = {
      id:+this.propertyID,
      passedDueDeligence: true,
      passedDueDeligenceReason: "string",
      passedDueDeligenceBy: "string",
      passedDueDate: "2021-06-22T21:12:19.462Z"
    }
    console.log(obj)
    this.loading = true
    this.propertyService.approvePropertyForDueDilligence(obj).subscribe((data:any)=>{
      console.log(data)
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

  rejectProperty(modal){
    let obj = {
      id:+this.propertyID,
      rejectedDate: "2021-06-22T21:36:39.963Z",
      rejectedBy: "string",
      rejectedReason: "string",
      rejectedStatus: true
    }
    console.log(obj)
    this.loading = true
    this.propertyService.rejectProperty(obj).subscribe((data:any)=>{
      console.log(data)
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

  deleteProperty(modal){
    let obj = {
      id:+this.propertyID
    }
    console.log(obj)
    this.loading = true
    this.propertyService.deleteProperty(obj).subscribe((data:any)=>{
      console.log(data)
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

  goBackToProperties(){
    this.router.navigateByUrl('/main/properties')
  }


  truncateDate(date){
    if(!date || date == ''){
      return '--'
    }
    let a = date.split(' ')
    return `${a[1]} ${a[2]} ${a[3]}`
  }

}

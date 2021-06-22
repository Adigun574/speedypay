import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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


  constructor(
    private route:ActivatedRoute,
    private propertyService:PropertyService
  ) { 
    this.route.paramMap.subscribe((param:any)=> this.propertyID = param.params.id)
  }

  ngOnInit(): void {
    this.getPropertyByID()
  }

  getPropertyByID(){
    this.loading = true
    this.propertyService.getPropertyByID(this.propertyID).subscribe((data:any)=>{
      console.log(data)
      this.propertyDetails = data[0]
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

  approveForDueDilligence(){
    let obj = {
      id:this.propertyID,
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

  rejectProperty(){
    let obj = {
      id:this.propertyID,
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


  truncateDate(date){
    if(!date || date == ''){
      return '--'
    }
    let a = date.split(' ')
    return `${a[1]} ${a[2]} ${a[3]}`
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup
  loginFailed:boolean = false
  loading:boolean = false
  mtoken = ''

  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private modalService:NgbModal
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  open(content){
    this.modalService.open(content,{centered:true})
  }

  login(mtokenmodal){
    if(this.loginForm.invalid) return
    this.loading = true
    this.loginFailed = false
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe((data:any)=>{
      this.loading = false
      if(data.refreshToken){
        Swal.fire({
          icon: 'success',
          title: 'Insert your mToken to gain access',
          text: 'click ok to continue',
        })
        .then(res=>{
          if(res.isConfirmed){
            //mtoken modal
            this.open(mtokenmodal)
          }
        })
      }
      else if(!data.loginStatus){
        //login failed
        this.loginFailed = true
      }
    },
      err=>{
        this.loading = false
      })
  }

  verifyToken(){
    this.modalService.dismissAll()
    if(!this.mtoken) return
    this.loading = true
    let obj = {
      username:this.loginForm.value.username,
      otp:this.mtoken
    }
    this.authService.verifyToken(obj).subscribe((data:any)=>{
      this.loading = false
      this.mtoken = ''
      if(data.isSuccess){
        this.router.navigateByUrl('/main/properties')
        return
      }
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
      })
    },
      err=>{
        this.loading = false
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
        })
        console.log(err)
      })
  }


}

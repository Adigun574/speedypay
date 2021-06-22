import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  currentUrl

  constructor(
    private router:Router,
    private authService:AuthService
  ) { 
    this.router.events.subscribe((event:any) => {
      this.currentUrl = event.url
    })
  }

  ngOnInit(): void {
  }

  logout(){
    this.authService.logout()
  }


}

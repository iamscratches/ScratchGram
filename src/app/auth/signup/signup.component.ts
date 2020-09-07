import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {

  isLoading = false;
  private authStatusSubs: Subscription;

  constructor(public authService: AuthService) { }

  onSignup(forms: NgForm){
    //console.log(forms.value);
    if(forms.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(forms.value.email, forms.value.password);
  }

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(authStatus =>{
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

}

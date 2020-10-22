import { Component, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{ 

  minutesDisplay = 0;
  secondsDisplay = 0;
  title;
  userpower = 100;
  dragonpower = 100;
  logs = [];
  //counter;
  count = 10;
  checktimer = true;
  endTime = 1;
  unsubscribe$: Subject<void> = new Subject();
  timerSubscription: Subscription;
  startGame = false;
  email;
  //localStorage.setItem('email', this.loginForm.get('email').value);
  ngOnInit() {
    this.email = localStorage.getItem('email');

  }
    resetTimer(endTime: number = this.endTime) {

      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }

      //console.log('reset timmer');
      const interval = 1000;
      const duration = endTime * 60;
      //const duration = endTime * 60;
      this.timerSubscription = timer(0, interval).pipe(
        take(duration)
      ).subscribe(value =>
        this.render((duration - +value) * interval),
        err => { },
        () => {
          
          if(this.checktimer){
            //console.log('done');
            this.checkWinner();
          }
  
        }
      )
    }

    private render(count) {
      this.secondsDisplay = this.getSeconds(count);
      this.minutesDisplay = this.getMinutes(count);
      console.log(this.secondsDisplay,this.minutesDisplay)
    }
  
    private getSeconds(ticks: number) {
      const seconds = ((ticks % 60000) / 1000).toFixed(0);
      return this.pad(seconds);
    }
  
    private getMinutes(ticks: number) {
      const minutes = Math.floor(ticks / 60000);
      return this.pad(minutes);
    }
  
    private pad(digit: any) {
      return digit <= 9 ? '0' + digit : digit;
    }

    attack() {

      var ran1 = this.randomIntFromInterval(1,10);
      var ran2 = this.randomIntFromInterval(1,10);
      
      this.userpower = this.userpower - ran1;
      this.dragonpower = this.dragonpower - ran2;

      this.logs.push(this.email+' attack the Monster by '+ran2);
      this.logs.push('Monster attack the '+this.email+' by '+ran1);

      this.checkWinner();
    }

    blast() {

      var ran1 = this.randomIntFromInterval(5,20);
      var ran2 = this.randomIntFromInterval(5,20);
      
      this.userpower = this.userpower - ran1;
      this.dragonpower = this.dragonpower - ran2

      this.logs.push(this.email+' attack the Monster by '+ran2);
      this.logs.push('Monster attack the '+this.email+' by '+ran1);
      
      this.checkWinner();
    }

    heal() {

      var ran1 = this.randomIntFromInterval(1,10);
      this.userpower = this.userpower + ran1;
      this.logs.push(this.email+' Healed by '+ran1);

      var ran2 = this.randomIntFromInterval(1,10);
      this.userpower = this.userpower - ran2;
      this.logs.push('Monster attack the '+this.email+' by '+ran2);

      this.checkWinner();
    }

    giveup() {
      this.logs = [];
      this.userpower = 100;
      this.dragonpower = 100;
      this.checktimer = false;
      this.resetTimer();
      this.startGame = false;
    }

    checkWinner(){
      
      //console.log(this.secondsDisplay);
      
      if(this.secondsDisplay <= 1){
        if(this.userpower > this.dragonpower){
          this.title ='You Win! Play again?';
          this.alertPopup();
        }
        else if(this.userpower < this.dragonpower ){
          this.title ='You Loose! Play again?';
          this.alertPopup();
        }
        else
        {
          this.title ='Game Draw! Play again?';
          this.alertPopup();
          
        }
      }
      
      if(this.userpower <=0 || this.dragonpower <=0 ){
        if(this.userpower > this.dragonpower){
          this.title ='You Win! Play again?';
          this.alertPopup();
        }
        else if(this.userpower < this.dragonpower ){
          this.title ='You Loose! Play again?';
          this.alertPopup();
        }
        else
        {
          this.title ='Game Draw! Play again?';
          this.alertPopup();
          
        }
      }
      
    }

    alertPopup()
    {
      this.checktimer = false;
      this.logs = [];
      Swal.fire({
        title: this.title,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.value) {
          this.userpower = 100;
          this.dragonpower = 100;
          this.resetTimer();
          //this.startCountdown(this.count);
          this.checktimer = true;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log('else');
        }
      })
    }

    randomIntFromInterval(min, max) { // min and max included 
      
      return Math.floor(Math.random() * (max - min) + min);
    }

    start(){
      this.resetTimer();
      this.startGame = true;
    }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DemandeDto } from 'src/app/services/models';
import { DashbordService, DemandeService } from 'src/app/services/services';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  demandes: DemandeDto[] = [];

  displayTime = '00:00:00';
  intervalId: any = null;
  startTimestamp: number | null = null; 
  isRunning = false;

  readonly STORAGE_KEY = 'chronoStartTimestamp';
  readonly STOPPED_TIME_KEY = 'chronoStoppedTime';

  constructor(private demandeService: DemandeService, private dashbordService: DashbordService ){}


  ngOnInit() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const stopped = localStorage.getItem(this.STOPPED_TIME_KEY);
  
    if (saved) {
      this.startTimestamp = parseInt(saved, 10);
      this.startTimer(true);
    } else if (stopped) {
      this.displayTime = this.formatTime(parseInt(stopped, 10));
    }
    this.getAllDemande()
  }


  getAllDemande(){
    this.demandeService.findAllDemande({statut: 'cours'}).subscribe({
      next:(data)=>{
        this.demandes = data;

        if (this.demandes.length > 0 && !this.isRunning && !localStorage.getItem(this.STORAGE_KEY)) {
          this.startTimer();
        } 
      }
    })
  }


 
  startTimer(fromStorage = false) {
    if (this.isRunning) return;

    if (!fromStorage) {
      
      this.startTimestamp = Date.now();
      localStorage.setItem(this.STORAGE_KEY, this.startTimestamp.toString());
    }
    this.isRunning = true;

    this.updateDisplay(); 

    this.intervalId = setInterval(() => {
      this.updateDisplay();
    }, 1000);
  }
  
  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.startTimestamp = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }


  updateDisplay() {
    if (!this.startTimestamp) {
      this.displayTime = '00:00:00';
      return;
    }
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - this.startTimestamp) / 1000);
    this.displayTime = this.formatTime(elapsedSeconds);
  }



  resetTimer() {
    this.stopTimer();
    this.displayTime = '00:00:00';
  }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


}
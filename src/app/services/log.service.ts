import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Log } from '../models/Log';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  logs: Log[];

  private logSource = new BehaviorSubject<Log>({
    id: null,
    text: null,
    date: null
  });
  selectedLog = this.logSource.asObservable();

  private stateSource = new BehaviorSubject<boolean>(true);
  stateClear = this.stateSource.asObservable();

  constructor() {
    // this.logs = [
    //   {
    //     id: '1',
    //     text: 'Generated components',
    //     date: new Date('12/26/2017 12:54:23')
    //   },
    //   {
    //     id: '2',
    //     text: 'Added Bootstrap',
    //     date: new Date('12/27/2017 9:54:23')
    //   },
    //   {
    //     id: '3',
    //     text: 'Added logs component',
    //     date: new Date('12/28/2017 12:54:23')
    //   }
    // ];
    this.logs = [];
  }

  getLogs(): Observable<Log[]> {
    if (localStorage.getItem('logs') === null) {
      this.logs = [];
    } else {
      this.logs = JSON.parse(localStorage.getItem('logs'));
    }

    return of(
      this.logs.sort((a, b) => {
        return b.date - a.date;
      })
    );
  }

  setFormLog(log: Log) {
    this.logSource.next(log);
  }

  addLog(log: Log) {
    this.logs.unshift(log);

    // Add to local storage
    localStorage.setItem('logs', JSON.stringify(this.logs));
  }

  updateLog(log: Log) {
    const pendingLog: Log = this.logs.find(cur => cur.id === log.id);
    pendingLog.text = log.text;
    pendingLog.date = new Date();

    // Update to local storage
    localStorage.setItem('logs', JSON.stringify(this.logs));
  }

  deleteLog(log: Log) {
    const logIndex: number = this.logs.findIndex(cur => cur.id === log.id);
    this.logs.splice(logIndex, 1);

    // Delete to local storage
    localStorage.setItem('logs', JSON.stringify(this.logs));
  }

  clearState() {
    this.stateSource.next(true);
  }
}

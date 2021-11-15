import { DataState } from './enum/data-state.enum';
import { CustomResponse } from './interface/custom-response';
import { ServerService } from './service/server.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AppState } from './interface/app-state';
import { catchError, map, startWith } from 'rxjs/operators';
import { Status } from './enum/status.enum';
import { NgForm } from '@angular/forms';
import { Server } from './interface/server';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;

  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();

  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private serverService: ServerService, private notifier:NotificationService) {

  }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.appState$ = this.serverService.servers$
      .pipe(
        map(response => {
          this.notifier.onDefault(response.message)
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED_STATE, appData: {...response, data: {servers: response.data.servers.reverse()} } }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE,  error: error })
        })
      );
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
      .pipe(
        map(response => {
          this.notifier.onDefault(response.message)
          this.dataSubject.value.data.servers[
            this.dataSubject.value.data.servers.findIndex(server=>
              server.id === response.data.server.id)
          ] = response.data.server;
          this.filterSubject.next('');
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE , appData: this.dataSubject.value}),
        catchError((error: string) => {
          this.filterSubject.next('');
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(serverForm.value)
      .pipe(
        map(response => {
          this.notifier.onDefault(response.message)
          this.dataSubject.next(
            {...response, data:{ servers: [response.data.server, ...this.dataSubject.value.data.servers]}}
          );
          document.getElementById('closeModal').click();
          this.isLoading.next(false);
          serverForm.resetForm({ status:this.Status.SERVER_DOWN});
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE , appData: this.dataSubject.value}),
        catchError((error: string) => {
          this.isLoading.next(false);
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }

  filterServers(status: Status): void {
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
      .pipe(
        map(response => {
          this.notifier.onDefault(response.message)
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADED_STATE , appData: this.dataSubject.value}),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }

  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id)
      .pipe(
        map(response => {
          this.notifier.onDefault(response.message)
          this.dataSubject.next(
            {...response, data:
              { servers: this.dataSubject.value.data.servers.filter(
                s => s.id !== server.id
                )
              }
            }
          );
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE , appData: this.dataSubject.value}),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      );
  }

  printReport():void{
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:'+dataType+ ', '+tableHtml;
    downloadLink.download = 'server-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

}

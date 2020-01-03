import { Component } from '@angular/core';
import { ElectronService, ConfigStoreService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ProjectManagerService } from './core/services/project-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public filesCount: number = 0;
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private projectManagerService: ProjectManagerService,
    private configStoreService: ConfigStoreService,
    private router: Router
  ) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    this.projectManagerService.filesData.subscribe((files: any) => {
      if(files) {
       this.filesCount = Object.keys(files).length;
      } else {
        this.filesCount = 0;
      }
      
    })
  }

  openProject(event){
    this.projectManagerService.openFolder(event);
  }

  saveProject() {
    this.projectManagerService.saveProject();
  }

  addTranslationId() {
    this.projectManagerService.addNewItem();
  }

  quitProject() {
    this.projectManagerService.selectedDirectory = null;
    this.projectManagerService.filesData.next({});
    this.configStoreService.set('selectedDirectory', null);
    this.configStoreService.set('files', null)
    this.router.navigate(['']);
  }
}

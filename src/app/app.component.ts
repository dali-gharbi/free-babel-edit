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
  }

  openProject(event){
    this.projectManagerService.openFolder(event);
  }

  quitProject() {
    this.projectManagerService.selectedDirectory = null;
    this.projectManagerService.filesData = {};
    this.configStoreService.set('selectedDirectory', null);
    this.configStoreService.set('files', null)
    this.router.navigate(['']);
  }
}

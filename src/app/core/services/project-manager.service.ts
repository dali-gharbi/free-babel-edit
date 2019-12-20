import { Injectable } from '@angular/core';
import { ElectronService } from './electron/electron.service';
import { ConfigStoreService } from './config-store.service';
import { Router } from '@angular/router';
import { from } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ProjectManagerService {

    selectedDirectory: string;
    filesData: { [key: string]: any } = {};

    constructor(private electron: ElectronService,
        private configStoreService: ConfigStoreService,
        private router: Router) {

            //Initially load files in files Data
            if(this.configStoreService.data && this.configStoreService.data.selectedDirectory) {
                this.selectedDirectory = this.configStoreService.data.selectedDirectory; 
                this.listFiles(this.selectedDirectory);
            }
         }

    get rootKeys(): string[] {
        let keys: string[] = [];
        for (const key in this.filesData) {
            if (this.filesData.hasOwnProperty(key)) {
                const element = this.filesData[key];
                keys = [...keys, ...Object.keys(element)]
            }
        }
        return keys
    }

    openFolder(event) {
        from(this.electron.remote.dialog.showOpenDialog({
            title: 'Choose i18n Folder',
            properties: ['openDirectory'],
            message: 'e5tar doussi i18n'
        })).subscribe(res => {
            if (res.canceled === false) {
                this.selectedDirectory = res.filePaths[0];
                console.log(this.selectedDirectory);
                this.listFiles(this.selectedDirectory);
            }
        }, err => {
            console.log(err);

        })
    }

    listFiles(directory: string) {
        const files: string[] = this.electron.fs.readdirSync(directory);
        //listing all files using forEach
        for (let index = 0; index < files.length; index++) {
            const file: string = files[index];
            // Do whatever you want to do with the file
            
            //test if it's i18n file
            if (file.indexOf('.json') > -1) {
                const fullPath: string = this.electron.path.join(directory, file);
                let data: any;
                // test if it's a file
                if (this.electron.fs.lstatSync(fullPath).isFile()) {
                    console.log('file', file);
                    // test if it's a valid json
                    data = this.readFile(fullPath);
                    if (data) {
                        this.filesData[file] = data;
                        console.log('data',data);
                        
                    }
                }
            }
        }
        this.configStoreService.set('selectedDirectory', this.selectedDirectory);
        this.configStoreService.set('files', Object.keys(this.filesData));
        this.router.navigate(['project']);
    }

    readFile(fileDir: string) {
        const data = this.electron.fs.readFileSync(fileDir, 'utf-8');
        return this.validateJSON(data);
    }

    validateJSON(body): any {
        try {
            var data = JSON.parse(body);
            // if came to here, then valid
            return data;
        } catch (e) {
            // failed to parse
            return null;
        }
    }
}


import { Injectable } from '@angular/core';
import { ElectronService } from './electron/electron.service';
import { ConfigStoreService } from './config-store.service';
import { Router } from '@angular/router';
import { from, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
    providedIn: 'root'
})
export class ProjectManagerService {

    selectedDirectory: string;
    filesData: BehaviorSubject<{ [key: string]: any }> = new BehaviorSubject<{ [key: string]: any }>({})

    constructor(private electron: ElectronService,
        private configStoreService: ConfigStoreService,
        private snackBar: MatSnackBar,
        private router: Router) {

        //Initially load files in files Data
        if (this.configStoreService.data && this.configStoreService.data.selectedDirectory) {
            this.selectedDirectory = this.configStoreService.data.selectedDirectory;
            this.listFiles(this.selectedDirectory);
        }
    }

    /** correction du json */
    private pushKeys(keys: Map<string, string>, prefix: string, ...files: any[]) {
        for (let index = 0; index < files.length; index++) {
            const obj = eval( 'files[index]' + prefix);
            for (let key in obj) {
                key = key.trim();
                if (obj.hasOwnProperty(key)) {
                    const type = typeof (obj[key]);
                    if (keys.has(key)) {
                        if (keys.get(key) === 'string' && 'string' === type) {
                            // keys.get(key)
                        } else {
                            keys.set(key, type);
                        }
                    } else {
                        keys.set(key, type);
                    }
                }
            }
        }
    }

    private addMissingKeys(keys: Map<string, string>, prefix:string , ...files: any[]) {
        keys.forEach((t: string, k: string) => {
            for (let index = 0; index < files.length; index++) {
                // for (const key in objects) {
                //     if (objects.hasOwnProperty(key)) {
                //         const object = objects[key];
                // console.log('########### files[index]'+ prefix + '[k]');

                // val dosent keep reference
                const val = eval('files[index]'+ prefix + '[k]');
                if (val === undefined) {
                    if (t === 'string') {
                        // val = '';
                        eval('files[index]'+ prefix + '[k] = ""')
                        console.log('init', k);
                        this.snackBar.open('Initialized ' + prefix + '.' + k +' to empty string', 'OK', {
                            duration: 2000,
                          });

                        // files[index][k] = '';
                    } else {
                        // val = {}
                        eval('files[index]'+ prefix + '[k] = {}')
                        this.snackBar.open('Initialized ' + prefix + '.' + k +' to empty object', 'OK', {
                            duration: 2000,
                          });
                        console.log('init', k);
                        // files[index][k] = {};
                    }
                } else if (typeof val === 'string' && t === 'object') {
                    // TODO we force this or not
                    // files[index][k] = {};
                    console.log('converted to object', k);
                    // val = {};
                    eval('files[index]'+ prefix + '[k] = {}')
                }

                //     }
                // }
            }
            if(t === 'object') {
                const mergedPrefix = prefix === '' ? ('.' +k) : (prefix + '.' + k);
                // console.log( 'run recursion on' , mergedPrefix);
                this.addMissingKeysToFiles(files, mergedPrefix)
            }
        })
    }

    private addMissingKeysToFiles(files: any[], prefix: string = '') {
        // first string is object name, second is object type
        let keys: Map<string, string> = new Map<string, string>();
        this.pushKeys(keys, prefix, ...files);
        this.addMissingKeys(keys, prefix, ...files);
    }

    // mergeKeys(object: any): string[] {
    //     Object.assign
    //     let keys: string[] = [];
    //     for (const key in object) {
    //         if (object.hasOwnProperty(key)) {
    //             const element = object[key];
    //             keys = [...keys, ...Object.keys(element)]
    //         }
    //     }
    //     return keys
    // }

    private tryAddProperty(key: string, file: any, type: 'string' | 'object') {
        console.log(key);
        console.log(file);
        
        try {
            if(type === 'string') {
                eval('file.' +key +' = ""')
            } else {
                eval('file.' +key +' = {}')
            }
        } catch (error) {
            console.log(error);
        }
    }

    public addKeyToAllFiles(key: string, type: 'string' | 'object') {
        for (const filename in this.filesData.value) {
            if (this.filesData.value.hasOwnProperty(filename)) {
                let file = this.filesData.value[filename];
                this.tryAddProperty(key, file, type);
            }
        }
        this.filesData.next(this.filesData.value);
    }

    openFolder(event) {
        from(this.electron.remote.dialog.showOpenDialog(this.electron.remote.getCurrentWindow(), {
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
        const fileNames: string[] = this.electron.fs.readdirSync(directory);
        //listing all files using forEach
        let filesData: { [key: string]: any } = {};
        for (let index = 0; index < fileNames.length; index++) {
            const fileName: string = fileNames[index];
            // Do whatever you want to do with the file
                const fullPath: string = this.electron.path.join(directory, fileName);
                 //test if it's i18n file
                // test if it's a file
                if (this.electron.fs.lstatSync(fullPath).isFile() && fileName.indexOf('.json') > -1) {
                    console.log('file', fileName);
                    // test if it's a valid json
                    let data: any = this.readJsonFile(fullPath);
                    if (data) {
                        filesData[fileName] = data;
                        console.log('originaldata', data);

                    } else {
                        filesData[fileName] = {};
                    }
                }
        }

        // ajout des keys manquants 
        const filesName: any[] = new Array();
        let filesValue: any[] = [];
        for (const key in filesData) {
            if (filesData.hasOwnProperty(key)) {
                const element = filesData[key];
                filesName.push(key);
                filesValue.push(element);
            }
        }
        this.addMissingKeysToFiles(filesValue);
        for (let index = 0; index < filesName.length; index++) {
            const name = filesName[index];
            filesData[name] =  filesValue[index];
        }
        // fin ajout des keys manquants 
        
        this.filesData.next(filesData);
        this.configStoreService.set('selectedDirectory', this.selectedDirectory);
        this.configStoreService.set('files', Object.keys(filesData));

        this.router.navigate(['project']);
    }

    readJsonFile(fileDir: string) {
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

    saveProject() {
        const direcotry = this.configStoreService.get('selectedDirectory');
        const files: string[] = this.configStoreService.get('files');
        for (const key in this.filesData.value) {
            if (this.filesData.value.hasOwnProperty(key)) {
                const element = this.filesData.value[key];
                const jsonContent = JSON.stringify(element, null, "\t");
                this.electron.fs.writeFileSync(this.electron.path.join(direcotry, key), jsonContent, 'utf8');
            }
        }
    }
}


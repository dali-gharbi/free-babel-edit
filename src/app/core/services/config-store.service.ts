import { Injectable } from '@angular/core';
import { ElectronService } from './electron/electron.service';


@Injectable({
    providedIn: 'root'
})
export class ConfigStoreService {

    private readonly configName = 'config-file';
    // private get isElectron(): boolean {
    //     return window && window.process && window.process.type;
    // }
    private path: string;
    data: any;
    private defaultValues: any = {};
    constructor(private electronSrv: ElectronService) {
        // app.getPath('userData') will return a string of the user's app data directory path.
        const userDataPath = electronSrv.app.getPath('userData');
        // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
        this.path = electronSrv.path.join(userDataPath, this.configName + '.json');
        this.data = this.parseDataFile(this.path, this.defaultValues);
    }

    // This will just return the property on the `data` object
    get(key) {
        return this.data[key];
    }

    // ...and this will set it
    set(key, val) {
        this.data[key] = val;
        // Wait, I thought using the node.js' synchronous APIs was bad form?
        // We're not writing a server so there's not nearly the same IO demand on the process
        // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
        // we might lose that data. Note that in a real app, we would try/catch this.
        this.electronSrv.fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    parseDataFile(filePath: string, defaults: any) {
        // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
        // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
        try {
            return JSON.parse(this.electronSrv.fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            // if there was some kind of error, return the passed in defaults instead.
            return defaults;
        }
    }

}


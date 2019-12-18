import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import { from } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedDirectory: string;

  constructor(private electron: ElectronService) { }

  ngOnInit(): void { }

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
    this.electron.fs.readdir(directory,  (err, files) => {
      //handling error
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }
      //listing all files using forEach
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        // Do whatever you want to do with the file
        console.log(file);
        this.readFile(directory + '\\' + file);
      }

    });
  }

  readFile(fileDir: string) {
    this.electron.fs.readFile(fileDir, 'utf-8', (err, data) => {
      if (err) {
        alert("An error ocurred reading the file :" + err.message);
        return;
      }
      console.log('is valid json', !!this.validateJSON(data));

      // Change how to handle the file content
      // console.log("The file content is : " + data);
    });
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

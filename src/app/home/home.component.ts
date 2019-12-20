import { Component, OnInit } from '@angular/core';
import { ElectronService, ConfigStoreService } from '../core/services';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { ProjectManagerService } from '../core/services/project-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedDirectory: string;
  filesData: { [key: string]: any } = {};

  constructor(
    private projectManagerService: ProjectManagerService) { }

  ngOnInit(): void { }

  openFolder(event) {
    this.projectManagerService.openFolder(event);
  }

}

import { Component, OnInit } from '@angular/core';
import { ConfigStoreService } from '../core/services';
import { ProjectManagerService } from '../core/services/project-manager.service';
import { FlatTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  treeControl = new FlatTreeControl<string>(
    node => 0, node => false);
    
  constructor(public configStoreService: ConfigStoreService,
    public projectManagerService: ProjectManagerService) { }

  ngOnInit() {
  }
  

}

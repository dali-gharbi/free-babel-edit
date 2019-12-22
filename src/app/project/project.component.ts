import { Component, OnInit } from '@angular/core';
import { ConfigStoreService } from '../core/services';
import { ProjectManagerService } from '../core/services/project-manager.service';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export class KeyNode {
  children: KeyNode[];
  key: string;
  final: boolean = false;
}


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  nestedTreeControl: NestedTreeControl<any>;
  nestedDataSource: MatTreeNestedDataSource<any>;
    
  constructor(public configStoreService: ConfigStoreService,
    public projectManagerService: ProjectManagerService) { }

  ngOnInit() {
    
    this.nestedTreeControl = new NestedTreeControl<KeyNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.nestedDataSource.data = this.buildFileTree(this.projectManagerService.filesData['fr.json'], 0);
    console.log(this.nestedDataSource.data);
    
  }

  private _getChildren = (node: KeyNode) => node.children;

  hasNestedChild = (_: number, nodeData: KeyNode) => nodeData.children;
    /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): KeyNode[] {
    return Object.keys(obj).reduce<KeyNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new KeyNode();
      node.key = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.final = true;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

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
  value: string;
}


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  nestedTreeControl: NestedTreeControl<any>;
  nestedDataSource: MatTreeNestedDataSource<any>;
  selectedNode: KeyNode;
  selectedNodeValues: string[] = [];
  constructor(public configStoreService: ConfigStoreService,
    public projectManagerService: ProjectManagerService) { }

  ngOnInit() {

    this.nestedTreeControl = new NestedTreeControl<KeyNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.nestedDataSource.data = this.buildFileTree(this.projectManagerService.filesData['fr.json'], 0);
  }

  private _getChildren = (node: KeyNode) => node.children;

  hasNestedChild = (_: number, nodeData: KeyNode) => nodeData.children;

  hasNoContent = (_: number, _nodeData: KeyNode) => _nodeData.value === '';

  /**
 * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
 * The return value is the list of `FileNode`.
 */
  buildFileTree(obj: { [key: string]: any }, level: number, parentNode?: KeyNode): KeyNode[] {
    return Object.keys(obj).reduce<KeyNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new KeyNode();
      node.key = key;
      if (parentNode) {
        node.value = parentNode.value + '.' + key;
      } else {
        node.value = key;
      }
      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1, node);
        } else {
          node.final = true;
        }
      }


      return accumulator.concat(node);
    }, []);
  }

  editLeaf(node: KeyNode) {
    this.selectedNode = node;
    if (!this.selectedNode.final) {
      if (!this.nestedTreeControl.isExpanded(node)) {
        this.nestedTreeControl.expandDescendants(node);
      } else {
        this.nestedTreeControl.collapse(node);
      }
    }
    this.selectedNodeValues = this.setSelectedNodeValues();
  }

  setSelectedNodeValues(): string[] {
    if (this.selectedNode) {
      const nodeValues: string[] = [];
      const fillArray = (n: KeyNode): void => {
        if (!n.children) {
          nodeValues.push(n.value);
        } else {
          this.selectedNode.children.forEach(v => {
            fillArray(v);
          })
        }
      }
      fillArray(this.selectedNode);
      return nodeValues;
    }
    return [];
  }

  getValueByKey(value: any, key: string) {
    try {
      return eval("value." + key);
    } catch (e) {
      return undefined;
    }
  }





  /** Select the category so we can insert the new item. */
  // addNewItem(node: KeyNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   this.nestedDataSource.insertItem(parentNode!, '');
  //   this.treeControl.expand(node);
  // }

  /** Save the node to database */
  // saveNode(node: KeyNode, itemValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   this._database.updateItem(nestedNode!, itemValue);
  // }

}

/**
 * Json node data with nested structure. Each node has a filename and a value or a list of children
 */
export class KeyNode {
    children: KeyNode[];
    key: string;
    level: number;
    final: boolean = false;
    value: string;
    parent?: KeyNode = null;
    editing: boolean = false;
    visible: boolean = true;
  
    /**
     *
     */
    constructor() {
      // super();
      // this.children = [];
      this.level = null;
      this.final = false;
      
    }
  }
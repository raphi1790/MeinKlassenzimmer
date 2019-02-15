import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Name } from 'app/models/name';

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.css']
})
export class InlineEditComponent implements OnInit {

  constructor() { }

  isDisplay = true;

  @Input('text') text: string;
  @Input('id') id: string;
  @Output() edit = new EventEmitter<Name>();
  @Output() select = new EventEmitter<Name>();
  @Output() delete  = new EventEmitter<Name>();

  beginEdit(el: HTMLElement): void {
      debugger;
      this.isDisplay = false;

      setTimeout(() => {
          el.focus();
      }, 100);
  }

  editDone(newText: string): void {
      debugger;
      this.isDisplay = true;
      let newName = new Name();
      newName.text = newText;
      newName.id = this.id
      this.edit.emit(newName);
  }
  onSelect():void{
    debugger;
    let selectedId = new Name();
    selectedId.id = this.id;
    this.select.emit(selectedId);
  }
  onDelete():void{
    debugger;
    let selectedId = new Name();
    selectedId.id = this.id;
    this.delete.emit(selectedId);

}


  ngOnInit() {
  }

}

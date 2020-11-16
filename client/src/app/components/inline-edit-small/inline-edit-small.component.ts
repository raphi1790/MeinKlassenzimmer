import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Name } from '../../models/name';

@Component({
  selector: 'app-inline-edit-small',
  templateUrl: './inline-edit-small.component.html',
  styleUrls: ['./inline-edit-small.component.css']
})
export class InlineEditSmallComponent implements OnInit {

  constructor() { }

  isDisplay = true;

  @Input('text') text: string;
  @Input('id') id: string;
  @Output() edit = new EventEmitter<Name>();


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


  ngOnInit() {
  }

}

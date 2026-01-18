import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  selector: 'app-save-snack-bar',
  templateUrl: './save-snack-bar.component.html',
  styleUrls: ['./save-snack-bar.component.css']
})
export class SaveSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConversionHistory } from '@models/converter.model';

@Component({
  selector: 'app-converter-history',
  imports: [CommonModule],
  templateUrl: './converter-history.component.html',
  styleUrl: './converter-history.component.scss',
  standalone: true
})
export class ConverterHistoryComponent {
  @Input({ required: true }) history: ConversionHistory[] = [];
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  private selectedColor: string = '#000000';

  setColor(color: string): void {
    this.selectedColor = color;
  }

  getColor(): string {
    return this.selectedColor;
  }
}

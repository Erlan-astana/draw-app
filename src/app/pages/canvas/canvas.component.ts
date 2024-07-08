import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | any;
  private drawing = false;
  private tool = 'square';
  private color = '#000000';
  private startX!: number;
  private startY!: number;
  private endX!: number;
  private endY!: number;
  private shapes: { type: string, x: number, y: number, width: number, height: number }[] = [];

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  startDrawing(event: MouseEvent) {

    this.drawing = true;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
  }

  stopDrawing() {
    if (this.drawing) {
      this.drawing = false;
      const width = this.endX - this.startX;
      const height = this.endY - this.startY;

      this.shapes.push({
        type: this.tool,
        x: this.startX,
        y: this.startY,
        width: width,
        height: height
      });

      this.redraw();
    }
    this.ctx.beginPath();
  }

  draw(event: MouseEvent) {
    if (!this.drawing) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.endX = event.clientX - rect.left;
    this.endY = event.clientY - rect.top;

    const width = this.endX - this.startX;
    const height = this.endY - this.startY;

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.redraw();

    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    switch (this.tool) {
      case 'square':
        this.ctx.strokeRect(this.startX, this.startY, width, height);
        break;
      case 'circle':
        const radius = Math.sqrt(width * width + height * height);
        this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        break;
      case 'line':
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(this.endX, this.endY);
        this.ctx.stroke();
        break;
    }
  }

  setTool(tool: string) {
    this.tool = tool;
  }

  setColor(val: any) {
    this.color = val;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.shapes = [];
  }

  private redraw() {
    this.shapes.forEach(shape => {
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();

      switch (shape.type) {
        case 'square':
          this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case 'circle':
          const radius = Math.sqrt(shape.width * shape.width + shape.height * shape.height);
          this.ctx.arc(shape.x, shape.y, radius, 0, Math.PI * 2);
          this.ctx.stroke();
          break;
        case 'line':
          this.ctx.moveTo(shape.x, shape.y);
          this.ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
          this.ctx.stroke();
          break;
      }
    });
  }
}

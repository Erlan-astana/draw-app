import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Shape } from 'src/app/models/shape.model';
import { addShape, updateShapeColor, setColor } from 'src/app/store/actions/canvas.actions';
import { selectColor, selectShapes, selectTool } from 'src/app/store/selectors/canvas.selectors';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | any;
  private drawing = false;
  private startX!: number;
  private startY!: number;
  private endX!: number;
  private endY!: number;
  tool$!: Observable<string>;
  color$!: Observable<string>;
  shapes$!: Observable<Shape[]>;

  constructor(private store: Store<CanvasState>) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.tool$ = this.store.pipe(select(selectTool));
    this.color$ = this.store.pipe(select(selectColor));
    this.shapes$ = this.store.pipe(select(selectShapes));

    this.shapes$.subscribe(() => this.redraw());

    this.canvas.nativeElement.addEventListener('click', (event: MouseEvent) => {
      this.handleCanvasClick(event);
    });
  }

  stopDrawing() {
    if (this.drawing) {
      this.drawing = false;
      const width = this.endX - this.startX;
      const height = this.endY - this.startY;

      if (width <= 0 || height <= 0) return;

      this.tool$.pipe(take(1)).subscribe(tool => {
        this.color$.pipe(take(1)).subscribe(color => {
          const newShape: Shape = {
            id: Date.now(),
            type: tool,
            x: this.startX,
            y: this.startY,
            width: width,
            height: height,
            fillColor: color
          };

          this.store.dispatch(addShape({ shape: newShape }));
        });
      });
    }

    this.endX = 0;
    this.endY = 0;
    this.startX = 0;
    this.startY = 0;

    this.ctx.beginPath();
  }

  startDrawing(event: MouseEvent) {
    this.drawing = true;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.startX = event.clientX - rect.left;
    this.startY = event.clientY - rect.top;
  }

  draw(event: MouseEvent) {
    if (!this.drawing) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.endX = event.clientX - rect.left;
    this.endY = event.clientY - rect.top;

    const width = this.endX - this.startX;
    const height = this.endY - this.startY;

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.tool$.pipe(take(1)).subscribe(tool => {
      this.color$.pipe(take(1)).subscribe(color => {
        this.redraw();
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        switch (tool) {
          case 'square':
            this.ctx.fillRect(this.startX, this.startY, width, height);
            this.ctx.strokeRect(this.startX, this.startY, width, height);
            break;
          case 'circle':
            const radius = Math.sqrt(width * width + height * height) / 2;
            this.ctx.arc(this.startX + width / 2, this.startY + height / 2, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            break;
          case 'line':
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(this.endX, this.endY);
            this.ctx.stroke();
            break;
        }
      });
    });
  }

  private handleCanvasClick(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.shapes$.pipe(take(1)).subscribe(shapes => {
      const shape = shapes.find(shape => this.isPointInShape(x, y, shape));

      if (shape) {
        this.color$.pipe(take(1)).subscribe(color => {
          this.store.dispatch(updateShapeColor({
            id: shape.id,
            color: color
          }));
          this.store.dispatch(setColor({ color: 'rgba(0,0,0,0)' }));
        });
      }
    });
  }

  private isPointInShape(x: number, y: number, shape: Shape): boolean {
    switch (shape.type) {
      case 'square':
        return x >= shape.x && x <= shape.x + shape.width &&
          y >= shape.y && y <= shape.y + shape.height;
      case 'circle':
        const radius = Math.sqrt(shape.width * shape.width + shape.height * shape.height) / 2;
        const centerX = shape.x + shape.width / 2;
        const centerY = shape.y + shape.height / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        return distance <= radius;
      case 'line':
        const tolerance = 5;
        const dx = shape.x + shape.width - x;
        const dy = shape.y + shape.height - y;
        return Math.abs(dx + dy) <= tolerance;
      default:
        return false;
    }
  }

  private redraw() {
    this.shapes$.subscribe(shapes => {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

      shapes.forEach(shape => {
        this.ctx.fillStyle = shape.fillColor;
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        switch (shape.type) {
          case 'square':
            this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
            this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            break;
          case 'circle':
            const radius = Math.sqrt(shape.width * shape.width + shape.height * shape.height) / 2;
            this.ctx.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            break;
          case 'line':
            this.ctx.moveTo(shape.x, shape.y);
            this.ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
            this.ctx.stroke();
            break;
        }
      });
    });
  }

}

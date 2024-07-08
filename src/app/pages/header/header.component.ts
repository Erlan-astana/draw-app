import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { setColor, setTool } from 'src/app/store/actions/canvas.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  colors: string[] = [
    '#EF4444', '#F97316', '#FACC15', '#4ADE80', '#FF00FF', '#2DD4BF',
    '#EC4899', '#F43F5E', '#D946EF', '#0EA5E9', '#10B981', '#84CC16'
  ];

  constructor(private store: Store<CanvasState>) { }

  selectColor(color: string): void {
    this.store.dispatch(setColor({ color }));
  }

  setTool(tool: string): void {
    this.store.dispatch(setTool({ tool }));
  }
}

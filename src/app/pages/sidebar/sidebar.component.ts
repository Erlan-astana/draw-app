import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Shape } from 'src/app/models/shape.model';
import { deleteShape } from 'src/app/store/actions/canvas.actions';
import { selectShapes } from 'src/app/store/selectors/canvas.selectors';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  shapes$!: Observable<Shape[]>;

  constructor(private store: Store) { }

  ngOnInit() {
    this.shapes$ = this.store.pipe(select(selectShapes));
  }

  deleteShape(id: number) {
    this.store.dispatch(deleteShape({ id }));
  }
}

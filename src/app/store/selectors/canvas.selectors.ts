import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CanvasState } from '../reducers/canvas.reducer';

export const selectCanvasState = createFeatureSelector<CanvasState>('canvas');

export const selectTool = createSelector(
    selectCanvasState,
    (state: CanvasState) => state.tool
);

export const selectColor = createSelector(
    selectCanvasState,
    (state: CanvasState) => state.color
);

export const selectShapes = createSelector(
    selectCanvasState,
    (state: CanvasState) => state.shapes
);

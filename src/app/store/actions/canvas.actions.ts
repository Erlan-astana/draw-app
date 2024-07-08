import { createAction, props } from '@ngrx/store';
import { Shape } from '../../models/shape.model';

export const addShape = createAction(
    '[Canvas] Add Shape',
    props<{ shape: Shape }>()
);

export const clearCanvas = createAction('[Canvas] Clear Canvas');

export const updateShapeColor = createAction(
    '[Canvas] Update Shape Color',
    props<{ id: number; color: string }>()
);

export const deleteShape = createAction(
    '[Canvas] Delete Shape',
    props<{ id: number }>()
);

export const setTool = createAction(
    '[Canvas] Set Tool',
    props<{ tool: string }>()
);

export const setColor = createAction(
    '[Canvas] Set Color',
    props<{ color: string }>()
);

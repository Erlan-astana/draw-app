import { createReducer, on } from '@ngrx/store';
import { addShape, updateShapeColor, deleteShape, setTool, setColor } from '../actions/canvas.actions';
import { Shape } from '../../models/shape.model';

export interface CanvasState {
    shapes: Shape[];
    tool: string;
    color: string;
}

const initialState: CanvasState = {
    shapes: [],
    tool: 'square',
    color: 'rgba(255, 255, 255, 0)'
};

export const canvasReducer = createReducer(
    initialState,
    on(addShape, (state, { shape }) => ({
        ...state,
        shapes: [...state.shapes, shape]
    })),
    on(updateShapeColor, (state, { id, color }) => ({
        ...state,
        shapes: state.shapes.map(shape =>
            shape.id === id ? { ...shape, fillColor: color } : shape
        )
    })),
    on(deleteShape, (state, { id }) => ({
        ...state,
        shapes: state.shapes.filter(shape => shape.id !== id)
    })),
    on(setTool, (state, { tool }) => ({
        ...state,
        tool: tool
    })),
    on(setColor, (state, { color }) => ({
        ...state,
        color: color
    }))
);

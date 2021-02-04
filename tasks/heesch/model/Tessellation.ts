import {Piece} from "./Piece";
import {Point} from "./Point";

export interface Tessellation {
    T1: Point;
    T2: Point;
    pieces: Piece[];
    indexes: number[];
}

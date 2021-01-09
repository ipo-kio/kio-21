import {Piece} from "./Piece";
import {Point} from "./Point";

export interface Tesselation {
    T1: Point;
    T2: Point;
    pieces: Piece[];
}

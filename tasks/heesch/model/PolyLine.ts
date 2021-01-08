import {int} from "Piece";
import {Point} from "Point";

export interface PolyLine {
    size: int;

    point(ind: int): Point;

    revert(): PolyLine;
}

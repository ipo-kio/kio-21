import {EPS, Piece} from "./Piece";
import {Point} from "./Point";
import {PolyLineUtils} from "./PolyLineUtils";

export interface Tessellation {
    T1: Point;
    T2: Point;
    pieces: Piece[];
    indexes: number[];
}

function pieces_may_be_translated(p1: Piece, p2: Piece, T1: Point, T2: Point, orientation: boolean): boolean {
    if (orientation) {
        let [ox1, oy1] = p1.orientation;
        let [ox2, oy2] = p2.orientation;
        if (!ox1.equals(ox2) || !oy1.equals(oy2))
            return false;
    }

    if (!orientation) {
        if (
            !PolyLineUtils.isT(p1.part(0, p1.size - 1), p2.part(0, p2.size - 1)) &&
            !PolyLineUtils.isT(p1.part(0, p1.size - 1), p2.part(p2.size - 1, 0, false))
        )
            return false;
    }

    //now test that T is made out of T1 and T2
    let {x: tx, y: ty} = p1.point(0).sub(p2.point(0)); //TODO this was already computed in isT()

    let {x: t1x, y: t1y} = T1;
    let {x: t2x, y: t2y} = T2;

    // solve
    //         t1x * a + t2x * b = tx
    //         t1y * a + t2y * b = ty
    let d = t1x * t2y - t2x * t1y;
    let a_mul_d = tx * t2y - t2x * ty;
    let b_mul_d = t1x * ty - t1y * ty;

    let a = a_mul_d / d;
    let b = b_mul_d / d;
    return Math.abs(a - Math.round(a)) < EPS && Math.abs(b - Math.round(b)) < EPS;
}

function tesselationGeneratesPiece(t: Tessellation, p: Piece, orientation: boolean): boolean {
    for (let generating_piece of t.pieces)
        if (pieces_may_be_translated(generating_piece, p, t.T1, t.T2, orientation))
            return true;
    return false;
}

function tessellationGeneratesAnother(t1: Tessellation, t2: Tessellation, orientation: boolean): boolean {
    for (let piece2 of t2.pieces)
        if (!tesselationGeneratesPiece(t1, piece2, orientation))
            return false;
    return true;
}

export function compareTessellations(t1: Tessellation, t2: Tessellation, orientation: boolean): boolean {
    return tessellationGeneratesAnother(t1, t2, orientation) && tessellationGeneratesAnother(t2, t2, orientation);
}

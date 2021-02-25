import {EPS, Piece} from "./Piece";
import {Point} from "./Point";
import {T} from "./Transform";
import {PieceType} from "./PieceType";

export class Tessellation {
    T1: Point;
    T2: Point;
    pieces: Piece[];
    grid_type: string;
    piece_type: PieceType;
    indexes: number[];

    constructor(T1: Point, T2: Point, pieces: Piece[], piece_type: PieceType, indexes: number[]) {
        this.T1 = T1;
        this.T2 = T2;
        this.pieces = pieces;
        this.grid_type = this.evaluate_grid_type().join('');
        this.piece_type = piece_type;
        this.indexes = indexes.slice();
    }

    evaluate_grid_type(): number[] {
        let {x: t1x, y:t1y} = this.T1;
        let {x: t2x, y:t2y} = this.T2;

        let piece0 = this.pieces[0];

        let grid_type: number[] = [];

        for (let p1 of piece0.points) {
            let count = 0;
            for (let piece of this.pieces)
                for (let p2 of piece.points) {
                    let tx = p2.x - p1.x;
                    let ty = p2.y - p1.y;
                    if (has_integer_coordinates(t1x, t1y, t2x, t2y, tx, ty))
                        count++;
                }
            if (count > 2)
                grid_type.push(count);
        }

        return grid_type;
    }
}

function has_integer_coordinates(t1x: number, t1y: number, t2x: number, t2y: number, tx: number, ty: number) {
    // solve
    //         t1x * a + t2x * b = tx
    //         t1y * a + t2y * b = ty
    let d = t1x * t2y - t2x * t1y;
    let a_mul_d = tx * t2y - t2x * ty;
    let b_mul_d = t1x * ty - t1y * tx;

    let a = a_mul_d / d;
    let b = b_mul_d / d;
    return Math.abs(a - Math.round(a)) < EPS && Math.abs(b - Math.round(b)) < EPS;
}

function pieces_may_be_translated(p1: Piece, p2: Piece, T1: Point, T2: Point, orientation: boolean, integer_translation: boolean): boolean {
    if (orientation) {
        let [ox1, oy1] = p1.orientation;
        let [ox2, oy2] = p2.orientation;
        if (!ox1.equals(ox2) || !oy1.equals(oy2))
            return false;
    }

    function left_of_top_points(p: Piece): [Point, number] {
        let left_top_point = p.point(0);
        let left_top_point_index = 0;
        for (let i = 1; i < p.size; i++) {
            let point = p.point(i);
            if (point.y - EPS > left_top_point.y || Math.abs(point.y - left_top_point.y) < EPS && point.x + EPS < left_top_point.x) {
                left_top_point = point;
                left_top_point_index = i;
            }

        }
        return [left_top_point, left_top_point_index];
    }

    let [point1, point1_index] = left_of_top_points(p1);
    let [point2, point2_index] = left_of_top_points(p2);

    //now test that T is made out of T1 and T
    let {x: tx, y: ty} = point2.sub(point1);

    if (integer_translation) {
        let {x: t1x, y: t1y} = T1;
        let {x: t2x, y: t2y} = T2;

        if (!has_integer_coordinates(t1x, t1y, t2x, t2y, tx, ty))
            return false;
    }

    // now test that pieces are translatable
    function translatable(second_increment: number): boolean {
        for (let i = 0; i < p1.size; i++) {
            let {x: p1x, y: p1y} = p1.point(point1_index + i);
            let {x: p2x, y: p2y} = p2.point(point2_index + i * second_increment);
            let dx = p1x + tx - p2x;
            let dy = p1y + ty - p2y;
            if (Math.abs(dx) >= EPS || Math.abs(dy) >= EPS)
                return false;
        }
        return true;
    }

    return translatable(1) || translatable(-1);
}

function tesselationGeneratesPiece(t: Tessellation, p: Piece, orientation: boolean, integer_translation: boolean): boolean {
    for (let generating_piece of t.pieces)
        if (pieces_may_be_translated(generating_piece, p, t.T1, t.T2, orientation, integer_translation))
            return true;
    return false;
}

function tessellationGeneratesAnother(t1: Tessellation, t2: Tessellation, orientation: boolean): boolean {
    let translate1 = T(t2.T1);
    let translate2 = T(t2.T2);
    for (let piece2 of t2.pieces) {
        if (!tesselationGeneratesPiece(t1, piece2, orientation, true))
            return false;
        if (!tesselationGeneratesPiece(t1, translate1.applyToPiece(piece2), orientation, true))
            return false;
        if (!tesselationGeneratesPiece(t1, translate2.applyToPiece(piece2), orientation, true))
            return false;
    }
    return true;
}

function tessellationMayBeTranslatedTo(t1: Tessellation, t2: Tessellation, orientation: boolean): boolean {
    for (let piece2 of t2.pieces) {
        if (!tesselationGeneratesPiece(t1, piece2, orientation, false))
            return false;
    }
    return true;
}

export function compareTessellations(t1: Tessellation, t2: Tessellation, orientation: boolean): boolean {
    return tessellationGeneratesAnother(t1, t2, orientation) && tessellationGeneratesAnother(t2, t1, orientation);
}

export function tessellationIsTranslateblyEquivalent(t1: Tessellation, t2: Tessellation, orientation: boolean): boolean {
    return tessellationMayBeTranslatedTo(t1, t2, orientation) && tessellationMayBeTranslatedTo(t2, t1, orientation);
}

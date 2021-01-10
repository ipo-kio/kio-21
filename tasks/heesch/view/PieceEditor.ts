import {Point} from "../model/Point";
import {EPS} from "../model/Piece";

const GRID_STEP = 10;

type Segment = [p1: Point, p2: Point];

function test_segments_intersect(s1: Segment, s2: Segment): boolean {
    function line([{x: x1, y: y1}, {x: x2, y: y2}]: [p: Point, q: Point]): [a: number, b: number, c: number] {
        // (x - x2) / (x1 - x2) = (y - y2) / (y1 - y2)
        return [
            y1 - y2,
            x2 - x1,
            x1 * y2 - x2 * y1
        ];
    }

    let [a1, b1, c1] = line(s1);
    let [a2, b2, c2] = line(s2);

    let val10 = a1 * s2[0].x + b1 * s2[0].y + c1;
    let val11 = a1 * s2[1].x + b1 * s2[1].y + c1;

    let mul1 = val10 * val11;
    if (mul1 > 0)
        return false;

    let val20 = a2 * s1[0].x + b2 * s1[0].y + c2;
    let val21 = a2 * s1[1].x + b2 * s1[1].y + c2;

    let mul2 = val20 * val21;
    if (mul2 > 0)
        return false;

    // now mul1 <= 0 and mul2 <= 0

    if (mul1 < 0 || mul2 < 0)
        return true;

    // now mul1 == 0 and mul2 == 0, so they all lie on the same line
    // s1[0] <-> s1[1]         s2[0] <-> s2[1]
    let e1 = s1[1].sub(s1[0]);
    let f2 = s2[0].sub(s1[0]);
    let e2 = s2[1].sub(s1[0]);

}

function test_segments_have_only_1_intersection(p1: Point, p2: Point, p3: Point): boolean {
    let v1 = p1.sub(p2); // p1 <- p2 -> p3
    let v2 = p3.sub(p2);

    let vec = v1.vec(v2);
    if (Math.abs(vec) > EPS)
        return true;

    //v1 and v2 are collinear
    //should go in different directions

    return v1.dot(v2) < 0;
}


export class PieceEditor {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    points: Point[];

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
    }
}

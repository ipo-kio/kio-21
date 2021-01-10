import {Point} from "./Point";
import {int, Piece} from "./Piece";

const ZERO = new Point(0, 0);

export class Transform {
    private a: number;
    private b: number;
    private c: number;
    private d: number;
    private e: number;
    private f: number;

    constructor(a: number, b: number, c: number, d: number, e: number, f: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    apply(p: Point, round: boolean = false): Point {
        let x = this.a * p.x + this.b * p.y + this.c;
        let y = this.d * p.x + this.e * p.y + this.f;

        if (round) {
            x = Math.round(x);
            y = Math.round(y);
        }

        return new Point(x, y);
    }

    applyToPiece(p: Piece, round: boolean = false): Piece {
        let new_points = new Array<Point>(p.size);
        for (let i = 0; i < p.size; i++)
            new_points[i] = this.apply(p.points[i], round);

        let p1 = this.apply(ZERO, round);
        let p2 = this.apply(p.orientation, round);

        return new Piece(new_points, p2.sub(p1));
    }
}

export function R2(center: Point) {
    return new Transform(
        -1, 0, 2 * center.x,
        0, -1, 2 * center.y,
    );
}

export function R4(center: Point) {
    return new Transform(
        0, -1, center.x + center.y,
        1, 0, center.y - center.x,
    ); //2, 1
}

//s1-e1 transforms by slide symmetry to s2-e2. s1 goes to s2, direction s1-e1 goes to s2-e2
export function G(s1: Point, e1: Point, s2: Point, e2: Point) {
    let v1 = e1.sub(s1);
    let v2 = e2.sub(e1);

    //bisector v1 and v2 is a reflexion line, angle = a
    let aMul2 = v1.angle + v2.angle;
    // transform matrix:
    // p q
    // q -p
    // p = cos(2a)
    // q = sin(2a)
    let p = Math.cos(aMul2);
    let q = Math.sin(aMul2);
    let reflect = new Transform(p, q, 0, q, -p, 0);
    let t = s2.sub(reflect.apply(s1))
    return new Transform(p, q, t.x, q, -p, t.y);
}

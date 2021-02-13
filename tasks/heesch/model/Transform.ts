import {Point} from "./Point";
import {Piece} from "./Piece";

const ZERO = new Point(0, 0);

export class Transform {
    static byPoints(A: Point, B: Point, C: Point, D: Point, changeOrientation: boolean): Transform | null {
        if (A.dist2(B) != C.dist2(D))
            return null;

        if (changeOrientation) {
            A = new Point(A.x, -A.y); // 1  0 0
            B = new Point(B.x, -B.y); // 0 -1 0
        }

        let v1 = B.sub(A);
        let v2 = D.sub(C);
        let a = v2.angle - v1.angle;
        let T1 = Transform.rotation(a);
        let A1 = T1.apply(A);
        let B1 = T1.apply(B);

        let vA = A.sub(A1);
        let orientationMul = changeOrientation ? -1 : 1;

        return new Transform(
            T1.a, orientationMul * T1.b, vA.x,
            T1.d, orientationMul * T1.e, vA.y
        );
    }

    static rotation(angle: number): Transform {
        return new Transform(
            Math.cos(angle), Math.sin(angle), 0,
            -Math.sin(angle), Math.cos(angle), 0
        );
    }

    readonly a: number;
    readonly b: number;
    readonly c: number;
    readonly d: number;
    readonly e: number;
    readonly f: number;

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

        // if (round) {
        //     x = Math.round(x);
        //     y = Math.round(y);
        // }

        return new Point(x, y);
    }

    applyToPiece(p: Piece, round: boolean = false): Piece {
        let new_points = new Array<Point>(p.size);
        for (let i = 0; i < p.size; i++)
            new_points[i] = this.apply(p.points[i], round);

        let p0 = this.apply(ZERO, round);
        let p1 = this.apply(p.orientation[0], round);
        let p2 = this.apply(p.orientation[1], round);

        return new Piece(new_points, [p1.sub(p0), p2.sub(p0)]);
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
    let v2 = e2.sub(s2);

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

export function S({x: x1, y: y1}: Point, {x: x2, y: y2}: Point) {
    // (x - xx)*(x1 - x2) + (y - yy)*(y1 - y2) = 0
    // (x - x1)*(x - x1) + (y - y1)*(y - y1) = (xx - x1)*(xx - x1) + (yy - y1)*(yy - y1)

    //x2 - x1, y2 - y1.

    // S * [x1; y1; 1] = [x1; y1; 1]
    // S * [x2; y2; 1] = [x2; y2; 1]
    // S * [x1 + y1 - y2; y1 + x2 - x1; 1] = [x1 - y1 + y2; y1 - x2 + x1; 1]
    /*
           x1    x2   x1 + y1 - y2          x1    x2   x1 - y1 + y2
    S *    y1    y2   y1 + x2 - x1       =  y1    y2   y1 - x2 + x1
            1     1        1                1     1        1

    var('x1, y1, x2, y2, x, y')

    m1 = matrix([[x1, x2, x1 + y1 - y2], [y1, y2, y1 + x2 - x1], [1, 1, 1]])
    m2 = matrix([[x1, x2, x1 - y1 + y2], [y1, y2, y1 - x2 + x1], [1, 1, 1]])

    show(m1)
    show(m2)
    # T * m1 = m2
    m = m2 / m1
    show(m)

    show(det(m1).full_simplify())
    def simp(u): v=u.simplify_full()
    show(matrix(map(simp, m)))
    // --------------------------------------------------

           x1    x2   x1 + y1 - y2            x1    x2   x1 - y1 + y2
    M1 =   y1    y2   y1 + x2 - x1     M2  =  y1    y2   y1 - x2 + x1
            1     1        1                   1     1        1

      S * M1 = M2
      M2 * M1^(-1)
     */

    let x3 = x1 + y1 - y2;
    let y3 = y1 + x2 - x1;
    let x4 = x1 - y1 + y2;
    let y4 = y1 - x2 + x1;

    /*
           x1    x2   x3            x1    x2   x4                      xx1 xx2 xx3
    M1 =   y1    y2   y3     M2  =  y1    y2   y4   (M1^-1 * det)^T =  yy1 yy2 yy3
            1     1    1             1     1    1                      zz1 zz2 zz3
     */

    let det = (x2*y3 - y2*x3) - (x1*y3 - y1*x3) + (x1*y2 - x2*y1);
    let xx1 = y2 - y3;
    let xx2 = y3 - y1;
    let xx3 = y1 - y2;
    let yy1 = x3 - x2;
    let yy2 = x1 - x3;
    let yy3 = x2 - x1;
    let zz1 = x2*y3 - y2*x3;
    let zz2 = x3*y1 - x1*y3;
    let zz3 = x1*y2 - x2*y1;

    // M2 * M1^(-1)
    let a = x1 * xx1 + x2 * xx2 + x4 * xx3;
    let b = x1 * yy1 + x2 * yy2 + x4 * yy3;
    let c = x1 * zz1 + x2 * zz2 + x4 * zz3;

    let d = y1 * xx1 + y2 * xx2 + y4 * xx3;
    let e = y1 * yy1 + y2 * yy2 + y4 * yy3;
    let f = y1 * zz1 + y2 * zz2 + y4 * zz3;

    return new Transform(a / det, b / det, c / det, d / det, e / det, f / det);
}

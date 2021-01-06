export const EPS = 1e-10;

export type int = number;

function gcd(a: int, b: int): int {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    while (b != 0) {
        let t = a;
        a = a % b;
        b = t;
    }
    return a;
}

export class Point {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(that: Point) {
        return new Point(this.x + that.x, this.y + that.y);
    }

    middle(that: Point) {
        return new Point((this.x + that.x) / 2, (this.y + that.y) / 2);
    }

    sub(that: Point) {
        return new Point(this.x - that.x, this.y - that.y);
    }

    mul(k: number): Point {
        return new Point(this.x * k, this.y * k);
    }

    div(k: number): Point {
        return new Point(this.x / k, this.y / k)
    }

    equals(that: Point) {
        return Math.abs(this.x - that.x) + Math.abs(this.y - that.y) < EPS;
    }

    dot(that: Point) {
        return this.x * that.x + this.y * that.y;
    }

    vec(that:Point) {
        return this.x * that.y - this.y * that.x;
    }

    get length2():number {
        return this.x * this.x + this.y * this.y;
    }

    get length(): number {
        return Math.sqrt(this.length2);
    }

    get angle(): number {
        return Math.atan2(this.y, this.x);
    }
}

export class Piece {
    readonly points: Point[] = [];

    constructor(points: Point[]) {
        this.points = points;
    }

    get size(): int {
        return this.points.length;
    }

    point(ind: int) {
        let n = this.size;
        let i = ind % n;
        if (i < 0)
            i += n;
        return this.points[i];
    }

    part(ind1: int, ind2: int, forward: boolean = true): PolyLine {
        return new PiecePart(this, ind1, ind2, forward);
    }

    fulfill(): Piece {
        let new_points: Point[] = [];

        function update(p0: Point, p1: Point): void {
            if (p0.equals(p1))
                return;

            let dx = p1.x - p0.x;
            let dy = p1.y - p0.y;

            let d = gcd(dx, dy);

            let lx = dx / d;
            let ly = dy / d;

            for (let i = 1; i <= d; i++)
                new_points.push(new Point(p0.x + i * lx, p0.y + i * ly));
        }

        for (let i = 1; i < this.size; i++) {
            let p0 = this.point(i - 1);
            let p1 = this.point(i);
            update(p0, p1);
        }
        update(this.point(this.size - 1), this.point(0));

        return new Piece(new_points);
    }
}

export class PiecePart implements PolyLine {
    readonly size: int;

    private readonly piece: Piece;
    private readonly ind1: int;
    private readonly forward: boolean;

    constructor(piece: Piece, ind1: int, ind2: int, forward: boolean) {
        while (ind2 < ind1)
            ind2 += piece.size;
        this.piece = piece;
        this.size = ind2 - ind1 + 1;
        this.ind1 = forward ? ind1 : ind2;
    }

    point(ind: int): Point {
        return this.piece.point(this.forward ? this.ind1 + ind : this.ind1 - ind);
    }

    revert(): PolyLine {
        if (this.forward)
            return new PiecePart(this.piece, this.ind1, this.ind1 + this.size - 1, false);
        else
            return new PiecePart(this.piece, this.ind1 - this.size + 1, this.ind1, true);
    }
}

export interface PolyLine {
    size: int;

    point(ind: int): Point;

    revert(): PolyLine;
}

export class PolyLineUtils {
    static isC(p: PolyLine) {
        let n = p.size;

        let p0 = p.point(0);
        let pLast = p.point(n - 1);

        let c = p0.middle(pLast);

        for (let i = 1; 2 * i <= n; i++) {
            let pi = p.point(i);
            let pj = p.point(n - i - 1);

            if (!c.equals(pi.middle(pj)))
                return false;
        }
        return true;
    }

    static isT(p1: PolyLine, p2: PolyLine): boolean {
        let n = p1.size;
        if (n != p2.size)
            return false;

        let t = p2.point(0).sub(p1.point(0));
        for (let i = 1; i < n; i++) {
            let tt = p2.point(i).sub(p1.point(i));
            if (!tt.equals(t))
                return false;
        }

        return true;
    }

    static isC4(p1: PolyLine, p2: PolyLine): boolean {
        //p1 rotated around p1[0] goes to p2
        let o = p1.point(0);
        let n = p1.size;
        if (n != p2.size)
            return false;
        for (let i = 0; i < n; i++) {
            let o1 = p1.point(i);
            let o2 = p2.point(i);
            //o1 - o - o2 should be a 90 rotation
            let v1 = o1.sub(o); //example: -1, 0
            let v2 = o2.sub(o); //example: 0, 1

            let vec = v1.vec(v2);
            let dot = v1.dot(v2);

            if (Math.abs(dot) >= EPS || vec > 0)
                return false;
        }

        return true;
    }

    static isG(p1: PolyLine, p2: PolyLine): boolean {
        let n = p1.size;
        if (n != p2.size)
            return false;

        let s1 = p1.point(0); //start 1
        let s2 = p2.point(0); //start 2
        let e1 = p1.point(n - 1); //end 1
        let e2 = p2.point(n - 1); //end 2

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
    }
}

export class Transform {
    private a: number;
    private b: number;
    private c: number;
    private d: number;
    private e: number;
    private f: number;

    apply(p: Point): Point {
        return new Point(
            this.a * p.x + this.b * p.y + this.c,
            this.d * p.x + this.e * p.y + this.f
        );
    }
}

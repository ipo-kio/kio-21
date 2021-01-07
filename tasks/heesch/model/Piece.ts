import {PolyLine} from "./PolyLine";
import {PiecePart} from "./PiecePart";
import {Point} from "./Point";

export const EPS = 1e-10;

export type int = number;

function gcd(a: int, b: int): int {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    while (b != 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
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

            for (let i = 1; i <= d; i++) {
                let new_point = new Point(p0.x + i * lx, p0.y + i * ly);
                new_points.push(new_point);
            }
        }

        for (let i = 1; i < this.size; i++) {
            let p0 = this.point(i - 1);
            let p1 = this.point(i);
            update(p0, p1);
        }
        update(this.point(this.size - 1), this.point(0));

        return new Piece(new_points);
    }

    toString() {
        return this.points.join("~");
    }

    searchForType() {
        // "CTG4"
        function search(type: string, ) {

        }
    }
}

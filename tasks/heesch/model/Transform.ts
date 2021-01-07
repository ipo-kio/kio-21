import {Point} from "./Point";

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

    apply(p: Point): Point {
        return new Point(
            this.a * p.x + this.b * p.y + this.c,
            this.d * p.x + this.e * p.y + this.f
        );
    }
}

import {EPS} from "./Piece";

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(that: Point) {
        return new Point(this.x + that.x, this.y + that.y);
    }

    addWithCoef(that: Point, k: number) {
        return new Point(this.x + k * that.x, this.y + k * that.y);
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

    vec(that: Point) {
        return this.x * that.y - this.y * that.x;
    }

    get length2(): number {
        return this.x * this.x + this.y * this.y;
    }

    get length(): number {
        return Math.sqrt(this.length2);
    }

    get angle(): number {
        return Math.atan2(this.y, this.x);
    }

    dist2(p: Point): number {
        let dx = this.x - p.x;
        let dy = this.y - p.y;
        return dx * dx + dy * dy;
    }

    dist(p: Point): number {
        return Math.sqrt(this.dist2(p));
    }

    toString(): string {
        return "(" + this.x + ", " + this.y + ")";
    }

    update(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

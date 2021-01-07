import {EPS} from "./Piece";

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

    toString(): string {
        return "(" + this.x + ", " + this.y + ")";
    }
}

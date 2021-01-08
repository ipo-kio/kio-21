import {PolyLine} from "./PolyLine";
import {PiecePart} from "./PiecePart";
import {Point} from "./Point";
import {ALL_PIECE_TYPES, PieceType, TYPE_TCCTGG} from "./PieceType";
import {PolyLineUtils} from "./PolyLineUtils";

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

            for (let i = 0; i < d; i++) {
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

    searchForType(callback: (type: PieceType, indexes: int[]) => void) {
        let piece = this;
        let n = this.size;

        function search(type: PieceType, point_indexes: int[], ind: int) {
            //next polyline: type[ind]
            //next index to be put into point_indexes[ind + 1]
            let k = type.size;

            if (ind == k) {
                callback(type, point_indexes);
                return;
            }

            let [letter, corresponding_index] = type.type[ind];

            let ind_min;
            let ind_max;
            let circle_index = point_indexes[0] + n;
            if (letter == '.' || letter == 'C') {
                ind_min = point_indexes[ind];
                ind_max = circle_index;
            } else {
                let len = point_indexes[corresponding_index + 1] - point_indexes[corresponding_index];
                ind_min = point_indexes[ind] + len;
                ind_max = ind_min;
            }

            // maximal index is always the circle index
            ind_max = Math.min(circle_index, ind_max);

            //at last step we should go exactly to the index point_indexes[0] + n
            if (ind == k - 1) {
                ind_min = Math.max(circle_index, ind_min);
                //ind_max = Math.min(circle_index, ind_max);
            }

            for (let i = ind_min; i <= ind_max; i++) {

                if (letter != '.') {
                    let current_polyline = piece.part(point_indexes[ind], i);
                    if (letter == 'C') {
                        if (!PolyLineUtils.isC(current_polyline))
                            continue;
                    } else {
                        let previous_polyline = piece.part(
                            point_indexes[corresponding_index],
                            point_indexes[corresponding_index + 1]
                        );
                        switch (letter) {
                            case 'G':
                                if (!PolyLineUtils.isG(previous_polyline, current_polyline))
                                    continue;
                                break;
                            case 'T':
                                if (!PolyLineUtils.isT(previous_polyline.revert(), current_polyline))
                                    continue;
                                break;
                            case 'C4':
                                if (!PolyLineUtils.isC4(previous_polyline.revert(), current_polyline))
                                    continue;
                                break;
                        }
                    }
                }

                if (ind < k - 1)
                    point_indexes[ind + 1] = i;
                search(type, point_indexes, ind + 1);
            }
        }

        for (let type of ALL_PIECE_TYPES) {
            let point_indexes: int[] = new Array<int>(type.size);
            for (let i = 0; i < n; i++) {
                point_indexes[0] = i;
                search(type, point_indexes, 0);
            }
        }

        //TODO TG1G1TG2G2 will always be found two times
    }
}

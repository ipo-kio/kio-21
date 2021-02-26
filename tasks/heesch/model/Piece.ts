import {PolyLine} from "./PolyLine";
import {PiecePart} from "./PiecePart";
import {Point} from "./Point";
import {ALL_PIECE_TYPES, PieceType} from "./PieceType";
import {PolyLineUtils} from "./PolyLineUtils";
import {R2, R4, S, Transform} from "./Transform";

export const EPS = 1e-10;

export type int = number;

const DEFAULT_ORIENTATION: [Point, Point] = [new Point(1, 0), new Point(0, 1)];

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

type Invariants = [vec: number, dist: number, is_line: boolean];
// type Invariants = [dot: number, vec: number, sq_dist: number, is_line: boolean];

export class Piece {
    readonly points: Point[] = [];
    readonly orientation: [Point, Point];
    private invariants_matrix: Invariants[][] = null;
    private full_length: number;
    readonly sign: number; //+-1

    constructor(points: Point[], orientation: [Point, Point] = DEFAULT_ORIENTATION) {
        this.points = points;
        this.orientation = orientation;

        let [o1, o2] = orientation;
        let d = o1.dot(o2);
        if (Math.abs(d) > EPS)
            console.log('ERROR', o1.toString(), o2.toString());

        this.sign = this.evaluate_sign();
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

    boundingBox(): { xmin: number, xmax: number, ymin: number, ymax: number } {
        let xs = this.points.map(p => p.x);
        let ys = this.points.map(p => p.y);
        return {
            xmin: Math.min(...xs),
            xmax: Math.max(...xs),
            ymin: Math.min(...ys),
            ymax: Math.max(...ys)
        };
    }

    searchForType(callback: (type: PieceType, indexes: int[]) => void) {
        if (!this.invariants_matrix)
            this.evaluate_invariants();

        let piece = this;
        let n = this.size;

        let searchesCount = 0;
        let foundCount = 0;
        console.time('search for type');

        function search(type: PieceType, point_indexes: int[], ind: int, length_of_all_points: number) {
            searchesCount++;
            //next polyline: type[ind]
            //next index to be put into point_indexes[ind + 1]
            let k = type.size;

            if (ind == k) {
                foundCount++;
                callback(type, point_indexes);
                return;
            }

            let [letter, corresponding_index] = type.type[ind];

            let ind_min;
            let ind_max;
            let circle_index = point_indexes[0] + n;
            let prev_polyline_start = point_indexes[corresponding_index]; // FIXME corresponding_index might be undefined, although, the variable is not used in this case
            let prev_polyline_end = point_indexes[corresponding_index + 1];

            ind_min = point_indexes[ind];
            ind_max = circle_index;
            if (letter == '-' || letter == 'L')
                ind_min += 1;

            let i1: Invariants;
            if (letter != '.' && letter != '-' && letter != 'C' && letter != 'L') {
                i1 = piece.invariants_matrix[prev_polyline_start % n][prev_polyline_end % n];

                //find index with the same length
                let len = prev_polyline_end - prev_polyline_start;
                let ind_mid = point_indexes[ind] + len;
                if (ind_mid < ind_min || ind_mid > ind_max)
                    ind_mid = Math.floor((ind_min + ind_max) / 2);
                let first_search = true;

                let line_len = i1[1];
                let found = false;
                while (ind_min <= ind_max) {
                    if (first_search)
                        first_search = false;
                    else
                        ind_mid = Math.floor((ind_min + ind_max) / 2);
                    let line_len_2 = piece.invariants_matrix[point_indexes[ind] % n][ind_mid % n][1];
                    if (Math.abs(line_len_2 - line_len) < EPS) {
                        ind_min = ind_mid;
                        ind_max = ind_mid;
                        found = true;
                        break;
                    }
                    if (line_len_2 < line_len)
                        ind_min = ind_mid + 1;
                    else
                        ind_max = ind_mid - 1;
                }
                if (!found)
                    return;
            } else
                i1 = null;

            // maximal index is always the circle index
            ind_max = Math.min(circle_index, ind_max);

            //at last step we should go exactly to the index point_indexes[0] + n
            if (ind == k - 1) {
                ind_min = Math.max(circle_index, ind_min);
                // ind_max = Math.min(circle_index, ind_max);
            }

            // disallow full circle elements
            if (point_indexes[ind] + n == ind_max)
                ind_max--;

            for (let i = ind_min; i <= ind_max; i++) {

                let new_length_of_all_points = length_of_all_points;

                let i2 = piece.invariants_matrix[point_indexes[ind] % n][i % n];

                if (letter != '.' && letter != '-') {
                    let current_polyline = piece.part(point_indexes[ind], i);
                    if (letter == 'C') {
                        if (i2[0] != 0 || !PolyLineUtils.isC(current_polyline))
                            continue;
                    } else if (letter == 'L') {
                        if (!i2[2])
                            return;
                    } else {
                        // this is a plane movement, so test invariants
                        if (i1[0] !== i2[0] || Math.abs(i1[1] - i2[1]) >= EPS || i1[2] !== i2[2])
                            continue;

                        let previous_polyline = piece.part(prev_polyline_start, prev_polyline_end);

                        switch (letter) {
                            case 'G':
                                if (!PolyLineUtils.isG(previous_polyline, current_polyline))
                                    continue; //2,3-2,4  1,4-1,3
                                break;
                            case 'T':
                                if (!PolyLineUtils.isT(previous_polyline.revert(), current_polyline))
                                    continue;
                                break;
                            case 'C4':
                                if (!PolyLineUtils.isC4(previous_polyline.revert(), current_polyline, piece.sign))
                                    continue;
                                break;
                        }

                        new_length_of_all_points = length_of_all_points - i2[1];
                    }
                } else {
                    //and test that the length of this polyline is not greater than the half of the poly
                    // if (i2[1] * 2 - EPS > piece.full_length)
                    //     break;

                    new_length_of_all_points = length_of_all_points + i2[1];
                }

                if (ind < k - 1) {
                    point_indexes[ind + 1] = i;

                    let total_length_up_to_here = piece.invariants_matrix[point_indexes[0] % n][i % n][1];
                    if (new_length_of_all_points - EPS > piece.full_length - total_length_up_to_here)
                        return;
                }
                search(type, point_indexes, ind + 1, new_length_of_all_points);
            }
        }

        let prevFoundCount = 0;
        let prevSearchesCount = 0;
        for (let type of ALL_PIECE_TYPES) {
            console.time("search " + type.name);
            let point_indexes: int[] = new Array<int>(type.size);
            for (let i = 0; i < n; i++) {
                point_indexes[0] = i;
                search(type, point_indexes, 0, 0);
            }
            console.timeEnd("search " + type.name);
            console.log(
                'count',
                type.name,
                type.number,
                (foundCount - prevFoundCount) + " of " + (searchesCount - prevSearchesCount),
                foundCount + " of " + searchesCount
            );
            prevSearchesCount = searchesCount;
            prevFoundCount = foundCount;
        }

        console.timeEnd('search for type');
    }

    center(): Point {
        let p = new Point(0, 0);
        for (let pp of this.points)
            p.update(p.x + pp.x, p.y + pp.y);
        p.update(p.x / this.size, p.y / this.size);
        return p;
    }

    point_is_inside_edge(i: number) {
        let p1 = this.point(i - 1);
        let p2 = this.point(i);
        let p3 = this.point(i + 1);

        return Math.abs(p1.sub(p2).vec(p2.sub(p3))) < EPS;
    }

    get size_without_inner_points(): number {
        let cnt = 0;
        for (let i = 0; i < this.size; i++)
            if (!this.point_is_inside_edge(i))
                cnt++;
        return cnt;
    }

    private evaluate_invariants() {
        let n = this.size;
        this.invariants_matrix = new Array<Invariants[]>(n);

        for (let i = 0; i < n; i++) {
            let vec = 0;
            let dist = 0;
            let is_line = true;
            this.invariants_matrix[i] = new Array<Invariants>(n);
            this.invariants_matrix[i][i] = [Math.abs(vec), dist, is_line];
            for (let j = i + 1; j < i + n; j++) {
                let jj = j % n;
                let prev_point = this.point(j - 1);
                let point = this.point(j);
                let edge = point.sub(prev_point);
                dist += edge.length;
                if (j > i + 1) {
                    let prev_prev_point = this.point(j - 2);
                    let prev_edge = prev_point.sub(prev_prev_point);

                    vec += prev_edge.vec(edge);
                    is_line = is_line && Math.abs(prev_edge.vec(edge)) < EPS;
                }

                this.invariants_matrix[i][jj] = [Math.abs(vec), dist, is_line];
            }
        }

        this.full_length = this.invariants_matrix[0][n - 1][1] + this.points[n - 1].dist(this.points[0]);
    }

    private evaluate_sign(): number {
        let sq = 0;
        for (let i = 0; i < this.points.length; i++) {
            let j = i == 0 ? this.points.length -1 : i - 1;
            sq += this.points[j].vec(this.points[i]);
        }
        if (Math.abs(sq) < EPS)
            return 0;
        else if (sq > 0)
            return 1;
        else
            return -1;
    }

    find_symmetry(): ([typ: "sym", m: Point, n: Point] | [typ: "rot", m: Point])[] {
        let n = this.points.length;
        let symmetries: Transform[] = [];
        let result: ([typ: "sym", m: Point, n: Point] | [typ: "rot", m: Point])[] = [];

        function has_symmetry(sym: Transform): boolean {
            for (let sym2 of symmetries)
                if (sym2.equals(sym))
                    return true;
            return false;
        }

        for (let i = 0; i < n; i++) {
            let {x: x1, y: y1} = this.points[i];
            for (let j = i + 1; j < n; j++) {
                let {x: x2, y: y2} = this.points[j];

                if (Math.abs(x1 - x2) + Math.abs(y1 - y2) < EPS)
                    continue;

                let mx = (x1 + x2) / 2;
                let my = (y1 + y2) / 2;
                let nx = mx + (y1 - y2);
                let ny = my + (x2 - x1);

                let m = new Point(mx, my);
                let m2 = new Point(nx, ny);
                let sym = S(m, m2);
                let rot = R2(m);
                let sym_piece = sym.applyToPiece(this);
                let rot_piece = rot.applyToPiece(this);

                let is_symmetry = true;
                for (let k = 0; k < n; k++)
                    if (!this.point(i + k).equals(sym_piece.point(j - k))) {
                        is_symmetry = false;
                        break;
                }
                let is_rotation = true;
                for (let k = 0; k < n; k++)
                    if (!this.point(i + k).equals(sym_piece.point(j + k))) {
                        is_rotation = false;
                        break;
                    }

                if (is_symmetry && !has_symmetry(sym)) {
                    symmetries.push(sym);
                    result.push(["sym", m, m2]);
                }
                if (is_rotation && !has_symmetry(sym)) {
                    symmetries.push(rot);
                    result.push(["rot", m]);
                }
            }
        }

        return result;
    }
}

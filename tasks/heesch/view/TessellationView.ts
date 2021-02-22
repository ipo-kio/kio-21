import {Tessellation} from "../model/Tessellation";
import {EPS} from "../model/Piece";
import {KioApi} from "../../KioApi";
import {Point} from "../model/Point";

export class TessellationView {

    private tesselation: Tessellation;
    private x0: number;
    private y0: number;
    private width: number;
    private height: number;
    private one: number;
    private kioapi: KioApi;

    constructor(kioapi: KioApi, tesselation: Tessellation, x0: number, y0: number, width: number, height: number, one: number) {
        this.tesselation = tesselation;
        this.x0 = x0;
        this.y0 = y0;
        this.width = width;
        this.height = height;
        this.one = one;
        this.kioapi = kioapi;
    }

    draw(ctx: CanvasRenderingContext2D, color: string): void {
        ctx.save();

        let img = this.kioapi.getResource('dog') as HTMLImageElement;

        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.lineJoin = "round";

        let cords = ({x, y}: { x: number, y: number }): [x: number, y: number] => {
            return [this.x0 + this.one * x, this.y0 - this.one * y];
        }

        let T1 = [this.one * this.tesselation.T1.x, -this.one * this.tesselation.T1.y]
        let T2 = [this.one * this.tesselation.T2.x, -this.one * this.tesselation.T2.y]

        for (let piece_in_points of this.tesselation.pieces) {
            let n = piece_in_points.size;
            let piece = new Array<[x: number, y: number]>(n);

            for (let i = 0; i < n; i++) {
                let p = piece_in_points.points[i];
                piece[i] = cords(p);
            }

            let process_t1 = (t1: number) => {
                let t1piece = new Array<[x: number, y: number]>(n);
                let L = 1e100;
                let U = -1e100;
                for (let i = 0; i < n; i++) {
                    let px = piece[i][0] + t1 * T1[0];
                    let py = piece[i][1] + t1 * T1[1];
                    t1piece[i] = [px, py];
                    //0 <= px + i * t2x <= w
                    //0 <= py + i * t2y <= h
                    let [l1, u1] = pair_of_inequalities(0, px, T2[0], this.width);
                    let [l2, u2] = pair_of_inequalities(0, py, T2[1], this.height);
                    let l = Math.max(l1, l2);
                    let u = Math.min(u1, u2);

                    if (l < L)
                        L = l;
                    if (u > U)
                        U = u;
                }

                if (U - L > 100) // just for any case
                    return false;

                for (let t2 = L; t2 <= U; t2++) {
                    let translate_x = T1[0] * t1 + T2[0] * t2;
                    let translate_y = T1[1] * t1 + T2[1] * t2;

                    draw_piece(ctx, piece, translate_x, translate_y, piece_in_points.orientation, img);
                }

                return L <= U;
            };

            let t1 = 0;
            while (t1 < 100)
                if (!process_t1(t1++))
                    break;
            t1 = -1;
            while (t1 > -100)
                if (!process_t1(t1--))
                    break;
        }

        ctx.restore();
    }
}

function pair_of_inequalities(a: number, b: number, c: number, d: number): [number, number] {
    //a <= b + i * c <= d
    if (Math.abs(c) < EPS)
        return [-1000000, 1000000];
    let left = (a - b) / c;
    let right = (d - b) / c;
    if (left < right)
        return [Math.ceil(left - EPS), Math.floor(right + EPS)];
    else
        return [Math.ceil(right - EPS), Math.floor(left + EPS)];
}

function draw_piece(ctx: CanvasRenderingContext2D, piece: [x: number, y: number][], translate_x: number, translate_y: number, orientation: [Point, Point], img: HTMLImageElement): void {
    ctx.save();

    ctx.beginPath();
    let [x, y] = piece[0];
    let pixel_x = x + translate_x;
    let pixel_y = y + translate_y;
    let x_sum = pixel_x;
    let y_sum = pixel_y;
    ctx.moveTo(pixel_x, pixel_y);

    let n = piece.length;

    for (let i = 1; i < n; i++) {
        let [x, y] = piece[i];
        let pixel_x = x + translate_x;
        let pixel_y = y + translate_y;
        x_sum += pixel_x;
        y_sum += pixel_y;
        ctx.lineTo(pixel_x, pixel_y);
    }
    ctx.closePath();
    ctx.clip();
    ctx.stroke();

    let x_center = x_sum / n;
    let y_center = y_sum / n;

    ctx.translate(x_center, y_center);
    let angle = Math.atan2(orientation[0].y, orientation[0].x);
    ctx.rotate(-angle);
    if (orientation[0].vec(orientation[1]) < 0) //1,0 vec 0,1
        ctx.scale(1, -1);

    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    ctx.restore();
}

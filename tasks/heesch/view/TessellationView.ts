import {Tessellation} from "../model/Tessellation";
import {Point} from "../model/Point";
import {EPS} from "../model/Piece";

export class TessellationView {

    private tesselation: Tessellation;
    private x0: number;
    private y0: number;
    private width: number;
    private height: number;
    private one: number;

    constructor(tesselation: Tessellation, x0: number, y0: number, width: number, height: number, one: number) {
        this.tesselation = tesselation;
        this.x0 = x0;
        this.y0 = y0;
        this.width = width;
        this.height = height;
        this.one = one;
    }

    draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.save();

        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.lineJoin = "round";

        let cords = ({x, y}: { x: number, y: number }): [x: number, y: number] => {
            return [this.x0 + this.one * x, this.y0 - this.one * y];
        }

        let T1 = [this.one * this.tesselation.T1.x, -this.one * this.tesselation.T1.y]
        let T2 = [this.one * this.tesselation.T2.x, -this.one * this.tesselation.T2.y]

        let pair_of_inequalities = (a: number, b: number, c: number, d: number): [number, number] => {
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
                    ctx.beginPath();
                    let [x, y] = piece[0];
                    ctx.moveTo(x + T1[0] * t1 + T2[0] * t2, y + T1[1] * t1 + T2[1] * t2);
                    for (let i = 1; i < n; i++) {
                        let [x, y] = piece[i];
                        ctx.lineTo(x + T1[0] * t1 + T2[0] * t2, y + T1[1] * t1 + T2[1] * t2);
                    }
                    ctx.closePath();
                    ctx.stroke();
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

        /*// for (let t1 = 0; t1 <= 0; t1++)
        for (let t1 = -10; t1 <= 10; t1++)
            // for (let t2 = 0; t2 <= 0; t2++) {
            for (let t2 = -10; t2 <= 10; t2++) {
                let cords = ({x, y}: { x: number, y: number }): [x: number, y: number] => {
                    return [
                        this.x0 + this.one * (x + t1 * this.tesselation.T1.x + t2 * this.tesselation.T2.x),
                        this.y0 - this.one * (y + t1 * this.tesselation.T1.y + t2 * this.tesselation.T2.y)
                    ];
                }

                let ind = 0;
                for (let piece of this.tesselation.pieces) {
                    ind++;
                    ctx.beginPath();
                    let startPoint = piece.point(0)
                    ctx.moveTo(...cords(startPoint));
                    for (let i = 1; i <= piece.size; i++) {
                        let point = piece.point(i);
                        ctx.lineTo(...cords(point));
                    }

                    let {xmin, xmax, ymin, ymax} = piece.boundingBox();

                    let [xxmin, yymin] = cords({x: xmin, y: ymin});
                    let [xxmax, yymax] = cords({x: xmax, y: ymax});
                    let gradient1 = ctx.createLinearGradient(xxmin, yymin, xxmax, yymax);
                    // gradient1.addColorStop(0, "#d8e00d");
                    // gradient1.addColorStop(1, "#4ce00d");
                    gradient1.addColorStop(0, "black");
                    gradient1.addColorStop(1, "white");

                    let gradient2 = ctx.createLinearGradient(xxmin, yymax, xxmax, yymin);
                    gradient2.addColorStop(0, "green");
                    gradient2.addColorStop(1, "white");

                    ctx.fillStyle = gradient1;
                    ctx.fill();
                    // ctx.globalCompositeOperation = "lighter";
                    if (t1 == 0 && t2 == 0) {
                        ctx.globalAlpha = 0.5;
                        ctx.fillStyle = gradient2;
                        ctx.fill();
                        // ctx.globalCompositeOperation = "source-over";
                        ctx.globalAlpha = 1;
                    }

                    ctx.stroke();

                    // draw orientation
                    let pc = piece.center();
                    let kx = 1;
                    let ky = 2;
                    let o1 = piece.orientation[0];
                    let o2 = piece.orientation[1];
                    let pc1 = pc.addWithCoef(o1, -kx / 2).addWithCoef(o2, -ky / 2);
                    let pc2 = pc1.addWithCoef(o1, kx);
                    let pc3 = pc1.addWithCoef(o2, ky);
                    let [x1, y1] = cords(pc1);
                    let [x2, y2] = cords(pc2);
                    let [x3, y3] = cords(pc3);
                    ctx.save();

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.lineTo(x3, y3);
                    ctx.fillStyle = "black";

                    ctx.fill();
                    // ctx.font = "21px Arial";
                    // ctx.textBaseline = "middle";
                    // ctx.textAlign = "center";
                    // let [pcx, pcy] = cords(pc);
                    // ctx.fillText('' + ind, pcx, pcy);
                    ctx.restore();
                }
            }

        let p = this.tesselation.pieces[0];
        let inds = this.tesselation.indexes;
        for (let i = 0; i < inds.length; i++) {
            let j = i + 1;
            if (j == inds.length)
                j = 0;
            let line = p.part(inds[i], inds[j]);
        }*/
    }
}

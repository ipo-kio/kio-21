import {Tessellation} from "../model/Tessellation";
import {Point} from "../model/Point";

export class TessellationView {

    private tesselation: Tessellation;
    private x0: number;
    private y0: number;
    private one: number;

    constructor(tesselation: Tessellation, x0: number, y0: number, one: number) {
        this.tesselation = tesselation;
        this.x0 = x0;
        this.y0 = y0;
        this.one = one;
    }

    draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.save();

        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.lineJoin = "round";

        // for (let t1 = 0; t1 <= 0; t1++)
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
        }
    }
}

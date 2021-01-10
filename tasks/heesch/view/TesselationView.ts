import {Tesselation} from "../model/Tesselation";
import {Point} from "../model/Point";

export class TesselationView {

    private tesselation: Tesselation;
    private x0: number;
    private y0: number;
    private one: number;

    constructor(tesselation: Tesselation, x0: number, y0: number, one: number) {
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

        // for (let t1 = 0; t1 <= 1; t1++)
        for (let t1 = -10; t1 <= 10; t1++)
            // for (let t2 = 0; t2 <= 0; t2++) {
            for (let t2 = -10; t2 <= 10; t2++) {
                let cords = ({x, y}: {x: number, y: number}) : [x: number, y: number] => {
                    return [
                        this.x0 + this.one * (x + t1 * this.tesselation.T1.x + t2 * this.tesselation.T2.x),
                        this.y0 - this.one * (y + t1 * this.tesselation.T1.y + t2 * this.tesselation.T2.y)
                    ];
                }

                for (let piece of this.tesselation.pieces) {
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
                    ctx.globalAlpha = 0.5;
                    ctx.fillStyle = gradient2;
                    ctx.fill();
                    // ctx.globalCompositeOperation = "source-over";
                    ctx.globalAlpha = 1;

                    ctx.stroke();
                }
            }

        ctx.restore();
    }
}

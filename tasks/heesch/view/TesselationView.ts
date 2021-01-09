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

        // for (let t1 = 0; t1 <= 1; t1++)
        for (let t1 = -3; t1 <= 3; t1++)
            // for (let t2 = 0; t2 <= 0; t2++) {
            for (let t2 = -3; t2 <= 3; t2++) {
                let cords = (point: Point) : [x: number, y: number] => {
                    return [
                        this.x0 + this.one * (point.x + t1 * this.tesselation.T1.x + t2 * this.tesselation.T2.x),
                        this.y0 + this.one * (point.y + t1 * this.tesselation.T1.y + t2 * this.tesselation.T2.y)
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
                    ctx.stroke();
                }
            }

        ctx.restore();
    }
}

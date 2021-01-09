import {Tesselation} from "../model/Tesselation";

export class TesselationView {

    private tesselation: Tesselation;
    private x0: number;
    private y0: number;
    private one: number;

    constructor(tesselation: Tesselation, x0: number, y0: number, one: number) {
        this.tesselation = tesselation;
    }

    draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.save();

        ctx.translate(this.x0, this.y0);
        ctx.scale(this.one, -this.one);

        ctx.lineWidth = 2;
        ctx.strokeStyle = color;

        for (let piece of this.tesselation.pieces) {
            ctx.beginPath();
            let startPoint = piece.point(0)
            ctx.moveTo(startPoint.x, startPoint.y);
            for (let i = 1; i <= piece.size; i++) {
                let point = piece.point(i);
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
        }

        //TODO apply translations also

        ctx.restore();
    }
}

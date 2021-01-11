import {Point} from "../model/Point";
import {EPS, Piece} from "../model/Piece";

const GRID_STEP = 20;
const WIDTH = 400;
const HEIGHT = 400;

const EDGE_COLOR = 'blue';
const EDGE_LINE_WIDTH = 4;

const VERTEX_BORDER_COLOR = 'black';
const VERTEX_COLOR = 'red';
const VERTEX_RADIUS = 8;
const VERTEX_BORDER_WIDTH = 0.5;

const BG_COLOR = '#5aff00';

type Segment = [p1: Point, p2: Point];

type PixelPoint = [x: number, y: number];

function test_segments_intersect(s1: Segment, s2: Segment): boolean {
    function line([{x: x1, y: y1}, {x: x2, y: y2}]: [p: Point, q: Point]): [a: number, b: number, c: number] {
        // (x - x2) / (x1 - x2) = (y - y2) / (y1 - y2)
        return [
            y1 - y2,
            x2 - x1,
            x1 * y2 - x2 * y1
        ];
    }

    function sub_to_line([a, b, c]: [number, number, number], p: Point) {
        return a * p.x + b * p.y + c;
    }

    let line1 = line(s1);
    let val10 = sub_to_line(line1, s2[0]);
    let val11 = sub_to_line(line1, s2[1]);
    let mul1 = val10 * val11;
    if (mul1 > 0)
        return false;
    let line2 = line(s2);
    let val20 = sub_to_line(line2, s1[0]);
    let val21 = sub_to_line(line2, s1[1]);
    let mul2 = val20 * val21;
    if (mul2 > 0)
        return false;

    // now mul1 <= 0 and mul2 <= 0

    if (mul1 < 0 || mul2 < 0)
        return true;

    // now mul1 == 0 and mul2 == 0
    let proj = [s1[0].x, s1[1].x, s2[0].x, s2[1].x];
    if (Math.max(proj[0], proj[1]) < Math.min(proj[2], proj[3]))
        return false;
    if (Math.min(proj[0], proj[1]) > Math.max(proj[2], proj[3]))
        return false;

    proj = [s1[0].y, s1[1].y, s2[0].y, s2[1].y];
    if (Math.max(proj[0], proj[1]) < Math.min(proj[2], proj[3]))
        return false;
    if (Math.min(proj[0], proj[1]) > Math.max(proj[2], proj[3]))
        return false;

    return true;
}

function test_segments_have_only_1_intersection(p1: Point, p2: Point, p3: Point): boolean {
    let v1 = p1.sub(p2); // p1 <- p2 -> p3
    let v2 = p3.sub(p2);

    let vec = v1.vec(v2);
    if (Math.abs(vec) > EPS)
        return true;

    //v1 and v2 are collinear
    //should go in different directions

    return v1.dot(v2) < 0;
}


export class PieceEditor {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    points: Point[];

    X0: number;
    Y0: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        this.X0 = WIDTH / 2;
        this.Y0 = HEIGHT / 2;
    }

    redraw() {
        this.drawGrid();
        this.drawEdges();
        this.drawVertices();
    }

    private drawGrid() {
        let {x: xMin, y: yMax} = this.pixel2point([0, 0]);
        let {x: xMax, y: yMin} = this.pixel2point([WIDTH, HEIGHT]);

        xMin = Math.floor(xMin);
        yMin = Math.floor(yMin);
        xMax = Math.ceil(xMax);
        yMax = Math.ceil(yMax);

        let c = this.ctx;
        c.save();

        c.fillStyle = BG_COLOR;
        c.fillRect(0, 0, WIDTH, HEIGHT);

        c.beginPath();
        for (let x = xMin; x <= xMax; x++) {
            let xx = this.X0 + x * GRID_STEP;
            c.moveTo(xx + 0.5, 0);
            c.lineTo(xx + 0.5, HEIGHT);
        }
        for (let y = yMin; y <= yMax; y++) {
            let yy = this.Y0 - y * GRID_STEP;
            console.log(y, yy);
            c.moveTo(0, yy + 0.5);
            c.lineTo(WIDTH, yy + 0.5);
        }
        c.strokeStyle = 'rgba(0,0,0,0.5)'; // TODO make a constant

        c.stroke();

        c.restore();
    }

    private drawEdges() {
        let c = this.ctx;

        c.save();

        let [xStart, yStart] = this.point2pixel(this.points[0]);
        c.beginPath()
        c.moveTo(xStart, yStart);

        for (let i = 1; i < this.points.length; i++) {
            let [x, y] = this.point2pixel(this.points[i]);
            c.lineTo(x, y);
        }
        c.closePath();

        c.strokeStyle = EDGE_COLOR;
        c.fillStyle = 'rgba(255, 255, 255, 0.5)'; //TODO make a constant
        c.lineWidth = EDGE_LINE_WIDTH;
        c.fill();
        c.stroke();

        c.restore();
    }

    private drawVertices() {
        let c = this.ctx;
        c.save();

        c.strokeStyle = VERTEX_BORDER_COLOR;
        c.lineWidth = VERTEX_BORDER_WIDTH;
        c.fillStyle = VERTEX_COLOR;

        for (let p of this.points) {
            let [x, y] = this.point2pixel(p);
            c.beginPath();
            c.arc(x, y, VERTEX_RADIUS, 0, Math.PI * 2);
            c.fill();
            c.stroke();
        }

        c.restore();
    }

    getCursorPosition(e: MouseEvent): PixelPoint {
        const rect = this.canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        return [x, y];
    }

    pixel2point(p: PixelPoint): Point {
        let [x, y] = p;
        return new Point(
            (x - this.X0) / GRID_STEP,
            -(y - this.Y0) / GRID_STEP
        );
    }

    point2pixel(p: Point): PixelPoint {
        return [
            this.X0 + p.x * GRID_STEP,
            this.Y0 - p.y * GRID_STEP
        ];
    }

    get piece() {
        return new Piece(this.points);
    }

    set piece(p: Piece) {
        let n = p.size;
        this.points = p.points.slice();
        this.redraw();
    }
}

import {Point} from "../model/Point";
import {EPS, Piece} from "../model/Piece";

const GRID_STEP = 20;
const WIDTH = 400;
const HEIGHT = 400;

const EDGE_COLOR = 'blue';
const ERROR_EDGE_COLOR = 'red';
const EDGE_LINE_WIDTH = 3;

const VERTEX_BORDER_COLOR = 'black';
const VERTEX_COLOR = 'red';
const VERTEX_RADIUS = 6;
const VERTEX_BORDER_WIDTH = 0.5;

const HOVER_DIST = 2 * GRID_STEP / 3;

const HIGHLIGHTED_VERTEX_COLOR = '#e7e302';
const EDGE_HIGHLIGHT_COLOR = HIGHLIGHTED_VERTEX_COLOR; //'rgb(231,227,2, 0.4)';
const EDGE_HIGHLIGHT_WIDTH = 2 * EDGE_LINE_WIDTH; // 2 * HOVER_DIST

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
    if (mul1 > EPS)
        return false;
    let line2 = line(s2);
    let val20 = sub_to_line(line2, s1[0]);
    let val21 = sub_to_line(line2, s1[1]);
    let mul2 = val20 * val21;
    if (mul2 > EPS)
        return false;

    // now mul1 <= 0 and mul2 <= 0

    if (mul1 < -EPS || mul2 < -EPS)
        return true;

    // now mul1 == 0 and mul2 == 0
    let proj = [s1[0].x, s1[1].x, s2[0].x, s2[1].x];
    if (Math.max(proj[0], proj[1]) + EPS < Math.min(proj[2], proj[3]))
        return false;
    if (Math.min(proj[0], proj[1]) - EPS > Math.max(proj[2], proj[3]))
        return false;

    proj = [s1[0].y, s1[1].y, s2[0].y, s2[1].y];
    if (Math.max(proj[0], proj[1]) + EPS < Math.min(proj[2], proj[3]))
        return false;
    if (Math.min(proj[0], proj[1]) - EPS > Math.max(proj[2], proj[3]))
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

    movingPoint: number = -1; // index of moving point or -1 if not
    movingClick: PixelPoint;
    movingPointClickPosition: PixelPoint;

    highlightedPoint: number = -1; // highlighted point
    highlightedEdge: number = -1; // highlighted point

    errorEdges: Set<number> = new Set<number>();

    info_points: Point[] = [];
    info_lines: [Point, Point][] = [];

    private _pieceChangeListener: ((newPiece: Piece) => void) | undefined = undefined;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        this.X0 = WIDTH / 2;
        this.Y0 = HEIGHT / 2;

        canvas.addEventListener('mousedown', e => {
            let searchPoint = this.getCursorPosition(e);

            let point_ind = this.findPoint(searchPoint);
            if (point_ind != -1) {
                this.movingPoint = point_ind;
                this.movingClick = searchPoint;
                this.movingPointClickPosition = this.point2pixel(this.points[point_ind]);
                return;
            }
            this.movingPoint = -1;

            let segment_ind = this.findEdge(searchPoint);
            if (segment_ind != -1) {
                let newPoint = this.pixel2point(searchPoint);
                newPoint.update(Math.round(newPoint.x), Math.round(newPoint.y));
                // let j = segment_ind - 2;
                // if (j < 0) j += this.points.length;
                this.points.splice(segment_ind, 0, newPoint);

                this.movingPoint = segment_ind;
                this.movingClick = searchPoint;
                this.movingPointClickPosition = this.point2pixel(newPoint);

                this.redraw();
            }
        });

        // TODO optimize redraws, don't redraw if nothing changed
        canvas.addEventListener('mousemove', e => {
            let mousePoint = this.getCursorPosition(e);

            let highlightingChanged = this.highlight(mousePoint);

            if (this.movingPoint == -1) {
                if (highlightingChanged)
                    this.redraw();
                return;
            }

            // mousePoint - movingClick + movingPointClickPosition
            let x = mousePoint[0] - this.movingClick[0] + this.movingPointClickPosition[0];
            let y = mousePoint[1] - this.movingClick[1] + this.movingPointClickPosition[1];

            if (x < 0) x = 0;
            if (x > this.canvas.width) x = this.canvas.width - 1;
            if (y < 0) y = 0;
            if (y > this.canvas.width) y = this.canvas.height - 1;

            let thePoint = this.points[this.movingPoint];
            let {x: prevX, y: prevY} = thePoint;
            this.pixel2point([x, y], thePoint);
            thePoint.update(Math.round(thePoint.x), Math.round(thePoint.y));
            let pointChanged = prevX != thePoint.x || prevY != thePoint.y;
            if (!pointChanged)
                return;

            let prevInd = this.movingPoint == 0 ? this.points.length - 1 : this.movingPoint - 1;
            let nextInd = this.movingPoint == this.points.length - 1 ? 0 : this.movingPoint + 1;
            let isTheSameAsNeighbour = thePoint.equals(this.points[prevInd]) || thePoint.equals(this.points[nextInd]);

            this.updateErrorEdges();
            this.clear_info();
            this.redraw();

            // draw info about deleting a point
            if (isTheSameAsNeighbour) {
                this.ctx.save();
                this.ctx.font = "18px sans-serif";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "bottom";
                let [tx, ty] = this.point2pixel(thePoint);
                let removeVertexText = "Удалить вершину";
                let measuredText = this.ctx.measureText(removeVertexText);
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.fillRect(
                    tx - measuredText.actualBoundingBoxLeft - 2,
                    ty - VERTEX_RADIUS - 2 - measuredText.actualBoundingBoxAscent - 2,
                    measuredText.width + 4,
                    measuredText.actualBoundingBoxAscent + measuredText.actualBoundingBoxDescent + 4
                );
                this.ctx.fillStyle = "black";
                this.ctx.fillText(removeVertexText, tx, ty - VERTEX_RADIUS - 2);
                this.ctx.restore();
            }

            this.firePieceChange();
        });

        canvas.addEventListener('mouseup', e => {
            if (this.movingPoint == -1)
                return;

            let p = this.points[this.movingPoint];
            p.update(Math.round(p.x), Math.round(p.y)); // no need by the way

            let prevInd = this.movingPoint == 0 ? this.points.length - 1 : this.movingPoint - 1;
            let nextInd = this.movingPoint == this.points.length - 1 ? 0 : this.movingPoint + 1;

            let isTheSameAsNeighbour = p.equals(this.points[prevInd]) || p.equals(this.points[nextInd]);
            if (isTheSameAsNeighbour && this.points.length > 3)
                this.points.splice(this.movingPoint, 1);

            this.movingPoint = -1;
            this.highlight(this.getCursorPosition(e));
            this.updateErrorEdges();

            this.clear_info();
            this.redraw();
            this.firePieceChange();
        });
    }

    updatePoints(points: Point[]) {
        this.points = points;
        this.movingPoint = -1;
        this.highlightedPoint = -1;
        this.highlightedEdge = -1;
        this.updateErrorEdges();
        this.clear_info();
        this.redraw();
        this.firePieceChange();
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

        let drawEdge = (e: number, color: string, width: number, is_dashed: boolean) => {
            c.save();
            if (is_dashed)
                c.setLineDash([GRID_STEP / 2, GRID_STEP / 3]);
            c.strokeStyle = color;
            c.lineWidth = width;
            let j = e - 1;
            if (j < 0) j = n - 1;
            let [x, y] = this.point2pixel(this.points[e]);
            let [xx, yy] = this.point2pixel(this.points[j]);
            c.beginPath();
            c.moveTo(x, y);
            c.lineTo(xx, yy);
            c.stroke();
            c.restore();
        };

        let [xStart, yStart] = this.point2pixel(this.points[0]);
        c.beginPath()
        c.moveTo(xStart, yStart);
        let xMin = 1e100;
        let xMax = -1e100;
        let yMin = 1e100;
        let yMax = -1e100;

        let n = this.points.length;

        for (let i = 1; i < n; i++) {
            let [x, y] = this.point2pixel(this.points[i]);
            xMin = Math.min(xMin, x);
            xMax = Math.max(xMax, x);
            yMin = Math.min(yMin, y)
            yMax = Math.max(yMin, y)
            c.lineTo(x, y);
        }
        c.closePath();

        let grad = c.createLinearGradient(xMin, yMin, xMax, yMax);
        grad.addColorStop(0, 'rgba(200, 200, 255, 0.4)'); // Make a constant
        grad.addColorStop(1, 'rgba(0, 0, 255, 0.4)'); // Make a constant

        c.fillStyle = grad;
        c.fill();

        for (let i = 0; i < n; i++)
            if (this.errorEdges.has(i))
                drawEdge(i, ERROR_EDGE_COLOR, EDGE_LINE_WIDTH, true);
            else
                drawEdge(i, EDGE_COLOR, EDGE_LINE_WIDTH, false);

        if (this.highlightedEdge >= 0)
            drawEdge(this.highlightedEdge, EDGE_HIGHLIGHT_COLOR, EDGE_HIGHLIGHT_WIDTH, false);

        c.restore();
    }

    private drawVertices() {
        let c = this.ctx;
        c.save();

        c.strokeStyle = VERTEX_BORDER_COLOR;
        c.lineWidth = VERTEX_BORDER_WIDTH;

        for (let i = 0; i < this.points.length; i++) {
            let p = this.points[i];
            let [x, y] = this.point2pixel(p);

            //test point is on the edge
            let p_1 = i == 0 ? this.points[this.points.length - 1] : this.points[i - 1];
            let p_2 = i == this.points.length - 1 ? this.points[0] : this.points[i + 1];
            if (Math.abs(p_1.sub(p).vec(p_2.sub(p))) < EPS)
                c.fillStyle = 'rgba(255, 255, 255, 1)';
            else
                c.fillStyle = VERTEX_COLOR;
            if (i == this.highlightedPoint)
                c.fillStyle = HIGHLIGHTED_VERTEX_COLOR;

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

    pixel2point(p: PixelPoint, changingPoint: Point = null): Point {
        let [x, y] = p;

        let xx = (x - this.X0) / GRID_STEP;
        let yy = -(y - this.Y0) / GRID_STEP;

        if (changingPoint == null)
            return new Point(xx, yy);
        else {
            changingPoint.update(xx, yy);
            return changingPoint;
        }
    }

    point2pixel(p: Point): PixelPoint {
        return [
            this.X0 + p.x * GRID_STEP,
            this.Y0 - p.y * GRID_STEP
        ];
    }

    get piece() {
        if (this.errorEdges.size > 0)
            return null;
        return new Piece(this.points);
    }

    set piece(p: Piece) {
        let n = p.size;
        this.points = p.points.slice();
        this.updateErrorEdges();
        this.redraw();
    }

    private highlight(mousePoint: PixelPoint): boolean {
        let previousHighlightedPoint = this.highlightedPoint;
        let previousHighlightedEdge = this.highlightedEdge;

        let ind = this.movingPoint;
        if (ind == -1)
            ind = this.findPoint(mousePoint);

        if (ind >= 0) {
            this.highlightedPoint = ind;
            this.highlightedEdge = -1;
        } else {
            this.highlightedPoint = -1;
            this.highlightedEdge = this.findEdge(mousePoint);
        }

        return previousHighlightedEdge != this.highlightedEdge || previousHighlightedPoint != this.highlightedPoint;
    }

    findPoint(searchPoint: PixelPoint) {
        for (let i = 0; i < this.points.length; i++) {
            let p = this.points[i];
            let pp = this.point2pixel(p);
            if (Math.abs(pp[0] - searchPoint[0]) + Math.abs(pp[1] - searchPoint[1]) < HOVER_DIST)
                return i;
        }
        return -1;
    }

    findEdge(searchPoint: PixelPoint): number {
        for (let i = 0; i < this.points.length; i++) {
            let p1 = i == 0 ? this.points[this.points.length - 1] : this.points[i - 1];
            let p2 = this.points[i];
            let [x, y] = searchPoint;
            let [x1, y1] = this.point2pixel(p1);
            let [x2, y2] = this.point2pixel(p2);

            if (x1 == x2 && y1 == y2)
                continue;

            //test [x, y] is near the segment [x1, y1]-[x2, y2]
            //   x - x1     y - y1
            //  -------  = -------
            //  x2 - x1    y2 - y1
            //
            // x(y2 - y1) + y(x1 - x2) + (x2 * y1 - x1 * y2) = 0
            // |x(y2 - y1) + y(x1 - x2) + (x2 * y1 - x1 * y2)| < HOVER_DIST * sqrt(A^2 + B^2)
            let a = y2 - y1;
            let b = x1 - x2;
            let c = x2 * y1 - x1 * y2;
            let v = a * x + b * y + c;
            // v < HOVER_DIST * sqrt(a^2 + b^2)
            if (v * v > HOVER_DIST * HOVER_DIST * (a * a + b * b))
                continue;

            //test that the point is near the segment, not just the line
            //perpendicular line through x1, x2
            let ap = x1 - x2;
            let bp = y1 - y2;
            let c1 = -ap * x1 - bp * y1;
            let c2 = -ap * x2 - bp * y2;

            if ((x1 * ap + y1 * bp + c2) * (x * ap + y * bp + c2) <= 0)
                continue;
            if ((x2 * ap + y2 * bp + c1) * (x * ap + y * bp + c1) <= 0)
                continue;

            return i;
        }

        return -1;
    }

    updateErrorEdges() {
        this.errorEdges.clear();
        let n = this.points.length;
        for (let i = 0; i < n; i++) {
            let i1 = i == 0 ? n - 1 : i - 1;
            let i2 = i;
            let p1 = this.points[i1];
            let p2 = this.points[i2];

            if (p1.equals(p2)) {
                this.errorEdges.add(i2);
                continue;
            }

            for (let j = i + 1; j < i + n; j++) {

                let j1 = (j - 1) % n;
                let j2 = j % n;

                let p3 = this.points[j1];
                let p4 = this.points[j2];

                if (p3.equals(p4)) // just for any case: don't intersect empty edge
                    continue;

                if (
                    j == i + 1 && !test_segments_have_only_1_intersection(p1, p2, p4) ||
                    j == i + n - 1 && !test_segments_have_only_1_intersection(p3, p1, p2) ||
                    j > i + 1 && j < i + n - 1 && test_segments_intersect([p1, p2], [p3, p4])
                ) {
                    this.errorEdges.add(i2);
                    this.errorEdges.add(j2);
                }
            }
        }
    }

    //TODO all points on one line is also an error
    //TODO mouse move should debounce reevaluation.

    firePieceChange() {
        if (this._pieceChangeListener) {
            if (this.errorEdges.size > 0) {
                this._pieceChangeListener(null);
                return;
            }

            let newPoints: Point[] = [];
            for (let point of this.points)
                newPoints.push(new Point(point.x, point.y));

            this._pieceChangeListener(new Piece(newPoints));
        }
    }

    set pieceChangeListener(value: (newPiece: Piece) => void) {
        this._pieceChangeListener = value;
    }

    clear_info(): void {
        this.info_points = [];
        this.info_lines = [];
    }

    draw_info_point(p: Point): void {
        this.info_points.push(p);
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'white';
        this.ctx.arc(this.X0 + GRID_STEP * p.x, this.Y0 - GRID_STEP * p.y, 4, 0, 2 * Math.PI);
    }

    draw_info_line(p1: Point, p2: Point): void {
        this.info_lines.push([p1, p2]);
    }
}

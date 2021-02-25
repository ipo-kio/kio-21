import './heesch.scss';
import {KioApi, KioParameterDescription, KioResourceDescription, KioTaskSettings} from "../KioApi";
import {Piece} from "./model/Piece";
import {Point} from "./model/Point";
import {TessellationView} from "./view/TessellationView";
import {PieceEditor} from "./view/PieceEditor";
import {compareTessellations, Tessellation, tessellationIsTranslateblyEquivalent} from "./model/Tessellation";

export class Heesch {
    private settings: KioTaskSettings;
    private kioapi: KioApi;

    private editor_canvas: HTMLCanvasElement;
    private tesselation_canvas: HTMLCanvasElement;
    private tessellation_ctx: CanvasRenderingContext2D;

    private editor: PieceEditor;
    private tessellations: Tessellation[] = [];
    private tesselationSelect: HTMLSelectElement;

    private need_take_care_of_orientation: boolean = false;
    private draw_orientation = true;
    private has_error: boolean = false;

    /**
     *
     * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
     * которое может быть 0, 1 или 2.
     */
    constructor(settings: KioTaskSettings) {
        this.settings = settings;
        this.need_take_care_of_orientation = +settings.level > 0;
        this.draw_orientation = +settings.level > 0;
    }

    /**
     * Идентификатор задачи, используется сейчас только как ключ для
     * хранения данных в localstorage
     * @returns {string} идентификатор задачи
     */
    id() {
        return 'heesch' + this.settings.level;
    }

    /**
     *
     * @param domNode
     * @param kioapi
     * @param preferred_width
     */
    initialize(domNode: HTMLElement, kioapi: KioApi, preferred_width: number) {
        // test
        /*let square = new Piece([
            new Point(0, 0),
            new Point(0, 18),
            new Point(18, 18),
            new Point(18, 0)
        ]);
        square = square.fulfill();
        square.searchForType((t, i) => {});*/

        //test
        /*let tg1g1tg2g2 = new Piece([
            new Point(0, 0),
            new Point(4, 0), // 1
            new Point(8, 3), // 2
            new Point(8, 4),
            new Point(8, 5),
            new Point(8, 6),
            new Point(8, 7),
            new Point(8, 8), //7
            new Point(4, 8),
            new Point(0, 5),
            new Point(0, 4),
            new Point(0, 3),
            new Point(0, 2),
            new Point(0, 1)
        ]);
        let poly1 = tg1g1tg2g2.part(1, 2);
        let poly2 = tg1g1tg2g2.part(2, 7);
        console.log("G", PolyLineUtils.isG(poly1, poly2));
        let ts = TYPE_TG1G1TG2G2.tessellate(tg1g1tg2g2, [
            0, 1, 2, 3, 4, 5
        ]);
        console.log(ts);
        tg1g1tg2g2.searchForType((t, i) => {});*/

        //test tg1g2tg2g1
        /*let tg1g1tg2g2 = new Piece([
            new Point(0, 0),
                new Point(2, 0),
                new Point(3, -1),
            new Point(4, 0),
            new Point(8, 3),
            new Point(8, 8),
                new Point(7, 7),
                new Point(6, 8),
            new Point(4, 8),
            new Point(0, 5)
        ]);
        let poly1 = tg1g1tg2g2.part(1, 3);
        let poly2 = tg1g1tg2g2.part(5, 7);
        console.log("isG", PolyLineUtils.isG(poly1, poly2), poly1.toString(), poly2.toString());*/
        // tg1g1tg2g2.searchForType((t, i) => {console.log('ft', i)});

        /*let sq = new Piece([
            new Point(0, 0),
            new Point(0, 10),
            new Point(10, 10),
            new Point(10, 0)
        ]);
        let t1 = TYPE_TTTTTT.tessellate(sq, [0, 1, 2, 2, 3, 4, 4]);
        console.log(compareTessellations(t1, t1, false));
        let t2 = TYPE_TTTTTT.tessellate(sq, [0, 1, 1, 2, 3, 3, 4]);
        console.log(t1, t2, compareTessellations(t1, t2, false), compareTessellations(t1, t1, false));*/

        this.kioapi = kioapi;

        this.editor_canvas = document.createElement('canvas');
        this.editor_canvas.classList.add('piece')
        this.editor_canvas.width = 400;
        this.editor_canvas.height = 400;

        this.tesselation_canvas = document.createElement('canvas');

        this.tesselation_canvas.height = 500;
        this.tesselation_canvas.classList.add('tesselation');
        let resize_listener = () => {
            this.tesselation_canvas.width = domNode.clientWidth;
            this.updateTessellationView();
        };
        window.addEventListener('resize', debounce(resize_listener));

        this.tessellation_ctx = this.tesselation_canvas.getContext('2d');

        this.tessellations = [];
        this.tesselationSelect = document.createElement("select");
        this.tesselationSelect.size = 20;
        this.tesselationSelect.addEventListener("input", (e: any) => this.updateTessellationView());

        domNode.classList.add('heesch-task-container');
        domNode.appendChild(this.tesselation_canvas);
        domNode.appendChild(this.editor_canvas);
        domNode.append(this.tesselationSelect);

        let piece = new Piece([
            new Point(4, 3),
            new Point(1, 4),
            new Point(0, 2),
            new Point(-2, 1),
            new Point(-2, -1),
            new Point(0, -2),
            new Point(0, -4),
            new Point(1, -2),
            new Point(4, -3),
            new Point(5, 0),
            new Point(6, 0),
            new Point(5, 3),
        ]);

        this.editor = new PieceEditor(this.editor_canvas);
        this.editor.piece = piece;

        this.updateTessellationPiece(piece);

        this.editor.pieceChangeListener = debounce((piece: Piece | null) => this.updateTessellationPiece(piece));

        resize_listener();
    }

    static preloadManifest(): KioResourceDescription[] {
        return [
            {id: "dog", src: "heesch-resources/dog.png"},
        ];
    }

    parameters(): KioParameterDescription[] {
        return [{
            name: "ok",
            title: "Есть узор",
            ordering: "maximize",
            view(v: number): string {
                if (v == 1)
                    return "да";
                else
                    return "нет";
            }
        }, {
            name: "g",
            title: "Видов узоров",
            ordering: 'maximize'
        }, {
            name: "v",
            title: "Вершин",
            ordering: 'maximize'
        }];
    }

    loadSolution(solution: Solution) {
        // Все объекты, которые сюда передаются, были ранее возвращены методом solution,
        // но проверять их все равно необходимо.
        if (!solution)
            return;
        if (!('p' in solution))
            return;
        let points = solution.p;
        let n = points.length;
        let newPoints: Point[] = [];
        for (let i = 0; i < n; i += 2)
            newPoints.push(new Point(points[i], points[i + 1]));
        this.editor.updatePoints(newPoints);

        console.log('loaded piece', this.editor.piece.toString());
    }

    private updateTessellationView() {
        let w = this.tesselation_canvas.width;
        let h = this.tesselation_canvas.height;
        this.tessellation_ctx.clearRect(0, 0, w, h);

        if (this.tesselationSelect.length == 0) {
            // draw only one piece in the center

            return;
        }

        if (!this.tesselationSelect.value)
            this.tesselationSelect.value = "0";

        let selectedIndex: number = +this.tesselationSelect.value;

        let x0 = w / 2;
        let y0 = h / 2;
        let dog = this.draw_orientation ? this.kioapi.getResource('dog') as HTMLImageElement : null;

        let tessellation = this.tessellations[selectedIndex];

        let tessellationView = new TessellationView(dog, tessellation, x0, y0, w, h, 10);
        tessellationView.draw(this.tessellation_ctx, 'black');

        let p = tessellation.pieces[0];
        let i = tessellation.indexes;
        console.log("selecting tessellation " + tessellation.piece_type.name + " " + tessellation.grid_type);
        for (let ii of i)
            console.log(p.point(ii).toString());
    }

    solution(): Solution {
        let points = [];
        for (let p of this.editor.points)
            points.push(p.x, p.y);
        return {p: points};
    }

    private updateTessellationPiece(piece: Piece) {
        let generateError = () => {
            this.has_error = true;
            this.kioapi.submitResult({ok: 0, g: 0, v: piece.size_without_inner_points});
            this.updateTessellationView();
        }

        this.has_error = false;

        if (piece == null) {
            generateError();
            return;
        }

        piece = piece.fulfill();

        if (piece.sign == 0) {
            generateError();
            return;
        }

        let tessellations_groups: Tessellation[][] = [];

        piece.searchForType((pt, ind) => {
            let tessellation = pt.tessellate(piece, ind);
            if (tessellation == null)
                return;

            let was_added = false;
            for (let tessellations_group of tessellations_groups) {
                let first_tessellation = tessellations_group[0];

                let grids_are_similar = first_tessellation.grid_type == tessellation.grid_type;
                let tessellations_are_similar =
                    tessellationIsTranslateblyEquivalent(
                        tessellation,
                        first_tessellation,
                        this.need_take_care_of_orientation
                    ) && grids_are_similar;

                if (!tessellations_are_similar)
                    continue;
                // either add tesselation or don't add if there is the same one
                was_added = true;
                if (tessellations_group.length > 20)
                    break;
                for (let tessellation_in_the_group of tessellations_group)
                    if (compareTessellations(tessellation_in_the_group, tessellation, this.need_take_care_of_orientation))
                        return;
                tessellations_group.push(tessellation);
            }
            if (!was_added) {
                let tessellations_group: Tessellation[] = [tessellation];
                tessellations_groups.push(tessellations_group);
            }
        });

        this.tessellations = [];
        this.tesselationSelect.innerHTML = '';
        let group_index = 0;
        for (let tessellations_group of tessellations_groups) {
            group_index++;
            if (tessellations_group.length > 1) {
                let optgroup = document.createElement("optgroup");
                optgroup.label = group_index + " похожие";
                let index_in_the_group = 0;
                for (let tessellation of tessellations_group) {
                    index_in_the_group++;
                    let new_index = -1 + this.tessellations.push(tessellation);
                    let option = document.createElement("option");
                    option.value = "" + new_index;
                    option.innerText = group_index + '-' + index_in_the_group;
                    optgroup.append(option);
                    this.tesselationSelect.add(optgroup);
                }
            } else {
                let tessellation = tessellations_group[0];
                let new_index = -1 + this.tessellations.push(tessellation);
                let option = document.createElement("option");
                option.value = "" + new_index;
                option.innerText = '' + group_index;
                this.tesselationSelect.add(option);
            }
        }

        /*let tes0 = this.tessellations[0];
        let tes6 = this.tessellations[6];
        let tes11 = this.tessellations[11];
        if (tes11)
            console.log('T0-T3',
                compareTessellations(tes6, tes11, false),
                tessellationIsTranslateblyEquivalent(tes0, tes6, false),
                tessellationIsTranslateblyEquivalent(tes0, tes11, false),
                tessellationIsTranslateblyEquivalent(tes6, tes11, false)
            );
*/
        this.updateTessellationView();
        let g = tessellations_groups.length;
        this.kioapi.submitResult({
            ok: g > 0,
            g,
            v: piece.size_without_inner_points
        });
    }
}

interface Solution {
    p: number[]
}

// https://medium.com/@griffinmichl/implementing-debounce-in-javascript-eab51a12311e
function debounce(func: any, wait: number = 500) {
    let timeout: any;
    return function(...args: any[]) {
        const context = this;
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(context, args), wait)
    }
}

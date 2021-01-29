import './heesch.scss'; //TODO заменить имя файла со стилями
import {KioApi, KioResourceDescription, KioTaskSettings} from "../KioApi";
import {Piece} from "./model/Piece";
import {Point} from "./model/Point";
import {PolyLineUtils} from "./model/PolyLineUtils";
import {TessellationView} from "./view/TessellationView";
import {PieceEditor} from "./view/PieceEditor";
import {Tessellation} from "./model/Tessellation";

export class Heesch { //TODO название класса должно совпадать с id задачи, но с заглавной буквы
    private settings: KioTaskSettings;
    private kioapi: KioApi;

    private editor_canvas: HTMLCanvasElement;
    private tesselation_canvas: HTMLCanvasElement;
    private tessellation_ctx: CanvasRenderingContext2D;

    private editor: PieceEditor;
    private tessellations: Tessellation[] = [];
    private tesselationSelect: HTMLSelectElement;

    /**
     *
     * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
     * которое может быть 0, 1 или 2.
     */
    constructor(settings: KioTaskSettings) {
        this.settings = settings;
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
        let square = new Piece([
            new Point(0, 0),
            new Point(0, 18),
            new Point(18, 18),
            new Point(18, 0)
        ]);
        square = square.fulfill();
        square.searchForType((t, i) => {});
        console.log("=====================================")

        this.kioapi = kioapi;

        this.editor_canvas = document.createElement('canvas');
        this.tesselation_canvas = document.createElement('canvas');

        this.tesselation_canvas.width = 600;
        this.tesselation_canvas.height = 600;

        this.tessellation_ctx = this.tesselation_canvas.getContext('2d');

        this.tessellations = [];
        this.tesselationSelect = document.createElement("select");
        this.tesselationSelect.size = 10;
        this.tesselationSelect.addEventListener("input", e => this.updateTessellationView());

        domNode.classList.add('heesch-task-container');
        domNode.appendChild(this.editor_canvas);
        domNode.append(this.tesselationSelect);
        domNode.appendChild(this.tesselation_canvas);

        let tcctgg = new Piece([
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
        this.editor.piece = tcctgg;

        this.updateTessellationPiece(tcctgg);

        this.editor.pieceChangeListener = piece => this.updateTessellationPiece(piece);
    }

    static preloadManifest(): void { //KioResourceDescription[] {
        // return [
        //     {id: "", src: "heesch-resources/air.jpg"},
        // ]; //TODO перечислить загружаемые ресурсы. Они находятся в каталоге heat-resources
    }

    parameters(): KioResourceDescription[] {
        return [];
    }

    loadSolution(solution: Solution) {
        // Все объекты, которые сюда передаются, были ранее возвращены методом solution,
        // но проверять их все равно необходимо.
    }

    solution(): Solution {
        return {};
    }

    private updateTessellationView() {
        this.tessellation_ctx.clearRect(0, 0, this.tesselation_canvas.width, this.tesselation_canvas.height);

        if (this.tesselationSelect.length == 0) {
            // draw only one piece in the center

            return;
        }

        if (!this.tesselationSelect.value)
            this.tesselationSelect.value = "0";

        let selectedIndex: number = +this.tesselationSelect.value;

        let tessellationView = new TessellationView(this.tessellations[selectedIndex], 300, 400, 10);
        tessellationView.draw(this.tessellation_ctx, 'black');
    }

    private updateTessellationPiece(piece: Piece) {
        piece = piece.fulfill();
        this.tessellations = [];
        this.tesselationSelect.length = 0;

        piece.searchForType((pt, ind) => {
            let tessellation = pt.tessellate(piece, ind);
            let new_index = -1 + this.tessellations.push(tessellation);
            let option = document.createElement("option");
            option.value = "" + new_index;
            option.innerText = pt.name;
            this.tesselationSelect.add(option);
        });

        this.updateTessellationView();
    }
}

interface Solution {
}

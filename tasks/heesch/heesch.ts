import './heesch.scss'; //TODO заменить имя файла со стилями
import {KioApi, KioResourceDescription, KioTaskSettings} from "../KioApi";
import Stage = createjs.Stage;
import {Piece} from "./model/Piece";
import {Point} from "./model/Point";
import {PolyLineUtils} from "./model/PolyLineUtils";

export class Heesch { //TODO название класса должно совпадать с id задачи, но с заглавной буквы
    private settings: KioTaskSettings;
    private kioapi: KioApi;

    private canvas: HTMLCanvasElement;

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
        this.kioapi = kioapi;

        this.canvas = document.createElement('canvas');
        this.canvas.width = 900;
        this.canvas.height = 610;

        let stage: Stage = new Stage(this.canvas);

        stage.enableMouseOver();

        createjs.Ticker.addEventListener('tick', stage);

        domNode.appendChild(this.canvas);
        domNode.classList.add('heesch-task-container');

        test();
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

}

interface Solution {
}

function test() {
    let p = new Piece([
        new Point(0, 0),
        new Point(0, 2),
        new Point(1, 3),
        new Point(0, 4),
        new Point(2, 4),
        new Point(3, 5),
        new Point(4, 4),
        new Point(3, 3),
        new Point(4, 2),
        new Point(4, 0)
    ]);

    let q = p.fulfill();
    console.log("p", p.toString());
    console.log("q", q.toString());

    let line1 = q.part(15, 3);
    let line2 = q.part(3, 7);
    let line3 = q.part(7, 11);
    let line4 = q.part(11, 15);
    let line5 = q.part(13, 1);

    console.log("line1", PolyLineUtils.toString(line1));
    console.log("line2", PolyLineUtils.toString(line2));
    console.log("line2revert", PolyLineUtils.toString(line2.revert()));
    console.log("line3", PolyLineUtils.toString(line3));
    console.log("line4", PolyLineUtils.toString(line4));
    console.log("line5", PolyLineUtils.toString(line5));

    console.log(PolyLineUtils.isG(line1, line2), line1, line2);
    console.log(PolyLineUtils.isC4(line2.revert(), line3));
    console.log(PolyLineUtils.isC4(line3, line2.revert()));
    console.log("---------- test C ---------");
    console.log(PolyLineUtils.isC(line4));
    console.log(PolyLineUtils.isC(line5));
    console.log(PolyLineUtils.isC(line4.revert()));
    console.log(PolyLineUtils.isC(line5.revert()));
    console.log(PolyLineUtils.isC(line1));
    console.log(PolyLineUtils.isC(line2));
    console.log(PolyLineUtils.isC(line3));
}

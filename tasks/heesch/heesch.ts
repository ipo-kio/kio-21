import './heat.scss'; //TODO заменить имя файла со стилями
import {KioApi, KioResourceDescription, KioTaskSettings} from "../KioApi";
import Stage = createjs.Stage;

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
        domNode.classList.add('heat-task-container');
    }

    static preloadManifest(): KioResourceDescription[] {
        return [
            // {id: "", src: "heesch-resources/air.jpg"},
        ]; //TODO перечислить загружаемые ресурсы. Они находятся в каталоге heat-resources
    }

    parameters() {
        return [

        ];
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

import './taskid.scss'; //TODO заменить имя файла со стилями

export class Task { //TODO название класса должно совпадать с id задачи, но с заглавной буквы

    /**
     *
     * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
     * которое может быть 0, 1 или 2.
     */
    constructor(settings) {
        this.settings = settings;

        //TODO здесь можно совершить инициализацию, которая не зависит от положения в DOM и kioapi
    }

    /**
     * Идентификатор задачи, используется сейчас только как ключ для
     * хранения данных в localstorage
     * @returns {string} идентификатор задачи
     */
    id() {
        return 'taskid' + this.settings.level; //TODO заменить task-id на реальный id задачи
    }

    /**
     *
     * @param domNode
     * @param kioapi
     * @param preferred_width
     */
    initialize(domNode, kioapi, preferred_width) {
        this.kioapi = kioapi;

        //TODO реализовать инициализацию
    }

    static preloadManifest() {
        return [
            // {id: "pic1", src: "taskid-resources/pic1.png"},
            // {id: "pic2", src: "taskid-resources/pic2.png"}
        ]; //TODO перечислить загружаемые ресурсы. Они находятся в каталоге taskid-resources
    }

    parameters() {
        return [
            //TODO добавить список параметров
        ];
    }

    solution() {
        //TODO вернуть объект с описанием решения участника
    }

    loadSolution(solution) {
        // Все объекты, которые сюда передаются, были ранее возвращены методом solution,
        // но проверять их все равно необходимо.
        //TODO загрузить объект с решением участника.
    }
}
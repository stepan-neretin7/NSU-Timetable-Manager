import {subjectType, subjectTypeNames, weekType} from "../model/subject";
import {IS_EMPTY_FLAG} from "../model/consts";

export class CustomRenderHandlersManager {
    static #renderMap = (element, subjectData) => {
        if (subjectData[IS_EMPTY_FLAG]) {
            return
        }

        const location = subjectData["location"]

        if (location[IS_EMPTY_FLAG]) {
            const parent = element.parentNode
            element.remove()
            parent.innerText += subjectData["name"]
            //console.log(element, element.innerText, subjectData, location)
            return
        }

        element.innerText = subjectData["name"]
        const room_view = `room_view('${location.block}', ${location.level}, ${location.x}, ${location.y})`;
        element.setAttribute("onclick", room_view);

    };

    static #renderType = (element, key) => {
        const n = key.toString()
        if (!subjectType.has(n)) {
            return
        }

        const typeClass = subjectType.get(n)
        if (typeClass === subjectType.get("0")) {
            element.remove()
        }
        element.classList.remove(element.classList[1]);
        element.classList.add(typeClass);
        element.innerText = subjectTypeNames.get(n)
    };

    static #renderWeek = (element, subjectData) => {
        const key = subjectData.toString();
        if (weekType.has(key)) {
            element.innerText = weekType.get(key);
        }
    };

    static registerHandlers = () => {
        window.renderMap = this.#renderMap;
        window.renderType = this.#renderType;
        window.renderWeek = this.#renderWeek;
    };
}
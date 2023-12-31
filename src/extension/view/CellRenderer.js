import {DotNotationHelper} from "../model/DotNotationHelper";
import {insertCells, subjectSelectors, weekType} from "../model/subject";
import {FunctionParser} from "../model/FunctionParser";
import {CustomRenderHandlersManager} from "./customRenderHandlers";
import {RENDER_DATA_EVENT, SUBJECT_KEY} from "../model/consts";

export class CellRenderer {
    static #tds = document.querySelectorAll(
        '.time-table tr:not(:first-child) td:not(:first-child)'
    );

    constructor(m, eventEmitter) {
        this.m = m;
        this.eventEmitter = eventEmitter;

        CellRenderer.#tds.forEach((td) => {
            td.addEventListener("click", (e) => {
                if (e.target === td) {
                    this.m.handleEdit(e, null);
                }
            });
        });

        eventEmitter.on(RENDER_DATA_EVENT, this.renderData.bind(this));
    }

    static #renderWeek(el, subjectData) {
        const weekElement = el.querySelector(".week");
        if (weekElement) {
            weekElement.remove();
        }

        const weekNum = subjectData["periodicity"];
        if (weekNum === 2) {
            return;
        }
        const week = document.createElement("div");
        week.classList.add("week");
        week.innerText = weekType.get(weekNum.toString());
        el.appendChild(week);
    }

    renderCell = (cell, cellIndex, index, apiData) => {
        const subjectData = apiData[cellIndex][SUBJECT_KEY][index];
        this.renderSubject(cell, subjectData);
    };

    renderSubject = (el, subjectData) => {
        CustomRenderHandlersManager.registerHandlers();
        if (!subjectData) {
            el.innerHTML = "";
            return;
        }
        subjectSelectors.forEach(({selector, property, dataKey}) => {
            const element = el.querySelector(selector);
            const funcName = FunctionParser.parseFunctionName(property);
            if (element) {
                const value = DotNotationHelper.getValueByDotNotation(subjectData, dataKey);
                if (value !== null) {
                    if (funcName !== "") {
                        window[funcName](element, value);
                        return;
                    }
                    element[property] = value;
                }
                if (dataKey === "tutor.href" && (value === null || value === "#")) {
                    const tutorValueWithoutHref = DotNotationHelper.getValueByDotNotation(subjectData, "tutor.name")
                    const parent = element.parentNode
                    if (tutorValueWithoutHref) {
                        //debugger;
                        element.remove()
                        const t = parent.innerHTML
                        parent.innerHTML = t + "<br>" + tutorValueWithoutHref
                        parent.addEventListener("click", (e) => this.m.handleEdit(e));
                    }
                }
            }
        });
        CellRenderer.#renderWeek(el, subjectData);
        //this.renderDeleteButton(el)
    };

    renderData = (apiData) => {
        CellRenderer.#tds.forEach((td, dataID) => {
            td.setAttribute('data-id', dataID.toString());
            const cellsCount = apiData[dataID]["subjects"].length;
            td.querySelectorAll(".cell").forEach((cell) => cell.remove());
            insertCells(td, cellsCount);
            td.querySelectorAll(".subject").forEach((el) => {
                el.addEventListener("click", (e) => this.m.handleEdit(e));
            });
            const cells = td.querySelectorAll('.cell');
            cells.forEach((cell, index) => {
                this.renderCell(cell, dataID, index, apiData);
            });
        });
    };
}

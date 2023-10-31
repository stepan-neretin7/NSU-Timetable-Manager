import {ObjectHelper} from "./ObjectHelper";

export const subjectSelectors = [
    {selector: ".subject", property: "textContent", dataKey: "name.shortName", placeholder: "Имя предмета"},
    {selector: ".room a", property: "textContent", dataKey: "room.name", placeholder: "Имя комнаты"},
    {selector: ".room a", property: "renderMap()", dataKey: "room.location"},
    {selector: ".type", property: "textContent", dataKey: "type.shortName", placeholder: "Тип предмета"},
    {selector: ".type", property: "renderType()", dataKey: "type", placeholder: "Тип предмета"},
    {selector: ".tutor", property: "textContent", dataKey: "tutor.name", placeholder: "Имя препода"},
    {selector: ".tutor", property: "href", dataKey: "tutor.href"},
];

export const subjectType = new Map(Object.entries({
    "лаб": "lab",
    "пр": "pr",
    "лек": "lek",
    "ф, пр": "f_2"
}))


const renderMap = (element, subjectData) => {
    if(subjectData["isEmpty"]){
        return
    }
    const room_view = `room_view('${subjectData.block}', ${subjectData.level}, ${subjectData.x}, ${subjectData.y})`;
    element.setAttribute("onclick", room_view);
}

const renderType = (element, subjectData) => {
    if(subjectData["isEmpty"]){
        return
    }

    const shortName = subjectData["shortName"]
    if(subjectType.has(shortName)){
        element.classList.remove(element.classList[1])
        element.classList.add(subjectType.get(shortName))
    }

}

const registerHandlers = () => {
    window.renderMap = renderMap
    window.renderType = renderType
}

const parseFunctionName = (s) => {
    const regex = /(\w+)\(/;
    const matches = regex.exec(s);

    if (matches && matches.length > 1) {
        return matches[1];
    }

    return "";
}

export const renderData = (apiData) => {
    const tds = document.querySelectorAll(
        '.time-table tr:not(:first-child) td:not(:first-child)'
    )

    const renderSubject = (el, subjectData) => {
        registerHandlers()
        subjectSelectors.forEach(({selector, property, dataKey}) => {
            const element = el.querySelector(selector);
            const funcName = parseFunctionName(property)


            if (element) {
                const value = ObjectHelper.getValueByDotNotation(subjectData, dataKey);
                if (value !== null) {
                    if(funcName !== ""){
                        window[funcName](element, value)
                        return
                    }
                    element[property] = value;
                }
            }
        });
    };

    const renderCell = (cell, cellIndex) => {
        const subjectsDataInCell = apiData[cellIndex]['subjects']
        subjectsDataInCell.forEach((subjectData) => {
            renderSubject(cell, subjectData)
        })
    };

    tds.forEach((td, dataID) => {
        td.setAttribute('data-id', dataID.toString());
        const cells = td.querySelectorAll('.cell');
        cells.forEach((cell) => {
            renderCell(cell, dataID)
        })
    })
}
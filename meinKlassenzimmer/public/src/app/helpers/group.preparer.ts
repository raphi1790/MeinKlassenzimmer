import { Schueler } from "../models/schueler";
import { Randomizer } from "./randomizer";


export class GroupPreparer {



    constructor() {


    }

    prepareGruppenEinteilung(inputSchueler: Schueler[], inputGroupType: string, inputGroupSize: number): any {
        if (inputSchueler.length == 0) {
            console.log("Abbruch, da keine Schueler übergeben wurden.")
        }
        else {
            var randomizer = new Randomizer();
            var randomizedSchueler = randomizer.shuffle(inputSchueler);
            var gruppenEinteilung = [];
            if (inputGroupType == 'Gruppengrösse') {

                gruppenEinteilung = this.prepareGruppenEinteilungSizes(randomizedSchueler, inputGroupSize);

            } else {
                gruppenEinteilung = this.prepareGruppenEinteilungNumbers(randomizedSchueler, inputGroupSize);

            }
            console.log("Gruppeneinteilung as plain object");
            console.log(gruppenEinteilung);



        }
        return gruppenEinteilung;
    }
    prepareGruppenEinteilungSizes(randomizedSchueler: Schueler[], inputGroupSize: number): any {
        var numberOfGroups = Math.ceil(randomizedSchueler.length / inputGroupSize);
        console.log("Anzahl Gruppen: " + numberOfGroups);
        var gruppenEinteilung = [];

        switch (inputGroupSize) {
            case 2:
                for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
                    debugger;
                    var schueler2;
                    if (randomizedSchueler[groupIndex * inputGroupSize + 1] == undefined) {
                        schueler2 = null;
                    }
                    else {
                        schueler2 = randomizedSchueler[groupIndex * inputGroupSize + 1].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 1].nameKurz
                    }

                    gruppenEinteilung.push({
                        gruppe: groupIndex + 1,
                        schueler1: randomizedSchueler[groupIndex * inputGroupSize].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize].nameKurz,
                        schueler2: schueler2,
                    })
                }

                break;
            case 3:
                for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
                    debugger;
                    var schueler2;
                    var schueler3;
                    if (randomizedSchueler[groupIndex * inputGroupSize + 1] == undefined) {
                        schueler2 = null;

                    }
                    else {
                        schueler2 = randomizedSchueler[groupIndex * inputGroupSize + 1].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 1].nameKurz
                    }
                    if (randomizedSchueler[groupIndex * inputGroupSize + 2] == undefined) {
                        schueler3 = null;

                    }
                    else {
                        schueler3 = randomizedSchueler[groupIndex * inputGroupSize + 2].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 2].nameKurz
                    }

                    gruppenEinteilung.push({
                        gruppe: groupIndex + 1,
                        schueler1: randomizedSchueler[groupIndex * inputGroupSize].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize].nameKurz,
                        schueler2: schueler2,
                        schueler3: schueler3


                    })


                }

                break;
            case 4:
                for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
                    debugger;
                    var schueler2;
                    var schueler3;
                    var schueler4;
                    var schueler5;
                    if (randomizedSchueler[groupIndex * inputGroupSize + 1] == undefined) {
                        schueler2 = null;

                    }
                    else {
                        schueler2 = randomizedSchueler[groupIndex * inputGroupSize + 1].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 1].nameKurz
                    }
                    if (randomizedSchueler[groupIndex * inputGroupSize + 2] == undefined) {
                        schueler3 = null;

                    }
                    else {
                        schueler3 = randomizedSchueler[groupIndex * inputGroupSize + 2].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 2].nameKurz
                    }
                    if (randomizedSchueler[groupIndex * inputGroupSize + 3] == undefined) {
                        schueler4 = null;

                    }
                    else {
                        schueler4 = randomizedSchueler[groupIndex * inputGroupSize + 3].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 3].nameKurz
                    }
                    gruppenEinteilung.push({
                        gruppe: groupIndex + 1,
                        schueler1: randomizedSchueler[groupIndex * inputGroupSize].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize].nameKurz,
                        schueler2: schueler2,
                        schueler3: schueler3,
                        schueler4: schueler4,

                    })


                }

                break;
            case 5:
                for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
                    debugger;
                    var schueler2;
                    var schueler3;
                    var schueler4;
                    var schueler5;
                    if (randomizedSchueler[groupIndex * inputGroupSize + 1] == undefined) {
                        schueler2 = null;

                    }
                    else {
                        schueler2 = randomizedSchueler[groupIndex * inputGroupSize + 1].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 1].nameKurz
                    }
                    if (randomizedSchueler[groupIndex * inputGroupSize + 2] == undefined) {
                        schueler3 = null;

                    }
                    else {
                        schueler3 = randomizedSchueler[groupIndex * inputGroupSize + 2].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 2].nameKurz
                    }
                    if (randomizedSchueler[groupIndex * inputGroupSize + 3] == undefined) {
                        schueler4 = null;

                    }
                    else {
                        schueler4 = randomizedSchueler[groupIndex * inputGroupSize + 3].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 3].nameKurz
                    }
                    if (randomizedSchueler[groupIndex * inputGroupSize + 4] == undefined) {
                        schueler5 = null;

                    }
                    else {
                        schueler5 = randomizedSchueler[groupIndex * inputGroupSize + 4].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 4].nameKurz
                    }

                    gruppenEinteilung.push({
                        gruppe: groupIndex + 1,
                        schueler1: randomizedSchueler[groupIndex * inputGroupSize].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize].nameKurz,
                        schueler2: schueler2,
                        schueler3: schueler3,
                        schueler4: schueler4,
                        schueler5: schueler5

                    })

                }

                break;
            case 6:
                for (let groupIndex = 0; groupIndex < numberOfGroups; groupIndex++) {
                    debugger;
                    var schueler2;
                    var schueler3;
                    var schueler4;
                    var schueler5;
                    var schueler6;
                    if (randomizedSchueler[groupIndex * inputGroupSize + 1] == undefined) {
                        schueler2 = null;

                    }
                    else {
                        schueler2 = randomizedSchueler[groupIndex * inputGroupSize + 1].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 1].nameKurz
                    }
                    if (randomizedSchueler[groupIndex * inputGroupSize + 2] == undefined) {
                        schueler3 = null;

                    }
                    else {
                        schueler3 = randomizedSchueler[groupIndex * inputGroupSize + 2].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 2].nameKurz
                    }
                    if (randomizedSchueler[groupIndex * inputGroupSize + 3] == undefined) {
                        schueler4 = null;

                    }
                    else {
                        schueler4 = randomizedSchueler[groupIndex * inputGroupSize + 3].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 3].nameKurz
                    }
                    if (randomizedSchueler[groupIndex * inputGroupSize + 4] == undefined) {
                        schueler5 = null;

                    }
                    else {
                        schueler5 = randomizedSchueler[groupIndex * inputGroupSize + 4].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 4].nameKurz
                    }
                    if (randomizedSchueler[groupIndex * inputGroupSize + 5] == undefined) {
                        schueler6 = null;

                    }
                    else {
                        schueler6 = randomizedSchueler[groupIndex * inputGroupSize + 5].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize + 5].nameKurz
                    }

                    gruppenEinteilung.push({
                        gruppe: groupIndex + 1,
                        schueler1: randomizedSchueler[groupIndex * inputGroupSize].vorname + " " + randomizedSchueler[groupIndex * inputGroupSize].nameKurz,
                        schueler2: schueler2,
                        schueler3: schueler3,
                        schueler4: schueler4,
                        schueler5: schueler5,
                        schueler6: schueler6

                    })

                }

                break;

            default:
                break;
        }
        return gruppenEinteilung;

    }
    prepareGruppenEinteilungNumbers(randomizedSchueler: Schueler[], inputSize: number): any {
        var numberOfSchueler = Math.ceil(randomizedSchueler.length / inputSize);
        console.log("Anzahl Schueler in Gruppen: " + numberOfSchueler);
        var gruppenEinteilung = [];

        switch (inputSize) {
            case 2:
                for (let schuelerIndex = 0; schuelerIndex < numberOfSchueler; schuelerIndex++) {
                    debugger;
                    var gruppe2;
                    if (randomizedSchueler[schuelerIndex * inputSize + 1] == undefined) {
                        gruppe2 = null;
                    }
                    else {
                        gruppe2 = randomizedSchueler[schuelerIndex * inputSize + 1].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 1].nameKurz
                    }

                    gruppenEinteilung.push({
                        schueler: schuelerIndex + 1,
                        gruppe1: randomizedSchueler[schuelerIndex * inputSize].vorname + " " + randomizedSchueler[schuelerIndex * inputSize].nameKurz,
                        gruppe2: gruppe2,
                    })
                }

                break;
                case 3:
                for (let schuelerIndex = 0; schuelerIndex < numberOfSchueler; schuelerIndex++) {
                    debugger;
                    var gruppe2;
                    var gruppe3;
                    if (randomizedSchueler[schuelerIndex * inputSize + 1] == undefined) {
                        gruppe2 = null;

                    }
                    else {
                        gruppe2 = randomizedSchueler[schuelerIndex * inputSize + 1].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 1].nameKurz
                    }
                    if (randomizedSchueler[schuelerIndex * inputSize + 2] == undefined) {
                        gruppe3 = null;

                    }
                    else {
                        gruppe3 = randomizedSchueler[schuelerIndex * inputSize + 2].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 2].nameKurz
                    }

                    gruppenEinteilung.push({
                        schueler: schuelerIndex + 1,
                        gruppe1: randomizedSchueler[schuelerIndex * inputSize].vorname + " " + randomizedSchueler[schuelerIndex * inputSize].nameKurz,
                        gruppe2: gruppe2,
                        gruppe3: gruppe3


                    })


                }

                break;
            case 4:
                for (let schuelerIndex = 0; schuelerIndex < numberOfSchueler; schuelerIndex++) {
                    debugger;
                    var gruppe2;
                    var gruppe3;
                    var gruppe4;
                    var gruppe5;
                    if (randomizedSchueler[schuelerIndex * inputSize + 1] == undefined) {
                        gruppe2 = null;

                    }
                    else {
                        gruppe2 = randomizedSchueler[schuelerIndex * inputSize + 1].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 1].nameKurz
                    }
                    if (randomizedSchueler[schuelerIndex * inputSize + 2] == undefined) {
                        gruppe3 = null;

                    }
                    else {
                        gruppe3 = randomizedSchueler[schuelerIndex * inputSize + 2].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 2].nameKurz
                    }
                    if (randomizedSchueler[schuelerIndex * inputSize + 3] == undefined) {
                        gruppe4 = null;

                    }
                    else {
                        gruppe4 = randomizedSchueler[schuelerIndex * inputSize + 3].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 3].nameKurz
                    }
                    gruppenEinteilung.push({
                        schueler: schuelerIndex + 1,
                        gruppe1: randomizedSchueler[schuelerIndex * inputSize].vorname + " " + randomizedSchueler[schuelerIndex * inputSize].nameKurz,
                        gruppe2: gruppe2,
                        gruppe3: gruppe3,
                        gruppe4: gruppe4

                    })


                }

                break;
            case 5:
                for (let schuelerIndex = 0; schuelerIndex < numberOfSchueler; schuelerIndex++) {
                    debugger;
                    var gruppe2;
                    var gruppe3;
                    var gruppe4;
                    var gruppe5;
                    if (randomizedSchueler[schuelerIndex * inputSize + 1] == undefined) {
                        gruppe2 = null;

                    }
                    else {
                        gruppe2 = randomizedSchueler[schuelerIndex * inputSize + 1].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 1].nameKurz
                    }
                    if (randomizedSchueler[schuelerIndex * inputSize + 2] == undefined) {
                        gruppe3 = null;

                    }
                    else {
                        gruppe3 = randomizedSchueler[schuelerIndex * inputSize + 2].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 2].nameKurz
                    }
                    if (randomizedSchueler[schuelerIndex * inputSize + 3] == undefined) {
                        gruppe4 = null;

                    }
                    else {
                        gruppe4 = randomizedSchueler[schuelerIndex * inputSize + 3].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 3].nameKurz
                    }
                    if (randomizedSchueler[schuelerIndex * inputSize + 4] == undefined) {
                        gruppe5 = null;

                    }
                    else {
                        gruppe5 = randomizedSchueler[schuelerIndex * inputSize + 4].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 4].nameKurz
                    }

                    gruppenEinteilung.push({
                        schueler: schuelerIndex + 1,
                        gruppe1: randomizedSchueler[schuelerIndex * inputSize].vorname + " " + randomizedSchueler[schuelerIndex * inputSize].nameKurz,
                        gruppe2: gruppe2,
                        gruppe3: gruppe3,
                        gruppe4: gruppe4,
                        gruppe5: gruppe5,


                    })

                }

                break;
            case 6:
                for (let schuelerIndex = 0; schuelerIndex < numberOfSchueler; schuelerIndex++) {
                    debugger;
                    var gruppe2;
                    var gruppe3;
                    var gruppe4;
                    var gruppe5;
                    var gruppe6;
                    if (randomizedSchueler[schuelerIndex * inputSize + 1] == undefined) {
                        gruppe2 = null;

                    }
                    else {
                        gruppe2 = randomizedSchueler[schuelerIndex * inputSize + 1].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 1].nameKurz
                    }
                    if (randomizedSchueler[schuelerIndex * inputSize + 2] == undefined) {
                        gruppe3 = null;

                    }
                    else {
                        gruppe3 = randomizedSchueler[schuelerIndex * inputSize + 2].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 2].nameKurz
                    }
                    if (randomizedSchueler[schuelerIndex * inputSize + 3] == undefined) {
                        gruppe4 = null;

                    }
                    else {
                        gruppe4 = randomizedSchueler[schuelerIndex * inputSize + 3].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 3].nameKurz
                    }
                    if (randomizedSchueler[schuelerIndex * inputSize + 4] == undefined) {
                        gruppe5 = null;

                    }
                    else {
                        gruppe5 = randomizedSchueler[schuelerIndex * inputSize + 4].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 4].nameKurz
                    }
                    if (randomizedSchueler[schuelerIndex * inputSize + 5] == undefined) {
                        gruppe6 = null;

                    }
                    else {
                        gruppe6 = randomizedSchueler[schuelerIndex * inputSize + 5].vorname + " " + randomizedSchueler[schuelerIndex * inputSize + 5].nameKurz
                    }

                    gruppenEinteilung.push({
                        schueler: schuelerIndex + 1,
                        gruppe1: randomizedSchueler[schuelerIndex * inputSize].vorname + " " + randomizedSchueler[schuelerIndex * inputSize].nameKurz,
                        gruppe2: gruppe2,
                        gruppe3: gruppe3,
                        gruppe4: gruppe4,
                        gruppe5: gruppe5,
                        gruppe6: gruppe6

                    })

                }

                break;

            default:
                break;
        }
        return gruppenEinteilung;
    }









}
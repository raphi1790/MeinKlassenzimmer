import { Schueler } from "../models/schueler";

export class Randomizer {

    randomizeSchueler(inputSchueler: Schueler[], tischLength: number):Schueler[]{
        var extendedSchueler = new Array<Schueler>(tischLength);
        var randomizeSchueler = new Array<Schueler>(tischLength)
        for (let index = 0; index < inputSchueler.length; index++) {
            extendedSchueler[index] = inputSchueler[index];
            
        }
        randomizeSchueler = this.shuffle(extendedSchueler);
        return randomizeSchueler;
        
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }


}
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



    shuffle(array) {
        // shuffle without fixpoint; sattolo's algorithm
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * i); // no +1 here!
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    

}
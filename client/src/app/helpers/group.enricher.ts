import { Gruppeneinteilung } from "../models/gruppeneinteilung";

export class GroupEnricher{


    enrichGroupBasedOnType(inputEinteilung: Gruppeneinteilung, inputType: string, inputSize: number):any{
        var displayedGruppenEinteilung = [];
        let numberOfGroups = inputEinteilung.gruppen.length;

        switch (inputType) {
            
            case "Gruppenanzahl":
                let numberSchuelerPerGroup =  inputEinteilung.gruppen[0].schueler.length;
                for (let schuelerIndex = 1; schuelerIndex <= numberSchuelerPerGroup; schuelerIndex++) {
                    debugger;
                    var groupObject = {}    
                    let schuelerIndexName = "schueler";
                    groupObject[schuelerIndexName] = schuelerIndex;
                    for (let groupIndex = 1; groupIndex <= numberOfGroups; groupIndex++) {
                                            
                        let groupIndexName = "gruppe"+ groupIndex.toString();
                        let displayedSchuelerName : string;
                        if (inputEinteilung.gruppen[groupIndex-1].schueler[schuelerIndex-1] == undefined) {
                            displayedSchuelerName = " ";
                        }
                        else{
                            if (inputEinteilung.gruppen[groupIndex-1].schueler[schuelerIndex-1].nameKurz == null){
                                inputEinteilung.gruppen[groupIndex-1].schueler[schuelerIndex-1].nameKurz = " ";
                            }
                            displayedSchuelerName = inputEinteilung.gruppen[groupIndex-1].schueler[schuelerIndex-1].vorname + " " + inputEinteilung.gruppen[groupIndex-1].schueler[schuelerIndex-1].nameKurz;
                        }
                        groupObject[groupIndexName] = displayedSchuelerName;
                        
                        
                    }
                    displayedGruppenEinteilung.push(groupObject);

                
                }
               
    
                break;

            case "Gruppengrösse":
                for (let groupIndex = 1; groupIndex <= numberOfGroups; groupIndex++) {
                    debugger;
                    var groupObject = {}
                    let gruppe = inputEinteilung.gruppen[groupIndex-1];              
                    let groupIndexName = "gruppe";
                    let schueler = gruppe.schueler;
                    groupObject[groupIndexName] = groupIndex;
                    for (let schuelerIndex = 1; schuelerIndex <= inputSize; schuelerIndex++) {
                                            
                        let schuelerIndexName = "schueler"+ schuelerIndex.toString();
                        let displayedSchuelerName : string;
                        if (schueler[schuelerIndex - 1] == undefined) {
                             displayedSchuelerName = " ";
                        }
                        else{
                            if (schueler[schuelerIndex - 1].nameKurz == null){
                                schueler[schuelerIndex - 1].nameKurz = " ";
                            }
                             displayedSchuelerName = schueler[schuelerIndex - 1].vorname + " " + schueler[schuelerIndex - 1].nameKurz;
                        }
                        groupObject[schuelerIndexName] = displayedSchuelerName;
                        
                        
                    }
                    displayedGruppenEinteilung.push(groupObject);

                
                }
                
                break;
            default:
                break;
                
        }
        return displayedGruppenEinteilung;

    }

}
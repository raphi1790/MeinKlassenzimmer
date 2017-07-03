import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
     const klassen = [
    { id: 11, personid: 1, name: '3A' },
    { id: 12, personid: 1,name: '2B' },
    { id: 13, personid: 1,name: '1C' },
    { id: 14, personid: 2, name: '3D'  }
  ];
  const schueler = [
    {id: 1, klassenid : 11 ,name : 'meier', vorname : 'hans' },
    {id: 2, klassenid : 11 ,name : 'müller', vorname : 'peter' },
    {id: 3, klassenid : 12 ,name : 'hug', vorname : 'heidi' },
    {id: 4, klassenid : 14 ,name : 'frei', vorname : 'fridolin' }
    ];
    
  
  return {klassen, schueler};
}
}

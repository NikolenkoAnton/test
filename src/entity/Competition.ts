export interface Competition {
  Id: number;
  Name: string;
  Type: number;
  SubCompetitions: Competition[];
  Events: Event[];
}

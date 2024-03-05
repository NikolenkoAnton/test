export const getWidgetAliasFromEvent = (event: any) => {
  const sportName = event.tournament.sport.name;
  const categoryName = event.tournament.category.name;
  const competitionName = event.tournament.name;
  const eventFirstTeam = event.competitors.home.name;
  const eventSecondTeam = event.competitors.away.name;

  return `${sportName} / ${categoryName} / ${competitionName} / ${eventFirstTeam} - ${eventSecondTeam}`;
};

export const getWidgetAliasFromCompetition = (competition: any) => {
  const sportName = competition.sport.name;
  const categoryName = competition.category.name;
  const competitionName = competition.name;

  return `${sportName} / ${categoryName} / ${competitionName}`;
};

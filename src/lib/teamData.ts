
export interface TeamInfo {
  team_id: number;
  name: string;
}

export const EPL_TEAMS: TeamInfo[] = [
  { team_id: 1, name: "Arsenal" },
  { team_id: 2, name: "Aston Villa" },
  { team_id: 3, name: "Bournemouth" },
  { team_id: 4, name: "Brentford" },
  { team_id: 5, name: "Brighton" },
  { team_id: 6, name: "Burnley" },
  { team_id: 7, name: "Chelsea" },
  { team_id: 8, name: "Crystal Palace" },
  { team_id: 9, name: "Everton" },
  { team_id: 10, name: "Fulham" },
  { team_id: 11, name: "Liverpool" },
  { team_id: 12, name: "Luton" },
  { team_id: 13, name: "Man City" },
  { team_id: 14, name: "Man Utd" },
  { team_id: 15, name: "Newcastle" },
  { team_id: 16, name: "Nott'm Forest" },
  { team_id: 17, name: "Sheffield Utd" },
  { team_id: 18, name: "Spurs" },
  { team_id: 19, name: "West Ham" },
  { team_id: 20, name: "Wolves" }
];

export const getTeamById = (teamName: string): TeamInfo | undefined => {
  return EPL_TEAMS.find(team => team.name === teamName || team.name.includes(teamName) || teamName.includes(team.name));
};

export const getTeamLogoUrl = (teamName: string): string => {
  const team = getTeamById(teamName);
  if (team) {
    return `https://resources.premierleague.com/premierleague/badges/t${team.team_id}.png`;
  }
  return '';
};


export interface TeamInfo {
  team_id: number;
  name: string;
}

export const EPL_TEAMS: TeamInfo[] = [
  { team_id: 3, name: "Arsenal" },
  { team_id: 7, name: "Aston Villa" },
  { team_id: 91, name: "Bournemouth" },
  { team_id: 94, name: "Brentford" },
  { team_id: 36, name: "Brighton" },
  { team_id: 8, name: "Chelsea" },
  { team_id: 31, name: "Crystal Palace" },
  { team_id: 11, name: "Everton" },
  { team_id: 54, name: "Fulham" },
  { team_id: 40, name: "Ipswich" },
  { team_id: 13, name: "Leicester" },
  { team_id: 14, name: "Liverpool" },
  { team_id: 43, name: "Man City" },
  { team_id: 1, name: "Man Utd" },
  { team_id: 4, name: "Newcastle" },
  { team_id: 17, name: "Nott'm Forest" },
  { team_id: 20, name: "Southampton" },
  { team_id: 6, name: "Spurs" },
  { team_id: 21, name: "West Ham" },
  { team_id: 39, name: "Wolves" }
];

export const getTeamById = (teamName: string): TeamInfo | undefined => {
  // First try exact match
  let team = EPL_TEAMS.find(team => team.name === teamName);
  
  // If no exact match, try case-insensitive match
  if (!team) {
    team = EPL_TEAMS.find(team => 
      team.name.toLowerCase() === teamName.toLowerCase()
    );
  }
  
  // If still no match, try includes
  if (!team) {
    team = EPL_TEAMS.find(team => 
      team.name.toLowerCase().includes(teamName.toLowerCase()) || 
      teamName.toLowerCase().includes(team.name.toLowerCase())
    );
  }
  
  return team;
};

export const getTeamLogoUrl = (teamName: string): string => {
  const team = getTeamById(teamName);
  if (team) {
    // Use team_id to construct the Premier League badge URL
    return `https://resources.premierleague.com/premierleague/badges/t${team.team_id}.png`;
  }
  return '';
};

export const clanMembers = [
  {
    id: 1,
    name: "Takeshi Yamamoto",
    rank: "Kyodai",
    rankJP: "兄弟",
    loyalty: 95,
    strength: 88,
    intelligence: 72,
    speciality: "Combate Corpo-a-Corpo",
    status: "active",
    avatar: "🐲"
  },
  {
    id: 2,
    name: "Kenji Sato",
    rank: "Wakashu",
    rankJP: "若衆",
    loyalty: 78,
    strength: 65,
    intelligence: 85,
    speciality: "Negociação",
    status: "active",
    avatar: "🐯"
  },
  {
    id: 3,
    name: "Hiroshi Tanaka",
    rank: "Shatei",
    rankJP: "舎弟",
    loyalty: 88,
    strength: 92,
    intelligence: 68,
    speciality: "Segurança",
    status: "mission",
    avatar: "⚔️"
  },
  {
    id: 4,
    name: "Yuki Nakamura",
    rank: "Wakashu",
    rankJP: "若衆",
    loyalty: 82,
    strength: 70,
    intelligence: 90,
    speciality: "Inteligência",
    status: "active",
    avatar: "🦅"
  },
  {
    id: 5,
    name: "Daiki Kobayashi",
    rank: "Shatei",
    rankJP: "舎弟",
    loyalty: 91,
    strength: 85,
    intelligence: 75,
    speciality: "Execução",
    status: "active",
    avatar: "🐍"
  }
];

export const clanTerritories = [
  {
    id: 1,
    name: "Shibuya",
    control: 85,
    income: 25000,
    threat: "low",
    members: 12
  },
  {
    id: 2,
    name: "Shinjuku",
    control: 60,
    income: 18000,
    threat: "medium",
    members: 8
  },
  {
    id: 3,
    name: "Roppongi",
    control: 45,
    income: 22000,
    threat: "high",
    members: 6
  },
  {
    id: 4,
    name: "Akihabara",
    control: 92,
    income: 15000,
    threat: "low",
    members: 10
  }
];

export const clanMissions = [
  {
    id: 1,
    title: "Coletar Tributo",
    location: "Shibuya",
    difficulty: "easy",
    reward: 8000,
    duration: "2h",
    required: 2
  },
  {
    id: 2,
    title: "Expandir Território",
    location: "Roppongi",
    difficulty: "hard",
    reward: 25000,
    duration: "6h",
    required: 5
  },
  {
    id: 3,
    title: "Interceptar Rivais",
    location: "Shinjuku",
    difficulty: "medium",
    reward: 15000,
    duration: "4h",
    required: 3
  }
];
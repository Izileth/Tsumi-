export const playerStats = {
  name: "Kazuma Kiryu",
  nameJP: "桐生 一馬",
  rank: "Wakashu",
  rankJP: "若衆",
  level: 12,
  experience: 6750,
  nextLevelXP: 10000,
  loyalty: 87,
  reputation: 6500,
  money: 125000,
  clan: "紅龍組",
  clanName: "Beniryu-gumi",
  joinedDate: "Janeiro 2023"
};

export const attributes = [
  { name: "Força", nameJP: "力", value: 78, color: "bg-orange-600" },
  { name: "Inteligência", nameJP: "知", value: 65, color: "bg-blue-600" },
  { name: "Carisma", nameJP: "魅", value: 82, color: "bg-purple-600" },
  { name: "Resistência", nameJP: "耐", value: 71, color: "bg-green-600" },
  { name: "Agilidade", nameJP: "敏", value: 68, color: "bg-yellow-600" },
  { name: "Percepção", nameJP: "感", value: 75, color: "bg-cyan-600" }
];

export const achievements = [
  {
    id: 1,
    title: "Primeira Vitória",
    description: "Venceu seu primeiro combate",
    icon: "⚔️",
    rarity: "common",
    unlocked: true,
    date: "15 Jan 2023"
  },
  {
    id: 2,
    title: "Mestre Coletor",
    description: "Coletou ¥100,000 em tributos",
    icon: "💰",
    rarity: "rare",
    unlocked: true,
    date: "03 Fev 2023"
  },
  {
    id: 3,
    title: "Lenda de Shibuya",
    description: "Domine completamente o distrito de Shibuya",
    icon: "👑",
    rarity: "legendary",
    unlocked: false,
    progress: 85
  },
  {
    id: 4,
    title: "Irmão Leal",
    description: "Alcance 90% de lealdade",
    icon: "🤝",
    rarity: "epic",
    unlocked: false,
    progress: 87
  },
  {
    id: 5,
    title: "Sombra Noturna",
    description: "Complete 50 missões noturnas",
    icon: "🌙",
    rarity: "rare",
    unlocked: true,
    date: "28 Fev 2023"
  },
  {
    id: 6,
    title: "Dragão Imortal",
    description: "Sobreviva a 100 combates sem perder",
    icon: "🐲",
    rarity: "legendary",
    unlocked: false,
    progress: 47
  }
];

export const history = [
  {
    id: 1,
    type: "mission",
    title: "Missão Concluída: Coletar Tributo",
    reward: "+¥8,000 • +150 XP",
    time: "2 horas atrás",
    icon: "✅"
  },
  {
    id: 2,
    type: "purchase",
    title: "Comprou: Wakizashi Clássica",
    reward: "-¥18,000",
    time: "5 horas atrás",
    icon: "🛒"
  },
  {
    id: 3,
    type: "level",
    title: "Subiu para Nível 12!",
    reward: "+2 Pontos de Atributo",
    time: "1 dia atrás",
    icon: "⬆️"
  },
  {
    id: 4,
    type: "territory",
    title: "Território Expandido: Akihabara",
    reward: "+¥15,000/dia",
    time: "2 dias atrás",
    icon: "🗺️"
  },
  {
    id: 5,
    type: "achievement",
    title: "Conquista Desbloqueada: Sombra Noturna",
    reward: "+500 Reputação",
    time: "3 dias atrás",
    icon: "🏆"
  }
];
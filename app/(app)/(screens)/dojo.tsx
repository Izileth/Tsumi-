import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";

export default function DojoScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "Tudo", icon: "全" },
    { id: "combat", label: "Combate", icon: "戦" },
    { id: "stealth", label: "Furtividade", icon: "隠" },
    { id: "social", label: "Social", icon: "交" },
  ];

  const skills = [
    {
      id: 1,
      title: "Técnica do Dragão",
      titleJP: "龍の技",
      category: "combat",
      description: "Domínio avançado de artes marciais. Aumente sua força em combate.",
      currentLevel: 5,
      maxLevel: 10,
      cost: 2500,
      requirements: "Força 70+",
      bonus: "+15% Dano em Combate",
      icon: "🐲",
      difficulty: "hard"
    },
    {
      id: 2,
      title: "Sombra Noturna",
      titleJP: "夜影",
      category: "stealth",
      description: "Movimente-se pelas sombras sem ser detectado.",
      currentLevel: 3,
      maxLevel: 10,
      cost: 1800,
      requirements: "Agilidade 60+",
      bonus: "+20% Chance de Evasão",
      icon: "🌙",
      difficulty: "medium"
    },
    {
      id: 3,
      title: "Lábia de Ouro",
      titleJP: "金舌",
      category: "social",
      description: "Persuasão e intimidação em negociações.",
      currentLevel: 7,
      maxLevel: 10,
      cost: 2000,
      requirements: "Carisma 75+",
      bonus: "+25% em Negociações",
      icon: "💬",
      difficulty: "medium"
    },
    {
      id: 4,
      title: "Punho de Ferro",
      titleJP: "鉄拳",
      category: "combat",
      description: "Socos devastadores que podem quebrar ossos.",
      currentLevel: 2,
      maxLevel: 10,
      cost: 1500,
      requirements: "Força 50+",
      bonus: "+10% Dano Corpo-a-Corpo",
      icon: "👊",
      difficulty: "easy"
    },
    {
      id: 5,
      title: "Olhos de Águia",
      titleJP: "鷲の目",
      category: "stealth",
      description: "Percepção aguçada para detectar ameaças.",
      currentLevel: 4,
      maxLevel: 10,
      cost: 1700,
      requirements: "Percepção 65+",
      bonus: "+15% Detecção de Inimigos",
      icon: "🦅",
      difficulty: "medium"
    },
    {
      id: 6,
      title: "Espírito Inabalável",
      titleJP: "不動心",
      category: "social",
      description: "Resistência mental contra intimidação.",
      currentLevel: 6,
      maxLevel: 10,
      cost: 2200,
      requirements: "Inteligência 70+",
      bonus: "+30% Resistência Mental",
      icon: "🧠",
      difficulty: "hard"
    },
    {
      id: 7,
      title: "Kata do Tigre",
      titleJP: "虎の型",
      category: "combat",
      description: "Sequência de movimentos letais aprendidos com mestres.",
      currentLevel: 8,
      maxLevel: 10,
      cost: 3000,
      requirements: "Força 80+ • Agilidade 70+",
      bonus: "+20% Velocidade de Ataque",
      icon: "🐯",
      difficulty: "hard"
    },
    {
      id: 8,
      title: "Passos Silenciosos",
      titleJP: "静歩",
      category: "stealth",
      description: "Mova-se sem fazer nenhum som.",
      currentLevel: 1,
      maxLevel: 10,
      cost: 1200,
      requirements: "Agilidade 45+",
      bonus: "+10% Furtividade",
      icon: "👣",
      difficulty: "easy"
    },
  ];

  const filteredSkills = selectedCategory === "all" 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "hard": return { bg: "bg-red-950/20 border-red-900/50", text: "text-red-500", badge: "bg-red-950/30" };
      case "medium": return { bg: "bg-yellow-950/20 border-yellow-900/50", text: "text-yellow-500", badge: "bg-yellow-950/30" };
      default: return { bg: "bg-green-950/20 border-green-900/50", text: "text-green-500", badge: "bg-green-950/30" };
    }
  };

  const playerStats = {
    trainingPoints: 12,
    totalSkills: 8,
    mastered: 2
  };

  return (
    <ScrollView className="flex-1 bg-black">
      {/* HEADER */}
      <View className="relative h-56 overflow-hidden bg-gradient-to-b from-red-950 via-red-900 to-black">
        <View className="absolute inset-0 opacity-5">
          <Text className="text-white text-9xl text-center mt-16">道場</Text>
        </View>

        <View className="flex-1 justify-center items-center px-6 pt-14">
          <Text className="text-4xl font-black text-white tracking-wider text-center mb-2">
            修練道場
          </Text>
          <Text className="text-xl font-bold text-red-500 tracking-widest mb-3">
            SHŪREN DŌJŌ
          </Text>
          <View className="h-px w-28 bg-red-600 mb-2" />
          <Text className="text-neutral-400 text-xs tracking-[0.3em] uppercase">
            Training Grounds
          </Text>
        </View>

        <View className="absolute left-0 top-32 w-1 h-20 bg-red-600" />
        <View className="absolute right-0 top-32 w-1 h-20 bg-red-600" />
      </View>

      {/* CONTEÚDO */}
      <View className="px-6 pt-6">
        
        {/* Stats do Treino */}
        <View className="bg-zinc-950 border border-neutral-800 rounded-lg p-5 mb-6">
          <Text className="text-neutral-500 text-xs uppercase tracking-wider mb-3">
            Status de Treinamento
          </Text>
          <View className="flex-row justify-between gap-4">
            <View className="flex-1 items-center">
              <Text className="text-red-500 text-2xl font-bold mb-1">
                {playerStats.trainingPoints}
              </Text>
              <Text className="text-neutral-500 text-xs text-center">
                Pontos de Treino
              </Text>
            </View>
            <View className="w-px bg-neutral-800" />
            <View className="flex-1 items-center">
              <Text className="text-white text-2xl font-bold mb-1">
                {playerStats.totalSkills}
              </Text>
              <Text className="text-neutral-500 text-xs text-center">
                Habilidades
              </Text>
            </View>
            <View className="w-px bg-neutral-800" />
            <View className="flex-1 items-center">
              <Text className="text-yellow-500 text-2xl font-bold mb-1">
                {playerStats.mastered}
              </Text>
              <Text className="text-neutral-500 text-xs text-center">
                Dominadas
              </Text>
            </View>
          </View>
        </View>

        {/* Aviso */}
        <View className="bg-red-950/20 border-l-4 border-red-600 p-4 rounded-r-lg mb-6">
          <Text className="text-red-400 text-xs font-bold mb-1">⚡ MESTRE DO DOJO</Text>
          <Text className="text-neutral-400 text-xs leading-5">
            O caminho do guerreiro exige disciplina. Cada treino fortalece não apenas 
            o corpo, mas também o espírito. Use seus pontos sabiamente.
          </Text>
        </View>

        {/* Filtros de Categoria */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <Text className="text-red-500 text-base font-bold">種類</Text>
            <View className="flex-1 h-px bg-neutral-800 ml-3" />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  className="active:opacity-70"
                >
                  <View className={`px-5 py-3 rounded-lg border ${
                    selectedCategory === cat.id 
                      ? 'bg-red-600 border-red-500' 
                      : 'bg-zinc-950 border-neutral-800'
                  }`}>
                    <Text className={`text-sm font-semibold ${
                      selectedCategory === cat.id ? 'text-white' : 'text-neutral-400'
                    }`}>
                      {cat.icon} {cat.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Lista de Habilidades */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Text className="text-red-500 text-base font-bold">技能</Text>
            <View className="flex-1 h-px bg-neutral-800 ml-3" />
          </View>

          {filteredSkills.map((skill) => {
            const diffStyle = getDifficultyColor(skill.difficulty);
            const progress = (skill.currentLevel / skill.maxLevel) * 100;
            const isMaxed = skill.currentLevel === skill.maxLevel;

            return (
              <View
                key={skill.id}
                className={`mb-4 rounded-lg border p-4 ${diffStyle.bg}`}
              >
                {/* Header da Skill */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-row items-start gap-3 flex-1">
                    <Text className="text-4xl">{skill.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-white text-base font-bold mb-0.5">
                        {skill.title}
                      </Text>
                      <Text className="text-neutral-500 text-xs mb-2">
                        {skill.titleJP}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <View className={`${diffStyle.badge} px-2 py-0.5 rounded`}>
                          <Text className={`text-xs font-semibold ${diffStyle.text}`}>
                            {skill.difficulty === "hard" ? "DIFÍCIL" : 
                             skill.difficulty === "medium" ? "MÉDIO" : "FÁCIL"}
                          </Text>
                        </View>
                        {isMaxed && (
                          <View className="bg-yellow-950/30 px-2 py-0.5 rounded">
                            <Text className="text-yellow-500 text-xs font-semibold">
                              ⭐ DOMINADA
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Descrição */}
                <Text className="text-neutral-400 text-sm leading-5 mb-3">
                  {skill.description}
                </Text>

                {/* Progresso */}
                <View className="mb-3">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-neutral-500 text-xs">
                      Nível {skill.currentLevel} / {skill.maxLevel}
                    </Text>
                    <Text className="text-white text-xs font-semibold">
                      {Math.round(progress)}%
                    </Text>
                  </View>
                  <View className="bg-neutral-900 h-2 rounded-full overflow-hidden">
                    <View 
                      className={`h-full ${
                        isMaxed ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${progress}%` }} 
                    />
                  </View>
                </View>

                {/* Info de Requisitos e Bônus */}
                <View className="bg-black/30 rounded-lg p-3 mb-3">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-neutral-600 text-xs">Requisitos:</Text>
                    <Text className="text-neutral-400 text-xs font-semibold">
                      {skill.requirements}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-neutral-600 text-xs">Bônus:</Text>
                    <Text className="text-green-400 text-xs font-semibold">
                      {skill.bonus}
                    </Text>
                  </View>
                </View>

                {/* Botão de Treinar */}
                <Pressable 
                  className="active:opacity-70"
                  disabled={isMaxed}
                >
                  <View className={`rounded-lg py-3 items-center ${
                    isMaxed 
                      ? 'bg-neutral-900 border border-neutral-800' 
                      : 'bg-red-600'
                  }`}>
                    <Text className={`font-bold text-sm ${
                      isMaxed ? 'text-neutral-600' : 'text-white'
                    }`}>
                      {isMaxed ? 'HABILIDADE DOMINADA' : `TREINAR (¥${skill.cost.toLocaleString()})`}
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* Informação Adicional */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Text className="text-red-500 text-base font-bold">情報</Text>
            <View className="flex-1 h-px bg-neutral-800 ml-3" />
          </View>
          
          <Text className="text-neutral-300 text-sm leading-6 mb-4">
            Ganhe pontos de treino ao subir de nível, completar missões especiais 
            ou vencer desafios no Dojo. Habilidades dominadas concedem bônus permanentes.
          </Text>

          <View className="bg-zinc-950 border border-neutral-800 rounded-lg p-4">
            <Text className="text-neutral-500 text-xs uppercase tracking-wider mb-2">
              Mestre Atual
            </Text>
            <Text className="text-white text-lg font-bold mb-1">
              Sensei Takeda
            </Text>
            <Text className="text-neutral-400 text-xs">
              - O verdadeiro poder vem da disciplina, não da força bruta. -
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center py-8 mb-6">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-12 h-px bg-neutral-800" />
            <Text className="text-neutral-700 text-xl">⚔️</Text>
            <View className="w-12 h-px bg-neutral-800" />
          </View>
          <Text className="text-neutral-700 text-xs tracking-[0.25em]">
            TRAIN TO DOMINATE
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
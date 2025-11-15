import { View, Text, ScrollView } from 'react-native';
import { Clan, GameEvent, Territory } from '@/app/lib/types';
import { FontAwesome } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type DashboardProps = {
  events: GameEvent[];
  clans: Clan[];
  territories: Territory[];
};

const EventIcon = ({ type }: { type: string }) => {
  const iconMap: { [key: string]: any } = {
    TERRITORY_CONQUERED: { name: 'shield', color: '#ef4444' },
    TERRITORY_CLAIMED: { name: 'map-marker', color: '#34d399' },
    TERRITORY_ABANDONED: { name: 'trash-o', color: '#9ca3af' },
    TERRITORY_CREATED: { name: 'plus-circle', color: '#60a5fa' },
    default: { name: 'history', color: '#9ca3af' },
  };
  const { name, color } = iconMap[type] || iconMap.default;
  return <FontAwesome name={name} size={16} color={color} />;
};

const EventTypeLabel = ({ type }: { type: string }) => {
  const labelMap: { [key: string]: { text: string; bgColor: string; textColor: string } } = {
    TERRITORY_CONQUERED: { text: 'Conquistado', bgColor: 'bg-red-900/30', textColor: 'text-red-400' },
    TERRITORY_CLAIMED: { text: 'Reivindicado', bgColor: 'bg-emerald-900/30', textColor: 'text-emerald-400' },
    TERRITORY_ABANDONED: { text: 'Abandonado', bgColor: 'bg-zinc-800/50', textColor: 'text-neutral-400' },
    TERRITORY_CREATED: { text: 'Criado', bgColor: 'bg-blue-900/30', textColor: 'text-blue-400' },
    default: { text: 'Evento', bgColor: 'bg-zinc-800/50', textColor: 'text-neutral-400' },
  };
  const { text, bgColor, textColor } = labelMap[type] || labelMap.default;
  
  return (
    <View className={`${bgColor} px-2 py-1 rounded-md`}>
      <Text className={`${textColor} text-xs font-semibold uppercase tracking-wide`}>
        {text}
      </Text>
    </View>
  );
};

export function Dashboard({ events, clans, territories }: DashboardProps) {
  const totalClans = clans.length;
  const totalTerritories = territories.length;
  const controlledTerritories = territories.filter(t => t.clan_id).length;
  const neutralTerritories = totalTerritories - controlledTerritories;
  const controlPercentage = totalTerritories > 0 
    ? Math.round((controlledTerritories / totalTerritories) * 100) 
    : 0;

  return (
    <ScrollView className="flex-1">
      <View className="w-full max-w-full">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold mb-1">
            Dashboard
          </Text>
          <Text className="text-neutral-400 text-sm">
            Acompanhe a situação em tempo real
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="mb-6">
          <Text className="text-neutral-500 text-xs font-semibold mb-3 uppercase tracking-wider">
            Estatísticas Gerais
          </Text>
          
          {/* Main Stats Row */}
          <View className="flex-row mb-2 -mx-1">
            <View className="flex-1 px-1">
              <View className="bg-gradient-to-br from-red-900/20 to-red-950/10 border border-red-900/50 rounded-lg p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <FontAwesome name="users" size={20} color="#ef4444" />
                  <Text className="text-red-400 text-xs font-bold uppercase">Clãs</Text>
                </View>
                <Text className="text-white text-3xl font-bold mb-1">{totalClans}</Text>
                <Text className="text-neutral-400 text-xs">Clãs Ativos</Text>
              </View>
            </View>
            
            <View className="flex-1 px-1">
              <View className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/30 border border-zinc-800 rounded-lg p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <FontAwesome name="map" size={20} color="#9ca3af" />
                  <Text className="text-neutral-400 text-xs font-bold uppercase">Total</Text>
                </View>
                <Text className="text-white text-3xl font-bold mb-1">{totalTerritories}</Text>
                <Text className="text-neutral-400 text-xs">Territórios</Text>
              </View>
            </View>
          </View>

          {/* Control Stats Row */}
          <View className="flex-row -mx-1">
            <View className="flex-1 px-1">
              <View className="bg-black border border-emerald-900/50 rounded-lg p-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-emerald-400 text-lg font-bold">{controlledTerritories}</Text>
                    <Text className="text-neutral-500 text-xs">Controlados</Text>
                  </View>
                  <View className="bg-emerald-900/30 px-2 py-1 rounded">
                    <Text className="text-emerald-400 text-xs font-bold">{controlPercentage}%</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View className="flex-1 px-1">
              <View className="bg-black border border-zinc-800 rounded-lg p-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-neutral-400 text-lg font-bold">{neutralTerritories}</Text>
                    <Text className="text-neutral-500 text-xs">Neutros</Text>
                  </View>
                  <View className="bg-zinc-900 px-2 py-1 rounded">
                    <Text className="text-neutral-500 text-xs font-bold">{100 - controlPercentage}%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Event Feed */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">
              Últimos Acontecimentos
            </Text>
            <View className="bg-red-900/30 px-2 py-1 rounded-full">
              <Text className="text-red-400 text-xs font-bold">{events.length}</Text>
            </View>
          </View>
          
          {events.length > 0 ? (
            events.map((event, index) => (
              <View 
                key={event.id} 
                className={`bg-black border border-zinc-900 rounded-lg p-4 ${
                  index !== events.length - 1 ? 'mb-3' : ''
                }`}
              >
                {/* Event Header */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-zinc-900 p-2 rounded-lg mr-3">
                      <EventIcon type={event.event_type} />
                    </View>
                    <EventTypeLabel type={event.event_type} />
                  </View>
                  <View className="bg-zinc-900 px-2 py-1 rounded">
                    <Text className="text-neutral-500 text-xs">
                      {formatDistanceToNow(new Date(event.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </Text>
                  </View>
                </View>

                {/* Event Description */}
                <Text className="text-neutral-300 text-sm leading-5">
                  {event.description}
                </Text>

                {/* Event Footer Line */}
                <View className="mt-3 pt-3 border-t border-zinc-900">
                  <View className="flex-row items-center">
                    <FontAwesome name="clock-o" size={11} color="#71717a" style={{ marginRight: 6 }} />
                    <Text className="text-neutral-600 text-xs">
                      {new Date(event.created_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="bg-black border border-zinc-900 rounded-lg p-8 items-center">
              <FontAwesome name="calendar-times-o" size={32} color="#52525b" style={{ marginBottom: 12 }} />
              <Text className="text-neutral-500 text-center font-medium mb-1">
                Nenhum evento recente
              </Text>
              <Text className="text-neutral-600 text-xs text-center">
                Os acontecimentos aparecerão aqui conforme ocorrem
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
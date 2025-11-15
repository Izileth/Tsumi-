import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { KanjiLoader } from '@/components/ui/kanji-loader';
import { ClanEvent } from '@/app/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type EventsTabProps = {
  events: ClanEvent[];
  loading: boolean;
};

const EventIcon = ({ type }: { type: string }) => {
  const iconMap: { [key: string]: any } = {
    new_member: { name: 'user-plus', color: '#34d399' },
    mission_created: { name: 'plus-circle', color: '#34d399' },
    territory_annexed: { name: 'map-marker', color: '#f87171' },
    mission_completed: { name: 'check-circle', color: '#60a5fa' },
    default: { name: 'history', color: '#9ca3af' },
  };
  const { name, color } = iconMap[type] || iconMap.default;
  return <FontAwesome name={name} size={18} color={color} />;
};

const EventTypeLabel = ({ type }: { type: string }) => {
  const labelMap: { [key: string]: { text: string; bgColor: string; textColor: string } } = {
    new_member: { text: 'Novo Membro', bgColor: 'bg-emerald-900/30', textColor: 'text-emerald-400' },
    mission_created: { text: 'Missão Criada', bgColor: 'bg-emerald-900/30', textColor: 'text-emerald-400' },
    territory_annexed: { text: 'Território', bgColor: 'bg-red-900/30', textColor: 'text-red-400' },
    mission_completed: { text: 'Completada', bgColor: 'bg-blue-900/30', textColor: 'text-blue-400' },
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

const EventCategory = ({ type }: { type: string }) => {
  const categoryMap: { [key: string]: string } = {
    new_member: 'Membros',
    mission_created: 'Missões',
    territory_annexed: 'Territórios',
    mission_completed: 'Missões',
    default: 'Geral',
  };
  return (
    <View className="flex-row items-center">
      <View className="w-1 h-1 bg-neutral-600 rounded-full mr-2" />
      <Text className="text-neutral-600 text-xs uppercase tracking-wider">
        {categoryMap[type] || categoryMap.default}
      </Text>
    </View>
  );
};

export function EventsTab({ events, loading }: EventsTabProps) {
  if (loading) {
    return (
      <View className="items-center p-8">
        <KanjiLoader />
      </View>
    );
  }

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Ontem';
    } else {
      dateKey = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    }
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, ClanEvent[]>);

  return (
    <ScrollView className="flex-1 mb-8">
      {/* Header */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="py-1 rounded-md mr-3">
            <Text className="text-red-600 text-md font-bold uppercase tracking-wider">
              イベント
            </Text>
          </View>
          <View className="flex-1 h-px bg-neutral-800" />
          <View className="bg-red-900/30 px-3 py-1 rounded-full ml-3">
            <Text className="text-red-400 text-xs font-bold">{events.length}</Text>
          </View>
        </View>

        <View className="bg-gradient-to-r from-red-950/30 to-transparent border-l-4 border-red-600 p-4 rounded-r-lg">
          <Text className="text-neutral-400 text-sm leading-5">
            Acompanhe acontecimentos recentes e marcos importantes do clã
          </Text>
        </View>
      </View>

      {/* Events List */}
      {events.length === 0 ? (
        <View className="bg-black border border-zinc-900 rounded-lg p-10 items-center">
          <View className="bg-zinc-900 p-4 rounded-full mb-4">
            <FontAwesome name="inbox" size={32} color="#71717a" />
          </View>
          <Text className="text-white font-semibold text-base mb-1">
            Nenhum evento ainda
          </Text>
          <Text className="text-neutral-500 text-sm text-center">
            Os acontecimentos do clã aparecerão aqui
          </Text>
        </View>
      ) : (
        <View>
          {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
            <View key={dateKey} className="mb-6">
              {/* Date Separator */}
              <View className="flex-row items-center mb-4">
                <View className="bg-zinc-900 px-3 py-1 rounded-full">
                  <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">
                    {dateKey}
                  </Text>
                </View>
                <View className="flex-1 h-px bg-zinc-900 ml-3" />
              </View>

              {/* Events for this date */}
              {dateEvents.map((event, index) => (
                <View
                  key={event.id}
                  className={`bg-black border border-zinc-900 rounded-lg p-4 ${
                    index !== dateEvents.length - 1 ? 'mb-3' : ''
                  }`}
                >
                  {/* Event Header */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <View className="bg-zinc-900 p-2.5 rounded-lg mr-3">
                        <EventIcon type={event.event_type} />
                      </View>
                      <View className="flex">
                        <EventTypeLabel type={event.event_type} />
                        <View>
                          <EventCategory type={event.event_type} />
                        </View>
                      </View>
                    </View>
                    
                    <View className="bg-zinc-900 px-2  py-1 rounded">
                      <Text className="text-neutral-500 text-xs">
                        {formatDistanceToNow(new Date(event.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </Text>
                    </View>
                  </View>

                  {/* Event Description */}
                  <Text className="text-neutral-300 text-sm leading-5 mb-3">
                    {event.description}
                  </Text>

                  {/* Event Footer */}
                  <View className="pt-3 border-t border-zinc-900">
                    <View className="flex-row items-center">
                      <FontAwesome
                        name="clock-o"
                        size={11}
                        color="#71717a"
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-neutral-600 text-xs">
                        {new Date(event.created_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
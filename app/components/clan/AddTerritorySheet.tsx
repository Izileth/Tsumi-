import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { AppBottomSheet } from '@/components/ui/bottom-sheet';
import { CustomButton } from '@/components/ui/custom-button';
import { Territory } from '@/app/lib/types';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';

type AddTerritorySheetProps = {
  onCreate: (name: string, description: string) => Promise<void>;
  onAnnex: (territoryId: string) => Promise<void>;
  availableTerritories: Territory[];
};

type Mode = 'create' | 'annex';

export const AddTerritorySheet = forwardRef(({ onCreate, onAnnex, availableTerritories }: AddTerritorySheetProps, ref) => {
  const [mode, setMode] = useState<Mode>('create');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | undefined>(availableTerritories[0]?.id);
  const [isLoading, setIsLoading] = useState(false);
  const sheetRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    present: () => {
      if (mode === 'annex' && availableTerritories.length > 0 && !selectedTerritoryId) {
        setSelectedTerritoryId(availableTerritories[0].id);
      }
      sheetRef.current?.present();
    },
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const handleSubmit = async () => {
    setIsLoading(true);
    if (mode === 'create') {
      await onCreate(name, description);
      setName('');
      setDescription('');
    } else { // mode === 'annex'
      if (selectedTerritoryId) {
        await onAnnex(selectedTerritoryId);
      }
    }
    setIsLoading(false);
    sheetRef.current?.dismiss();
  };

  return (
    <AppBottomSheet
      ref={sheetRef}
      title="Gerenciar Território"
      titleJP="縄張り管理"
    >
      <View className="gap-4 pt-4">
        {/* Mode Selector */}
        <View className="flex-row bg-zinc-900 rounded-lg p-1 mb-4">
          <Pressable
            onPress={() => setMode('create')}
            className={`flex-1 items-center py-2 rounded-md ${mode === 'create' ? 'bg-red-600' : ''}`}
          >
            <Text className={`font-semibold ${mode === 'create' ? 'text-white' : 'text-neutral-400'}`}>
              Criar Novo
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('annex')}
            className={`flex-1 items-center py-2 rounded-md ${mode === 'annex' ? 'bg-red-600' : ''}`}
          >
            <Text className={`font-semibold ${mode === 'annex' ? 'text-white' : 'text-neutral-400'}`}>
              Anexar Existente
            </Text>
          </Pressable>
        </View>

        {mode === 'create' ? (
          <>
            <View>
              <Text className="text-neutral-400 text-xs mb-2">NOME DO TERRITÓRIO</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ex: Distrito da Luz Vermelha"
                placeholderTextColor="#555"
                className="bg-black border border-zinc-900 rounded-lg px-4 py-3 text-white"
              />
            </View>
            <View>
              <Text className="text-neutral-400 text-xs mb-2">DESCRIÇÃO</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Uma breve descrição do território"
                placeholderTextColor="#555"
                multiline
                numberOfLines={4}
                className="bg-black border border-zinc-900 rounded-lg px-4 py-3 text-white h-24"
              />
            </View>
            <CustomButton
              title="Criar Território"
              onPress={handleSubmit}
              isLoading={isLoading}
              className="w-full bg-red-900/20 border py-3 border-red-800"
              textClassName="text-red-400"
            />
          </>
        ) : ( // mode === 'annex'
          availableTerritories.length > 0 ? (
            <>
              <View>
                <Text className="text-neutral-400 text-xs mb-2">TERRITÓRIO DISPONÍVEL</Text>
                <View className="bg-black border border-zinc-900 rounded-lg">
                  <Picker
                    selectedValue={selectedTerritoryId}
                    onValueChange={(itemValue) => setSelectedTerritoryId(itemValue)}
                    style={{ color: 'white' }}
                    dropdownIconColor="white"
                  >
                    {availableTerritories.map((territory) => (
                      <Picker.Item key={territory.id} label={territory.name} value={territory.id} />
                    ))}
                  </Picker>
                </View>
              </View>
              <CustomButton
                title="Anexar Território"
                onPress={handleSubmit}
                isLoading={isLoading}
                className="w-full bg-red-900/20 border py-3 border-red-800"
                textClassName="text-red-400"
              />
            </>
          ) : (
            <View className="items-center justify-center p-8">
              <FontAwesome name="map-o" size={40} color="#525252" />
              <Text className="text-neutral-500 text-center mt-3">
                Nenhum território neutro disponível para anexar no momento.
              </Text>
            </View>
          )
        )}
      </View>
    </AppBottomSheet>
  );
});

AddTerritorySheet.displayName = 'AddTerritorySheet';
// screens/SettingsScreen.js

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import useTheme from '../hooks/useTheme';
import { useSettings, useSchedules } from '../context/AppContext';
import { format } from 'date-fns';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { schedules, deleteSchedule, isPro, setIsPro } = useSchedules();
  const { isDarkMode, setIsDarkMode, is24HourTime, setIs24HourTime } = useSettings();

  const handleEditSchedule = (schedule) => {
    navigation.navigate('ScheduleName', {
      scheduleName: schedule.name,
      selectedDays: schedule.selectedDays,
      hasZeroPeriod: schedule.hasZeroPeriod,
      numPeriods: schedule.numPeriods,
      edit: true,
      existingSchedule: schedule,
    });
  };

  const handleDeleteSchedule = (schedule) => {
    Alert.alert(
      'Delete Schedule',
      `Are you sure you want to delete "${schedule.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSchedule(schedule.id) },
      ]
    );
  };

  const handleCreateNewSchedule = () => {
    navigation.navigate('ScheduleName');
  };

  const handleUpgrade = () => {
    Alert.alert('Upgrade to Pro', 'This would take you to the upgrade flow (future feature).');
  };

  const handleShowProFeatures = () => {
    Alert.alert(
      'Pro Features',
      'Pro users can:\n\n- Create multiple schedules\n- Unlock future cloud sync\n- Access custom themes\n- Remove ads'
    );
  };

  const toggleDevProMode = () => {
    setIsPro(!isPro);
    Alert.alert('Dev Mode', `Pro mode is now ${!isPro ? 'ENABLED' : 'DISABLED'}.`);
  };

  const today = format(new Date(), 'EEE');
  const activeSchedule = schedules.find(
    (s) => Array.isArray(s.selectedDays) && s.selectedDays.includes(today)
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.backButtonContainer}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
          </Pressable>
        </View>

        <Text style={[styles.header, { color: theme.colors.text }]}>Settings</Text>

        <View style={[styles.activeCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.activeTitle, { color: theme.colors.text }]}>Current Schedule</Text>
          {activeSchedule ? (
            <>
              <Text style={[styles.activeName, { color: theme.colors.text }]}>
                {activeSchedule.name}
              </Text>
              <Text style={[styles.activeDays, { color: theme.colors.text + 'AA' }]}>
                {activeSchedule.selectedDays.join(', ')}
              </Text>
            </>
          ) : (
            <Text style={[styles.noActive, { color: theme.colors.text + 'AA' }]}>
              No Active Schedule Today
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Schedules</Text>

          {schedules.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.colors.text + '99' }]}>
              No schedules yet.
            </Text>
          ) : (
            schedules.map((schedule, idx) => (
              <View
                key={schedule.id ?? `${schedule.name}-${idx}`}
                style={[styles.scheduleCard, { backgroundColor: theme.colors.card }]}
              >
                <View style={styles.scheduleHeader}>
                  <Text style={[styles.scheduleName, { color: theme.colors.text }]}>
                    {schedule.name}
                  </Text>

                  <View style={styles.scheduleActions}>
                    <Pressable onPress={() => handleEditSchedule(schedule)} style={styles.actionButton}>
                      <Ionicons name="create-outline" size={20} color={theme.colors.text} />
                    </Pressable>
                    <Pressable onPress={() => handleDeleteSchedule(schedule)} style={styles.actionButton}>
                      <Ionicons name="trash-outline" size={20} color="red" />
                    </Pressable>
                  </View>
                </View>

                <Text style={[styles.scheduleDays, { color: theme.colors.text }]}>
                  {Array.isArray(schedule.selectedDays) ? schedule.selectedDays.join(', ') : 'No days selected'}
                </Text>
              </View>
            ))
          )}

          {isPro ? (
            <AppButton
              title="Create New Schedule"
              onPress={handleCreateNewSchedule}
              style={{ marginTop: 16 }}
            />
          ) : schedules.length === 0 ? (
            <AppButton
              title="Create Schedule"
              onPress={handleCreateNewSchedule}
              style={{ marginTop: 16 }}
            />
          ) : (
            <Text style={[styles.lockedText, { color: theme.colors.text + '99' }]}>
              Upgrade to Pro to create multiple schedules.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              thumbColor={isDarkMode ? theme.colors.primary : '#ccc'}
            />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.text }]}>24-Hour Time</Text>
            <Switch
              value={is24HourTime}
              onValueChange={setIs24HourTime}
              thumbColor={is24HourTime ? theme.colors.primary : '#ccc'}
            />
          </View>
        </View>

        {!isPro && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Go Pro</Text>
            <AppButton title="Upgrade to Pro" onPress={handleUpgrade} style={{ marginBottom: 12 }} />
            <AppButton title="View Pro Features" onPress={handleShowProFeatures} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Developer Tools</Text>
          <AppButton
            title={`Toggle Pro Mode (Currently ${isPro ? 'On' : 'Off'})`}
            onPress={toggleDevProMode}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    padding: 24,
    paddingBottom: 48,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  activeCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  activeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  activeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  activeDays: {
    fontSize: 14,
    marginTop: 4,
  },
  noActive: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  scheduleCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleName: {
    fontSize: 18,
    fontWeight: '600',
  },
  scheduleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  scheduleDays: {
    fontSize: 14,
    opacity: 0.7,
  },
  lockedText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { formatDateParam } from '../lib/utils';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';

interface CalendarPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function CalendarPicker({ selectedDate, onDateChange, minDate }: CalendarPickerProps) {
  const today = startOfDay(new Date());
  const minimum = minDate ? startOfDay(minDate) : today;
  const [viewMonth, setViewMonth] = useState(startOfMonth(selectedDate));

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startWeekday = getDay(monthStart);

  const prevMonth = () => setViewMonth((m) => subMonths(m, 1));
  const nextMonth = () => setViewMonth((m) => addMonths(m, 1));
  const canGoPrev = !isBefore(startOfMonth(viewMonth), startOfMonth(minimum));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={prevMonth}
          disabled={!canGoPrev}
          style={[styles.navBtn, !canGoPrev && styles.navDisabled]}
        >
          <Text style={styles.navArrow}>‹</Text>
        </Pressable>
        <Text style={styles.monthLabel}>{format(viewMonth, 'MMMM yyyy')}</Text>
        <Pressable onPress={nextMonth} style={styles.navBtn}>
          <Text style={styles.navArrow}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((d) => (
          <Text key={d} style={styles.weekday}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {Array.from({ length: startWeekday }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.dayCell} />
        ))}
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isDisabled = isBefore(startOfDay(day), minimum);
          const isToday = isSameDay(day, today);

          return (
            <Pressable
              key={formatDateParam(day)}
              onPress={() => !isDisabled && onDateChange(day)}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                isToday && !isSelected && styles.dayCellToday,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  isDisabled && styles.dayTextDisabled,
                  isToday && !isSelected && styles.dayTextToday,
                ]}
              >
                {format(day, 'd')}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: Colors.borderLight,
  },
  navDisabled: {
    opacity: 0.3,
  },
  navArrow: {
    fontSize: 22,
    color: Colors.navy,
    lineHeight: 28,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    paddingVertical: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },
  dayCellSelected: {
    backgroundColor: Colors.navy,
  },
  dayCellToday: {
    backgroundColor: Colors.overlayLight,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  dayTextSelected: {
    color: Colors.textInverse,
    fontWeight: '700',
  },
  dayTextDisabled: {
    color: Colors.textMuted,
    opacity: 0.4,
  },
  dayTextToday: {
    color: Colors.navy,
    fontWeight: '700',
  },
});

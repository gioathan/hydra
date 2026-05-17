import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { T } from '../constants/typography';
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
      {/* Month navigation */}
      <View style={styles.header}>
        <Pressable
          onPress={prevMonth}
          disabled={!canGoPrev}
          style={[styles.navBtn, !canGoPrev && styles.navDisabled]}
          hitSlop={8}
        >
          <MaterialIcons name="chevron-left" size={22} color={Colors.primary} />
        </Pressable>
        <Text style={styles.monthLabel}>{format(viewMonth, 'MMMM yyyy')}</Text>
        <Pressable onPress={nextMonth} style={styles.navBtn} hitSlop={8}>
          <MaterialIcons name="chevron-right" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Weekday labels */}
      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((d) => (
          <Text key={d} style={styles.weekday}>{d}</Text>
        ))}
      </View>

      {/* Day grid */}
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
              style={styles.dayCell}
              hitSlop={2}
            >
              {/* The circle sits inside a fixed-size container so it's always centered */}
              <View
                style={[
                  styles.dayCircle,
                  isSelected && styles.dayCircleSelected,
                  isToday && !isSelected && styles.dayCircleToday,
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
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const CIRCLE_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '4D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthLabel: {
    ...T.titleSm,
    fontSize: 15,
    color: Colors.primary,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  navDisabled: { opacity: 0.3 },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    ...T.labelCaps,
    fontSize: 11,
    color: Colors.outline,
    paddingVertical: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // Cell occupies 1/7 of the row; does NOT have the circle background
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Fixed-size circle centered inside the cell
  dayCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: Colors.primary,
  },
  dayCircleToday: {
    backgroundColor: Colors.primaryContainer + '33',
  },
  dayText: {
    ...T.bodyMd,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: CIRCLE_SIZE,
    textAlign: 'center',
  },
  dayTextSelected: {
    color: Colors.onPrimary,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  dayTextDisabled: {
    color: Colors.outline,
    opacity: 0.4,
  },
  dayTextToday: {
    color: Colors.primary,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});

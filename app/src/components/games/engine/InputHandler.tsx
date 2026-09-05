import { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, PanResponder, GestureResponderHandlers } from 'react-native';
import { SquishyButton, Text } from '../../ui';
import { Audio } from 'expo-av';
import { InputType } from './types';
import { selection, heavyImpact } from './HapticFeedbackSystem';

type Props = {
  type: InputType;
  value?: string | number;
  onChange?: (v: any) => void;
  onVoiceData?: (rec: Audio.Recording) => void;
};

export default function InputHandler({ type, value, onChange, onVoiceData }: Props) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const sliderWidth = useRef(0);
  const barX = useRef(0);
  const pan = useMemo<GestureResponderHandlers>(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        barX.current = x;
        const score = Math.max(0, Math.min(100, Math.round((x / sliderWidth.current) * 100)));
        onChange && onChange(score);
        selection();
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        barX.current = x;
        const score = Math.max(0, Math.min(100, Math.round((x / sliderWidth.current) * 100)));
        onChange && onChange(score);
      },
    }).panHandlers;
  }, [onChange]);

  async function startRec() {
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) return;
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
    heavyImpact();
  }

  async function stopRec() {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    onVoiceData && onVoiceData(recording);
    setRecording(null);
  }

  if (type === 'text') {
    return (
      <View>
        <TextInput placeholder="Type your reflection" style={styles.input} value={String(value || '')} onChangeText={(t) => onChange && onChange(t)} />
      </View>
    );
  }
  if (type === 'voice') {
    return (
      <View>
        <Text variant="body">Hold a voice reflection</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <SquishyButton onPress={startRec} style={styles.btn}><Text variant="header">Record</Text></SquishyButton>
          <SquishyButton onPress={stopRec} style={styles.btn}><Text variant="header">Stop</Text></SquishyButton>
        </View>
      </View>
    );
  }
  if (type === 'camera') {
    return (
      <View>
        <Text variant="body">Camera input placeholder</Text>
      </View>
    );
  }
  return (
    <View>
      <Text variant="body">Slide to set intensity</Text>
      <View style={styles.slider} onLayout={(e) => (sliderWidth.current = e.nativeEvent.layout.width)} {...pan}>
        <View style={[styles.knob, { left: Math.max(0, Math.min(((value as number) || 0) / 100 * (sliderWidth.current - 24), sliderWidth.current - 24)) }]} />
      </View>
      <Text variant="keyword">{Math.round((value as number) || 0)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: 'rgba(26, 10, 31, 1)', borderWidth: 1, borderColor: 'rgba(252, 12, 132, 0.2)', borderRadius: 10, padding: 10, color: 'rgba(255, 255, 255, 1)' },
  btn: { paddingHorizontal: 12, paddingVertical: 8 },
  slider: { height: 24, backgroundColor: 'rgba(18, 0, 22, 1)', borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  knob: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(252, 12, 132, 1)' },
});


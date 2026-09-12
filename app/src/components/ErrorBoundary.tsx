import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from './ui/Typography';
import SquishyButton from './ui/SquishyButton';
import { COLORS, SPACING } from '../theme';

type Props = {
  children: React.ReactNode;
  /** Remounts the subtree when this value changes (e.g. the active route key). */
  resetKey?: string | number;
};

type State = { error: Error | null };

/**
 * Catches render errors from a single screen so one bad screen shows a
 * recoverable message instead of unmounting the whole navigator and leaving
 * the user with a blank app.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error?.message, info?.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <View style={styles.container}>
        <Typography variant="h3" center style={styles.title}>
          Dr. Marcie dropped this one.
        </Typography>
        <Typography variant="body" center style={styles.body}>
          This screen hit an error. Everything else still works.
        </Typography>
        <Typography variant="caption" center style={styles.detail}>
          {error.message}
        </Typography>
        <SquishyButton onPress={() => this.setState({ error: null })} style={styles.button}>
          <Typography variant="button">TRY AGAIN</Typography>
        </SquishyButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
    backgroundColor: COLORS.backgroundPrimary,
  },
  title: { color: COLORS.textPrimary, marginBottom: SPACING.regular },
  body: { color: COLORS.textSecondary, marginBottom: SPACING.small },
  detail: { color: COLORS.textHint, marginBottom: SPACING.large },
  button: { minWidth: 200 },
});

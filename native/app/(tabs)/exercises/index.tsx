import { Image, Platform, Pressable } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from '@react-navigation/native';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Exercises() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* FORM: style: SAN vs game */}
      {/* FORM: upload custom FEN */}
      <Text style={styles.title}>Exercises:</Text>
      <Link to="/exercises/san" style={styles.link}>
        <Text style={styles.linkText}>Openers</Text>
      </Link>
      <Link to="/" style={styles.link}>
        <Text style={styles.linkText}>Puzzles</Text>
      </Link>
      <Link to="/" style={styles.link}>
        <Text style={styles.linkText}>Play vs computer</Text>
      </Link>

      <Link to="/dashboard" style={styles.link}>
        <Text style={styles.linkText}>Dashboard</Text>
      </Link>
      <Link to="/leaderboards" style={styles.link}>
        <Text style={styles.linkText}>leader</Text>
      </Link>

      {/* <Button
          title="Opening Memorization Game"
          onPress={() => navigation.navigate('home')}
        />
        <Button
          title="Dashboard"
          onPress={() => navigation.navigate('Dashboard')}
        />
        <Button
          title="Leaderboards"
          onPress={() => navigation.navigate('Leaderboards')}
        /> */}
      {/* Add more game types as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

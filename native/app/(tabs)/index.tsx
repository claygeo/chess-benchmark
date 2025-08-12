import { Image, Platform, Pressable } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from '@react-navigation/native';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>Choose an exercise:</Text>
        <Link to="/exercises" style={styles.link}>
          <Text style={styles.linkText}>
            Openers (SAN) - Train your linguistic skills by memorizing the SAN
            for classic openings.
          </Text>
        </Link>
        <Link to="/" style={styles.link}>
          <Text style={styles.linkText}>
            Openers (Pieces) - Improve your spatial memory by playing out
            textbook openings.
          </Text>
        </Link>

        <Link to="/" style={styles.link}>
          <Text style={styles.linkText}>
            Openers (Pieces) - Do you recognize this SAN? Improve your verbal
            recognition.
          </Text>
        </Link>

        <Link to="/" style={styles.link}>
          <Text style={styles.linkText}>
            Openers (Pieces) - Do you recognize this position? Improve your
            board recognition.
          </Text>
        </Link>

        <Link to="/" style={styles.link}>
          <Text style={styles.linkText}>Blind chess</Text>
        </Link>
        {/* if playform = web
        Typing test
        */}
        <Link to="/" style={styles.link}>
          <Text style={styles.linkText}>
            Openers (Pieces) - Improve your spatial memory by playing out
            textbook openings.
          </Text>
        </Link>

        <Link to="/" style={styles.link}>
          <Text style={styles.linkText}>Puzzles</Text>
        </Link>
        <Link to="/" style={styles.link}>
          <Text style={styles.linkText}>Vs computer</Text>
        </Link>

        {/* <Link to="/dashboard" style={styles.link}>
          <Text style={styles.linkText}>Dashboard</Text>
        </Link>
        <Link to="/leaderboards" style={styles.link}>
          <Text style={styles.linkText}>leader</Text>
        </Link> */}

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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
    borderBlockColor: 'black',
    borderWidth: 1,
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

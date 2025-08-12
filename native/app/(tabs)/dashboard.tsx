import { Image, StyleSheet, Platform, Pressable } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from '@react-navigation/native';

export default function Leaderboards() {
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
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome! to the dashboard</ThemedText>
        <HelloWave />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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

// // screens/Dashboard.tsx
// import React from 'react';
// import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
// import { useQuery, gql } from '@apollo/client';

// const GET_USER = gql`
//   query GetUser($id: ID!) {
//     user(id: $id) {
//       id
//       username
//       gamesPlayed
//       openingsCompleted
//       highestScore
//     }
//   }
// `;

// type Props = {
//   navigation: any;
// };

// const Dashboard: React.FC<Props> = ({ navigation }) => {
//   const userId = 1; // Replace with dynamic user ID if implementing authentication
//   const { loading, error, data } = useQuery(GET_USER, {
//     variables: { id: userId },
//   });

//   if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
//   if (error) return <Text>Error loading user stats: {error.message}</Text>;

//   const userStats = data.user;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Player Dashboard</Text>
//       <Text style={styles.stat}>Username: {userStats.username}</Text>
//       <Text style={styles.stat}>Games Played: {userStats.gamesPlayed}</Text>
//       <Text style={styles.stat}>Openings Completed: {userStats.openingsCompleted}</Text>
//       <Text style={styles.stat}>Highest Score: {userStats.highestScore}</Text>
//       <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
//     </View>
//   );
// };

// // ... existing styles

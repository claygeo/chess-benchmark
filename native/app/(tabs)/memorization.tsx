// // screens/MemorizationGame.tsx
// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
// import { useQuery, gql } from '@apollo/client';
// import Chessboard from 'react-chessboard';
// import Chess from 'chess.js';
// import OpeningsList from '../components/OpeningsList';

// const GET_OPENING = gql`
//   query GetOpening($id: ID!) {
//     opening(id: $id) {
//       id
//       name
//       moves
//     }
//   }
// `;

// type Props = {
//   navigation: any;
// };

// const MemorizationGame: React.FC<Props> = ({ navigation }) => {
//   const [selectedOpeningId, setSelectedOpeningId] = useState<string | null>(null);
//   const [game, setGame] = useState(new Chess());
//   const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

//   if (!selectedOpeningId) {
//     return <OpeningsList onSelectOpening={setSelectedOpeningId} />;
//   }

//   const { loading, error, data } = useQuery(GET_OPENING, {
//     variables: { id: selectedOpeningId },
//   });

//   if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
//   if (error) return <Text>Error loading opening: {error.message}</Text>;

//   const openingMoves = data.opening.moves.split(',');

//   const onDrop = (sourceSquare: string, targetSquare: string) => {
//     const move = game.move({
//       from: sourceSquare,
//       to: targetSquare,
//       promotion: 'q',
//     });

//     if (move) {
//       const expectedMove = openingMoves[currentMoveIndex];
//       if (move.san === expectedMove) {
//         setCurrentMoveIndex(currentMoveIndex + 1);
//         if (currentMoveIndex + 1 === openingMoves.length) {
//           alert(`Congratulations! You have completed the ${data.opening.name} opening.`);
//           setGame(new Chess());
//           setCurrentMoveIndex(0);
//         }
//       } else {
//         alert('Incorrect move. Try again.');
//         game.undo();
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.sanContainer}>
//         <Text style={styles.sanText}>
//           {`Round ${Math.ceil((currentMoveIndex + 1) / 2)}: ${openingMoves
//             .slice(0, currentMoveIndex + 1)
//             .join(' ')}`}
//         </Text>
//       </View>
//       <Chessboard
//         position={game.fen()}
//         onPieceDrop={onDrop}
//         boardWidth={Dimensions.get('window').width}
//       />
//       <Button title="Select Different Opening" onPress={() => setSelectedOpeningId(null)} />
//       <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   sanContainer: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   sanText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default MemorizationGame;

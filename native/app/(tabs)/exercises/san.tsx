import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { WebView } from 'react-native-webview';

const ruyLopezMoves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6'];

export default function San() {
  const [game, setGame] = useState(new Chess());
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move) {
      const expectedMove = ruyLopezMoves[currentMoveIndex];
      if (move.san === expectedMove) {
        setCurrentMoveIndex(currentMoveIndex + 1);
        if (currentMoveIndex + 1 === ruyLopezMoves.length) {
          alert('Congratulations! You have completed the Ruy Lopez opening.');
          setGame(new Chess());
          setCurrentMoveIndex(0);
        }
      } else {
        alert('Incorrect move. Try again.');
        game.undo();
      }
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.sanContainer}>
        <Text style={styles.sanText}>
          {`Round ${Math.ceil((currentMoveIndex + 1) / 2)}: ${ruyLopezMoves
            .slice(0, currentMoveIndex + 1)
            .join(' ')}`}
        </Text>
      </View>
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardWidth={Dimensions.get('window').width}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  sanContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sanText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

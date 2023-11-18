import pb from '../pb';

export async function createUser(player: 'player 1' | 'player 2', gameId?: string): Promise<any> {
  try {
    const user = await pb?.collection('users').create({
      player,
      ...(gameId && { gameId }),
    });

    return user?.id;
  } catch (error) {
    console.error('Error creating user:', error);
    return error;
  }
}

export async function createGame(): Promise<any> {
  try {
    // Create a game and a user concurrently
    const [gamesId, user1] = await Promise.all([
      pb?.collection('games').create({
        status: 'in-progress',
      }).then((res) => {
        if (res?.id) {
          return res.id;
        } else {
          throw new Error('Failed to create a game');
        }
      }),
      createUser('player 1'),
    ]);

    await pb?.collection('users').update(user1, {
      gameId: gamesId,
    })

    return {
      gamesId,
      playerId: user1,
    };
  } catch (error) {
    console.error('Error creating game:', error);
    return error;
  }
}

// Assuming pb is your PocketBase client instance
export async function gameStatus(gameId: string, callback: (action: string) => void) {
  // Subscribe to the 'games' collection changes
  const unsubscribe = await pb.collection('games').subscribe('*', (e) => {
    if (e.record.id === gameId) {
      // Invoke the callback with the action of the record
      callback(e?.record?.action);
    }
  });

  // Return a function to unsubscribe when needed
  return unsubscribe;
}


export async function isPlayer2Created(gameId: string): Promise<boolean> {
  try {
    return new Promise<boolean>(async (resolve, reject) => {
      let timeout: number;

      // Wait for the subscription to resolve and get the unsubscribe function
      const unsubscribe = await pb.collection('users').subscribe('*', (e) => {
        if (e.record.gameId === gameId && e.record.player === 'player 2') {
          clearTimeout(timeout);
          unsubscribe();  // Now unsubscribe is a function
          resolve(true);
        }
      });

      // Set a timeout for the case where Player 2 is not found
      timeout = window.setTimeout(() => {
        unsubscribe();
        reject(new Error('Player 2 not found within the specified time'));
      }, 30000);
    });
  } catch (error) {
    console.error('Error checking if Player 2 is created:', error);
    throw error;
  }
}

export const getMoves = async (gameId: string, onNewMove: (move: any) => void): Promise<() => void> => {
  try {
    // Await the promise to get the unsubscribe function
    const unsubscribe = pb.collection('moves').subscribe('*', (e) => {
      if (e.record.gameId === gameId) {
        onNewMove(e.record);
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to moves:', error);
    throw error;
  }
};

export const updateMoves = async (gameId: string, player: 'player 1' | 'player 2', move: { column: number, row: number }): Promise<any> => { 
  try {
    await pb?.collection('moves').create({
      gameId,
      player,
      column: move.column,
      row: move.row
    });
  } catch (error) {
    throw error;
  }
}

export const checkWinner = async (player: 1 | 2, gameId: string) => {
  try {
    return await pb?.collection('winning').create({
      gameId,
      player
    })
  } catch (error) {
    throw error;
  }
}

export const restartGame = async (gameId: string, action: 'start' | 'resume' | 'paused') => { 
  try {
    return await pb?.collection('games').update(gameId, {
      action
    });
  } catch (error) {
    throw error;
  }
}


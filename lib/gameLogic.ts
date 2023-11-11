import pb from './pb';

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
      pb?.collection('users').create({
        player: 'player 1',
      }).then((res) => {
        if (res?.id) {
          return res.id;
        } else {
          throw new Error('Failed to create a user');
        }
      }),
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


export async function isPlayer2Created(gameId: string): Promise<boolean> {
  try {
    return new Promise<boolean>(async (resolve, reject) => {
      let timeout: number;

      // Wait for the subscription to resolve and get the unsubscribe function
      const unsubscribe = await pb.collection('users').subscribe('*', (e) => {
        console.log(e.record,'e.record')
        if (e.record.gameId === gameId && e.record.player === 'player 2') {
          // clearTimeout(timeout);
          unsubscribe();  // Now unsubscribe is a function
          resolve(true);
        }
      });

      // Set a timeout for the case where Player 2 is not found
      // timeout = window.setTimeout(() => {
      //   unsubscribe();
      //   reject(new Error('Player 2 not found within the specified time'));
      // }, 30000);
    });
  } catch (error) {
    console.error('Error checking if Player 2 is created:', error);
    throw error;
  }
}



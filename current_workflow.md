## These must be done for the SelectGame component

1. Remove all deck selection from this page and the conditionals for such. This is now handled by the SelectDeckModal.

2. The `SelectGame.tsx` component should have the following states added to it:

```ts
const [showPublicModal, togglePublicModal] = useState(false); // this enables the SelectGame page to show the modal when the Play Now button is clicked
const [showPrivateModal, togglePrivateModal] = useState(false); // this enables the SelectGame page to show a modal when we click "Accept" for a pending game
const [privateGameID, setPrivateGameID] = useState<null | number>(null); // this will be a state that we can change for a callback param for joining a private game
```

3. Page should have a conditionally rendered `div` that resembles the following:

```ts
<div id="Public-modal">
  {showModal ? (
    <div className="modal fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-40 modal-middle">
      <SelectDeck
        user={user}
        volume={volume}
        toggleModal={togglePublicModal}
        callback={onClickPlay}
        callbackParams={openGame.game_id}
      />
    </div>
  ) : (
    <></>
  )}
</div>
```

3. On page startup, the useEffect will try to check if a user has an open public game. If this is true, then the `Play Now` button will not use the SelectDeckModal, because the user doesn't need to select a deck for an ongoing game. In which case, it will just execute an `onClickPlay` when clicked.

```ts
useEffect(() => {
  axios
    .get(`/games/${user.id}`)
    .then((response) => {
      setActiveUserGame(true); // this state will be used to determine if we need to render a modal
    })
    .catch((error) => {
      console.error(`No public games found for user.`);
    });
}, []);
```

4. If the user does _not_ have an active game, then the `Play Now` button will do a `startSearchGame`. This will render a modal, and it will also begin searching for a game whenever the model is closed (a deck has been selected).

```ts
const startSearchPublicGame = () => {
  togglePublicModal(true); // this will open modal for user to select a deck, then it will conduct an onClickPlay
};
```

5. For an on-click to join a private game, we need to do something else because how these endpoints work are drastically different.

```ts
const startSearchPrivateGame = () => {
  togglePrivateModal(true); // this will open modal for user to select a deck, then it will conduct a joinPrivateSession
};
```

6. This will render a modal that appears different, but is using a different callback.

```ts
<div id="Public-modal">
  {showModal ? (
    <div className="modal fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-40 modal-middle">
      <SelectDeck
        user={user}
        volume={volume}
        toggleModal={togglePrivateModal} // this tells the SelectDeckModal to change this state when everything is complete, so the SelectGame will stop rendering modal
        callback={joinPrivateGame} // as well as here, this is the callback that will be executed when modal is completed (not cancelled)
        callbackParams={privateGameID} // and here, this will give the privateGameID to joinPrivateGame (executed when modal is closed with Accept button)
      />
    </div>
  ) : (
    <></>
  )}
</div>
```

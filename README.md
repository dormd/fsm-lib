# @dormd/fsm
JavaScript library for FSM (Finite State Machine). 

## Intro
Finite state machines are a great conceptual model for many concerns facing
developers – from conditional UI, connectivity monitoring & management to
initialization and more. State machines can simplify tangled paths of asynchronous
code, they're easy to test, and they inherently lend themselves to helping you avoid
unexpected edge-case-state pitfalls.

## Install 
`yarn install @dormd/fsm`

## Usage
```js
  import createFSM from '@dormd/fsm';

  const counterFSM = createFSM({
    initialState: 'one',
    initialize: () => console.log('FSM initialized'),
    // global hooks
    onActionEnter: function (action, currentState, targetState) {
      console.log(`onActionEnter (global): ${currentState} -> ${targetState} by [${action}] action`);
    },
    onActionExit: function (action, currentState, targetState) {
      console.log(`onActionExit (global): ${currentState} -> ${targetState} by [${action}] action`);
    },
    // custom state property
    counter: 1,
    states: {
      'one': {
        onActionEnter: function () { console.log(this.counter) } ,
        // onActionExit: function () {},
        actions: {
          'inc': {
            targetState: 'two',
            // onActionEnter: function () {},
            onActionExit: function () { console.log('one inc action exit') },
            action: function (action) { this.counter++ },
          }
        }
      },
      'two': {
        actions: {
          'inc': {
            targetState: 'three',
            action: function (action) { this.counter++ },
          },
          'dec': {
            targetState: 'one',
            action: function (action) { this.counter-- },
          }          
        }
      },
      'three': {}      
    }
  });
});
```

## Available functionalities
- `createFSM(config)`
- `doAction(action)`
- `getCurrentState()`
- `getPossibleActions()`
- `getReachableStates()`
- `isActionValid(nextAction)`
- `isActionInvalid(nextAction)`
- `isReachableState(nextState)`
- `isUnreachableState(nextState)`
- `isFinalState()`

## Configuration
TODO

## Main used libraries
- Jest
- ESLint
- Webpack
- Babel

## TODO
- Improve documentation
- Test utilities functions and complex flows


function uniqueStr(strs) {
  return Object.keys(strs.reduce((acc, str) => ({
    ...acc,
    [str]: true,
  }), {}));
}

export default function createFSM(machineConfig) {
  if (!machineConfig) throw new Error('FSM: You must provide machine configuration');

  const {
    initialize,
    initialState,
    states,
    onActionEnter,
    onActionExit,
    ...restStateData
  } = machineConfig;

  if (!initialState) throw new Error('FSM: You must provide an initial state');

  initialize && initialize();

  // private
  let currentState = initialState;

  function doAction(action) {
    const currentStateConfig = states[currentState];

    const actionConfig = currentStateConfig.actions[action];
    if (!actionConfig) throw new Error(`FSM: action ${action} doesn't exist`);

    const { targetState } = actionConfig;
    const targetStateConfig = states[targetState];
    if (!targetStateConfig) throw new Error(`FSM: target state ${targetState} doesn't exist`);

    onActionEnter && onActionEnter.call(this, action, currentState, targetState);
    currentStateConfig.onActionEnter && currentStateConfig.onActionEnter.call(this, action, currentState, targetState);
    actionConfig.onActionEnter && actionConfig.onActionEnter.call(this, action, currentState, targetState);

    const prevState = currentState;

    actionConfig.action && (actionConfig.action.call(this, action, prevState, targetState));
    currentState = targetState;

    onActionExit && onActionExit.call(this, action, prevState, targetState);
    currentStateConfig.onActionExit && currentStateConfig.onActionExit.call(this, action, prevState, targetState);
    actionConfig.onActionExit && actionConfig.onActionExit.call(this, action, prevState, targetState);

    return currentState;
  }

  function getCurrentState() {
    return currentState;
  }

  function getPossibleActions() {
    const availableActionsConfig = states[currentState].actions || {};
    return Object.keys(availableActionsConfig);
  }

  function getReachableStates() {
    const availableActionsConfig = states[currentState].actions || {};
    return uniqueStr(Object.values(availableActionsConfig).map(({ targetState }) => targetState));
  }

  function isActionValid(nextAction) {
    const availableActionsConfig = states[currentState].actions;
    return !!(availableActionsConfig && availableActionsConfig[nextAction]);
  }

  function isActionInvalid(nextAction) {
    return !isActionValid(nextAction);
  }

  function isReachableState(nextState) {
    return getReachableStates().indexOf(nextState) !== -1;
  }

  function isUnreachableState(nextState) {
    return !isReachableState(nextState);
  }

  // return true when all current state actions lead to same state
  function isFinalState() {
    return getReachableStates().every((state) => state === currentState);
  }

  return {
    ...restStateData,
    doAction,
    getCurrentState,
    getPossibleActions,
    getReachableStates,
    isActionValid,
    isActionInvalid,
    isReachableState,
    isUnreachableState,
    isFinalState,
  };
}

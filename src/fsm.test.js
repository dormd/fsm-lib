import createFSM from './fsm';

describe('fsm', () => {
  describe('createFSM', () => {
    describe('machineConfig', () => {
      describe('when machineConfig provided', () => {
        it('should not throw an exception', () => {
          expect(() => {
            createFSM({ initialState: 'one' });
          }).not.toThrow();
        });
      });

      describe('when machineConfig is not provided', () => {
        it('should throw an exception', () => {
          expect(() => {
            createFSM();
          }).toThrow('FSM: You must provide machine configuration');
        });
      });

      describe('when [counter] custom config (state) passed by machineConfig', () => {
        it('should expose counter as part of the returned fsm object', () => {
          const fsm = createFSM({
            initialState: 'one',
            counter: 1,
            states: {
              'one': {
                actions: {
                  'inc': {
                    targetState: 'two',
                  }
                }
              },
              'two': {}
            }
          });

          expect(fsm.counter).toBe(1);
        });

        it('should expose counter as part of the action handler context', (done) => {
          const fsm = createFSM({
            initialState: 'one',
            counter: 1,
            states: {
              'one': {
                actions: {
                  'inc': {
                    targetState: 'two',
                    action: function incAction() { 
                      expect(this.counter).toBe(1);
                    },
                  }
                }
              },
              'two': {}
            }
          });

          // call expect to check that counter is accessible
          fsm.doAction('inc');
          done();
        });
      });
    }); 

    describe('initialize', () => {
      describe('when initialize provided', () => {
        it('should run initialize function', () => {
          const initializeMock = jest.fn();
          createFSM({
            initialize: initializeMock, 
            initialState: 'one'
          });

          expect(initializeMock).toHaveBeenCalled();
        });
      });

      describe('when initialize is not provided', () => {
        it('should not throw an exception', () => {
          expect(() => {
            createFSM({ initialState: 'one' });
          }).not.toThrow();
        });
      });
    });

    describe('initialize', () => {
      describe('when initialState provided', () => {
        it('should not throw an exception', () => {
          expect(() => {
            createFSM({ initialState: 'one' });
          }).not.toThrow();
        });
      });

      describe('when initialState is not provided', () => {
        it('should throw an exception', () => {
          expect(() => {
            createFSM({});
          }).toThrow('FSM: You must provide an initial state');
        });
      });
    });    
  });
  
  describe('doAction', () => {
    describe('when configuration provided', () => {
      let onActionEnterGlobalMock;
      let onActionEnterStateMock;
      let onActionEnterActionMock;
      let onActionExitGlobalMock;
      let onActionExitStateMock;
      let onActionExitActionMock;      
      let actionMock;
      let fsm;

      beforeEach(() => {
        onActionEnterGlobalMock = jest.fn();
        onActionEnterStateMock = jest.fn();
        onActionEnterActionMock = jest.fn();

        onActionExitGlobalMock = jest.fn();
        onActionExitStateMock = jest.fn();
        onActionExitActionMock = jest.fn();

        actionMock = jest.fn().mockImplementationOnce(() => {return Promise.resolve(10)});

        fsm = createFSM({
          initialState: 'one',
          onActionEnter: onActionEnterGlobalMock, 
          onActionExit: onActionExitGlobalMock, 
          states: {
            'one': {
              onActionEnter: onActionEnterStateMock,
              onActionExit: onActionExitStateMock,
              actions: {
                'inc': {
                  targetState: 'two',
                  onActionEnter: onActionEnterActionMock,
                  onActionExit: onActionExitActionMock,
                  action: actionMock,
                }
              }
            },
            'two': {}
          }
        });
      });

      describe('when doAction called with an unknown action - reset', () => {
        it('should throw an exception', () => {      
          try {
            fsm.doAction('reset')
          }
          catch(e) {
            expect(e.message).toEqual('FSM: action reset doesn\'t exist');
          }
        });

        it('should not call action function', () => {      
          try {
            fsm.doAction('reset');
          }
          catch(e) {
            expect(actionMock).not.toHaveBeenCalled();
          }
        });

        describe('onActionEnter hook', () => {
          it('should not call global onActionEnter', () => {      
            try {
              fsm.doAction('reset');
            }            
            catch(e) {
              expect(onActionEnterGlobalMock).not.toHaveBeenCalled();
            }
          });

          it('should not call state onActionEnter', () => {      
            try {
              fsm.doAction('reset');
            }            
            catch(e) {
              expect(onActionEnterStateMock).not.toHaveBeenCalled();
            }
          });

          it('should not call action onActionEnter', () => {      
            try {
              fsm.doAction('reset');
            }            
            catch(e) {
              expect(onActionEnterActionMock).not.toHaveBeenCalled();
            }
          });
        });

        describe('onActionExit hook', () => {
          it('should not call global onActionExit', () => {      
            try {
              fsm.doAction('reset');
            }            
            catch(e) {
              expect(onActionExitGlobalMock).not.toHaveBeenCalled();
            }
          });

          it('should not call state onActionExit', () => {      
            try {
              fsm.doAction('reset');
            }            
            catch(e) {
              expect(onActionExitStateMock).not.toHaveBeenCalled();
            }
          });

          it('should not call action onActionExit', () => {      
            try {
              fsm.doAction('reset');
            }            
            catch(e) {
              expect(onActionExitActionMock).not.toHaveBeenCalled();
            }
          });
        });
      });

      describe('when doAction called with a known action - inc', () => {
        it('should call action function once with inc, one, two', () => {      
          fsm.doAction('inc');

          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(actionMock).toHaveBeenCalledWith('inc', 'one', 'two');          
        });

        describe('onActionEnter hook', () => {
          it('should call global onActionEnter', () => {      
            fsm.doAction('inc');

            expect(onActionEnterGlobalMock).toHaveBeenCalledTimes(1);
            expect(onActionEnterGlobalMock).toHaveBeenCalledWith('inc', 'one', 'two');
          });

          it('should call state onActionEnter', () => {      
            fsm.doAction('inc');

            expect(onActionEnterStateMock).toHaveBeenCalledTimes(1);
            expect(onActionEnterStateMock).toHaveBeenCalledWith('inc', 'one', 'two');
          });

          it('should call action onActionEnter', () => {      
            fsm.doAction('inc');

            expect(onActionEnterActionMock).toHaveBeenCalledTimes(1);
            expect(onActionEnterActionMock).toHaveBeenCalledWith('inc', 'one', 'two');
          });
        });

        describe('onActionExit hook', () => {
          it('should call global onActionExit', () => {      
            fsm.doAction('inc');

            expect(onActionExitGlobalMock).toHaveBeenCalledTimes(1);
            expect(onActionExitGlobalMock).toHaveBeenCalledWith('inc', 'one', 'two');
          });

          it('should call state onActionExit', () => {      
            fsm.doAction('inc');

            expect(onActionExitStateMock).toHaveBeenCalledTimes(1);
            expect(onActionExitStateMock).toHaveBeenCalledWith('inc', 'one', 'two');
          });

          it('should call action onActionExit', () => {      
            fsm.doAction('inc');

            expect(onActionExitActionMock).toHaveBeenCalledTimes(1);
            expect(onActionExitActionMock).toHaveBeenCalledWith('inc', 'one', 'two');
          });
        });
      });      
    });
  });
});  
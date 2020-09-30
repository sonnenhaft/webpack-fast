import { reducer, actions, selectors } from '#/redux/modules/config';

const ACTION_PREFIX = 'app/';
const ACTION_NAME = 'CONFIG';

const REQUEST = `${ACTION_PREFIX}REQUEST_${ACTION_NAME}`;
const RECEIVE = `${ACTION_PREFIX}RECEIVE_${ACTION_NAME}`;
const INVALIDATE = `${ACTION_PREFIX}INVALIDATE_${ACTION_NAME}`;

const requestAction = () => {
  return { type: REQUEST };
};

const receiveAction = payload => {
  if (typeof payload === 'undefined') {
    return { type: RECEIVE };
  }

  return { type: RECEIVE, payload };
};

const receiveErrorAction = payload => {
  if (typeof payload === 'undefined') {
    return { type: RECEIVE, error: true };
  }

  return { type: RECEIVE, payload, error: true };
};

const invalidateAction = () => {
  return { type: INVALIDATE };
};

const expectFunction = v => expect(typeof v).toEqual('function');

const exampleData = { key: 'value' };
const exampleResponse = { content: exampleData };

const serviceName = 'configuration';
const serviceFnName = 'get';

const exampleState = {
  __isError: false,
  __isFetching: false,
  __didInvalidate: false,
  content: {
    foo: 'bar'
  }
};

const RESOLVED_PROMISE = Promise.resolve();

const getService = () => {
  const serviceFn = jest.fn();
  serviceFn.mockImplementation(() => {
    return Promise.resolve(exampleResponse);
  });

  const service = {
    [serviceName]: {
      [serviceFnName]: serviceFn
    }
  };

  return service;
};

const getDispatch = () => {
  const dispatch = jest.fn();
  dispatch.mockImplementation(() => {
    return RESOLVED_PROMISE;
  });

  return dispatch;
};

describe('Redux', () => {
  describe('Modules', () => {
    describe('Config', () => {
      describe('Reducer', () => {
        it('exports a reducer function', () => {
          expectFunction(reducer);
        });

        it('returns correct initial state', () => {
          const state = reducer({}, { type: 'TEST_ACTION' });
          expect(state).toBeTruthy();

          const state2 = reducer(exampleState, { type: 'TEST_ACTION' });
          expect(state2).toEqual(exampleState);
        });

        it('handles a request action', () => {
          const state = reducer({}, requestAction());
          expect(state).toBeTruthy();
          expect(state.__isFetching).toBe(true);
          expect(state.__isError).toBe(false);
          expect(state.__didInvalidate).toBe(false);
        });

        it('handles a receive action', () => {
          const state = reducer({}, receiveAction(exampleResponse));
          expect(state).toBeTruthy();
          expect(state.__isFetching).toBe(false);
          expect(state.__isError).toBe(false);
          expect(state.__didInvalidate).toBe(false);
          expect(state.content).toBe(exampleData);
        });

        it('handles a receive error action', () => {
          const state = reducer(
            exampleState,
            receiveErrorAction(exampleResponse)
          );
          expect(state).toBeTruthy();
          expect(state.__isFetching).toBe(false);
          expect(state.__isError).toBe(true);
          expect(state.__didInvalidate).toBe(false);
        });

        it('handles an invalidate action', () => {
          const state = reducer({}, invalidateAction());
          expect(state).toBeTruthy();
          expect(state.__isFetching).toBeUndefined();
          expect(state.__isError).toBeUndefined();
          expect(state.__didInvalidate).toBe(true);
        });
      });

      describe('Actions', () => {
        it('exports an actions object', () => {
          expect(typeof actions).toEqual('object');
        });

        it('has expected actions', () => {
          expectFunction(actions.getData);
          expectFunction(actions.retry);
          expectFunction(actions.invalidate);
        });

        it('getData action', () => {
          const actionThunk = actions.getData();
          expectFunction(actionThunk);

          const dispatch = getDispatch();
          const service = getService();

          return actionThunk(dispatch, () => {}, service).then(() => {
            const dispatchCalls = dispatch.mock.calls;
            expect(dispatchCalls).toHaveLength(2);
            expect(dispatchCalls[0][0]).toEqual(requestAction('test'));

            const action = dispatchCalls[1][0];
            const expectedAction = receiveAction(RESOLVED_PROMISE);
            expect(action.type).toEqual(expectedAction.type);
            expect(typeof action.payload).toEqual(
              typeof expectedAction.payload
            );
            expectFunction(action.payload.then);

            const serviceCalls = service[serviceName][serviceFnName].mock.calls;
            expect(serviceCalls).toHaveLength(1);
            expect(serviceCalls[0][0]).toBeUndefined();
          });
        });

        it('getData action when data exists', () => {
          const actionThunk = actions.getData();
          expectFunction(actionThunk);

          const dispatch = getDispatch();
          const service = getService();

          return actionThunk(dispatch, () => exampleState, service).then(() => {
            const dispatchCalls = dispatch.mock.calls;
            expect(dispatchCalls).toHaveLength(0);

            const serviceCalls = service[serviceName][serviceFnName].mock.calls;
            expect(serviceCalls).toHaveLength(0);
          });
        });

        it('getData action when invalidated data exists', () => {
          const actionThunk = actions.getData();
          expectFunction(actionThunk);

          const dispatch = getDispatch();
          const service = getService();

          return actionThunk(
            dispatch,
            () => ({ ...exampleState, __didInvalidate: true }),
            service
          ).then(() => {
            const dispatchCalls = dispatch.mock.calls;
            expect(dispatchCalls).toHaveLength(2);
            expect(dispatchCalls[0][0]).toEqual(requestAction());

            const action = dispatchCalls[1][0];
            const expectedAction = receiveAction(RESOLVED_PROMISE);
            expect(action.type).toEqual(expectedAction.type);
            expect(typeof action.payload).toEqual(
              typeof expectedAction.payload
            );
            expectFunction(action.payload.then);

            const serviceCalls = service[serviceName][serviceFnName].mock.calls;
            expect(serviceCalls).toHaveLength(1);
            expect(serviceCalls[0][0]).toBeUndefined();
          });
        });

        it('getData action when already fetching data', () => {
          const actionThunk = actions.getData();
          expectFunction(actionThunk);

          const dispatch = getDispatch();
          const service = getService();

          return actionThunk(
            dispatch,
            () => ({ ...exampleState, __isFetching: true }),
            service
          ).then(() => {
            const dispatchCalls = dispatch.mock.calls;
            expect(dispatchCalls).toHaveLength(0);

            const serviceCalls = service[serviceName][serviceFnName].mock.calls;
            expect(serviceCalls).toHaveLength(0);
          });
        });

        it('getData action when corrupt data exists', () => {
          const actionThunk = actions.getData();
          expectFunction(actionThunk);

          const dispatch = getDispatch();
          const service = getService();

          return actionThunk(
            dispatch,
            () => ({ ...exampleState, __isError: true }),
            service
          ).then(() => {
            const dispatchCalls = dispatch.mock.calls;
            expect(dispatchCalls).toHaveLength(0);

            const serviceCalls = service[serviceName][serviceFnName].mock.calls;
            expect(serviceCalls).toHaveLength(0);
          });
        });

        it('retry action', () => {
          const actionThunk = actions.retry();
          expectFunction(actionThunk);

          const dispatch = getDispatch();
          const service = getService();

          return actionThunk(dispatch, () => {}, service).then(() => {
            const dispatchCalls = dispatch.mock.calls;
            expect(dispatchCalls).toHaveLength(3);
            expect(dispatchCalls[0][0]).toEqual(invalidateAction());
            expect(dispatchCalls[1][0]).toEqual(requestAction());

            const action = dispatchCalls[2][0];
            const expectedAction = receiveAction(RESOLVED_PROMISE);
            expect(action.type).toEqual(expectedAction.type);
            expect(typeof action.payload).toEqual(
              typeof expectedAction.payload
            );
            expectFunction(action.payload.then);

            const serviceCalls = service[serviceName][serviceFnName].mock.calls;
            expect(serviceCalls).toHaveLength(1);
            expect(serviceCalls[0][0]).toBeUndefined();
          });
        });

        it('invalidate action', () => {
          const actionThunk = actions.invalidate();
          expectFunction(actionThunk);

          const dispatch = getDispatch();

          return actionThunk(dispatch).then(() => {
            const dispatchCalls = dispatch.mock.calls;
            expect(dispatchCalls).toHaveLength(1);
            expect(dispatchCalls[0][0]).toEqual(invalidateAction());
          });
        });
      });

      describe('Selectors', () => {
        it('exports selectors', () => {
          expect(selectors).toBeTruthy();
        });

        it('has expected selectors', () => {
          const { getRootSelector, setRootSelector, getData } = selectors;

          expectFunction(getRootSelector);
          expectFunction(getRootSelector());
          expectFunction(setRootSelector);
          expectFunction(getData);
        });

        it('root selector', () => {
          const rootSelector = selectors.getRootSelector();
          const state = exampleState;
          const rootState = rootSelector(state);
          expect(state).toEqual(rootState);
        });

        it('set root selector', () => {
          const rootSelector = selectors.getRootSelector();
          const rootState = rootSelector(exampleState);
          expect(exampleState).toEqual(rootState);

          const newExampleState = { bar: 'foo' };
          selectors.setRootSelector(() => newExampleState);
          const newRootSelector = selectors.getRootSelector();
          const newRootState = newRootSelector(exampleState);
          expect(newExampleState).toEqual(newRootState);

          selectors.setRootSelector(state => state);
        });

        it('getData', () => {
          const data = selectors.getData(exampleState);
          expect(data).toEqual(exampleState);
        });
      });
    });
  });
});

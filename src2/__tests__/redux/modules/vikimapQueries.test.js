const mockQueryParser = {
  executeQuery: jest.fn()
};

jest.mock('#/redux/modules/vikimapQueries/queryParser', () => mockQueryParser);

const {
  actions,
  reducer,
  selectors
} = require('#/redux/modules/vikimapQueries');

beforeEach(() => {
  mockQueryParser.executeQuery.mockImplementation(() => Promise.resolve());
});

const ACTION_PREFIX = 'app/';
const ACTION_NAME = 'QUERY_DATA';

const REQUEST = `${ACTION_PREFIX}REQUEST_${ACTION_NAME}`;
const RECEIVE = `${ACTION_PREFIX}RECEIVE_${ACTION_NAME}`;
const INVALIDATE = `${ACTION_PREFIX}INVALIDATE_${ACTION_NAME}`;

const requestAction = payload => {
  return { type: REQUEST, payload };
};

const receiveAction = payload => {
  return { type: RECEIVE, payload };
};

const receiveErrorAction = payload => {
  return { type: RECEIVE, payload, error: true };
};

const invalidateAction = () => {
  return { type: INVALIDATE };
};

const expectFunction = v => expect(typeof v).toEqual('function');

const DATA_KEY = 'http://my.query.test';
const exampleData = { key: 'value' };
const exampleResponse = { __key: DATA_KEY, content: exampleData };

const exampleState = {
  [DATA_KEY]: {
    __isError: false,
    __isFetching: false,
    __didInvalidate: false,
    content: {
      foo: 'bar'
    }
  }
};

const RESOLVED_PROMISE = Promise.resolve();

const getService = () => {};

const getDispatch = () => {
  const dispatch = jest.fn();
  dispatch.mockImplementation(() => {
    return RESOLVED_PROMISE;
  });

  return dispatch;
};

beforeEach(() => {
  mockQueryParser.executeQuery.mockReturnValue({
    data: [],
    ovpKey: 'ovpKeyValue'
  });
});

describe('Vikimap Queries', () => {
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
      const state = reducer({}, requestAction(DATA_KEY));
      expect(state).toBeTruthy();

      expect(state[DATA_KEY]).toBeTruthy();
      expect(state[DATA_KEY].__isFetching).toBe(true);
      expect(state[DATA_KEY].__isError).toBe(false);
      expect(state[DATA_KEY].__didInvalidate).toBe(false);
    });

    it('handles a receive action', () => {
      const state = reducer({}, receiveAction(exampleResponse));
      expect(state).toBeTruthy();

      expect(state[DATA_KEY]).toBeTruthy();
      expect(state[DATA_KEY].__isFetching).toBe(false);
      expect(state[DATA_KEY].__isError).toBe(false);
      expect(state[DATA_KEY].__didInvalidate).toBe(false);
      expect(state[DATA_KEY].content).toBe(exampleData);
    });

    it('handles a receive error action', () => {
      const state = reducer(exampleState, receiveErrorAction(exampleResponse));
      expect(state).toBeTruthy();

      expect(state[DATA_KEY]).toBeTruthy();
      expect(state[DATA_KEY].__isFetching).toBe(false);
      expect(state[DATA_KEY].__isError).toBe(true);
      expect(state[DATA_KEY].__didInvalidate).toBe(false);
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

    it('getData action', async () => {
      const actionThunk = actions.getData(DATA_KEY);
      expectFunction(actionThunk);

      const dispatch = getDispatch();
      const service = getService();

      await actionThunk(dispatch, () => {}, service);

      const dispatchCalls = dispatch.mock.calls;
      expect(dispatchCalls).toHaveLength(2);
      expect(dispatchCalls[0][0]).toEqual(requestAction(DATA_KEY));

      const action = dispatchCalls[1][0];
      const expectedAction = receiveAction(RESOLVED_PROMISE);
      expect(action.type).toEqual(expectedAction.type);
      expect(typeof action.payload).toEqual(typeof expectedAction.payload);
      expectFunction(action.payload.then);

      const { calls } = mockQueryParser.executeQuery.mock;
      expect(calls).toHaveLength(1);
      expect(calls[0][0]).toBe(DATA_KEY);
    });

    it('getData action when data exists', () => {
      const actionThunk = actions.getData(DATA_KEY);
      expectFunction(actionThunk);

      const dispatch = getDispatch();
      const service = getService();

      return actionThunk(dispatch, () => exampleState, service).then(() => {
        const dispatchCalls = dispatch.mock.calls;
        expect(dispatchCalls).toHaveLength(0);

        const { calls } = mockQueryParser.executeQuery.mock;
        expect(calls).toHaveLength(0);
      });
    });

    it('getData action when invalidated data exists', () => {
      const actionThunk = actions.getData();
      expectFunction(actionThunk);

      const dispatch = getDispatch();

      return actionThunk(dispatch, () => ({
        ...exampleState,
        __didInvalidate: true
      })).then(() => {
        const dispatchCalls = dispatch.mock.calls;
        expect(dispatchCalls).toHaveLength(2);
        expect(dispatchCalls[0][0]).toEqual(requestAction());

        const action = dispatchCalls[1][0];
        const expectedAction = receiveAction(RESOLVED_PROMISE);
        expect(action.type).toEqual(expectedAction.type);
        expect(typeof action.payload).toEqual(typeof expectedAction.payload);
        expectFunction(action.payload.then);

        const { calls } = mockQueryParser.executeQuery.mock;
        expect(calls).toHaveLength(1);
        expect(calls[0][0]).toBeUndefined();
      });
    });

    it('getData action when already fetching data', () => {
      const actionThunk = actions.getData(DATA_KEY);
      expectFunction(actionThunk);

      const dispatch = getDispatch();
      const service = getService();

      return actionThunk(
        dispatch,
        () => ({
          ...exampleState,
          [DATA_KEY]: { ...exampleState[DATA_KEY], __isFetching: true }
        }),
        service
      ).then(() => {
        const dispatchCalls = dispatch.mock.calls;
        expect(dispatchCalls).toHaveLength(0);

        const { calls } = mockQueryParser.executeQuery.mock;
        expect(calls).toHaveLength(0);
      });
    });

    it('getData action when corrupt data exists', () => {
      const actionThunk = actions.getData(DATA_KEY);
      expectFunction(actionThunk);

      const dispatch = getDispatch();
      const service = getService();

      return actionThunk(
        dispatch,
        () => ({
          ...exampleState,
          [DATA_KEY]: { ...exampleState[DATA_KEY], __isError: true }
        }),
        service
      ).then(() => {
        const dispatchCalls = dispatch.mock.calls;
        expect(dispatchCalls).toHaveLength(0);

        const { calls } = mockQueryParser.executeQuery.mock;
        expect(calls).toHaveLength(0);
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
        expect(typeof action.payload).toEqual(typeof expectedAction.payload);
        expectFunction(action.payload.then);

        const { calls } = mockQueryParser.executeQuery.mock;
        expect(calls).toHaveLength(1);
        expect(calls[0][0]).toBeUndefined();
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

import React, { useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import JSONTree from 'react-json-tree';

import * as ovp from '..';

const MARGIN_LEFT = 5;

global.params = {
  getMovieById: ['aladdin'],
  getMovieCategories: [],
  getMovieData: [],
  getTvShowData: []
};

const Form = () => {
  const [ovpType, setOVPType] = useState('accedo');
  const [requestData, setRequestData] = useState({});
  const [method, setMethod] = useState('getMovieData');

  useEffect(() => {
    setRequestData({});
  }, [method]);

  return (
    <div style={{ padding: 10 }}>
      <div>
        Because the OVP has CORS enabled, you may need to open this story in a
        browser without web security.
      </div>
      <div>
        You can update the <b>window.params</b> object from the browser console
        to change the functions arguments.
      </div>
      <select value={ovpType} onChange={e => setOVPType(e.target.value)}>
        <option value="accedo">Accedo OVP</option>
        <option value="tmdb">TMDB OVP</option>
      </select>
      <button
        onClick={async () => {
          const data = await ovp[ovpType][method](...global.params[method]);

          setRequestData(data);
        }}
        style={{ marginLeft: MARGIN_LEFT }}
      >
        GET
      </button>
      <select
        value={method}
        onChange={e => setMethod(e.target.value)}
        style={{ marginLeft: MARGIN_LEFT }}
      >
        <option value="getMovieCategories">
          ovp.getMovieCategories(...window.params.getMovieCategories)
        </option>
        <option value="getMovieData">
          ovp.getMovieData(...window.params.getMovieData)
        </option>
        <option value="getTvShowData">
          ovp.getTvShowData(...window.params.getTvShowData)
        </option>
        <option value="getMovieById">
          ovp.getMovieById(...window.params.getMovieById)
        </option>
      </select>
      <div style={{ maxHeight: 300, fontSize: 20, overflow: 'auto' }}>
        <JSONTree data={requestData} />
      </div>
    </div>
  );
};

storiesOf('Services|OVP', module).add('common', () => {
  return <Form />;
});

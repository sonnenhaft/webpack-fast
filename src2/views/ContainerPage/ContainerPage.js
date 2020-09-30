import React from 'react';
import PropTypes from 'prop-types';

import Container from '#/containers/Container/Container';

const ContainerPage = ({ containers }) => (
  <div>
    {(containers || []).map((container, index) => {
      return <Container key={index} {...container} />;
    })}
  </div>
);

ContainerPage.propTypes = {
  containers: PropTypes.array
};

export default ContainerPage;

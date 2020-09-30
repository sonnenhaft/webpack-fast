import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/RaisedButton';
import map from 'lodash/map';
import Spinner from '#/components/Spinner/Spinner';

import PageTitle from '#/components/PageTitle/PageTitle';

import FailedToLoad from '../FailedToLoad/FailedToLoad';
import VikimapPage from '../VikimapPage/VikimapPage';
import styles from './vikimapDebug.scss';

const PropList = ({ props }) => {
  const list = map(props, (value, key) => (
    <tr key={key} className={styles.propRow}>
      <td>
        <span className={styles.propKey}>{key}:</span>
      </td>
      <td>
        <pre className={styles.propValue}>{value}</pre>
      </td>
    </tr>
  ));

  return (
    <div>
      <table>
        <tbody>{list}</tbody>
      </table>
    </div>
  );
};

const Item = ({
  title,
  displayText,
  id,
  action,
  actionData,
  template,
  image
}) => {
  const propList = {
    Title: title,
    'Display Text': displayText,
    ID: id,
    Action: action,
    'Action Data': actionData,
    Template: template,
    'Nr of Images': image ? image.length : 0
  };

  return (
    <div className={styles.item}>
      <div className={styles.itemTitle}>ITEM</div>
      <div className={styles.itemProps}>
        <PropList props={propList} />
      </div>
    </div>
  );
};

PropList.propTypes = {
  props: PropTypes.object
};

Item.propTypes = {
  title: PropTypes.string,
  displayText: PropTypes.string,
  id: PropTypes.string,
  action: PropTypes.string,
  actionData: PropTypes.string,
  template: PropTypes.string,
  image: PropTypes.array
};

const Container = ({ title, displayText, query, id, items, template }) => {
  const propList = {
    Title: title,
    'Display Text': displayText,
    Query: query,
    ID: id,
    'Nr of Items': items ? items.length : 0,
    Template: template
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerTitle}>CONTAINER</div>
      <div className={styles.containerProps}>
        <PropList props={propList} />
        <h3>{`Items (${items.length}):`}</h3>
        <div>
          {(items || []).map(item => (
            <Item key={item.id} {...item} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

Container.propTypes = {
  title: PropTypes.string,
  displayText: PropTypes.string,
  query: PropTypes.string,
  id: PropTypes.string,
  items: PropTypes.array,
  template: PropTypes.string
};

const Page = ({
  failedToLoad,
  errorMessage,
  loaded,
  id,
  containers,
  displayText,
  title,
  template
}) => {
  // If the Vikimap entry failed to load, failedToLoad will
  // be true. Then we'll render a page to show the error info.
  if (failedToLoad) {
    return <FailedToLoad debugInfo={errorMessage} />;
  }

  // If the page entry data hasn't been loaded yet
  // we'll simply display a spinner.
  if (!loaded) {
    return <Spinner />;
  }

  const propList = {
    ID: id,
    Title: title,
    Template: template,
    'Display Text': displayText,
    'Nr of Containers': containers ? containers.length : 0
  };

  // If we get to this point, we know that we have
  // the Vikimap page data. I.e. we have access
  // to the 'displayText', 'template' and 'containers'.
  return (
    <div>
      {displayText ? <PageTitle text={displayText} /> : ''}
      <div className={styles.page}>
        <h2>This is a Vikimap page with the following properties:</h2>
        <PropList props={propList} />
        <div className={styles.pageContainers}>
          <h2>{`Containers (${containers.length}):`}</h2>
          {(containers || []).map(container => (
            <Container key={container.id} {...container} />
          ))}
        </div>
      </div>
    </div>
  );
};

Page.propTypes = {
  containers: PropTypes.array,
  displayText: PropTypes.string,
  errorMessage: PropTypes.string,
  failedToLoad: PropTypes.bool,
  id: PropTypes.string,
  loaded: PropTypes.bool,
  template: PropTypes.string,
  title: PropTypes.string
};

class VikimapDebugPage extends React.Component {
  static fetchData = VikimapPage.fetchData;

  state = {
    debug: false
  };

  toggleDebug = () => {
    this.setState(state => ({ debug: !state.debug }));
  };

  render() {
    return (
      <div>
        <div className={styles.toggleDebug}>
          <Button
            label="Toggle Debug"
            style={{ fontWeight: 'bold' }}
            onClick={this.toggleDebug}
          />
        </div>
        <VikimapPage
          {...this.props}
          templateComp={this.state.debug ? Page : null}
        />
      </div>
    );
  }
}

export default VikimapDebugPage;

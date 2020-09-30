import React from 'react';
import map from 'lodash/map';
import Helmet from 'react-helmet';
import styles from '../views.scss';

// this should be replaced in a real project to use __FILTERED_PACKAGE_JSON__
import npmConfig from '~/package.json';

const listDependencies = dependencies => {
  let index = 0;

  return map(dependencies, (version, name) => {
    index += 1;

    const url =
      name.indexOf('vdkweb') !== 0
        ? `https://www.npmjs.com/package/${name}`
        : `https://accedobroadband.jira.com/wiki/display/VDKWEB/${name}`;

    return (
      <div key={`${index}`}>
        <a
          className="link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {name} - {version}
        </a>
      </div>
    );
  });
};

const About = () => (
  <div className={styles.pageContent}>
    <Helmet title="About" />
    <h1>About</h1>
    <div>
      <div>{npmConfig.description}</div>
      <div>Below is information listed from the application's NPM package.</div>
    </div>
    <h2>Version</h2>
    <div>{npmConfig.version}</div>
    <h2>Source Code</h2>
    <div>{npmConfig.repository.url}</div>
    <h2>Commands</h2>
    <div>
      <ul>
        {map(npmConfig.scripts, (script, command) => (
          <li key={command}>{command}</li>
        ))}
      </ul>
    </div>
    <h2>Dependencies</h2>
    <div>{listDependencies(npmConfig.dependencies)}</div>
    <h2>Dev Dependencies</h2>
    <div>{listDependencies(npmConfig.devDependencies)}</div>
  </div>
);

export default About;

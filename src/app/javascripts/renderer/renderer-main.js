(() =>{
     require('babel-register')(
          {plugins: 'transform-react-jsx'}
     );
     require('node-require-jsx').install();

     const React = require('react');
     const ReactDOM = require('react-dom');
     const MainContent = require('./components/main');

     //id: rootにMainContentクラスを入れる
     const root = document.getElementById('root');
     ReactDOM.render(React.createElement(MainContent), root);
})();

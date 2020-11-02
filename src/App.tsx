import Menu from './components/Menu';
import Page from './pages/Page';
import React from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

//pages
import Login from './pages/Login';
import AddItem from './pages/AddItem';
import Profile from './pages/Profile';
import APPLINKS from './helpers/Const';
import Catalog from './pages/Catalog';
import Settings from './pages/Settings';
import Item from './pages/Item';

const App: React.FC = () => {

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/page/:name" component={Page} exact />
            <Route path={APPLINKS.login} component={Login} exact />
            <Route path={APPLINKS.addItem} component={AddItem} exact />
            <Route path={APPLINKS.item} component={Item} exact />
            <Route path={APPLINKS.profile} component={Profile} exact />
            <Route path={APPLINKS.catalog} component={Catalog} exact />
            <Route path={APPLINKS.settings} component={Settings} exact />
            <Redirect from="/" to={APPLINKS.catalog} exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};
 
export default App;

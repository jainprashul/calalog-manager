import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  useIonViewDidEnter,
} from '@ionic/react';

import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, logOutOutline, logOutSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, settingsOutline, settingsSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import LoginAvatar from './LoginAvatar';
import { AuthUserContext } from '../context/AuthContext';
import { FirebaseContext } from '../context/FirebaseContext';
import APPLINKS from '../helpers/Const';

// interface AppPage {
//   url: string;
//   iosIcon: string;
//   mdIcon: string;
//   title: string;
// }


const appPages = [
  {
    title: 'My Catalog',
    url: APPLINKS.catalog,
    iosIcon: mailOutline,
    mdIcon: mailSharp
  },
  {
    title: 'Profile',
    url: APPLINKS.profile ,
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
  // {
  //   title: 'Favorites',
  //   url: '/page/Favorites',
  //   iosIcon: heartOutline,
  //   mdIcon: heartSharp
  // },
  // {
  //   title: 'Archived',
  //   url: '/page/Archived',
  //   iosIcon: archiveOutline,
  //   mdIcon: archiveSharp
  // },
  {
    title: 'Settings',
    url: APPLINKS.settings,
    iosIcon: settingsOutline,
    mdIcon: settingsSharp
  },
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

const Menu = () => {
  const location = useLocation();
  const firebase = useContext(FirebaseContext);
  const auth = useContext(AuthUserContext);
  const [user, setUser] = useState(firebase.getCurrentUser())
  // console.log(user);
  useEffect(() => {
    // console.log(auth);
    if (auth) {
      const user = {
        name: auth.displayName,
        email: auth.email,
        phone: auth.phoneNumber,
        photo: auth.photoURL,
        uid: auth.uid,
      }

      // console.log(user);
      setUser(user);
    }
  }, [auth])


  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>
            {user && <LoginAvatar user={user} />}
          </IonListHeader>
          {user && <IonNote>{user.email}</IonNote>}
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        {/* <IonList id="labels-list">
          <IonListHeader>Labels</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList> */}
      </IonContent>
    </IonMenu>
  );
};

export default Menu;

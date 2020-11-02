import React, { useContext, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Item.css';
import APPLINKS from '../helpers/Const';
import { FirebaseContext } from '../context/FirebaseContext';
import { checkmark, checkmarkSharp, pencilSharp, ticketSharp } from 'ionicons/icons';

const Item = ({ match }) => {
  const firebase = useContext(FirebaseContext);
  let { shop, id } = match.params;
  const [item, setItem] = useState({});
  const [liked, setLiked] = useState(false);
  const [editing, setEditing] = useState(false);

  const { photo, name, description, like } = item;
  useIonViewWillEnter(() => {
    firebase.getItem(shop, id).then(item => {
      console.log(item.data());
      setItem(item.data());
    })
  })

  function likeADD() {
    firebase.item(shop, id).update({
      like: like + 1
    })
    setLiked(true);
  }

  function shareLink() {
    if (navigator.canShare) {
      navigator.share({
        title: `${name} - Priti Jain (VidyaSagar Collection)`,
        text: `Check Out the Pattern and Collection from VidyaSagar Collection. /n Contact 8989488761`,
        url: `${window.location.href}`,
      })
        .then(() => console.log('Share was successful.'))
        .catch((error) => console.log('Sharing failed', error));
    } else {
      console.log(`Your system doesn't support sharing files.`);
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle className=''>{name}</IonTitle>

          <IonButtons slot='end'>
            {!editing ?
              <IonButton onClick={() => { setEditing(true); }}> <IonIcon icon={pencilSharp} /> </IonButton> :
              <IonButton onClick={() => { setEditing(false); }}> <IonIcon icon={checkmarkSharp} /> </IonButton>
            }
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonCard className='ion-padding ion-justify-content-center ion-text-center' >
          <img src={photo} alt="" width="360" />
          <IonCardHeader className='ion-padding'>
            <IonCardTitle>{name}</IonCardTitle>
            <p>
              <IonText>{description}</IonText>
              <p>{like} people likes this.</p>
            </p>

            <IonButton fill="outline" onClick={shareLink}>Share</IonButton>
            <IonButton fill="outline" disabled={liked} onClick={likeADD}>Like</IonButton>
          </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};


export default Item;

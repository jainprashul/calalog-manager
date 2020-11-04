import React, { useContext, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

import { Plugins } from '@capacitor/core';
import './Item.css';
import APPLINKS from '../helpers/Const';
import { FirebaseContext } from '../context/FirebaseContext';
import { checkmark, checkmarkSharp, heart, pencilSharp, ticketSharp } from 'ionicons/icons';
import withAuthorization from '../context/withAuthorization';
import ItemEdit from '../components/ItemEdit';

const { Share } = Plugins;

const Item = ({ match }) => {
  const firebase = useContext(FirebaseContext);
  let { shop, id } = match.params;
  const [item, setItem] = useState({});
  const [liked, setLiked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [shopDtl, setShopDtl] = useState({});



  const { photo, name, description, like } = item;
  useIonViewWillEnter(() => {

    firebase.getUser(shop).then(res => {
      const user = res.docs[0].data();
      // console.log(user);
      setShopDtl(user);
    })
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

    Share.share({
      title: `${name} - ${shopDtl.shop} (${shopDtl.name})`,
      url: `https://catalog-alpha.now.sh${window.location.pathname}`,
      dialogTitle: `${name} - ${shopDtl.shop} (${shopDtl.name})`,
      text: `Check Out the Pattern and Collection from ${shopDtl.shop}. \n Contact ${shopDtl.phoneNumber} \n`

    });
    // if (navigator.canShare) {
    //   navigator.share({
    //     title: `${name} - Priti Jain (VidyaSagar Collection)`,
    //     text: `Check Out the Pattern and Collection from VidyaSagar Collection. /n Contact 8989488761`,
    //     url: `${window.location.href}`,
    //   })
    //     .then(() => console.log('Share was successful.'))
    //     .catch((error) => console.log('Sharing failed', error));
    // } else {
    //   console.log(`Your system doesn't support sharing files.`);
    // }
  }

  let title = editing ? `Editing - ${name}` : name;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle className=''>{title}</IonTitle>

          <IonButtons slot='end'>
            {!editing ?
              <IonButton onClick={() => { setEditing(true); }}> <IonIcon icon={pencilSharp} /> </IonButton> :
              <IonButton onClick={() => { setEditing(false); }}> <IonIcon icon={checkmarkSharp} /> </IonButton>
            }
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        {
          editing ?
            <ItemEdit name={name} description={description} photo={photo} setEditing={setEditing} shop={shop} id={id} /> 
            :
            <IonCard className='ion-padding ion-justify-content-center ion-text-center' >
              <img src={photo} alt="" width="70%" />
              <IonCardHeader className='ion-padding'>
                <IonCardTitle>{name}</IonCardTitle>
                <p>
                  <IonText>{description}</IonText>
                  <p>{like} people likes this.</p>
                </p>

                <IonButton fill="outline" onClick={shareLink}>Share</IonButton>
                <IonButton fill="outline" disabled={liked} onClick={likeADD}>Like <IonIcon icon={heart} /></IonButton>
              </IonCardHeader>
            </IonCard>
        }
      </IonContent>
    </IonPage>
  );
};


export default withAuthorization(Item);

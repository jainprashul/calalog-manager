import React, { useState, useContext, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonLoading, useIonViewDidEnter, IonToggle, IonFooter, IonMenuButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonText } from '@ionic/react';
import { alertController } from '@ionic/core';
import withAuthorization from '../context/withAuthorization';
import { logOut, camera, personCircleOutline, settings } from 'ionicons/icons';
import { APPSTRING } from '../helpers/Const';
import { createToast, useLocalStorage, compressImage } from '../helpers/hooks';
import { FirebaseContext } from '../context/FirebaseContext';
import './Profile.css';

const Profile = ({ history }) => {
  // console.log(history);
  const firebase = useContext(FirebaseContext);

  const [currentUser, setCurrentUser] = useState({})
  const [photoUrl, setPhotoUrl] = useState(currentUser.photoUrl);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [shop, setShop] = useState(currentUser.shop);
  const [location, setLocation] = useState(currentUser.location);

  const shopUrl = `https://catalog-alpha.now.sh/${currentUser.id}`

  // console.log(currentUser);
  useIonViewDidEnter(() => {
    let uid = localStorage.getItem('uid');
    firebase.getUser(uid).then(res => {
      let user = res.docs[0].data();
      console.log(user);
      setCurrentUser(user);
      setName(user.nickname);
      setPhotoUrl(user.photoUrl);
      setEmail(user.email);
      setPhone(user.phoneNumber);
      setShop(user.shop)
      setLocation(user.location);
    });
  })

  return (
    <IonPage>
      <IonHeader>

        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className=''>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-text-center ion-padding' >
        <img className="useravatar" alt="Avatar" src={photoUrl ? photoUrl : personCircleOutline} />
        {/* <div onClick={()=>refInput.click()}><IonIcon icon={camera}></IonIcon></div>
        <div hidden={true} className="ion-hide viewWrapInputFile">
          <input
            ref={el => {
              refInput = el
            }}
            accept="image/*"
            className="viewInputFile"
            type="file"
            onChange={onChangeAvatar}
          />
        </div> */}

        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Your Website Link</IonCardSubtitle>
            <IonText><a href={shopUrl} target="_blank" >{shopUrl}</a></IonText>

            <IonButton expand='block' className='ion-padding' color='dark' shape='round'>Generate QR Code</IonButton>
          </IonCardHeader>
          <IonItem>
            <IonLabel position='stacked'>Name</IonLabel>
            <IonInput required placeholder='Name' value={name} onIonChange={(e) => setName(e.target.value)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position='stacked'>Shop Name</IonLabel>
            <IonInput required placeholder='Shop Name' value={shop} onIonChange={(e) => setShop(e.target.value)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position='stacked'>Location</IonLabel>
            <IonInput required placeholder='Location' value={location} onIonChange={(e) => setLocation(e.target.value)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position='stacked'>Phone (Whatsapp)</IonLabel>
            <IonInput required placeholder='Phone' value={phone} onIonChange={(e) => setPhone(e.target.value)}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position='stacked'>Email</IonLabel>
            <IonInput type='email' value={email} placeholder="E-mail" onIonChange={(e) => setEmail(e.target.value)}></IonInput>
          </IonItem>

          <IonCardContent>
            <IonButton fill="outline" >Update</IonButton>

          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(Profile);

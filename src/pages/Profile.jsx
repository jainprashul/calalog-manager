import React, { useState, useContext, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonLoading, useIonViewDidEnter, IonToggle, IonFooter, IonMenuButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonText } from '@ionic/react';
import { alertController, loadingController } from '@ionic/core';
import withAuthorization from '../context/withAuthorization';
import { logOut, camera, personCircleOutline, settings, pencilSharp, checkmarkSharp } from 'ionicons/icons';
import APPLINKS, { APPSTRING } from '../helpers/Const';
import { createToast, useLocalStorage, compressImage } from '../helpers/hooks';
import { FirebaseContext } from '../context/FirebaseContext';
import './Profile.css';

const Profile = ({ history }) => {
  // console.log(history);
  const firebase = useContext(FirebaseContext);

  const [editing, setEditing] = useState(false);

  const [currentUser, setCurrentUser] = useState({})
  const [photoUrl, setPhotoUrl] = useState(currentUser.photoUrl);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [shop, setShop] = useState(currentUser.shop);
  const [location, setLocation] = useState(currentUser.location);

  const shopUrl = `https://catalog-alpha.now.sh/${currentUser.id}`
  let uid = localStorage.getItem('uid');

  // console.log(currentUser);
  useIonViewDidEnter(() => {
    firebase.getUser(uid).then(res => {
      let user = res.docs[0].data();
      console.log(user);
      setCurrentUser(user);
      setName(user.name);
      setPhotoUrl(user.photoUrl);
      setEmail(user.email);
      setPhone(user.phoneNumber);
      setShop(user.shop)
      setLocation(user.location);

      document.title = `Profile - ${user.shop}`
    });
  });


  function onSubmit(e) {
    console.log(e);
    e.preventDefault();

    loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent'
    }).then((result) => { result.present() });

    firebase.user(uid).update({
        name, email, phoneNumber: phone, shop, location,
    }).then((result) => { 
      console.log(result);
      createToast('Updated successfully');
     }).catch((err) => console.log(err))
     .finally(() => loadingController.dismiss());

     setEditing(false);
  }

  return (
    <IonPage>
      <IonHeader>

        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className=''>Profile</IonTitle>
          <IonButtons slot='end'>
            {!editing ?
              <IonButton onClick={() => { setEditing(true); }} shape='round'> <IonIcon icon={pencilSharp} /> </IonButton> :
              <IonButton onClick={() => { setEditing(false); }} shape='round'> <IonIcon icon={checkmarkSharp} /> </IonButton>
            }
          </IonButtons>
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

            <IonButton expand='block' className='ion-padding' color='dark' routerLink={APPLINKS.settings} shape='round'>Generate QR Code</IonButton>
          </IonCardHeader>

          {
          editing ?
            <div className="editing">
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
            <IonButton fill="outline" onClick={onSubmit}>Update</IonButton>
          </IonCardContent>
            </div>
            :
            <div className="show ion-padding">
              <IonItem>
                <IonLabel position='stacked'>Name</IonLabel>
                <IonText>{name}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel position='stacked'>Shop Name</IonLabel>
                <IonText>{shop}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel position='stacked'>Location</IonLabel>
                <IonText>{location}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel position='stacked'>Phone (Whatsapp)</IonLabel>
                <IonText>{phone}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel position='stacked'>Email</IonLabel>
                <IonText >{email}</IonText>
              </IonItem>
            </div>
        }
          
        </IonCard>


      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(Profile);

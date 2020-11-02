import React, { useState, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonLoading, useIonViewDidEnter, IonToggle, IonFooter, IonMenuButton } from '@ionic/react';
import { alertController } from '@ionic/core';
import withAuthorization from '../context/withAuthorization';
import { logOut, camera, personCircleOutline, settings } from 'ionicons/icons';
import { APPSTRING } from '../helpers/Const';
import { createToast, useLocalStorage, compressImage } from '../helpers/hooks';
import { FirebaseContext } from '../context/FirebaseContext';
import './Profile.css';

let newAvatar = null;
let refInput;
const Profile = ({history}) => {
  console.log(history);
  const firebase = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useLocalStorage('notification', false);

  const [currentUser, setCurrentUser] = useState({
    id: localStorage.getItem(APPSTRING.ID),
    avatar: localStorage.getItem(APPSTRING.PHOTO_URL),
    nickname: localStorage.getItem(APPSTRING.NICKNAME),
    aboutMe: localStorage.getItem(APPSTRING.ABOUT_ME),
  })
  const [photoUrl, setPhotoUrl] = useState(currentUser.avatar);
  const [nickname, setNickname] = useState(currentUser.nickname);
  const [aboutMe, setAboutMe] = useState(currentUser.aboutMe);
  

  useIonViewDidEnter(() => {
    setCurrentUser({
      id: localStorage.getItem(APPSTRING.ID),
      avatar: localStorage.getItem(APPSTRING.PHOTO_URL),
      nickname: localStorage.getItem(APPSTRING.NICKNAME),
      aboutMe: localStorage.getItem(APPSTRING.ABOUT_ME),
    });
  })

  // useEffect(() => {
  //   // saveDeviceToken();
  // }, [notification])

  function onChangeAvatar(event) {
    if (event.target.files && event.target.files[0]) {
      // Check this file is an image?
      compressImage(event.target.files).then(({ photo, info }) => {
        
        const prefixFiletype = photo.type
        if (prefixFiletype.indexOf(APPSTRING.PREFIX_IMAGE) !== 0) {
          createToast('File not Image.', 'danger');
          return
        }
        newAvatar = photo.data
        console.log(URL.createObjectURL(photo.data));
        setPhotoUrl(URL.createObjectURL(photo.data));
      })
      
    } else {
      createToast('Something wrong with input file', 'danger');
    }
  };

  function uploadAvatar() {
    setLoading(true);
    if (newAvatar) {
      const uploadTask = firebase.storage
        .ref(APPSTRING.USER_PROFILE_IMAGE)
        .child(currentUser.id)
        .put(newAvatar);
      uploadTask.on(
        APPSTRING.UPLOAD_CHANGED,
        null,
        err => {
          createToast(err.message, 'danger');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log(downloadURL);
            
            updateUserInfo(downloadURL, true);
          })
        }
      )
    } else {
      updateUserInfo();
    }
  };

  function updateUserInfo(downloadURL = null, isPhotoUrl = false) {
    let newInfo;
    if (isPhotoUrl) {
      newInfo = {
        nickname, aboutMe, photoUrl: downloadURL
      }
    } else {
      newInfo = { nickname, aboutMe }
    }

    firebase.firestore.collection(APPSTRING.USERS)
      .doc(currentUser.id)
      .update(newInfo)
      .then(() => {
        localStorage.setItem(APPSTRING.NICKNAME, nickname)
        localStorage.setItem(APPSTRING.ABOUT_ME, aboutMe)
        if (isPhotoUrl) {
          localStorage.setItem(APPSTRING.PHOTO_URL, downloadURL)
        }
        setLoading(false);
        createToast('Update info success');
      })
    
  }



  return (
    <IonPage>
      <IonHeader>
      
        <IonToolbar>
        <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className=''>Profile</IonTitle>
          {/* <IonButtons slot='end'>
            <IonButton routerLink={APPLINK.settings}>
              <IonIcon slot='icon-only' icon={settings} />
            </IonButton>
          </IonButtons> */}
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-text-center ion-padding' >
        <img className="useravatar" alt="Avatar" src={photoUrl ? photoUrl : personCircleOutline} />
        <div onClick={()=>refInput.click()}><IonIcon icon={camera}></IonIcon></div>
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
        </div>
        <IonItem>
          <IonLabel position='stacked'>Nick Name</IonLabel>
          <IonInput required placeholder='Your NickName ...' value={nickname} onIonChange={(e)=> setNickname(e.target.value)}></IonInput>
        </IonItem>
        <br/>
        <IonItem>
          <IonLabel position='stacked'>About Me</IonLabel>
          <IonInput value={aboutMe} placeholder="Tell about yourself..." onIonChange={(e)=> setAboutMe(e.target.value)}></IonInput>
        </IonItem>
        <br/>
        <IonButton onClick={uploadAvatar}>Update</IonButton>
        {/* <IonButton color='danger' expand='block' onClick={deleteUser}>Delete User</IonButton> */}

        <br />
        <br />
        <br/><br/><br/>


        <IonLoading isOpen={loading}></IonLoading>
      </IonContent>
      <IonFooter>
        
      </IonFooter>
    </IonPage>
  );
};

export default withAuthorization(Profile);

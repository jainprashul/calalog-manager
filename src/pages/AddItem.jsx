import React, { useContext, useRef, useState } from 'react'
import { IonBackButton, IonButton, IonButtons, IonCard, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { compressImage, createToast } from '../helpers/hooks';
import { FirebaseContext } from '../context/FirebaseContext';
import { APPSTRING } from '../helpers/Const';
import { loadingController } from '@ionic/core';
let currentPhotoFile = null;

const AddItem = () => {

    const firebase = useContext(FirebaseContext);
    let uid = localStorage.getItem('uid');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState('');
    const [url, setUrl] = useState('');
    const [size, setSize] = useState('');
    const [loading, setLoading] = useState(false);

    const pHotoRef = useRef()

    async function uploadPhoto(){
        let uploadTask = firebase.uploadImage(currentPhotoFile, uid);

        uploadTask.on(APPSTRING.UPLOAD_CHANGED, null, err => {
            createToast(err.message)
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
                setUrl(url);
                loadingController.dismiss();
                createToast('Upload Success');

                const data = {
                    name, description, photo: url, like : 1
                }
        
                console.log(data);
        
                firebase.addItem(uid, data);
            })
        });
    }

    function onPhotoChange(e){

        console.log(e.target.files[0]);

         if (e.target.files && e.target.files[0]) {
            compressImage(e.target.files).then(({ photo, info }) => {

                currentPhotoFile = photo.data;

                console.log(currentPhotoFile);

                // currentPhotoFile = (e.target.files[0]);
                // Check this file is an image?
                const prefixFiletype = photo.type
                if (prefixFiletype.indexOf(APPSTRING.PREFIX_IMAGE) === 0) {
                    console.log(currentPhotoFile);
                    setPhoto(currentPhotoFile);
                } else {
                    createToast('This file is not an image');
                }
            })          
        }
    }

    function onSubmit(e){
        e.preventDefault();

        loadingController.create({
            message: 'Please wait...',
        }).then( controller => controller.present());
        
        uploadPhoto();
    }

    return (
        <IonPage>
        <IonHeader>
          <IonToolbar>
              <IonButtons slot='start'>
                  <IonBackButton/>
              </IonButtons>
            <IonTitle>Add IteM</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding"fullscreen>

        <IonCard>       
        <form onSubmit={onSubmit}>
            <IonItem>
                <IonLabel>Name</IonLabel>
                <IonInput type="text" id="name" value={name} required onIonChange={(e)=> {setName((e.target.value).trim())}} />
            </IonItem>
            <IonItem>
                <IonLabel>Description</IonLabel>
                <IonTextarea id='description' value={description} required onIonChange={(e)=> {setDescription((e.target.value).trim())}}></IonTextarea>
            </IonItem>
            <IonItem>
                <IonLabel>Photo Upload</IonLabel>
                <input ref={pHotoRef} type='file' id="photo" required onChange={onPhotoChange} />
            </IonItem>
            <IonButton fill='outline' type='submit'>Submit</IonButton>
                
                </form>            
        </IonCard>
        </IonContent>

        {/* <IonLoading
        cssClass='my-custom-class'
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message={'Please wait...'}
        duration={5000}
      /> */}
      </IonPage>
    )
}

export default AddItem

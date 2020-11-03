import React, { useContext } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonFooter, IonMenuButton } from '@ionic/react'
import { alertController } from '@ionic/core';
import { FirebaseContext } from '../context/FirebaseContext';
import { logOut } from 'ionicons/icons';
import withAuthorization from '../context/withAuthorization';
import { saveAs } from 'file-saver';

const Settings = () => {
    const firebase = useContext(FirebaseContext);

    document.title = 'Settings';

    function generateQRC() {
        let uid = localStorage.getItem('uid');
        const shopUrl = `https://catalog-alpha.now.sh/${uid}`
        let url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(shopUrl)}&size=`
        return url;
    }

    function signOut() {

        alertController.create({
            header: 'Sign Out !',
            subHeader: "Are you sure?",
            backdropDismiss: false,
            buttons: [{
                text: 'Yes',
                role: 'ok',
                cssClass: 'signout',
                handler: () => {
                    firebase.doSignOut();
                    localStorage.removeItem('uid');
                    // history.replace(ROUTE.signin);
                }
            },
            {
                text: 'No',
                role: 'cancel',
                cssClass: 'signout',
            }
            ]
        }).then(res => res.present());
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle title="Settings">Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'>

            <div className="ion-text-center">
            <img alt="QRCode" src={generateQRC()}></img>

            <br/>

            <IonButton fill="outline" onClick={() => { saveAs(generateQRC() , 'qrcode.png')}}>Download QR Code</IonButton> 

            </div>
        

                <div className="logout ion-padding">
                    <IonButton color="danger" expand='block' shape='round' onClick={signOut}>
                        <IonIcon icon={logOut} />
                        Log Out</IonButton>
                </div>

            </IonContent>

            <IonFooter className="ion-text-center">
                <p>
                    <span role="img" aria-labelledby="hearts">💖</span>
                    Made In India Initiative💖</p>
                <p>Developed by <a href="https://jainprashul.now.sh" rel="noopener noreferrer" target="_blank">xpJain Services</a> </p>
            </IonFooter>
        </IonPage>
    )
}

export default withAuthorization(Settings)

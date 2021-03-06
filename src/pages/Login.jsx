/* eslint-disable no-restricted-globals */
import React, { useState, useContext } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonProgressBar, IonButton, IonIcon, useIonViewDidEnter, useIonViewWillEnter, useIonViewDidLeave, IonInput, IonItem, IonLabel } from '@ionic/react'
import { logoGoogle } from 'ionicons/icons';
import { FirebaseContext } from '../context/FirebaseContext';
import { createToast, useRouter, useMenuHide} from '../helpers/hooks';
import {loadingController } from '@ionic/core'
import { APPSTRING } from '../helpers/Const';

let deferredPrompt;
let verifyPhoneNum;

const Login = () => {

    const firebase = useContext(FirebaseContext);
    let router = useRouter();
    const [installHide, setInstallHide] = useState(true);
    const [phoneNo, setPhoneNo] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [loadin, setLoadin] = useState(false)

    useIonViewWillEnter(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // e.preventDefault();
            deferredPrompt = e;
            setInstallHide(false);
        });

        window.addEventListener('appinstalled', (event) => {
            console.log('👍', 'appinstalled', event);
        });
    })

    useIonViewDidEnter(() => {

    })

    useIonViewDidLeave(() => {
        console.log('login page out');
    })

    useMenuHide();


    const [loading, setLoading] = useState(false);
    const [, setError] = useState(null);


    function signIn(doSignInWith) {
        setLoading(true);
        doSignInWith.then(async res => {
            let user = res.user;
            if (user) {                
                const result = await firebase.getUser(user.uid);
                // console.log(result);
                if (result.docs.length === 0) {
                    setNewUserData(user).then((res) => {
                        // localStorage.setItem('userData', JSON.stringify(res));
                        localStorage.setItem('uid', res.id);

                    })

                    router.replace('/profile', {user : res , userData: user})

                    location.replace('/profile');
                } else {
                    let { id } = result.docs[0].data();
                        
                    // // save to local
                    localStorage.setItem('uid', id);
                    // localStorage.setItem(AppString.NICKNAME, nickname);
                    // localStorage.setItem(AppString.PHOTO_URL, photoUrl);
                    // localStorage.setItem(AppString.ABOUT_ME, aboutMe);

                    setTimeout(() => {
                    router.replace('/', {user: result.docs[0].data()});
                    location.replace('/');  
                    })
                }
                createToast("Login Sucess..")
                // await saveDeviceToken();
                setLoading(false);
                setError(null);

                // eslint-disable-next-line no-restricted-globals
            }

        }).catch(err => {
            console.log(err);
            setLoading(false); 
            setError(err.message)
        })
    }

    async function setNewUserData(userData) {

        console.log(userData);
        let name = userData.phoneNumber ? userData.phoneNumber : userData.displayName
        let photoURL = userData.photoURL ? userData.photoURL : 'https://image.flaticon.com/icons/svg/847/847969.svg'
        const newUser = {
            id: userData.uid,
            email: userData.email,
            name: name,
            shop: '',
            location: '',
            photoUrl: photoURL,
            phoneNumber: userData.phoneNumber
        }
        await firebase.user(userData.uid).set(newUser);
        return newUser
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{APPSTRING.APP_NAME}</IonTitle>
                </IonToolbar>
                <IonProgressBar hidden={!loading || !loadin} type='indeterminate'></IonProgressBar>

            </IonHeader>
            <IonContent className='ion-margin ion-padding ion-text-center'>
                <IonButton hidden={installHide} color='dark' expand='full' onClick={() => {
                    const p = deferredPrompt;
                    if (!p) { return }
                    p.prompt();
                    p.userChoice.then(() => setInstallHide(true));

                }} >Install App</IonButton>
                <IonCard sizeMd='10' className='ion-padding ion-text-center'>
                    <IonCardHeader> 
                        <IonTitle>Log In</IonTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonButton disabled={loading} onClick={() => { signIn(firebase.doSignInWithGoogle()) }} size='default' expand='block'>Sign IN with  <IonIcon icon={logoGoogle} /></IonButton>
                        {/* or
                        <IonButton disabled={loading} onClick={()=>{signIn(firebase.doSignInWithFacebook())}} size='default' expand='block'>Sign IN with  <IonIcon icon={logoFacebook} /></IonButton>
                        {error && <IonText class='red-text' >{error}</IonText>} */}
                    </IonCardContent>
                </IonCard>
                or
                <IonCard sizeMd='10' className='ion-padding ion-text-center'>
                    <IonCardHeader>
                        <IonTitle>Log In With Phone</IonTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div hidden={showVerification}>
                            <IonItem>
                                <IonLabel position='stacked'>Phone</IonLabel>
                                <IonInput placeholder="Phone Number" value={phoneNo} type='number' debounce={800} onIonChange={(e) => setPhoneNo(e.target.value)} ></IonInput>
                            </IonItem>
                            <div id='recaptcha_verifier'></div>
                            <IonButton  disabled={loadin} onClick={() => {
                                setLoadin(true)
                                loadingController.create({
                                    message: 'Signing In ..',
                                    spinner: 'dots',
                                    animated: true
                                }).then(r => r.present());
                                var appVerifier = new firebase.app.auth.RecaptchaVerifier(
                                    'recaptcha_verifier', { 
                                        'size': 'invisible',
                                        'callback': function (response) {
                                            // reCAPTCHA solved, allow signInWithPhoneNumber.
                                            console.log('success', response);                      
                                        }
                                    });

                                firebase.doSignInWithPhoneNumber('+91' + phoneNo, appVerifier).then(async (confirmationRes) => {
                                    loadingController.dismiss();
                                    verifyPhoneNum = confirmationRes;
                                    setShowVerification(true)
                                })
                            }} size='default' >Login</IonButton>
                        </div>
                        
                        <div hidden={!showVerification}>
                            <IonItem>
                                <IonLabel position='stacked'>Code</IonLabel>
                                <IonInput placeholder="Code" value={verifyCode} type='number' debounce={800} onIonChange={(e) => setVerifyCode(e.target.value)} ></IonInput>
                            </IonItem>
                            <IonButton disabled={loading} onClick={() => {
                                signIn(verifyPhoneNum.confirm(verifyCode))
                            }} size='default' >Verify</IonButton>
                        </div>
                        
                    </IonCardContent>
                </IonCard>

            </IonContent>
        </IonPage>
    )
}

export default Login

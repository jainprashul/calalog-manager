import { IonAvatar, IonItem, IonLabel } from '@ionic/react';
import React, { useContext } from 'react'
import { AuthUserContext } from '../context/AuthContext';

const LoginAvatar = ({user}) => {

    const { photo, name } = user;
    return (
        
            <IonItem>
            <IonAvatar slot='start'>
                <img src={photo} alt="" />
            </IonAvatar>
            <IonLabel>{name}</IonLabel>
            </IonItem>

        
    )
}

export default LoginAvatar

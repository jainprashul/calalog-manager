import { IonAvatar, IonCard, IonCardHeader, IonCardSubtitle, IonCol, IonImg, IonItem, IonLabel } from '@ionic/react'
import React from 'react'

const CatalogItem = ({ item }) => {
    let shop = localStorage.getItem('uid')
    const { name, description, id, photo } = item;
    let url = `/${shop}/item/${id}`;
    // console.log(item);
    return (
        <IonCol size-sm size='12' sizeMd='4'>
            <IonCard className='ion-padding ion-justify-content-center ion-text-center' href={url}>
                <img src={photo} alt="" width="360" />
            <IonCardHeader>
            
            </IonCardHeader>
            </IonCard>
        </IonCol>
    )
}

export default CatalogItem

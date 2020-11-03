import React, { useContext, useState } from 'react';
import { IonButtons, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import './Catalog.css';
import { FirebaseContext } from '../context/FirebaseContext';
import CatalogItem from '../components/CatalogItem';
import withAuthorization from '../context/withAuthorization';
import { addCircleOutline, arrowForwardCircle } from 'ionicons/icons';
import APPLINKS from '../helpers/Const';

const Catalog = ({location}) => {
    // console.log(location);
  const firebase = useContext(FirebaseContext)
  const [items, setItems] = useState([])

  useIonViewDidEnter(()=> {
    let uid = localStorage.getItem('uid');
    firebase.getCatalog(uid).then(async (res) => {
      let arr = [];
      const docs = await res.docs;
      docs.forEach((doc) => {
        let data  = doc.data();
        data.id = doc.id
        arr.push(data )
      })

      setItems(arr);
      // console.log(res);
    })
  })

  const CatalogItems = items.map((item, i) => (
    <CatalogItem key={i}  item={item} />
  ));


  return (
    <IonPage>
      <IonHeader>
      
        <IonToolbar>
        <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className=''>My Catalog</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        {/* <h2 className="ion-title ion-text-center">Kurti Designs</h2> */}
        <IonGrid>
          <IonRow>
            {items.length ? CatalogItems : 
            <p class="ion-text-center ">
                <IonText >Add your items to the catalog here...</IonText>
            </p>}
          </IonRow>
        </IonGrid>

      {/*-- fab placed to the bottom end --*/}
      <IonFab vertical="bottom" horizontal="end" slot="fixed" transparent>
          <IonFabButton href={APPLINKS.addItem} >
            <IonIcon size="large" icon={addCircleOutline} />
          </IonFabButton>
        </IonFab>
      
      </IonContent>
    </IonPage>
  );
};

export default withAuthorization(Catalog);

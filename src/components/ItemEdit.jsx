import { IonButton, IonCard, IonInput, IonItem, IonTextarea } from '@ionic/react'
import React, { useContext, useState } from 'react'
import { FirebaseContext } from '../context/FirebaseContext';
import { createToast } from '../helpers/hooks';

const ItemEdit = ({ name, description, photo, setEditing, shop, id }) => {

    const firebase = useContext(FirebaseContext);
    const [Name, setName] = useState(name);
    const [Description, setDescription] = useState(description);
    const [Photo, setPhoto] = useState(photo);

    function updateItem(){
        const data = {
            name: Name,
            description: Description,
        }

        console.log(data);

        firebase.item(shop, id).update(data).then((res) => {
            console.log(res);
            createToast('Updated successfully');

            setEditing(false);
            // eslint-disable-next-line no-restricted-globals
            location.reload();
        }).catch((err) => {console.log(err);});

    }


    return (
        <div>
            <IonCard className='ion-padding ion-justify-content-center ion-text-center'>
            <img src={Photo} alt="" width="70%" />
            <IonItem>
                <h2>
            <IonInput type='text' placeholder='Item Name' value={Name} onIonChange={(e) => { setName((e.target.value)) }} />

                </h2>
            </IonItem>

            <IonItem>
            <IonTextarea type='text' placeholder='Item Description' autoGrow value={Description} onIonChange={(e) => { setDescription((e.target.description)) }} />
            </IonItem>
            {/* <IonInput type='text' placeholder='Item Name' value={name} onIonChange={(e)=>{setName((e.target.value).trim())}} /> */}

            <input type='file' className='ion-hide' />

            <IonButton fill='outline' onClick={updateItem}>Update</IonButton>
        </IonCard>
        </div>
    )
}

export default ItemEdit

import { createContext } from "react";
import React from 'react'
import Firebase from "../components/firebase";
export const FirebaseContext = createContext();

let firebase = new Firebase();

const FirebaseContextProvider = (props) => {
    return (
        <FirebaseContext.Provider value={firebase}>
            {props.children}
        </FirebaseContext.Provider>
    )
}


export default Firebase;
export { FirebaseContextProvider }


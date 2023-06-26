import React from 'react'
import { VerifyPin } from './verifyPin';


export const UpdatePin = ({navigation}) => {
    return (
        <>
            <VerifyPin
                isVisible={true} 
                closePinScreen={() => navigation.goBack(null)} 
                action={() =>  navigation.navigate('CreatePin') } 
            />
        </>
    )
};
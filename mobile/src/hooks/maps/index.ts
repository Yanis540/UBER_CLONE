
import {BottomSheetModal as GorhomBottomSheetModal,} from '@gorhom/bottom-sheet';
import { useRef , useCallback } from 'react';




export const useBottomSheetModalSelectedMarkerOnMap=<T> ()=>{
    const bottomSheetModalRef = useRef<GorhomBottomSheetModal>(null);
    const selectedRef = useRef<T|undefined>();
    const handlePresentModalPress =(selected_data ?: T ) => {
        selectedRef.current = selected_data; 
        bottomSheetModalRef.current?.present();
    };

    return {
        bottomSheetModalRef : bottomSheetModalRef, 
        selectedRef : selectedRef, 
        presentModal : handlePresentModalPress
    }
}


// saint michelle - libanais 
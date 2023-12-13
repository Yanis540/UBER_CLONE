import {ReactNode, useRef,useMemo} from 'react';
import { Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import { SharedValue } from 'react-native-reanimated';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { BottomSheetBackdrop,  } from '@gorhom/bottom-sheet';

interface BottomSheetProps {
    ref_sheet ?: React.RefObject<BottomSheetMethods>
    canClose ?: boolean
    children : ReactNode
    snapPoints ?: (string | number)[] | SharedValue<(string | number)[]>
    backgroundStyle ? : StyleProp<Omit<ViewStyle, "bottom" | "left" | "position" | "right" | "top">>
};

function BottomSheet({ref_sheet,children,snapPoints:snapPointsProp,canClose=false,backgroundStyle}:BottomSheetProps) {
    const bottomSheetRef = useRef<GorhomBottomSheet>(null);
    const handleClose = ()=>{
        bottomSheetRef?.current?.close()
    }
    // variables
    const snapPoints = useMemo(() => snapPointsProp||["1%",'50%'], []);

    return (
    <GorhomBottomSheet
        ref={ref_sheet || bottomSheetRef}
        index={0}
        style={styles.bottomSheet}
        backgroundStyle={backgroundStyle??{}}
        snapPoints={snapPoints}
        animateOnMount={true}
        detached={true}
        enablePanDownToClose={canClose}
        enableOverDrag={true}
        backdropComponent={props => (<BottomSheetBackdrop {...props}
            opacity={0.5}
            enableTouchThrough={false}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }, StyleSheet.absoluteFillObject]} />)
        }
    >
        {children}
    </GorhomBottomSheet>
    )
};

export default BottomSheet;
const styles = StyleSheet.create({
    bottomSheet:{
        backgroundColor: 'white',  // <==== HERE
        // borderRadius: 24,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 20,
        },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 10,
    }
}) 
import {ReactNode, useRef,useMemo} from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { SharedValue } from 'react-native-reanimated';
import {
    BottomSheetModal as GorhomBottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
interface BottomSheetProps {
    ref_sheet ?: React.RefObject<GorhomBottomSheetModal>
    canClose ?: boolean
    children : ReactNode
    snapPoints ?: (string | number)[] | SharedValue<(string | number)[]>
    backgroundStyle ? : StyleProp<Omit<ViewStyle, "bottom" | "left" | "position" | "right" | "top">>
};

function BottomSheetModal({ref_sheet,children,snapPoints:snapPointsProp,canClose=false,backgroundStyle}:BottomSheetProps) {
    const bottomSheetModalRef = useRef<GorhomBottomSheetModal>(null);
    // variables
    const snapPoints = useMemo(() => snapPointsProp||["25%",'50%'], []);

    return (

    <BottomSheetModalProvider >
        <GorhomBottomSheetModal
            ref={ref_sheet || bottomSheetModalRef}
            style={styles.bottomSheet}
            index={0}
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
        </GorhomBottomSheetModal>
    </BottomSheetModalProvider>
    )
};

export default BottomSheetModal;
const styles = StyleSheet.create({
    bottomSheet:{
        backgroundColor: 'white',  // <==== HERE
        // borderRadius: 24,
        shadowColor: '#000000',
        shadowOffset: {
          width: 1000,
          height: 20,
        },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 10,
    }
}) 

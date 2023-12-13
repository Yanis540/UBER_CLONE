import {ReactNode} from 'react';
import { Keyboard ,TouchableWithoutFeedback} from 'react-native'

interface KeyboardLayoutProps {
    children:ReactNode
};

function KeyboardLayout({children}:KeyboardLayoutProps) {
    return (
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
    
        {children}
    </TouchableWithoutFeedback>
    );
};

export default KeyboardLayout;
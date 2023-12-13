import React, { ReactNode } from 'react';
import { Text, View } from 'react-native'

interface HeaderProps {
    children : ReactNode
    className ?: string 
};

function Header({children,className}:HeaderProps) {
    return (
        <View className={`flex flex-row py-2  border-b border-b-gray-100 ${className}`}>
           {children}
        </View>
    );
};

export default Header;
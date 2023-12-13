import Constants from "expo-constants";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// import * as Updates from "expo-updates";
import { useCallback, useEffect, useMemo, useState , ReactNode} from "react";
import {Animated,StyleSheet,View,} from "react-native";
import { useLocation } from "../../hooks";
import { useToast } from "react-native-toast-notifications";
SplashScreen.preventAutoHideAsync().catch((err)=>{});
function SplashScreenAnimationLayout({ children, image={uri:"assets/uber.jpg"} }:{children:ReactNode,image?:{uri:string}}) {
    const [isSplashReady, setSplashReady] = useState(false);
  
    useEffect(() => {
      async function prepare() {
        // await Asset.fromURI(image.uri).downloadAsync();
        setSplashReady(true);
      }
  
      prepare();
    }, [image]);
  
    if (!isSplashReady) {
      return null;
    }
  
    return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}
export default SplashScreenAnimationLayout
function AnimatedSplashScreen({ children, image }:{children:ReactNode,image:{uri:string}}) {
    const [loadedFonts]=useFonts({'uber': require('../../../fonts/uber/uber.otf'), });
    // const {location,error:errorLocation} = useLocation(); 
    const animation = useMemo(() => new Animated.Value(1), []);
    const [isAppReady, setAppReady] = useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
    const toast= useToast()          
    const onImageLoaded = useCallback(async () => {
        try {
            await SplashScreen.hideAsync();
            // Load stuff
            await Promise.all([]);
        } catch (e) {
        // handle errors
        } finally {
            setAppReady(true);
            }
    }, []);

    useEffect(() => {
        if (isAppReady && loadedFonts ) {
            Animated.timing(animation, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => setAnimationComplete(true));
        }
       
    }, [isAppReady,loadedFonts]);
    return (
    <View style={{ flex: 1 }}>
        {isAppReady && children}
        {!isSplashAnimationComplete && (
            <Animated.View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: Constants?.expoConfig?.splash?.backgroundColor,
                        opacity: animation,
                    },
                ]}
            >
            <Animated.Image
                style={{
                width: "100%",
                height: "100%",
                resizeMode: Constants?.expoConfig?.splash?.resizeMode || "contain",
                transform: [
                    {
                        scale: animation,
                    },
                ],
                }}
                source={image}
                onLoadEnd={onImageLoaded}
                fadeDuration={0}
            />
            </Animated.View>
        )}
    </View>
    );
}

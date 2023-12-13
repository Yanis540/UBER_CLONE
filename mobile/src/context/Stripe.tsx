import  { ReactNode } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLIC_KEY } from '../env';
interface StripeProps {
    children:ReactNode
};

function Stripe({children}:StripeProps) {
    return (
    <StripeProvider
      publishableKey={STRIPE_PUBLIC_KEY!}
      // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
    <>
      {children}
    </>
    </StripeProvider>
    );
};

export default Stripe;
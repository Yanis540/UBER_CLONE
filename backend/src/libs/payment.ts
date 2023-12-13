import { User } from '@prisma/client';
import Stripe from 'stripe';
import { stripe } from './stripe';
type CreatePaymentIntent = {
    user: User, 
    total : number 
    currency ?: string 
}
interface PaymentStrategy<T> {
    createPaymentIntent({user,total,currency}:CreatePaymentIntent): Promise<T>;
    validatePaymentIntent(paymentIntentId: string): Promise<boolean>;
    cancelPaymentIntent(paymentIntentId: string): Promise<void>;
    refundPaymentIntent(paymentIntentId : string): Promise<any|null>
    cancelRefundPaymentIntent(paymentIntentId : string) : Promise<any|null>
    // Add other methods related to payment handling if needed
}



export class StripePayment implements PaymentStrategy<StripePaymentIntentResult> {
    private stripe: Stripe;
    constructor() {
        this.stripe = stripe; 
    }
    async createPaymentIntent({user,total,currency}:CreatePaymentIntent): Promise<StripePaymentIntentResult> {
        // await stripe.customers.search()
        const customer = await this.stripe.customers.create((user as any)?.email?{email:(user as any)?.email}:{});
        //! Create a new payment intent 
        const ephemeralKey = await this.stripe.ephemeralKeys.create(
            {customer: customer.id},
            {apiVersion: '2022-11-15'}
        );
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount:Math.round(total *100),
            currency: "usd",
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return {
            paymentIntent,
            ephemeralKey, 
            customer
        }
    }

    async validatePaymentIntent(paymentIntentId: string): Promise<boolean> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent.status === 'succeeded';
        } catch (error) {
        // Handle error, return false, or throw an appropriate exception.
            return false;
        }
    }
    async cancelPaymentIntent(paymentIntentId:string):Promise<void>{
        await stripe.paymentIntents.cancel(paymentIntentId); 
    }
    async refundPaymentIntent(paymentIntentId:string):Promise<Stripe.Refund|null>{
        try{
            return await stripe.refunds.create({
                payment_intent:paymentIntentId
            })
        }
        catch(err:any){
            return null; 
        }
    }
    async cancelRefundPaymentIntent(paymentIntentId:string):Promise<Stripe.Refund|null>{
        try{
            return await stripe.refunds.cancel(paymentIntentId)
        }
        catch(err:any){
            return null; 
        }
    }
}

export class Payment <T>{
    private paymentStrategy: PaymentStrategy<T>;
    constructor(paymentStrategy: PaymentStrategy<T>) {
        this.paymentStrategy = paymentStrategy;
    }
    async createPaymentIntent({user,total,currency}:CreatePaymentIntent): Promise<T> {
        return this.paymentStrategy.createPaymentIntent({user,total, currency});
    }
    async validatePaymentIntent(paymentIntentId: string): Promise<boolean> {
        return this.paymentStrategy.validatePaymentIntent(paymentIntentId);
    }
    async cancelPaymentIntent(paymentIntentId:string):Promise<void> {
        return this.paymentStrategy.cancelPaymentIntent(paymentIntentId);
    }
    async refundPaymentIntent(paymentIntentId:string):Promise<any|null> {
        return this.paymentStrategy.refundPaymentIntent(paymentIntentId);
    }
    async cancelRefundPaymentIntent(paymentIntentId:string):Promise<any|null> {
        return this.paymentStrategy.cancelRefundPaymentIntent(paymentIntentId);
    }

}
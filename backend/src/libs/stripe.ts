

const stripe = global.stripe_instance|| require("stripe")(process.env.STRIPE_SECRET, {
    apiVersion: '2022-11-15', // Adjust the version as per your requirements
});
global.stripe_instance ||= stripe ; 
export {
    stripe
}
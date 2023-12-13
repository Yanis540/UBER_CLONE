/*





!   Driver Cars : 
todo        -   view cars 
todo        -   add a new car  
todo        -   select current car   


!   Comment : 
?           -   Push notifications for driver when someone comments  
?           -   Push notifications for user when someone likes a comment   
!   add ride : 
?           -   Push notifications (events > driver )
!   includeUser : 
?           -   rides of the driver are actually the rides where the driver is in progress / accepted any other one 

?   ################################ FINISHED ################################



!   IMPORTANT : 
?           -   Add a Car Table (car_id, car_model, car_type )   
?           -   move car to a table 
?           -   crud-user : modify type of photo to be either a string or accepts cloud string  



!   Rides / Drivers / Comments  : ratings.length == 0 | 1 
?           -   Contains : user (req) rating if rated him or not 
!   Comments : liked_by.length == 0| 1 (same reason)


!   Driver 
?           -  Get Driver profile 

!   Comment : 
?           -   Add comment 
?           -   Remove Comment  
?           -   Like Comment   
 
!   ride-status : 
?           -   Push notifications for ride status (events > user )
?           -   send socket to the user  when : accepted/started/finished/cancelled  
?           -   send socket to the user  when : accepted/started/finished/cancelled  
!   add ride : 
?           -   send socket to the drivers in vicinity


!   Driver : 
?       -   add status (as available or not for a ride )








!   ADDING PAYMENT GATEWAY 
?   to modify 
!       -   change-ride-payment-method : update_payment_cash_to_card   , update_payment_card_to_cash
!       -   add-ride : create_cash_ride  

?       - REFACTOR RIDE PAYMENT ETC 
?       -   make more place to integrate more payment gateways 
?           - Add a class for that    
!   better understand the payment : 
?       - Credit Card : 
?           -   user hits the /stripe/payment-intent endpoint 
?           -   a ride is then created directly on the SERVER   
?           -   User whenever they want clicks on button to pay (Pop Up )
?           -   After Payment we hit the /payment-intent/validate to validate the payment on the Server 
?           -   After payment the ride is validated by the driver at the end when  



*/

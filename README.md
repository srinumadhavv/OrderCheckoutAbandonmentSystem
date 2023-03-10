# OrderCheckoutAbandonmentRecoverySystem
A Serverless implementation of Application to notify users about the items that are added to checkout screen but not yet ordered
## Problem Statement:

In All the Ecommerce Platforms Majority of people tend to leave items in cart without ordering , To bring back such customers we need to send a notification to them in-order to get back to the order . The notification must be sent T+30 min , T+1 day , T+ 3 days . The notification schedule might be configurable.

## Design Approach:

### Architecture Diagram:
![Screenshot 2023-03-10 at 12 43 23 PM](https://user-images.githubusercontent.com/43718077/224310047-a78e74d2-3123-42f7-b6f2-4f83ecda375e.png)

### Design Decisions:

I have used Serverless Framework for the Application, used AWS as a cloud service provider, considered using DynamoDb as a Database and SES for Email communication.

As the Events doesnt occur every time I have used serverless instead of a regular server to reduce costs  as the lambda is only billed for the execution time whereas we pay for the Server in server based deployment. I have choosen Amazon Dynamodb for irregular scheduled events because Dynamodb supports TTL (Time to Live) feature which deletes the item after the TTL expires and i have used streams to trigger a Lambda which uses SES(Simple Email Service) to send an Email . 

### Operation Flow:

Whenever an checkout Event happens in our case if a customer adds an item to checkout screen we will be storing the order_id of the event into Dyanamodb with TTL (Time to Live) enabled . which deletes the items after the TTL is expired . Using Dynamodb streams we trigger a lambda which will send an email to the customer .

Whenever an order Event happens , we check if any of the order_id events are existing in our database and if they exist we delete the items and send an email to the customer with proper message
Note: For simplicity we have two end-points /checkout and /order which simulates the behaviour of checkout and order screens respectively instead of checkout and order as services having their own responsibilities. 
### Design Compromises:

I have considered using Dynamodb with TTL and streaming Events with Dynamodb Streams , Dynamodb doesn’t guarentee the deletion of the item immediately after the TTL expires , the resultant deletion might take upto 48 hrs . But the Business use case doesnt need the on point delivery , it is a way to remember the customer to get back to the checkout screen to order , for which i have considered using Dynamodb with TTL and streams for irregular scheduling of events. If we want point in time delivery we can use Mongodb which guarentees the deletion of object after the TTL expires.

## Further Improvements :

We have not considered the current implementation of the system at scale , If all the events are processed by the same lambda the lambda concurrency can be easily throttled , so keeping that in view we can add a message broker or queue service in front of each lambda to handle the events and also we can have DLQ’s (Dead Letter Queue) which can be used to handle failed events . And also for email service we can have a queue which invokes email service and send emails respectively based on the type of event.

### Improved Design Architecture:
![Screenshot 2023-03-09 at 2 50 08 PM](https://user-images.githubusercontent.com/43718077/224306443-7c73ba92-ee22-431f-bb9a-9c47013c2939.png)

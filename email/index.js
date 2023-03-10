import { send_email } from "./helper.js";
export const handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));
  for (let record of event.Records) {
    console.log("DynamoDB Record: %j", record.dynamodb);
    if (
      record.eventName === "REMOVE" &&
      event.Records[0]?.userIdentity?.type === "Service" &&
      event.Records[0]?.userIdentity?.principalId === "dynamodb.amazonaws.com"
    ) {
      await send_email(
        record.dynamodb.Keys.email.S,
        "ITEMS WAITING IN CART",
        "YOU ARE HAVING SOME AMAZING ITEMS IN YOUR CART WHICH MIGHT BE OUT OF STOCK SOON..."
      ).catch((err) => {
        console.log("mail not sent" + err.message);
      });
    }
  }
  console.log("SUCCESSFULLY PROCESSED");
  return;
};

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { get_abandoned_checkout_data } from "../data/AbandonedCheckout.js";
import { send_email } from "../email/helper.js";

// Set the AWS Region.
const REGION = process.env.REGION; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const ddb = new DynamoDBClient({ region: REGION });

const order = async (req, res) => {
  try {
    // ? PLACEHOLDER FOR Some Processing of Order Functionality
    let { order_id, email_id } = req.body;
    const params = {
      RequestItems: {
        AbandonedCheckoutTable: [
          {
            DeleteRequest: {
              Key: {
                order_id: { S: order_id + "_A" },
                email: { S: email_id },
              },
            },
          },
          {
            DeleteRequest: {
              Key: {
                order_id: { S: order_id + "_B" },
                email: { S: email_id },
              },
            },
          },
          {
            DeleteRequest: {
              Key: {
                order_id: { S: order_id + "_C" },
                email: { S: email_id },
              },
            },
          },
        ],
      },
    };
    const data = await ddb.send(new BatchWriteItemCommand(params));
    console.log("Success, items Deleted", data);
    // * Send an email
    await send_email(
      email_id,
      "ORDER STATUS",
      "HI THERE, YOU HAVE SUCCESSFULLY PLACED AN ORDER"
    ).catch((err) => {
      console.log("mail not sent" + err.message);
    });
    return res.status(200).send({ msg: "Successfully Ordered" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "Bad Request" });
  }
};

const checkout = async (req, res) => {
  try {
    // ? PLACEHOLDER FOR Some Processing of Checkout Functionality
    let { email_id } = req.body;
    const bodyData = get_abandoned_checkout_data(email_id);
    const created_at = bodyData.created_at;
    const id = bodyData.id;
    const params = {
      RequestItems: {
        AbandonedCheckoutTable: [
          {
            PutRequest: {
              Item: {
                order_id: { S: id + "_A" },
                email: { S: bodyData.email },
                ttl: {
                  N: String(
                    created_at +
                      Number(process.env.NOTIFICATION_1_TIME_INTERVAL)
                  ),
                },
              },
            },
          },
          {
            PutRequest: {
              Item: {
                order_id: { S: id + "_B" },
                email: { S: bodyData.email },
                ttl: {
                  N: String(
                    created_at +
                      Number(process.env.NOTIFICATION_2_TIME_INTERVAL)
                  ),
                },
              },
            },
          },
          {
            PutRequest: {
              Item: {
                order_id: { S: id + "_C" },
                email: { S: bodyData.email },
                ttl: {
                  N: String(
                    created_at +
                      Number(process.env.NOTIFICATION_3_TIME_INTERVAL)
                  ),
                },
              },
            },
          },
        ],
      },
    };
    const data = await ddb.send(new BatchWriteItemCommand(params));
    console.log("Success, items inserted", data);
    return res
      .status(200)
      .send({ msg: "Successfully added to cart", order_id: id });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ msg: "Bad Request" });
  }
};

export { checkout, order };

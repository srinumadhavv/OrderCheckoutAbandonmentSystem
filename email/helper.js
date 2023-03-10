import AWS from "aws-sdk";

const SES = new AWS.SES();

export const send_email = async (
  to,
  subject,
  html
) => {
  const params = {
    Source: "srinumadhav36@gmail.com",
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html
      }
    },
      Subject: { 
        Charset: "UTF-8",
        Data: subject
      }
    },
  };

  try {
    console.log("mail func");
    const response = await SES.sendEmail(params).promise();
    console.log("email response", response);
    return Promise.resolve(response);
  } catch (error) {
    console.log("mail_error", error);
    return Promise.reject(error);
  }
};

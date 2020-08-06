import * as functions from 'firebase-functions';
import axios from "axios";
import * as emailCredentials from "./config/email.json";
import * as nodemailer from "nodemailer";


export const replaceCurseWords = functions.database.ref("/comments/{pushId}").onWrite(((snapshot, context) => {
    const original = snapshot.after.val();
    const curseWordsList = ["fuck", "shit", "ass", "dick"];
    const text: string = original.comment;
    const isCurseWordExist = curseWordsList.some((item) => text.includes(item));
    return snapshot.after.ref.set({comment: isCurseWordExist ? "Comment was blocked because of curse words!" : text});
}))

export const onDeleteComment = functions.database.ref("/comments/{pushId}").onDelete(((snapshot, context) => {
    console.log(`Comment #${context.params.pushId} was deleted!`)
}))

export const generateRandom = functions.https.onCall(() => {
    const number = Math.round(Math.random() * 100);
    return String(number);
})

export const fetchEmployees = functions.https.onCall(async () => {
    const request = await axios.get("http://dummy.restapiexample.com/api/v1/employees");
    return request.data;
})

export const fetchEmployee = functions.https.onCall(async (data: number) => {
    const request = await axios.get(`http://dummy.restapiexample.com/api/v1/employee/${data}`);
    return request.data;
})

export const sendEmail = functions.https.onCall(async (data: {email: string; message: string}) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: String(emailCredentials.email),
            pass: String(emailCredentials.password),
        }
    });
    await transporter.sendMail({
        from: String(emailCredentials.email),
        to: data.email,
        subject: "message was sent by cloud functions",
        text: data.message,
        html: data.message
    })
})

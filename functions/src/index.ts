import * as functions from 'firebase-functions';
import axios from "axios";
import * as emailCredentials from "./config/email.json";
import * as nodemailer from "nodemailer";
import * as admin from "firebase-admin";
import * as serviceKey from "./config/service-key.json";
import { ServiceAccount } from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(serviceKey as ServiceAccount),
    databaseURL: "https://elliptical-city-210712.firebaseio.com",
    storageBucket: "elliptical-city-210712.appspot.com"
})

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

export const generateRandomOnCall = functions.https.onCall(() => {
    const number = Math.round(Math.random() * 100);
    return String(number);
})

export const generateRandomOnRequest = functions.https.onRequest((req, resp) => {
    const number = Math.round(Math.random() * 100);
    resp.send(String(number));
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

export const handleStorage = functions.storage.object().onFinalize(async (object) => {
    const filesList = await admin.storage().bucket().getFiles();
    const files = filesList[0];
    if (files.length !== 0) {
        const key = admin.database().ref().push().key;
        admin.database().ref(`/files/${key}`).set({
            file: object.name
        });
    }
})

export const onDeleteFile = functions.storage.object().onDelete((object) => {
    admin.database().ref("files").once("value", (snapshot) => {
        const data = snapshot.val();
        const index = Object.values(data).findIndex((item: any) => item.file === object.name);
        const key = Object.keys(data)[index];
        admin.database().ref(`/files/${key}`).remove();
    })
})

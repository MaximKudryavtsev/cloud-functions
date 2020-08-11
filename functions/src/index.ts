import * as functions from 'firebase-functions';
import axios from "axios";
import * as emailCredentials from "./config/email.json";
import * as nodemailer from "nodemailer";
import * as admin from "firebase-admin";
const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: emailCredentials.email,
        pass: emailCredentials.password,
    }
});

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
    return cors(req, resp, () => {
        const number = Math.round(Math.random() * 100);
        resp.send(String(number));
    })
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
    await transporter.sendMail({
        from: String(emailCredentials.email),
        to: data.email,
        subject: "message was sent by cloud functions",
        text: data.message,
        html: data.message
    })
})

export const handleStorage = functions.storage.object().onFinalize(async (object) => {
    const name = object.name;
    console.log("name: ", name);
    if (name) {
        const curseWordsList = ["fuck", "shit", "ass", "dick"];
        const isCurseWordExist = curseWordsList.some((item) => name.includes(item));
        if (isCurseWordExist) {
            await admin.storage().bucket().file(name).delete();
        }
    }
})

export const onDeleteFile = functions.storage.object().onDelete((object) => {
    console.info(`File ${object.name} was deleted`);
    return `File ${object.name} was deleted`;
})

export const onCreateUser = functions.auth.user().onCreate(async (user) => {
    await transporter.sendMail({
        from: String(emailCredentials.email),
        to: user.email,
        subject: "Successful sign-up",
        text: `Hello, ${user.email}`,
        html: `Hello, ${user.email}. We glad to see you in our service.`
    })
});

// export const onDeleteFileBySchedule = functions.pubsub.schedule("every 1 mins").onRun(async () => {
//     const filesList = await admin.storage().bucket().getFiles();
//     const files = filesList[0];
//     await admin.storage().bucket().file(files[0].name).delete();
// })

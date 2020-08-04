import * as functions from 'firebase-functions';
import axios from "axios";

export const replaceCurseWords = functions.database.ref("/comments/{pushId}").onCreate(((snapshot, context) => {
    const original = snapshot.val();
    const curseWordsList = ["fuck", "shit", "pussy", "dick"];
    const text: string = original.comment;
    const isCurseWordExist = curseWordsList.some((item) => text.includes(item));
    return snapshot.ref.set({comment: isCurseWordExist ? "Comment was blocked because of curse words!" : text});
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

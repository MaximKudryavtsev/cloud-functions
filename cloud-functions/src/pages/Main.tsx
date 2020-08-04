import React, { useEffect, useState } from "react";
import { Card, TextField, Button } from "@material-ui/core";
import { css } from "emotion";
import { fb } from "../App";
import { Link } from "react-router-dom";

const styles = {
    container: css`
        margin: 0 auto;
        position: relative;
        height: 100vh;
        padding: 50px;
        box-sizing: border-box;
    `,
    flex: css`
        display: flex;
    `,
    card: css`
        width: 600px;
        margin: 0 auto;
        padding: 50px;
        display: flex;
        flex-direction: column;
        height: fit-content;
    `,
    input: css`
        margin-bottom: 20px !important;
    `,
};


export const Main = () => {
    const [value, setValue] = useState("");
    const [list, setList] = useState<string[]>([]);
    const [random, setRandom] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        fb
            .database()
            .ref("comments")
            .once("value")
            .then((snapshot) => {
                if (snapshot && snapshot.val()) {
                    const data = Object.values(snapshot.val());
                    setList(data.map((item: any) => item.comment));
                }
            });
    }, []);

    const onClick = () => {
        const newKey = fb.database().ref().push().key;
        fb
            .database()
            .ref(`comments/${newKey}`)
            .set({
                comment: value,
            })
            .then(() => {
                setValue("");
                fb
                    .database()
                    .ref("comments")
                    .once("value")
                    .then((snapshot) => {
                        const data = Object.values(snapshot.val());
                        setList(data.map((item: any) => item.comment));
                    });
            });
    };

    const generateRandom = () => {
        const fun = fb.functions().httpsCallable("generateRandom");
        fun().then((result) => setRandom(result.data));
    }

    return (
        <div className={styles.container}>
            <Link to={"/users"}>Users</Link>
            <br/>
            <br/>
            <div className={styles.flex}>
                <ul>
                    {list.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <Card className={styles.card} variant="outlined">
                    <TextField value={value} onChange={onChange} className={styles.input} />
                    <Button color="primary" variant="contained" onClick={onClick}>
                        Submit
                    </Button>
                </Card>
            </div>
            <hr/>
            <div>
                <div>Random number from cloud functions is: <b>{random}</b></div>
                <Button color="primary" variant="contained" onClick={generateRandom}>
                    generate
                </Button>
            </div>
        </div>
    );
}

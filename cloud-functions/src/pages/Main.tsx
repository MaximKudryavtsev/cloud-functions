import React, { useEffect, useRef, useState } from "react";
import { Card, TextField, Button } from "@material-ui/core";
import { css } from "emotion";
import { fb } from "../App";
import { IComment } from "../entity/comment";
import { Comment } from "../Comment";
import axios from "axios";

const styles = {
    container: css`
        margin: 0 auto;
        position: relative;
        height: 100vh;
        padding: 50px;
        box-sizing: border-box;
    `,
    columns: css`
        display: grid;
        grid-template-columns: 400px 400px;
        grid-column-gap: 40px;
    `,
    card: css`
        margin: 0 auto;
        padding: 50px;
        display: flex;
        flex-direction: column;
        height: fit-content;
        box-sizing: border-box;
    `,
    input: css`
        margin-bottom: 20px !important;
    `,
    comments: css`
        height: 400px;
        overflow-y: auto;
        background: #ccc;
        box-sizing: border-box;
    `,
};

export const Main = () => {
    const [value, setValue] = useState("");
    const [list, setList] = useState<IComment[]>([]);
    const [files, setFiles] = useState<Array<{ file: string }>>([]);
    const [randomOnCall, setRandomOnCall] = useState("");
    const [randomOnRequest, setRandomOnRequest] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        fb.database()
            .ref("comments")
            .on("value", (snapshot) => {
                if (snapshot && snapshot.val()) {
                    const data = Object.values(snapshot.val());
                    setList(
                        data.map((item: any, index: number) => ({
                            comment: item.comment,
                            id: Object.keys(snapshot.val())[index],
                        })),
                    );
                } else {
                    setList([]);
                }
            });
        fb.database()
            .ref("files")
            .on("value", (snapshot) => {
                if (snapshot && snapshot.val()) {
                    const data = Object.values(snapshot.val());
                    setFiles(
                        data.map((item: any, index: number) => ({
                            file: item.file,
                        })),
                    );
                } else {
                    setFiles([]);
                }
            });
    }, []);

    const onClick = () => {
        const newKey = fb.database().ref().push().key;
        if (!value || value === "") {
            return;
        }
        fb.database()
            .ref(`comments/${newKey}`)
            .set({
                comment: value,
            })
            .then(() => {
                setValue("");
            });
    };

    const onOpenWindow = () => {
        if (!inputRef.current) {
            return;
        }
        inputRef.current.click();
    };

    const generateRandomOnCall = () => {
        const fun = fb.functions().httpsCallable("generateRandomOnCall");
        fun().then((result) => setRandomOnCall(result.data));
    };

    const generateRandomOnRequest = async () => {
        const request = await axios.get(
            "https://us-central1-elliptical-city-210712.cloudfunctions.net/generateRandomOnRequest",
            {
                headers: {
                    origin: "http://localhost:3000",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }
        );
        const data = request.data;
        setRandomOnRequest(data);
    };

    const deleteComment = (id: string) => {
        fb.database().ref(`/comments/${id}`).remove();
    };

    const onSaveComment = (id: string, newValue: string) => {
        fb.database().ref(`/comments/${id}`).update({ comment: newValue });
    };

    const onUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (!file) {
            return;
        }
        fb.storage().ref().child(file.name).put(file);
    };

    return (
        <div className={styles.container}>
            <div className={styles.columns}>
                <div>
                    <Card className={styles.card} variant="outlined">
                        <TextField value={value} onChange={onChange} className={styles.input} />
                        <Button color="primary" variant="contained" onClick={onClick}>
                            Submit
                        </Button>
                    </Card>
                    <ul className={styles.comments}>
                        {list.map((item, index) => (
                            <Comment comment={item} key={index} onDelete={deleteComment} onSave={onSaveComment} />
                        ))}
                    </ul>
                </div>
                <div>
                    <Card className={styles.card} variant="outlined">
                        <input
                            type="file"
                            ref={inputRef}
                            className={css`
                                display: none;
                            `}
                            onChange={onUploadFile}
                        />
                        <Button color="primary" variant="contained" onClick={onOpenWindow}>
                            Upload
                        </Button>
                    </Card>
                    <ul className={styles.comments}>
                        {files.map((item, index) => (
                            <li key={index}>{item.file}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <hr />
            <div
                className={css`
                    display: flex;
                `}
            >
                <div
                    className={css`
                        margin-right: 20px;
                    `}
                >
                    <div>
                        OnCall: <b>{randomOnCall}</b>
                    </div>
                    <Button color="primary" variant="contained" onClick={generateRandomOnCall}>
                        generate
                    </Button>
                </div>
                <div>
                    <div>
                        OnRequest: <b>{randomOnRequest}</b>
                    </div>
                    <Button color="primary" variant="contained" onClick={generateRandomOnRequest}>
                        generate
                    </Button>
                </div>
            </div>
            <hr />
        </div>
    );
};

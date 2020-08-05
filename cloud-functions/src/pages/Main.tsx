import React, { useEffect, useState } from "react";
import { Card, TextField, Button, IconButton } from "@material-ui/core";
import { css } from "emotion";
import { fb } from "../App";
import { Delete } from "@material-ui/icons";

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
    comments: css`
        height: 400px;
        width: 400px;
        overflow-y: auto;
        background: #ccc;
    `,
    comment: css`
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
};

interface IComment {
    id: string;
    comment: string;
}

export const Main = () => {
    const [value, setValue] = useState("");
    const [list, setList] = useState<IComment[]>([]);
    const [random, setRandom] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        fb.database()
            .ref("comments")
            .on("value", (snapshot => {
                if (snapshot && snapshot.val()) {
                    const data = Object.values(snapshot.val());
                    setList(data.map((item: any, index: number) => ({
                        comment: item.comment,
                        id: Object.keys(snapshot.val())[index]
                    })));
                } else {
                    setList([]);
                }
            }));
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

    const generateRandom = () => {
        const fun = fb.functions().httpsCallable("generateRandom");
        fun().then((result) => setRandom(result.data));
    };

    const deleteComment = (id: string) => {
        fb.database()
            .ref(`/comments/${id}`)
            .remove()
    };

    return (
        <div className={styles.container}>
            <div className={styles.flex}>
                <ul className={styles.comments}>
                    {list.map((item, index) => (
                        <li key={index}>
                            <span className={styles.comment}>{item.comment}</span>
                            <IconButton onClick={() => deleteComment(item.id)}>
                                <Delete />
                            </IconButton>
                        </li>
                    ))}
                </ul>
                <Card className={styles.card} variant="outlined">
                    <TextField value={value} onChange={onChange} className={styles.input} />
                    <Button color="primary" variant="contained" onClick={onClick}>
                        Submit
                    </Button>
                </Card>
            </div>
            <hr />
            <div>
                <div>
                    Random number from cloud functions is: <b>{random}</b>
                </div>
                <Button color="primary" variant="contained" onClick={generateRandom}>
                    generate
                </Button>
            </div>
        </div>
    );
};

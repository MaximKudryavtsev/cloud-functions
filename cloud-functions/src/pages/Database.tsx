import React, { useEffect, useState } from "react";
import { IComment } from "../entity/comment";
import { fb } from "../App";
import { Button, Card, TextField } from "@material-ui/core";
import { Comment } from "../components/Comment";
import { css } from "emotion";

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

export const Database = () => {
    const [value, setValue] = useState("");
    const [list, setList] = useState<IComment[]>([]);

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

    const deleteComment = (id: string) => {
        fb.database().ref(`/comments/${id}`).remove();
    };

    const onSaveComment = (id: string, newValue: string) => {
        fb.database().ref(`/comments/${id}`).update({ comment: newValue });
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
            </div>
        </div>
    );
}

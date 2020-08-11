import React, { useEffect, useState } from "react";
import { IComment } from "../entity/comment";
import { IconButton, TextField } from "@material-ui/core";
import { Delete, Edit, Save } from "@material-ui/icons";
import { css } from "emotion";

interface IProps {
    comment: IComment;

    onDelete?(id: string): void;

    onSave?(id: string, newValue: string): void;
}

const styles = {
    comment: css`
        display: flex;
        align-items: center;
        padding: 0 10px 10px 0;
        border-bottom: 1px solid black;
    `,
    commentText: css`
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
    icons: css`
        margin-left: auto;
        display: flex;
    `,
};

export const Comment = (props: IProps) => {
    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(props.comment.comment);
    }, [props.comment]);

    const onDelete = () => {
        if (!props.onDelete) {
            return;
        }
        props.onDelete(props.comment.id);
    };

    const onSave = () => {
        setEdit(false);
        if (!props.onSave) {
            return;
        }
        props.onSave(props.comment.id, value);
    }

    return (
        <li className={styles.comment}>
            {edit ? (
                <TextField value={value} onChange={(e) => setValue(e.target.value)} />
            ) : (
                <span className={styles.commentText}>{props.comment.comment}</span>
            )}
            <div className={styles.icons}>
                <IconButton onClick={onDelete}>
                    <Delete />
                </IconButton>
                {!edit ? (
                    <IconButton onClick={() => setEdit(true)}>
                        <Edit />
                    </IconButton>
                ) : (
                    <IconButton onClick={onSave}>
                        <Save />
                    </IconButton>
                )}
            </div>
        </li>
    );
};

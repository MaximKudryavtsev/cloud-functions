import React, { useRef, useState } from "react";
import { fb } from "../App";
import { Button, Card, Typography } from "@material-ui/core";
import { css } from "emotion";
import { Alert } from "@material-ui/lab";

const styles = {
    container: css`
        position: relative;
        height: 100vh;
        padding: 50px;
        box-sizing: border-box;
        width: 600px;
    `,
    card: css`
        margin: 0 auto;
        padding: 50px;
        display: grid;
        grid-row-gap: 20px;
        height: fit-content;
        box-sizing: border-box;
    `,
    comments: css`
        height: 400px;
        overflow-y: auto;
        background: #ccc;
        box-sizing: border-box;
    `,
};

export const Storage = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const choosenFile = event.target.files?.item(0);
        if (!choosenFile) {
            return;
        }
        setFile(choosenFile);
        setSuccess(false);
    };

    const upload = () => {
        if (file) {
            fb.storage().ref().child(file.name).put(file).then(() => setSuccess(true));
        }
    }

    const onOpenWindow = () => {
        if (!inputRef.current) {
            return;
        }
        inputRef.current.click();
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card} variant="outlined">
                <input
                    type="file"
                    ref={inputRef}
                    className={css`
                        display: none;
                    `}
                    onChange={onChangeFile}
                />
                <Button color="primary" variant="contained" onClick={onOpenWindow}>
                    Choose file
                </Button>
                {file && <Typography>{file.name}</Typography>}
                <Button color="primary" variant="contained" onClick={upload}>
                    Upload
                </Button>
            </Card>
            <br/>
            {success && <Alert severity={"success"}>File successfully uploaded!</Alert>}
        </div>
    );
};

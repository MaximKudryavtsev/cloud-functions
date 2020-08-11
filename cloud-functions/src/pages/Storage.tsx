import React, { useEffect, useRef, useState } from "react";
import { fb } from "../App";
import { Button, Card } from "@material-ui/core";
import { css } from "emotion";

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
        display: flex;
        flex-direction: column;
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
    const [files, setFiles] = useState<Array<{ file: string }>>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
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

    const onUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (!file) {
            return;
        }
        fb.storage().ref().child(file.name).put(file);
    };

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
    );
};

import React, { useState } from "react";
import { fb } from "../App";
import { Card, TextField, Button } from "@material-ui/core";
import { css } from "emotion";

export const Email = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const onSend = () => {
        if (!email || email === "" || !message || message === "") {
            return;
        }
        setSuccessMessage("");
        const send = fb.functions().httpsCallable("sendEmail");
        send({email, message}).then(() => {
            setSuccessMessage("Message was sent!");
        });
    }

    return (
        <div
            className={css`
                padding: 50px;
            `}
        >
            <Card
                className={css`
                    width: 600px;
                    padding: 20px;
                    display: grid;
                    grid-template-columns: 1fr;
                    grid-row-gap: 20px;
                `}
            >
                <TextField label={"Email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label={"Message"} value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button color="primary" variant="contained" onClick={onSend}>
                    send
                </Button>
            </Card>
            {successMessage !== "" && <p className={css`color: green;`}>{successMessage}</p>}
        </div>
    );
};

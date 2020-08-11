import React, { useState } from "react";
import { css } from "emotion";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { Button, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { fb } from "../App";

const styles = {
    content: css`
        display: grid;
        grid-row-gap: 20px;
    `,
};

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onSubmit = () => {
        fb.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                setSuccess(true);
                setError(undefined);
                setPassword("");
                setEmail("");
            })
            .catch((e) => {
                setError(e.message);
                setSuccess(false);
            });
    };

    return (
        <Container>
            <Card>
                <div className={styles.content}>
                    <TextField label={"Email"} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField
                        label={"Password"}
                        type={"password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button color="primary" variant="contained" onClick={onSubmit}>
                        Submit
                    </Button>
                </div>
            </Card>
            <br />
            {success && <Alert severity="success">User successfully created! Check your email</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
        </Container>
    );
};

import React, { useEffect, useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { css } from "emotion";
import { fb } from "../App";
import axios from "axios";
import { Container } from "../components/Container";
import { IEmployee } from "../entity/employee";
import { Card } from "../components/Card";

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

export const HTTPS = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [employee, setEmployee] = useState<IEmployee | undefined>(undefined);
    const [cardVisible, setCardVisible] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [randomOnCall, setRandomOnCall] = useState("");
    const [randomOnRequest, setRandomOnRequest] = useState("");

    useEffect(() => {
        const fetchEmployees = fb.functions().httpsCallable("fetchEmployees");
        fetchEmployees().then((data) => setEmployees(data.data.data));
    }, []);

    const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const fetchEmployee = fb.functions().httpsCallable("fetchEmployee");
        fetchEmployee(Number(e.target.value))
            .then((result) => {
                setError(undefined);
                setEmployee(result.data.data);
                setCardVisible(true);
            })
            .catch(() => {
                setCardVisible(false);
                setError("API Error");
            });
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
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
        const data = request.data;
        setRandomOnRequest(data);
    };

    return (
        <Container>
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
            <br />
            <hr />
            <div className={css`display: grid; grid-template-columns: 400px 400px; grid-column-gap: 20px`}>
                <div>
                    <FormControl
                        variant="outlined"
                        className={css`
                        width: 400px;
                        margin-bottom: 40px !important;
                    `}
                    >
                        <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={employee}
                            onChange={handleChange}
                            label="Age"
                        >
                            {employees.map((item, index) => (
                                <MenuItem value={item.id} key={index}>
                                    {item.employee_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {error && (
                        <p
                            className={css`
                            color: red;
                        `}
                        >
                            {error}
                        </p>
                    )}
                    {cardVisible && employee && (
                        <Card>
                            <table>
                                <tbody>
                                <tr>
                                    <td
                                        className={css`
                                            width: 50%;
                                        `}
                                    >
                                        Name:
                                    </td>
                                    <td
                                        className={css`
                                            width: 50%;
                                        `}
                                    >
                                        <b>{employee.employee_name}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className={css`
                                            width: 50%;
                                        `}
                                    >
                                        Age:
                                    </td>
                                    <td
                                        className={css`
                                            width: 50%;
                                        `}
                                    >
                                        <b>{employee.employee_age}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className={css`
                                            width: 50%;
                                        `}
                                    >
                                        Salary:
                                    </td>
                                    <td
                                        className={css`
                                            width: 50%;
                                        `}
                                    >
                                        <b>{employee.employee_salary}</b>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Card>
                    )}
                </div>
            </div>
        </Container>
    );
};

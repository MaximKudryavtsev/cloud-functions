import React, { useEffect, useState } from "react";
import { fb } from "../App";
import { FormControl, InputLabel, MenuItem, Select, Card } from "@material-ui/core";
import { css } from "emotion";

interface IEmployee {
    id: string;
    employee_name: string;
    employee_salary: string;
    employee_age: string;
    profile_image: string;
}

export const Users = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [employee, setEmployee] = useState<IEmployee | undefined>(undefined);
    const [cardVisible, setCardVisible] = useState(false);
    const [error, setError] = useState<string | undefined>("")

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

    return (
        <div
            className={css`
                padding: 50px;
            `}
        >
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
            {error && <p className={css`color: red;`}>{error}</p>}
            {cardVisible && employee && (
                <Card
                    className={css`
                        padding: 20px;
                        width: 400px;
                        box-sizing: border-box;
                    `}
                    variant={"outlined"}
                >
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
    );
};

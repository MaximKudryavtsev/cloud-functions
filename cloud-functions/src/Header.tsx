import React from "react";
import { css } from "emotion";
import { Link } from "react-router-dom";

export const Header = () => (
    <div className={css`display: flex`}>
        <Link to={"/"} className={css`margin-right: 20px`}>Main</Link>
        <Link to={"/users"} className={css`margin-right: 20px`}>Users</Link>
        <Link to={"/email"} className={css`margin-right: 20px`}>Email</Link>
    </div>
)

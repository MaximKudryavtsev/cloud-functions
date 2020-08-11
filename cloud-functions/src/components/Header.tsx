import React from "react";
import { css } from "emotion";
import { Link } from "react-router-dom";

const styles = {
    container: css`
        display: flex;
        padding: 20px 50px;
    `,
    link: css`
        margin-right: 20px;
    `,
};

const LINKS = [
    {
        link: "/",
        title: "https",
    },
    {
        link: "/auth",
        title: "Auth",
    },
    {
        link: "/database",
        title: "Database"
    },
    {
        link: "/storage",
        title: "Storage"
    },
];

export const Header = () => (
    <div className={styles.container}>
        {LINKS.map((item, index) => (
            <Link
                key={index}
                to={item.link}
                className={css`
                margin-right: 20px;
            `}
            >
                {item.title}
            </Link>
        ))}
    </div>
);

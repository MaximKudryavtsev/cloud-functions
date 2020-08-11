import React, { FC } from "react";
import { css } from "emotion";
import { Card as MaterialCard } from "@material-ui/core";

const styles = {
    card: css`
        padding: 20px;
    `,
};

export const Card: FC = (props) => (
    <MaterialCard variant={"outlined"} className={styles.card}>
        {props.children}
    </MaterialCard>
);

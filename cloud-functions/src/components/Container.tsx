import React, { FC } from "react";
import { css } from "emotion";

const styles = {
    container: css`
        padding: 50px;
    `
}

export const Container: FC = (props) => (
    <div className={styles.container}>{props.children}</div>
)

// import { useEffect, useState } from "react";
import styles from "./Characteristic.module.scss"

export const Characteristic = ({img, value} : {img: string, value: number}) => {

    return (
        <div className={styles.container}>
            <img src={img} alt={`${value}`} />
            <span className={styles.text}>{value}</span>
        </div>
    )
}
import styles from './Map.module.scss'

export const Map = () => {

    return (
        <div className={styles.container}>
            <div className={styles.mapWrapper}>
                <div className={styles.map}>
                    <div className={styles.playerDot}>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
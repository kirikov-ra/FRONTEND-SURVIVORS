import styles from './Item.module.scss'

export const Item = ({img, name} : {img?: string, name?: string}) => {

    return (
        
        <div className={styles.container}>
            <div 
                className={styles.border} 
            >
                <div className={styles.image_wrapper}>
                    {img && name &&
                        <img src={img} alt={name} />
                    }
                </div>
            </div>
            <div 
                className={styles.shadow}
            ></div>
        </div>
    )
}
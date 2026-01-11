import styles from './Skill.module.scss'

export const Skill = ({img, name, borderColor} : {img: string, name: string, borderColor: string}) => {

    return (
        
        <div className={styles.container}>
            <div 
                className={styles.border} 
                style={{ background:  `#${borderColor}` }}
            >
                <div className={styles.image_wrapper}>
                    <img src={img} alt={name} />
                </div>
            </div>
            <div 
                className={styles.shadow}
                style={{ boxShadow: `0px 0px 8px 1px #${borderColor}` }}
            ></div>
        </div>
    )
}
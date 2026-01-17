import styles from './Skill.module.scss'

export const Skill = ({img, name, borderColor, isActive} : {img: string, name: string, borderColor: string, isActive: boolean}) => {

    return (
        
        <div className={styles.container}>
            <div 
                className={styles.border} 
                style={{ background:  `#${isActive ? borderColor : '313d4b'}` }}
            >
                <div className={styles.image_wrapper}>
                    <img 
                        src={img} 
                        alt={name} 
                        style={{ filter: isActive ? `drop-shadow(0px 0px 10px #${borderColor}` : "none" }}
                    />
                </div>
            </div>
            {isActive && 
                <div 
                    className={styles.shadow}
                    style={{ boxShadow: `0px 0px 8px 1px #${borderColor}` }}
                ></div>
            }
            
        </div>
    )
}
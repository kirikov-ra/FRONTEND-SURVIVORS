import { Item } from '../Item/Item'
import styles from './ItemsBar.module.scss'

export const ItemsBar = () => {

    return (
        <div className={styles.container}>
            <div className={styles.items}>
                <Item img={"/assets/Mdn.png"} name={"HTML"} />
                <Item img={"/assets/DMS.png"} name={"CSS"} />
                <Item img={"/assets/Git.png"} name={"JS"} />
                <Item />
            </div>
        </div>
    )
}
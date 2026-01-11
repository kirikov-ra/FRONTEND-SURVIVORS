import { Skill } from '../Skill/Skill'
import styles from './SkillBar.module.scss'

export const SkillBar = () => {

    return (
        <div className={styles.container}>
            <div className={styles.skills}>
                <Skill img={"/assets/html.png"} name={"HTML"} borderColor={'de4b39'}/>
                <Skill img={"/assets/CSS.png"} name={"CSS"} borderColor={'3a9cff'} />
                <Skill img={"/assets/JS.png"} name={"JS"} borderColor={'b78d5d'}/>
                <Skill img={"/assets/TS.png"} name={"TS"} borderColor={'3a9cff'}/>
                <Skill img={"/assets/React.png"} name={"React"} borderColor={'3a9cff'}/>
                <Skill img={"/assets/Angular.png"} name={"Angular"} borderColor={'d03869'}/>
                <Skill img={"/assets/Vue.png"} name={"Vue"} borderColor={'2cdc33'}/>
                <Skill img={"/assets/Redux.png"} name={"Redux"} borderColor={'9c49d7'}/>
            </div>
        </div>
    )
}
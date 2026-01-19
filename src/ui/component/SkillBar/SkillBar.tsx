import { Skill } from '../Skill/Skill'
import styles from './SkillBar.module.scss'

export const SkillBar = () => {

    return (
        <div className={styles.container}>
            <div className={styles.skills}>
                <Skill img={"/assets/html.png"} name={"HTML"} borderColor={'de4b39'} isActive={true}/>
                <Skill img={"/assets/CSS.png"} name={"CSS"} borderColor={'3a9cff'} isActive={true}/>
                <Skill img={"/assets/JS.png"} name={"JS"} borderColor={'b78d5d'} isActive={false}/>
                <Skill img={"/assets/TS.png"} name={"TS"} borderColor={'3a9cff'} isActive={true}/>
                <Skill img={"/assets/React.png"} name={"React"} borderColor={'3a9cff'} isActive={false}/>
                <Skill img={"/assets/Angular.png"} name={"Angular"} borderColor={'941c1c'} isActive={true}/>
                <Skill img={"/assets/Vue.png"} name={"Vue"} borderColor={'2cdc33'} isActive={false}/>
                <Skill img={"/assets/Redux.png"} name={"Redux"} borderColor={'9c49d7'} isActive={false}/>
            </div>
        </div>
    )
}
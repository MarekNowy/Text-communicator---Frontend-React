import styles from './settings.module.css'

const Settings = () => {


    
return(<div>
    <button>Change NickName</button>
    <button className={styles.danger}>Remove Account</button>
</div>)
}

export default Settings;
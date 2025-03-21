import { useState } from "react";

const Settings = () => {
    const [nickName, setNickName] = useState<boolean>(false)

    const handleRemoveAccount = async () => {

    }

    const handleChangeNick = async () => {
        
    }

    return(<>
    <button onClick={handleChangeNick}>Zmień NickName</button>
    <button onClick={handleRemoveAccount}>Usuń Konto</button>
    </>)
}

export default Settings;
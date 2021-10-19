import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {

    const [connectionID, setConnectionID] = useState<string>("");
    const [targetID, setTargetID] = useState("");
    const [message, setMessage] = useState(`{\n    "test":XXX\n}`);
    const [values, setValues] = useState("1,2,3");

    const [isSending, setSending] = useState(false);

    useEffect(() => {
        try {
            var socket = new WebSocket("wss://fst7ese5o0.execute-api.eu-west-2.amazonaws.com/production");
            socket.onopen = (x) => {
                console.log('Socket connection opened');
                socket.send(JSON.stringify({
                    action: "getID",
                }))
            };
            socket.onmessage = (message) => {
                console.log(message.data);
                let data = JSON.parse(message.data)
                if (data.message && data.message === "idRequest") {
                    setConnectionID(data.connectionId)
                } else {
                    console.log(JSON.parse(data))
                }

            };
            setInterval(() => {
                socket.send(JSON.stringify({
                    action: 'keepAlive',
                }));
                console.log('sending keep alive');
            }, 30000);
        } catch {
            console.log('Could not connect');
        }
    }, []);

  return (
    <div className="App">
        {!isSending ? 
            <>
                <h2>{`Your connectionID is ${connectionID}`}</h2>
                <h3>
                    This tool will allow you to send pseudo-randomised data to a given connectionID via a websocket hosted in AWS<br/>
                    Enter the JSON structure in the data entry box below, and replace any given key value with XXX to replace it with randomly selected values from the values text entry<br/>

                </h3>
                <div className="input field">
                <br />

                <form >
                    <label>
                        <br/><b>Target:</b>
                        <input type="text" name="target" value={targetID} onChange={(x) => setTargetID(x.target.value)} style={{width: '100%'}}/>
                    </label>
                    <label>
                        <br/><br/><b>Data:</b><br/>
                        <textarea name="target" rows={20} value={message} onChange={(x) => setMessage(x.target.value)} style={{width: '100%'}}/>
                    </label>
                    <label>
                        <br/><br/><b>Values:</b><br/>
                        <textarea name="target" rows={5} value={values} onChange={(x) => setValues(x.target.value)} style={{width: '100%'}}/>
                    </label>
                    <br/><br/>
                    <input type="button" value="Submit" onClick={() => sendMessage(targetID, message, values, setSending)}/>
                    </form>
                </div>
            </>
        :
            <h2>Sending data</h2>
        }
        
    </div>
  );
}

export default App;

async function sendMessage(target: string, message: string, values: string, setSending: React.Dispatch<React.SetStateAction<boolean>>) {
    console.log("submit");
    let valuesArray = values.split(',');
    if (values.length < 0) {
        return
    }
    try {
        console.log(message.replace('XXX', '1'))
        JSON.parse(message.replace('XXX', '1'));
    } catch {
        console.log("INVALID JSON");
        return
    }
    console.log(valuesArray)
    setSending(true);
    setInterval(async () => {
        let rand = Math.floor(Math.random() * (valuesArray.length))
        let temp = message.replace('XXX', valuesArray[rand]);
        await axios({
            url: "https://te922e897e.execute-api.eu-west-2.amazonaws.com/production/sendmessage",
            method: "POST",
            data: JSON.stringify({
                data: JSON.stringify(temp),
                connectionId: target
            })
        })
        console.log('sent')
    }, 2000)
    
}
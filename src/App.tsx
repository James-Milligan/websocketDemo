import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {

    const [connectionID, setConnectionID] = useState<string>("");
    const [targetID, setTargetID] = useState("");
    const [message, setMessage] = useState("");

    const [incomingMessage, setIncomingMessage] = useState<JSX.Element | null>(null);

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
                let data = JSON.parse(message.data)
                if (data.message && data.message === "idRequest") {
                    setConnectionID(data.connectionId)
                } else {
                    console.log(data)
                    setIncomingMessage(
                        <>
                            <b>{`${data.connectionId}:  `}</b>{data.message}<br/>
                        </>
                    )
                }

            };
            setInterval(() => {
                socket.send(JSON.stringify({
                    action: 'keepAlive',
                }));
                console.log('sending keep alive');
            }, 10000);
        } catch {
            console.log('Could not connect');
        }
    }, []);

  return (
    <div className="App">

        {`Your connectionID is ${connectionID}`}
        <div className="input field">
        <br />
        {incomingMessage}

        <form >
            <label>
                <br/><b>Target:</b>
                <input type="text" name="target" value={targetID} onChange={(x) => setTargetID(x.target.value)}/>
            </label>
            <label>
                <br/><br/><b>Message:</b>
                <input type="text" name="target" value={message} onChange={(x) => setMessage(x.target.value)}/>
            </label>
            <br/><br/>
            <input type="button" value="Submit" onClick={() => sendMessage(targetID, message)}/>
            </form>
        </div>
    </div>
  );
}

export default App;

async function sendMessage(target: string, message: string) {
    console.log("submit")
    await axios({
        url: "https://te922e897e.execute-api.eu-west-2.amazonaws.com/production/sendmessage",
        method: "POST",
        data: JSON.stringify({
            message: message,
            connectionID: target
        })
    })
    console.log('sent')
}
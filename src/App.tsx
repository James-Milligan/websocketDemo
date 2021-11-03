import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {

    const [connectionID, setConnectionID] = useState<string>("");
    const [targetID, setTargetID] = useState("");
    const [message, setMessage] = useState(`{
        "farnham": {
          "desks": {
            "svg_16": "XXX",
            "svg_17": "XXX",
            "svg_18": "XXX",
            "svg_19": "XXX",
            "svg_6": "XXX",
            "svg_23": "XXX",
            "svg_5": "XXX",
            "svg_24": "XXX",
            "svg_4": "XXX",
            "svg_25": "XXX",
            "svg_3": "XXX",
            "svg_26": "XXX",
            "svg_9": "XXX",
            "svg_20": "XXX",
            "svg_8": "XXX",
            "svg_21": "XXX",
            "svg_7": "XXX",
            "svg_22": "XXX",
            "svg_2": "XXX",
            "svg_1": "XXX",
            "svg_12": "XXX",
            "svg_13": "XXX",
            "svg_14": "XXX",
            "svg_15": "XXX",
            "svg_10": "XXX",
            "svg_11": "XXX"
          }
        },
        "baldock": {
          "desks": {
            "svg_16": "XXX",
            "svg_17": "XXX",
            "svg_18": "XXX",
            "svg_19": "XXX",
            "svg_6": "XXX",
            "svg_23": "XXX",
            "svg_5": "XXX"
          }
        },
        "cheshunt": {
          "desks": {
            "svg_9":"XXX",
            "svg_20":"XXX",
            "svg_8":"XXX",
            "svg_21":"XXX",
            "svg_7":"XXX",
            "svg_22":"XXX",
            "svg_2":"XXX",
            "svg_1":"XXX",
            "svg_12":"XXX",
            "svg_13":"XXX",
            "svg_14":"XXX"
          }
        }
      }`);
    const [values, setValues] = useState("green,yellow,red");

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
        let temp = message;
        console.log(temp);
        console.log(JSON.parse(temp));
        while (true) {
            if (!JSON.stringify(temp).includes('XXX')) {
                break;
            }
            temp = temp.replace('XXX', valuesArray[Math.floor(Math.random() * (valuesArray.length))]);
        }
        console.log(temp)
        JSON.parse(temp.replace(/XXX/g, '1'));
    } catch (error) {
        console.log(error)
        console.log("INVALID JSON");
        return
    }
    console.log(valuesArray)
    setSending(true);
    setInterval(async () => {
        let temp = message;
        while (true) {
            if (!JSON.stringify(temp).includes('XXX')) {
                break;
            }
            temp = temp.replace('XXX', valuesArray[Math.floor(Math.random() * (valuesArray.length))]);
        }
        
        await axios({
            url: "https://te922e897e.execute-api.eu-west-2.amazonaws.com/production/sendmessage",
            method: "POST",
            data: JSON.stringify({
                data: JSON.stringify(temp),
                connectionId: target
            })
        })
        console.log('sent')
    }, 3000)
    
}
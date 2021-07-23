import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    const requestJSONHandler = () => {
        fetch("/api/json", {
            method: "POST",
            body: JSON.stringify({
                no: "no",
                password: "password",
                validCode: "validCode",
                validCodeSign: "validCodeSign"
            })
        });
    };
    const requestHandlerParamAndQuery = () => {
        fetch("/api/params/123?a=b&b=c");
    };

    const requestRAWHandler = (e) => {
        console.log("e", e);
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Hello Vite + React!</p>
                <p>
                    <button onClick={() => setCount((count) => count + 1)}>count is: {count}</button>
                </p>
                <p>
                    Edit <code>App.tsx</code> and save to test HMR updates.
                </p>
                <p>
                    <button onClick={requestJSONHandler}>request JOSN</button>
                </p>
                <p>
                    <button onClick={requestHandlerParamAndQuery}>request param and query</button>
                </p>

                <p>
                    <input type="file" placeholder="request RAW" onChange={requestRAWHandler} />
                </p>
            </header>
        </div>
    );
}

export default App;

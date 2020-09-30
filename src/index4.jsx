import React from "react";
import ReactDOM from "react-dom";
import {Header} from './Header.tsx'
import './index.js'

import classMe from './index.scss'
console.log('classMe', classMe)
import Spinner from './Spinner/Spinner.jsx'

class HelloMessage extends React.Component {
    render() {


        return <div>
            <div className={`container ${classMe.classMe}`}>
                <Spinner/>
                <Header/>

                <h1>Helloooo {this.props.name}</h1>
            </div>
        </div>
    }
}

let App = document.getElementById("app");

if (module.hot) {
    module.hot.accept()
}
ReactDOM.render(<HelloMessage name="Yomiiiii" />, App);

console.log('momosdf')

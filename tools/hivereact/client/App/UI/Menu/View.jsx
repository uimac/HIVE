import React from "react"
import ReactDOM from "react-dom"
import Menu from "./Menu.jsx"
import MenuStore from "./MenuStore.jsx"
import MenuAction from "./MenuAction.jsx"

var Dispatcher = require("flux").Dispatcher;

export default class View extends React.Component {
    constructor(props) {
        super(props);
        var dispatcher = new Dispatcher();
        this.menuStore = new MenuStore(dispatcher, this.props.store);
        this.menuAction = new MenuAction(dispatcher, this.menuStore.getDispatchToken());
    }

    render(){
        return (
            <Menu
                store={this.props.store}
                action={this.props.action}
                menuStore={this.menuStore}
                menuAction={this.menuAction}
            />
        );
    }
}
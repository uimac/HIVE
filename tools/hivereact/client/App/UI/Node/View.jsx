import React from "react"
import ReactDOM from "react-dom"
import Core from '../../Core'

import NodeView from "./NodeView.jsx"
import NodePlugView from "./NodePlugView.jsx"
import Property from "./Property"
import Store from "./Store.jsx"
import Action from "./Action.jsx"
import NodeListCreate from "./NodeListCreate.jsx"

var Dispatcher = require("flux").Dispatcher;

/**
 * 全てのノードを内包するビュー.
 */
export default class View extends React.Component {
	constructor(props) {
		super(props);
		//var dispatcher =  new Dispatcher();
		this.nodeStore = new Store(this.props.action.dispatcher, this.props.store);
		this.nodeAction = new Action(this.props.action.dispatcher, this.nodeStore.getDispatchToken());
	}

	render () {
		return (<div style={{position:"absolute",width:"100%",height:"100%"}}>
					<NodeView
						store={this.props.store}
						action={this.props.action}
						nodeStore={this.nodeStore}
						nodeAction={this.nodeAction}
					/>
					<NodePlugView
						store={this.props.store}
						action={this.props.action}
						nodeStore={this.nodeStore}
						nodeAction={this.nodeAction}
					/>
					<Property.View
						store={this.props.store}
						action={this.props.action}
					/>
					<NodeListCreate
						store={this.props.store}
						action={this.props.action}
					/>
				</div>);
	}
}

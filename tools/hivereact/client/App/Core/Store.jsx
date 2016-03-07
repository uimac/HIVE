import EventEmitter from 'eventemitter3'
import Dispatcher from "./Dispatcher.jsx"
import Hive from "../HIVE"
import ActionExecuter from "./ActionExecutor.jsx"
import NodeSystem from "../NodeSystem"
import Constants from "./Constants.jsx"

export default class Store extends EventEmitter {
    constructor() {
        super();

        // private:
        this.data = {
            nodes : [], // 全てのノード
            plugs : []  // 全てのプラグ
        }

		this.actionExecuter = new ActionExecuter(this);
        this.dispatchToken = Dispatcher.register(this.actionExecuter.actionHandler.bind(this.actionExecuter));

		this.initHive = this.initHive.bind(this);
		this.getNodes = this.getNodes.bind(this);
		this.getNode = this.getNode.bind(this);
		this.getNodeNameList = this.getNodeNameList.bind(this);
		this.getDispatchToken = this.getDispatchToken.bind(this);
		this.getSelectedNodeList = this.getSelectedNodeList.bind(this);

		this.initHive(this.data);
	}

    // private:
	initHive(nodePlugData) {
		this.hive = new Hive();
		this.nodeSystem = new NodeSystem(nodePlugData, (nodeSystem) => {
			// initilized.
            this.hive.connect('ws://localhost:8080', '', true);
			this.emit(Constants.INITIALIZED, null);
		});
		this.hive.on(Hive.IMAGE_RECIEVED, (err, param, data) => {
			this.emit(Constants.IMAGE_RECIEVED, err, param, data);
		});
		this.nodeSystem.on(NodeSystem.SCRIPT_SERIALIZED, (script) => {
			//console.warn('SCRIPT>', script);
			this.hive.runScript(script);
		});
		this.nodeSystem.initEmitter(this);
	}

	/**
	 * dispatchTokenを返す.
	 */
	getDispatchToken() {
		return this.dispatchToken;
	}

	/**
	 * 全てのノードリストを返す
	 */
	getNodes() {
		return this.data.nodes;
	}

	/**
	 * 全てのプラグリストを返す
	 */
	getPlugs() {
		return this.data.plugs;
	}

	/**
	 * 特定のnodeとそのindexを返す.
	 */
	getNode(varname) {
		for (let i = 0; i < this.data.nodes.length; i = i + 1) {
			if (this.data.nodes[i].varname === varname) {
				return { node : this.data.nodes[i], index : i }
			}
		}
		return null;
	}

	/**
	 * ノード名リストを返す
	 */
	getNodeNameList() {
		let namelist = this.nodeSystem.GetNodeNameList();
		return namelist;
	}

	/**
	 * 初期ノード位置(固定)を返す
	 */
	getInitialNodePosition() {
		return ActionExecuter.initialData.node.pos;
	}

	/**
	 * 選択中のノードリストを返す.
	 */
	getSelectedNodeList() {
		let selected = [];
		for (let i = 0, size = this.data.nodes.length; i < size; i = i + 1) {
			if (this.data.nodes[i].select) {
				selected.push(this.data.nodes[i]);
			}
		}
		return selected;
	}
}

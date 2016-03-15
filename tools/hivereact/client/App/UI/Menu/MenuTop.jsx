import React from "react";
import ReactDOM from "react-dom";
import Core from '../../Core';
import RcMenu, {SubMenu, Item as MenuItem, Divider} from 'rc-menu';
//import velocity from 'velocity-animate';

// class
export default class MenuTop extends React.Component {
    constructor(props) {
        super(props);

        this.action = this.props.action;
        this.store = this.props.store;

        this.allClearNode = this.allClearNode.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.saveButton = this.saveButton.bind(this);
        this.loadButton = this.loadButton.bind(this);
        this.loadButtonClick = this.loadButtonClick.bind(this);
        this.exportSceneButton = this.exportSceneButton.bind(this);
        this.exportGroupButton = this.exportGroupButton.bind(this);
        this.importGroupButton = this.importGroupButton.bind(this);
        this.importButtonClick = this.importButtonClick.bind(this);

		this.state = {
			fileValue : "",
            importFileValue : ""
		};

        this.showConsole = props.consoleShow;
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);

	    this.editNodeCopy = this.editNodeCopy.bind(this);
	    this.editNodePaste = this.editNodePaste.bind(this);
	    this.editNodeDelete = this.editNodeDelete.bind(this);
	    this.editNodeMakeGroup = this.editNodeMakeGroup.bind(this);
		this.editNodeUnGroup = this.editNodeUnGroup.bind(this);
	    this.layoutAll = this.layoutAll.bind(this);
	    this.layoutNode = this.layoutNode.bind(this);
	    this.layoutPanel = this.layoutPanel.bind(this);
	    this.layoutPanelNode = this.layoutPanelNode.bind(this);
    }

	componentDidMount() {
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.onKeyDown);
		window.removeEventListener('keyup', this.onKeyUp);
	}

	onKeyUp(ev) {
		this.isCtrlDown = ev.ctrlKey;
	}

	onKeyDown(ev) {
		if (ev.target && ev.target.tagName.toLowerCase() === "input") { return; }
		this.isCtrlDown = ev.ctrlKey;
		if (this.isCtrlDown && ev.keyCode === 67) { // "c"
			this.editNodeCopy();
		}
		if (this.isCtrlDown && ev.keyCode === 86) { // "v"
			this.editNodePaste();
		}
		if (this.isCtrlDown && ev.keyCode === 71) { // "g"
			this.editNodeMakeGroup();
		}
		if (this.isCtrlDown && ev.keyCode === 85) { // "u"
			this.editNodeUnGroup();
		}
		if (this.isCtrlDown && ev.keyCode === 83) { // "s"
			this.props.action.save();
		}
		if (this.isCtrlDown && ev.keyCode === 79) { // "o"
			this.loadButtonClick();
		}
		if (ev.keyCode === 39) { // "→"
			this.props.action.changeFrame(this.props.store.getCurrentFrame() + 1)
		}
		if (ev.keyCode === 37) { // "→"
			this.props.action.changeFrame(this.props.store.getCurrentFrame() - 1)
		}
		if (ev.keyCode === 46) { // delete
			this.editNodeDelete();
		}
	}

    allClearNode(disableConfirm){
        var flg = true;
        if(!disableConfirm){flg = confirm('really?');}
        if(flg){
            let nodes = this.props.store.getNodes();
            let plugs = this.props.store.getPlugs();
            for(let i = plugs.length - 1; i >= 0; --i){
                this.props.action.deletePlug(plugs[i]);
            }
            for(let i = nodes.length - 1; i >= 0; --i){
                this.props.action.deleteNode(nodes[i].varname);
            }
            return true;
        }else{
            return false;
        }
    }
    saveButton(eve){
		this.props.action.save();
    }
    loadButtonClick(){
        var e = ReactDOM.findDOMNode(this.refs.inputFile);
        e.click();
    }
    loadButton(eve){
        if(eve.currentTarget.files && eve.currentTarget.files.length > 0){
            var reader = new FileReader();
            reader.onload = function(){
                let data = (JSON.parse(reader.result));
				this.props.action.load(data);
				this.setState({
					fileValue : ""
				});
            }.bind(this);
            reader.readAsText(eve.currentTarget.files[0]);
        }
    }
    exportSceneButton(eve){
        this.props.action.exportSceneScript();
    }

    exportGroupButton(eve){
        let path = this.store.getNodePath();
        if (path.length === 0) {
            this.props.action.exportGroupNode();
        } else {
            console.log('EEEE', path);
            this.props.action.exportGroupNode(path[path.length - 1]);
        }
    }

    importButtonClick(){
        var e = ReactDOM.findDOMNode(this.refs.importFile);
        e.click();
    }
    importGroupButton(eve){
        let reader = new FileReader();
        reader.onload = function(){
            let data = (JSON.parse(reader.result));
            this.props.action.importGroupNode(data);
            this.setState({
                importFileValue : ""
            });
        }.bind(this);
        reader.readAsText(eve.currentTarget.files[0]);
    }

    // Edit menu
    editNodeCopy() { this.props.action.copy(); }
    editNodePaste() { this.props.action.paste(); }
    editNodeDelete() { this.props.action.delete(); }
    editNodeMakeGroup() { this.props.action.makeGroup(); }
	editNodeUnGroup() { this.props.action.unGroup(); }

    // Layout menu
    layoutAll() { this.props.action.setLayout('all'); }
    layoutNode() { this.props.action.setLayout('node'); }
    layoutPanel() { this.props.action.setLayout('panel'); }
    layoutPanelNode() { this.props.action.setLayout('panelnode'); }

    // Window menu
    windowToggleConsoleOutput() {
        this.showConsole = !this.showConsole;
        this.props.action.showConsoleOutput(this.showConsole);
    }

    // ここでメニュー操作時の動作を定義
    // info のなかの key を見て分岐したりする
    handleClick(info){
        let key = parseInt(info.key, 10);
        if (this.hasOwnProperty(info.key)) {
            this[info.key](info.value);
        } else {
            console.error("Unknown menu command", info);
        }
    }

    // render
    render(){
        // ここでメニューの構造定義
        const horizontalMenu = React.cloneElement((
            <RcMenu onClick={this.handleClick}>
                <SubMenu title={<span>File</span>} key="file">
                    <MenuItem key="loadButtonClick">Load</MenuItem>
                    <MenuItem key="saveButton">Save</MenuItem>
                    <MenuItem key="allClearNode">Clear all</MenuItem>
                    <MenuItem >-----------------------</MenuItem>
                    <MenuItem key="importButtonClick">Import group</MenuItem>
                    <MenuItem key="exportGroupButton">Export Current group</MenuItem>
                    <MenuItem >-----------------------</MenuItem>
                    <MenuItem key="exportSceneButton">Export Scene Script</MenuItem>

                </SubMenu>
                <SubMenu title={<span>Edit</span>} key="edit">
                    <MenuItem key="editNodeCopy">Copy</MenuItem>
                    <MenuItem key="editNodePaste">Paste</MenuItem>
                    <MenuItem key="editNodeDelete">Delete</MenuItem>
                    <MenuItem key="editNodeMakeGroup">MakeGroup</MenuItem>
					<MenuItem key="editNodeUnGroup">UnGroup</MenuItem>
                </SubMenu>
                <SubMenu title={<span>Layout</span>} key="layout">
                    <MenuItem key="layoutAll">All</MenuItem>
                    <MenuItem key="layoutNode">Node mode</MenuItem>
                    <MenuItem key="layoutPanel">Panel mode</MenuItem>
					<MenuItem key="layoutPanelNode">Panel Node mode</MenuItem>
                </SubMenu>
                <SubMenu title={<span>Window</span>} key="Window">
                    <MenuItem key="windowToggleConsoleOutput">Console Output</MenuItem>
                </SubMenu>
                </RcMenu>
        ), {
            mode: 'horizontal',
            openAnimation: 'slide-up',
            openSubMenuOnMouseEnter: false,
            closeSubMenuOnMouseLeave: false
        });

        let style = {
            width: "100%",
            // position: "absolute",
            // top: "0px",
            // left: "0px",
            zIndex: "99999"
        };
        return (
            <div style={{position: "relative", width: "100%", zIndex: "99999"}}>
                <div style={style}>{horizontalMenu}</div>
                <input type="file" ref="inputFile" style={{display: "none"}} value={this.state.fileValue} onChange={this.loadButton} />
                <input type="file" ref="importFile" style={{display: "none"}} value={this.state.importFileValue} onChange={this.importGroupButton} />
            </div>
        );
    }
}

/*
// ユーティリティ類の定義
const animation = {
    enter(node, done) {
        let ok = false;
        function complete() {
            if (!ok) {
                ok = 1;
                done();
            }
        }
        node.style.display = 'none';
        velocity(node, 'slideDown', {
            duration: 300,
            complete: complete,
        });
        return {
            stop() {
                velocity(node, 'finish');
                // velocity complete is async
                complete();
            },
        };
    },

    appear() {
        return this.enter.apply(this, arguments);
    },

    leave(node, done) {
        let ok = false;
        function complete() {
            if (!ok) {
                ok = 1;
                done();
            }
        }
        node.style.display = 'block';
        velocity(node, 'slideUp', {
            duration: 300,
            complete: complete,
        });
        return {
            stop() {
                velocity(node, 'finish');
                // velocity complete is async
                complete();
            },
        };
    },
};
*/

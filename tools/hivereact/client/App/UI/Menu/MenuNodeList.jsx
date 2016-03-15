import React from "react";
import ReactDOM from "react-dom";
import Core from '../../Core';

export default class MenuNodeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nodes: null,
            nodeList: this.props.store.getNodeNameList()
        };

        this.styles = this.styles.bind(this);
        this.floating = (this.props.floating !== undefined) && this.props.floating;
        this.unFocus = this.unFocus.bind(this);
        this.props.store.on(Core.Constants.INITIALIZED, (()=>{
            this.setState({nodeList: this.props.store.getNodeNameList()});
        }).bind(this));
    }

    onClick(eve){
        var e = eve.currentTarget;
        this.props.action.addNodeByName(e.value);
        this.unFocus();
        if(this.props.hiddenFunction){this.props.hiddenFunction();}
    }

    unFocus(){
        var e = ReactDOM.findDOMNode(this.refs.select);
        e.selectedIndex = -1;
    }

    styles() {
	console.log("this.props.floating",this.props.floating)
        if(this.floating){
            return {
                block: {
                    // backgroundColor: "rgba(0, 0, 0, 0.7)",
                    textAlign: "center",
                    margin: "0px",
                    padding: "0px",
                    width: "248px",
                    height: "218px",
                    overflow: "auto"
                },
                select: {
                    backgroundColor: "transparent",
                    border: "none",
                    color: "turquoise",
                    fontSize: "large",
                    margin: "0px auto",
                    padding: "0px",
                    width: "240px",
                    minHeight: "100%",
                    overflow: "visible"
                },
                list: {
                    // backgroundColor: "rgba(128, 128, 128, 0.5)",
                    backgroundColor: "#444",
                    borderRadius: "3px",
                    color: "rgb(32, 255, 220)",
                    fontSize: "small",
                    textAlign: "left",
                    lineHeight: "24px",
                    margin: "3px 2px",
                    padding: "2px",
                    width: "236px",
                    height: "24px",
                    overflow: "auto",
                    textShadow: "0px 0px 3px #022",
                    boxShadow: "0px 0px 5px -2px white",
                    cursor: "pointer"
                }
            };
        }else{
            return {
                block: {
                    margin: "0px",
                    padding: "0px",
                    width: "100%",
                    height: "248px",
                    overflow: "auto"
                },
                select: {
                    backgroundColor: "transparent",
                    border: "none",
                    color: "turquoise",
                    fontSize: "large",
                    margin: "0px",
                    padding: "0px",
                    height: "100%",
                    overflow: "visible"
                },
                list: {
                    // backgroundColor: "rgba(128, 128, 128, 0.5)",
                    backgroundColor: "#444",
                    borderRadius: "3px",
                    color: "rgb(32, 255, 220)",
                    fontSize: "12px",
                    lineHeight: "20px",
                    margin: "3px",
                    padding: "2px",
                    width: "250px",
                    height: "20px",
                    overflow: "hidden",
                    textShadow: "0px 0px 3px #022",
                    boxShadow: "0px 0px 5px -2px white",
                    cursor: "pointer"
                }
            };
        }
    }

    generator(value, key){
        const style = this.styles();
        return (
            <option style={style.list} key={key} value={value} onClick={this.onClick.bind(this)}>{"・" + value}</option>
        );
    }

    render(){
        const style = this.styles();
        return (
            <div style={style.block}>
                <select ref="select" style={style.select} size={this.state.nodeList.length}>
                    {this.state.nodeList.map(this.generator.bind(this))}
                </select>
            </div>
        );
    }
}

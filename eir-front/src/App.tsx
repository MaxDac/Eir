import React from 'react';
import logo from './symbol.png';
import './App.css';
import MenuComponent from "./components/menu";
import {Route, Switch, withRouter} from "react-router";
import {DataComponentProps} from "./base/base";
import CharacteristicsComponent, {HelpType} from "./components/help/characteristics-component";
import {DefaultDataGetter} from "./base/data-getter";
import {backEndUrl} from "./base/configuration";
import {SheetCreationComponent} from "./components/sheet-creation/sheet-creation-component";

class AppComponent extends React.Component<DataComponentProps, any> {
    constructor(props: DataComponentProps) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <div className="App-menu">
                    <MenuComponent></MenuComponent>
                </div>
                <div className="App-header">
                    <Switch>
                        <Route path="/help/characteristics">
                            <CharacteristicsComponent getter={this.props.getter} type={HelpType.Characteristics} />
                        </Route>
                        <Route path="/help/abilities">
                            <CharacteristicsComponent getter={this.props.getter} type={HelpType.Abilities} />
                        </Route>
                        <Route path="/sheet/creation">
                            <SheetCreationComponent/>
                        </Route>
                        <Route path="/">
                            <header>
                                <img src={logo} className="App-logo" alt="logo"/>
                                <p>
                                    Edit <code>src/App.tsx</code> and save to reload.
                                </p>
                                <a
                                    className="App-link"
                                    href="https://reactjs.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Learn React
                                </a>
                            </header>
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }
}

const getter = new DefaultDataGetter(backEndUrl());

const appGetter = (props: any) => {
    return <AppComponent getter={getter}></AppComponent>;
};

const App = withRouter(appGetter);

export default App;

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Main } from "./pages/Main";
import { Users } from "./pages/Users";
import { IConfig } from "./entity/config";
import firebase from "firebase";
import { Header } from "./Header";
import { Email } from "./pages/Email";

const config: IConfig = require("./config/config.json");
export const fb = firebase;
fb.initializeApp(config.firebase);
fb.auth().signInWithEmailAndPassword(config.user.email, config.user.password);

export const App = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path={"/"} component={Main} />
                <Route path={"/users"} component={Users} />
                <Route path={"/email"} component={Email} />
            </Switch>
        </Router>
    );
};

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HTTPS } from "./pages/HTTPS";
import { IConfig } from "./entity/config";
import firebase from "firebase";
import { Header } from "./components/Header";
import { Storage } from "./pages/Storage";
import { Auth } from "./pages/Auth";
import { Database } from "./pages/Database";

const config: IConfig = require("./config/config.json");
export const fb = firebase;
fb.initializeApp(config.firebase);
fb.auth().signInWithEmailAndPassword(config.user.email, config.user.password);

export const App = () => {
    return (
        <Router>
            <Header />
            <Switch>
                <Route exact path={"/"} component={HTTPS} />
                <Route path={"/auth"} component={Auth} />
                <Route path={"/storage"} component={Storage} />
                <Route path={"/database"} component={Database} />
            </Switch>
        </Router>
    );
};

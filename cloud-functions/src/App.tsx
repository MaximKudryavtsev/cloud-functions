import React, {useEffect, useState} from 'react';
import './App.css';
import { Card, TextField, Button } from "@material-ui/core";
import { css } from "emotion";
import firebase from "firebase";

const styles = {
    container: css` margin: 0 auto; position: relative; height: 100vh; padding: 50px;`,
    card: css`width: 600px; margin: 0 auto; padding: 50px; display: flex; flex-direction: column;`,
    input: css`margin-bottom: 20px !important`
};

firebase.initializeApp({
    apiKey: "example",
    authDomain: "example",
    databaseURL: "example",
    projectId: "example",
    storageBucket: "example",
    messagingSenderId: "example",
    appId: "example",
    measurementId: "example"
});
firebase.auth().signInWithEmailAndPassword("example", "example")

function App() {
  const [value, setValue] = useState("");
  const [list, setList] = useState<string[]>([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
  }

  useEffect(() => {
      firebase.database().ref("comments").once("value").then((snapshot) => {
          const data = Object.values(snapshot.val())
          setList(data.map((item: any) => item.comment));
      })
  }, []);

  const onClick = () => {
      const newKey = firebase.database().ref().child('posts').push().key;
      firebase.database().ref(`comments/${newKey}`).set({
          comment: value
      }).then(() => {setValue(""); firebase.database().ref("comments").once("value").then((snapshot) => {
          const data = Object.values(snapshot.val())
          setList(data.map((item: any) => item.comment));
      })});
  }

  return (
    <div className={styles.container}>
        <ul>{list.map((item, index) => <li key={index}>{item}</li>)}</ul>
      <Card className={styles.card} variant="outlined">
        <TextField value={value} onChange={onChange} className={styles.input} />
        <Button color="primary" variant="contained" onClick={onClick}>Submit</Button>
      </Card>
    </div>
  );
}

export default App;

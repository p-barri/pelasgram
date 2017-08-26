import React, { Component } from 'react';
import firebase from 'firebase';

import FileUpload from './FileUpload';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor () {
        //super es constructor de Component. Como parent en php.
        super();
        this.state = {
            user: null,
            pictures: [],
            uploadValue: 0
        };

        this.handleAuth = this.handleAuth.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.renderLoginButton = this.renderLoginButton.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    //de ciclo de vida. Se llama cuando el componente se renderizo.
    componentWillMount () {
        firebase.auth().onAuthStateChanged(user => {
            this.setState({ user });
        });

        firebase.database().ref('pictures').on('child_added', snapshot => {
            this.setState({
               pictures: this.state.pictures.concat(snapshot.val())
            });
        });
    }

    handleAuth () {
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider)
            .then(result => console.log(`${result.user.email} ha iniciado sesion`))
            .catch(error => console.log(`Error ${error.code}: ${error.message}`));
    }

    handleLogout () {
        firebase.auth().signOut()
            .then(result => console.log(`Usuario ha salido`))
            .catch(error => console.log(`Error ${error.code}: ${error.message}`));
    }

    renderLoginButton () {
        if (this.state.user) {
            return (
                <div>
                    <img width={100} src={this.state.user.photoURL} alt={this.state.user.displayName} />
                    <p>Hola {this.state.user.displayName}!</p>
                    <button onClick={ this.handleLogout }>Logout</button>
                    <FileUpload onUpload={this.handleUpload} uploadValue={this.state.uploadValue}/>

                    {
                        this.state.pictures.map(picture => (
                            <div>
                                <img src={picture.image} alt=""/>
                                <br/>
                                <img src={picture.photoURL} alt={picture.displayName}/>
                                <br/>
                                <span>{picture.displayName}</span>
                            </div>
                        )).reverse()
                    }
                </div>
            );
        } else {
            return(
                <button onClick={this.handleAuth}>Login con Google</button>
            );
        }

    }

    handleUpload (event) {
        const file = event.target.files[0];
        const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
        const task = storageRef.put(file);

        task.on('state_changed', snapshot => {
            console.log('Inicio carga');
            let percetange = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100;

            this.setState({
                uploadValue: percetange
            });
        }, error => {
            console.log(error.message);
        }, () => {
            console.log('Termino carga');
            const record = {
                photoURL: this.state.user.photoURL,
                displayName: this.state.user.displayName,
                image: task.snapshot.downloadURL
            };

            const dbRef = firebase.database().ref('pictures');
            const newPicture = dbRef.push();

            newPicture.set(record);
        })
    }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to pelasgram</h2>
        </div>
        <div className="App-intro">
            { this.renderLoginButton() }
        </div>
      </div>
    );
  }
}

export default App;

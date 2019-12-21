import React, { Component } from 'react';
import './App.css';
import UserList from './UserList';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: []
        };
    }

    //更新本地缓存
    setUserList(userList) {
        this.setState({
            userList: userList
        });
        // this.state.userList = userList;
        //console.log(this.state.userList)
    }
    getUserList() { }

    render() {
        return (
            <div>
                {/* <UserForm setUserList={(userList) => this.setUserList(userList)} />
                <UserTable userList={this.state.userList} /> */}
                <UserList />
            </div>
        )
    }
}
export default App;
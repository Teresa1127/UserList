import React from 'react';
import { Table, Form, Tag, Button } from 'element-react';
import 'element-theme-default';
import storage from './storage';

class UserTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    type: 'index'
                },
                {
                    type: 'expand',
                    label: "详情",
                    expandPannel: function (data) {
                        return (
                            <Form>
                                <Form.Item label="姓名"><span>{data.name}</span></Form.Item>
                                <Form.Item label="年龄"><span>{data.age}</span></Form.Item>
                                <Form.Item label="性别"><span>{data.sex}</span></Form.Item>
                                <Form.Item label="头像"><span>{data.img}</span></Form.Item>
                            </Form>
                        )
                    }
                },
                {
                    label: "姓名",
                    prop: "name",
                    width: 180,
                    render: function (userList) {
                        return <Tag>{userList.name}</Tag>
                    }
                },
                {
                    label: "操作",
                    prop: "address",
                    render: (index) => {
                        return (
                            <span>
                                <Button plain={true} type="info" size="small">编辑</Button>
                                <Button type="danger" size="small" onClick={this.deleteRow.bind(this, index)}>删除</Button>
                            </span>
                        )
                    }
                }
            ],
            userList: []
        }
    }

    //生命周期函数 页面加载就会触发
    componentDidMount() {
        //获取本地缓存的用户列表
        let userList = storage.get("UserList");
        if (userList) {
            this.setState({
                userList: userList
            })
        }
    }
    //新增用户后props变更
    componentWillReceiveProps(nextProps) {
        if (nextProps.userList !== this.props.userList){
            this.setState({
                userList: this.props.userList
            });
        }
        //console.log(this.props.userList);
        
        console.log(this.props.userList);
    }
    //删除数据
    deleteRow(index) {
        const { userList } = this.state;
        userList.splice(index, 1);
        this.setState({
            userList: [...userList]
        })
        //更新本地缓存
        storage.set("UserList", userList);
    }

    render() {
        return (
            <div>
                <Table
                    style={{ width: '500px' }}
                    columns={this.state.columns}
                    data={this.state.userList}
                    highlightCurrentRow={true}
                />
            </div>
        )
    }
}
export default UserTable;

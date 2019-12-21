import React from 'react';
import { Button, Dialog, Input, Form, Table, Tag } from 'element-react';
import 'element-theme-default';
import storage from './storage';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                name: '',
                age: '',
                sex: '',
                img: ''
            },
            userList: [],
            dialogVisible: false,
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
                    render: (row, column, index) => {
                        return (
                            <span>
                                <Button plain={true} type="info" size="small">编辑</Button>
                                <Button type="danger" size="small" onClick={this.deleteRow.bind(this, index)}>删除</Button>
                            </span>
                        )
                    }
                }
            ]
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
        //console.log(userList);
    }
    //提交表单
    addUser = () => {
        let userList = storage.get("UserList") || [];
        userList.push({
            name: this.state.form.name,
            age: this.state.form.age,
            sex: this.state.form.sex,
            img: this.state.form.img
        })
        this.setState({
            userList: userList,
            dialogVisible: false
        });
        //更新缓存中用户列表
        storage.set("UserList", userList);
        //重置表单
        this.refs.form.resetFields();
    }
    //更新state
    onChange(key, value) {
        this.setState({
            form: Object.assign({}, this.state.form, { [key]: value })
        });
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
            <div><Button type="primary" onClick={() => this.setState({ dialogVisible: true })}>新增</Button>
                <Dialog
                    size="tiny"
                    title="新增用户"
                    visible={this.state.dialogVisible}
                    onCancel={() => this.setState({ dialogVisible: false })}
                >
                    <Dialog.Body>
                        <Form ref="form" model={this.state.form}>
                            <Form.Item label="姓名" labelWidth="40" prop="name">
                                <Input placeholder="请输入姓名" value={this.state.form.name} onChange={this.onChange.bind(this, 'name')} />
                            </Form.Item>
                            <Form.Item label="年龄" labelWidth="40" prop="age">
                                <Input placeholder="请输入年龄" value={this.state.form.age} onChange={this.onChange.bind(this, 'age')} />
                            </Form.Item>
                            <Form.Item label="性别" labelWidth="40" prop="sex">
                                <Input placeholder="请输入性别" value={this.state.form.sex} onChange={this.onChange.bind(this, 'sex')} />
                            </Form.Item>
                            <Form.Item label="上传头像" prop="img">

                            </Form.Item>
                        </Form>
                    </Dialog.Body>

                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => { this.refs.form.resetFields(); this.setState({ dialogVisible: false }) }}>取 消</Button>
                        <Button type="primary" onClick={this.addUser}>确 定</Button>
                    </Dialog.Footer>
                </Dialog>
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
export default UserList;
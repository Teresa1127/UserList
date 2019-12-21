import React from 'react';
import { Button, Dialog, Input, Form, Table, Tag, Radio } from 'element-react';
import 'element-theme-default';
import storage from './storage';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updated: false,
            form: {
                name: '',
                age: '',
                sex: '男',
                img: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            let reg = /^[\u4e00-\u9fa5a-zA-Z]{1,8}$/;
                            if (value && value.length > 0) {
                                if (!reg.test(value)) {
                                    callback([new Error('姓名输入不合法')]);
                                } else {
                                    callback();
                                }
                            } else if (value.length === 0) {
                                callback();
                            } else {
                                callback(new Error('姓名输入不合法'));
                            }
                        }
                    }
                ],
                age: [
                    { required: true, message: '请输入年龄', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            let reg = /^\d{1,3}$/;
                            if (value && value.length > 0) {
                                if (!reg.test(value)) {
                                    callback([new Error('年龄输入不合法')]);
                                } else {
                                    callback();
                                }
                            } else if (value.length === 0) {
                                callback();
                            } else {
                                callback(new Error('年龄输入不合法'));
                            }
                        }
                    }
                ],
                sex: [
                    { required: true, trigger: 'blur' },
                ]
            },
            userList: [],
            dialogVisible: false,
            imageUrl: '',
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
                                {/* <Form.Item label="头像"><span>{data.img}</span></Form.Item> */}
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
                                {/* <Button plain={true} type="info" size="small" onClick={this.update.bind(this, row, index)}>编辑</Button> */}
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
    //性别
    onSexChange(value) {
        console.log(value)
        let { name, age } = this.state.form;
        this.setState({
            form: {
                name: name,
                age: age,
                sex: value
            }
        });
    }
    //提交表单
    addUser = () => {
        let userList = storage.get("UserList") || [];
        if (!this.state.updated) {
            userList.push({
                name: this.state.form.name,
                age: this.state.form.age,
                sex: this.state.form.sex,
                img: this.state.form.img
            })
        }
        this.setState({
            userList: userList,
            dialogVisible: false,
        });
        //更新缓存中用户列表
        storage.set("UserList", userList);
        //重置表单
        //this.refs.form.resetFields();
    }
    //更新state
    onChange(key, value) {
        this.setState({
            form: Object.assign({}, this.state.form, { [key]: value })
        });
    }
    //删除数据
    deleteRow(index) {
        let { userList } = this.state;
        userList.splice(index, 1);
        this.setState({
            userList: [...userList]
        })
        //更新本地缓存
        storage.set("UserList", userList);
    }
    //修改数据
    update(row, index) {
        //更新userList
        let { userList } = this.state;
        userList[index] = row;

        this.setState({
            dialogVisible: true,
            updated: true,
            form: {
                name: row.name,
                age: row.age,
                sex: row.sex
            },
            userList: [...userList]
        });
    }
    //图片上传
    handleAvatarScucess(res, file) {
        console.log(res)
        this.setState({ imageUrl: URL.createObjectURL(file.raw) });
    }
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
            alert('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
            alert('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
    }

    render() {
        // const { imageUrl } = this.state;
        return (
            <div><Button type="primary" onClick={() => {this.refs.form.resetFields(); this.setState({ dialogVisible: true, updated: false })}}>新增</Button>
                <Dialog
                    size="tiny"
                    title={this.state.updated ? "修改用户" : "新增用户"}
                    visible={this.state.dialogVisible}
                    onCancel={() => this.setState({ dialogVisible: false })}
                >
                    <Dialog.Body>
                        <Form ref="form" model={this.state.form} rules={this.state.rules}>
                            <Form.Item label="姓名" labelWidth="60" prop="name">
                                <Input placeholder="请输入姓名" value={this.state.form.name} onChange={this.onChange.bind(this, 'name')} />
                            </Form.Item>
                            <Form.Item label="年龄" labelWidth="60" prop="age">
                                <Input placeholder="请输入年龄" value={this.state.form.age} onChange={this.onChange.bind(this, 'age')} />
                            </Form.Item>
                            <Form.Item label="性别" labelWidth="60" prop="sex">
                                <Radio value="男" checked={this.state.form.sex === "男"} onChange={this.onSexChange.bind(this)}>男</Radio>
                                <Radio value="女" checked={this.state.form.sex === "女"} onChange={this.onSexChange.bind(this)}>女</Radio>
                            </Form.Item>
                            {/* <Form.Item label="上传头像" prop="img">
                                <Upload
                                    action="http://localhost:3000/"
                                    showFileList={false}
                                    onSuccess={(res, file) => this.handleAvatarScucess(res, file)}
                                    beforeUpload={file => this.beforeAvatarUpload(file)}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="img" className="avatar" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                </Upload>
                            </Form.Item> */}
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
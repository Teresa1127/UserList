import React from 'react';
import { Button, Dialog, Input, Form, Upload } from 'element-react';
import 'element-theme-default';
import storage from './storage';

class UserForm extends React.Component {
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
            imageUrl: ''
        };
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
        //传递缓存数据给父组件
        this.props.setUserList(userList);
        //重置表单
        this.refs.form.resetFields();
        //检验
        // console.log(storage.get("UserList"))
    }
    //更新state
    onChange(key, value) {
        this.setState({
            form: Object.assign({}, this.state.form, { [key]: value })
        });
    }
    handleAvatarScucess(res, file) {
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
        const { imageUrl } = this.state;
        return (
            <div>
                <Button type="primary" onClick={() => this.setState({ dialogVisible: true })}>新增</Button>
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
                                <Upload
                                    action="./img"
                                    showFileList={false}
                                    onSuccess={(res, file) => this.handleAvatarScucess(res, file)}
                                    beforeUpload={file => this.beforeAvatarUpload(file)}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="img" className="avatar" /> : <i className="el-icon-plus avatar-uploader-icon"></i>}
                                </Upload>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>

                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => { this.refs.form.resetFields(); this.setState({ dialogVisible: false }) }}>取 消</Button>
                        <Button type="primary" onClick={this.addUser}>确 定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }
}
export default UserForm;

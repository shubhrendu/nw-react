import './App.css';
import { Button, Form, Input, message } from 'antd';
import 'antd/dist/antd.css';
import { useRef, useState } from 'react';
import { w3cwebsocket } from "websocket";

function App() {
  const [form] = Form.useForm();
  const [isConnected, setConnected] = useState(false);
  const [serverMessage, setServerMessage] = useState();
  const client = useRef();

  const onFinish = (values) => {
    console.log('Success:', values);
    const server = values.server;
    client.current = new w3cwebsocket(`ws://${server}`);
    client.current.onopen = () => {
      console.log('Websocket Client Connected');
      setConnected(true);
    }
    client.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setServerMessage(data.data.editorContent);
    }
  };

  return (
    <div className="App">
      <h1>Cross Machine Communication -- Client</h1>
      <Form
      layout='inline'
      onFinish={onFinish}
      >
        <Form.Item
          label="Connect to server"
          name="server"
          rules={[{ required: true, message: 'Please input server address!' }]}
        >
          <Input placeholder='eq. 127.01.10.11:3000' disabled={isConnected} addonBefore="ws://" />
        </Form.Item>

        <Form.Item>
          {!isConnected && <Button type="primary" htmlType="submit">
            Connect
          </Button>}
          {isConnected && <Button onClick={() => setConnected(false)}>
            Disconnect
          </Button>}        
        </Form.Item>
      </Form>
      {isConnected && <h4 style={{"textAlign": "left", "marginLeft": "15px", "marginTop": "10px"}}>Connected to WebSocket server successfully.</h4>}

      {isConnected && 
      <Form
        form={form}
        layout='inline'
        initialValues={{ message: "Hi server..." }}
        onFinish={(values) => {
          client.current.send(JSON.stringify({
            content: values.message
          }));
          message.info("Message: '" + values.message + "' sent successfully.");
        }}
        >
        <Form.Item
          label="Message"
          name="message"
          rules={[{ required: true, message: 'Please input message!' }]}
        >
          <Input placeholder='Type message to send' />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send
          </Button>               
        </Form.Item>
      </Form>}

      {isConnected && serverMessage && <h4 style={{"textAlign": "left", "marginLeft": "15px", "marginTop": "10px"}}>Message from server: {serverMessage}</h4>}
    </div>
  );
}

export default App;

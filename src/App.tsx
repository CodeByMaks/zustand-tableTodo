import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Modal, Select, Checkbox } from 'antd';
import useStore, { iTodo } from './store/store';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface EditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (todo: { title: string; description: string }) => void;
  initialValues?: { title: string; description: string };
}

const EditModal: React.FC<EditModalProps> = ({ visible, onCancel, onSave, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  // Сброс полей при изменении initialValues
  useEffect(() => {
    if (visible) {
      setTitle(initialValues?.title || '');
      setDescription(initialValues?.description || '');
    }
  }, [visible, initialValues]);

  const handleSave = () => {
    onSave({ title, description });
    onCancel();
  };

  return (
    <Modal
      title="Edit Todo"
      visible={visible}
      onOk={handleSave}
      onCancel={onCancel}
    >
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </Modal>
  );
};

const App: React.FC = () => {
  const {
    todos,
    addTodo,
    editTodo,
    deleteTodo,
    toggleTodo,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  } = useStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<iTodo | null>(null);

  const handleAddTodo = () => {
    setIsModalVisible(true);
    setEditingTodo(null);
  };

  const handleEditTodo = (todo: iTodo) => {
    setIsModalVisible(true);
    setEditingTodo(todo);
  };

  const handleSaveTodo = (values: { title: string; description: string }) => {
    if (editingTodo) {
      // Передаём ID и обновлённые данные
      editTodo(editingTodo.id, values);
    } else {
      addTodo(values);
    }
    setIsModalVisible(false);
  };

  const filteredTodos = todos
    .filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((todo) =>
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? todo.completed
        : !todo.completed
    );

  const columns: ColumnsType<iTodo> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'completed',
      key: 'completed',
      render: (_, record) => (
        <Checkbox
          checked={record.completed}
          onChange={() => toggleTodo(record.id)}
        >
          {record.completed ? 'Completed' : 'Pending'}
        </Checkbox>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => handleEditTodo(record)}>Edit</Button>
          <Button danger onClick={() => deleteTodo(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Todo List with Zustand</h1>
      <div style={{ marginBottom: 20 }}>
        <Search
          placeholder="Search todos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200, marginRight: 10 }}
        />
        <Select
          value={filterStatus}
          onChange={(value) => setFilterStatus(value)}
          style={{ width: 120 }}
        >
          <Option value="all">All</Option>
          <Option value="completed">Completed</Option>
          <Option value="pending">Pending</Option>
        </Select>
        <Button type="primary" onClick={handleAddTodo} style={{ float: 'right' }}>
          Add Todo
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredTodos} rowKey="id" />
      <EditModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSaveTodo}
        initialValues={editingTodo || undefined}
      />
    </div>
  );
};

export default App;
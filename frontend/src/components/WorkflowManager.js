import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Helmet } from 'react-helmet';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function WorkflowManager() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', assigned_to: '' });
  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      if (!newTask.title || !newTask.assigned_to) {
        setError('Title and Assigned To fields are required');
        return;
      }

      const response = await axios.post('/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', assigned_to: '' });
      setError(null); // Clear error after successful creation
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating task');
      console.error('Error creating task', error);
    }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      const updatedTask = tasks.find(task => task.id === taskId);

      const formData = new FormData();
      formData.append('title', updatedTask.title);
      formData.append('description', updatedTask.description);
      formData.append('status', updatedTask.status);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await axios.put(`/tasks/${taskId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Task updated successfully');
      setSelectedFile(null); // Clear the selected file after upload
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating task');
      console.error('Error updating task', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
      setError(null); // Clear error after successful deletion
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting task');
      console.error('Error deleting task', error);
    }
  };

  const handleSubmitFeedback = async (taskId) => {
    try {
      const feedbackText = feedbackInputs[taskId] || '';
      if (!feedbackText) {
        setError('Feedback text is required');
        return;
      }

      const response = await axios.post(`/tasks/${taskId}/feedback`, { feedback: feedbackText });
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            feedback: [...(task.feedback || []), response.data.feedback]
          };
        }
        return task;
      });
      setTasks(updatedTasks);
      setFeedbackInputs({ ...feedbackInputs, [taskId]: '' });
      setError(null); // Clear error after successful feedback submission
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting feedback');
      console.error('Error submitting feedback', error);
    }
  };

  const handleFeedbackInputChange = (taskId, value) => {
    setFeedbackInputs({ ...feedbackInputs, [taskId]: value });
  };

  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };

  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <div className="workflow-manager">
      <Helmet>
        <title>ContentCraft | Workflow Manager</title>
      </Helmet>
      <div id="mySidenav" className="sidenav">
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>&times;</a>
        <ul>
          <li><Link to="/about"><FaHome style={{ marginRight: '8px' }} />Home</Link></li>
          <br />
          <li><Link to="/generate">Content Generation</Link></li>
          <br />
          <li><Link to="/optimize">Content Optimization</Link></li>
          <br />
          <li><Link to="/workflow">Content Workflow</Link></li>
          <br />
          <li><a href="#" onClick={handleLogout}><FaSignOutAlt style={{ marginRight: '8px' }} />Logout</a></li>
        </ul>
      </div>
      <span style={{ fontSize: "30px", cursor: "pointer", marginLeft: "20px", marginTop: "10px" }} onClick={openNav}>&#9776;</span>
      <div className="workflow">
        <h1>Workflow Manager</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="new-task">
          <h2>Create New Task</h2>
         
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />&nbsp;
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />&nbsp;
          <input
            type="text"
            placeholder="Assign To"
            value={newTask.assigned_to}
            onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
          />&nbsp; &nbsp;
          <button onClick={handleCreateTask}>Create Task</button>
        </div>
        <div className="tasklist">
          <h2>Tasks</h2>
          {tasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks assigned yet</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="taskitem">
                
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Assigned to: {task.assigned_to}</p>
                <p>Status: {task.status}</p>
                <input
                  type="text"
                  placeholder="Update title"
                  value={task.title}
                  onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, title: e.target.value } : t))}
                />&nbsp;
                <input
                  type="text"
                  placeholder="Update description"
                  value={task.description}
                  onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, description: e.target.value } : t))}
                />&nbsp;
                <select
                  value={task.status}
                  onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, status: e.target.value } : t))}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>&nbsp;
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <center>
                  <button onClick={() => handleUpdateTask(task.id)}>Update Task</button> &nbsp;
                  <button onClick={() => handleDeleteTask(task.id)}>Delete Task</button>
                </center>
                <div className="feedback-section">
                  <h4>Want to leave a feedback?</h4>
                  <input
                    type="text"
                    placeholder="Feedback"
                    value={feedbackInputs[task.id] || ''}
                    onChange={(e) => handleFeedbackInputChange(task.id, e.target.value)}
                  /> &nbsp;
                  <button onClick={() => handleSubmitFeedback(task.id)}>Submit Feedback</button>
                </div>
                {task.feedback && (
                  <div className="feedback-list">
                    <h5>Feedbacks:</h5>
                    {task.feedback.map(fb => (
                      <i> <p key={fb.id}><strong>{fb.username}:</strong> {fb.feedback_text}</p></i>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkflowManager;
